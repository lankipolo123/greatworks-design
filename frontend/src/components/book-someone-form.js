// src/components/book-someone-form.js
import { LitElement, html, css } from 'lit';
import '/src/components/input-field.js';
import '/src/components/app-button.js';
import { ROOM_TYPES } from '/src/configs/room-types-config.js';

class BookSomeoneForm extends LitElement {

  static properties = {
    booking: { type: Object },
    roomTypes: { type: Array }
  };

  constructor() {
    super();
    this.booking = null;
    this.roomTypes = null;
  }

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
    const b = this.booking;
    const types = this.roomTypes || ROOM_TYPES;

    return html`
      <form id="book-form">
        <div class="form-grid">
          <input-field
            label="Full Name"
            type="text"
            name="userName"
            placeholder="Enter name"
            variant="compact"
            .value=${b?.userName || ''}
            ?required=${true}>
          </input-field>

          <input-field
            label="Email"
            type="email"
            name="email"
            placeholder="Enter email"
            variant="compact"
            .value=${b?.userEmail || ''}
            ?required=${true}>
          </input-field>

          <input-field
            label="Phone"
            type="tel"
            name="phone"
            placeholder="Enter phone"
            variant="compact"
            .value=${b?.phone || ''}
            ?required=${true}>
          </input-field>

          <input-field
            label="Date"
            type="date"
            name="date"
            variant="compact"
            .value=${b?.date || ''}
            ?required=${true}>
          </input-field>

          <input-field
            label="Time"
            type="time"
            name="time"
            variant="compact"
            .value=${b?.startTime || b?.time || ''}
            ?required=${true}>
          </input-field>

          <input-field
            label="Duration (hrs)"
            type="number"
            name="duration"
            .value=${b?.durationHours != null ? String(b.durationHours) : '1'}
            variant="compact"
            ?required=${true}>
          </input-field>

          <div class="form-group">
            <label>Room Type *</label>
            <select name="roomType" required>
              <option value="">Select type</option>
              ${types.map(rt => html`
                <option value="${rt.value}" ?selected=${b?.roomType === rt.value}>${rt.label}</option>
              `)}
            </select>
          </div>

          <input-field
            label="Guests"
            type="number"
            name="guests"
            .value=${b?.guests != null ? String(b.guests) : '1'}
            variant="compact">
          </input-field>

          <div class="form-group full">
            <label>Notes</label>
            <textarea name="notes" placeholder="Optional notes" rows="2">${b?.notes || ''}</textarea>
          </div>
        </div>

        <div class="form-actions">
          <slot name="actions"></slot>
        </div>
      </form>
    `;
  }
}

customElements.define('book-someone-form', BookSomeoneForm);