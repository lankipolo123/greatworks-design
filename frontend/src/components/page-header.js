import { LitElement, html, css } from 'lit';
import '/src/components/users-avatar.js';
import { clockUtility } from '/src/utility/clock-utility.js';

class PageHeader extends LitElement {
  static properties = {
    title: { type: String },
    userName: { type: String },
    userRole: { type: String },
    userAvatar: { type: String },
    userGender: { type: String },
    currentTime: { type: String },
    currentDate: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      background: white;
      border-bottom: 1.25px solid rgba(45, 43, 43, 0.27);
    }

    .header-container {
      height: 80px; /* exact old header height */
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
      overflow: hidden;
    }

    h1 {
      margin: 0;
      font-size: 2rem;
      color: #8d1409;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      line-height: 1;
    }

    /* RIGHT SIDE EXACT DESIGN */
    .right-side {
      display: flex;
      align-items: center;
      height: 100%;
      gap: 12px;
    }

    .date-container,
    .time-container {
      display: flex;
      align-items: center;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6b7280;
    }

    .calendar-icon,
    .clock-icon {
      width: 12px;
      height: 12px;
      margin-right: 4px;
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
    }

    .divider {
      font-size: 18px;
      font-weight: 400;
      color: #9ca3af;
      margin: 0 12px;
    }

    .user {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 1;
    }

    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: #ff0707d7;
    }

    .user-role {
      font-size: 11px;
      font-weight: 600;
      color: rgba(255, 175, 14, 0.84);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  `;

  constructor() {
    super();
    this.title = 'No Title';
    this.userName = 'No data yet';
    this.userRole = 'No data yet';
    this.userAvatar = '';
    this.userGender = '';
    this.currentTime = '';
    this.currentDate = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this.startClock();
    this.loadUser();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribeClock) this.unsubscribeClock();
  }

  startClock() {
    this.unsubscribeClock = clockUtility.subscribe((t) => {
      this.currentTime = t.time;
      this.currentDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    });
  }

  loadUser() {
    try {
      const stored = localStorage.getItem('auth_user');
      if (!stored) return;

      const user = JSON.parse(stored);
      this.userName = user.name || 'No data yet';
      this.userRole = user.role || '';
      this.userAvatar = user.profile_photo || '';
    } catch (_) {
      this.userName = 'No data yet';
      this.userRole = '';
      this.userAvatar = '';
    }
  }

  render() {
    return html`
      <div class="header-container">
        <h1>${this.title}</h1>
        <div class="right-side">
          <div class="date-container">
            <svg class="calendar-icon" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>${this.currentDate}</span>
          </div>

          <span class="divider">/</span>

          <div class="time-container">
            <svg class="clock-icon" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            <span>${this.currentTime}</span>
          </div>

          <span class="divider">/</span>

          <div class="user">
            <user-avatar
              .src=${this.userAvatar}
              .name=${this.userName}
              .gender=${this.userGender}
              size="48"
            ></user-avatar>
            <div class="user-details">
              <span class="user-name">${this.userName}</span>
              <span class="user-role">${this.userRole}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('page-header', PageHeader);
