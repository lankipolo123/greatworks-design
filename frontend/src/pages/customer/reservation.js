// customer-reservation.js
import { LitElement, html, css } from 'lit';
import { reservationTableConfig } from '/src/configs/reservation-config.js';
import '/src/components/data-table.js';
import '/src/components/pagination.js';
import '/src/components/tabs-component.js';
import '/src/components/search-bar.js';
import '/src/components/app-dialog.js';
import '/src/components/badge-component.js';
import '/src/layouts/header-controls.js';
import '/src/layouts/tabs-wrapper.js';
import '/src/layouts/search-wrapper.js';
import '/src/layouts/search-bar-wrapper.js';
import '/src/layouts/pagination-wrapper.js';
import { getTotalPages } from '@/utility/pagination-helpers.js';
import { hashId } from '@/utility/hash-id.js';
import { reservations, payments } from '/src/service/api.js';
import { appState } from '/src/utility/app-state.js';
import { toast } from '@/utility/toast-controller.js';

import '/src/components/stat-card.js';
import '/src/components/app-button.js';
import { ICONS } from '/src/components/dashboard-icons.js';

// Customer only sees view action, no edit/delete
const customerTableConfig = {
  ...reservationTableConfig,
  actions: [
    { key: 'view', label: 'View', icon: 'visibility' }
  ]
};

class CustomerReservation extends LitElement {
  static properties = {
    reservation: { type: Array },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    totalPages: { type: Number },
    activeTab: { type: String },
    searchValue: { type: String },
    showDetailsDialog: { type: Boolean },
    selectedReservation: { type: Object },
    showPaymentDialog: { type: Boolean },
    _selectedPaymentMethod: { type: String, state: true },
    _paymentLoading: { type: Boolean, state: true },
    _paymentReservation: { type: Object, state: true },
    _loaded: { type: Boolean, state: true },
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
      border: 1.25px solid #2d2b2b45;
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

    .details-actions {
      margin-top: 1rem;
      padding-top: 0.75rem;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
    }

    .payment-summary { margin-bottom: 1rem; }
    .payment-summary-row { display: flex; justify-content: space-between; padding: 0.35rem 0; font-size: 0.82rem; color: #555; }
    .payment-summary-row.total { border-top: 1px solid #eee; margin-top: 0.25rem; padding-top: 0.5rem; font-weight: 700; color: #1a1a1a; font-size: 0.9rem; }
    .payment-summary-label { font-weight: 500; }

    .payment-methods-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #555;
      margin-bottom: 0.5rem;
    }

    .payment-methods {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .payment-method-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 0.5rem 0.25rem;
      border: 1.5px solid #2d2b2b15;
      border-radius: 8px;
      background: #fff;
      cursor: pointer;
      font-size: 0.68rem;
      font-weight: 500;
      color: #555;
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
      color: #333;
    }

    .payment-method-btn .pm-img {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .payment-method-btn .pm-img svg {
      width: 100%;
      height: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
  `;

  constructor() {
    super();
    this.reservation = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.activeTab = 'all';
    this.searchValue = '';
    this.showDetailsDialog = false;
    this.selectedReservation = null;
    this.showPaymentDialog = false;
    this._selectedPaymentMethod = '';
    this._paymentLoading = false;
    this._paymentReservation = null;
    this._loaded = false;
    this.tabs = [
      { id: 'all', label: 'All' },
      { id: 'upcoming', label: 'Upcoming' },
      { id: 'ongoing', label: 'Ongoing' },
      { id: 'completed', label: 'Archived/Complete' }
    ];

    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleTableAction = this.handleTableAction.bind(this);

    this._loadReservations();
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsub = appState.on('data-changed', () => this._loadReservations());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsub) this._unsub();
  }

  async _loadReservations() {
    try {
      const response = await reservations.getAll({ per_page: 100 });
      const data = response.data || response;
      this.reservation = (Array.isArray(data) ? data : []).map(r => this._mapApiReservation(r));
      this.updatePagination();
    } catch (e) {
      console.error('Failed to load reservations:', e.message || e);
      this.reservation = [];
    } finally {
      this._loaded = true;
    }
  }

  _mapApiReservation(r) {
    return {
      id: r.id,
      userId: r.user?.name || r.user?.email || `User #${r.user_id}`,
      userName: r.user?.name || '',
      roomName: r.room?.name || (r.room_id ? `Room #${r.room_id}` : 'No room'),
      roomType: r.room?.type || '',
      locationName: r.room?.location || '',
      date: typeof r.date === 'string' ? r.date.split('T')[0] : r.date,
      time: typeof r.start_time === 'string' ? r.start_time.substring(0, 5) : (typeof r.time === 'string' ? r.time.substring(0, 5) : r.time),
      guests: r.guests,
      status: r.status,
      notes: r.notes || '',
    };
  }

  _formatRoomType(type) {
    const labels = {
      co_working: 'Co-Working',
      virtual_offices: 'Virtual Offices',
      private_offices: 'Private Offices',
      events_meeting_room: 'Events & Meeting',
    };
    return labels[type] || type;
  }

  get filteredReservations() {
    let filtered = this.reservation;

    if (this.activeTab === 'upcoming') {
      filtered = filtered.filter(r => r.status === 'upcoming' || r.status === 'pending');
    } else if (this.activeTab === 'ongoing') {
      filtered = filtered.filter(r => r.status === 'confirmed' || r.status === 'ongoing');
    } else if (this.activeTab === 'completed') {
      filtered = filtered.filter(r => r.status === 'completed' || r.status === 'cancelled');
    }

    if (this.searchValue) {
      const search = this.searchValue.toLowerCase();
      filtered = filtered.filter(r =>
        String(r.id)?.toLowerCase().includes(search) ||
        r.date?.toLowerCase().includes(search) ||
        r.status?.toLowerCase().includes(search)
      );
    }

    return filtered;
  }

  get paginatedReservation() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredReservations.slice(start, start + this.itemsPerPage);
  }

  updatePagination() {
    this.totalPages = getTotalPages(
      this.filteredReservations.length,
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

  handlePageChange(e) {
    this.currentPage = e.detail.page;
  }

  handleTableAction(e) {
    const { action, item } = e.detail;
    if (action === 'view') {
      this.selectedReservation = item;
      this.showDetailsDialog = true;
    }
  }

  handleDialogClose() {
    this.showDetailsDialog = false;
    this.showPaymentDialog = false;
    this.selectedReservation = null;
    this._paymentReservation = null;
    this._selectedPaymentMethod = '';
  }

  _handleChangePaymentMethod(reservation) {
    this._paymentReservation = reservation;
    this._selectedPaymentMethod = '';
    this.showDetailsDialog = false;
    this.showPaymentDialog = true;
  }

  handlePaymentMethodSelect(key) {
    this._selectedPaymentMethod = key;
  }

  async handlePaymentConfirm() {
    if (!this._selectedPaymentMethod || !this._paymentReservation) return;
    this._paymentLoading = true;
    try {
      await payments.create({
        booking_id: this._paymentReservation.id,
        amount: 0,
        method: this._selectedPaymentMethod,
        status: this._selectedPaymentMethod === 'cash' ? 'pending' : 'completed',
      });
      toast.success('Payment method updated successfully!');
      this.showPaymentDialog = false;
      this._paymentReservation = null;
      this._selectedPaymentMethod = '';
      this._loadReservations();
      appState.emit('data-changed');
    } catch (e) {
      toast.error('Failed to update payment method.');
      console.error(e);
    } finally {
      this._paymentLoading = false;
    }
  }

  _renderPaymentDialog() {
    const r = this._paymentReservation;
    if (!r) return '';
    const methods = [
      { key: 'gcash', label: 'GCash', img: html`<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#007bff"/><text x="24" y="20" text-anchor="middle" font-size="10" font-weight="700" fill="#fff" font-family="sans-serif">G</text><text x="24" y="34" text-anchor="middle" font-size="8" font-weight="600" fill="#fff" font-family="sans-serif">Cash</text></svg>` },
      { key: 'cash', label: 'Cash', img: html`<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#43a047"/><rect x="10" y="14" width="28" height="20" rx="3" fill="#fff" opacity="0.3"/><circle cx="24" cy="24" r="6" fill="#fff" opacity="0.5"/><text x="24" y="28" text-anchor="middle" font-size="10" font-weight="700" fill="#fff" font-family="sans-serif">₱</text></svg>` },
      { key: 'debit_card', label: 'Debit Card', img: html`<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#7b1fa2"/><rect x="8" y="14" width="32" height="20" rx="3" fill="#fff" opacity="0.25"/><rect x="8" y="19" width="32" height="5" fill="#fff" opacity="0.3"/><rect x="12" y="28" width="12" height="2" rx="1" fill="#fff" opacity="0.5"/></svg>` },
      { key: 'bank_transfer', label: 'Bank', img: html`<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#1565c0"/><path d="M24 10 L38 18 H10 Z" fill="#fff" opacity="0.4"/><rect x="14" y="19" width="4" height="12" rx="1" fill="#fff" opacity="0.35"/><rect x="22" y="19" width="4" height="12" rx="1" fill="#fff" opacity="0.35"/><rect x="30" y="19" width="4" height="12" rx="1" fill="#fff" opacity="0.35"/><rect x="10" y="32" width="28" height="3" rx="1" fill="#fff" opacity="0.4"/></svg>` },
    ];

    return html`
      <div class="payment-summary">
        <div class="payment-summary-row">
          <span class="payment-summary-label">Room</span>
          <span class="payment-summary-value">${r.roomName}</span>
        </div>
        <div class="payment-summary-row">
          <span class="payment-summary-label">Date</span>
          <span class="payment-summary-value">${r.date ? new Date(r.date).toLocaleDateString() : '-'}</span>
        </div>
        <div class="payment-summary-row">
          <span class="payment-summary-label">Time</span>
          <span class="payment-summary-value">${r.time}</span>
        </div>
      </div>

      <div class="payment-methods-label">Select Payment Method</div>
      <div class="payment-methods">
        ${methods.map(m => html`
          <button
            class="payment-method-btn ${this._selectedPaymentMethod === m.key ? 'selected' : ''}"
            @click=${() => this.handlePaymentMethodSelect(m.key)}>
            <span class="pm-img">${m.img}</span>
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

  _renderDetailsDialog() {
    if (!this.selectedReservation) return '';
    const r = this.selectedReservation;

    return html`
      <div class="details-content">
        <div class="detail-item">
          <span class="detail-label">Reservation ID</span>
          <span class="detail-value">${hashId('RES', r.id)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Status</span>
          <badge-component variant="${r.status}" size="small">${r.status}</badge-component>
        </div>
        <div class="detail-item">
          <span class="detail-label">Room</span>
          <span class="detail-value">${r.roomName || '-'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Room Type</span>
          <span class="detail-value">${r.roomType ? this._formatRoomType(r.roomType) : '-'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Location</span>
          <span class="detail-value">${r.locationName || '-'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Date</span>
          <span class="detail-value">${r.date ? new Date(r.date).toLocaleDateString() : '-'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Time</span>
          <span class="detail-value">${r.time}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Guests</span>
          <span class="detail-value">${r.guests}</span>
        </div>
        ${r.notes ? html`
          <div class="detail-item full">
            <span class="detail-label">Notes</span>
            <span class="detail-value">${r.notes}</span>
          </div>
        ` : ''}
      </div>

      ${r.status === 'pending' ? html`
        <div class="details-actions">
          <app-button type="secondary" size="small" @click=${() => this._handleChangePaymentMethod(r)}>
            <span class="material-symbols-outlined" style="font-size:1rem;vertical-align:middle;margin-right:4px;">swap_horiz</span>
            Change Payment Method
          </app-button>
        </div>
      ` : ''}
    `;
  }

  get _totalCount() { return this.reservation.length; }
  get _upcomingCount() { return this.reservation.filter(r => r.status === 'upcoming' || r.status === 'pending').length; }
  get _ongoingCount() { return this.reservation.filter(r => r.status === 'confirmed' || r.status === 'ongoing').length; }
  get _completedCount() { return this.reservation.filter(r => r.status === 'completed').length; }

  handleBookNow() {
    this.dispatchEvent(new CustomEvent('page-change', {
      detail: { page: 'booking' },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="stats-row">
        <stat-card
          title="Total Reservations"
          textColor="#811a0a"
          .value=${this._loaded ? this._totalCount : '--'}
          .icon=${ICONS.booking}>
        </stat-card>
        <stat-card
          title="Upcoming"
          textColor="#0a5e81"
          .value=${this._loaded ? this._upcomingCount : '--'}
          .icon=${ICONS.clock}>
        </stat-card>
        <stat-card
          title="Ongoing"
          textColor="#ffac05"
          .value=${this._loaded ? this._ongoingCount : '--'}
          .icon=${ICONS.activity}>
        </stat-card>
        <stat-card
          title="Completed"
          textColor="#67ab07"
          .value=${this._loaded ? this._completedCount : '--'}
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
                placeholder="Search reservations..."
                .value=${this.searchValue}
                .showFilter=${false}
                @search=${this.handleSearch}
                @search-input=${this.handleSearchInput}>
              </search-bar>
            </search-bar-wrapper>
            <app-button
              type="primary"
              size="small"
              @click=${this.handleBookNow}>
              ${ICONS.plus} Book Now
            </app-button>
          </search-wrapper>
        </header-controls>

        <data-table
          .data=${this.paginatedReservation}
          .conf=${customerTableConfig}
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

      <!-- Reservation Details Dialog (read-only for customer) -->
      <app-dialog
        .isOpen=${this.showDetailsDialog}
        title="Reservation Details"
        size="medium"
        styleMode="compact"
        .hideFooter=${true}
        .closeOnOverlay=${true}
        @dialog-close=${this.handleDialogClose}>
        ${this._renderDetailsDialog()}
      </app-dialog>

      <!-- Payment Method Dialog -->
      <app-dialog
        .isOpen=${this.showPaymentDialog}
        title="Change Payment Method"
        size="large"
        styleMode="compact"
        .hideFooter=${true}
        .closeOnOverlay=${true}
        @dialog-close=${this.handleDialogClose}>
        ${this._renderPaymentDialog()}
      </app-dialog>
    `;
  }
}

customElements.define('customer-reservation', CustomerReservation);
