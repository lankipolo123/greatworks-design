// src/components/authentication-card.js
import { LitElement, html, css } from 'lit';

class AuthenticationCard extends LitElement {
  static properties = {
    mode: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    :host([mode="login"]) {
      max-width: 320px;
    }

    :host([mode="register"]) {
      max-width: 560px;
    }

    .card {
      background: white;
      border-radius: 8px;
      border: 3px solid #6b0606;
    }

    :host([mode="login"]) .card {
      padding: 1rem 1.5rem;
    }

    :host([mode="register"]) .card {
      padding: 1rem 1rem;
    }

    ::slotted(*) {
      margin: 0;
    }
  `;

  constructor() {
    super();
    this.mode = 'login';
  }

  updated(changedProperties) {
    if (changedProperties.has('mode')) {
      this.setAttribute('mode', this.mode);
    }
  }

  render() {
    return html`
      <div class="card">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('authentication-card', AuthenticationCard);