// customer-ticket.js
import { LitElement, html, css } from 'lit';
import { ticketsTableConfig } from '/src/configs/tickets-config';
import { tickets as ticketsApi, bookings, rooms, payments } from '/src/service/api.js';
import { hashId } from '@/utility/hash-id.js';
import { appState } from '/src/utility/app-state.js';
import '@/components/data-table.js';
import '@/components/tabs-component.js';
import '@/components/search-bar.js';
import '@/components/app-dialog.js';
import '@/layouts/header-controls.js';
import '@/layouts/tabs-wrapper.js';
import '@/layouts/search-wrapper.js';
import '@/layouts/search-bar-wrapper.js';
import '@/layouts/pagination-wrapper.js';
import '@/components/pagination.js';
import '@/components/stat-card.js';
import '@/components/app-button.js';
import '@/components/badge-component.js';
import { ICONS } from '/src/components/dashboard-icons.js';
import { getTotalPages } from '@/utility/pagination-helpers.js';
import { toast } from '/src/service/toast-widget.js';

class CustomerTicket extends LitElement {
  static properties = {
    tickets: { type: Array },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    totalPages: { type: Number },
    activeTab: { type: String },
    searchValue: { type: String },
    showTicketDialog: { type: Boolean },
    showCreateDialog: { type: Boolean },
    showBookDialog: { type: Boolean },
    showPaymentDialog: { type: Boolean },
    showConfirmationDialog: { type: Boolean },
    selectedTicket: { type: Object },
    pendingTicketId: { type: Number },
    _loaded: { type: Boolean, state: true },
    _submitting: { type: Boolean, state: true },
    _hasActiveBooking: { type: Boolean, state: true },
    _bookingsLoaded: { type: Boolean, state: true },
    _roomsList: { type: Array, state: true },
    _bookLoading: { type: Boolean, state: true },
    _slotInfo: { type: Object, state: true },
    _slotLoading: { type: Boolean, state: true },
    _paymentLoading: { type: Boolean, state: true },
    _selectedPaymentMethod: { type: String, state: true },
    _createdBooking: { type: Object, state: true },
  };

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      height: 100%;
      box-sizing: border-box;
    }

    .content-card {
      background: white;
      border-radius: 12px;
      padding: 1rem;
      border: 1.25px solid rgba(45, 43, 43, 0.27);
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

    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
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

    .payment-summary-label { color: #666; }
    .payment-summary-value { color: #1a1a1a; font-weight: 600; }

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

    .confirmation-content { text-align: center; }
    .confirmation-icon { margin-bottom: 0.5rem; }

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
  `;

  constructor() {
    super();
    this.tickets = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.activeTab = 'all';
    this.searchValue = '';
    this.showTicketDialog = false;
    this.showCreateDialog = false;
    this.showBookDialog = false;
    this.showPaymentDialog = false;
    this.showConfirmationDialog = false;
    this.selectedTicket = null;
    this.pendingTicketId = null;
    this._loaded = false;
    this._submitting = false;
    this._hasActiveBooking = false;
    this._bookingsLoaded = false;
    this._roomsList = [];
    this._bookLoading = false;
    this._slotInfo = null;
    this._slotLoading = false;
    this._paymentLoading = false;
    this._selectedPaymentMethod = '';
    this._createdBooking = null;
    this._lastBookTime = 0;
    this.tabs = [
      { id: 'all', label: 'All' },
      { id: 'open', label: 'Open' },
      { id: 'in_progress', label: 'In Progress' },
      { id: 'closed', label: 'Closed' }
    ];

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchTickets();
    this._checkActiveBooking();
    this._unsub = appState.on('data-changed', () => {
      this.fetchTickets();
      this._checkActiveBooking();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsub) this._unsub();
  }

  async fetchTickets() {
    try {
      const data = await ticketsApi.getAll({ per_page: 100 });
      this.tickets = data.data || data;
      this.updatePagination();
      this._openPendingTicket();
    } catch (e) {
      console.error('Failed to fetch tickets:', e);
    } finally {
      this._loaded = true;
    }
  }

  async _checkActiveBooking() {
    try {
      const response = await bookings.getAll({ per_page: 100 });
      const data = response.data || response;
      const list = Array.isArray(data) ? data : [];
      this._hasActiveBooking = list.some(
        b => b.status === 'confirmed' || b.status === 'pending' || b.status === 'ongoing'
      );
    } catch (e) {
      this._hasActiveBooking = false;
    } finally {
      this._bookingsLoaded = true;
    }
  }

  async _loadRooms() {
    if (this._roomsList.length) return;
    try {
      const response = await rooms.getAll({ per_page: 100 });
      const data = response.data || response;
      this._roomsList = Array.isArray(data) ? data : [];
    } catch {
      this._roomsList = [];
    }
  }

  updated(changed) {
    super.updated?.(changed);
    if (changed.has('pendingTicketId') && this.pendingTicketId && this.tickets.length) {
      this._openPendingTicket();
    }
  }

  _openPendingTicket() {
    if (!this.pendingTicketId || !this.tickets.length) return;
    const ticket = this.tickets.find(t => t.id === this.pendingTicketId);
    if (ticket) {
      this.selectedTicket = ticket;
      this.showTicketDialog = true;
      this.pendingTicketId = null;
      this.dispatchEvent(new CustomEvent('ticket-opened', { bubbles: true, composed: true }));
    }
  }

  get filteredTickets() {
    let filtered = this.tickets;

    if (this.activeTab !== 'all') {
      filtered = filtered.filter(t => t.status === this.activeTab);
    }

    if (this.searchValue) {
      const search = this.searchValue.toLowerCase();
      filtered = filtered.filter(t =>
        t.id?.toString().includes(search) ||
        t.subject?.toLowerCase().includes(search) ||
        t.status?.toLowerCase().includes(search)
      );
    }

    return filtered;
  }

  get paginatedTickets() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTickets.slice(start, start + this.itemsPerPage);
  }

  updatePagination() {
    this.totalPages = getTotalPages(
      this.filteredTickets.length,
      this.itemsPerPage
    );
  }

  handleTabChange(e) {
    this.activeTab = e.detail.tab;
    this.currentPage = 1;
    this.updatePagination();
  }

  handleSearch(e) {
    this.searchValue = e.detail.value;
    this.currentPage = 1;
    this.updatePagination();
  }

  handleSearchInput(e) {
    this.searchValue = e.detail.value;
    this.currentPage = 1;
    this.updatePagination();
  }

  handleTableAction(e) {
    const { action, item } = e.detail;
    if (action === 'view') {
      this.selectedTicket = item;
      this.showTicketDialog = true;
    }
  }

  handlePageChange(e) {
    this.currentPage = e.detail.page;
  }

  handleDialogClose() {
    this.showTicketDialog = false;
    this.showCreateDialog = false;
    this.showBookDialog = false;
    this.showPaymentDialog = false;
    this.showConfirmationDialog = false;
    this.selectedTicket = null;
    this._slotInfo = null;
  }

  handleRequestTicket() {
    if (!this._hasActiveBooking) {
      toast.warning('Please book a room first before requesting a ticket.');
      this._loadRooms();
      this._slotInfo = null;
      this.showBookDialog = true;
      return;
    }
    this.showCreateDialog = true;
  }

  async handleCreateSubmit(e) {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) return;
    this._submitting = true;
    try {
      await ticketsApi.create({
        subject: form.subject.value,
        message: form.message.value,
      });
      toast.success('Ticket submitted successfully!');
      this.showCreateDialog = false;
      form.reset();
      this.fetchTickets();
    } catch (err) {
      toast.error(err.message || 'Failed to create ticket');
    } finally {
      this._submitting = false;
    }
  }

  // ── Book Now from ticket page ──
  async _checkAvailability(roomId, date, startTime, durationHours) {
    if (!roomId || !date || !startTime || !durationHours) {
      this._slotInfo = null;
      return;
    }
    this._slotLoading = true;
    try {
      this._slotInfo = await bookings.getAvailability({
        room_id: roomId, date, start_time: startTime, duration_hours: durationHours
      });
    } catch { this._slotInfo = null; }
    finally { this._slotLoading = false; }
  }

  _onBookFormChange() {
    const form = this.shadowRoot.getElementById('ticket-book-form');
    if (!form) return;
    const roomId = form.querySelector('[name="room_id"]')?.value;
    const date = form.querySelector('[name="date"]')?.value;
    const time = form.querySelector('[name="time"]')?.value;
    const duration = form.querySelector('[name="duration"]')?.value;
    this._checkAvailability(roomId, date, time, duration);
  }

  async handleBookSubmit() {
    const form = this.shadowRoot.getElementById('ticket-book-form');
    if (!form || !form.checkValidity()) {
      form?.reportValidity();
      return;
    }

    this._bookLoading = true;
    const getValue = (name) => form.querySelector(`[name="${name}"]`)?.value || '';

    try {
      const roomId = parseInt(getValue('room_id'));
      const selectedRoom = this._roomsList.find(r => r.id === roomId);

      const res = await bookings.create({
        room_id: roomId,
        date: getValue('date'),
        start_time: getValue('time'),
        duration_hours: parseInt(getValue('duration') || '1'),
        guests: parseInt(getValue('guests') || '1'),
        notes: getValue('notes'),
      });

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
      this._slotInfo = null;
      this._selectedPaymentMethod = '';
      this.showPaymentDialog = true;
    } catch (err) {
      if (err.status === 422 && err.message?.includes('slots')) {
        toast.error(`Not enough slots! Available: ${err.available_slots || 0}`);
      } else {
        toast.error(err.message || 'Failed to create booking');
      }
    } finally {
      this._bookLoading = false;
    }
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
      await payments.create({
        booking_id: this._createdBooking.id,
        amount: this._getBookingTotal(),
        currency: 'PHP',
        method: this._selectedPaymentMethod,
      });

      this.showPaymentDialog = false;
      this._hasActiveBooking = true;

      if (this._selectedPaymentMethod === 'cash') {
        toast.success('Please proceed to the counter to complete your payment.');
      } else {
        toast.success('Payment successful! You can now request a ticket.');
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
    this._selectedPaymentMethod = '';
    this.showCreateDialog = true;
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
    const receiptHTML = this._buildReceiptHTML();
    const win = window.open('', '_blank', 'width=450,height=600');
    if (win) {
      win.document.write(receiptHTML);
      win.document.close();
      win.focus();
      win.print();
    } else {
      toast.error('Unable to open print window. Please allow popups.');
    }
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

  _renderSlotInfo() {
    if (this._slotLoading) {
      return html`<div class="slot-info"><div class="slot-loading">Checking availability...</div></div>`;
    }
    if (!this._slotInfo) return '';
    const isAvailable = this._slotInfo.available_slots > 0;
    return html`
      <div class="slot-info">
        <div class="slot-row">
          <span class="slot-label">Room Capacity</span>
          <span class="slot-value">${this._slotInfo.total_slots}</span>
        </div>
        <div class="slot-row">
          <span class="slot-label">Currently Booked</span>
          <span class="slot-value">${this._slotInfo.booked_slots}</span>
        </div>
        <div class="slot-row">
          <span class="slot-label">Available Slots</span>
          <span class="slot-value ${isAvailable ? 'available' : 'full'}">${this._slotInfo.available_slots}</span>
        </div>
      </div>
    `;
  }

  _renderBookForm() {
    const today = new Date().toISOString().split('T')[0];

    return html`
      <form id="ticket-book-form" class="book-form" @submit=${(e) => e.preventDefault()}>
        <div class="form-group">
          <label>Room *</label>
          <select name="room_id" required @change=${() => this._onBookFormChange()}>
            <option value="">Select room</option>
            ${this._roomsList.map(r => html`
              <option value="${r.id}">${r.name} (cap: ${r.capacity})</option>
            `)}
          </select>
        </div>

        <div class="form-group">
          <label>Date *</label>
          <input type="date" name="date" min="${today}" value="${today}" required
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
          <app-button type="secondary" size="small" @click=${this.handleDialogClose} ?disabled=${this._bookLoading}>
            Cancel
          </app-button>
          <app-button type="primary" size="small" @click=${() => this.handleBookSubmit()} ?disabled=${this._bookLoading}>
            ${this._bookLoading ? 'Creating...' : 'Create Booking'}
          </app-button>
        </div>
      </form>
    `;
  }

  get _totalCount() { return this.tickets.length; }
  get _openCount() { return this.tickets.filter(t => t.status === 'open').length; }
  get _inProgressCount() { return this.tickets.filter(t => t.status === 'in_progress').length; }
  get _closedCount() { return this.tickets.filter(t => t.status === 'closed').length; }

  render() {
    return html`
      <div class="stats-row">
        <stat-card
          title="Total Tickets"
          textColor="#580460"
          .value=${this._loaded ? this._totalCount : '--'}
          .icon=${ICONS.ticketInbox}>
        </stat-card>
        <stat-card
          title="Open"
          textColor="#0a5e81"
          .value=${this._loaded ? this._openCount : '--'}
          .icon=${ICONS.ticket}>
        </stat-card>
        <stat-card
          title="In Progress"
          textColor="#ffac05"
          .value=${this._loaded ? this._inProgressCount : '--'}
          .icon=${ICONS.clock}>
        </stat-card>
        <stat-card
          title="Closed"
          textColor="#67ab07"
          .value=${this._loaded ? this._closedCount : '--'}
          .icon=${ICONS.chartLine}>
        </stat-card>
      </div>

      <content-card mode="4">
        <header-controls>
          <tabs-wrapper>
            <tabs-component
              .tabs=${this.tabs}
              .activeTab=${this.activeTab}
              variant="primary"
              @tab-change=${this.handleTabChange}>
            </tabs-component>
          </tabs-wrapper>

          <search-wrapper>
            <search-bar-wrapper>
              <search-bar
                placeholder="Search tickets..."
                .value=${this.searchValue}
                .showFilter=${false}
                @search=${this.handleSearch}
                @search-input=${this.handleSearchInput}>
              </search-bar>
            </search-bar-wrapper>
            <app-button
              type="primary"
              size="small"
              @click=${this.handleRequestTicket}>
              ${ICONS.plus} Request a Ticket
            </app-button>
          </search-wrapper>
        </header-controls>

        <data-table
          .data=${this.paginatedTickets}
          .conf=${ticketsTableConfig}
          .loading=${!this._loaded}
          .skeletonRows=${this.itemsPerPage}
          mode="1"
          @table-action=${this.handleTableAction}>
        </data-table>

        ${this.totalPages > 1 ? html`
        <pagination-wrapper>
          <pagination-component
            .currentPage=${this.currentPage}
            .totalPages=${this.totalPages}
            @pagination-change=${this.handlePageChange}>
          </pagination-component>
        </pagination-wrapper>
        ` : ''}
      </content-card>

      <!-- Ticket Details Dialog -->
      <app-dialog
        .isOpen=${this.showTicketDialog}
        .title=${this.selectedTicket?.subject || 'Ticket Details'}
        mode="ticket"
        size="medium"
        styleMode="compact"
        .hideFooter=${true}
        .closeOnOverlay=${true}
        .ticketData=${this.selectedTicket}
        @dialog-close=${this.handleDialogClose}>
      </app-dialog>

      <!-- Create Ticket Dialog -->
      <app-dialog
        .isOpen=${this.showCreateDialog}
        title="Request a Ticket"
        size="medium"
        styleMode="compact"
        .hideFooter=${true}
        .closeOnOverlay=${true}
        @dialog-close=${this.handleDialogClose}>
        <form @submit=${this.handleCreateSubmit}>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <label style="font-size:0.8rem;font-weight:600;color:#333;">Subject</label>
            <input name="subject" required placeholder="Brief summary of your issue"
              style="padding:0.5rem 0.75rem;border:1.25px solid #2d2b2b45;border-radius:8px;font-size:0.85rem;outline:none;">
            <label style="font-size:0.8rem;font-weight:600;color:#333;">Message</label>
            <textarea name="message" required rows="4" placeholder="Describe your issue in detail..."
              style="padding:0.5rem 0.75rem;border:1.25px solid #2d2b2b45;border-radius:8px;font-size:0.85rem;resize:vertical;outline:none;font-family:inherit;"></textarea>
            <app-button type="primary" size="small" .disabled=${this._submitting}
              @click=${(e) => e.target.closest('form').requestSubmit()}>
              ${this._submitting ? 'Submitting...' : 'Submit Ticket'}
            </app-button>
          </div>
        </form>
      </app-dialog>

      <!-- Book a Room Dialog (from ticket page) -->
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

      <!-- Cash Confirmation Dialog -->
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

customElements.define('customer-ticket', CustomerTicket);
