// src/layouts/auth-layout.js
import { LitElement, html, css } from 'lit';

class AuthLayout extends LitElement {
  static properties = {
    mode: { type: String }
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .auth-wrapper {
      flex: 1;
      background: url('/src/assets/greatworks.avif') center/cover;
      background-color: #f5f5f5;
      position: relative;
    }

    .auth-wrapper::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.85);
      z-index: 0;
    }

    .auth-container {
      display: flex;
      flex: 1;
      position: relative;
      z-index: 1;
    }

    .logo {
      position: absolute;
      top: 2rem;
      left: 3rem;
      z-index: 2;
    }

    .logo img {
      max-width: 200px;
      height: auto;
    }

    .auth-form-section {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 2rem;
      width: 100%;
    }

    .footer {
      background: #1a1a1a;
      color: white;
      padding: 1.5rem 2rem;
      text-align: center;
      font-size: 0.9rem;
    }

    /* Login mode: card on right, red line on right */
    :host([mode="login"]) .auth-form-section {
      justify-content: flex-end;
      padding-right: 5rem;
      border-right: 45px solid #da0d0dd7;
    padding-top: 11.5rem;
    }

    /* Register mode: card on left, red line on left, logo above card */
    :host([mode="register"]) .auth-form-section {
      justify-content: flex-start;
      padding-left: 5rem;
      padding-top: 8rem;
      border-left: 45px solid #da0d0dd7;
    }

    :host([mode="register"]) .logo {
      position: absolute;
      top: 2rem;
      left: 3rem;
    }

    @media (max-width: 1024px) {
      .auth-form-section {
        justify-content: center !important;
        padding: 2rem !important;
      }

      .logo {
        position: static !important;
        margin: 2rem auto !important;
        text-align: center;
      }
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
    if (this.mode === 'register') {
      return html`
        <div class="auth-wrapper">
          <div class="auth-container">
            <div class="logo">
              <img src="/src/assets/logoExtended.svg" alt="CoWork Logo">
            </div>
            <div class="auth-form-section">
              <slot name="form"></slot>
            </div>
          </div>
        </div>
        <div class="footer">
          <slot name="footer">
            <p>&copy; 2024 CoWork. All rights reserved.</p>
          </slot>
        </div>
      `;
    }

    return html`
      <div class="auth-wrapper">
        <div class="auth-container">
          <div class="logo">
            <img src="/src/assets/logoExtended.svg" alt="CoWork Logo">
          </div>
          <div class="auth-form-section">
            <slot name="form"></slot>
          </div>
        </div>
      </div>
      <div class="footer">
        <slot name="footer">
          <p>&copy; 2024 CoWork. All rights reserved.</p>
        </slot>
      </div>
    `;
  }
}

customElements.define('auth-layout', AuthLayout);