// src/pages/admin/logs.js
import { LitElement, html, css } from 'lit';
import { logsTableConfig } from '@/configs/logs-config.js';
import { mockLogs } from '@/mock-datas/mock-logs.js';
import { ICONS } from '/src/components/dashboard-icons.js';
import '@/components/data-table.js';
import '@/components/search-bar.js';
import '@/components/app-button.js';
import '@/layouts/header-controls.js';
import '@/layouts/search-bar-wrapper.js';
import '@/layouts/pagination-wrapper.js';
import '@/components/pagination.js';
import { getTotalPages } from '@/utility/pagination-helpers.js';

class AdminLogs extends LitElement {
  static properties = {
    logs: { type: Array },
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
    this.logs = mockLogs;
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.searchValue = '';
    this.updatePagination();
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  get filteredLogs() {
    let filtered = this.logs;

    if (this.searchValue) {
      const search = this.searchValue.toLowerCase();
      filtered = filtered.filter(l =>
        l.id?.toLowerCase().includes(search) ||
        l.action?.toLowerCase().includes(search) ||
        l.module?.toLowerCase().includes(search) ||
        l.userId?.toLowerCase().includes(search)
      );
    }

    return filtered;
  }

  get paginatedLogs() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredLogs.slice(start, start + this.itemsPerPage);
  }

  updatePagination() {
    this.totalPages = getTotalPages(this.filteredLogs.length, this.itemsPerPage);
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
    if (action === 'view') console.log('View log:', item);
  }

  handlePageChange(e) {
    this.currentPage = e.detail.page;
  }

  handleExport() {
    console.log('Export logs data');
  }

  render() {
    return html`
      <content-card mode="4">
        <header-controls mode="2">
          <search-bar-wrapper>
            <search-bar
              placeholder="Search logs..."
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
          .data=${this.paginatedLogs}
          .conf=${logsTableConfig}
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

customElements.define('admin-logs', AdminLogs);