// src/pages/admin/booking.js
import { LitElement, html, css } from 'lit';
import '/src/components/calendar-component.js';
import '/src/components/booking-sidebar.js';
import '/src/components/today-btn.js';
import '/src/components/content-card.js';
import '/src/components/pagination.js';
import '/src/components/floating-action-button.js';
import '/src/components/app-dialog.js';
import '/src/components/book-someone-form.js';
import '/src/components/create-room-form.js';
import '/src/layouts/calendar-section.js';
import '/src/layouts/calendar-sidebar-section.js';
import { mockReservations } from '/src/mock-datas/mock-reservation.js';
import { bookingFabOptions } from '/src/configs/fab-options-config.js';
import { toast } from '/src/service/toast-widget.js';
import { toastSpamProtection } from '/src/utility/toast-anti-spam.js';
import { getTotalPages } from '/src/utility/pagination-helpers.js';

class AdminBooking extends LitElement {
  static properties = {
    reservations: { type: Array },
    selectedDate: { type: String },
    selectedBookings: { type: Array },
    sidebarOpen: { type: Boolean },
    selectedRoomType: { type: String },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    totalPages: { type: Number },
    branches: { type: Array },
    selectedBranch: { type: String },
    showBookDialog: { type: Boolean },
    showRoomDialog: { type: Boolean },
    showExportDialog: { type: Boolean },
    roomImagePreview: { type: String },
    bookLoading: { type: Boolean },
    roomLoading: { type: Boolean }
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

    floating-action-button {
      display: contents;
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
    this.sidebarOpen = savedState === 'true' ? true : false;

    this.selectedRoomType = 'all';
    this.currentPage = 1;
    this.itemsPerPage = 5;
    this.totalPages = getTotalPages(this.selectedBookings.length, this.itemsPerPage);

    this.branches = [
      { value: 'all', label: 'All Branches' },
      { value: 'branch1', label: 'Branch 1' },
    ];
    this.selectedBranch = 'all';

    // Dialog states
    this.showBookDialog = false;
    this.showRoomDialog = false;
    this.showExportDialog = false;
    this.roomImagePreview = null;
    this.bookLoading = false;
    this.roomLoading = false;
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

  handleBranchChange(e) {
    this.selectedBranch = e.detail.branch;
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
        () => toast.info('No date is booked here'),
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
    const details = `Booking Details:\n━━━━━━━━━━━━━━━━\nID: ${booking.id}\nUser: ${booking.userId}\nDate: ${booking.date}\nTime: ${booking.time}\nGuests: ${booking.guests}\nStatus: ${booking.status}${booking.space ? `\nSpace: ${booking.space}` : ''}${booking.notes ? `\nNotes: ${booking.notes}` : ''}`;
    alert(details);
  }

  handleRoomTypeChange(e) {
    this.selectedRoomType = e.detail.roomType;
    this.currentPage = 1;
    const filtered = this.filteredBookings;
    this.totalPages = getTotalPages(filtered.length, this.itemsPerPage);
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

  handleFabAction(e) {
    const { action, label } = e.detail;

    if (action === 'book-someone') {
      this.showBookDialog = true;
      toast.success('Opening booking form...');
    } else if (action === 'create-room') {
      this.showRoomDialog = true;
      toast.success('Opening room creation form...');
    }
  }

  handleExportSelect(e) {
    const { format, fromDate, toDate } = e.detail;
    console.log('Export bookings:', { format, fromDate, toDate });
    toast.success(`Exporting as ${format.toUpperCase()}...`);
    // TODO: Call API to export data
    this.showExportDialog = false;
  }

  handleRoomImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.roomImagePreview = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  handleBookSomeoneSubmit(e) {
    e.preventDefault();
    this.bookLoading = true;

    const formData = new FormData(e.target);
    const data = {
      userName: formData.get('userName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      date: formData.get('date'),
      time: formData.get('time'),
      duration: formData.get('duration'),
      roomType: formData.get('roomType'),
      guests: formData.get('guests'),
      notes: formData.get('notes')
    };

    console.log('Book someone data:', data);

    // TODO: Call API to create booking
    // Example: await fetch('/api/bookings', { method: 'POST', body: JSON.stringify(data) })

    setTimeout(() => {
      this.bookLoading = false;
      toast.success('Booking created successfully!');
      this.showBookDialog = false;
    }, 1000);
  }

  handleCreateRoomSubmit(e) {
    e.preventDefault();
    this.roomLoading = true;

    const formData = new FormData(e.target);
    const amenities = formData.getAll('amenities');

    const data = {
      roomName: formData.get('roomName'),
      roomType: formData.get('roomType'),
      capacity: formData.get('capacity'),
      pricePerHour: formData.get('pricePerHour'),
      floor: formData.get('floor'),
      location: formData.get('location'),
      amenities: amenities,
      description: formData.get('description'),
      image: this.roomImagePreview
    };

    console.log('Create room data:', data);

    // TODO: Call API to create room
    // Example: await fetch('/api/rooms', { method: 'POST', body: JSON.stringify(data) })

    setTimeout(() => {
      this.roomLoading = false;
      toast.success('Room created successfully!');
      this.showRoomDialog = false;
      this.roomImagePreview = null;
    }, 1000);
  }

  handleCancelDialog() {
    this.showBookDialog = false;
    this.showRoomDialog = false;
    this.roomImagePreview = null;
  }

  handleDialogClose() {
    this.showBookDialog = false;
    this.showRoomDialog = false;
    this.showExportDialog = false;
    this.roomImagePreview = null;
  }

  render() {
    return html`
      <content-card mode="3">
        <calendar-section>
          <booking-calendar 
            .reservations=${this.reservations}
            .selectedDate=${this.selectedDate}
            .branches=${this.branches}
            .selectedBranch=${this.selectedBranch}
            @day-click=${this.handleDayClick}
            @branch-change=${this.handleBranchChange}>
            
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

      <floating-action-button
        .options=${bookingFabOptions}
        @fab-option-click=${this.handleFabAction}>
      </floating-action-button>

      <app-dialog
        .isOpen=${this.showBookDialog}
        title="Book Someone"
        description="Fill in the booking details"
        size="large"
        styleMode="compact"
        .closeOnOverlay=${false}
        .hideFooter=${true}
        @dialog-close=${this.handleDialogClose}>
        <book-someone-form>
          <app-button slot="actions" type="warning" size="medium" @click=${this.handleCancelDialog} ?disabled=${this.bookLoading}>
            Cancel
          </app-button>
          <app-button slot="actions" type="primary" size="medium" @click=${(e) => {
        const form = this.shadowRoot.querySelector('book-someone-form').shadowRoot.getElementById('book-form');
        if (form.checkValidity()) {
          this.handleBookSomeoneSubmit(new Event('submit', { cancelable: true, target: form }));
          e.preventDefault();
        } else {
          form.reportValidity();
        }
      }} ?disabled=${this.bookLoading}>
            ${this.bookLoading ? 'Creating...' : 'Create Booking'}
          </app-button>
        </book-someone-form>
      </app-dialog>

      <app-dialog
        .isOpen=${this.showRoomDialog}
        title="Create New Room"
        description="Enter room details and upload image"
        size="large"
        styleMode="compact"
        .closeOnOverlay=${false}
        .hideFooter=${true}
        @dialog-close=${this.handleDialogClose}>
        <create-room-form @change=${(e) => {
        if (e.target.name === 'roomImage') this.handleRoomImageUpload(e);
      }}>
          ${this.roomImagePreview ? html`<img slot="image-preview" src="${this.roomImagePreview}" style="margin-top: 12px; max-width: 100%; max-height: 200px; border-radius: 8px; object-fit: cover;" alt="Room preview" />` : ''}
          <app-button slot="actions" type="warning" size="medium" @click=${this.handleCancelDialog} ?disabled=${this.roomLoading}>
            Cancel
          </app-button>
          <app-button slot="actions" type="primary" size="medium" @click=${(e) => {
        const form = this.shadowRoot.querySelector('create-room-form').shadowRoot.getElementById('room-form');
        if (form.checkValidity()) {
          this.handleCreateRoomSubmit(new Event('submit', { cancelable: true, target: form }));
          e.preventDefault();
        } else {
          form.reportValidity();
        }
      }} ?disabled=${this.roomLoading}>
            ${this.roomLoading ? 'Creating...' : 'Create Room'}
          </app-button>
        </create-room-form>
      </app-dialog>

      <app-dialog
        .isOpen=${this.showExportDialog}
        title="Export Bookings"
        description="Select export format and date range"
        mode="export"
        size="medium"
        styleMode="clean"
        .closeOnOverlay=${false}
        @export-select=${this.handleExportSelect}
        @dialog-close=${this.handleDialogClose}>
      </app-dialog>
    `;
  }
}

customElements.define('admin-booking', AdminBooking);