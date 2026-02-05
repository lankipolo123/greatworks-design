// src/layouts/dashboard-layout.js
import { LitElement, html, css } from 'lit';

class DashboardLayout extends LitElement {
  static properties = {
    sidebarCollapsed: { type: Boolean }
  };

  static styles = css`
    :host {
      display: grid;
      grid-template-areas:
        "sidebar header"
        "sidebar content";
      grid-template-columns: var(--sidebar-width) 1fr;
      grid-template-rows: auto 1fr;
      height: 100vh;
      width: 100vw;
      margin: 0;
      padding: 0;
      gap: 0;
      position: relative;
      transition: grid-template-columns 0.3s ease;
    }

    :host([collapsed]) {
      grid-template-columns: 60px 1fr;
    }

    ::slotted([slot="sidebar"]) {
      grid-area: sidebar;
      margin: 0;
      padding: 0;
      overflow: visible;
    }

    ::slotted([slot="header"]) {
      grid-area: header;
      margin: 0;
      padding: 0;
    }

    ::slotted([slot="content"]) {
      grid-area: content;
      overflow-y: auto;
      margin: 0;
      padding: 0;
    }

    .toggle-btn {
      position: absolute;
      top: 70px;
      left: var(--sidebar-width);
      transform: translateX(-50%);
      background: white;
      border: 0.5px solid rgba(45, 43, 43, 0.27);
      border-radius: 50%;
      cursor: pointer;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 0;
    }

    .toggle-btn:hover {
      background: #f5f5f5;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    :host([collapsed]) .toggle-btn {
      left: 60px;
    }

    .toggle-btn img {
      width: 25px;
      height: 25px;
      transition: transform 0.3s ease;
      display: block;
    }

    :host([collapsed]) .toggle-btn img {
      transform: rotate(180deg);
    }
  `;

  constructor() {
    super();
    this.sidebarCollapsed = false;
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    if (this.sidebarCollapsed) {
      this.setAttribute('collapsed', '');
    } else {
      this.removeAttribute('collapsed');
    }

    this.dispatchEvent(new CustomEvent('sidebar-toggle', {
      detail: { collapsed: this.sidebarCollapsed },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <slot name="sidebar"></slot>
      <slot name="header"></slot>
      <slot name="content"></slot>
      
      <button class="toggle-btn" @click=${this.toggleSidebar}>
        <img src="/assets/collapsible.svg" alt="Toggle sidebar" />
      </button>
    `;
  }
}

customElements.define('dashboard-layout', DashboardLayout);