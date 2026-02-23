// src/components/app-root.js
import { LitElement, html, css } from 'lit';
import { auth, isAuthenticated, getUser } from '/src/service/api.js';

const lazyImports = {
    'dashboard-layout': () => import('/src/layouts/dashboard-layout.js'),
    'app-sidebar': () => import('/src/components/app-sidebar.js'),
    'page-header': () => import('/src/components/page-header.js'),
    'app-content': () => import('/src/components/app-content.js'),
    'login-page': () => import('/src/pages/authentication/login.js'),
    'register-page': () => import('/src/pages/authentication/register.js'),
    'forgot-password-page': () => import('/src/pages/authentication/forgot-password.js'),
};

const loaded = new Set();

class AppRoot extends LitElement {
  static properties = {
    currentPage: { type: String },
    _ready: { type: Boolean, state: true }
  };

  static styles = css`
    :host {
      display: block;
    }
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      color: #888;
      font-size: 14px;
    }
  `;

  constructor() {
    super();
    this.currentPage = window.location.hash.slice(1) || 'login';
    this._ready = false;

    window.addEventListener('hashchange', () => {
      this.currentPage = window.location.hash.slice(1) || 'login';
      this._loadDeps();
    });
  }

  async _loadDeps() {
    const needed = [];
    const isAuth = ['login', 'register', 'forgot-password'].includes(this.currentPage);
    if (isAuth) {
      const map = { 'login': 'login-page', 'register': 'register-page', 'forgot-password': 'forgot-password-page' };
      const name = map[this.currentPage] || 'login-page';
      if (!loaded.has(name)) needed.push(lazyImports[name]().then(() => loaded.add(name)));
    } else {
      for (const name of ['dashboard-layout', 'app-sidebar', 'page-header', 'app-content']) {
        if (!loaded.has(name)) needed.push(lazyImports[name]().then(() => loaded.add(name)));
      }
    }
    if (needed.length) {
      this._ready = false;
      await Promise.all(needed);
    }
    this._ready = true;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('page-change', this.handlePageChange);
    this._loadDeps();
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
    if (!this._ready) {
      return html`<div class="loading">Loading...</div>`;
    }

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