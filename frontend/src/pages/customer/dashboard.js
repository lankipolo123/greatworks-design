// customer-dashboard.js
import { LitElement, html, css } from 'lit';
import '/src/components/content-card.js';
import '/src/components/stat-card.js';
import '/src/components/data-table.js';
import '/src/layouts/dashboard-table-wrapper.js';
import { ICONS } from '/src/components/dashboard-icons.js';
import { ticketsTableConfig } from '/src/configs/tickets-config.js';
import { tickets as ticketsApi, payments as paymentsApi, bookings as bookingsApi, reservations as reservationsApi } from '/src/service/api.js';

class CustomerDashboard extends LitElement {
  static properties = {
    tickets: { type: Array },
    payments: { type: Array },
    bookingsList: { type: Array },
    reservationsList: { type: Array },
    recentTickets: { type: Array },
    userName: { type: String },
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

    .dashboard-grid {
      display: grid;
      grid-template-columns: 2.2fr 0.9fr 0.9fr;
      grid-template-rows: 1fr 1.15fr auto;
      gap: 1rem;
      width: 100%;
      height: 90%;
    }

    .welcome-banner {
      grid-column: 1;
      grid-row: 1 / 3;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      border-radius: 8px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: white;
      border: 1.25px solid #2d2b2b25;
    }

    .welcome-banner .greeting {
      font-size: 0.85rem;
      font-weight: 400;
      color: #ffffffb0;
      margin-bottom: 0.35rem;
    }

    .welcome-banner .name {
      font-size: 1.6rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
    }

    .welcome-banner .subtitle {
      font-size: 0.8rem;
      color: #ffffffa0;
      line-height: 1.5;
    }

    .stat-one {
      grid-column: 2;
      grid-row: 1;
    }

    .stat-two {
      grid-column: 3;
      grid-row: 1;
    }

    .stat-three {
      grid-column: 2;
      grid-row: 2;
    }

    .stat-four {
      grid-column: 3;
      grid-row: 2;
    }

    .table-section {
      grid-column: 1 / -1;
      grid-row: 3;
    }

    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto;
      }

      .welcome-banner {
        grid-column: 1 / -1;
        grid-row: 1;
      }

      .stat-one { grid-column: 1; grid-row: 2; }
      .stat-two { grid-column: 2; grid-row: 2; }
      .stat-three { grid-column: 1; grid-row: 3; }
      .stat-four { grid-column: 2; grid-row: 3; }
      .table-section { grid-column: 1 / -1; grid-row: 4; }
    }
  `;

  constructor() {
    super();
    this.tickets = [];
    this.payments = [];
    this.bookingsList = [];
    this.reservationsList = [];
    this.recentTickets = [];
    this.userName = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchData();
    this._loadUserName();
  }

  _loadUserName() {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        this.userName = user.name || user.email || '';
      }
    } catch (e) {
      this.userName = '';
    }
  }

  async fetchData() {
    try {
      const [ticketRes, paymentRes, bookingRes, reservationRes] = await Promise.all([
        ticketsApi.getAll({ per_page: 100 }),
        paymentsApi.getAll({ per_page: 100 }),
        bookingsApi.getAll({ per_page: 100 }),
        reservationsApi.getAll({ per_page: 100 }),
      ]);
      this.tickets = ticketRes.data || ticketRes;
      this.payments = paymentRes.data || paymentRes;
      this.bookingsList = bookingRes.data || bookingRes;
      this.reservationsList = reservationRes.data || reservationRes;
      this.recentTickets = [...this.tickets]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
    } catch (e) {
      console.error('Failed to fetch dashboard data:', e);
    }
  }

  handleTableAction(e) {
    const { action, item } = e.detail;

    if (action === 'view') {
      this.dispatchEvent(new CustomEvent('page-change', {
        detail: { page: 'ticket', ticketId: item.id },
        bubbles: true,
        composed: true
      }));
    }
  }

  handleViewMoreTickets() {
    this.dispatchEvent(new CustomEvent('page-change', {
      detail: { page: 'ticket' },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <content-card mode="1">
        <div class="dashboard-grid">

          <div class="welcome-banner">
            <div class="greeting">Welcome back,</div>
            <div class="name">${this.userName || 'Guest'}</div>
            <div class="subtitle">Here's an overview of your activity. Check your reservations, bookings, tickets, and payments below.</div>
          </div>

          <stat-card
            class="stat-one"
            title="My Reservations"
            textColor="#811a0a"
            .value=${this.reservationsList.length}
            .icon=${ICONS.booking}
          ></stat-card>

          <stat-card
            class="stat-two"
            title="My Tickets"
            textColor="#580460"
            .value=${this.tickets.length}
            .icon=${ICONS.ticketInbox}
          ></stat-card>

          <stat-card
            class="stat-three"
            title="Overall Payments"
            textColor="#67ab07"
            .value=${this.payments.length}
            .icon=${ICONS.payments}
          ></stat-card>

          <stat-card
            class="stat-four"
            title="No. of Bookings"
            textColor="#ffac05"
            .value=${this.bookingsList.length}
            .icon=${ICONS.clock}
          ></stat-card>

          <dashboard-table-wrapper
            class="table-section"
            title="Recent Tickets"
            .icon=${ICONS.ticket}
            viewMoreText="View more on Tickets"
            @view-more=${this.handleViewMoreTickets}
          >
            <data-table
              .data=${this.recentTickets}
              .conf=${ticketsTableConfig}
              mode="3"
              @table-action=${this.handleTableAction}
            ></data-table>
          </dashboard-table-wrapper>

        </div>
      </content-card>
    `;
  }
}

customElements.define('customer-dashboard', CustomerDashboard);
