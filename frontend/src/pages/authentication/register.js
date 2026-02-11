import { LitElement, html, css } from 'lit';
import '/src/components/authentication-card.js';
import '/src/components/input-field.js';
import '/src/layouts/auth-layout.js';
import { auth, isAuthenticated } from '/src/service/api.js';

class RegisterPage extends LitElement {
  static properties = {
    loading: { type: Boolean },
    error: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    contact: { type: String },
    address: { type: String },
    password: { type: String },
    confirmPassword: { type: String },
  };

  static styles = css`
    :host { display: block; }
    h2 { margin: 0 0 0.25rem 0; font-size: 1.25rem; color: #1a1a1a; }
    .subtitle { color: #666; font-size: 0.85rem; margin-bottom: 1rem; }
    .error-message { background: #fee; color: #c00; padding: 0.6rem; border-radius: 6px; font-size: 0.85rem; margin-bottom: 1rem; text-align: center; }

    .section-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.5rem;
      margin-top: 0.5rem;
    }

    form { display: flex; flex-direction: column; }

    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .register-btn { width: 100%; padding: 0.75rem; background: #da0d0dd7; color: white; border: none; border-radius: 6px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: background 0.2s; margin-top: 0.5rem; }
    .register-btn:hover { background: rgb(212, 36, 6); }
    .register-btn:disabled { background: #ccc; cursor: not-allowed; }
    .login-link { text-align: center; margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px solid #e0e0e0; color: #666; font-size: 0.85rem; }
    .login-link a { color: #da0d0dd7; text-decoration: none; font-weight: 600; }
    .login-link a:hover { text-decoration: underline; }
  `;

  constructor() {
    super();
    this.loading = false;
    this.error = '';
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.contact = '';
    this.address = '';
    this.password = '';
    this.confirmPassword = '';

    if (isAuthenticated()) {
      window.location.hash = 'dashboard';
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.error = '';
    this.loading = true;

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      this.loading = false;
      return;
    }

    if (this.password.length < 8) {
      this.error = 'Password must be at least 8 characters';
      this.loading = false;
      return;
    }

    try {
      const response = await auth.register({
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        password: this.password,
        password_confirmation: this.confirmPassword,
        phone: this.contact || null,
        address: this.address || null,
      });

      console.log('Registration successful:', response.user);

      if (['admin', 'moderator'].includes(response.user.role)) {
        window.location.hash = 'dashboard';
      } else {
        window.location.hash = 'booking';
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.errors) {
        const firstError = Object.values(err.errors)[0];
        this.error = Array.isArray(firstError) ? firstError[0] : firstError;
      } else {
        this.error = err.message || 'Registration failed. Please try again.';
      }
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <auth-layout mode="register">
        <authentication-card slot="form" mode="register">
          <h2>Create Account</h2>
          <p class="subtitle">Sign up to get started</p>

          ${this.error ? html`<div class="error-message">${this.error}</div>` : ''}

          <form @submit=${this.handleSubmit}>
            <div class="section-label">Personal Information</div>

            <div class="row">
              <input-field
                type="text"
                placeholder="First Name"
                .value=${this.firstName}
                @input=${e => (this.firstName = e.target.value)}
                ?required=${true}
                ?disabled=${this.loading}
              ></input-field>

              <input-field
                type="text"
                placeholder="Last Name"
                .value=${this.lastName}
                @input=${e => (this.lastName = e.target.value)}
                ?required=${true}
                ?disabled=${this.loading}
              ></input-field>
            </div>

            <input-field
              type="email"
              placeholder="Email"
              .value=${this.email}
              @input=${e => (this.email = e.target.value)}
              ?required=${true}
              ?disabled=${this.loading}
            ></input-field>

            <div class="row">
              <input-field
                type="text"
                placeholder="Contact Number"
                .value=${this.contact}
                @input=${e => (this.contact = e.target.value)}
                ?disabled=${this.loading}
              ></input-field>

              <input-field
                type="text"
                placeholder="Address"
                .value=${this.address}
                @input=${e => (this.address = e.target.value)}
                ?disabled=${this.loading}
              ></input-field>
            </div>

            <div class="section-label">Account Security</div>

            <input-field
              type="password"
              placeholder="Create a password (min 8 characters)"
              .value=${this.password}
              @input=${e => (this.password = e.target.value)}
              ?required=${true}
              ?disabled=${this.loading}
            ></input-field>

            <input-field
              type="password"
              placeholder="Confirm your password"
              .value=${this.confirmPassword}
              @input=${e => (this.confirmPassword = e.target.value)}
              ?required=${true}
              ?disabled=${this.loading}
            ></input-field>

            <button type="submit" class="register-btn" ?disabled=${this.loading}>
              ${this.loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div class="login-link">
            Already have an account? <a href="#login">Sign in</a>
          </div>
        </authentication-card>
      </auth-layout>
    `;
  }
}

customElements.define('register-page', RegisterPage);
