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
import { hashId } from '@/utility/hash-id.js';
import { bookings, rooms, locations, payments } from '/src/service/api.js';
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
    showPaymentDialog: { type: Boolean },
    showConfirmationDialog: { type: Boolean },
    selectedBooking: { type: Object },
    bookLoading: { type: Boolean },
    _paymentLoading: { type: Boolean, state: true },
    _selectedPaymentMethod: { type: String, state: true },
    _createdBooking: { type: Object, state: true },
    _createdPayment: { type: Object, state: true },
    roomsList: { type: Array },
    slotInfo: { type: Object },
    slotLoading: { type: Boolean },
    locationsList: { type: Array },
    selectedLocation: { type: String },
    selectedBranch: { type: String },
    _loaded: { type: Boolean, state: true },
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

    .details-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1.5px solid #2d2b2b10;
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

    .payment-summary {
      background: #f8f9fa;
      border: 1.5px solid #2d2b2b15;
      border-radius: 8px;
      padding: 0.75rem;
      margin-bottom: 1rem;
    }

    .payment-summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.3rem 0;
      font-size: 0.85rem;
    }

    .payment-summary-row.total {
      border-top: 1.5px solid #2d2b2b15;
      margin-top: 0.3rem;
      padding-top: 0.5rem;
      font-weight: 700;
      font-size: 0.95rem;
    }

    .payment-summary-label {
      color: #666;
    }

    .payment-summary-value {
      color: #1a1a1a;
      font-weight: 600;
    }

    .payment-methods-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #555;
      margin-bottom: 0.5rem;
    }

    .payment-methods {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .payment-method-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0.65rem 0.75rem;
      border: 1.5px solid #2d2b2b20;
      border-radius: 8px;
      background: #fff;
      cursor: pointer;
      font-size: 0.82rem;
      font-weight: 500;
      color: #333;
      transition: all 0.15s;
      font-family: inherit;
    }

    .payment-method-btn:hover {
      border-color: #ffb300;
      background: #fffdf5;
    }

    .payment-method-btn.selected {
      border-color: #ffb300;
      background: #fff8e1;
      font-weight: 600;
    }

    .payment-method-btn .material-symbols-outlined {
      font-size: 1.15rem;
      color: #ffb300;
    }

    .confirmation-content {
      text-align: center;
    }

    .confirmation-icon {
      margin-bottom: 0.5rem;
    }

    .confirmation-title {
      margin: 0 0 0.25rem;
      font-size: 1.05rem;
      color: #1a1a1a;
    }

    .confirmation-subtitle {
      margin: 0 0 1rem;
      font-size: 0.8rem;
      color: #888;
    }

    .reservation-id-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      background: #f0faf0;
      border: 1.5px solid #4caf5040;
      border-radius: 10px;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .reservation-id-label {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      color: #888;
      letter-spacing: 0.05em;
    }

    .reservation-id-value {
      font-size: 1.4rem;
      font-weight: 800;
      color: #2e7d32;
      font-family: monospace;
      letter-spacing: 0.08em;
    }

    .confirmation-details {
      text-align: left;
      background: #f8f9fa;
      border: 1.5px solid #2d2b2b15;
      border-radius: 8px;
      padding: 0.75rem;
      margin-bottom: 1rem;
    }

    .confirmation-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.3rem 0;
      font-size: 0.82rem;
      color: #555;
    }

    .confirmation-row span:last-child {
      font-weight: 600;
      color: #1a1a1a;
    }

    .confirmation-row.total {
      border-top: 1.5px solid #2d2b2b15;
      margin-top: 0.3rem;
      padding-top: 0.5rem;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .confirmation-actions {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
    }

    .receipt-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      margin-bottom: 0.5rem;
    }

    .receipt-header .receipt-brand {
      font-size: 0.95rem;
      font-weight: 700;
      color: #1a1a1a;
      letter-spacing: 0.02em;
    }

    .receipt-header .receipt-date {
      font-size: 0.7rem;
      color: #999;
    }

    .receipt-divider {
      border: none;
      border-top: 1.5px dashed #d0d0d0;
      margin: 0.6rem 0;
    }

    .receipt-method-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.82rem;
      color: #555;
      padding: 0.2rem 0;
    }

    .receipt-method-row span:last-child {
      font-weight: 600;
      color: #1a1a1a;
    }

    .receipt-footer {
      text-align: center;
      font-size: 0.68rem;
      color: #aaa;
      margin-top: 0.6rem;
    }

    .receipt-actions {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }

    .receipt-actions button {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 0.45rem 0.85rem;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s;
      border: 1.5px solid #2d2b2b20;
      background: #f8f9fa;
      color: #333;
    }

    .receipt-actions button:hover {
      background: #eee;
    }

    .receipt-actions button .material-symbols-outlined {
      font-size: 1rem;
    }

    .receipt-actions button.primary-action {
      background: #ffb300;
      color: #fff;
      border-color: #ffb300;
    }

    .receipt-actions button.primary-action:hover {
      background: #ffa000;
    }

    .page-loader {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 300px;
    }

    .spinner {
      width: 36px;
      height: 36px;
      border: 3.5px solid #e0e0e0;
      border-top-color: #ffb300;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
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
    this.showPaymentDialog = false;
    this.showConfirmationDialog = false;
    this.selectedBooking = null;

    this.locationsList = [];
    this.selectedLocation = 'all';
    this.selectedBranch = 'all';

    this.showBookDialog = false;
    this.bookLoading = false;
    this._paymentLoading = false;
    this._selectedPaymentMethod = '';
    this._createdBooking = null;
    this._createdPayment = null;
    this.roomsList = [];
    this.slotInfo = null;
    this.slotLoading = false;
    this._lastBookTime = 0;
    this._loaded = false;

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
    } finally {
      this._loaded = true;
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

  _formatRoomType(type) {
    const labels = {
      co_working: 'Co-Working',
      virtual_offices: 'Virtual Offices',
      private_offices: 'Private Offices',
      events_meeting_room: 'Events & Meeting'
    };
    return labels[type] || type;
  }

  get _roomTypeOptions() {
    const seen = new Set();
    const types = [];
    this.roomsList.forEach(r => {
      if (r.type && !seen.has(r.type)) {
        seen.add(r.type);
        types.push({ value: r.type, label: this._formatRoomType(r.type) });
      }
    });
    return types;
  }

  get branches() {
    return [{ value: 'all', label: 'All Types' }, ...this._roomTypeOptions];
  }

  handleBranchChange(e) {
    this.selectedBranch = e.detail.branch;
  }

  _mapApiBooking(b) {
    return {
      id: b.id,
      userId: b.user?.name || b.user?.email || `User #${b.user_id}`,
      userName: b.user?.name || '',
      roomName: b.room?.name || `Room #${b.room_id}`,
      roomType: b.room?.type || '',
      locationId: b.room?.location_id ? String(b.room.location_id) : null,
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
    this.showPaymentDialog = false;
    this.showConfirmationDialog = false;
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
      const roomId = parseInt(getValue('room_id'));
      const selectedRoom = this.roomsList.find(r => r.id === roomId);

      const res = await bookings.create({
        room_id: roomId,
        date: getValue('date'),
        start_time: getValue('time'),
        duration_hours: parseInt(getValue('duration') || '1'),
        guests: parseInt(getValue('guests') || '1'),
        notes: getValue('notes'),
      });

      this._lastBookTime = Date.now();
      const booking = res.booking || res;
      this._createdBooking = {
        id: booking.id,
        room_id: roomId,
        roomName: selectedRoom?.name || `Room #${roomId}`,
        date: getValue('date'),
        start_time: getValue('time'),
        duration_hours: parseInt(getValue('duration') || '1'),
        guests: parseInt(getValue('guests') || '1'),
        price_per_hour: selectedRoom?.price_per_hour || 0,
      };

      toast.success('Booking created! Please select a payment method.');
      this.showBookDialog = false;
      this.slotInfo = null;
      this._selectedPaymentMethod = '';
      this.showPaymentDialog = true;
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
    const isPending = b.status === 'pending';

    return html`
      <div class="details-content">
        <div class="detail-item">
          <span class="detail-label">Booking ID</span>
          <span class="detail-value">${hashId('BKG', b.id)}</span>
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

      ${isPending ? html`
        <div class="details-actions">
          <app-button type="secondary" size="small" @click=${() => this._handleChangePaymentMethod(b)}>
            <span class="material-symbols-outlined" style="font-size:1rem;vertical-align:middle;margin-right:4px;">swap_horiz</span>
            Change Payment Method
          </app-button>
        </div>
      ` : ''}
    `;
  }

  _handleChangePaymentMethod(booking) {
    const selectedRoom = this.roomsList.find(r => r.name === booking.roomName);
    this._createdBooking = {
      id: booking.id,
      room_id: selectedRoom?.id || null,
      roomName: booking.roomName,
      date: booking.date,
      start_time: booking.startTime || booking.time,
      duration_hours: booking.durationHours,
      guests: booking.guests,
      price_per_hour: selectedRoom?.price_per_hour || 0,
    };
    this._selectedPaymentMethod = '';
    this.showDetailsDialog = false;
    this.showPaymentDialog = true;
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

  // ── Payment Flow ──
  _getBookingTotal() {
    if (!this._createdBooking) return 0;
    return (this._createdBooking.price_per_hour || 0) * (this._createdBooking.duration_hours || 1);
  }

  handlePaymentMethodSelect(method) {
    this._selectedPaymentMethod = method;
  }

  async handlePaymentConfirm() {
    if (!this._selectedPaymentMethod || !this._createdBooking) return;
    this._paymentLoading = true;

    try {
      const res = await payments.create({
        booking_id: this._createdBooking.id,
        amount: this._getBookingTotal(),
        currency: 'PHP',
        method: this._selectedPaymentMethod,
      });

      this._createdPayment = res.payment || res;
      this.showPaymentDialog = false;

      if (this._selectedPaymentMethod === 'cash') {
        toast.success('Please proceed to the counter to complete your payment.');
      } else {
        toast.success('Payment successful! Your booking is confirmed.');
        await this._loadBookings();
        appState.emit('data-changed');
      }
      // Show receipt for all payment methods
      this.showConfirmationDialog = true;
    } catch (err) {
      toast.error(err.message || 'Failed to record payment');
    } finally {
      this._paymentLoading = false;
    }
  }

  handleConfirmationDone() {
    this.showConfirmationDialog = false;
    this._createdBooking = null;
    this._createdPayment = null;
    this._selectedPaymentMethod = '';
    this._loadBookings();
  }

  _renderPaymentDialog() {
    const b = this._createdBooking;
    if (!b) return '';
    const total = this._getBookingTotal();
    const methods = [
      { key: 'gcash', label: 'GCash', icon: 'account_balance_wallet' },
      { key: 'cash', label: 'Cash (Pay at Counter)', icon: 'payments' },
      { key: 'debit_card', label: 'Debit Card', icon: 'credit_card' },
      { key: 'bank_transfer', label: 'Bank Transfer', icon: 'account_balance' },
    ];

    return html`
      <div class="payment-summary">
        <div class="payment-summary-row">
          <span class="payment-summary-label">Room</span>
          <span class="payment-summary-value">${b.roomName}</span>
        </div>
        <div class="payment-summary-row">
          <span class="payment-summary-label">Duration</span>
          <span class="payment-summary-value">${b.duration_hours}h</span>
        </div>
        <div class="payment-summary-row">
          <span class="payment-summary-label">Rate</span>
          <span class="payment-summary-value">${Number(b.price_per_hour).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}/hr</span>
        </div>
        <div class="payment-summary-row total">
          <span class="payment-summary-label">Total</span>
          <span class="payment-summary-value">${Number(total).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
        </div>
      </div>

      <div class="payment-methods-label">Select Payment Method</div>
      <div class="payment-methods">
        ${methods.map(m => html`
          <button
            class="payment-method-btn ${this._selectedPaymentMethod === m.key ? 'selected' : ''}"
            @click=${() => this.handlePaymentMethodSelect(m.key)}>
            <span class="material-symbols-outlined">${m.icon}</span>
            <span>${m.label}</span>
          </button>
        `)}
      </div>

      <div class="form-actions">
        <app-button type="secondary" size="small" @click=${this.handleDialogClose} ?disabled=${this._paymentLoading}>
          Cancel
        </app-button>
        <app-button type="primary" size="small"
          @click=${() => this.handlePaymentConfirm()}
          ?disabled=${!this._selectedPaymentMethod || this._paymentLoading}>
          ${this._paymentLoading ? 'Processing...' : 'Confirm Payment'}
        </app-button>
      </div>
    `;
  }

  _getPaymentMethodLabel(method) {
    const labels = {
      gcash: 'GCash',
      cash: 'Cash - Pay at Counter',
      debit_card: 'Debit Card',
      bank_transfer: 'Bank Transfer',
    };
    return labels[method] || method;
  }

  _isCashPayment() {
    return this._selectedPaymentMethod === 'cash';
  }

  _renderConfirmationDialog() {
    const b = this._createdBooking;
    if (!b) return '';
    const total = this._getBookingTotal();
    const isCash = this._isCashPayment();
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });

    return html`
      <div class="confirmation-content">
        <div class="confirmation-icon">
          <span class="material-symbols-outlined" style="font-size:48px;color:#4caf50;">check_circle</span>
        </div>

        <div class="receipt-header">
          <span class="receipt-brand">GreatWorks</span>
          <span class="receipt-date">${dateStr} at ${timeStr}</span>
        </div>

        <h3 class="confirmation-title">${isCash ? 'Booking Reserved' : 'Booking Confirmed'}</h3>
        <p class="confirmation-subtitle">
          ${isCash
            ? 'Present this receipt at the front desk to complete your payment.'
            : 'Your booking has been confirmed. Save this receipt for your records.'}
        </p>

        <div class="reservation-id-card">
          <span class="reservation-id-label">Reservation ID</span>
          <span class="reservation-id-value">${hashId('BKG', b.id)}</span>
        </div>

        <div class="confirmation-details">
          <div class="confirmation-row">
            <span>Room</span>
            <span>${b.roomName}</span>
          </div>
          <div class="confirmation-row">
            <span>Date</span>
            <span>${b.date ? new Date(b.date).toLocaleDateString() : '-'}</span>
          </div>
          <div class="confirmation-row">
            <span>Time</span>
            <span>${b.start_time}</span>
          </div>
          <div class="confirmation-row">
            <span>Duration</span>
            <span>${b.duration_hours}h</span>
          </div>
          <div class="confirmation-row">
            <span>Guests</span>
            <span>${b.guests}</span>
          </div>

          <hr class="receipt-divider" />

          <div class="receipt-method-row">
            <span>Payment Method</span>
            <span>${this._getPaymentMethodLabel(this._selectedPaymentMethod)}</span>
          </div>
          <div class="receipt-method-row">
            <span>Status</span>
            <span>${isCash ? 'Pending Payment' : 'Paid'}</span>
          </div>
          <div class="confirmation-row total">
            <span>${isCash ? 'Amount Due' : 'Amount Paid'}</span>
            <span>${Number(total).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
          </div>
        </div>

        <div class="receipt-footer">
          This serves as your official booking receipt.
        </div>

        <div class="receipt-actions">
          <button @click=${() => this._downloadReceipt()}>
            <span class="material-symbols-outlined">download</span>
            Download
          </button>
          <button @click=${() => this._printReceipt()}>
            <span class="material-symbols-outlined">print</span>
            Print
          </button>
          <button class="primary-action" @click=${() => this.handleConfirmationDone()}>
            Done
          </button>
        </div>
      </div>
    `;
  }

  _buildReceiptHTML() {
    const b = this._createdBooking;
    if (!b) return '';
    const total = this._getBookingTotal();
    const isCash = this._isCashPayment();
    const reservationId = hashId('BKG', b.id);
    const now = new Date();
    const issuedDate = now.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
    const issuedTime = now.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
    const totalFormatted = Number(total).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });

    return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Booking Receipt - ${reservationId}</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 400px; margin: 40px auto; padding: 24px; color: #1a1a1a; }
  .header { text-align: center; margin-bottom: 16px; }
  .brand { font-size: 1.3rem; font-weight: 700; }
  .date { font-size: 0.75rem; color: #999; }
  .title { text-align: center; font-size: 1rem; font-weight: 600; margin: 8px 0 4px; }
  .subtitle { text-align: center; font-size: 0.78rem; color: #888; margin: 0 0 16px; }
  .id-card { text-align: center; background: #f0faf0; border: 1.5px solid #4caf5040; border-radius: 10px; padding: 14px; margin-bottom: 16px; }
  .id-label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: #888; letter-spacing: 0.05em; display: block; }
  .id-value { font-size: 1.4rem; font-weight: 800; color: #2e7d32; font-family: monospace; letter-spacing: 0.08em; }
  .details { background: #f8f9fa; border: 1.5px solid #e0e0e0; border-radius: 8px; padding: 12px; margin-bottom: 12px; }
  .row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 0.85rem; }
  .row .label { color: #555; }
  .row .value { font-weight: 600; }
  .divider { border: none; border-top: 1.5px dashed #d0d0d0; margin: 8px 0; }
  .total { border-top: 1.5px solid #e0e0e0; margin-top: 6px; padding-top: 8px; font-weight: 700; font-size: 0.95rem; }
  .footer { text-align: center; font-size: 0.7rem; color: #aaa; margin-top: 16px; }
  @media print { body { margin: 0; } }
</style></head><body>
  <div class="header">
    <div class="brand">GreatWorks</div>
    <div class="date">${issuedDate} at ${issuedTime}</div>
  </div>
  <div class="title">${isCash ? 'Booking Reserved' : 'Booking Confirmed'}</div>
  <p class="subtitle">${isCash ? 'Present this receipt at the front desk to complete your payment.' : 'Your booking has been confirmed.'}</p>
  <div class="id-card">
    <span class="id-label">Reservation ID</span>
    <span class="id-value">${reservationId}</span>
  </div>
  <div class="details">
    <div class="row"><span class="label">Room</span><span class="value">${b.roomName}</span></div>
    <div class="row"><span class="label">Date</span><span class="value">${b.date ? new Date(b.date).toLocaleDateString() : '-'}</span></div>
    <div class="row"><span class="label">Time</span><span class="value">${b.start_time}</span></div>
    <div class="row"><span class="label">Duration</span><span class="value">${b.duration_hours}h</span></div>
    <div class="row"><span class="label">Guests</span><span class="value">${b.guests}</span></div>
    <hr class="divider" />
    <div class="row"><span class="label">Payment</span><span class="value">${this._getPaymentMethodLabel(this._selectedPaymentMethod)}</span></div>
    <div class="row"><span class="label">Status</span><span class="value">${isCash ? 'Pending Payment' : 'Paid'}</span></div>
    <div class="row total"><span class="label">${isCash ? 'Amount Due' : 'Amount Paid'}</span><span class="value">${totalFormatted}</span></div>
  </div>
  <div class="footer">This serves as your official booking receipt.</div>
</body></html>`;
  }

  _downloadReceipt() {
    const html = this._buildReceiptHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-receipt-${hashId('BKG', this._createdBooking.id)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Receipt downloaded!');
  }

  _printReceipt() {
    const html = this._buildReceiptHTML();
    const win = window.open('', '_blank', 'width=450,height=600');
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      win.print();
    } else {
      toast.error('Unable to open print window. Please allow popups.');
    }
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
    if (!this._loaded) {
      return html`<div class="page-loader"><div class="spinner"></div></div>`;
    }

    return html`
      <content-card mode="3">
        <calendar-section>
          <booking-calendar
            .reservations=${this.allBookings
              .filter(b => b.status === 'confirmed' || b.status === 'pending')
              .filter(b => this.selectedBranch === 'all' || b.roomType === this.selectedBranch)
              .filter(b => this.selectedLocation === 'all' || b.locationId === this.selectedLocation)}
            .selectedDate=${this.selectedDate}
            .branches=${this.branches}
            .selectedBranch=${this.selectedBranch}
            .locations=${this._locationDropdownOptions}
            .selectedLocation=${this.selectedLocation}
            @day-click=${this.handleDayClick}
            @branch-change=${this.handleBranchChange}
            @location-change=${this.handleLocationChange}>
          </booking-calendar>
        </calendar-section>

        <sidebar-section class="${this.sidebarOpen ? '' : 'closed'}">
          <booking-sidebar
            .selectedDate=${this.selectedDate}
            .bookings=${this.paginatedBookings}
            .selectedRoomType=${this.selectedRoomType}
            .roomTypes=${this._roomTypeOptions}
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

      <!-- Payment Method Dialog -->
      <app-dialog
        .isOpen=${this.showPaymentDialog}
        title="Payment"
        description="Choose how you'd like to pay"
        size="medium"
        styleMode="compact"
        .closeOnOverlay=${false}
        .hideFooter=${true}
        @dialog-close=${this.handleDialogClose}>
        ${this._renderPaymentDialog()}
      </app-dialog>

      <!-- Booking Receipt Dialog -->
      <app-dialog
        .isOpen=${this.showConfirmationDialog}
        title="Booking Receipt"
        size="small"
        styleMode="compact"
        .closeOnOverlay=${false}
        .hideFooter=${true}
        @dialog-close=${() => this.handleConfirmationDone()}>
        ${this._renderConfirmationDialog()}
      </app-dialog>
    `;
  }
}

customElements.define('customer-booking', CustomerBooking);
