// src/pages/authentication/login.js
import { LitElement, html, css } from 'lit';
import '/src/components/authentication-card.js';
import '/src/components/input-field.js';
import '/src/layouts/auth-layout.js';

class LoginPage extends LitElement {
  static properties = {
    loading: { type: Boolean },
    error: { type: String }
  };

  static styles = css`
    :host {
      display: block;
    }

    h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      color: #1a1a1a;
    }

    .subtitle {
      color: #666;
      font-size: 0.85rem;
      margin-bottom: 1.5rem;
    }

    .error-message {
      background: #fee;
      color: #c00;
      padding: 0.6rem;
      border-radius: 6px;
      font-size: 0.85rem;
      margin-bottom: 1rem;
      text-align: center;
    }

    form {
      display: flex;
      flex-direction: column;
    }

    .login-btn {
      width: 100%;
      padding: 0.75rem;
      background: #da0d0dd7;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 0.5rem;
    }

    .login-btn:hover {
      background: rgb(212, 36, 6);
    }

    .login-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .forgot-password {
      text-align: center;
      margin-top: 1rem;
    }

    .forgot-password a {
      color: #8d1409;
      text-decoration: none;
      font-size: 0.85rem;
    }

    .forgot-password a:hover {
      text-decoration: underline;
    }

    .register-link {
      text-align: center;
      margin-top: 1.25rem;
      padding-top: 1.25rem;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 0.85rem;
    }

    .register-link a {
      color: #da0d0dd7;
      text-decoration: none;
      font-weight: 600;
    }

    .register-link a:hover {
      text-decoration: underline;
    }
  `;

  constructor() {
    super();
    this.loading = false;
    this.error = '';
  }

  handleSubmit(e) {
    e.preventDefault();
    // Just route to dashboard
    window.location.hash = 'dashboard';
  }

  render() {
    return html`
      <auth-layout mode="login">
        <authentication-card slot="form" mode="login">
          <h2>Sign in</h2>
          <p class="subtitle">Please enter your Login ID</p>

          ${this.error ? html`
            <div class="error-message">${this.error}</div>
          ` : ''}

          <form @submit=${this.handleSubmit}>
            <input-field
              type="email"
              name="email"
              placeholder="Please enter your Login ID"
              ?required=${true}
              ?disabled=${this.loading}
            ></input-field>

            <input-field
              type="password"
              name="password"
              placeholder="Please enter your password"
              ?required=${true}
              ?disabled=${this.loading}
            ></input-field>

            <button 
              type="submit" 
              class="login-btn"
              ?disabled=${this.loading}
            >
              ${this.loading ? 'Signing in...' : 'Continue'}
            </button>
          </form>

          <div class="forgot-password">
            <a href="#forgot-password">Forgot your password?</a>
          </div>

          <div class="register-link">
            Don't have an account? <a href="#register">Apply Now</a>
          </div>
        </authentication-card>
      </auth-layout>
    `;
  }
}

customElements.define('login-page', LoginPage);