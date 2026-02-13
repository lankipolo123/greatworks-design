// src/components/create-location-form.js
import { LitElement, html, css } from 'lit';
import '/src/components/input-field.js';

class CreateLocationForm extends LitElement {
  static properties = {
    selectedImage: { type: Object },
    imagePreview: { type: String },
  };

  constructor() {
    super();
    this.selectedImage = null;
    this.imagePreview = null;
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

    .image-preview {
      margin-top: 8px;
      position: relative;
      border-radius: 4px;
      overflow: hidden;
    }

    .image-preview img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 4px;
    }

    .remove-image {
      position: absolute;
      top: 4px;
      right: 4px;
      background: rgba(255, 0, 0, 0.8);
      color: white;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      line-height: 1;
      transition: background 0.2s;
    }

    .remove-image:hover {
      background: rgba(255, 0, 0, 1);
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

  handleImageSelect(e) {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      this.selectedImage = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        this.imagePreview = event.target.result;
      };
      reader.readAsDataURL(file);

      // Dispatch event to parent
      this.dispatchEvent(new CustomEvent('image-selected', {
        detail: { file },
        bubbles: true,
        composed: true
      }));
    }
  }

  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;

    // Clear the file input
    const fileInput = this.shadowRoot.querySelector('#location-image');
    if (fileInput) {
      fileInput.value = '';
    }

    // Dispatch event to parent
    this.dispatchEvent(new CustomEvent('image-removed', {
      bubbles: true,
      composed: true
    }));
  }

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
            <label>Location Image</label>
            <div class="image-upload">
              <input
                type="file"
                id="location-image"
                name="locationImage"
                accept="image/*"
                @change=${this.handleImageSelect}
              />
              <label for="location-image" class="upload-label">
                <div class="upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
                <div class="upload-text">${this.imagePreview ? 'Change Image' : 'Upload Image'}</div>
              </label>

              ${this.imagePreview ? html`
                <div class="image-preview">
                  <img src="${this.imagePreview}" alt="Location preview" />
                  <button
                    type="button"
                    class="remove-image"
                    @click=${this.removeImage}
                    title="Remove image"
                  >×</button>
                </div>
              ` : ''}
            </div>
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
