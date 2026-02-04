// src/pages/admin/reservation.js
import { LitElement, html, css } from 'lit';
import { reservationTableConfig } from '/src/configs/reservation-config.js';
import { mockReservations } from '/src/mock-datas/mock-reservation';
import { ICONS } from '/src/components/dashboard-icons.js';
import '/src/components/data-table.js';
import '/src/components/pagination.js';
import '/src/components/tabs-component.js';
import '/src/components/search-bar.js';
import '/src/components/app-button.js';
import '/src/layouts/header-controls.js';
import '/src/layouts/tabs-wrapper.js';
import '/src/layouts/search-wrapper.js';
import '/src/layouts/search-bar-wrapper.js';
import '/src/layouts/pagination-wrapper.js';
import { getTotalPages } from '@/utility/pagination-helpers.js';

class AdminReservation extends LitElement {
  static properties = {
    reservation: { type: Array },
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
      border: 1.25px solid #2d2b2b45;
    }
  `;

  constructor() {
    super();
    this.reservation = mockReservations;
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.activeTab = 'all';
    this.searchValue = '';
    this.tabs = [
      { id: 'all', label: 'All' },
      { id: 'upcoming', label: 'Upcoming' },
      { id: 'ongoing', label: 'Ongoing' },
      { id: 'completed', label: 'Archived/Complete' }
    ];

    this.updatePagination();
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleTableAction = this.handleTableAction.bind(this);
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
        r.id?.toLowerCase().includes(search) ||
        r.userId?.toLowerCase().includes(search) ||
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
    console.log('Reservation action:', action, item);
  }

  handleAddReservation() {
    console.log('Add new reservation');
  }

  handleExport() {
    console.log('Export reservations');
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
              type="tertiary"
              size="small"
              @click=${this.handleAddReservation}>
              ${ICONS.plus} Reservation
            </app-button>
            <app-button
              type="secondary"
              size="small"
              @click=${this.handleExport}>
              ${ICONS.export} Export
            </app-button>
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
          .conf=${reservationTableConfig}
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

customElements.define('admin-reservation', AdminReservation);