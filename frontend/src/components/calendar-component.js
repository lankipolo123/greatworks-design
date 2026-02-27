// src/components/calendar-component.js
import { LitElement, html, css } from 'lit';
import '/src/components/users-avatar.js';
import '/src/components/app-dropdown.js';

class BookingCalendar extends LitElement {
  static properties = {
    month: { type: Number },
    year: { type: Number },
    reservations: { type: Array },
    daySummary: { type: Object },
    selectedDate: { type: String },
    branches: { type: Array },
    selectedBranch: { type: String },
    locations: { type: Array },
    selectedLocation: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .calendar-container {
      width: 100%;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      padding: 0 0.15rem;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .month-year {
      font-weight: 600;
      font-size: 1.1rem;
      color: #1a1a1a;
      letter-spacing: -0.02em;
    }

    .nav-buttons {
      display: flex;
      gap: 0.4rem;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    button {
      cursor: pointer;
      background: #ffffff;
      border-color: red;
      border-radius: 6px;
      width: 36px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 500;
    }

    button:hover {
      border-color: black;
      background: #e70707;
      color: white;
      transform: translateY(-1px);
    }

    button:active {
      transform: translateY(0);
    }

    .calendar {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 5px;
      background: #df0707;
      padding: 0.4rem;
      border-radius: 8px;
    }

    .weekday {
      text-align: center;
      font-weight: 600;
      padding: 0.4rem 0.2rem;
      background: transparent;
      color: #ffffff;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .day {
      min-height: 90px;
      background: white;
      border-radius: 6px;
      padding: 0.4rem;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      transition: all 0.2s ease;
      border: 2px solid transparent;
      position: relative;
      overflow: visible;
    }

    .day:hover {
      border-color: #e70707;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(231, 7, 7, 0.1);
      z-index: 1;
    }

    .day.selected {
      border-color: #e70707;
      background: #fff5f5;
      box-shadow: 0 2px 8px rgba(231, 7, 7, 0.15);
    }

    .day.selected:hover {
      background: #fff0f0;
    }

    .day-number {
      font-weight: 600;
      font-size: 0.9rem;
      color: #1a1a1a;
      margin-bottom: 0.4rem;
    }

    .today .day-number {
      background: #262222;
      color: white;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 0.8rem;
    }

    .selected .day-number {
      color: #e70707;
      font-weight: 700;
    }

    .today.selected .day-number {
      background: #e70707;
      color: white;
    }

    .avatars-container {
      display: flex;
      align-items: center;
      margin-top: auto;
    }

    .avatar-wrapper {
      position: relative;
      border-radius: 50%;
      overflow: hidden;
    }

    .avatar-wrapper:not(:first-child) {
      margin-left: -10px;
    }

    .more-count {
      background: linear-gradient(135deg, #e70707 0%, #ff4444 100%);
      color: white;
      font-weight: 600;
      font-size: 0.65rem;
      min-width: 28px;
      height: 28px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0.35rem;
      box-shadow: 0 2px 4px rgba(231, 7, 7, 0.3);
      margin-left: 0.2rem;
    }

    .day.occupancy-low {
      background: #f0fdf4;
    }

    .day.occupancy-medium {
      background: #fefce8;
    }

    .day.occupancy-high {
      background: #fff7ed;
    }

    .day.occupancy-full {
      background: #fef2f2;
    }

    .empty-day {
      opacity: 0.4;
    }

    .calendar-wrapper {
      position: relative;
    }

    .location-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.52);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      pointer-events: all;
      cursor: default;
    }

    .location-overlay-text {
      color: #ffffff;
      font-size: 1.4rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    }

    @media (max-width: 768px) {
      .calendar {
        gap: 4px;
        padding: 0.35rem;
      }

      .day {
        min-height: 70px;
        padding: 0.35rem;
      }

      .month-year {
        font-size: 1rem;
      }

      button {
        width: 30px;
        height: 28px;
      }

      .avatar-wrapper:not(:first-child) {
        margin-left: -8px;
      }
    }
  `;

  constructor() {
    super();
    const now = new Date();
    this.month = now.getMonth();
    this.year = now.getFullYear();
    this.reservations = [];
    this.daySummary = {};
    this.selectedDate = null;
    this.branches = [];
    this.selectedBranch = 'all';
    this.locations = [];
    this.selectedLocation = 'all';
  }

  updated(changedProperties) {
    if (changedProperties.has('selectedDate') && this.selectedDate) {
      const [year, month] = this.selectedDate.split('-').map(Number);
      if (year && month && (year !== this.year || month - 1 !== this.month)) {
        this.year = year;
        this.month = month - 1;
      }
    }
  }

  prevMonth() {
    this.month--;
    if (this.month < 0) {
      this.month = 11;
      this.year--;
    }
  }

  nextMonth() {
    this.month++;
    if (this.month > 11) {
      this.month = 0;
      this.year++;
    }
  }

  handleDayClick(dateStr, bookings) {
    this.dispatchEvent(new CustomEvent('day-click', {
      detail: { date: dateStr, bookings },
      bubbles: true,
      composed: true
    }));
  }

  _getOccupancyClass(dateStr) {
    const summary = this.daySummary?.[dateStr];
    if (!summary || summary.count === 0) return '';
    const count = summary.count;
    if (count >= 10) return 'occupancy-full';
    if (count >= 6) return 'occupancy-high';
    if (count >= 3) return 'occupancy-medium';
    return 'occupancy-low';
  }

  handleBranchChange(e) {
    this.dispatchEvent(new CustomEvent('branch-change', {
      detail: { branch: e.detail.value },
      bubbles: true,
      composed: true
    }));
  }

  handleLocationChange(e) {
    this.dispatchEvent(new CustomEvent('location-change', {
      detail: { location: e.detail.value },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const firstDay = new Date(this.year, this.month, 1).getDay();
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
    const todayStr = new Date().toISOString().slice(0, 10);

    let days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(html`<div class="day empty-day"></div>`);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${this.year}-${String(this.month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const booked = this.reservations.filter(r => r.date === dateStr);
      const maxVisible = 4;
      const visibleBookings = booked.slice(0, maxVisible);
      const remainingCount = booked.length - maxVisible;

      const isToday = dateStr === todayStr;
      const isSelected = dateStr === this.selectedDate;
      const occupancy = this._getOccupancyClass(dateStr);

      days.push(html`
        <div
          class="day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${occupancy}"
          @click=${() => this.handleDayClick(dateStr, booked)}
        >
          <div class="day-number">${d}</div>
          ${booked.length > 0 ? html`
            <div class="avatars-container">
              ${visibleBookings.map(r => html`
                <div class="avatar-wrapper">
                  <user-avatar
                    .src=${r.avatar || ''}
                    .name=${r.userId}
                    .gender=${r.gender || ''}
                    size="30"
                  ></user-avatar>
                </div>
              `)}
              ${remainingCount > 0 ? html`
                <div class="more-count">+${remainingCount}</div>
              ` : ''}
            </div>
          ` : ''}
        </div>
      `);
    }

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return html`
      <div class="calendar-container">
        <div class="header">
          <div class="header-left">
            <div class="month-year">
              ${new Date(this.year, this.month).toLocaleString('default', { month: 'long' })} ${this.year}
            </div>
            <div class="nav-buttons">
              <button @click=${this.prevMonth} aria-label="Previous month">‹</button>
              <button @click=${this.nextMonth} aria-label="Next month">›</button>
            </div>
          </div>

          <div class="header-right">
            ${this.locations.length > 0 ? html`
              <app-dropdown
                variant="primary"
                size="small"
                .options=${this.locations}
                .value=${this.selectedLocation}
                @change=${this.handleLocationChange}
              ></app-dropdown>
            ` : ''}
            <app-dropdown
              variant="light"
              size="small"
              placeholder="Room Type"
              .options=${this.branches}
              .value=${this.selectedBranch}
              @change=${this.handleBranchChange}
            ></app-dropdown>
            <slot name="controls"></slot>
          </div>
        </div>
        <div class="calendar-wrapper">
          <div class="calendar">
            ${weekdays.map(day => html`<div class="weekday">${day}</div>`)}
            ${days}
          </div>
          ${this.selectedLocation === 'all' ? html`
            <div class="location-overlay">
              <span class="location-overlay-text">Pick Location</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('booking-calendar', BookingCalendar);