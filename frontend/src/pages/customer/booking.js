// customer-booking.js
import { LitElement, html, css } from 'lit';
import '/src/components/calendar-component.js';
import '/src/components/booking-sidebar.js';
import '/src/components/content-card.js';
import '/src/components/pagination.js';
import '/src/components/app-dialog.js';
import '/src/components/app-button.js';
import '/src/components/badge-component.js';
import '/src/layouts/calendar-section.js';
import '/src/layouts/calendar-sidebar-section.js';
import { toast } from '/src/service/toast-widget.js';
import { toastSpamProtection } from '/src/utility/toast-anti-spam.js';
import { getTotalPages } from '/src/utility/pagination-helpers.js';
import { bookings, rooms, locations } from '/src/service/api.js';
import { appState } from '/src/utility/app-state.js';

class CustomerBooking extends LitElement {
  static properties = {
    allBookings: { type: Array },
    selectedDate: { type: String },
    selectedBookings: { type: Array },
    sidebarOpen: { type: Boolean },
    selectedRoomType: { type: String },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    totalPages: { type: Number },
    showDetailsDialog: { type: Boolean },
    showBookDialog: { type: Boolean },
    selectedBooking: { type: Object },
    bookLoading: { type: Boolean },
    roomsList: { type: Array },
    slotInfo: { type: Object },
    slotLoading: { type: Boolean },
    locationsList: { type: Array },
    selectedLocation: { type: String },
  };

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      box-sizing: border-box;
      background: #ffffff;
      position: relative;
    }

    content-card {
      gap: 1.5rem;
    }

    .details-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .detail-item.full {
      grid-column: 1 / -1;
    }

    .detail-label {
      font-size: 0.7rem;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .detail-value {
      font-size: 0.85rem;
      font-weight: 500;
      color: #1a1a1a;
    }

    .slot-info {
      background: #f8f9fa;
      border: 1.5px solid #2d2b2b25;
      border-radius: 8px;
      padding: 0.75rem;
      margin-top: 0.5rem;
      font-size: 0.8rem;
    }

    .slot-info .slot-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.35rem;
    }

    .slot-info .slot-row:last-child {
      margin-bottom: 0;
    }

    .slot-info .slot-label {
      font-weight: 500;
      color: #555;
    }

    .slot-info .slot-value {
      font-weight: 700;
    }

    .slot-info .slot-value.available {
      color: #155724;
    }

    .slot-info .slot-value.full {
      color: #721c24;
    }

    .slot-info .slot-loading {
      text-align: center;
      color: #888;
      font-style: italic;
    }

    .book-form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .book-form .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .book-form .form-group.full {
      grid-column: 1 / -1;
    }

    .book-form label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #555;
    }

    .book-form input,
    .book-form select,
    .book-form textarea {
      padding: 0.5rem;
      border: 1.5px solid #2d2b2b25;
      border-radius: 6px;
      font-size: 0.85rem;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
    }

    .book-form input:focus,
    .book-form select:focus,
    .book-form textarea:focus {
      border-color: #ffb300;
    }

    .book-form textarea {
      min-height: 60px;
      resize: vertical;
    }

    .form-actions {
      grid-column: 1 / -1;
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .submit-btn {
      background: #ffb300;
      color: #fff;
      border: none;
      padding: 0.5rem 1.25rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .submit-btn:hover {
      background: #ffa000;
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .cancel-btn {
      background: #f5f5f5;
      color: #333;
      border: 1.5px solid #2d2b2b25;
      padding: 0.5rem 1.25rem;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.85rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .cancel-btn:hover {
      background: #eee;
    }

    @media (max-width: 1024px) {
      content-card {
        flex-direction: column;
      }
    }
  `;

  constructor() {
    super();
    this.allBookings = [];

    const savedDate = localStorage.getItem('booking-selected-date');
    const savedBookings = localStorage.getItem('booking-selected-bookings');

    this.selectedDate = savedDate || null;
    this.selectedBookings = savedBookings ? JSON.parse(savedBookings) : [];

    const savedState = localStorage.getItem('booking-sidebar-open');
    this.sidebarOpen = savedState !== 'false';

    this.selectedRoomType = 'all';
    this.currentPage = 1;
    this.itemsPerPage = 5;
    this.totalPages = getTotalPages(this.selectedBookings.length, this.itemsPerPage);
    this.showDetailsDialog = false;
    this.selectedBooking = null;

    this.locationsList = [];
    this.selectedLocation = 'all';

    this.showBookDialog = false;
    this.bookLoading = false;
    this.roomsList = [];
    this.slotInfo = null;
    this.slotLoading = false;
    this._lastBookTime = 0;

    this._loadBookings();
    this._loadRooms();
    this._loadLocations();
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsub = appState.on('data-changed', () => {
      this._loadBookings();
      this._loadRooms();
      this._loadLocations();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsub) this._unsub();
  }

  async _loadBookings() {
    try {
      const response = await bookings.getAll({ per_page: 100 });
      const data = response.data || response;
      this.allBookings = (Array.isArray(data) ? data : []).map(b => this._mapApiBooking(b));

      if (this.selectedDate) {
        this.selectedBookings = this.allBookings.filter(b => b.date === this.selectedDate);
        this.totalPages = getTotalPages(this.selectedBookings.length, this.itemsPerPage);
      }
    } catch (e) {
      console.error('Failed to load bookings:', e.message || e);
      this.allBookings = [];
    }
  }

  async _loadRooms() {
    try {
      const response = await rooms.getAll({ per_page: 100 });
      const data = response.data || response;
      this.roomsList = Array.isArray(data) ? data : [];
    } catch (e) {
      this.roomsList = [];
    }
  }

  async _loadLocations() {
    try {
      const response = await locations.getAll({ per_page: 100, status: 'active' });
      const data = response.data || response;
      this.locationsList = Array.isArray(data) ? data : [];
    } catch (e) {
      this.locationsList = [];
    }
  }

  get _locationDropdownOptions() {
    return [
      { value: 'all', label: 'All Locations' },
      ...this.locationsList.map(l => ({ value: String(l.id), label: l.name }))
    ];
  }

  _mapApiBooking(b) {
    return {
      id: b.id,
      userId: b.user?.name || b.user?.email || `User #${b.user_id}`,
      userName: b.user?.name || '',
      roomName: b.room?.name || `Room #${b.room_id}`,
      date: typeof b.date === 'string' ? b.date.split('T')[0] : b.date,
      startTime: typeof b.start_time === 'string' ? b.start_time.substring(0, 5) : b.start_time,
      time: typeof b.start_time === 'string' ? b.start_time.substring(0, 5) : b.start_time,
      durationHours: b.duration_hours,
      guests: b.guests,
      status: b.status,
      notes: b.notes || '',
    };
  }

  get paginatedBookings() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.selectedBookings.slice(start, start + this.itemsPerPage);
  }

  get filteredBookings() {
    if (this.selectedRoomType === 'all') return this.selectedBookings;
    return this.selectedBookings.filter(b => b.roomType === this.selectedRoomType);
  }

  handleSidebarClose() {
    this.sidebarOpen = false;
    localStorage.setItem('booking-sidebar-open', 'false');
  }

  handleLocationChange(e) {
    this.selectedLocation = e.detail.location;
  }

  handleDayClick(e) {
    const { date } = e.detail;
    this.selectedDate = date;
    this.selectedBookings = this.allBookings.filter(b => b.date === date);
    this.currentPage = 1;
    this.totalPages = getTotalPages(this.selectedBookings.length, this.itemsPerPage);

    localStorage.setItem('booking-selected-date', date);
    localStorage.setItem('booking-selected-bookings', JSON.stringify(this.selectedBookings));

    if (!this.sidebarOpen) {
      this.sidebarOpen = true;
      localStorage.setItem('booking-sidebar-open', 'true');
    }

    if (this.selectedBookings.length === 0) {
      toastSpamProtection.handleToast(
        date,
        () => toast.info('No bookings on this date'),
        () => toast.warning('Please don\'t spam! Wait a moment before clicking again.', 6000)
      );
    }
  }

  handleBookingSelect(e) {
    this.selectedBooking = e.detail.booking;
    this.showDetailsDialog = true;
  }

  handleDialogClose() {
    this.showDetailsDialog = false;
    this.showBookDialog = false;
    this.selectedBooking = null;
    this.slotInfo = null;
  }

  handleRoomTypeChange(e) {
    this.selectedRoomType = e.detail.roomType;
    this.currentPage = 1;
    this.totalPages = getTotalPages(this.filteredBookings.length, this.itemsPerPage);
  }

  handlePageChange(e) {
    this.currentPage = e.detail.page;
  }

  // ── Book Now ──
  handleBookNow() {
    // Anti-spam: 10s cooldown after last successful booking
    const now = Date.now();
    if (now - this._lastBookTime < 10000) {
      const remaining = Math.ceil((10000 - (now - this._lastBookTime)) / 1000);
      toastSpamProtection.handleToast(
        'book-now-cooldown',
        () => toast.warning(`Please wait ${remaining}s before booking again.`),
        () => toast.warning('Stop spamming! Please wait before booking again.', 6000)
      );
      return;
    }
    this.slotInfo = null;
    this.showBookDialog = true;
  }

  async checkAvailability(roomId, date, startTime, durationHours) {
    if (!roomId || !date || !startTime || !durationHours) {
      this.slotInfo = null;
      return;
    }
    this.slotLoading = true;
    try {
      this.slotInfo = await bookings.getAvailability({
        room_id: roomId, date, start_time: startTime, duration_hours: durationHours
      });
    } catch { this.slotInfo = null; }
    finally { this.slotLoading = false; }
  }

  async handleBookSubmit() {
    const form = this.shadowRoot.getElementById('customer-book-form');
    if (!form || !form.checkValidity()) {
      form?.reportValidity();
      return;
    }

    // Anti-spam: prevent rapid booking submissions (10s cooldown)
    const now = Date.now();
    const cooldown = 10000;
    if (now - this._lastBookTime < cooldown) {
      const remaining = Math.ceil((cooldown - (now - this._lastBookTime)) / 1000);
      toast.warning(`Please wait ${remaining}s before creating another booking.`);
      return;
    }

    this.bookLoading = true;
    const getValue = (name) => form.querySelector(`[name="${name}"]`)?.value || '';

    try {
      await bookings.create({
        room_id: parseInt(getValue('room_id')),
        date: getValue('date'),
        start_time: getValue('time'),
        duration_hours: parseInt(getValue('duration') || '1'),
        guests: parseInt(getValue('guests') || '1'),
        notes: getValue('notes'),
      });

      this._lastBookTime = Date.now();
      toast.success('Booking created successfully!');
      this.showBookDialog = false;
      this.slotInfo = null;
      await this._loadBookings();
    } catch (err) {
      if (err.status === 422 && err.message?.includes('slots')) {
        toast.error(`Not enough slots! Available: ${err.available_slots || 0}`);
      } else {
        toast.error(err.message || 'Failed to create booking');
      }
    } finally {
      this.bookLoading = false;
    }
  }

  _renderSlotInfo() {
    if (this.slotLoading) {
      return html`<div class="slot-info"><div class="slot-loading">Checking availability...</div></div>`;
    }
    if (!this.slotInfo) return '';
    const isAvailable = this.slotInfo.available_slots > 0;
    return html`
      <div class="slot-info">
        <div class="slot-row">
          <span class="slot-label">Room Capacity</span>
          <span class="slot-value">${this.slotInfo.total_slots}</span>
        </div>
        <div class="slot-row">
          <span class="slot-label">Currently Booked</span>
          <span class="slot-value">${this.slotInfo.booked_slots}</span>
        </div>
        <div class="slot-row">
          <span class="slot-label">Available Slots</span>
          <span class="slot-value ${isAvailable ? 'available' : 'full'}">${this.slotInfo.available_slots}</span>
        </div>
      </div>
    `;
  }

  _renderDetailsDialog() {
    if (!this.selectedBooking) return '';
    const b = this.selectedBooking;

    return html`
      <div class="details-content">
        <div class="detail-item">
          <span class="detail-label">Booking ID</span>
          <span class="detail-value">${b.id}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Status</span>
          <badge-component variant="${b.status}" size="small">${b.status}</badge-component>
        </div>
        <div class="detail-item">
          <span class="detail-label">Room</span>
          <span class="detail-value">${b.roomName || '-'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Date</span>
          <span class="detail-value">${b.date ? new Date(b.date).toLocaleDateString() : '-'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Time</span>
          <span class="detail-value">${b.startTime || b.time}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Duration</span>
          <span class="detail-value">${b.durationHours}h</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Guests</span>
          <span class="detail-value">${b.guests}</span>
        </div>
        ${b.notes ? html`
          <div class="detail-item full">
            <span class="detail-label">Notes</span>
            <span class="detail-value">${b.notes}</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  _renderBookForm() {
    const today = new Date().toISOString().split('T')[0];

    return html`
      <form id="customer-book-form" class="book-form" @submit=${(e) => e.preventDefault()}>
        <div class="form-group">
          <label>Room *</label>
          <select name="room_id" required @change=${() => this._onBookFormChange()}>
            <option value="">Select room</option>
            ${this.roomsList.map(r => html`
              <option value="${r.id}">${r.name} (cap: ${r.capacity})</option>
            `)}
          </select>
        </div>

        <div class="form-group">
          <label>Date *</label>
          <input type="date" name="date" min="${today}" value="${this.selectedDate || today}" required
            @change=${() => this._onBookFormChange()} />
        </div>

        <div class="form-group">
          <label>Time *</label>
          <input type="time" name="time" required @change=${() => this._onBookFormChange()} />
        </div>

        <div class="form-group">
          <label>Duration (hrs) *</label>
          <input type="number" name="duration" value="1" min="1" max="12" required
            @change=${() => this._onBookFormChange()} />
        </div>

        <div class="form-group">
          <label>Guests *</label>
          <input type="number" name="guests" value="1" min="1" required />
        </div>

        <div class="form-group full">
          <label>Notes</label>
          <textarea name="notes" placeholder="Any special requests..."></textarea>
        </div>

        ${this._renderSlotInfo()}

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click=${this.handleDialogClose} ?disabled=${this.bookLoading}>
            Cancel
          </button>
          <button type="button" class="submit-btn" @click=${() => this.handleBookSubmit()} ?disabled=${this.bookLoading}>
            ${this.bookLoading ? 'Creating...' : 'Create Booking'}
          </button>
        </div>
      </form>
    `;
  }

  _onBookFormChange() {
    const form = this.shadowRoot.getElementById('customer-book-form');
    if (!form) return;
    const roomId = form.querySelector('[name="room_id"]')?.value;
    const date = form.querySelector('[name="date"]')?.value;
    const time = form.querySelector('[name="time"]')?.value;
    const duration = form.querySelector('[name="duration"]')?.value;
    this.checkAvailability(roomId, date, time, duration);
  }

  render() {
    return html`
      <content-card mode="3">
        <calendar-section>
          <booking-calendar
            .reservations=${this.allBookings.filter(b => b.status === 'confirmed' || b.status === 'pending')}
            .selectedDate=${this.selectedDate}
            .locations=${this._locationDropdownOptions}
            .selectedLocation=${this.selectedLocation}
            @day-click=${this.handleDayClick}
            @location-change=${this.handleLocationChange}>
          </booking-calendar>
        </calendar-section>

        <sidebar-section class="${this.sidebarOpen ? '' : 'closed'}">
          <booking-sidebar
            .selectedDate=${this.selectedDate}
            .bookings=${this.paginatedBookings}
            .selectedRoomType=${this.selectedRoomType}
            .showBookNow=${true}
            @booking-select=${this.handleBookingSelect}
            @room-type-change=${this.handleRoomTypeChange}
            @sidebar-close=${this.handleSidebarClose}
            @book-now=${this.handleBookNow}>
            <pagination-component
              slot="pagination"
              .currentPage=${this.currentPage}
              .totalPages=${this.totalPages}
              mode="2"
              @pagination-change=${this.handlePageChange}
            ></pagination-component>
          </booking-sidebar>
        </sidebar-section>
      </content-card>

      <!-- Booking Details Dialog -->
      <app-dialog
        .isOpen=${this.showDetailsDialog}
        title="Booking Details"
        size="medium"
        styleMode="compact"
        .hideFooter=${true}
        .closeOnOverlay=${true}
        @dialog-close=${this.handleDialogClose}>
        ${this._renderDetailsDialog()}
      </app-dialog>

      <!-- Create Booking Dialog -->
      <app-dialog
        .isOpen=${this.showBookDialog}
        title="Book a Room"
        description="Select a room, date, and time for your booking"
        size="medium"
        styleMode="compact"
        .closeOnOverlay=${false}
        .hideFooter=${true}
        @dialog-close=${this.handleDialogClose}>
        ${this._renderBookForm()}
      </app-dialog>
    `;
  }
}

customElements.define('customer-booking', CustomerBooking);
