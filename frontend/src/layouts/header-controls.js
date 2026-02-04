// src/layouts/header-controls.js
import { LitElement, html, css } from 'lit';

class HeaderControls extends LitElement {
  static properties = {
    mode: { type: String }
  };

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      justify-content: space-between;
    }
  `;

  constructor() {
    super();
    this.mode = '1';
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('header-controls', HeaderControls);