// src/layouts/dashboard-page-layout.js
import { LitElement, html, css } from 'lit';

export class DashboardPageLayout extends LitElement {
  static styles = css`
    :host {
      display: grid;
      grid-template-columns: 0.9fr 0.9fr 2.2fr;
      grid-template-rows: 1fr 1.15fr auto;
      gap: 1rem;
      width: 100%;
      height: 90%;
    }

    ::slotted([slot="one"]) {
      grid-column: 1;
      grid-row: 1;
    }

    ::slotted([slot="two"]) {
      grid-column: 2;
      grid-row: 1;
    }

    ::slotted([slot="three"]) {
      grid-column: 1;
      grid-row: 2;
    }

    ::slotted([slot="four"]) {
      grid-column: 2;
      grid-row: 2;
    }

    ::slotted([slot="main"]) {
      grid-column: 3;
      grid-row: 1 / 3;
    }

    ::slotted([slot="table"]) {
      grid-column: 1 / -1;
      grid-row: 3;
    }
  `;

  render() {
    return html`
      <slot name="one"></slot>
      <slot name="two"></slot>
      <slot name="three"></slot>
      <slot name="four"></slot>
      <slot name="main"></slot>
      <slot name="table"></slot>
    `;
  }
}

customElements.define('dashboard-page-layout', DashboardPageLayout);