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
    .save-btn {
      padding: 8px 24px;
      background: #d6150b;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .save-btn:hover { background: #b51209; }
    .save-btn:disabled { background: #ccc; cursor: not-allowed; }
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

    const form = e.target;
    const data = {
      firstName: form.querySelector('[name="firstName"]')?.value || '',
      lastName: form.querySelector('[name="lastName"]')?.value || '',
      email: form.querySelector('[name="email"]')?.value || '',
      contact: form.querySelector('[name="contact"]')?.value || '',
      address: form.querySelector('[name="address"]')?.value || '',
    };

    this.dispatchEvent(new CustomEvent('personal-info-update', {
      detail: data,
      bubbles: true,
      composed: true
    }));

    this.isLoading = false;
    this.editing = false;
  }

  updated(changedProps) {
    if (changedProps.has('userInfo')) {
      const form = this.shadowRoot?.querySelector('form');
      if (!form) return;
      const fn = form.querySelector('[name="firstName"]');
      const ln = form.querySelector('[name="lastName"]');
      const em = form.querySelector('[name="email"]');
      const ct = form.querySelector('[name="contact"]');
      const ad = form.querySelector('[name="address"]');
      if (fn) fn.value = this._firstName;
      if (ln) ln.value = this._lastName;
      if (em) em.value = this.userInfo?.email || '';
      if (ct) ct.value = this.userInfo?.phone || '';
      if (ad) ad.value = this.userInfo?.address || '';
    }
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
          <textarea class="address" name="address" placeholder="Address" .value=${this.userInfo?.address || ''} ?disabled=${!this.editing}></textarea>

          ${this.editing ? html`
            <div class="btn-row">
              <button type="submit" class="save-btn" ?disabled=${this.isLoading}>
                ${this.isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          ` : ''}
        </form>
      </div>
    `;
  }
}

customElements.define('personal-info-form', PersonalInfoForm);
