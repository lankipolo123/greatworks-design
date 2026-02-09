// customer-dashboard.js
import { LitElement, html, css } from 'lit';
import '/src/layouts/dashboard-page-layout.js';
import '/src/components/content-card.js';
import '/src/components/stat-card.js';
import '/src/components/data-table.js';
import '/src/layouts/dashboard-table-wrapper.js';
import { ICONS } from '/src/components/dashboard-icons.js';
import { dasboardTicketConfig } from '/src/configs/dashboard-ticket-configs.js';
import { tickets as ticketsApi, payments as paymentsApi } from '/src/service/api.js';

class CustomerDashboard extends LitElement {
  static properties = {
    tickets: { type: Array },
    payments: { type: Array },
    recentBookings: { type: Array },
  };

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      height: 100%;
      box-sizing: border-box;
    }

    content-card {
      height: 100%;
      width: 100%;
    }
  `;

  constructor() {
    super();
    this.tickets = [];
    this.payments = [];
    this.recentBookings = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchData();
  }

  async fetchData() {
    try {
      const [ticketRes, paymentRes] = await Promise.all([
        ticketsApi.getAll({ per_page: 100 }),
        paymentsApi.getAll({ per_page: 100 }),
      ]);
      this.tickets = ticketRes.data || ticketRes;
      this.payments = paymentRes.data || paymentRes;
      this.recentBookings = [...this.tickets]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
    } catch (e) {
      console.error('Failed to fetch dashboard data:', e);
    }
  }

  render() {
    return html`
      <content-card mode="1">
        <dashboard-page-layout>

          <stat-card
            slot="one"
            title="My Tickets"
            textColor="#811a0a"
            .value=${this.tickets.length}
            .icon=${ICONS.ticketInbox}
          ></stat-card>

          <stat-card
            slot="two"
            title="Open Tickets"
            textColor="#580460"
            .value=${this.tickets.filter(t => t.status === 'open').length}
            .icon=${ICONS.clock}
          ></stat-card>

          <stat-card
            slot="three"
            title="My Tickets"
            textColor="#67ab07"
            .value=${this.tickets.length}
            .icon=${ICONS.ticketInbox}
          ></stat-card>

          <stat-card
            slot="four"
            title="Payments"
            textColor="#ffac05"
            .value=${this.payments.length}
            .icon=${ICONS.payments}
          ></stat-card>

          <dashboard-table-wrapper
            slot="table"
            title="Recent Bookings"
            .icon=${ICONS.booking}
          >
            <data-table
              .data=${this.recentBookings}
              .conf=${dasboardTicketConfig}
              mode="3"
            ></data-table>
          </dashboard-table-wrapper>

        </dashboard-page-layout>
      </content-card>
    `;
  }
}

customElements.define('customer-dashboard', CustomerDashboard);
