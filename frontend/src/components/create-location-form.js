// src/components/create-location-form.js
import { LitElement, html, css } from 'lit';
import '/src/components/input-field.js';

class CreateLocationForm extends LitElement {
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
      <form id="location-form">
        <div class="form-grid">
          <input-field
            label="Location Name"
            type="text"
            name="name"
            placeholder="Enter location name"
            variant="compact"
            ?required=${true}>
          </input-field>

          <input-field
            label="Phone"
            type="tel"
            name="phone"
            placeholder="Phone number"
            variant="compact">
          </input-field>

          <div class="form-group full">
            <input-field
              label="Address"
              type="text"
              name="address"
              placeholder="Street address"
              variant="compact">
            </input-field>
          </div>

          <input-field
            label="City"
            type="text"
            name="city"
            placeholder="City"
            variant="compact">
          </input-field>

          <input-field
            label="State"
            type="text"
            name="state"
            placeholder="State/Province"
            variant="compact">
          </input-field>

          <input-field
            label="Zip Code"
            type="text"
            name="zip_code"
            placeholder="Zip/Postal code"
            variant="compact">
          </input-field>

          <input-field
            label="Country"
            type="text"
            name="country"
            placeholder="Country"
            variant="compact">
          </input-field>

          <div class="form-group full">
            <input-field
              label="Email"
              type="email"
              name="email"
              placeholder="Contact email"
              variant="compact">
            </input-field>
          </div>

          <div class="form-group full">
            <label>Description</label>
            <textarea name="description" placeholder="Describe this location..."></textarea>
          </div>
        </div>

        <div class="form-actions">
          <slot name="actions"></slot>
        </div>
      </form>
    `;
  }
}

customElements.define('create-location-form', CreateLocationForm);
