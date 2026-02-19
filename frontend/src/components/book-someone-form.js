// src/components/book-someone-form.js
import { LitElement, html, css } from 'lit';
import '/src/components/input-field.js';
import '/src/components/app-button.js';
import { ROOM_TYPES } from '/src/configs/room-types-config.js';

class BookSomeoneForm extends LitElement {

  static styles = css`
    :host {
      display: block;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group.full {
      grid-column: 1 / -1;
    }

    label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 3px;
    }

    select,
    textarea {
      padding: 5px 8px;
      border: 1.5px solid #2d2b2b45;
      border-radius: 4px;
      font-size: 0.8rem;
      font-family: inherit;
    }

    select:focus,
    textarea:focus {
      outline: none;
      border-color: #ff0707d7;
    }

    textarea {
      resize: vertical;
      min-height: 50px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #e0e0e0;
    }
  `;

  render() {
    return html`
      <form id="book-form">
        <div class="form-grid">
          <input-field
            label="Full Name"
            type="text"
            name="userName"
            placeholder="Enter name"
            variant="compact"
            ?required=${true}>
          </input-field>

          <input-field
            label="Email"
            type="email"
            name="email"
            placeholder="Enter email"
            variant="compact"
            ?required=${true}>
          </input-field>

          <input-field
            label="Phone"
            type="tel"
            name="phone"
            placeholder="Enter phone"
            variant="compact"
            ?required=${true}>
          </input-field>

          <input-field
            label="Date"
            type="date"
            name="date"
            variant="compact"
            ?required=${true}>
          </input-field>

          <input-field
            label="Time"
            type="time"
            name="time"
            variant="compact"
            ?required=${true}>
          </input-field>

          <input-field
            label="Duration (hrs)"
            type="number"
            name="duration"
            value="1"
            variant="compact"
            ?required=${true}>
          </input-field>

          <div class="form-group">
            <label>Room Type *</label>
            <select name="roomType" required>
              <option value="">Select type</option>
              ${ROOM_TYPES.map(rt => html`
                <option value="${rt.value}">${rt.label}</option>
              `)}
            </select>
          </div>

          <input-field
            label="Guests"
            type="number"
            name="guests"
            value="1"
            variant="compact">
          </input-field>

      
        </div>

        <div class="form-actions">
          <slot name="actions"></slot>
        </div>
      </form>
    `;
  }
}

customElements.define('book-someone-form', BookSomeoneForm);