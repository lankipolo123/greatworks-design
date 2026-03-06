// src/components/book-someone-form.js
import { LitElement, html, css } from 'lit';
import '/src/components/input-field.js';
import '/src/components/app-button.js';
import { ROOM_TYPES } from '/src/configs/room-types-config.js';

class BookSomeoneForm extends LitElement {

  static properties = {
    booking: { type: Object },
    roomTypes: { type: Array },
    rooms: { type: Array },
    selectedUser: { type: Object },
    _selectedRoomType: { type: String, state: true },
  };

  constructor() {
    super();
    this.booking = null;
    this.roomTypes = null;
    this.rooms = [];
    this.selectedUser = null;
    this._selectedRoomType = '';
  }

  willUpdate(changed) {
    if (changed.has('booking') && this.booking) {
      if (this.booking.roomType && !this._selectedRoomType) {
        this._selectedRoomType = this.booking.roomType;
      }
    }
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

    .user-banner {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      background: #f0f7ff;
      border: 1px solid #b3d4fc;
      border-radius: 6px;
      font-size: 0.82rem;
      color: #1a1a1a;
    }

    .user-banner .user-name {
      font-weight: 600;
    }

    .user-banner .user-email {
      color: #666;
      font-size: 0.78rem;
    }
  `;

  _handleRoomTypeChange(e) {
    this._selectedRoomType = e.target.value;
    // Reset room selection when type changes
    const roomSelect = this.shadowRoot?.querySelector('[name="roomId"]');
    if (roomSelect) roomSelect.value = '';
  }

  get _filteredRooms() {
    if (!this.rooms?.length) return [];
    if (!this._selectedRoomType) return this.rooms;
    return this.rooms.filter(r => r.type === this._selectedRoomType);
  }

  render() {
    const b = this.booking;
    const types = this.roomTypes || ROOM_TYPES;
    const filteredRooms = this._filteredRooms;

    const u = this.selectedUser;

    return html`
      <form id="book-form">
        <div class="form-grid">
          ${u ? html`
            <input type="hidden" name="user_id" value="${u.id}" />
            <div class="user-banner">
              <div>
                <span class="user-name">${u.name}</span>
                <span class="user-email">${u.email || ''}</span>
              </div>
            </div>
          ` : html`
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
          `}

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
            <select name="roomType" required @change=${this._handleRoomTypeChange}>
              <option value="">Select type</option>
              ${types.map(rt => html`
                <option value="${rt.value}" ?selected=${(this._selectedRoomType || b?.roomType) === rt.value}>${rt.label}</option>
              `)}
            </select>
          </div>

          <div class="form-group">
            <label>Room *</label>
            <select name="roomId" required ?disabled=${!this._selectedRoomType && !filteredRooms.length}>
              <option value="">${this._selectedRoomType ? 'Select room' : 'Select room type first'}</option>
              ${filteredRooms.map(r => html`
                <option value="${r.id}" ?selected=${b?.roomId === r.id || b?.room_id === r.id}>${r.name} (cap: ${r.capacity})</option>
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
