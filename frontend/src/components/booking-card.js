// src/components/booking-card.js
import { LitElement, html, css } from 'lit';
import '/src/components/users-avatar.js';
import { ICONS } from '/src/components/dashboard-icons.js'; // <-- import ICONS

class BookingCard extends LitElement {
  static properties = {
    booking: { type: Object }
  };

  static styles = css`
    :host {
      display: block;
    }

    .card {
      background: white;
      border-radius: 4px;
      padding: 0.35rem 0.45rem;
      border: solid 1.5px #2d2b2b45;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .card:hover {
      transform: translateX(2px);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .info {
      flex: 1;
      min-width: 0;
    }

    .name {
      font-weight: 600;
      font-size: 0.7rem;
      color: #1a1a1a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 0.1rem;
    }

    .time {
      font-size: 0.65rem;
      color: #666;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.15rem;
    }

    .room-info {
      font-size: 0.65rem;
      color: #444;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.15rem;
      margin-top: 0.1rem;
    }

    .room-type {
      display: inline-block;
      background: #ff0707d7;
      color: white;
      padding: 0.1rem 0.35rem;
      border-radius: 3px;
      font-size: 0.6rem;
      font-weight: 600;
      margin-left: 0.25rem;
    }

    .guests {
      background: #0f0f0f;
      color: #fdfcfc;
      padding: 0.2rem 0.35rem;
      border-radius: 3px;
      font-size: 0.65rem;
      font-weight: 600;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 0.15rem;
    }

    .guests .icon svg {
      width: 14px;
      height: 14px;
      vertical-align: middle;
    }

    .meta {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.6rem;
      color: #060606;
      padding-top: 0.3rem;
      margin-top: 0.3rem;
      border-top: 1px solid #f0f0f0;
    }

    .status {
      padding: 0.1rem 0.3rem;
      border-radius: 2px;
      font-size: 0.55rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status.confirmed {
      background: #d4edda;
      color: #155724;
    }

    .status.pending {
      background: #fff3cd;
      color: #856404;
    }

    .status.cancelled {
      background: #f8d7da;
      color: #721c24;
    }
  `;

  constructor() {
    super();
    this.booking = {};
  }

  _formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }

  _handleClick() {
    this.dispatchEvent(new CustomEvent('card-click', {
      detail: { booking: this.booking },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const { userId, time, guests, status, id, avatar, gender, roomName, roomType } = this.booking;

    return html`
      <div class="card status-${status}" @click=${this._handleClick}>
        <div class="card-header">
          <user-avatar
            .src=${avatar || ''}
            .name=${userId}
            .gender=${gender || ''}
            size="24"
          ></user-avatar>
          <div class="info">
            <div class="name">${userId}</div>
            <div class="time">🕐 ${this._formatTime(time)}</div>
            ${roomName ? html`
              <div class="room-info">
                🏢 ${roomName}
                ${roomType ? html`<span class="room-type">${roomType}</span>` : ''}
              </div>
            ` : ''}
          </div>
          <div class="guests">
            <span class="icon">${ICONS.users}</span>
            <span>${guests}</span>
          </div>
        </div>
        <div class="meta">
          <span>${id}</span>
          <span>•</span>
          <span class="status ${status}">${status}</span>
        </div>
      </div>
    `;
  }
}

customElements.define('booking-card', BookingCard);
