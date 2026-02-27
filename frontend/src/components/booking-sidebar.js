// src/components/booking-sidebar.js
import { LitElement, html, css } from 'lit';
import '/src/components/hour-slot.js';
import '/src/components/app-dropdown.js';

class BookingSidebar extends LitElement {
  static properties = {
    selectedDate: { type: String },
    bookings: { type: Array },
    selectedRoomType: { type: String },
    showBookNow: { type: Boolean },
    roomTypes: { type: Array },
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

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .close-btn:hover {
      color: #d6150b;
      background: #fff0f0;
    }

    .close-btn svg {
      width: 18px;
      height: 18px;
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
      gap: 0;
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

    .book-now-btn {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      width: 100%;
      padding: 0.6rem 1rem;
      margin-top: 0.75rem;
      background: #ffb300;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .book-now-btn:hover {
      background: #ffa000;
    }

    .book-now-btn svg {
      width: 16px;
      height: 16px;
    }
  `;

  constructor() {
    super();
    this.selectedDate = null;
    this.bookings = [];
    this.selectedRoomType = 'all';
    this.showBookNow = false;
    this.roomTypes = [];
  }

  _handleBookNow() {
    this.dispatchEvent(new CustomEvent('book-now', {
      bubbles: true,
      composed: true
    }));
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

  _getHourSlots(bookings) {
    const slotMap = {};
    for (const b of bookings) {
      const t = b.time || '00:00';
      const [hours, minutes] = t.split(':').map(Number);
      const hour = minutes >= 30 ? hours + 1 : hours;
      if (!slotMap[hour]) slotMap[hour] = [];
      slotMap[hour].push(b);
    }
    const slots = [];
    for (let h = 8; h <= 18; h++) {
      slots.push({ hour: h, bookings: slotMap[h] || [] });
    }
    return slots;
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

  _handleClose() {
    this.dispatchEvent(new CustomEvent('sidebar-close', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const closeBtn = html`
      <button class="close-btn" @click=${this._handleClose} title="Close sidebar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    if (!this.selectedDate || this.bookings.length === 0) {
      return html`
        <div class="sidebar-container">
          <div class="header">
            <div class="header-top">
              <div class="title">Booking Details</div>
              ${closeBtn}
            </div>
            ${this.selectedDate ? html`<div class="date">${this._formatDate(this.selectedDate)}</div>` : ''}
          </div>
          <div class="empty-state">
            <div>${this.selectedDate ? 'No bookings on this date' : 'Select a date to view bookings'}</div>
          </div>
          ${this.showBookNow ? html`
            <button class="book-now-btn" @click=${this._handleBookNow}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Book Now
            </button>
          ` : ''}
        </div>
      `;
    }

    const hourSlots = this._getHourSlots(this.bookings);

    return html`
      <div class="sidebar-container">
        <div class="header">
          <div class="header-top">
            <div class="title">Booking Details</div>
            <div style="display:flex;align-items:center;gap:0.5rem;">
            <app-dropdown
              variant="dark"
              size="small"
              .options=${[{ value: 'all', label: 'All Types' }, ...this.roomTypes]}
              .value=${this.selectedRoomType}
              @change=${this._handleRoomTypeChange}
            ></app-dropdown>
            ${closeBtn}
            </div>
          </div>
          <div class="date">${this._formatDate(this.selectedDate)}</div>
        </div>

        <div class="bookings-list">
          ${hourSlots.map(slot => html`
            <hour-slot
              .hour=${slot.hour}
              .bookings=${slot.bookings}
              @card-click=${this._handleCardClick}>
            </hour-slot>
          `)}
        </div>

        <div class="pagination-wrapper">
          <slot name="pagination"></slot>
        </div>

        ${this.showBookNow ? html`
          <button class="book-now-btn" @click=${this._handleBookNow}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Book Now
          </button>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('booking-sidebar', BookingSidebar);