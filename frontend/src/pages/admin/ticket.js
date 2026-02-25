// src/pages/admin/ticket.js
import { LitElement, html, css } from 'lit';
import { ticketsTableConfig } from '/src/configs/tickets-config';
import { tickets as ticketsApi } from '/src/service/api.js';
import { appState } from '/src/utility/app-state.js';
import { ICONS } from '/src/components/dashboard-icons.js';
import '@/components/data-table.js';
import '@/components/tabs-component.js';
import '@/components/search-bar.js';
import '@/components/app-button.js';
import '@/components/app-dialog.js';
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
    searchValue: { type: String },
    showExportDialog: { type: Boolean },
    showTicketDialog: { type: Boolean },
    selectedTicket: { type: Object },
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
  `;

  constructor() {
    super();
    this.tickets = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.activeTab = 'all';
    this.searchValue = '';
    this.showExportDialog = false;
    this.showTicketDialog = false;
    this.selectedTicket = null;
    this._loaded = false;
    this.tabs = [
      { id: 'all', label: 'All' },
      { id: 'open', label: 'Open' },
      { id: 'progress', label: 'Progress' },
      { id: 'completed', label: 'Completed' }
    ];

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchTickets();
    this._unsub = appState.on('data-changed', () => this.fetchTickets());
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
    } catch (e) {
      console.error('Failed to fetch tickets:', e);
    } finally {
      this._loaded = true;
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
        t.user?.name?.toLowerCase().includes(search) ||
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

  handleExport() {
    this.showExportDialog = true;
  }

  handleExportSelect(e) {
    console.log('Export tickets as:', e.detail.format);
    this.showExportDialog = false;
  }

  handleTicketAction(e) {
    const { action, ticket } = e.detail;
    console.log(`Ticket ${action}:`, ticket);

    // Update ticket status based on action
    if (action === 'accept') {
      // Update ticket status to in_progress
      const index = this.tickets.findIndex(t => t.id === ticket.id);
      if (index !== -1) {
        this.tickets[index].status = 'in_progress';
        this.requestUpdate();
      }
    } else if (action === 'close') {
      // Update ticket status to closed
      const index = this.tickets.findIndex(t => t.id === ticket.id);
      if (index !== -1) {
        this.tickets[index].status = 'closed';
        this.requestUpdate();
      }
    }

    this.showTicketDialog = false;
  }

  handleDialogClose() {
    this.showExportDialog = false;
    this.showTicketDialog = false;
    this.selectedTicket = null;
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

      <!-- Export Dialog -->
      <app-dialog
        .isOpen=${this.showExportDialog}
        title="Export Tickets"
        description="Select export format and date range"
        mode="export"
        size="medium"
        styleMode="clean"
        .closeOnOverlay=${false}
        @export-select=${this.handleExportSelect}
        @dialog-close=${this.handleDialogClose}>
      </app-dialog>

      <!-- Ticket View Dialog -->
      <app-dialog
        .isOpen=${this.showTicketDialog}
        .title=${this.selectedTicket?.subject || 'Ticket Details'}
        mode="ticket"
        size="medium"
        styleMode="compact"
        .hideFooter=${true}
        .closeOnOverlay=${true}
        .ticketData=${this.selectedTicket}
        @ticket-action=${this.handleTicketAction}
        @dialog-close=${this.handleDialogClose}>
      </app-dialog>
    `;
  }
}

customElements.define('admin-ticket', AdminTicket);