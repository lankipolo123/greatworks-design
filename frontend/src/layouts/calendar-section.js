// src/components/layouts/calendar-section.js
import { LitElement, html, css } from 'lit';

class CalendarSection extends LitElement {
  static styles = css`
    :host {
      flex: 1;
      transition: all 0.3s ease;
      margin-right: 0.8rem;
    }

    @media (max-width: 1024px) {
      :host {
        flex: 0 0 auto;
      }
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('calendar-section', CalendarSection);