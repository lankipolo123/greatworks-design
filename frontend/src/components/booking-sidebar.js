// src/components/booking-sidebar.js
import { LitElement, html, css } from 'lit';
import '/src/components/booking-card.js';
import '/src/components/app-dropdown.js';

class BookingSidebar extends LitElement {
  static properties = {
    selectedDate: { type: String },
    bookings: { type: Array },
    selectedRoomType: { type: String }
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .sidebar-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      width: 100%;
    }

    .header {
      flex-shrink: 0;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1.5px solid #2d2b2b45;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .title {
      font-size: 1rem;
      font-weight: 600;
      color: #ffb300;
    }

    .date {
      font-size: 0.8rem;
      color: #171717;
      font-weight: 500;
    }

    .empty-state {
      color: #080808;
      font-size: 0.875rem;
      text-align: center;
      padding: 3rem 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }

    .bookings-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      overflow-y: auto;
      overflow-x: hidden;
      flex: 1 1 auto;
      min-height: 0;
      padding-right: 0.5rem;
    }

    .bookings-list::-webkit-scrollbar {
      width: 6px;
    }

    .bookings-list::-webkit-scrollbar-track {
      background: #161616;
      border-radius: 3px;
    }

    .bookings-list::-webkit-scrollbar-thumb {
      background: #020202;
      border-radius: 3px;
    }

    .bookings-list::-webkit-scrollbar-thumb:hover {
      background: #000000;
    }

    .pagination-wrapper {
      flex-shrink: 0;
      margin-top: 1rem;
      padding-top: 0.75rem;
    }
  `;

  constructor() {
    super();
    this.selectedDate = null;
    this.bookings = [];
    this.selectedRoomType = 'all';
  }

  _formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('default', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  _sortBookingsByTime(bookings) {
    return [...bookings].sort((a, b) => {
      const timeA = a.time || '00:00';
      const timeB = b.time || '00:00';
      return timeA.localeCompare(timeB);
    });
  }

  _handleRoomTypeChange(e) {
    this.dispatchEvent(new CustomEvent('room-type-change', {
      detail: { roomType: e.detail.value },
      bubbles: true,
      composed: true
    }));
  }

  _handleCardClick(e) {
    this.dispatchEvent(new CustomEvent('booking-select', {
      detail: e.detail,
      bubbles: true,
      composed: true
    }));
  }

  render() {
    if (!this.selectedDate || this.bookings.length === 0) {
      return html`
        <div class="sidebar-container">
          <div class="header">
            <div class="header-top">
              <div class="title">Booking Details</div>
            </div>
          </div>
          <div class="empty-state">
            <div>Select a date to view bookings</div>
          </div>
        </div>
      `;
    }

    const sortedBookings = this._sortBookingsByTime(this.bookings);

    return html`
      <div class="sidebar-container">
        <div class="header">
          <div class="header-top">
            <div class="title">Booking Details</div>
            <app-dropdown
              variant="dark"
              size="small"
              .options=${[
        { value: 'all', label: 'All Rooms' }
      ]}
              .value=${this.selectedRoomType}
              @change=${this._handleRoomTypeChange}
            ></app-dropdown>
          </div>
          <div class="date">${this._formatDate(this.selectedDate)}</div>
        </div>

        <div class="bookings-list">
          ${sortedBookings.map(booking => html`
            <booking-card
              .booking=${booking}
              @card-click=${this._handleCardClick}>
            </booking-card>
          `)}
        </div>

        <div class="pagination-wrapper">
          <slot name="pagination"></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('booking-sidebar', BookingSidebar);