import { LitElement, html, } from 'lit';
import { appButtonStyles } from '/src/styles/app-button-styles.js'

export class AppButton extends LitElement {
  static properties = {
    type: { type: String },   // primary | secondary | tertiary | quaternary | danger | warning
    size: { type: String },   // small | medium | large
    disabled: { type: Boolean }
  };

  static styles = appButtonStyles;

  constructor() {
    super();
    this.type = 'primary';
    this.size = 'medium';
    this.disabled = false;
  }

  render() {
    return html`
      <button
        class="${this.type} ${this.size}"
        ?disabled=${this.disabled}
      >
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('app-button', AppButton);
