// src/pages/admin/user.js
import { LitElement, html, css } from 'lit';
import { mockUsers } from '/src/mock-datas/mock-users';
import { usersTableConfig } from '/src/configs/users-config';
import { ICONS } from '/src/components/dashboard-icons.js';
import { getTotalPages } from '/src/utility/pagination-helpers.js';
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
import '@/components/content-card.js';

class AdminUser extends LitElement {
  static properties = {
    users: { type: Array },
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

    content-card {
      display: block;
    }
  `;

  constructor() {
    super();
    this.users = mockUsers;
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.activeTab = 'all';
    this.searchValue = '';
    this.tabs = [
      { id: 'all', label: 'All Users' },
      { id: 'admin', label: 'Admin' },
      { id: 'archived', label: 'Archived' }
    ];

    this.updatePagination();
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  get filteredUsers() {
    let filtered = this.users;

    if (this.activeTab === 'admin') {
      filtered = filtered.filter(u => u.role === 'admin');
    } else if (this.activeTab === 'archived') {
      filtered = filtered.filter(u => u.status === 'archived' || u.status === 'inactive');
    }

    if (this.searchValue) {
      const search = this.searchValue.toLowerCase();
      filtered = filtered.filter(u =>
        u.id?.toLowerCase().includes(search) ||
        u.name?.toLowerCase().includes(search) ||
        u.email?.toLowerCase().includes(search) ||
        u.role?.toLowerCase().includes(search)
      );
    }

    return filtered;
  }

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(start, start + this.itemsPerPage);
  }

  updatePagination() {
    this.totalPages = getTotalPages(
      this.filteredUsers.length,
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

  handleAddUser() {
    console.log('Add new user');
  }

  handleExport() {
    console.log('Export users');
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
              @click=${this.handleAddUser}>
              ${ICONS.plus} New User
            </app-button>
            <app-button
              type="secondary"
              size="small"
              @click=${this.handleExport}>
              ${ICONS.export} Export
            </app-button>
            <search-bar-wrapper width="small">
              <search-bar
                placeholder="Search users..."
                .value=${this.searchValue}
                .showFilter=${false}
                @search=${this.handleSearch}
                @search-input=${this.handleSearchInput}>
              </search-bar>
            </search-bar-wrapper>
          </search-wrapper>
        </header-controls>

        <data-table
          .data=${this.paginatedUsers}
          .conf=${usersTableConfig}
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

customElements.define('admin-user', AdminUser);