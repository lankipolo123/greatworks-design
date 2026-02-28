// customer-payments.js
import { LitElement, html, css } from 'lit';
import { paymentsTableConfig as basePaymentsConfig } from '/src/configs/payments-config.js';
import { payments as paymentsApi } from '/src/service/api.js';
import { appState } from '/src/utility/app-state.js';
import { toast } from '/src/service/toast-widget.js';
import '/src/components/app-button.js';
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
import { hashId } from '@/utility/hash-id.js';

// Customer sees view + change payment (for pending only)
const paymentsTableConfig = {
  ...basePaymentsConfig,
  actions: [
    { key: 'view', label: 'View', icon: 'visibility' },
    { key: 'change_payment', label: 'Change Payment', icon: 'credit_card' }
  ],
  filterActions(actions, row) {
    if (row.status?.toLowerCase() === 'pending') return actions;
    return actions.filter(a => a.key !== 'change_payment');
  }
};

class CustomerPayments extends LitElement {
  static properties = {
    payments: { type: Array },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    totalPages: { type: Number },
    searchValue: { type: String },
    showDetailsDialog: { type: Boolean },
    selectedPayment: { type: Object },
    showChangeMethodDialog: { type: Boolean },
    _selectedPaymentMethod: { type: String, state: true },
    _changeLoading: { type: Boolean, state: true },
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

    .details-actions {
      margin-top: 1rem;
      padding-top: 0.75rem;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
    }

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

    .change-method-summary {
      margin-bottom: 1rem;
      padding: 0.75rem;
      background: #f9f9f9;
      border-radius: 8px;
      font-size: 0.82rem;
      color: #555;
    }

    .change-method-summary .current-method {
      font-weight: 600;
      color: #333;
    }
  `;

  constructor() {
    super();
    this.payments = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.searchValue = '';
    this.showDetailsDialog = false;
    this.showChangeMethodDialog = false;
    this.selectedPayment = null;
    this._selectedPaymentMethod = '';
    this._changeLoading = false;
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
    } else if (action === 'change_payment') {
      this.selectedPayment = item;
      this._handleChangePaymentMethod(item);
    }
  }

  handleDialogClose() {
    this.showDetailsDialog = false;
    this.showChangeMethodDialog = false;
    this.selectedPayment = null;
    this._selectedPaymentMethod = '';
  }

  _handleChangePaymentMethod(payment) {
    this._selectedPaymentMethod = '';
    this.showDetailsDialog = false;
    this.showChangeMethodDialog = true;
  }

  handlePaymentMethodSelect(key) {
    this._selectedPaymentMethod = key;
  }

  async handleChangeMethodConfirm() {
    if (!this._selectedPaymentMethod || !this.selectedPayment) return;
    this._changeLoading = true;
    try {
      await paymentsApi.update(this.selectedPayment.id, {
        method: this._selectedPaymentMethod,
        status: this._selectedPaymentMethod === 'cash' ? 'pending' : 'completed',
      });
      toast.success('Payment method updated!');
      this.showChangeMethodDialog = false;
      this.selectedPayment = null;
      this._selectedPaymentMethod = '';
      this.fetchPayments();
      appState.emit('data-changed');
    } catch (e) {
      toast.error('Failed to update payment method.');
      console.error(e);
    } finally {
      this._changeLoading = false;
    }
  }

  _renderChangeMethodDialog() {
    if (!this.selectedPayment) return '';
    const p = this.selectedPayment;
    const methods = [
      { key: 'gcash', label: 'GCash', img: html`<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#007bff"/><text x="24" y="20" text-anchor="middle" font-size="10" font-weight="700" fill="#fff" font-family="sans-serif">G</text><text x="24" y="34" text-anchor="middle" font-size="8" font-weight="600" fill="#fff" font-family="sans-serif">Cash</text></svg>` },
      { key: 'cash', label: 'Cash', img: html`<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#43a047"/><rect x="10" y="14" width="28" height="20" rx="3" fill="#fff" opacity="0.3"/><circle cx="24" cy="24" r="6" fill="#fff" opacity="0.5"/><text x="24" y="28" text-anchor="middle" font-size="10" font-weight="700" fill="#fff" font-family="sans-serif">₱</text></svg>` },
      { key: 'debit_card', label: 'Debit Card', img: html`<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#7b1fa2"/><rect x="8" y="14" width="32" height="20" rx="3" fill="#fff" opacity="0.25"/><rect x="8" y="19" width="32" height="5" fill="#fff" opacity="0.3"/><rect x="12" y="28" width="12" height="2" rx="1" fill="#fff" opacity="0.5"/></svg>` },
      { key: 'bank_transfer', label: 'Bank', img: html`<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#1565c0"/><path d="M24 10 L38 18 H10 Z" fill="#fff" opacity="0.4"/><rect x="14" y="19" width="4" height="12" rx="1" fill="#fff" opacity="0.35"/><rect x="22" y="19" width="4" height="12" rx="1" fill="#fff" opacity="0.35"/><rect x="30" y="19" width="4" height="12" rx="1" fill="#fff" opacity="0.35"/><rect x="10" y="32" width="28" height="3" rx="1" fill="#fff" opacity="0.4"/></svg>` },
    ];

    return html`
      <div class="change-method-summary">
        Payment <strong>${hashId('PAY', p.id)}</strong> — ${this._formatAmount(p.amount)}<br>
        Current method: <span class="current-method">${p.method || 'None'}</span>
      </div>

      <div class="payment-methods-label">Select New Payment Method</div>
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
        <app-button type="secondary" size="small" @click=${this.handleDialogClose} ?disabled=${this._changeLoading}>
          Cancel
        </app-button>
        <app-button type="primary" size="small"
          @click=${() => this.handleChangeMethodConfirm()}
          ?disabled=${!this._selectedPaymentMethod || this._changeLoading}>
          ${this._changeLoading ? 'Updating...' : 'Confirm'}
        </app-button>
      </div>
    `;
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
          <span class="payment-detail-value">${hashId('PAY', p.id)}</span>
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
            <span class="payment-detail-label">Booking ID</span>
            <span class="payment-detail-value">${hashId('BKG', p.reservation_id)}</span>
          </div>
        ` : ''}
        ${p.notes ? html`
          <div class="payment-detail-item full">
            <span class="payment-detail-label">Notes</span>
            <span class="payment-detail-value">${p.notes}</span>
          </div>
        ` : ''}
      </div>

      ${p.status?.toLowerCase() === 'pending' ? html`
        <div class="details-actions">
          <app-button type="secondary" size="small" @click=${() => this._handleChangePaymentMethod(p)}>
            Change Payment Method
          </app-button>
        </div>
      ` : ''}
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

      <app-dialog
        .isOpen=${this.showChangeMethodDialog}
        title="Change Payment Method"
        size="large"
        styleMode="compact"
        .hideFooter=${true}
        .closeOnOverlay=${true}
        @dialog-close=${this.handleDialogClose}>
        ${this._renderChangeMethodDialog()}
      </app-dialog>
    `;
  }
}

customElements.define('customer-payments', CustomerPayments);
