// src/components/book-someone-form.js
import { LitElement, html, css } from 'lit';
import '/src/components/input-field.js';
import '/src/components/app-button.js';
import { ROOM_TYPES } from '/src/configs/room-types-config.js';

class BookSomeoneForm extends LitElement {

  static properties = {
    booking: { type: Object },
    roomTypes: { type: Array },
    roomsList: { type: Array },
    locationsList: { type: Array },
    _selectedLocation: { type: String, state: true },
    _selectedRoomType: { type: String, state: true },
    _startHour: { type: String, state: true },
    _endHour: { type: String, state: true },
  };

  constructor() {
    super();
    this.booking = null;
    this.roomTypes = null;
    this.roomsList = [];
    this.locationsList = [];
    this._selectedLocation = '';
    this._selectedRoomType = '';
    this._startHour = '';
    this._endHour = '';
  }

  updated(changed) {
    if (changed.has('booking') && this.booking) {
      if (this.booking.locationId && !this._selectedLocation) {
        this._selectedLocation = String(this.booking.locationId);
      }
      if (this.booking.roomType && !this._selectedRoomType) {
        this._selectedRoomType = this.booking.roomType;
      }
      if ((this.booking.startTime || this.booking.time) && !this._startHour) {
        this._startHour = this.booking.startTime || this.booking.time || '';
        // Normalize to hour
        if (this._startHour) {
          const h = parseInt(this._startHour.split(':')[0]);
          this._startHour = String(h).padStart(2, '0') + ':00';
        }
      }
      if (this.booking.endTime && !this._endHour) {
        this._endHour = this.booking.endTime;
        if (this._endHour) {
          const h = parseInt(this._endHour.split(':')[0]);
          this._endHour = String(h).padStart(2, '0') + ':00';
        }
      } else if (this.booking.durationHours && this._startHour && !this._endHour) {
        const startH = parseInt(this._startHour.split(':')[0]);
        const endH = startH + this.booking.durationHours;
        if (endH <= 23) {
          this._endHour = String(endH).padStart(2, '0') + ':00';
        }
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

    .occupancy-bar {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border-radius: 6px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      font-size: 0.78rem;
      color: #166534;
      font-weight: 500;
    }

    .occupancy-bar svg {
      width: 16px;
      height: 16px;
      fill: #166534;
    }

    .occ-times {
      font-weight: 700;
    }

    .occ-duration {
      margin-left: auto;
      font-size: 0.72rem;
      color: #15803d;
      font-weight: 600;
    }
  `;

  _getHourOptions() {
    const hours = [];
    for (let h = 6; h <= 22; h++) {
      const val = String(h).padStart(2, '0') + ':00';
      const label = h === 0 ? '12:00 AM' : h < 12 ? `${h}:00 AM` : h === 12 ? '12:00 PM' : `${h - 12}:00 PM`;
      hours.push({ value: val, label });
    }
    return hours;
  }

  _getEndHourOptions(startHour) {
    if (!startHour) return [];
    const startH = parseInt(startHour.split(':')[0]);
    const hours = [];
    for (let h = startH + 1; h <= Math.min(startH + 12, 23); h++) {
      const val = String(h).padStart(2, '0') + ':00';
      const label = h === 0 ? '12:00 AM' : h < 12 ? `${h}:00 AM` : h === 12 ? '12:00 PM' : `${h - 12}:00 PM`;
      const dur = h - startH;
      hours.push({ value: val, label: `${label} (${dur}h)` });
    }
    return hours;
  }

  _calcDuration(startHour, endHour) {
    if (!startHour || !endHour) return 0;
    return parseInt(endHour.split(':')[0]) - parseInt(startHour.split(':')[0]);
  }

  _handleLocationChange(e) {
    this._selectedLocation = e.target.value;
    // Reset room selection when location changes
    const form = this.shadowRoot?.getElementById('book-form');
    const roomSelect = form?.querySelector('[name="room_id"]');
    if (roomSelect) roomSelect.value = '';
    this._fireFormChange();
  }

  _handleRoomTypeChange(e) {
    this._selectedRoomType = e.target.value;
    // Reset room selection when room type changes
    const form = this.shadowRoot?.getElementById('book-form');
    const roomSelect = form?.querySelector('[name="room_id"]');
    if (roomSelect) roomSelect.value = '';
    this._fireFormChange();
  }

  _handleStartHourChange(e) {
    this._startHour = e.target.value;
    this._endHour = '';
    this._fireFormChange();
  }

  _handleEndHourChange(e) {
    this._endHour = e.target.value;
    this._fireFormChange();
  }

  _fireFormChange() {
    this.dispatchEvent(new CustomEvent('form-change', {
      bubbles: true,
      composed: true,
      detail: {
        startHour: this._startHour,
        endHour: this._endHour,
        duration: this._calcDuration(this._startHour, this._endHour),
      }
    }));
  }

  get _filteredRooms() {
    let filtered = this.roomsList || [];
    if (this._selectedLocation) {
      filtered = filtered.filter(r => String(r.location_id) === this._selectedLocation);
    }
    if (this._selectedRoomType) {
      filtered = filtered.filter(r => r.type === this._selectedRoomType);
    }
    return filtered;
  }

  render() {
    const b = this.booking;
    const types = this.roomTypes || ROOM_TYPES;
    const duration = this._calcDuration(this._startHour, this._endHour);
    const filteredRooms = this._filteredRooms;
    const hasRooms = this.roomsList && this.roomsList.length > 0;

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

          ${hasRooms && this.locationsList?.length > 0 ? html`
            <div class="form-group">
              <label>Location *</label>
              <select name="location" required @change=${this._handleLocationChange}>
                <option value="">Select location</option>
                ${this.locationsList.map(loc => html`
                  <option value="${loc.id}" ?selected=${this._selectedLocation === String(loc.id)}>${loc.name}</option>
                `)}
              </select>
            </div>
          ` : ''}

          <div class="form-group">
            <label>Room Type *</label>
            <select name="roomType" required @change=${this._handleRoomTypeChange}>
              <option value="">Select type</option>
              ${types.map(rt => html`
                <option value="${rt.value}" ?selected=${this._selectedRoomType === rt.value || b?.roomType === rt.value}>${rt.label}</option>
              `)}
            </select>
          </div>

          ${hasRooms ? html`
            <div class="form-group">
              <label>Room *</label>
              <select name="room_id" required>
                <option value="">Select room</option>
                ${filteredRooms.map(r => html`
                  <option value="${r.id}" ?selected=${b?.roomId === r.id || b?.room_id === r.id}>${r.name} (cap: ${r.capacity})</option>
                `)}
              </select>
            </div>
          ` : ''}

          <div class="form-group">
            <label>Start Time *</label>
            <select name="start_hour" required @change=${this._handleStartHourChange}>
              <option value="">Select start</option>
              ${this._getHourOptions().map(h => html`
                <option value="${h.value}" ?selected=${this._startHour === h.value}>${h.label}</option>
              `)}
            </select>
          </div>

          <div class="form-group">
            <label>End Time *</label>
            <select name="end_hour" required @change=${this._handleEndHourChange}
              ?disabled=${!this._startHour}>
              <option value="">Select end</option>
              ${this._getEndHourOptions(this._startHour).map(h => html`
                <option value="${h.value}" ?selected=${this._endHour === h.value}>${h.label}</option>
              `)}
            </select>
          </div>

          ${duration > 0 ? html`
            <div class="occupancy-bar">
              <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
              <span>Occupancy: <span class="occ-times">${this._startHour} — ${this._endHour}</span></span>
              <span class="occ-duration">${duration} hour${duration > 1 ? 's' : ''}</span>
            </div>
          ` : ''}

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

        <slot></slot>

        <div class="form-actions">
          <slot name="actions"></slot>
        </div>
      </form>
    `;
  }
}

customElements.define('book-someone-form', BookSomeoneForm);
