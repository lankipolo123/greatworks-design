// src/components/input-field.js
import { LitElement, html, css } from 'lit';

class InputField extends LitElement {
  static properties = {
    label: { type: String },
    type: { type: String },
    name: { type: String },
    placeholder: { type: String },
    required: { type: Boolean },
    disabled: { type: Boolean },
    value: { type: String },
    error: { type: String },
    variant: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      margin-bottom: 1.5rem;
    }

    :host([variant="compact"]) {
      margin-bottom: 0;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-size: 0.9rem;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1.25px solid #2d2b2b45;
      border-radius: 8px;
      font-size: 0.95rem;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }

    input:focus {
      outline: none;
      border-color: #ff0707d7;
    }

    input:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }

    input.error {
      border-color: #c00;
    }

    .error-message {
      color: #c00;
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }
  `;

  constructor() {
    super();
    this.type = 'text';
    this.required = false;
    this.disabled = false;
    this.value = '';
    this.error = '';
    this.variant = 'default'; // default, compact
  }

  updated(changedProperties) {
    if (changedProperties.has('variant')) {
      this.setAttribute('variant', this.variant);
    }
  }

  handleInput(e) {
    this.value = e.target.value;
    this.dispatchEvent(new CustomEvent('input-change', {
      detail: { name: this.name, value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="form-group">
        ${this.label ? html`<label for="${this.name}">${this.label}</label>` : ''}
        <input
          type="${this.type}"
          id="${this.name}"
          name="${this.name}"
          placeholder="${this.placeholder || ''}"
          .value="${this.value}"
          ?required="${this.required}"
          ?disabled="${this.disabled}"
          class="${this.error ? 'error' : ''}"
          @input="${this.handleInput}"
        >
        ${this.error ? html`<span class="error-message">${this.error}</span>` : ''}
      </div>
    `;
  }
}

customElements.define('input-field', InputField);