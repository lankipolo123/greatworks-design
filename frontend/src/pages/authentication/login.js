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
    // 2FA state
    _twoFactorRequired: { type: Boolean, state: true },
    _twoFactorCode: { type: String, state: true },
    _twoFactorUserId: { type: Number, state: true },
    _twoFactorToken: { type: String, state: true },
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

    .totp-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d0d0d0;
      border-radius: 6px;
      font-size: 1.4rem;
      font-family: monospace;
      text-align: center;
      letter-spacing: 0.5rem;
      box-sizing: border-box;
      margin-bottom: 0.75rem;
    }

    .totp-input:focus {
      outline: none;
      border-color: #da0d0dd7;
    }

    .totp-hint {
      color: #888;
      font-size: 0.78rem;
      text-align: center;
      margin-bottom: 0.75rem;
    }

    .back-link {
      text-align: center;
      margin-top: 1rem;
      font-size: 0.85rem;
    }

    .back-link a {
      color: #666;
      text-decoration: none;
      cursor: pointer;
    }

    .back-link a:hover {
      text-decoration: underline;
    }
  `;

  constructor() {
    super();
    this.loading = false;
    this.error = '';
    this.email = '';
    this.password = '';
    this._twoFactorRequired = false;
    this._twoFactorCode = '';
    this._twoFactorUserId = null;
    this._twoFactorToken = '';

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

      if (response.two_factor_required) {
        this._twoFactorRequired = true;
        this._twoFactorUserId = response.user_id;
        this._twoFactorToken = response.two_factor_token;
        this._twoFactorCode = '';
        return;
      }

      this._redirectAfterLogin(response.user);
    } catch (err) {
      this.error = err.message || 'Invalid email or password';
    } finally {
      this.loading = false;
    }
  }

  async handleTwoFactorSubmit(e) {
    e.preventDefault();

    this.error = '';
    this.loading = true;

    try {
      const response = await auth.verify2FA(
        this._twoFactorUserId,
        this._twoFactorCode,
        this._twoFactorToken
      );

      this._redirectAfterLogin(response.user);
    } catch (err) {
      this.error = err.message || 'Invalid verification code';
    } finally {
      this.loading = false;
    }
  }

  _redirectAfterLogin(user) {
    if (['admin', 'moderator'].includes(user.role)) {
      window.location.hash = 'dashboard';
    } else {
      window.location.hash = 'booking';
    }
  }

  _backToLogin() {
    this._twoFactorRequired = false;
    this._twoFactorCode = '';
    this._twoFactorUserId = null;
    this._twoFactorToken = '';
    this.error = '';
  }

  _handleCodeInput(e) {
    // Only allow digits, max 10 chars (6 for TOTP, 10 for backup codes)
    this._twoFactorCode = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
  }

  render() {
    if (this._twoFactorRequired) {
      return html`
        <auth-layout mode="login">
          <authentication-card slot="form" mode="login">
            <h2>Two-Factor Authentication</h2>
            <p class="subtitle">Enter the code from your authenticator app</p>

            ${this.error
              ? html`<div class="error-message">${this.error}</div>`
              : null}

            <form @submit=${this.handleTwoFactorSubmit}>
              <input
                class="totp-input"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                placeholder="000000"
                .value=${this._twoFactorCode}
                @input=${this._handleCodeInput}
                ?disabled=${this.loading}
                autofocus
              />

              <div class="totp-hint">You can also use a backup code</div>

              <button class="login-btn" type="submit" ?disabled=${this.loading || !this._twoFactorCode}>
                ${this.loading ? 'Verifying...' : 'Verify'}
              </button>
            </form>

            <div class="back-link">
              <a @click=${this._backToLogin}>Back to login</a>
            </div>
          </authentication-card>
        </auth-layout>
      `;
    }

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

          <div class="register-link">
            Don't have an account? <a href="#register">Sign up</a>
          </div>
        </authentication-card>
      </auth-layout>
    `;
  }
}

customElements.define('login-page', LoginPage);
