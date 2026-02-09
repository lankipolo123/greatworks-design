// customer-dashboard.js
import { LitElement, html, css } from 'lit';
import '/src/layouts/dashboard-page-layout.js';
import '/src/components/content-card.js';
import '/src/components/stat-card.js';
import '/src/components/data-table.js';
import '/src/layouts/dashboard-table-wrapper.js';
import { ICONS } from '/src/components/dashboard-icons.js';
import { mockReservations } from '/src/mock-datas/mock-reservation.js';
import { mockTickets } from '/src/mock-datas/mock-ticket.js';
import { mockPayments } from '/src/mock-datas/mock-payments.js';
import { dasboardTicketConfig } from '/src/configs/dashboard-ticket-configs.js';

class CustomerDashboard extends LitElement {
  static properties = {
    reservations: { type: Array },
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
    this.reservations = [...mockReservations];
    this.tickets = [...mockTickets];
    this.payments = [...mockPayments];
    this.recentBookings = this.reservations
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
      .slice(0, 5);
  }

  render() {
    return html`
      <content-card mode="1">
        <dashboard-page-layout>

          <stat-card
            slot="one"
            title="My Bookings"
            textColor="#811a0a"
            .value=${this.reservations.filter(r => r.status === 'confirmed').length}
            .icon=${ICONS.booking}
          ></stat-card>

          <stat-card
            slot="two"
            title="Reservations"
            textColor="#580460"
            .value=${this.reservations.length}
            .icon=${ICONS.calendar}
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
