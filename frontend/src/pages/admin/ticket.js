// src/pages/admin/ticket.js
import { LitElement, html, css } from 'lit';
import { mockTickets } from '/src/mock-datas/mock-ticket';
import { ticketsTableConfig } from '/src/configs/tickets-config';
import { ICONS } from '/src/components/dashboard-icons.js';
import '@/components/data-table.js';
import '@/components/tabs-component.js';
import '@/components/search-bar.js';
import '@/components/app-button.js';
import '@/layouts/header-controls.js';
import '@/layouts/tabs-wrapper.js';
import '@/layouts/search-wrapper.js';
import '@/layouts/search-bar-wrapper.js';
import '@/layouts/pagination-wrapper.js';
import '@/components/pagination.js';
import { getTotalPages } from '@/utility/pagination-helpers.js';

class AdminTicket extends LitElement {
  static properties = {
    tickets: { type: Array },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    totalPages: { type: Number },
    activeTab: { type: String },
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
    this.tickets = mockTickets;
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.activeTab = 'all';
    this.searchValue = '';
    this.tabs = [
      { id: 'all', label: 'All' },
      { id: 'pending', label: 'Pending' },
      { id: 'ongoing', label: 'Ongoing' },
      { id: 'completed', label: 'Archived/Complete' }
    ];

    this.updatePagination();
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  get filteredTickets() {
    let filtered = this.tickets;

    if (this.activeTab !== 'all') {
      if (this.activeTab === 'completed') {
        filtered = filtered.filter(t => t.status === 'completed' || t.status === 'closed');
      } else {
        filtered = filtered.filter(t => t.status === this.activeTab);
      }
    }

    if (this.searchValue) {
      const search = this.searchValue.toLowerCase();
      filtered = filtered.filter(t =>
        t.id?.toLowerCase().includes(search) ||
        t.userId?.toLowerCase().includes(search) ||
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
    if (action === 'view') console.log('View log:', item);
  }

  handlePageChange(e) {
    this.currentPage = e.detail.page;
  }

  handleExport() {
    console.log('Export tickets');
  }

  render() {
    return html`
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
            <app-button
              type="secondary"
              size="small"
              @click=${this.handleExport}>
              ${ICONS.export} Export
            </app-button>
            <search-bar-wrapper>
              <search-bar
                placeholder="Search tickets..."
                .value=${this.searchValue}
                .showFilter=${false}
                @search=${this.handleSearch}
                @search-input=${this.handleSearchInput}>
              </search-bar>
            </search-bar-wrapper>
          </search-wrapper>
        </header-controls>

        <data-table
          .data=${this.paginatedTickets}
          .conf=${ticketsTableConfig}
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

customElements.define('admin-ticket', AdminTicket);