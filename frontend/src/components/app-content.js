import { LitElement, html, css } from 'lit';

const pageImports = {
    'admin-dashboard': () => import('/src/pages/admin/dashboard.js'),
    'admin-reservation': () => import('/src/pages/admin/reservation.js'),
    'admin-booking': () => import('/src/pages/admin/booking.js'),
    'admin-ticket': () => import('/src/pages/admin/ticket.js'),
    'admin-user': () => import('/src/pages/admin/users.js'),
    'admin-logs': () => import('/src/pages/admin/logs.js'),
    'admin-payments': () => import('/src/pages/admin/payments.js'),
    'customer-dashboard': () => import('/src/pages/customer/dashboard.js'),
    'customer-reservation': () => import('/src/pages/customer/reservation.js'),
    'customer-booking': () => import('/src/pages/customer/booking.js'),
    'customer-ticket': () => import('/src/pages/customer/ticket.js'),
    'customer-payments': () => import('/src/pages/customer/payments.js'),
    'app-settings': () => import('/src/pages/settings.js'),
};

const loadedPages = new Set();

class AppContent extends LitElement {
    static properties = {
        currentPage: { type: String },
        userRole: { type: String },
        _pageReady: { type: Boolean, state: true }
    };

    static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      background: #fffffffe;
    }
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: #888;
      font-size: 14px;
    }
  `;

    constructor() {
        super();
        this.currentPage = 'dashboard';
        this.userRole = 'customer';
        this._pageReady = false;
    }

    _getComponentName() {
        const isAdmin = this.userRole === 'admin' || this.userRole === 'moderator';
        const prefix = isAdmin ? 'admin' : 'customer';
        if (this.currentPage === 'settings') return 'app-settings';
        if (this.currentPage === 'user' && isAdmin) return 'admin-user';
        if (this.currentPage === 'logs' && isAdmin) return 'admin-logs';
        return `${prefix}-${this.currentPage || 'dashboard'}`;
    }

    async _loadPage(componentName) {
        if (loadedPages.has(componentName)) {
            this._pageReady = true;
            return;
        }
        const loader = pageImports[componentName];
        if (loader) {
            this._pageReady = false;
            await loader();
            loadedPages.add(componentName);
            this._pageReady = true;
        } else {
            this._pageReady = true;
        }
    }

    updated(changed) {
        if (changed.has('currentPage') || changed.has('userRole')) {
            this._loadPage(this._getComponentName());
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this._loadPage(this._getComponentName());
    }

    renderAdminPage() {
        switch (this.currentPage) {
            case 'dashboard': return html`<admin-dashboard></admin-dashboard>`;
            case 'reservation': return html`<admin-reservation></admin-reservation>`;
            case 'booking': return html`<admin-booking></admin-booking>`;
            case 'ticket': return html`<admin-ticket></admin-ticket>`;
            case 'user': return html`<admin-user></admin-user>`;
            case 'logs': return html`<admin-logs></admin-logs>`;
            case 'payments': return html`<admin-payments></admin-payments>`;
            case 'settings': return html`<app-settings></app-settings>`;
            default: return html`<admin-dashboard></admin-dashboard>`;
        }
    }

    renderCustomerPage() {
        switch (this.currentPage) {
            case 'dashboard': return html`<customer-dashboard></customer-dashboard>`;
            case 'reservation': return html`<customer-reservation></customer-reservation>`;
            case 'booking': return html`<customer-booking></customer-booking>`;
            case 'ticket': return html`<customer-ticket></customer-ticket>`;
            case 'payments': return html`<customer-payments></customer-payments>`;
            case 'settings': return html`<app-settings></app-settings>`;
            default: return html`<customer-dashboard></customer-dashboard>`;
        }
    }

    render() {
        if (!this._pageReady) {
            return html`<div class="loading">Loading...</div>`;
        }
        if (this.userRole === 'admin' || this.userRole === 'moderator') {
            return html`${this.renderAdminPage()}`;
        }
        return html`${this.renderCustomerPage()}`;
    }
}

customElements.define('app-content', AppContent);
