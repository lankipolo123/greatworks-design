// src/pages/admin/user.js
import { LitElement, html, css } from 'lit';
import { usersTableConfig } from '/src/configs/users-config';
import { users as usersApi } from '/src/service/api.js';
import { appState } from '/src/utility/app-state.js';
import { ICONS } from '/src/components/dashboard-icons.js';
import { getTotalPages } from '/src/utility/pagination-helpers.js';
import '@/components/data-table.js';
import '@/components/tabs-component.js';
import '@/components/search-bar.js';
import '@/components/app-button.js';
import '@/components/app-dialog.js';
import '@/components/add-user-form.js';
import '@/layouts/header-controls.js';
import '@/layouts/tabs-wrapper.js';
import '@/layouts/search-wrapper.js';
import '@/layouts/search-bar-wrapper.js';
import '@/layouts/pagination-wrapper.js';
import '@/components/pagination.js';
import '@/components/content-card.js';
import { toast } from '/src/service/toast-widget.js';

class AdminUser extends LitElement {
  static properties = {
    users: { type: Array },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    totalPages: { type: Number },
    activeTab: { type: String },
    searchValue: { type: String },
    showAddDialog: { type: Boolean },
    showExportDialog: { type: Boolean },
    showDetailsDialog: { type: Boolean },
    selectedUser: { type: Object },
    userLoading: { type: Boolean }
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
    this.users = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.activeTab = 'all';
    this.searchValue = '';
    this.showAddDialog = false;
    this.showExportDialog = false;
    this.showDetailsDialog = false;
    this.selectedUser = null;
    this.userLoading = false;
    this.tabs = [
      { id: 'all', label: 'All Users' },
      { id: 'moderator', label: 'Moderator' },
      { id: 'admin', label: 'Admin' },
      { id: 'archived', label: 'Archived' }
    ];

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchUsers();
    this._unsub = appState.on('data-changed', () => this.fetchUsers());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsub) this._unsub();
  }

  async fetchUsers() {
    try {
      const data = await usersApi.getAll({ per_page: 100 });
      this.users = data.data || data;
      this.updatePagination();
    } catch (e) {
      console.error('Failed to fetch users:', e);
    }
  }

  get filteredUsers() {
    let filtered = this.users;

    if (this.activeTab === 'moderator') {
      filtered = filtered.filter(u => u.role === 'moderator');
    } else if (this.activeTab === 'admin') {
      filtered = filtered.filter(u => u.role === 'admin');
    } else if (this.activeTab === 'archived') {
      filtered = filtered.filter(u => u.status === 'archived' || u.status === 'inactive');
    }

    if (this.searchValue) {
      const search = this.searchValue.toLowerCase();
      filtered = filtered.filter(u =>
        u.id?.toString().includes(search) ||
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
    if (action === 'view') {
      this.selectedUser = item;
      this.showDetailsDialog = true;
    }
  }

  handlePageChange(e) {
    this.currentPage = e.detail.page;
  }

  handleAddUser() {
    this.showAddDialog = true;
  }

  handleExport() {
    this.showExportDialog = true;
  }

  handleExportSelect(e) {
    console.log('Export users as:', e.detail.format);
    this.showExportDialog = false;
  }

  handleDialogClose() {
    this.showAddDialog = false;
    this.showExportDialog = false;
    this.showDetailsDialog = false;
    this.selectedUser = null;
  }

  async handleAddUserSubmit() {
    this.userLoading = true;

    try {
      const formRoot = this.shadowRoot.querySelector('add-user-form').shadowRoot;
      const form = formRoot.getElementById('user-form');

      if (!form.checkValidity()) {
        form.reportValidity();
        this.userLoading = false;
        return;
      }

      const getValue = (name) => {
        const el = formRoot.querySelector(`[name="${name}"]`);
        return el?.value || '';
      };

      const firstName = getValue('firstName');
      const lastName = getValue('lastName');
      const name = [firstName, lastName].filter(Boolean).join(' ');

      await usersApi.create({
        name,
        email: getValue('email'),
        password: getValue('password'),
        phone: getValue('phone') || null,
        role: getValue('role'),
      });

      toast.success('User created successfully!');
      this.showAddDialog = false;
      this.fetchUsers();
    } catch (err) {
      console.error('Create user failed:', err);
      const msg = err.errors ? Object.values(err.errors)[0] : err.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg || 'Failed to create user'));
    } finally {
      this.userLoading = false;
    }
  }

  handleCancelDialog() {
    this.showAddDialog = false;
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
        .isOpen=${this.showAddDialog}
        title="Add Users"
        description="Enter description here"
        size="medium"
        styleMode="compact"
        .closeOnOverlay=${false}
        .hideFooter=${true}
        @dialog-close=${this.handleDialogClose}>
        <add-user-form>
          <app-button 
            slot="actions" 
            type="secondary" 
            size="medium" 
            @click=${this.handleCancelDialog} 
            ?disabled=${this.userLoading}>
            Cancel
          </app-button>
          <app-button
            slot="actions"
            type="primary"
            size="medium"
            @click=${() => this.handleAddUserSubmit()}
            ?disabled=${this.userLoading}>
            ${this.userLoading ? 'Saving...' : 'Save changes'}
          </app-button>
        </add-user-form>
      </app-dialog>

      <app-dialog
        .isOpen=${this.showExportDialog}
        title="Export Users"
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
        title="User Details"
        mode="details"
        size="medium"
        styleMode="compact"
        .hideFooter=${true}
        .closeOnOverlay=${true}
        .detailsData=${this.selectedUser}
        @dialog-close=${this.handleDialogClose}>
      </app-dialog>
    `;
  }
}

customElements.define('admin-user', AdminUser);