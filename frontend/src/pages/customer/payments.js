// customer-payments.js
import { LitElement, html, css } from 'lit';
import { paymentsTableConfig } from '/src/configs/payments-config.js';
import { payments as paymentsApi } from '/src/service/api.js';
import { appState } from '/src/utility/app-state.js';
import '/src/components/pagination.js';
import '/src/components/search-bar.js';
import '/src/components/app-dialog.js';
import '/src/components/badge-component.js';
import '/src/components/users-avatar.js';
import '/src/layouts/header-controls.js';
import '/src/layouts/search-bar-wrapper.js';
import '/src/layouts/pagination-wrapper.js';
import '/src/components/stat-card.js';
import { ICONS } from '/src/components/dashboard-icons.js';
import { getTotalPages } from '@/utility/pagination-helpers.js';

class CustomerPayments extends LitElement {
  static properties = {
    payments: { type: Array },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    totalPages: { type: Number },
    searchValue: { type: String },
    showDetailsDialog: { type: Boolean },
    selectedPayment: { type: Object },
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

    .payment-profile {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
    }

    .payment-profile-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .payment-profile-name {
      font-size: 1rem;
      font-weight: 700;
      color: #1a1a1a;
    }

    .payment-profile-email {
      font-size: 0.8rem;
      color: #888;
    }

    .payment-profile-badges {
      display: flex;
      gap: 6px;
      margin-top: 4px;
    }

    .payment-details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .payment-detail-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .payment-detail-item.full {
      grid-column: 1 / -1;
    }

    .payment-detail-label {
      font-size: 0.7rem;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .payment-detail-value {
      font-size: 0.85rem;
      font-weight: 500;
      color: #1a1a1a;
    }
  `;

  constructor() {
    super();
    this.payments = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.searchValue = '';
    this.showDetailsDialog = false;
    this.selectedPayment = null;
    this._loaded = false;
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchPayments();
    this._unsub = appState.on('data-changed', () => this.fetchPayments());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsub) this._unsub();
  }

  async fetchPayments() {
    try {
      const data = await paymentsApi.getAll({ per_page: 100 });
      this.payments = data.data || data;
      this.updatePagination();
    } catch (e) {
      console.error('Failed to fetch payments:', e);
    } finally {
      this._loaded = true;
    }
  }

  get filteredPayments() {
    let filtered = this.payments;

    if (this.searchValue) {
      const search = this.searchValue.toLowerCase();
      filtered = filtered.filter(p =>
        p.id?.toString().includes(search) ||
        p.amount?.toString().includes(search) ||
        p.status?.toLowerCase().includes(search)
      );
    }

    return filtered;
  }

  get paginatedPayments() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPayments.slice(start, start + this.itemsPerPage);
  }

  updatePagination() {
    this.totalPages = getTotalPages(this.filteredPayments.length, this.itemsPerPage);
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
      this.selectedPayment = item;
      this.showDetailsDialog = true;
    }
  }

  handleDialogClose() {
    this.showDetailsDialog = false;
    this.selectedPayment = null;
  }

  _getRoleVariant(role) {
    const r = role?.toLowerCase();
    if (r === 'admin') return 'danger';
    if (r === 'moderator') return 'info';
    if (r === 'temporary') return 'warning';
    return 'technical';
  }

  _getStatusVariant(status) {
    const s = status?.toLowerCase();
    if (s === 'active') return 'success';
    if (s === 'inactive') return 'inactive';
    if (s === 'archived') return 'archived';
    return 'primary';
  }

  _getPaymentStatusVariant(status) {
    const s = status?.toLowerCase();
    if (s === 'completed' || s === 'paid' || s === 'success') return 'success';
    if (s === 'pending') return 'pending';
    if (s === 'failed') return 'failed';
    if (s === 'cancelled') return 'cancelled';
    return 'primary';
  }

  _formatAmount(amount) {
    return Number(amount).toLocaleString('en-PH', {
      style: 'currency',
      currency: 'PHP'
    });
  }

  get _totalCount() { return this.payments.length; }
  get _completedCount() { return this.payments.filter(p => ['completed', 'paid', 'success'].includes(p.status?.toLowerCase())).length; }
  get _pendingCount() { return this.payments.filter(p => p.status?.toLowerCase() === 'pending').length; }
  get _failedCount() { return this.payments.filter(p => ['failed', 'cancelled'].includes(p.status?.toLowerCase())).length; }

  _renderDetailsDialog() {
    if (!this.selectedPayment) return '';
    const p = this.selectedPayment;
    const user = p.user || {};

    return html`
      ${user.name || user.email ? html`
        <div class="payment-profile">
          <user-avatar
            size="48"
            .src=${user.profile_photo || ''}
            .name=${user.name || ''}
            .gender=${user.gender || ''}>
          </user-avatar>
          <div class="payment-profile-info">
            <div class="payment-profile-name">${user.name || 'Unknown User'}</div>
            <div class="payment-profile-email">${user.email || ''}</div>
            <div class="payment-profile-badges">
              ${user.role ? html`<badge-component variant="${this._getRoleVariant(user.role)}" size="small">${user.role}</badge-component>` : ''}
              ${user.status ? html`<badge-component variant="${this._getStatusVariant(user.status)}" size="small">${user.status}</badge-component>` : ''}
            </div>
          </div>
        </div>
      ` : ''}

      <div class="payment-details-grid">
        <div class="payment-detail-item">
          <span class="payment-detail-label">Payment ID</span>
          <span class="payment-detail-value">${p.id}</span>
        </div>
        <div class="payment-detail-item">
          <span class="payment-detail-label">Status</span>
          <badge-component variant="${this._getPaymentStatusVariant(p.status)}" size="small">${p.status}</badge-component>
        </div>
        <div class="payment-detail-item">
          <span class="payment-detail-label">Amount</span>
          <span class="payment-detail-value">${this._formatAmount(p.amount)}</span>
        </div>
        <div class="payment-detail-item">
          <span class="payment-detail-label">Currency</span>
          <span class="payment-detail-value">${p.currency || '—'}</span>
        </div>
        <div class="payment-detail-item">
          <span class="payment-detail-label">Method</span>
          <badge-component variant="info" size="small">${p.method || '—'}</badge-component>
        </div>
        <div class="payment-detail-item">
          <span class="payment-detail-label">Date</span>
          <span class="payment-detail-value">${p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</span>
        </div>
        ${p.reservation_id ? html`
          <div class="payment-detail-item">
            <span class="payment-detail-label">Reservation ID</span>
            <span class="payment-detail-value">#${p.reservation_id}</span>
          </div>
        ` : ''}
        ${p.notes ? html`
          <div class="payment-detail-item full">
            <span class="payment-detail-label">Notes</span>
            <span class="payment-detail-value">${p.notes}</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  render() {
    return html`
      <div class="stats-row">
        <stat-card
          title="Total Payments"
          textColor="#811a0a"
          .value=${this._loaded ? this._totalCount : '--'}
          .icon=${ICONS.payments}>
        </stat-card>
        <stat-card
          title="Completed"
          textColor="#67ab07"
          .value=${this._loaded ? this._completedCount : '--'}
          .icon=${ICONS.chartLine}>
        </stat-card>
        <stat-card
          title="Pending"
          textColor="#ffac05"
          .value=${this._loaded ? this._pendingCount : '--'}
          .icon=${ICONS.clock}>
        </stat-card>
        <stat-card
          title="Failed / Cancelled"
          textColor="#c62828"
          .value=${this._loaded ? this._failedCount : '--'}
          .icon=${ICONS.trendingDown}>
        </stat-card>
      </div>

      <content-card mode="4">
        <header-controls mode="2">
          <search-bar-wrapper>
            <search-bar
              placeholder="Search payments..."
              .value=${this.searchValue}
              .showFilter=${false}
              @search=${this.handleSearch}
              @search-input=${this.handleSearchInput}>
            </search-bar>
          </search-bar-wrapper>
        </header-controls>

        <data-table
          .data=${this.paginatedPayments}
          .conf=${paymentsTableConfig}
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

      <app-dialog
        .isOpen=${this.showDetailsDialog}
        title="Payment Details"
        size="medium"
        styleMode="compact"
        .hideFooter=${true}
        .closeOnOverlay=${true}
        @dialog-close=${this.handleDialogClose}>
        ${this._renderDetailsDialog()}
      </app-dialog>
    `;
  }
}

customElements.define('customer-payments', CustomerPayments);
