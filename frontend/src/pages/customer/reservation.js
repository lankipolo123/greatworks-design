// customer-reservation.js
import { LitElement, html, css } from 'lit';
import { reservationTableConfig } from '/src/configs/reservation-config.js';
import '/src/components/data-table.js';
import '/src/components/pagination.js';
import '/src/components/tabs-component.js';
import '/src/components/search-bar.js';
import '/src/components/app-dialog.js';
import '/src/components/badge-component.js';
import '/src/layouts/header-controls.js';
import '/src/layouts/tabs-wrapper.js';
import '/src/layouts/search-wrapper.js';
import '/src/layouts/search-bar-wrapper.js';
import '/src/layouts/pagination-wrapper.js';
import { getTotalPages } from '@/utility/pagination-helpers.js';
import { reservations } from '/src/service/api.js';

// Customer only sees view action, no edit/delete
const customerTableConfig = {
  ...reservationTableConfig,
  actions: [
    { key: 'view', label: 'View', icon: 'visibility' }
  ]
};

class CustomerReservation extends LitElement {
  static properties = {
    reservation: { type: Array },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    totalPages: { type: Number },
    activeTab: { type: String },
    searchValue: { type: String },
    showDetailsDialog: { type: Boolean },
    selectedReservation: { type: Object },
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
      border: 1.25px solid #2d2b2b45;
    }

    .details-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .detail-item.full {
      grid-column: 1 / -1;
    }

    .detail-label {
      font-size: 0.7rem;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .detail-value {
      font-size: 0.85rem;
      font-weight: 500;
      color: #1a1a1a;
    }
  `;

  constructor() {
    super();
    this.reservation = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.activeTab = 'all';
    this.searchValue = '';
    this.showDetailsDialog = false;
    this.selectedReservation = null;
    this.tabs = [
      { id: 'all', label: 'All' },
      { id: 'upcoming', label: 'Upcoming' },
      { id: 'ongoing', label: 'Ongoing' },
      { id: 'completed', label: 'Archived/Complete' }
    ];

    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleTableAction = this.handleTableAction.bind(this);

    this._loadReservations();
  }

  async _loadReservations() {
    try {
      const response = await reservations.getAll({ per_page: 100 });
      const data = response.data || response;
      this.reservation = (Array.isArray(data) ? data : []).map(r => this._mapApiReservation(r));
      this.updatePagination();
    } catch (e) {
      console.error('Failed to load reservations:', e.message || e);
      this.reservation = [];
    }
  }

  _mapApiReservation(r) {
    return {
      id: r.id,
      userId: r.user?.name || r.user?.email || `User #${r.user_id}`,
      userName: r.user?.name || '',
      roomName: r.room?.name || (r.room_id ? `Room #${r.room_id}` : 'No room'),
      date: typeof r.date === 'string' ? r.date.split('T')[0] : r.date,
      time: typeof r.time === 'string' ? r.time.substring(0, 5) : r.time,
      guests: r.guests,
      status: r.status,
      notes: r.notes || '',
    };
  }

  get filteredReservations() {
    let filtered = this.reservation;

    if (this.activeTab === 'upcoming') {
      filtered = filtered.filter(r => r.status === 'upcoming' || r.status === 'pending');
    } else if (this.activeTab === 'ongoing') {
      filtered = filtered.filter(r => r.status === 'confirmed' || r.status === 'ongoing');
    } else if (this.activeTab === 'completed') {
      filtered = filtered.filter(r => r.status === 'completed' || r.status === 'cancelled');
    }

    if (this.searchValue) {
      const search = this.searchValue.toLowerCase();
      filtered = filtered.filter(r =>
        String(r.id)?.toLowerCase().includes(search) ||
        r.date?.toLowerCase().includes(search) ||
        r.status?.toLowerCase().includes(search)
      );
    }

    return filtered;
  }

  get paginatedReservation() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredReservations.slice(start, start + this.itemsPerPage);
  }

  updatePagination() {
    this.totalPages = getTotalPages(
      this.filteredReservations.length,
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

  handlePageChange(e) {
    this.currentPage = e.detail.page;
  }

  handleTableAction(e) {
    const { action, item } = e.detail;
    if (action === 'view') {
      this.selectedReservation = item;
      this.showDetailsDialog = true;
    }
  }

  handleDialogClose() {
    this.showDetailsDialog = false;
    this.selectedReservation = null;
  }

  _renderDetailsDialog() {
    if (!this.selectedReservation) return '';
    const r = this.selectedReservation;

    return html`
      <div class="details-content">
        <div class="detail-item">
          <span class="detail-label">Reservation ID</span>
          <span class="detail-value">${r.id}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Status</span>
          <badge-component variant="${r.status}" size="small">${r.status}</badge-component>
        </div>
        <div class="detail-item">
          <span class="detail-label">Room</span>
          <span class="detail-value">${r.roomName || '-'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Date</span>
          <span class="detail-value">${r.date ? new Date(r.date).toLocaleDateString() : '-'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Time</span>
          <span class="detail-value">${r.time}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Guests</span>
          <span class="detail-value">${r.guests}</span>
        </div>
        ${r.notes ? html`
          <div class="detail-item full">
            <span class="detail-label">Notes</span>
            <span class="detail-value">${r.notes}</span>
          </div>
        ` : ''}
      </div>
    `;
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
            <search-bar-wrapper>
              <search-bar
                placeholder="Search reservations..."
                .value=${this.searchValue}
                .showFilter=${false}
                @search=${this.handleSearch}
                @search-input=${this.handleSearchInput}>
              </search-bar>
            </search-bar-wrapper>
          </search-wrapper>
        </header-controls>

        <data-table
          .data=${this.paginatedReservation}
          .conf=${customerTableConfig}
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

      <!-- Reservation Details Dialog (read-only for customer) -->
      <app-dialog
        .isOpen=${this.showDetailsDialog}
        title="Reservation Details"
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

customElements.define('customer-reservation', CustomerReservation);
