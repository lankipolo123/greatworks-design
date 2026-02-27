// src/pages/admin/payments.js
import { LitElement, html, css } from 'lit';
import { paymentsTableConfig } from '/src/configs/payments-config.js';
import { ICONS } from '/src/components/dashboard-icons.js';
import { payments as paymentsApi } from '/src/service/api.js';
import { appState } from '/src/utility/app-state.js';
import '/src/components/pagination.js';
import '/src/components/search-bar.js';
import '/src/components/app-button.js';
import '/src/layouts/header-controls.js';
import '/src/layouts/search-bar-wrapper.js';
import '/src/layouts/pagination-wrapper.js';
import '/src/components/app-dialog.js';
import '/src/components/badge-component.js';
import '/src/components/users-avatar.js';
import { getTotalPages } from '@/utility/pagination-helpers.js';
import { hashId } from '@/utility/hash-id.js';
import '/src/components/floating-action-button.js';
import { paymentFabOptions } from '/src/configs/fab-options-config.js';
import { toast } from '/src/service/toast-widget.js';
import { users as usersApi, bookings as bookingsApi } from '/src/service/api.js';

class AdminPayments extends LitElement {
  static properties = {
    payments: { type: Array },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    totalPages: { type: Number },
    searchValue: { type: String },
    showExportDialog: { type: Boolean },
    showDetailsDialog: { type: Boolean },
    selectedPayment: { type: Object },
    showCreateDialog: { type: Boolean },
    _createLoading: { type: Boolean, state: true },
    _usersList: { type: Array, state: true },
    _bookingsList: { type: Array, state: true },
    _loaded: { type: Boolean, state: true }
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

    .create-form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .create-form .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .create-form .form-group.full {
      grid-column: 1 / -1;
    }

    .create-form label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #555;
    }

    .create-form input,
    .create-form select {
      padding: 0.5rem;
      border: 1.5px solid #2d2b2b25;
      border-radius: 6px;
      font-size: 0.85rem;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
    }

    .create-form input:focus,
    .create-form select:focus {
      border-color: #ffb300;
    }

    .create-form-actions {
      grid-column: 1 / -1;
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

  `;

  constructor() {
    super();
    this.payments = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.searchValue = '';
    this.showExportDialog = false;
    this.showDetailsDialog = false;
    this.showCreateDialog = false;
    this._createLoading = false;
    this._usersList = [];
    this._bookingsList = [];
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
        p.user?.name?.toLowerCase().includes(search) ||
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

  handleExport() {
    this.showExportDialog = true;
  }

  handleExportSelect(e) {
    console.log('Export payments as:', e.detail.format);
    this.showExportDialog = false;
  }

  handleDialogClose() {
    this.showExportDialog = false;
    this.showDetailsDialog = false;
    this.showCreateDialog = false;
    this.selectedPayment = null;
  }

  async handleFabAction(e) {
    const { action } = e.detail;
    if (action === 'new-payment') {
      this._loadUsersAndBookings();
      this.showCreateDialog = true;
    }
  }

  async _loadUsersAndBookings() {
    try {
      const [usersRes, bookingsRes] = await Promise.all([
        usersApi.getAll({ per_page: 100 }),
        bookingsApi.getAll({ per_page: 100 }),
      ]);
      this._usersList = usersRes.data || usersRes || [];
      this._bookingsList = (bookingsRes.data || bookingsRes || []);
    } catch (e) {
      this._usersList = [];
      this._bookingsList = [];
    }
  }

  async handleCreatePayment() {
    const form = this.shadowRoot.getElementById('create-payment-form');
    if (!form || !form.checkValidity()) {
      form?.reportValidity();
      return;
    }

    this._createLoading = true;
    const getValue = (name) => form.querySelector(`[name="${name}"]`)?.value || '';

    try {
      await paymentsApi.create({
        user_id: parseInt(getValue('user_id')),
        booking_id: getValue('booking_id') ? parseInt(getValue('booking_id')) : null,
        amount: parseFloat(getValue('amount')),
        currency: 'PHP',
        method: getValue('method'),
        status: getValue('status') || 'pending',
        reference_number: getValue('reference_number') || null,
      });

      toast.success('Payment created successfully!');
      this.showCreateDialog = false;
      await this.fetchPayments();
      appState.emit('data-changed');
    } catch (err) {
      toast.error(err.message || 'Failed to create payment');
    } finally {
      this._createLoading = false;
    }
  }

  _renderCreateForm() {
    return html`
      <form id="create-payment-form" class="create-form" @submit=${(e) => e.preventDefault()}>
        <div class="form-group">
          <label>User *</label>
          <select name="user_id" required>
            <option value="">Select user</option>
            ${(this._usersList || []).map(u => html`
              <option value="${u.id}">${u.name || u.email}</option>
            `)}
          </select>
        </div>

        <div class="form-group">
          <label>Booking (optional)</label>
          <select name="booking_id">
            <option value="">No booking</option>
            ${(this._bookingsList || []).map(b => html`
              <option value="${b.id}">${hashId('BKG', b.id)} — ${b.room?.name || `Room #${b.room_id}`}</option>
            `)}
          </select>
        </div>

        <div class="form-group">
          <label>Amount (PHP) *</label>
          <input type="number" name="amount" min="0" step="0.01" placeholder="0.00" required />
        </div>

        <div class="form-group">
          <label>Method *</label>
          <select name="method" required>
            <option value="">Select method</option>
            <option value="gcash">GCash</option>
            <option value="cash">Cash</option>
            <option value="debit_card">Debit Card</option>
            <option value="credit_card">Credit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>

        <div class="form-group">
          <label>Status</label>
          <select name="status">
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <div class="form-group">
          <label>Reference Number</label>
          <input type="text" name="reference_number" placeholder="Optional" />
        </div>

        <div class="create-form-actions">
          <app-button type="secondary" size="small" @click=${this.handleDialogClose} ?disabled=${this._createLoading}>
            Cancel
          </app-button>
          <app-button type="primary" size="small" @click=${() => this.handleCreatePayment()} ?disabled=${this._createLoading}>
            ${this._createLoading ? 'Creating...' : 'Create Payment'}
          </app-button>
        </div>
      </form>
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
            <span class="payment-detail-label">Reservation ID</span>
            <span class="payment-detail-value">${hashId('RES', p.reservation_id)}</span>
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
          <app-button
            type="primary"
            size="small"
            @click=${this.handleExport}>
            ${ICONS.export} Export
          </app-button>
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
        .isOpen=${this.showExportDialog}
        title="Export Payments"
        description="Select export format and date range"
        mode="export"
        size="medium"
        styleMode="clean"
        .closeOnOverlay=${false}
        @export-select=${this.handleExportSelect}
        @dialog-close=${this.handleDialogClose}>
      </app-dialog>

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

      <!-- Create Payment Dialog -->
      <app-dialog
        .isOpen=${this.showCreateDialog}
        title="New Payment"
        description="Record a new payment entry"
        size="large"
        styleMode="compact"
        .closeOnOverlay=${false}
        .hideFooter=${true}
        @dialog-close=${this.handleDialogClose}>
        ${this._renderCreateForm()}
      </app-dialog>

      <floating-action-button
        .options=${paymentFabOptions}
        @fab-option-click=${this.handleFabAction}>
      </floating-action-button>
    `;
  }
}

customElements.define('admin-payments', AdminPayments);