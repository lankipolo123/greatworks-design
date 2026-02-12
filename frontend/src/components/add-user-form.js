// src/components/add-user-form.js
import { LitElement, html, css } from 'lit';
import '/src/components/input-field.js';

class AddUserForm extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .form-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    label {
      font-size: 0.875rem;
      font-weight: 400;
      color: #666;
    }

    select {
      padding: 10px 12px;
      border: 1.5px solid #e0e0e0;
      border-radius: 8px;
      font-size: 0.9rem;
      font-family: inherit;
      background: white;
      color: #666;
      cursor: pointer;
      transition: all 0.2s;
    }

    select:focus {
      outline: none;
      border-color: #8d1409;
    }

    select:hover {
      border-color: #bbb;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }
  `;

  render() {
    return html`
      <form id="user-form">
        <div class="form-grid">
          <div class="form-row">
            <input-field
              label="First Name"
              type="text"
              name="firstName"
              placeholder="First Name"
              variant="compact"
              ?required=${true}>
            </input-field>

            <input-field
              label="Last Name"
              type="text"
              name="lastName"
              placeholder="Last Name"
              variant="compact"
              ?required=${true}>
            </input-field>
          </div>

          <input-field
            label="Email"
            type="email"
            name="email"
            placeholder="Email address"
            variant="compact"
            ?required=${true}>
          </input-field>

          <input-field
            label="Password"
            type="password"
            name="password"
            placeholder="Min 8 characters"
            variant="compact"
            ?required=${true}>
          </input-field>

          <div class="form-row">
            <input-field
              label="Phone"
              type="text"
              name="phone"
              placeholder="Contact number"
              variant="compact">
            </input-field>

            <div class="form-group">
              <label>Role</label>
              <select name="role" required>
                <option value="">Select role</option>
                <option value="customer">Customer</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <slot name="actions"></slot>
        </div>
      </form>
    `;
  }
}

customElements.define('add-user-form', AddUserForm);
