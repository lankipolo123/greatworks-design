// customer-payments.js
import { LitElement, html, css } from 'lit';
import { paymentsTableConfig } from '/src/configs/payments-config.js';
import { payments as paymentsApi } from '/src/service/api.js';
import { appState } from '/src/utility/app-state.js';
import '/src/components/pagination.js';
import '/src/components/search-bar.js';
import '/src/components/app-dialog.js';
import '/src/layouts/header-controls.js';
import '/src/layouts/search-bar-wrapper.js';
import '/src/layouts/pagination-wrapper.js';
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
  `;

  constructor() {
    super();
    this.payments = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.searchValue = '';
    this.showDetailsDialog = false;
    this.selectedPayment = null;
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
        </header-controls>

        <data-table
          .data=${this.paginatedPayments}
          .conf=${paymentsTableConfig}
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
        mode="details"
        size="medium"
        styleMode="compact"
        .hideFooter=${true}
        .closeOnOverlay=${true}
        .detailsData=${this.selectedPayment}
        @dialog-close=${this.handleDialogClose}>
      </app-dialog>
    `;
  }
}

customElements.define('customer-payments', CustomerPayments);
