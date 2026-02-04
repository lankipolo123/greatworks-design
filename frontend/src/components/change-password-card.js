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

    app-button {
      width: 100%;
    }
  `;

  handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);

    this.dispatchEvent(new CustomEvent('change-password', {
      detail: {
        currentPassword: data.get('currentPassword'),
        newPassword: data.get('newPassword')
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
          
          <app-button type="primary" size="small">
            Change Password
          </app-button>
        </form>
      </div>
    `;
  }
}

customElements.define('change-password-card', ChangePasswordCard);