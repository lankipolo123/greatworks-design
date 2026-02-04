import { LitElement, html, css } from 'lit';
import '/src/pages/admin/dashboard.js';
import '/src/pages/admin/reservation.js';
import '/src/pages/admin/booking.js';
import '/src/pages/admin/ticket.js';
import '/src/pages/admin/users.js';
import '/src/pages/admin/logs.js';
import '/src/pages/admin/payments.js';
import '/src/pages/settings.js';

class AppContent extends LitElement {
    static properties = {
        currentPage: { type: String }
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
    }

    renderPage() {
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

    render() {
        return html`${this.renderPage()}`;
    }
}

customElements.define('app-content', AppContent);