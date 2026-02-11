// change-email-card.js
import { LitElement, html, css } from 'lit';
import '/src/components/app-button.js';

export class ChangeEmailCard extends LitElement {
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

    app-button {
      width: 100%;
    }
  `;

  handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEmail = formData.get('newEmail');
    const password = formData.get('password');

    this.dispatchEvent(new CustomEvent('change-email', {
      detail: { newEmail, password },
      bubbles: true,
      composed: true
    }));

    e.target.reset();
  }

  render() {
    return html`
      <div class="section">
        <h3 class="section-title">Change Email</h3>

        <form @submit=${this.handleSubmit}>
          <input
            type="email"
            name="newEmail"
            placeholder="New email address"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Confirm your password"
            required
          />

          <app-button type="secondary" size="small">
            Update Email
          </app-button>
        </form>
      </div>
    `;
  }
}

customElements.define('change-email-card', ChangeEmailCard);
