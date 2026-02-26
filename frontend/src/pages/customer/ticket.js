// customer-ticket.js
import { LitElement, html, css } from 'lit';
import { ticketsTableConfig } from '/src/configs/tickets-config';
import { tickets as ticketsApi, bookings, rooms } from '/src/service/api.js';
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
      await bookings.create({
        room_id: parseInt(getValue('room_id')),
        date: getValue('date'),
        start_time: getValue('time'),
        duration_hours: parseInt(getValue('duration') || '1'),
        guests: parseInt(getValue('guests') || '1'),
        notes: getValue('notes'),
      });

      toast.success('Booking created! You can now request a ticket.');
      this.showBookDialog = false;
      this._slotInfo = null;
      this._hasActiveBooking = true;
      this.showCreateDialog = true;
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
    `;
  }
}

customElements.define('customer-ticket', CustomerTicket);
