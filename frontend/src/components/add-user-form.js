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

          <div class="form-row">
            <div class="form-group">
              <label>Location</label>
              <select name="location" required>
                <option value="">Location - (select location)</option>
                <option value="branch1">Branch 1</option>
                <option value="branch2">Branch 2</option>
                <option value="branch3">Branch 3</option>
              </select>
            </div>

            <div class="form-group">
              <label>Role</label>
              <select name="role" required>
                <option value="">Role - (select role)</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="manager">Manager</option>
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