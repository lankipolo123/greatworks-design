// src/components/book-someone-form.js
import { LitElement, html, css } from 'lit';
import '/src/components/input-field.js';
import '/src/components/app-button.js';
import { ROOM_TYPES } from '/src/configs/room-types-config.js';
import { bookings, systemSettings } from '/src/service/api.js';

class BookSomeoneForm extends LitElement {

  static properties = {
    booking: { type: Object },
    roomTypes: { type: Array },
    rooms: { type: Array },
    selectedUser: { type: Object },
    _selectedRoomType: { type: String, state: true },
    _selectedDate: { type: String, state: true },
    _selectedTime: { type: String, state: true },
    _selectedDuration: { type: String, state: true },
    _roomAvailability: { type: Object, state: true },
    _availLoading: { type: Boolean, state: true },
    _availEnabled: { type: Boolean, state: true },
  };

  constructor() {
    super();
    this.booking = null;
    this.roomTypes = null;
    this.rooms = [];
    this.selectedUser = null;
    this._selectedRoomType = '';
    this._selectedDate = '';
    this._selectedTime = '';
    this._selectedDuration = '1';
    this._roomAvailability = {};
    this._availLoading = false;
    this._availEnabled = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadAvailSetting();
  }

  async _loadAvailSetting() {
    try {
      const settings = await systemSettings.getAll();
      this._availEnabled = settings['room_availability_check'] === '1';
    } catch {
      this._availEnabled = false;
    }
  }

  willUpdate(changed) {
    if (changed.has('booking') && this.booking) {
      if (this.booking.roomType && !this._selectedRoomType) {
        this._selectedRoomType = this.booking.roomType;
      }
      if (this.booking.date && !this._selectedDate) {
        this._selectedDate = this.booking.date;
      }
      if ((this.booking.startTime || this.booking.time) && !this._selectedTime) {
        this._selectedTime = this.booking.startTime || this.booking.time;
      }
      if (this.booking.durationHours != null && this._selectedDuration === '1') {
        this._selectedDuration = String(this.booking.durationHours);
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

    .room-avail {
      font-size: 0.72rem;
      font-weight: 600;
    }

    .room-avail.available {
      color: #16a34a;
    }

    .room-avail.full {
      color: #dc2626;
    }

    .avail-hint {
      font-size: 0.68rem;
      color: #999;
      margin-top: 2px;
    }
  `;

  _handleRoomTypeChange(e) {
    this._selectedRoomType = e.target.value;
    // Reset room selection when type changes
    const roomSelect = this.shadowRoot?.querySelector('[name="roomId"]');
    if (roomSelect) roomSelect.value = '';
    this._roomAvailability = {};
    this._checkAllRoomAvailability();
  }

  _handleDateChange(e) {
    this._selectedDate = e.detail.value;
    this._checkAllRoomAvailability();
  }

  _handleTimeChange(e) {
    this._selectedTime = e.detail.value;
    this._checkAllRoomAvailability();
  }

  _handleDurationChange(e) {
    this._selectedDuration = e.detail.value;
    this._checkAllRoomAvailability();
  }

  get _filteredRooms() {
    if (!this.rooms?.length) return [];
    if (!this._selectedRoomType) return this.rooms;
    return this.rooms.filter(r => r.type === this._selectedRoomType);
  }

  async _checkAllRoomAvailability() {
    if (!this._availEnabled) {
      this._roomAvailability = {};
      return;
    }

    const date = this._selectedDate;
    const time = this._selectedTime;
    const duration = parseInt(this._selectedDuration);
    const roomsToCheck = this._filteredRooms;

    if (!date || !time || !duration || duration <= 0 || !roomsToCheck.length) {
      this._roomAvailability = {};
      return;
    }

    // Debounce
    clearTimeout(this._availDebounce);
    this._availDebounce = setTimeout(async () => {
      this._availLoading = true;
      const avail = {};

      try {
        const results = await Promise.all(
          roomsToCheck.map(r =>
            bookings.getAvailability({
              room_id: r.id,
              date,
              start_time: time,
              duration_hours: duration,
            }).catch(() => null)
          )
        );

        results.forEach((res, i) => {
          if (res) {
            avail[roomsToCheck[i].id] = {
              available: res.available_slots,
              total: res.total_slots,
              booked: res.booked_slots,
            };
          }
        });
      } catch {
        // fail silently
      }

      this._roomAvailability = avail;
      this._availLoading = false;
    }, 300);
  }

  _roomLabel(room) {
    const a = this._roomAvailability[room.id];
    if (!a) return `${room.name} (cap: ${room.capacity})`;
    if (a.available <= 0) return `${room.name} — FULL`;
    return `${room.name} — ${a.available}/${a.total} slots`;
  }

  _isRoomFull(room) {
    const a = this._roomAvailability[room.id];
    return a && a.available <= 0;
  }

  render() {
    const b = this.booking;
    const types = this.roomTypes || ROOM_TYPES;
    const filteredRooms = this._filteredRooms;
    const hasAvail = Object.keys(this._roomAvailability).length > 0;

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
            ?required=${true}
            @input-change=${this._handleDateChange}>
          </input-field>

          <input-field
            label="Time"
            type="time"
            name="time"
            variant="compact"
            .value=${b?.startTime || b?.time || ''}
            ?required=${true}
            @input-change=${this._handleTimeChange}>
          </input-field>

          <input-field
            label="Duration (hrs)"
            type="number"
            name="duration"
            .value=${b?.durationHours != null ? String(b.durationHours) : '1'}
            variant="compact"
            ?required=${true}
            @input-change=${this._handleDurationChange}>
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
              <option value="">${this._selectedRoomType
                ? (this._availLoading ? 'Checking availability...' : 'Select room')
                : 'Select room type first'}</option>
              ${filteredRooms.map(r => html`
                <option
                  value="${r.id}"
                  ?selected=${b?.roomId === r.id || b?.room_id === r.id}
                  ?disabled=${this._isRoomFull(r)}
                >${this._roomLabel(r)}</option>
              `)}
            </select>
            ${hasAvail && !this._availLoading ? html`
              <span class="avail-hint">Availability shown for ${this._selectedDate} at ${this._selectedTime}</span>
            ` : ''}
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
