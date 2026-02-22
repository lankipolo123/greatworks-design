// src/pages/admin/reservation.js
import { LitElement, html, css } from 'lit';
import { reservationTableConfig } from '/src/configs/reservation-config.js';
import { ICONS } from '/src/components/dashboard-icons.js';
import '/src/components/data-table.js';
import '/src/components/pagination.js';
import '/src/components/tabs-component.js';
import '/src/components/search-bar.js';
import '/src/components/app-button.js';
import '/src/components/app-dialog.js';
import '/src/components/book-someone-form.js';
import '/src/components/badge-component.js';
import '/src/layouts/header-controls.js';
import '/src/layouts/tabs-wrapper.js';
import '/src/layouts/search-wrapper.js';
import '/src/layouts/search-bar-wrapper.js';
import '/src/layouts/pagination-wrapper.js';
import { getTotalPages } from '@/utility/pagination-helpers.js';
import { toast } from '/src/service/toast-widget.js';
import { reservations } from '/src/service/api.js';
import { appState } from '/src/utility/app-state.js';

class AdminReservation extends LitElement {
  static properties = {
    reservation: { type: Array },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    totalPages: { type: Number },
    activeTab: { type: String },
    searchValue: { type: String },
    showAddDialog: { type: Boolean },
    showExportDialog: { type: Boolean },
    showDetailsDialog: { type: Boolean },
    showEditDialog: { type: Boolean },
    showDeleteDialog: { type: Boolean },
    selectedReservation: { type: Object },
    reservationLoading: { type: Boolean },
    editLoading: { type: Boolean },
    deleteLoading: { type: Boolean }
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

    .details-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #e0e0e0;
    }

    .delete-warning {
      text-align: center;
      padding: 1rem 0;
    }

    .delete-warning p {
      font-size: 0.9rem;
      color: #333;
      margin: 0 0 0.5rem;
    }

    .delete-warning .reservation-id {
      font-weight: 700;
      color: #721c24;
    }

    .delete-actions {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 1rem;
    }
  `;

  constructor() {
    super();
    this.reservation = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.activeTab = 'all';
    this.searchValue = '';
    this.showAddDialog = false;
    this.showExportDialog = false;
    this.showDetailsDialog = false;
    this.showEditDialog = false;
    this.showDeleteDialog = false;
    this.selectedReservation = null;
    this.reservationLoading = false;
    this.editLoading = false;
    this.deleteLoading = false;
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

  connectedCallback() {
    super.connectedCallback();
    this._unsub = appState.on('data-changed', () => this._loadReservations());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsub) this._unsub();
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
      userEmail: r.user?.email || '',
      roomId: r.room_id,
      roomName: r.room?.name || (r.room_id ? `Room #${r.room_id}` : 'No room'),
      date: typeof r.date === 'string' ? r.date.split('T')[0] : r.date,
      time: typeof r.start_time === 'string' ? r.start_time.substring(0, 5) : (typeof r.time === 'string' ? r.time.substring(0, 5) : r.time),
      guests: r.guests,
      status: r.status,
      notes: r.notes || '',
      user_id: r.user_id,
      room_id: r.room_id,
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
    this.selectedReservation = item;

    if (action === 'view') {
      this.showDetailsDialog = true;
    } else if (action === 'edit') {
      this.showEditDialog = true;
    } else if (action === 'delete') {
      this.showDeleteDialog = true;
    }
  }

  handleAddReservation() {
    this.showAddDialog = true;
  }

  handleExport() {
    this.showExportDialog = true;
  }

  handleExportSelect(e) {
    console.log('Export reservations as:', e.detail.format);
    this.showExportDialog = false;
  }

  handleDialogClose() {
    this.showAddDialog = false;
    this.showExportDialog = false;
    this.showDetailsDialog = false;
    this.showEditDialog = false;
    this.showDeleteDialog = false;
    this.selectedReservation = null;
  }

  handleCancelDialog() {
    this.showAddDialog = false;
    this.showEditDialog = false;
    this.showDeleteDialog = false;
  }

  // ── Create ──
  async handleAddReservationSubmit(e) {
    e.preventDefault();
    this.reservationLoading = true;

    const form = this.shadowRoot.querySelector('#add-dialog book-someone-form')?.shadowRoot?.getElementById('book-form')
      || e.target;

    const formData = new FormData(form);
    const data = {
      user_id: formData.get('userId') || formData.get('user_id'),
      room_id: formData.get('roomId') || formData.get('room_id') || null,
      date: formData.get('date'),
      time: formData.get('time'),
      guests: parseInt(formData.get('guests') || '1'),
      notes: formData.get('notes') || ''
    };

    try {
      await reservations.create(data);
      toast.success('Reservation created successfully!');
      this.showAddDialog = false;
      await this._loadReservations();
    } catch (err) {
      toast.error(err.message || 'Failed to create reservation');
    } finally {
      this.reservationLoading = false;
    }
  }

  // ── Edit ──
  handleEditClick() {
    this.showDetailsDialog = false;
    this.showEditDialog = true;
  }

  async handleEditSubmit(e) {
    e.preventDefault();
    if (!this.selectedReservation) return;
    this.editLoading = true;

    const form = this.shadowRoot.querySelector('#edit-dialog book-someone-form')?.shadowRoot?.getElementById('book-form')
      || e.target;

    const formData = new FormData(form);
    const data = {};

    const roomId = formData.get('roomId') || formData.get('room_id');
    if (roomId) data.room_id = parseInt(roomId);

    const date = formData.get('date');
    if (date) data.date = date;

    const time = formData.get('time');
    if (time) data.time = time;

    const guests = formData.get('guests');
    if (guests) data.guests = parseInt(guests);

    const notes = formData.get('notes');
    if (notes !== null && notes !== undefined) data.notes = notes;

    try {
      await reservations.update(this.selectedReservation.id, data);
      toast.success('Reservation updated successfully!');
      this.showEditDialog = false;
      this.selectedReservation = null;
      await this._loadReservations();
    } catch (err) {
      toast.error(err.message || 'Failed to update reservation');
    } finally {
      this.editLoading = false;
    }
  }

  // ── Delete ──
  handleDeleteClick() {
    this.showDetailsDialog = false;
    this.showDeleteDialog = true;
  }

  async handleDeleteConfirm() {
    if (!this.selectedReservation) return;
    this.deleteLoading = true;

    try {
      await reservations.delete(this.selectedReservation.id);
      toast.success('Reservation deleted successfully!');
      this.showDeleteDialog = false;
      this.selectedReservation = null;
      await this._loadReservations();
    } catch (err) {
      toast.error(err.message || 'Failed to delete reservation');
    } finally {
      this.deleteLoading = false;
    }
  }

  // ── Status change ──
  async handleStatusChange(newStatus) {
    if (!this.selectedReservation) return;

    try {
      await reservations.update(this.selectedReservation.id, { status: newStatus });
      toast.success(`Reservation ${newStatus} successfully!`);
      this.showDetailsDialog = false;
      this.selectedReservation = null;
      await this._loadReservations();
    } catch (err) {
      toast.error(err.message || `Failed to ${newStatus} reservation`);
    }
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
          <span class="detail-label">User</span>
          <span class="detail-value">${r.userName || r.userId}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Room</span>
          <span class="detail-value">${r.roomName || 'No room assigned'}</span>
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
      <div class="details-actions">
        ${r.status === 'pending' ? html`
          <app-button type="success" size="small" @click=${() => this.handleStatusChange('confirmed')}>
            Confirm
          </app-button>
          <app-button type="warning" size="small" @click=${() => this.handleStatusChange('cancelled')}>
            Cancel Reservation
          </app-button>
        ` : ''}
        ${r.status === 'confirmed' ? html`
          <app-button type="success" size="small" @click=${() => this.handleStatusChange('completed')}>
            Complete
          </app-button>
          <app-button type="warning" size="small" @click=${() => this.handleStatusChange('cancelled')}>
            Cancel Reservation
          </app-button>
        ` : ''}
        <app-button type="secondary" size="small" @click=${this.handleEditClick}>
          Edit
        </app-button>
        <app-button type="danger" size="small" @click=${this.handleDeleteClick}>
          Delete
        </app-button>
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

      <!-- Add Reservation Dialog -->
      <app-dialog
        id="add-dialog"
        .isOpen=${this.showAddDialog}
        title="Add Reservation"
        description="Fill in the reservation details"
        size="large"
        styleMode="compact"
        .closeOnOverlay=${false}
        .hideFooter=${true}
        @dialog-close=${this.handleDialogClose}>
        <book-someone-form>
          <app-button
            slot="actions"
            type="warning"
            size="medium"
            @click=${this.handleCancelDialog}
            ?disabled=${this.reservationLoading}>
            Cancel
          </app-button>
          <app-button
            slot="actions"
            type="primary"
            size="medium"
            @click=${(e) => {
        const form = this.shadowRoot.querySelector('#add-dialog book-someone-form')?.shadowRoot?.getElementById('book-form');
        if (form && form.checkValidity()) {
          this.handleAddReservationSubmit(new Event('submit', { cancelable: true, target: form }));
          e.preventDefault();
        } else if (form) {
          form.reportValidity();
        }
      }}
            ?disabled=${this.reservationLoading}>
            ${this.reservationLoading ? 'Creating...' : 'Create Reservation'}
          </app-button>
        </book-someone-form>
      </app-dialog>

      <!-- Export Dialog -->
      <app-dialog
        .isOpen=${this.showExportDialog}
        title="Export Reservations"
        description="Select export format and date range"
        mode="export"
        size="medium"
        styleMode="clean"
        .closeOnOverlay=${false}
        @export-select=${this.handleExportSelect}
        @dialog-close=${this.handleDialogClose}>
      </app-dialog>

      <!-- Details Dialog -->
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

      <!-- Edit Dialog -->
      <app-dialog
        id="edit-dialog"
        .isOpen=${this.showEditDialog}
        title="Edit Reservation"
        description="Update the reservation details"
        size="large"
        styleMode="compact"
        .closeOnOverlay=${false}
        .hideFooter=${true}
        @dialog-close=${this.handleDialogClose}>
        <book-someone-form .booking=${this.selectedReservation}>
          <app-button slot="actions" type="warning" size="medium" @click=${this.handleCancelDialog} ?disabled=${this.editLoading}>
            Cancel
          </app-button>
          <app-button slot="actions" type="primary" size="medium" @click=${(e) => {
        const form = this.shadowRoot.querySelector('#edit-dialog book-someone-form')?.shadowRoot?.getElementById('book-form');
        if (form && form.checkValidity()) {
          this.handleEditSubmit(new Event('submit', { cancelable: true, target: form }));
          e.preventDefault();
        } else if (form) {
          form.reportValidity();
        }
      }} ?disabled=${this.editLoading}>
            ${this.editLoading ? 'Updating...' : 'Update Reservation'}
          </app-button>
        </book-someone-form>
      </app-dialog>

      <!-- Delete Confirmation Dialog -->
      <app-dialog
        .isOpen=${this.showDeleteDialog}
        title="Delete Reservation"
        size="small"
        styleMode="compact"
        .hideFooter=${true}
        .closeOnOverlay=${true}
        @dialog-close=${this.handleDialogClose}>
        <div class="delete-warning">
          <p>Are you sure you want to delete this reservation?</p>
          ${this.selectedReservation ? html`
            <p>Reservation <span class="reservation-id">#${this.selectedReservation.id}</span> for <strong>${this.selectedReservation.userName || this.selectedReservation.userId}</strong></p>
          ` : ''}
          <p style="font-size: 0.75rem; color: #888;">This action cannot be undone.</p>
        </div>
        <div class="delete-actions">
          <app-button type="secondary" size="medium" @click=${this.handleCancelDialog} ?disabled=${this.deleteLoading}>
            Cancel
          </app-button>
          <app-button type="danger" size="medium" @click=${this.handleDeleteConfirm} ?disabled=${this.deleteLoading}>
            ${this.deleteLoading ? 'Deleting...' : 'Delete'}
          </app-button>
        </div>
      </app-dialog>
    `;
  }
}

customElements.define('admin-reservation', AdminReservation);
