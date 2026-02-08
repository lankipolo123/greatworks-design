import { LitElement, html, css } from 'lit';
import '/src/components/authentication-card.js';
import '/src/components/input-field.js';
import '/src/layouts/auth-layout.js';
import { auth, isAuthenticated } from '/src/service/api.js';

class LoginPage extends LitElement {
  static properties = {
    loading: { type: Boolean },
    error: { type: String },
    email: { type: String },
    password: { type: String },
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
      margin-top: 0.5rem;
    }

    .login-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  `;

  constructor() {
    super();
    this.loading = false;
    this.error = '';
    this.email = '';
    this.password = '';

    if (isAuthenticated()) {
      window.location.hash = 'dashboard';
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    this.error = '';
    this.loading = true;

    try {
      const response = await auth.login(this.email, this.password);

      if (['admin', 'moderator'].includes(response.user.role)) {
        window.location.hash = 'dashboard';
      } else {
        window.location.hash = 'booking';
      }
    } catch (err) {
      this.error = err.message || 'Invalid email or password';
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <auth-layout mode="login">
        <authentication-card slot="form" mode="login">
          <h2>Sign in</h2>
          <p class="subtitle">Please enter your Login ID</p>

          ${this.error
        ? html`<div class="error-message">${this.error}</div>`
        : null}

          <form @submit=${this.handleSubmit}>
            <input-field
              type="email"
              placeholder="Please enter your Email"
              .value=${this.email}
              @input=${e => (this.email = e.target.value)}
              ?disabled=${this.loading}
              required
            ></input-field>

            <input-field
              type="password"
              placeholder="Please enter your password"
              .value=${this.password}
              @input=${e => (this.password = e.target.value)}
              ?disabled=${this.loading}
              required
            ></input-field>

            <button class="login-btn" type="submit" ?disabled=${this.loading}>
              ${this.loading ? 'Signing in...' : 'Continue'}
            </button>
          </form>
        </authentication-card>
      </auth-layout>
    `;
  }
}

customElements.define('login-page', LoginPage);
