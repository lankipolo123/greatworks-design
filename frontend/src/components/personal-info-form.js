import { LitElement, html, css } from 'lit';
import '/src/components/app-button.js';

export class PersonalInfoForm extends LitElement {
  static properties = {
    editing: { type: Boolean },
    isLoading: { type: Boolean },
    userInfo: { type: Object },
  };

  constructor() {
    super();
    this.editing = false;
    this.isLoading = false;
    this.userInfo = {};
  }

  static styles = css`
    :host { display: block; }
    .form-card {
      background: #fff;
      border-radius: 10px;
      border: 1px solid #ccc;
      overflow: hidden;
      position: relative;
    }
    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      background: #d6150b;
      color: white;
      font-weight: bold;
    }
    .edit-icon {
      cursor: pointer;
      font-size: 1rem;
      transition: opacity 0.2s;
    }
    .edit-icon:hover { opacity: 0.8; }
    form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      padding: 20px;
    }
    .address { grid-column: 1 / -1; }
    .btn-row { grid-column: 1 / -1; display: flex; gap: 8px; }
    input, select, textarea {
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #ccc;
      font-family: inherit;
      font-size: 0.85rem;
    }
    input:disabled, textarea:disabled {
      background: #f5f5f5;
      color: #666;
    }
    textarea {
      resize: vertical;
      min-height: 60px;
    }
  `;

  get _firstName() {
    if (!this.userInfo?.name) return '';
    const parts = this.userInfo.name.split(' ');
    return parts[0] || '';
  }

  get _lastName() {
    if (!this.userInfo?.name) return '';
    const parts = this.userInfo.name.split(' ');
    return parts.slice(1).join(' ') || '';
  }

  toggleEdit() {
    this.editing = !this.editing;
  }

  handleSubmit(e) {
    e.preventDefault();
    this.isLoading = true;

    const data = Object.fromEntries(
      new FormData(e.target).entries()
    );

    this.dispatchEvent(new CustomEvent('personal-info-update', {
      detail: data,
      bubbles: true,
      composed: true
    }));

    this.isLoading = false;
    this.editing = false;
  }

  render() {
    return html`
      <div class="form-card">
        <div class="form-header">
          Personal Information
          <span class="edit-icon" @click=${this.toggleEdit}>${this.editing ? '✕' : '✎'}</span>
        </div>

        <form @submit=${this.handleSubmit}>
          <input name="firstName" placeholder="First Name" .value=${this._firstName} ?disabled=${!this.editing} />
          <input name="lastName" placeholder="Last Name" .value=${this._lastName} ?disabled=${!this.editing} />
          <input name="email" placeholder="Email" .value=${this.userInfo?.email || ''} disabled />
          <input name="contact" placeholder="Contact" .value=${this.userInfo?.phone || ''} ?disabled=${!this.editing} />
          <textarea class="address" name="address" placeholder="Address" ?disabled=${!this.editing}>${this.userInfo?.address || ''}</textarea>

          ${this.editing ? html`
            <div class="btn-row">
              <app-button type="primary" ?disabled=${this.isLoading}>
                ${this.isLoading ? 'Saving...' : 'Save'}
              </app-button>
            </div>
          ` : ''}
        </form>
      </div>
    `;
  }
}

customElements.define('personal-info-form', PersonalInfoForm);
