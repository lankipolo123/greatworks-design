// src/components/tabs-component.js
import { LitElement, html, css } from 'lit';

export class TabsComponent extends LitElement {
  static properties = {
    tabs: { type: Array },
    activeTab: { type: String },
    variant: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .tabs-container {
      display: flex;
      gap: 1.5rem;
    }

    .tab {
      padding: 0 0 0.75rem 0;
      font-size: 0.875rem;
      font-weight: 400;
      color: #5a5858;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      white-space: nowrap;
      border-bottom: 2px solid transparent;
        margin-top: 0.5rem;
    }

    .tab:hover {
      color: #374151;
    }

    .tab.active {
      color: #111827;
      font-weight: 500;
      border-bottom: 2px solid #111827;
    }

    /* Variant: Primary */
    :host([variant="primary"]) .tab.active {
      color: #ff0707d7;
      border-bottom-color: #ff0707d7;
    }

    /* Content slot */
    .tab-content {
      display: block;
    }
  `;

  constructor() {
    super();
    this.tabs = [];
    this.activeTab = '';
    this.variant = 'default';
  }

  updated(changedProperties) {
    if (changedProperties.has('variant')) {
      if (this.variant) {
        this.setAttribute('variant', this.variant);
      } else {
        this.removeAttribute('variant');
      }
    }
  }

  handleTabClick(tabId) {
    this.activeTab = tabId;
    this.dispatchEvent(new CustomEvent('tab-change', {
      detail: { tab: tabId },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="tabs-container">
        ${this.tabs.map(tab => html`
          <button
            class="tab ${this.activeTab === tab.id ? 'active' : ''}"
            @click=${() => this.handleTabClick(tab.id)}
          >
            ${tab.label}
          </button>
        `)}
      </div>
      <div class="tab-content">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('tabs-component', TabsComponent);