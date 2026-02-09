import { LitElement, html, css } from 'lit';
// Admin pages
import '/src/pages/admin/dashboard.js';
import '/src/pages/admin/reservation.js';
import '/src/pages/admin/booking.js';
import '/src/pages/admin/ticket.js';
import '/src/pages/admin/users.js';
import '/src/pages/admin/logs.js';
import '/src/pages/admin/payments.js';
// Customer pages
import '/src/pages/customer/dashboard.js';
import '/src/pages/customer/reservation.js';
import '/src/pages/customer/booking.js';
import '/src/pages/customer/ticket.js';
import '/src/pages/customer/payments.js';
// Shared
import '/src/pages/settings.js';

class AppContent extends LitElement {
    static properties = {
        currentPage: { type: String },
        userRole: { type: String }
    };

    static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      background: #fffffffe;
    }
  `;

    constructor() {
        super();
        this.currentPage = 'dashboard';
        this.userRole = 'customer';
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
        if (this.userRole === 'admin' || this.userRole === 'moderator') {
            return html`${this.renderAdminPage()}`;
        }
        return html`${this.renderCustomerPage()}`;
    }
}

customElements.define('app-content', AppContent);
