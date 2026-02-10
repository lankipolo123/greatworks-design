// customer-booking.js
import { LitElement, html, css } from 'lit';
import '/src/components/calendar-component.js';
import '/src/components/booking-sidebar.js';
import '/src/components/today-btn.js';
import '/src/components/content-card.js';
import '/src/components/pagination.js';
import '/src/components/app-dialog.js';
import '/src/components/badge-component.js';
import '/src/layouts/calendar-section.js';
import '/src/layouts/calendar-sidebar-section.js';
import { mockBookings } from '/src/mock-datas/mock-booking.js';
import { toast } from '/src/service/toast-widget.js';
import { toastSpamProtection } from '/src/utility/toast-anti-spam.js';
import { getTotalPages } from '/src/utility/pagination-helpers.js';
import { bookings } from '/src/service/api.js';

class CustomerBooking extends LitElement {
  static properties = {
    allBookings: { type: Array },
    selectedDate: { type: String },
    selectedBookings: { type: Array },
    sidebarOpen: { type: Boolean },
    selectedRoomType: { type: String },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    totalPages: { type: Number },
    showDetailsDialog: { type: Boolean },
    selectedBooking: { type: Object },
    isApiMode: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      box-sizing: border-box;
      background: #ffffff;
      position: relative;
    }

    content-card {
      gap: 1.5rem;
    }

    .toggle-btn {
      background: #302d30;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .toggle-btn:hover {
      text-decoration: underline;
      background: #383438;
      color: #ffffff;
      transform: translateY(-1px);
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

    @media (max-width: 1024px) {
      content-card {
        flex-direction: column;
      }
    }
  `;

  constructor() {
    super();
    this.allBookings = [];
    this.isApiMode = false;

    const savedDate = localStorage.getItem('booking-selected-date');
    const savedBookings = localStorage.getItem('booking-selected-bookings');

    this.selectedDate = savedDate || null;
    this.selectedBookings = savedBookings ? JSON.parse(savedBookings) : [];

    const savedState = localStorage.getItem('booking-sidebar-open');
    this.sidebarOpen = savedState === 'true';

    this.selectedRoomType = 'all';
    this.currentPage = 1;
    this.itemsPerPage = 5;
    this.totalPages = getTotalPages(this.selectedBookings.length, this.itemsPerPage);
    this.showDetailsDialog = false;
    this.selectedBooking = null;

    this._loadBookings();
  }

  async _loadBookings() {
    try {
      const response = await bookings.getAll({ per_page: 100 });
      const data = response.data || response;
      this.allBookings = (Array.isArray(data) ? data : []).map(b => this._mapApiBooking(b));
      this.isApiMode = true;

      if (this.selectedDate) {
        this.selectedBookings = this.allBookings.filter(b => b.date === this.selectedDate);
        this.totalPages = getTotalPages(this.selectedBookings.length, this.itemsPerPage);
      }
    } catch (e) {
      console.warn('API unavailable, using mock data:', e.message || e);
      this.allBookings = mockBookings;
      this.isApiMode = false;
    }
  }

  _mapApiBooking(b) {
    return {
      id: b.id,
      userId: b.user?.name || b.user?.email || `User #${b.user_id}`,
      userName: b.user?.name || '',
      roomName: b.room?.name || `Room #${b.room_id}`,
      date: typeof b.date === 'string' ? b.date.split('T')[0] : b.date,
      startTime: typeof b.start_time === 'string' ? b.start_time.substring(0, 5) : b.start_time,
      time: typeof b.start_time === 'string' ? b.start_time.substring(0, 5) : b.start_time,
      durationHours: b.duration_hours,
      guests: b.guests,
      status: b.status,
      notes: b.notes || '',
    };
  }

  get paginatedBookings() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.selectedBookings.slice(start, start + this.itemsPerPage);
  }

  get filteredBookings() {
    if (this.selectedRoomType === 'all') {
      return this.selectedBookings;
    }
    return this.selectedBookings.filter(b => b.roomType === this.selectedRoomType);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    localStorage.setItem('booking-sidebar-open', this.sidebarOpen.toString());
  }

  handleDayClick(e) {
    const { date, bookings: dayBookings } = e.detail;
    this.selectedDate = date;

    if (this.isApiMode && this.allBookings.length > 0) {
      this.selectedBookings = this.allBookings.filter(b => b.date === date);
    } else {
      this.selectedBookings = dayBookings || [];
    }

    this.currentPage = 1;
    this.totalPages = getTotalPages(this.selectedBookings.length, this.itemsPerPage);

    localStorage.setItem('booking-selected-date', date);
    localStorage.setItem('booking-selected-bookings', JSON.stringify(this.selectedBookings));

    if (this.selectedBookings.length === 0) {
      toastSpamProtection.handleToast(
        date,
        () => toast.info('No bookings on this date'),
        () => toast.warning('Please don\'t spam! Wait a moment before clicking again.', 6000)
      );
    } else {
      if (!this.sidebarOpen) {
        this.sidebarOpen = true;
        localStorage.setItem('booking-sidebar-open', 'true');
      }
    }
  }

  handleBookingSelect(e) {
    const { booking } = e.detail;
    this.selectedBooking = booking;
    this.showDetailsDialog = true;
  }

  handleDialogClose() {
    this.showDetailsDialog = false;
    this.selectedBooking = null;
  }

  handleRoomTypeChange(e) {
    this.selectedRoomType = e.detail.roomType;
    this.currentPage = 1;
    this.totalPages = getTotalPages(this.filteredBookings.length, this.itemsPerPage);
  }

  handlePageChange(e) {
    this.currentPage = e.detail.page;
  }

  handleTodayClick() {
    const calendar = this.shadowRoot.querySelector('booking-calendar');
    if (calendar) {
      const now = new Date();
      calendar.month = now.getMonth();
      calendar.year = now.getFullYear();
    }
  }

  _renderDetailsDialog() {
    if (!this.selectedBooking) return '';
    const b = this.selectedBooking;

    return html`
      <div class="details-content">
        <div class="detail-item">
          <span class="detail-label">Booking ID</span>
          <span class="detail-value">${b.id}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Status</span>
          <badge-component variant="${b.status}" size="small">${b.status}</badge-component>
        </div>
        <div class="detail-item">
          <span class="detail-label">Room</span>
          <span class="detail-value">${b.roomName || '-'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Date</span>
          <span class="detail-value">${b.date ? new Date(b.date).toLocaleDateString() : '-'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Time</span>
          <span class="detail-value">${b.startTime || b.time}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Duration</span>
          <span class="detail-value">${b.durationHours}h</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Guests</span>
          <span class="detail-value">${b.guests}</span>
        </div>
        ${b.notes ? html`
          <div class="detail-item full">
            <span class="detail-label">Notes</span>
            <span class="detail-value">${b.notes}</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  render() {
    return html`
      <content-card mode="3">
        <calendar-section>
          <booking-calendar
            .reservations=${this.allBookings.length > 0 ? this.allBookings.filter(b => b.status === 'confirmed' || b.status === 'pending') : mockBookings.filter(b => b.status === 'confirmed')}
            .selectedDate=${this.selectedDate}
            @day-click=${this.handleDayClick}>

            <today-button
              slot="today-btn"
              @today-click=${this.handleTodayClick}>
            </today-button>
            <button
              slot="controls"
              class="toggle-btn"
              @click=${this.toggleSidebar}>
              ${this.sidebarOpen ? 'X' : 'Details'}
            </button>
          </booking-calendar>
        </calendar-section>

        <sidebar-section class="${this.sidebarOpen ? '' : 'closed'}">
          <booking-sidebar
            .selectedDate=${this.selectedDate}
            .bookings=${this.paginatedBookings}
            .selectedRoomType=${this.selectedRoomType}
            @booking-select=${this.handleBookingSelect}
            @room-type-change=${this.handleRoomTypeChange}>
            <pagination-component
              slot="pagination"
              .currentPage=${this.currentPage}
              .totalPages=${this.totalPages}
              mode="2"
              @pagination-change=${this.handlePageChange}
            ></pagination-component>
          </booking-sidebar>
        </sidebar-section>
      </content-card>

      <!-- Booking Details Dialog (read-only for customer) -->
      <app-dialog
        .isOpen=${this.showDetailsDialog}
        title="Booking Details"
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

customElements.define('customer-booking', CustomerBooking);
