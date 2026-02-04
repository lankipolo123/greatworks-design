// src/components/dashboard-chart.js
import { LitElement, html, css } from 'lit';
import { ICONS } from '/src/components/dashboard-icons.js';

export class DashboardChart extends LitElement {
  static properties = {
    type: { type: String },
    title: { type: String },
    icon: { type: Object }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .chart-container {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      border: 1.25px solid #2d2b2b45;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chart-title-wrapper {
      display: flex;
      align-items: center;
      gap: 0.2rem;
    }

    .chart-icon {
      color: #ebeb09;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chart-icon svg {
      width: 20px;
      height: 20px;
    }

    .chart-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #1a1a1a;
    }

    .chart-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 0.9rem;
      min-height: 0;
    }

    .placeholder {
      text-align: center;
    }
  `;

  constructor() {
    super();
    this.type = 'chart';
    this.title = 'Chart/Table';
    this.icon = ICONS.chartLine;
  }

  render() {
    return html`
      <div class="chart-container">
        <div class="chart-header">
          <div class="chart-title-wrapper">
            ${this.icon ? html`<div class="chart-icon">${this.icon}</div>` : ''}
            <div class="chart-title">${this.title}</div>
          </div>
          <slot name="controls"></slot>
        </div>
        <div class="chart-content">
          <slot>
            <div class="placeholder">
              Chart or table content goes here
            </div>
          </slot>
        </div>
      </div>
    `;
  }
}

customElements.define('dashboard-chart', DashboardChart);