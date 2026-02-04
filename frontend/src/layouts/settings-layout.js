// settings-layout.js
import { LitElement, html, css } from 'lit';

export class SettingsLayout extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .layout-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto 1fr;
      gap: 16px;
      width: 100%;
      min-height: 400px;
    }

    /* Slot positioning */
    ::slotted([slot="one"]) {
      grid-column: 1;
      grid-row: 1;
    }

    ::slotted([slot="three"]) {
      grid-column: 1;
      grid-row: 2;
    }

    ::slotted([slot="two"]) {
      grid-column: 2;
      grid-row: 1 / span 2;
    }

    ::slotted(*) {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }

    /* Fallback layout for single slot */
    :host([single]) .layout-container {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
    }

    :host([single]) ::slotted([slot="one"]) {
      grid-column: 1;
      grid-row: 1;
    }

    @media (max-width: 1024px) {
      .layout-container {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto;
      }

      ::slotted([slot="one"]) {
        grid-column: 1;
        grid-row: 1;
      }

      ::slotted([slot="three"]) {
        grid-column: 1;
        grid-row: 2;
      }

      ::slotted([slot="two"]) {
        grid-column: 1;
        grid-row: 3;
      }
    }
  `;

  firstUpdated() {
    const hasOne = this.querySelector('[slot="one"]');
    const hasTwo = this.querySelector('[slot="two"]');
    const hasThree = this.querySelector('[slot="three"]');

    if (hasOne && !hasTwo && !hasThree) {
      this.setAttribute('single', '');
    }
  }

  render() {
    return html`
      <div class="layout-container">
        <slot name="one"></slot>
        <slot name="three"></slot>
        <slot name="two"></slot>
      </div>
    `;
  }
}

customElements.define('settings-layout', SettingsLayout);