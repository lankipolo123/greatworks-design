// src/components/hour-slot.js
import { LitElement, html, css } from 'lit';
import '/src/components/booking-card.js';

class HourSlot extends LitElement {
  static properties = {
    hour: { type: Number },
    bookings: { type: Array },
  };

  static styles = css`
    :host {
      display: block;
    }

    .slot-row {
      display: flex;
      gap: 0.5rem;
      padding: 0.4rem 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .slot-row:last-child {
      border-bottom: none;
    }

    .time-label {
      flex-shrink: 0;
      width: 48px;
      text-align: right;
      padding-right: 0.25rem;
      padding-top: 0.15rem;
    }

    .time-label span {
      font-size: 0.65rem;
      font-weight: 700;
      color: #aaa;
      letter-spacing: 0.02em;
      white-space: nowrap;
      line-height: 1;
    }

    .slot-row.has-booking .time-label span {
      color: #333;
    }

    .slot-content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .empty-text {
      font-size: 0.65rem;
      color: #ccc;
      font-weight: 500;
      font-style: italic;
      padding-top: 0.15rem;
    }

    booking-card {
      --card-padding: 0.25rem 0.4rem;
    }

    .more-btn {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      background: #f5f5f5;
      border: 1px dashed #ccc;
      border-radius: 4px;
      padding: 0.2rem 0.5rem;
      font-size: 0.6rem;
      font-weight: 600;
      color: #666;
      cursor: pointer;
      transition: all 0.2s;
      width: 100%;
      justify-content: center;
    }

    .more-btn:hover {
      background: #eee;
      border-color: #aaa;
      color: #333;
    }

    .more-btn svg {
      width: 12px;
      height: 12px;
    }
  `;

  constructor() {
    super();
    this.hour = 8;
    this.bookings = [];
  }

  _formatHour(hour) {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12} ${ampm}`;
  }

  _handleCardClick(e) {
    this.dispatchEvent(new CustomEvent('card-click', {
      detail: e.detail,
      bubbles: true,
      composed: true
    }));
  }

  _handleShowMore() {
    this.dispatchEvent(new CustomEvent('show-more', {
      detail: {
        hour: this.hour,
        hourLabel: this._formatHour(this.hour),
        bookings: this.bookings
      },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const hasBookings = this.bookings.length > 0;
    const maxVisible = 3;
    const overflow = this.bookings.length > maxVisible;
    const visible = this.bookings.slice(0, maxVisible);
    const remaining = this.bookings.length - maxVisible;

    return html`
      <div class="slot-row ${hasBookings ? 'has-booking' : ''}">
        <div class="time-label">
          <span>${this._formatHour(this.hour)}</span>
        </div>
        ${hasBookings ? html`
          <div class="slot-content">
            ${visible.map(booking => html`
              <booking-card
                .booking=${booking}
                @card-click=${this._handleCardClick}>
              </booking-card>
            `)}
            ${overflow ? html`
              <button class="more-btn" @click=${this._handleShowMore}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                ${remaining} more booking${remaining > 1 ? 's' : ''}
              </button>
            ` : ''}
          </div>
        ` : html`<span class="empty-text">Available</span>`}
      </div>
    `;
  }
}

customElements.define('hour-slot', HourSlot);
