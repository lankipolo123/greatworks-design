// src/components/badge-component.js
import { LitElement, html, css } from 'lit';

class BadgeComponent extends LitElement {
  static properties = {
    variant: { type: String },
    size: { type: String },
    label: { type: String }
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 4px 12px;
      border-radius: 12px;
      font-weight: 500;
      white-space: nowrap;
      transition: all 0.2s ease;
    }

    /* Sizes */
    .badge.small {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 10px;
    }

    .badge.medium {
      font-size: 0.85rem;
      padding: 4px 12px;
      border-radius: 12px;
    }

    .badge.large {
      font-size: 0.95rem;
      padding: 6px 16px;
      border-radius: 14px;
    }

    /* Status Variants */
    .badge.pending {
      background: #fff3cd;
      color: #856404;
    }

    .badge.ongoing,
    .badge.confirmed,
    .badge.processing {
      background: #ffffff;
      color: #0066ff;
    }

    .badge.completed,
    .badge.success,
    .badge.active {
      background: #ffffffdf;
      color: #b5f021;
    }

    .badge.cancelled,
    .badge.failed,
    .badge.rejected {
      background: #f8d7da;
      color: #842029;
    }

    .badge.inactive,
    .badge.archived,
    .badge.disabled {
      background: #e2e3e5;
      color: #41464b;
    }

    .badge.warning {
      background: #fff3cd;
      color: #997404;
    }

    .badge.info {
      background: #d1ecf1;
      color: #0c5460;
    }

    /* Category Variants */
    .badge.technical {
      background: #00ccff;
      color: #ffffff;
    }

    .badge.billing {
      background: #fff3e0;
      color: #f57c00;
    }

    .badge.general {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .badge.urgent {
      background: #ffebee;
      color: #c62828;
    }

    /* Priority Variants */
    .badge.low {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .badge.medium {
      background: #fff9c4;
      color: #f9a825;
    }

    .badge.high {
      background: #ffe0b2;
      color: #e65100;
    }

    .badge.critical {
      background: #ffcdd2;
      color: #c62828;
    }

    /* Solid Variants */
    .badge.primary {
      background: #007bff;
      color: white;
    }

    .badge.secondary {
      background: #6c757d;
      color: white;
    }

    .badge.danger {
      background: #dc3545;
      color: white;
    }

    /* Outline Variants */
    .badge.outline {
      background: transparent;
      border: 1.5px solid currentColor;
    }

    .badge.outline.primary {
      color: #007bff;
      border-color: #007bff;
    }

    .badge.outline.success {
      color: #28a745;
      border-color: #28a745;
    }

    .badge.outline.danger {
      color: #dc3545;
      border-color: #dc3545;
    }

    .badge.outline.warning {
      color: #ffc107;
      border-color: #ffc107;
    }

    .badge.outline.info {
      color: #17a2b8;
      border-color: #17a2b8;
    }

    /* Dot Indicator */
    .badge.with-dot::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
      margin-right: 6px;
    }
  `;

  constructor() {
    super();
    this.variant = 'primary';
    this.size = 'medium';
    this.label = '';
  }

  render() {
    return html`
      <span class="badge ${this.variant} ${this.size}">
        <slot>${this.label}</slot>
      </span>
    `;
  }
}

customElements.define('badge-component', BadgeComponent);