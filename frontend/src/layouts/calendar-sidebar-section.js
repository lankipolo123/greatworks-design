// src/components/layouts/sidebar-section.js
import { LitElement, html, css } from 'lit';

class SidebarSection extends LitElement {
    static styles = css`
    :host {
      flex: 0 0 calc(30% - 1.5rem);
      border-left: 1px solid #2d2b2b45;
      padding: 0 1rem 0 1rem;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: calc(100vh - 8rem);
      transition: all 0.3s ease;
    }

    :host(.closed) {
      flex: 0 0 0;
      padding: 0;
      border-left: none;
      opacity: 0;
      pointer-events: none;
    }

    @media (max-width: 1024px) {
      :host {
        border-left: none;
        border-top: 1px solid #e5e5e5;
        padding: 1.5rem 0 0 0;
        flex: 1;
        min-height: 300px;
        max-height: none;
      }

      :host(.closed) {
        display: none;
      }
    }
  `;

    render() {
        return html`<slot></slot>`;
    }
}

customElements.define('sidebar-section', SidebarSection);