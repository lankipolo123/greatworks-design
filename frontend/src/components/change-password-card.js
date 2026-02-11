// change-password-card.js
import { LitElement, html, css } from 'lit';
import '/src/components/app-button.js';

export class ChangePasswordCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .section-title {
      font-weight: bold;
      font-size: 0.95rem;
      margin: 0;
      color: #1a1a1a;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    input {
      padding: 8px 10px;
      border-radius: 5px;
      border: 1px solid #d0d0d0;
      font-size: 0.85rem;
      font-family: inherit;
      background: #ffffff;
      transition: border-color 0.2s;
    }

    input:focus {
      outline: none;
      border-color: #666;
    }

    input::placeholder {
      color: #999;
    }

    .error {
      color: #c00;
      font-size: 0.8rem;
    }

    app-button {
      width: 100%;
    }
  `;

  static properties = {
    _error: { type: String, state: true },
  };

  constructor() {
    super();
    this._error = '';
  }

  handleSubmit(e) {
    e.preventDefault();
    this._error = '';
    const data = new FormData(e.target);
    const newPassword = data.get('newPassword');
    const confirmPassword = data.get('confirmPassword');

    if (newPassword !== confirmPassword) {
      this._error = 'Passwords do not match';
      return;
    }

    if (newPassword.length < 8) {
      this._error = 'Password must be at least 8 characters';
      return;
    }

    this.dispatchEvent(new CustomEvent('change-password', {
      detail: {
        currentPassword: data.get('currentPassword'),
        newPassword,
        newPasswordConfirmation: confirmPassword,
      },
      bubbles: true,
      composed: true
    }));

    e.target.reset();
  }

  render() {
    return html`
      <div class="section">
        <h3 class="section-title">Change Password</h3>

        <form @submit=${this.handleSubmit}>
          <input
            type="password"
            name="currentPassword"
            placeholder="Current password"
            required
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New password"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            required
          />
          ${this._error ? html`<div class="error">${this._error}</div>` : ''}

          <app-button type="primary" size="small">
            Change Password
          </app-button>
        </form>
      </div>
    `;
  }
}

customElements.define('change-password-card', ChangePasswordCard);
