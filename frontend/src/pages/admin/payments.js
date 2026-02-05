// src/pages/admin/payments.js
import { LitElement, html, css } from 'lit';
import { paymentsTableConfig } from '/src/configs/payments-config.js';
import { mockPayments } from '/src/mock-datas/mock-payments';
import { ICONS } from '/src/components/dashboard-icons.js';
import '/src/components/pagination.js';
import '/src/components/search-bar.js';
import '/src/components/app-button.js';
import '/src/layouts/header-controls.js';
import '/src/layouts/search-bar-wrapper.js';
import '/src/layouts/pagination-wrapper.js';
import '/src/components/app-dialog.js';
import { getTotalPages } from '@/utility/pagination-helpers.js';

class AdminPayments extends LitElement {
  static properties = {
    payments: { type: Array },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    totalPages: { type: Number },
    searchValue: { type: String },
    showExportDialog: { type: Boolean },
    showDetailsDialog: { type: Boolean },
    selectedPayment: { type: Object }
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
    this.payments = mockPayments;
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.searchValue = '';
    this.showExportDialog = false;
    this.showDetailsDialog = false;
    this.selectedPayment = null;
    this.updatePagination();
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  get filteredPayments() {
    let filtered = this.payments;

    if (this.searchValue) {
      const search = this.searchValue.toLowerCase();
      filtered = filtered.filter(p =>
        p.id?.toLowerCase().includes(search) ||
        p.userId?.toLowerCase().includes(search) ||
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
          mode="1"
          @table-action=${this.handleTableAction}>
        </data-table>

        <pagination-wrapper>
          <pagination-component
            .currentPage=${this.currentPage}
            .totalPages=${this.totalPages}
            @pagination-change=${this.handlePageChange}>
          </pagination-component>
        </pagination-wrapper>
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

customElements.define('admin-payments', AdminPayments);