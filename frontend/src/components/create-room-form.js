// src/components/create-room-form.js
import { LitElement, html, css } from 'lit';
import '/src/components/input-field.js';
import '/src/components/app-button.js';
import { ICONS } from '/src/components/dashboard-icons.js';

class CreateRoomForm extends LitElement {
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

    .image-upload {
      border: 1.5px dashed #e0e0e0;
      border-radius: 4px;
      padding: 8px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .image-upload:hover {
      border-color: #da0d0dd7;
      background: #fff5f5;
    }

    .image-upload input {
      display: none;
    }

    .upload-label {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      cursor: pointer;
    }

    .upload-icon {
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .upload-icon svg {
      width: 24px;
      height: 24px;
    }

    .upload-text {
      font-size: 0.7rem;
      color: #666;
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
      <form id="room-form">
        <div class="form-grid">
          <input-field
            label="Room Name"
            type="text"
            name="roomName"
            placeholder="Enter name"
            variant="compact"
            ?required=${true}>
          </input-field>

          <div class="form-group">
            <label>Room Type *</label>
            <select name="roomType" required>
              <option value="">Select type</option>
            </select>
          </div>

          <input-field
            label="Capacity"
            type="number"
            name="capacity"
            placeholder="Enter capacity"
            variant="compact"
            ?required=${true}>
          </input-field>

          <input-field
            label="Price/Hour ($)"
            type="number"
            name="pricePerHour"
            placeholder="0.00"
            variant="compact"
            ?required=${true}>
          </input-field>

          <input-field
            label="Floor"
            type="text"
            name="floor"
            placeholder="Floor"
            variant="compact">
          </input-field>

          <input-field
            label="Location"
            type="text"
            name="location"
            placeholder="Location"
            variant="compact">
          </input-field>

          <div class="form-group full">
            <label>Room Image</label>
            <div class="image-upload">
              <input 
                type="file" 
                id="room-image" 
                name="roomImage"
                accept="image/*"
              />
              <label for="room-image" class="upload-label">
                <div class="upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
                <div class="upload-text">Upload</div>
              </label>
              <slot name="image-preview"></slot>
            </div>
          </div>

          <div class="form-group full">
            <label>Description</label>
            <textarea name="description"></textarea>
          </div>
        </div>

        <div class="form-actions">
          <slot name="actions"></slot>
        </div>
      </form>
    `;
  }
}

customElements.define('create-room-form', CreateRoomForm);