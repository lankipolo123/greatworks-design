// src/pages/authentication/forgot-password.js
import { LitElement, html, css } from 'lit';
import '/src/components/input-field.js';
import '/src/layouts/auth-layout.js';

class ForgotPasswordPage extends LitElement {
    static properties = {
        loading: { type: Boolean },
        success: { type: Boolean },
        error: { type: String }
    };

    static styles = css`
    :host {
      display: block;
    }

    .forgot-card {
      background: white;
      border-radius: 12px;
      padding: 2.5rem;
      border: 3px solid #6b0606;
      width: 100%;
      max-width: 400px;
    }

    .logo {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo img {
      max-width: 180px;
      height: auto;
    }

    h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      color: #1a1a1a;
      text-align: center;
    }

    .subtitle {
      text-align: center;
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }

    .success-message {
      background: #e8f5e9;
      color: #2e7d32;
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      text-align: center;
    }

    .error-message {
      background: #fee;
      color: #c00;
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      text-align: center;
    }

    .submit-btn {
      width: 100%;
      padding: 0.875rem;
      background: #da0d0dd7;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .submit-btn:hover {
      background: rgb(212, 36, 6);
    }

    .submit-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .back-link {
      text-align: center;
      margin-top: 1rem;
    }

    .back-link a {
      color: #8d1409;
      text-decoration: none;
      font-size: 0.9rem;
    }

    .back-link a:hover {
      text-decoration: underline;
    }
  `;

    constructor() {
        super();
        this.loading = false;
        this.success = false;
        this.error = '';
    }

    handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');

        this.loading = true;
        this.error = '';
        this.success = false;

        // Simulate API call
        setTimeout(() => {
            if (email) {
                this.success = true;
                this.loading = false;
            } else {
                this.error = 'Please enter a valid email';
                this.loading = false;
            }
        }, 1000);
    }

    render() {
        return html`
      <auth-layout mode="center">
        <div slot="form" class="forgot-card">
          <div class="logo">
            <img src="/src/assets/logoExtended.svg" alt="CoWork Logo">
          </div>

          <h2>Forgot Password?</h2>
          <p class="subtitle">Enter your email to reset your password</p>

          ${this.success ? html`
            <div class="success-message">
              Password reset link has been sent to your email!
            </div>
          ` : ''}

          ${this.error ? html`
            <div class="error-message">${this.error}</div>
          ` : ''}

          <form @submit=${this.handleSubmit}>
            <input-field
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              ?required=${true}
              ?disabled=${this.loading}
            ></input-field>

            <button 
              type="submit" 
              class="submit-btn"
              ?disabled=${this.loading}
            >
              ${this.loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div class="back-link">
            <a href="#login">Back to Login</a>
          </div>
        </div>
      </auth-layout>
    `;
    }
}

customElements.define('forgot-password-page', ForgotPasswordPage);