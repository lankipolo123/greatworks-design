// customer-booking.js
import { LitElement, html, css } from 'lit';
import '/src/components/calendar-component.js';
import '/src/components/booking-sidebar.js';
import '/src/components/today-btn.js';
import '/src/components/content-card.js';
import '/src/components/pagination.js';
import '/src/layouts/calendar-section.js';
import '/src/layouts/calendar-sidebar-section.js';
import { mockReservations } from '/src/mock-datas/mock-reservation.js';
import { toast } from '/src/service/toast-widget.js';
import { toastSpamProtection } from '/src/utility/toast-anti-spam.js';
import { getTotalPages } from '/src/utility/pagination-helpers.js';

class CustomerBooking extends LitElement {
  static properties = {
    reservations: { type: Array },
    selectedDate: { type: String },
    selectedBookings: { type: Array },
    sidebarOpen: { type: Boolean },
    selectedRoomType: { type: String },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    totalPages: { type: Number },
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

    @media (max-width: 1024px) {
      content-card {
        flex-direction: column;
      }
    }
  `;

  constructor() {
    super();
    this.reservations = mockReservations.filter(r => r.status === 'confirmed');

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
    const { date, bookings } = e.detail;
    this.selectedDate = date;
    this.selectedBookings = bookings;
    this.currentPage = 1;
    this.totalPages = getTotalPages(bookings.length, this.itemsPerPage);

    localStorage.setItem('booking-selected-date', date);
    localStorage.setItem('booking-selected-bookings', JSON.stringify(bookings));

    if (bookings.length === 0) {
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
    const details = `Booking Details:\n━━━━━━━━━━━━━━━━\nID: ${booking.id}\nDate: ${booking.date}\nTime: ${booking.time}\nGuests: ${booking.guests}\nStatus: ${booking.status}${booking.space ? `\nSpace: ${booking.space}` : ''}${booking.notes ? `\nNotes: ${booking.notes}` : ''}`;
    alert(details);
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

  render() {
    return html`
      <content-card mode="3">
        <calendar-section>
          <booking-calendar
            .reservations=${this.reservations}
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
    `;
  }
}

customElements.define('customer-booking', CustomerBooking);
