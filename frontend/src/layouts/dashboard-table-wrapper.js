// src/components/dashboard-table-wrapper.js
import { LitElement, html, css } from 'lit';

export class DashboardTableWrapper extends LitElement {
  static properties = {
    title: { type: String },
    icon: { type: Object },
    viewMoreText: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .table-wrapper {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      border: 1.25px solid #2d2b2b45;
      display: flex;
      flex-direction: column;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      padding-bottom: 0.75rem;
    }

    .table-title-wrapper {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .table-icon {
      color: #e40b0bd7;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .table-icon svg {
      width: 20px;
      height: 20px;
    }

    .table-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #e40b0bd7;
    }

    .table-content {
      margin-bottom: 1rem;
    }

    .table-footer {
      display: flex;
      justify-content: center;
    }

    .view-more {
      font-size: 0.85rem;
      color: #ff0707d7;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
      cursor: pointer;
    }

    .view-more:hover {
      color: #8d1409;
      text-decoration: underline;
    }
  `;

  constructor() {
    super();
    this.title = '';
    this.icon = null;
    this.viewMoreText = 'View more';
  }

  handleViewMore() {
    this.dispatchEvent(new CustomEvent('view-more', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="table-wrapper">
        <div class="table-header">
          <div class="table-title-wrapper">
            ${this.icon ? html`<div class="table-icon">${this.icon}</div>` : ''}
            <div class="table-title">${this.title}</div>
          </div>
        </div>
        
        <div class="table-content">
          <slot></slot>
        </div>

        <div class="table-footer">
          <a class="view-more" @click=${this.handleViewMore}>
            ${this.viewMoreText} →
          </a>
        </div>
      </div>
    `;
  }
}

customElements.define('dashboard-table-wrapper', DashboardTableWrapper);