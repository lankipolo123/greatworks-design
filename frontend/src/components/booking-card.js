// src/components/booking-card.js
import { LitElement, html, css } from 'lit';
import '/src/components/users-avatar.js';
import { ICONS } from '/src/components/dashboard-icons.js';
import { hashId } from '@/utility/hash-id.js';
import { getBookingUrgency } from '/src/utility/reservation-reminder.js';

class BookingCard extends LitElement {
  static properties = {
    booking: { type: Object }
  };

  static styles = css`
    :host {
      display: block;
    }

    .card {
      position: relative;
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

    .card.past {
      opacity: 0.55;
      border-color: #e0e0e0;
      background: #fafafa;
    }

    .card.past .name {
      color: #888;
    }

    .card.past .guests {
      background: #bbb;
    }

    .card.past::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 3px;
      height: 100%;
      background: #bbb;
      border-radius: 4px 0 0 4px;
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

    .status.completed {
      background: #e2e3e5;
      color: #383d41;
    }

    .card.status-confirmed {
      border-left: 3px solid #28a745;
    }

    .card.status-pending {
      border-left: 3px solid #ffc107;
    }

    .card.status-cancelled {
      border-left: 3px solid #dc3545;
    }

    .card.status-completed {
      border-left: 3px solid #6c757d;
    }

    .room-type {
      background: #f0f4ff;
      color: #3451b2;
      padding: 0.1rem 0.3rem;
      border-radius: 2px;
      font-size: 0.55rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .card.urgency-upcoming {
      border-left: 3px solid #f59e0b;
      animation: pulse-border 2s ease-in-out infinite;
    }

    .card.urgency-now {
      border-left: 3px solid #ef4444;
      animation: pulse-border 1.5s ease-in-out infinite;
    }

    @keyframes pulse-border {
      0%, 100% { box-shadow: 0 0 0 0 transparent; }
      50% { box-shadow: 0 0 6px 1px rgba(245, 158, 11, 0.25); }
    }

    .urgency-badge {
      font-size: 0.5rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 0.1rem 0.3rem;
      border-radius: 2px;
      letter-spacing: 0.03em;
      animation: fade-pulse 2s ease-in-out infinite;
    }

    .urgency-badge.upcoming {
      background: #fef3c7;
      color: #92400e;
    }

    .urgency-badge.now {
      background: #fee2e2;
      color: #991b1b;
    }

    @keyframes fade-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
  `;

  constructor() {
    super();
    this.booking = {};
  }

  _formatRoomType(type) {
    const labels = {
      co_working: 'Co-Working',
      virtual_offices: 'Virtual Offices',
      private_offices: 'Private Offices',
      events_meeting_room: 'Events & Meeting'
    };
    return labels[type] || type;
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

  _isPast() {
    const { date, status } = this.booking;
    if (status === 'completed' || status === 'cancelled') return true;
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);
    return bookingDate < today;
  }

  render() {
    const { userId, time, guests, status, id, avatar, gender, roomType } = this.booking;
    const past = this._isPast();
    const urgency = past ? null : getBookingUrgency(this.booking);

    return html`
      <div class="card status-${status} ${past ? 'past' : ''} ${urgency ? `urgency-${urgency}` : ''}" @click=${this._handleClick}>
        <div class="card-header">
          <user-avatar
            .src=${avatar || ''}
            .name=${userId}
            .gender=${gender || ''}
            size="24"
          ></user-avatar>
          <div class="info">
            <div class="name">${userId}</div>
          </div>
          <div class="guests">
            <span class="icon">${ICONS.users}</span>
            <span>${guests}</span>
          </div>
        </div>
        <div class="meta">
          <span>${hashId('BKG', id)}</span>
          <span>•</span>
          ${roomType ? html`<span class="room-type">${this._formatRoomType(roomType)}</span><span>•</span>` : ''}
          <span class="status ${status}">${status}</span>
          ${urgency === 'upcoming' ? html`<span>•</span><span class="urgency-badge upcoming">Soon</span>` : ''}
          ${urgency === 'now' ? html`<span>•</span><span class="urgency-badge now">Now</span>` : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('booking-card', BookingCard);
