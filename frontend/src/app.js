// src/components/app-root.js
import { LitElement, html, css } from 'lit';
import '/src/layouts/dashboard-layout.js';
import '/src/components/app-sidebar.js';
import '/src/components/page-header.js';
import '/src/components/app-content.js';
import '/src/pages/authentication/login.js';
import '/src/pages/authentication/register.js';
import '/src/pages/authentication/forgot-password.js';
import { auth, isAuthenticated, getUser } from '/src/service/api.js';

class AppRoot extends LitElement {
  static properties = {
    currentPage: { type: String }
  };

  static styles = css`
    :host {
      display: block;
    }
  `;

  constructor() {
    super();
    this.currentPage = window.location.hash.slice(1) || 'login';

    window.addEventListener('hashchange', () => {
      this.currentPage = window.location.hash.slice(1) || 'login';
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('page-change', this.handlePageChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('page-change', this.handlePageChange);
  }

  handlePageChange(e) {
    this.currentPage = e.detail.page;
    window.location.hash = e.detail.page;
  }

  async handleLogout() {
    try {
      await auth.logout();
    } catch (_) {
      // Logout cleanup happens in finally block of auth.logout()
    }
    window.location.hash = 'login';
    this.currentPage = 'login';
  }

  get userRole() {
    const user = getUser();
    return user?.role || 'customer';
  }

  getPageTitle() {
    const titles = {
      'dashboard': 'DASHBOARD',
      'reservation': 'RESERVATIONS',
      'booking': 'BOOKING',
      'ticket': 'TICKETS',
      'user': 'USERS',
      'logs': 'ACTIVITY LOGS',
      'payments': 'PAYMENTS',
      'settings': 'SETTINGS'
    };
    return titles[this.currentPage] || 'DASHBOARD';
  }

  renderAuthPage() {
    switch (this.currentPage) {
      case 'register':
        return html`<register-page></register-page>`;
      case 'forgot-password':
        return html`<forgot-password-page></forgot-password-page>`;
      case 'login':
      default:
        return html`<login-page></login-page>`;
    }
  }

  render() {
    // Show auth pages
    if (['login', 'register', 'forgot-password'].includes(this.currentPage)) {
      return this.renderAuthPage();
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      window.location.hash = 'login';
      this.currentPage = 'login';
      return this.renderAuthPage();
    }

    // Show dashboard
    return html`
      <dashboard-layout>
        <app-sidebar
          slot="sidebar"
          activePage=${this.currentPage}
          .userRole=${this.userRole}
          @logout=${this.handleLogout}
        ></app-sidebar>
        
        <page-header 
          slot="header"
          title="${this.getPageTitle()}"
        ></page-header>
        
        <app-content
          slot="content"
          currentPage=${this.currentPage}
          .userRole=${this.userRole}
        ></app-content>
      </dashboard-layout>
    `;
  }
}

customElements.define('app-root', AppRoot);