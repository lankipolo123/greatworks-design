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
import '@/components/users-avatar.js';
import '@/components/badge-component.js';
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
    userLoading: { type: Boolean },
    showCredentialsDialog: { type: Boolean },
    generatedCredentials: { type: Object },
    sendingEmail: { type: Boolean },
    showDeleteDialog: { type: Boolean },
    deleteTarget: { type: Object },
    deleting: { type: Boolean },
    _loaded: { type: Boolean, state: true }
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

    .credentials-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .credentials-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .credentials-field label {
      font-size: 0.8rem;
      color: #888;
      font-weight: 500;
    }

    .credentials-field .value {
      font-size: 0.95rem;
      color: #333;
      padding: 10px 12px;
      background: #f5f5f5;
      border-radius: 6px;
      font-family: monospace;
      user-select: all;
      word-break: break-all;
    }

    .credentials-actions {
      display: flex;
      gap: 10px;
      margin-top: 8px;
    }

    .credentials-notice {
      font-size: 0.8rem;
      color: #888;
      font-style: italic;
      margin-top: 4px;
    }

    .user-profile-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e0e0e0;
    }

    .user-profile-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .user-profile-name {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1a1a1a;
    }

    .user-profile-email {
      font-size: 0.85rem;
      color: #666;
    }

    .user-profile-badges {
      display: flex;
      gap: 6px;
      margin-top: 2px;
    }

    .user-details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .user-detail-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .user-detail-label {
      font-size: 0.7rem;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .user-detail-value {
      font-size: 0.85rem;
      font-weight: 500;
      color: #1a1a1a;
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
    this.showCredentialsDialog = false;
    this.generatedCredentials = null;
    this.sendingEmail = false;
    this.showDeleteDialog = false;
    this.deleteTarget = null;
    this.deleting = false;
    this._loaded = false;
    this.tabs = [
      { id: 'all', label: 'All Users' },
      { id: 'customer', label: 'Customers' },
      { id: 'moderator', label: 'Moderator' },
      { id: 'admin', label: 'Admin' },
      { id: 'temporary', label: 'Temporary' },
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
    } finally {
      this._loaded = true;
    }
  }

  get filteredUsers() {
    let filtered = this.users;

    if (this.activeTab === 'customer') {
      filtered = filtered.filter(u => u.role === 'customer');
    } else if (this.activeTab === 'moderator') {
      filtered = filtered.filter(u => u.role === 'moderator');
    } else if (this.activeTab === 'admin') {
      filtered = filtered.filter(u => u.role === 'admin');
    } else if (this.activeTab === 'temporary') {
      filtered = filtered.filter(u => u.role === 'temporary');
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
    } else if (action === 'delete') {
      this.deleteTarget = item;
      this.showDeleteDialog = true;
    }
  }

  async handleConfirmDelete() {
    if (!this.deleteTarget) return;
    this.deleting = true;
    try {
      await usersApi.delete(this.deleteTarget.id);
      toast.success('User removed successfully!');
      this.showDeleteDialog = false;
      this.deleteTarget = null;
      this.fetchUsers();
    } catch (err) {
      const msg = err.message || 'Failed to remove user';
      toast.error(msg);
    } finally {
      this.deleting = false;
    }
  }

  handleDeleteDialogClose() {
    this.showDeleteDialog = false;
    this.deleteTarget = null;
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

      const role = getValue('role');
      const email = getValue('email');

      const payload = {
        name,
        email,
        phone: getValue('phone') || null,
        role,
        location_id: role === 'moderator' ? (getValue('location_id') || null) : null,
      };

      const result = await usersApi.create(payload);

      this.showAddDialog = false;
      this.fetchUsers();

      if (result.generated_password) {
        this.generatedCredentials = {
          userId: result.user?.id,
          name,
          email,
          password: result.generated_password,
        };
        this.showCredentialsDialog = true;
      } else {
        toast.success('User created successfully!');
      }
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

  async handleCopyPassword() {
    if (!this.generatedCredentials?.password) return;
    try {
      await navigator.clipboard.writeText(this.generatedCredentials.password);
      toast.success('Password copied to clipboard!');
    } catch {
      toast.error('Failed to copy password');
    }
  }

  async handleSendEmail() {
    if (!this.generatedCredentials) return;
    this.sendingEmail = true;
    try {
      await usersApi.sendWelcome(this.generatedCredentials.userId, this.generatedCredentials.password);
      toast.success('Welcome email sent successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to send email');
    } finally {
      this.sendingEmail = false;
    }
  }

  handleCredentialsClose() {
    this.showCredentialsDialog = false;
    this.generatedCredentials = null;
  }

  _renderUserDetails() {
    if (!this.selectedUser) return '';
    const u = this.selectedUser;

    const roleVariant = u.role?.toLowerCase() === 'admin' ? 'danger' :
      u.role?.toLowerCase() === 'moderator' ? 'info' :
        u.role?.toLowerCase() === 'temporary' ? 'warning' : 'technical';
    const statusVariant = u.status?.toLowerCase() === 'active' ? 'success' :
      u.status?.toLowerCase() === 'inactive' ? 'inactive' :
        u.status?.toLowerCase() === 'archived' ? 'archived' :
          u.status?.toLowerCase() === 'pending' ? 'pending' : 'primary';

    return html`
      <div class="user-profile-header">
        <user-avatar
          size="64"
          .src=${u.profile_photo || ''}
          .name=${u.name || ''}
          .gender=${u.gender || ''}>
        </user-avatar>
        <div class="user-profile-info">
          <div class="user-profile-name">${u.name}</div>
          <div class="user-profile-email">${u.email}</div>
          <div class="user-profile-badges">
            <badge-component variant="${roleVariant}" size="small">${u.role}</badge-component>
            <badge-component variant="${statusVariant}" size="small">${u.status}</badge-component>
          </div>
        </div>
      </div>
      <div class="user-details-grid">
        <div class="user-detail-item">
          <span class="user-detail-label">User ID</span>
          <span class="user-detail-value">${u.id}</span>
        </div>
        <div class="user-detail-item">
          <span class="user-detail-label">Phone</span>
          <span class="user-detail-value">${u.phone || '—'}</span>
        </div>
        <div class="user-detail-item">
          <span class="user-detail-label">Bookings</span>
          <span class="user-detail-value">${u.bookings_count ?? 0}</span>
        </div>
        <div class="user-detail-item">
          <span class="user-detail-label">Joined</span>
          <span class="user-detail-value">${u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</span>
        </div>
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
        size="medium"
        styleMode="compact"
        .hideFooter=${true}
        .closeOnOverlay=${true}
        @dialog-close=${this.handleDialogClose}>
        ${this._renderUserDetails()}
      </app-dialog>

      <app-dialog
        .isOpen=${this.showDeleteDialog}
        title="Remove User"
        description="This action cannot be undone."
        size="small"
        styleMode="compact"
        .closeOnOverlay=${false}
        .hideFooter=${true}
        @dialog-close=${this.handleDeleteDialogClose}>
        ${this.deleteTarget ? html`
          <div style="margin-bottom: 16px;">
            Are you sure you want to remove <strong>${this.deleteTarget.name}</strong> (${this.deleteTarget.email})?
          </div>
          <div class="credentials-actions" style="justify-content: flex-end;">
            <app-button type="secondary" size="medium" @click=${this.handleDeleteDialogClose} ?disabled=${this.deleting}>
              Cancel
            </app-button>
            <app-button type="danger" size="medium" @click=${() => this.handleConfirmDelete()} ?disabled=${this.deleting}>
              ${this.deleting ? 'Removing...' : 'Remove'}
            </app-button>
          </div>
        ` : ''}
      </app-dialog>

      <app-dialog
        .isOpen=${this.showCredentialsDialog}
        title="Account Created"
        description="Save these credentials before closing"
        size="small"
        styleMode="compact"
        .closeOnOverlay=${false}
        .hideFooter=${true}
        @dialog-close=${this.handleCredentialsClose}>
        ${this.generatedCredentials ? html`
          <div class="credentials-content">
            <div class="credentials-field">
              <label>Name</label>
              <div class="value">${this.generatedCredentials.name}</div>
            </div>
            <div class="credentials-field">
              <label>Email</label>
              <div class="value">${this.generatedCredentials.email}</div>
            </div>
            <div class="credentials-field">
              <label>Generated Password</label>
              <div class="value">${this.generatedCredentials.password}</div>
            </div>
            <div class="credentials-actions">
              <app-button type="secondary" size="medium" @click=${() => this.handleCopyPassword()}>
                Copy Password
              </app-button>
              <app-button
                type="primary"
                size="medium"
                @click=${() => this.handleSendEmail()}
                ?disabled=${this.sendingEmail}>
                ${this.sendingEmail ? 'Sending...' : 'Send to Email'}
              </app-button>
            </div>
            <div class="credentials-notice">
              This password will not be shown again after closing this dialog.
            </div>
            <div class="credentials-actions" style="justify-content: flex-end;">
              <app-button type="secondary" size="medium" @click=${this.handleCredentialsClose}>
                Done
              </app-button>
            </div>
          </div>
        ` : ''}
      </app-dialog>
    `;
  }
}

customElements.define('admin-user', AdminUser);