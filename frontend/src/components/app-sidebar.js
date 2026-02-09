// src/components/app-sidebar.js
import { LitElement, html, css } from 'lit';
import { TooltipManager } from '/src/components/tool-tips.js';
import { ICONS } from '/src/components/dashboard-icons.js';
import '/src/components/app-dialog.js';

class AppSidebar extends LitElement {
  static properties = {
    activePage: { type: String },
    collapsed: { type: Boolean },
    showLogoutDialog: { type: Boolean },
    userRole: { type: String }
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #ffffff;
      border-right: 1.25px solid #2d2b2b45;
      transition: all 0.3s ease;
    }

    :host([collapsed]) .nav-item-text,
    :host([collapsed]) .logout-text {
      display: none;
    }

    :host([collapsed]) .nav-item,
    :host([collapsed]) .logout {
      justify-content: center;
      padding: 0.875rem 0.5rem;
    }

    :host([collapsed]) .nav-icon {
      margin-right: 0;
    }

    .logo {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1.25px solid #2d2b2b45;
      flex-shrink: 0;
    }

    .logo img {
      max-height: 45px;
      max-width: 100%;
      transition: all 0.3s ease;
    }

    nav {
      flex: 1;
      padding: 0.5rem 0;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 0.875rem 1rem;
      color: #4e4d4d;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.85rem;
      font-weight: 600;
      position: relative;
    }

    .nav-item:hover {
      color: #ff0707d7;
    }

    .nav-item.active {
      color: #8d1409;
    }

    .nav-icon {
      margin-right: 0.75rem;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: margin 0.3s ease;
      flex-shrink: 0;
    }

    .logout {
      padding: 0.875rem 1rem;
      display: flex;
      align-items: center;
      color: #ff3b30;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.85rem;
      transition: all 0.2s;
      margin-top: auto;
      position: relative;
    }

    .logout:hover {
      color: #8d1409;
    }

    .logout .nav-icon {
      margin-right: 0.75rem;
    }

    .logout-message {
      font-size: 0.9rem;
      color: #666;
      line-height: 1.5;
    }
  `;

  constructor() {
    super();
    this.activePage = 'dashboard';
    this.collapsed = false;
    this.showLogoutDialog = false;
    this.userRole = 'customer';
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('sidebar-toggle', (e) => {
      this.collapsed = e.detail.collapsed;
      this.collapsed
        ? this.setAttribute('collapsed', '')
        : this.removeAttribute('collapsed');
    });
  }

  get menuItems() {
    const adminOnly = ['user', 'logs'];
    const allItems = [
      { id: 'dashboard', label: 'Dashboard', icon: ICONS.dashboard },
      { id: 'reservation', label: 'Reservation', icon: ICONS.calendar },
      { id: 'booking', label: 'Booking', icon: ICONS.booking },
      { id: 'ticket', label: 'Ticket', icon: ICONS.ticket },
      { id: 'user', label: 'User', icon: ICONS.user },
      { id: 'logs', label: 'Logs', icon: ICONS.logs },
      { id: 'payments', label: 'Payments', icon: ICONS.payments },
      { id: 'settings', label: 'Settings', icon: ICONS.settings }
    ];

    if (this.userRole === 'customer') {
      return allItems.filter(item => !adminOnly.includes(item.id));
    }

    return allItems;
  }

  handleNavClick(pageId) {
    this.activePage = pageId;
    this.dispatchEvent(new CustomEvent('page-change', {
      detail: { page: pageId },
      bubbles: true,
      composed: true
    }));
  }

  handleLogout() {
    this.showLogoutDialog = true;
  }

  handleLogoutConfirm() {
    this.showLogoutDialog = false;
    this.dispatchEvent(new CustomEvent('logout', {
      bubbles: true,
      composed: true
    }));
  }

  handleLogoutCancel() {
    this.showLogoutDialog = false;
  }

  _handleMouseEnter(e) {
    if (this.collapsed) {
      TooltipManager.show(e.currentTarget.dataset.label, e.currentTarget);
    }
  }

  _handleMouseLeave() {
    TooltipManager.hide();
  }

  render() {
    return html`
      <div class="logo">
        <img
          src=${this.collapsed
        ? '/assets/logoCollapse.svg'
        : '/assets/logoExtended.svg'}
          alt="CoWork Logo"
        />
      </div>

      <nav>
        ${this.menuItems.map(item => html`
          <div
            class="nav-item ${this.activePage === item.id ? 'active' : ''}"
            data-label="${item.label}"
            @click=${() => this.handleNavClick(item.id)}
            @mouseenter=${this._handleMouseEnter}
            @mouseleave=${this._handleMouseLeave}
          >
            <span class="nav-icon">${item.icon}</span>
            <span class="nav-item-text">${item.label}</span>
          </div>
        `)}
      </nav>

      <div
        class="logout"
        data-label="Logout"
        @click=${this.handleLogout}
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
      >
        <span class="nav-icon">${ICONS.logout}</span>
        <span class="logout-text">Logout</span>
      </div>

            <app-dialog
        .isOpen=${this.showLogoutDialog}
        title="Confirm Logout"
        cancelText="Cancel"
        confirmText="Sign out"
        confirmColor="danger"
         styleMode="clean"
        size="small"
        .closeOnOverlay=${false}
        @dialog-confirm=${this.handleLogoutConfirm}
        @dialog-cancel=${this.handleLogoutCancel}
      >
      Are you sure you want to log out?
      </app-dialog>
    `;
  }
}

customElements.define('app-sidebar', AppSidebar);