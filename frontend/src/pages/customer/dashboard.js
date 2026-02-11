// customer-dashboard.js
import { LitElement, html, css } from 'lit';
import '/src/components/content-card.js';
import '/src/components/stat-card.js';
import '/src/components/data-table.js';
import '/src/layouts/dashboard-table-wrapper.js';
import '/src/layouts/dashboard-page-layout.js';
import '/src/components/welcome-banner.js';
import { ICONS } from '/src/components/dashboard-icons.js';
import { ticketsTableConfig } from '/src/configs/tickets-config.js';
import { auth, tickets as ticketsApi, payments as paymentsApi, bookings as bookingsApi, reservations as reservationsApi } from '/src/service/api.js';

class CustomerDashboard extends LitElement {
  static properties = {
    tickets: { type: Array },
    payments: { type: Array },
    bookingsList: { type: Array },
    reservationsList: { type: Array },
    recentTickets: { type: Array },
    userName: { type: String },
    _loaded: { type: Boolean, state: true },
  };

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      height: 100%;
      box-sizing: border-box;
    }

    dashboard-page-layout {
      height: 90%;
      width: 100%;
    }

    .welcome-banner {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      border-radius: 8px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: white;
      border: 1.25px solid #2d2b2b25;
      height: 100%;
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
  `;

  constructor() {
    super();
    this.tickets = [];
    this.payments = [];
    this.bookingsList = [];
    this.reservationsList = [];
    this.recentTickets = [];
    this.userName = '';
    this._loaded = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchData();
    this._loadUserName();
  }

  async _loadUserName() {
    try {
      const user = await auth.getUser();
      this.userName = user.name || user.email || '';
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
      this._loaded = true;
    } catch (e) {
      console.error('Failed to fetch dashboard data:', e);
      this._loaded = true;
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
        <dashboard-page-layout>
          
          <stat-card
            slot="one"
            title="My Reservations"
            textColor="#811a0a"
            .value=${this._loaded ? this.reservationsList.length : '--'}
            .icon=${ICONS.booking}
          ></stat-card>

          <stat-card
            slot="two"
            title="My Tickets"
            textColor="#580460"
            .value=${this._loaded ? this.tickets.length : '--'}
            .icon=${ICONS.ticketInbox}
          ></stat-card>

          <stat-card
            slot="three"
            title="Overall Payments"
            textColor="#67ab07"
            .value=${this._loaded ? this.payments.length : '--'}
            .icon=${ICONS.payments}
          ></stat-card>

          <stat-card
            slot="four"
            title="No. of Bookings"
            textColor="#ffac05"
            .value=${this._loaded ? this.bookingsList.length : '--'}
            .icon=${ICONS.clock}
          ></stat-card>

          <welcome-banner
          slot="main"
          .userName=${this.userName || 'Guest'}
          greeting="Welcome back,"
          subtitle="Here's an overview of your activity. Check your reservations, bookings, tickets, and payments below."
        ></welcome-banner>

          <dashboard-table-wrapper
            slot="table"
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

        </dashboard-page-layout>
      </content-card>
    `;
  }
}

customElements.define('customer-dashboard', CustomerDashboard);