// admin-dashboard.js
import { LitElement, html, css } from 'lit';
import '/src/layouts/dashboard-page-layout.js';
import '/src/components/content-card.js';
import '/src/components/stat-card.js';
import '/src/components/dashboard-chart.js';
import '/src/components/data-table.js';
import '/src/layouts/dashboard-table-wrapper.js';
import { ICONS } from '/src/components/dashboard-icons.js';
import { mockTickets } from '/src/mock-datas/mock-ticket.js';
import { mockUsers } from '/src/mock-datas/mock-users.js';
import { mockReservations } from '/src/mock-datas/mock-reservation.js';
import { dasboardTicketConfig } from '/src/configs/dashboard-ticket-configs.js';
import { DashboardStats } from '/src/utility/dashboard-stats.js';

class AdminDashboard extends LitElement {
  static properties = {
    tickets: { type: Array },
    users: { type: Array },
    reservations: { type: Array },
    recentTickets: { type: Array },
    stats: { type: Object }
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

    this.tickets = [...mockTickets];
    this.users = [...mockUsers];
    this.reservations = [...mockReservations];
    this.recentTickets = [];
    this.stats = {
      monthlyUsers: 0,
      users: 0,
      totalTickets: 0,
      pendingTickets: 0
    };

    this.updateDashboard();
  }

  updateDashboard() {
    this.computeStats();
    this.computeRecentTickets();
  }

  computeStats() {
    // Use utility to calculate all stats
    this.stats = DashboardStats.getAllStats({
      users: this.users,
      tickets: this.tickets,
      reservations: this.reservations
    });
  }

  computeRecentTickets() {
    this.recentTickets = [...this.tickets]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }

  handleTableAction(e) {
    const { action, item } = e.detail;

    if (action === 'ticketView') {
      this.dispatchEvent(new CustomEvent('page-change', {
        detail: { page: 'ticket', ticketId: item.id },
        bubbles: true,
        composed: true
      }));
    }

    console.log('Table action:', action, item);
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
            title="Monthly Users"
            textColor="#811a0a"
            .value=${this.stats.monthlyUsers}
            .icon=${ICONS.users}
          ></stat-card>

          <stat-card
            slot="two"
            title="Total Users"
            textColor="#580460"
            .value=${this.stats.totalUsers}
            .icon=${ICONS.userSingle}
          ></stat-card>

          <stat-card
            slot="three"
            title="Total Tickets"
            textColor="#67ab07" 
            .value=${this.stats.totalTickets}
            .icon=${ICONS.ticketInbox}
          ></stat-card>

          <stat-card
            slot="four"
            title="Pending Tickets"
            textColor="#ffac05" 
            .value=${this.stats.pendingTickets}
            .icon=${ICONS.clock}
          ></stat-card>

          <dashboard-chart
            slot="main"
            title="Analytics Overview"
            .icon=${ICONS.activity}
          ></dashboard-chart>

          <dashboard-table-wrapper
            slot="table"
            title="Recent Tickets"
            .icon=${ICONS.ticket}
            viewMoreText="View more on Tickets"
            @view-more=${this.handleViewMoreTickets}
          >
            <data-table
              .data=${this.recentTickets}
              .conf=${dasboardTicketConfig}
              mode="3"
              @table-action=${this.handleTableAction}
            ></data-table>
          </dashboard-table-wrapper>

        </dashboard-page-layout>
      </content-card>
    `;
  }
}

customElements.define('admin-dashboard', AdminDashboard);