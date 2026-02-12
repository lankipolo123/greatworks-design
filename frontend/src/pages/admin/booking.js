// src/pages/admin/booking.js
import { LitElement, html, css } from 'lit';
import '/src/components/calendar-component.js';
import '/src/components/booking-sidebar.js';
import '/src/components/today-btn.js';
import '/src/components/content-card.js';
import '/src/components/pagination.js';
import '/src/components/floating-action-button.js';
import '/src/components/app-dialog.js';
import '/src/components/app-button.js';
import '/src/components/book-someone-form.js';
import '/src/components/create-room-form.js';
import '/src/components/badge-component.js';
import '/src/layouts/calendar-section.js';
import '/src/layouts/calendar-sidebar-section.js';
import { bookingFabOptions } from '/src/configs/fab-options-config.js';
import { toast } from '/src/service/toast-widget.js';
import { toastSpamProtection } from '/src/utility/toast-anti-spam.js';
import { getTotalPages } from '/src/utility/pagination-helpers.js';
import { bookings, rooms } from '/src/service/api.js';
import { appState } from '/src/utility/app-state.js';

class AdminBooking extends LitElement {
  static properties = {
    allBookings: { type: Array },
    selectedDate: { type: String },
    selectedBookings: { type: Array },
    sidebarOpen: { type: Boolean },
    selectedRoomType: { type: String },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    totalPages: { type: Number },
    branches: { type: Array },
    selectedBranch: { type: String },
    showBookDialog: { type: Boolean },
    showRoomDialog: { type: Boolean },
    showExportDialog: { type: Boolean },
    showDetailsDialog: { type: Boolean },
    showEditDialog: { type: Boolean },
    showDeleteDialog: { type: Boolean },
    selectedBooking: { type: Object },
    roomImagePreview: { type: String },
    bookLoading: { type: Boolean },
    roomLoading: { type: Boolean },
    editLoading: { type: Boolean },
    deleteLoading: { type: Boolean },
    slotInfo: { type: Object },
    slotLoading: { type: Boolean },
    roomsList: { type: Array },
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

    .toggle-btn {
      background: #302d30;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .toggle-btn:hover {
      text-decoration: underline;
      background: #383438;
      color: #ffffff;
      transform: translateY(-1px);
    }

    floating-action-button {
      display: contents;
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

    .details-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #e0e0e0;
    }

    .delete-warning {
      text-align: center;
      padding: 1rem 0;
    }

    .delete-warning p {
      font-size: 0.9rem;
      color: #333;
      margin: 0 0 0.5rem;
    }

    .delete-warning .booking-id {
      font-weight: 700;
      color: #721c24;
    }

    .delete-actions {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 1rem;
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
    this.sidebarOpen = savedState === 'true' ? true : false;

    this.selectedRoomType = 'all';
    this.currentPage = 1;
    this.itemsPerPage = 5;
    this.totalPages = getTotalPages(this.selectedBookings.length, this.itemsPerPage);

    this.branches = [
      { value: 'all', label: 'All Branches' },
      { value: 'branch1', label: 'Branch 1' },
    ];
    this.selectedBranch = 'all';

    // Dialog states
    this.showBookDialog = false;
    this.showRoomDialog = false;
    this.showExportDialog = false;
    this.showDetailsDialog = false;
    this.showEditDialog = false;
    this.showDeleteDialog = false;
    this.selectedBooking = null;
    this.roomImagePreview = null;
    this.bookLoading = false;
    this.roomLoading = false;
    this.editLoading = false;
    this.deleteLoading = false;

    // Slot info
    this.slotInfo = null;
    this.slotLoading = false;
    this._lastBookTime = 0;

    // Rooms list for dropdowns
    this.roomsList = [];

    this._loadBookings();
    this._loadRooms();
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsub = appState.on('data-changed', () => {
      this._loadBookings();
      this._loadRooms();
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

      // Re-filter for selected date if any
      if (this.selectedDate) {
        this.selectedBookings = this.allBookings.filter(b => b.date === this.selectedDate);
        this.totalPages = getTotalPages(this.selectedBookings.length, this.itemsPerPage);
        localStorage.setItem('booking-selected-bookings', JSON.stringify(this.selectedBookings));
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
      console.warn('Could not load rooms:', e.message || e);
      this.roomsList = [];
    }
  }

  _mapApiBooking(b) {
    return {
      id: b.id,
      userId: b.user?.name || b.user?.email || `User #${b.user_id}`,
      userName: b.user?.name || '',
      userEmail: b.user?.email || '',
      roomId: b.room_id,
      roomName: b.room?.name || `Room #${b.room_id}`,
      roomType: b.room?.type || '',
      roomCapacity: b.room?.capacity || 0,
      date: typeof b.date === 'string' ? b.date.split('T')[0] : b.date,
      startTime: typeof b.start_time === 'string' ? b.start_time.substring(0, 5) : b.start_time,
      time: typeof b.start_time === 'string' ? b.start_time.substring(0, 5) : b.start_time,
      durationHours: b.duration_hours,
      guests: b.guests,
      status: b.status,
      notes: b.notes || '',
      user_id: b.user_id,
      room_id: b.room_id,
    };
  }

  get paginatedBookings() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.selectedBookings.slice(start, start + this.itemsPerPage);
  }

  get filteredBookings() {
    if (this.selectedRoomType === 'all') {
      return this.selectedBookings;
    }
    return this.selectedBookings.filter(b => b.roomType === this.selectedRoomType);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    localStorage.setItem('booking-sidebar-open', this.sidebarOpen.toString());
  }

  handleBranchChange(e) {
    this.selectedBranch = e.detail.branch;
  }

  handleDayClick(e) {
    const { date, bookings: dayBookings } = e.detail;
    this.selectedDate = date;

    // Filter from allBookings for the selected date
    this.selectedBookings = this.allBookings.filter(b => b.date === date);

    this.currentPage = 1;
    this.totalPages = getTotalPages(this.selectedBookings.length, this.itemsPerPage);

    localStorage.setItem('booking-selected-date', date);
    localStorage.setItem('booking-selected-bookings', JSON.stringify(this.selectedBookings));

    if (this.selectedBookings.length === 0) {
      toastSpamProtection.handleToast(
        date,
        () => toast.info('No bookings on this date'),
        () => toast.warning('Please don\'t spam! Wait a moment before clicking again.', 6000)
      );
    } else {
      if (!this.sidebarOpen) {
        this.sidebarOpen = true;
        localStorage.setItem('booking-sidebar-open', 'true');
      }
    }
  }

  handleBookingSelect(e) {
    const { booking } = e.detail;
    this.selectedBooking = booking;
    this.showDetailsDialog = true;
  }

  handleRoomTypeChange(e) {
    this.selectedRoomType = e.detail.roomType;
    this.currentPage = 1;
    const filtered = this.filteredBookings;
    this.totalPages = getTotalPages(filtered.length, this.itemsPerPage);
  }

  handlePageChange(e) {
    this.currentPage = e.detail.page;
  }

  handleTodayClick() {
    const calendar = this.shadowRoot.querySelector('booking-calendar');
    if (calendar) {
      const now = new Date();
      calendar.month = now.getMonth();
      calendar.year = now.getFullYear();
    }
  }

  handleFabAction(e) {
    const { action } = e.detail;

    if (action === 'book-someone') {
      this.slotInfo = null;
      this.showBookDialog = true;
      toast.success('Opening booking form...');
    } else if (action === 'create-room') {
      this.showRoomDialog = true;
      toast.success('Opening room creation form...');
    }
  }

  handleExportSelect(e) {
    const { format, fromDate, toDate } = e.detail;
    console.log('Export bookings:', { format, fromDate, toDate });
    toast.success(`Exporting as ${format.toUpperCase()}...`);
    this.showExportDialog = false;
  }

  handleRoomImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.roomImagePreview = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async handleBookSomeoneSubmit(e) {
    e.preventDefault();

    // Anti-spam: 10s cooldown after last successful booking
    const now = Date.now();
    if (now - this._lastBookTime < 10000) {
      const remaining = Math.ceil((10000 - (now - this._lastBookTime)) / 1000);
      toast.warning(`Please wait ${remaining}s before creating another booking.`);
      return;
    }

    this.bookLoading = true;

    const form = this.shadowRoot.querySelector('#book-dialog book-someone-form')?.shadowRoot?.getElementById('book-form')
      || e.target;

    const formData = new FormData(form);
    const data = {
      user_id: formData.get('userId') || formData.get('user_id'),
      room_id: formData.get('roomId') || formData.get('room_id'),
      date: formData.get('date'),
      start_time: formData.get('time'),
      duration_hours: parseInt(formData.get('duration') || '1'),
      guests: parseInt(formData.get('guests') || '1'),
      notes: formData.get('notes') || ''
    };

    try {
      await bookings.create(data);
      this._lastBookTime = Date.now();
      toast.success('Booking created successfully!');
      this.showBookDialog = false;
      await this._loadBookings();
    } catch (err) {
      if (err.status === 422 && err.message?.includes('slots')) {
        toast.error(`Not enough slots! Available: ${err.available_slots || 0}, Requested: ${data.guests}`);
      } else {
        toast.error(err.message || 'Failed to create booking');
      }
    } finally {
      this.bookLoading = false;
    }
  }

  async handleCreateRoomSubmit(e) {
    e.preventDefault();
    this.roomLoading = true;

    const form = this.shadowRoot.querySelector('#room-dialog create-room-form')?.shadowRoot?.getElementById('room-form')
      || e.target;

    const formData = new FormData(form);
    const amenities = formData.getAll('amenities');

    const data = {
      name: formData.get('roomName'),
      type: formData.get('roomType'),
      capacity: parseInt(formData.get('capacity') || '1'),
      price_per_hour: parseFloat(formData.get('pricePerHour') || '0'),
      floor: formData.get('floor') || null,
      location: formData.get('location') || null,
      amenities: amenities,
      description: formData.get('description') || null,
    };

    try {
      await rooms.create(data);
      toast.success('Room created successfully!');
      this.showRoomDialog = false;
      this.roomImagePreview = null;
      await this._loadRooms();
    } catch (err) {
      toast.error(err.message || 'Failed to create room');
    } finally {
      this.roomLoading = false;
    }
  }

  // ── Edit booking ──
  handleEditClick() {
    this.showDetailsDialog = false;
    this.slotInfo = null;
    this.showEditDialog = true;
  }

  async handleEditSubmit(e) {
    e.preventDefault();
    if (!this.selectedBooking) return;
    this.editLoading = true;

    const form = this.shadowRoot.querySelector('#edit-dialog book-someone-form')?.shadowRoot?.getElementById('book-form')
      || e.target;

    const formData = new FormData(form);
    const data = {};

    const roomId = formData.get('roomId') || formData.get('room_id');
    if (roomId) data.room_id = parseInt(roomId);

    const date = formData.get('date');
    if (date) data.date = date;

    const time = formData.get('time');
    if (time) data.start_time = time;

    const duration = formData.get('duration');
    if (duration) data.duration_hours = parseInt(duration);

    const guests = formData.get('guests');
    if (guests) data.guests = parseInt(guests);

    const notes = formData.get('notes');
    if (notes !== null && notes !== undefined) data.notes = notes;

    const bookingId = this.selectedBooking.id;

    try {
      await bookings.update(bookingId, data);
      toast.success('Booking updated successfully!');
      this.showEditDialog = false;
      this.selectedBooking = null;
      await this._loadBookings();
    } catch (err) {
      if (err.status === 422 && err.message?.includes('slots')) {
        toast.error(`Not enough slots! Available: ${err.available_slots || 0}`);
      } else {
        toast.error(err.message || 'Failed to update booking');
      }
    } finally {
      this.editLoading = false;
    }
  }

  // ── Delete booking ──
  handleDeleteClick() {
    this.showDetailsDialog = false;
    this.showDeleteDialog = true;
  }

  async handleDeleteConfirm() {
    if (!this.selectedBooking) return;
    this.deleteLoading = true;

    const bookingId = this.selectedBooking.id;

    try {
      await bookings.delete(bookingId);
      toast.success('Booking deleted successfully!');
      this.showDeleteDialog = false;
      this.selectedBooking = null;
      await this._loadBookings();
    } catch (err) {
      toast.error(err.message || 'Failed to delete booking');
    } finally {
      this.deleteLoading = false;
    }
  }

  // ── Status change ──
  async handleStatusChange(newStatus) {
    if (!this.selectedBooking) return;

    try {
      await bookings.update(this.selectedBooking.id, { status: newStatus });
      toast.success(`Booking ${newStatus} successfully!`);
      this.showDetailsDialog = false;
      this.selectedBooking = null;
      await this._loadBookings();
    } catch (err) {
      toast.error(err.message || `Failed to ${newStatus} booking`);
    }
  }

  // ── Slot availability check ──
  async checkAvailability(roomId, date, startTime, durationHours) {
    if (!roomId || !date || !startTime || !durationHours) {
      this.slotInfo = null;
      return;
    }

    this.slotLoading = true;
    try {
      const result = await bookings.getAvailability({
        room_id: roomId,
        date: date,
        start_time: startTime,
        duration_hours: durationHours
      });
      this.slotInfo = result;
    } catch (err) {
      this.slotInfo = null;
    } finally {
      this.slotLoading = false;
    }
  }

  handleCancelDialog() {
    this.showBookDialog = false;
    this.showRoomDialog = false;
    this.showEditDialog = false;
    this.showDeleteDialog = false;
    this.roomImagePreview = null;
    this.slotInfo = null;
  }

  handleDialogClose() {
    this.showBookDialog = false;
    this.showRoomDialog = false;
    this.showExportDialog = false;
    this.showDetailsDialog = false;
    this.showEditDialog = false;
    this.showDeleteDialog = false;
    this.roomImagePreview = null;
    this.slotInfo = null;
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
          <span class="detail-label">User</span>
          <span class="detail-value">${b.userName || b.userId}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Room</span>
          <span class="detail-value">${b.roomName}</span>
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
      <div class="details-actions">
        ${b.status === 'pending' ? html`
          <app-button type="success" size="small" @click=${() => this.handleStatusChange('confirmed')}>
            Confirm
          </app-button>
          <app-button type="warning" size="small" @click=${() => this.handleStatusChange('cancelled')}>
            Cancel Booking
          </app-button>
        ` : ''}
        ${b.status === 'confirmed' ? html`
          <app-button type="success" size="small" @click=${() => this.handleStatusChange('completed')}>
            Complete
          </app-button>
          <app-button type="warning" size="small" @click=${() => this.handleStatusChange('cancelled')}>
            Cancel Booking
          </app-button>
        ` : ''}
        <app-button type="secondary" size="small" @click=${this.handleEditClick}>
          Edit
        </app-button>
        <app-button type="danger" size="small" @click=${this.handleDeleteClick}>
          Delete
        </app-button>
      </div>
    `;
  }

  render() {
    return html`
      <content-card mode="3">
        <calendar-section>
          <booking-calendar
            .reservations=${this.allBookings.filter(b => b.status === 'confirmed' || b.status === 'pending')}
            .selectedDate=${this.selectedDate}
            .branches=${this.branches}
            .selectedBranch=${this.selectedBranch}
            @day-click=${this.handleDayClick}
            @branch-change=${this.handleBranchChange}>

            <today-button
              slot="today-btn"
              @today-click=${this.handleTodayClick}>
            </today-button>
            <button
              slot="controls"
              class="toggle-btn"
              @click=${this.toggleSidebar}>
              ${this.sidebarOpen ? 'X' : 'Details'}
            </button>
          </booking-calendar>
        </calendar-section>

        <sidebar-section class="${this.sidebarOpen ? '' : 'closed'}">
          <booking-sidebar
            .selectedDate=${this.selectedDate}
            .bookings=${this.paginatedBookings}
            .selectedRoomType=${this.selectedRoomType}
            @booking-select=${this.handleBookingSelect}
            @room-type-change=${this.handleRoomTypeChange}>
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

      <floating-action-button
        .options=${bookingFabOptions}
        @fab-option-click=${this.handleFabAction}>
      </floating-action-button>

      <!-- Create Booking Dialog -->
      <app-dialog
        id="book-dialog"
        .isOpen=${this.showBookDialog}
        title="Book Someone"
        description="Fill in the booking details"
        size="large"
        styleMode="compact"
        .closeOnOverlay=${false}
        .hideFooter=${true}
        @dialog-close=${this.handleDialogClose}>
        <book-someone-form>
          ${this._renderSlotInfo()}
          <app-button slot="actions" type="warning" size="medium" @click=${this.handleCancelDialog} ?disabled=${this.bookLoading}>
            Cancel
          </app-button>
          <app-button slot="actions" type="primary" size="medium" @click=${(e) => {
        const form = this.shadowRoot.querySelector('#book-dialog book-someone-form')?.shadowRoot?.getElementById('book-form');
        if (form && form.checkValidity()) {
          this.handleBookSomeoneSubmit(new Event('submit', { cancelable: true, target: form }));
          e.preventDefault();
        } else if (form) {
          form.reportValidity();
        }
      }} ?disabled=${this.bookLoading}>
            ${this.bookLoading ? 'Creating...' : 'Create Booking'}
          </app-button>
        </book-someone-form>
      </app-dialog>

      <!-- Create Room Dialog -->
      <app-dialog
        id="room-dialog"
        .isOpen=${this.showRoomDialog}
        title="Create New Room"
        description="Enter room details and upload image"
        size="large"
        styleMode="compact"
        .closeOnOverlay=${false}
        .hideFooter=${true}
        @dialog-close=${this.handleDialogClose}>
        <create-room-form @change=${(e) => {
        if (e.target.name === 'roomImage') this.handleRoomImageUpload(e);
      }}>
          ${this.roomImagePreview ? html`<img slot="image-preview" src="${this.roomImagePreview}" style="margin-top: 12px; max-width: 100%; max-height: 200px; border-radius: 8px; object-fit: cover;" alt="Room preview" />` : ''}
          <app-button slot="actions" type="warning" size="medium" @click=${this.handleCancelDialog} ?disabled=${this.roomLoading}>
            Cancel
          </app-button>
          <app-button slot="actions" type="primary" size="medium" @click=${(e) => {
        const form = this.shadowRoot.querySelector('#room-dialog create-room-form')?.shadowRoot?.getElementById('room-form');
        if (form && form.checkValidity()) {
          this.handleCreateRoomSubmit(new Event('submit', { cancelable: true, target: form }));
          e.preventDefault();
        } else if (form) {
          form.reportValidity();
        }
      }} ?disabled=${this.roomLoading}>
            ${this.roomLoading ? 'Creating...' : 'Create Room'}
          </app-button>
        </create-room-form>
      </app-dialog>

      <!-- Export Dialog -->
      <app-dialog
        .isOpen=${this.showExportDialog}
        title="Export Bookings"
        description="Select export format and date range"
        mode="export"
        size="medium"
        styleMode="clean"
        .closeOnOverlay=${false}
        @export-select=${this.handleExportSelect}
        @dialog-close=${this.handleDialogClose}>
      </app-dialog>

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

      <!-- Edit Booking Dialog -->
      <app-dialog
        id="edit-dialog"
        .isOpen=${this.showEditDialog}
        title="Edit Booking"
        description="Update the booking details"
        size="large"
        styleMode="compact"
        .closeOnOverlay=${false}
        .hideFooter=${true}
        @dialog-close=${this.handleDialogClose}>
        <book-someone-form>
          ${this._renderSlotInfo()}
          <app-button slot="actions" type="warning" size="medium" @click=${this.handleCancelDialog} ?disabled=${this.editLoading}>
            Cancel
          </app-button>
          <app-button slot="actions" type="primary" size="medium" @click=${(e) => {
        const form = this.shadowRoot.querySelector('#edit-dialog book-someone-form')?.shadowRoot?.getElementById('book-form');
        if (form && form.checkValidity()) {
          this.handleEditSubmit(new Event('submit', { cancelable: true, target: form }));
          e.preventDefault();
        } else if (form) {
          form.reportValidity();
        }
      }} ?disabled=${this.editLoading}>
            ${this.editLoading ? 'Updating...' : 'Update Booking'}
          </app-button>
        </book-someone-form>
      </app-dialog>

      <!-- Delete Confirmation Dialog -->
      <app-dialog
        .isOpen=${this.showDeleteDialog}
        title="Delete Booking"
        size="small"
        styleMode="compact"
        .hideFooter=${true}
        .closeOnOverlay=${true}
        @dialog-close=${this.handleDialogClose}>
        <div class="delete-warning">
          <p>Are you sure you want to delete this booking?</p>
          ${this.selectedBooking ? html`
            <p>Booking <span class="booking-id">#${this.selectedBooking.id}</span> for <strong>${this.selectedBooking.userName || this.selectedBooking.userId}</strong></p>
          ` : ''}
          <p style="font-size: 0.75rem; color: #888;">This action cannot be undone.</p>
        </div>
        <div class="delete-actions">
          <app-button type="secondary" size="medium" @click=${this.handleCancelDialog} ?disabled=${this.deleteLoading}>
            Cancel
          </app-button>
          <app-button type="danger" size="medium" @click=${this.handleDeleteConfirm} ?disabled=${this.deleteLoading}>
            ${this.deleteLoading ? 'Deleting...' : 'Delete'}
          </app-button>
        </div>
      </app-dialog>
    `;
  }
}

customElements.define('admin-booking', AdminBooking);
