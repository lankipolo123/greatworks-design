import { LitElement, html, css } from 'lit';
import '/src/components/app-button.js';

export class PersonalInfoForm extends LitElement {
  static properties = {
    editing: { type: Boolean },
    isLoading: { type: Boolean }
  };

  constructor() {
    super();
    this.editing = false;
    this.isLoading = false;
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
    form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      padding: 20px;
    }
    .address { grid-column: 1 / -1; }
    input, select, textarea {
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
  `;

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
          <span @click=${this.toggleEdit}>✎</span>
        </div>

        <form @submit=${this.handleSubmit}>
          <input name="firstName" placeholder="First Name" ?disabled=${!this.editing} />
          <input name="lastName" placeholder="Last Name" ?disabled=${!this.editing} />
          <input name="email" placeholder="Email" disabled />
          <input name="contact" placeholder="Contact" ?disabled=${!this.editing} />
          <textarea class="address" name="address" placeholder="Address" ?disabled=${!this.editing}></textarea>

          ${this.editing ? html`
            <app-button type="primary">Save</app-button>
          ` : ''}
        </form>
      </div>
    `;
  }
}

customElements.define('personal-info-form', PersonalInfoForm);
