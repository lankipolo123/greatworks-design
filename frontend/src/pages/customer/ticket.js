// customer-ticket.js
import { LitElement, html, css } from 'lit';
import { ticketsTableConfig } from '/src/configs/tickets-config';
import { tickets as ticketsApi } from '/src/service/api.js';
import { appState } from '/src/utility/app-state.js';
import '@/components/data-table.js';
import '@/components/tabs-component.js';
import '@/components/search-bar.js';
import '@/components/app-dialog.js';
import '@/layouts/header-controls.js';
import '@/layouts/tabs-wrapper.js';
import '@/layouts/search-wrapper.js';
import '@/layouts/search-bar-wrapper.js';
import '@/layouts/pagination-wrapper.js';
import '@/components/pagination.js';
import '@/components/stat-card.js';
import '@/components/app-button.js';
import { ICONS } from '/src/components/dashboard-icons.js';
import { getTotalPages } from '@/utility/pagination-helpers.js';

class CustomerTicket extends LitElement {
  static properties = {
    tickets: { type: Array },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    totalPages: { type: Number },
    activeTab: { type: String },
    searchValue: { type: String },
    showTicketDialog: { type: Boolean },
    showCreateDialog: { type: Boolean },
    selectedTicket: { type: Object },
    pendingTicketId: { type: Number },
    _loaded: { type: Boolean, state: true },
    _submitting: { type: Boolean, state: true },
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
  `;

  constructor() {
    super();
    this.tickets = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.activeTab = 'all';
    this.searchValue = '';
    this.showTicketDialog = false;
    this.showCreateDialog = false;
    this.selectedTicket = null;
    this.pendingTicketId = null;
    this._loaded = false;
    this._submitting = false;
    this.tabs = [
      { id: 'all', label: 'All' },
      { id: 'open', label: 'Open' },
      { id: 'in_progress', label: 'In Progress' },
      { id: 'closed', label: 'Closed' }
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
      this._openPendingTicket();
    } catch (e) {
      console.error('Failed to fetch tickets:', e);
    } finally {
      this._loaded = true;
    }
  }

  updated(changed) {
    super.updated?.(changed);
    if (changed.has('pendingTicketId') && this.pendingTicketId && this.tickets.length) {
      this._openPendingTicket();
    }
  }

  _openPendingTicket() {
    if (!this.pendingTicketId || !this.tickets.length) return;
    const ticket = this.tickets.find(t => t.id === this.pendingTicketId);
    if (ticket) {
      this.selectedTicket = ticket;
      this.showTicketDialog = true;
      this.pendingTicketId = null;
      this.dispatchEvent(new CustomEvent('ticket-opened', { bubbles: true, composed: true }));
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

  handleDialogClose() {
    this.showTicketDialog = false;
    this.showCreateDialog = false;
    this.selectedTicket = null;
  }

  handleRequestTicket() {
    this.showCreateDialog = true;
  }

  async handleCreateSubmit(e) {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) return;
    this._submitting = true;
    try {
      await ticketsApi.create({
        subject: form.subject.value,
        message: form.message.value,
      });
      this.showCreateDialog = false;
      form.reset();
      appState.emit('data-changed');
    } catch (err) {
      console.error('Failed to create ticket:', err);
    } finally {
      this._submitting = false;
    }
  }

  get _totalCount() { return this.tickets.length; }
  get _openCount() { return this.tickets.filter(t => t.status === 'open').length; }
  get _inProgressCount() { return this.tickets.filter(t => t.status === 'in_progress').length; }
  get _closedCount() { return this.tickets.filter(t => t.status === 'closed').length; }

  render() {
    return html`
      <div class="stats-row">
        <stat-card
          title="Total Tickets"
          textColor="#580460"
          .value=${this._loaded ? this._totalCount : '--'}
          .icon=${ICONS.ticketInbox}>
        </stat-card>
        <stat-card
          title="Open"
          textColor="#0a5e81"
          .value=${this._loaded ? this._openCount : '--'}
          .icon=${ICONS.ticket}>
        </stat-card>
        <stat-card
          title="In Progress"
          textColor="#ffac05"
          .value=${this._loaded ? this._inProgressCount : '--'}
          .icon=${ICONS.clock}>
        </stat-card>
        <stat-card
          title="Closed"
          textColor="#67ab07"
          .value=${this._loaded ? this._closedCount : '--'}
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
                placeholder="Search tickets..."
                .value=${this.searchValue}
                .showFilter=${false}
                @search=${this.handleSearch}
                @search-input=${this.handleSearchInput}>
              </search-bar>
            </search-bar-wrapper>
            <app-button
              type="primary"
              size="small"
              @click=${this.handleRequestTicket}>
              ${ICONS.plus} Request a Ticket
            </app-button>
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

      <app-dialog
        .isOpen=${this.showTicketDialog}
        .title=${this.selectedTicket?.subject || 'Ticket Details'}
        mode="ticket"
        size="medium"
        styleMode="compact"
        .hideFooter=${true}
        .closeOnOverlay=${true}
        .ticketData=${this.selectedTicket}
        @dialog-close=${this.handleDialogClose}>
      </app-dialog>

      <app-dialog
        .isOpen=${this.showCreateDialog}
        title="Request a Ticket"
        size="medium"
        styleMode="compact"
        .hideFooter=${true}
        .closeOnOverlay=${true}
        @dialog-close=${this.handleDialogClose}>
        <form @submit=${this.handleCreateSubmit}>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <label style="font-size:0.8rem;font-weight:600;color:#333;">Subject</label>
            <input name="subject" required placeholder="Brief summary of your issue"
              style="padding:0.5rem 0.75rem;border:1.25px solid #2d2b2b45;border-radius:8px;font-size:0.85rem;outline:none;">
            <label style="font-size:0.8rem;font-weight:600;color:#333;">Message</label>
            <textarea name="message" required rows="4" placeholder="Describe your issue in detail..."
              style="padding:0.5rem 0.75rem;border:1.25px solid #2d2b2b45;border-radius:8px;font-size:0.85rem;resize:vertical;outline:none;font-family:inherit;"></textarea>
            <app-button type="primary" size="small" .disabled=${this._submitting}
              @click=${(e) => e.target.closest('form').requestSubmit()}>
              ${this._submitting ? 'Submitting...' : 'Submit Ticket'}
            </app-button>
          </div>
        </form>
      </app-dialog>
    `;
  }
}

customElements.define('customer-ticket', CustomerTicket);
