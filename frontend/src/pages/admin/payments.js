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
import { getTotalPages } from '@/utility/pagination-helpers.js';

class AdminPayments extends LitElement {
  static properties = {
    payments: { type: Array },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    totalPages: { type: Number },
    searchValue: { type: String }
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
    console.log('Payment action:', action, item);
  }

  handleExport() {
    console.log('Export payments data');
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
    `;
  }
}

customElements.define('admin-payments', AdminPayments);