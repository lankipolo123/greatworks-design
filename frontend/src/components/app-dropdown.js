// src/components/app-dropdown.js
import { LitElement, html, css } from 'lit';

export class AppDropdown extends LitElement {
  static properties = {
    options: { type: Array },        // Array of {value, label} objects
    value: { type: String },         // Currently selected value
    placeholder: { type: String },   // Placeholder text
    disabled: { type: Boolean },     // Disabled state
    size: { type: String },          // 'small' | 'medium' | 'large'
    variant: { type: String },       // 'default' | 'dark' | 'light' | 'primary'
    fullWidth: { type: Boolean },    // Full width option
    label: { type: String }          // Optional label above dropdown
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    :host([full-width]) {
      display: block;
      width: 100%;
    }

    .dropdown-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
    }

    .dropdown-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #010101;
    }

    select {
      font-family: inherit;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      appearance: none;
      background-repeat: no-repeat;
      background-position: right 10px center;
      background-size: 12px;
      padding-right: 32px;
    }


    /* ===== SIZES ===== */
    .small {
      font-size: 0.75rem;
      padding: 0.4rem 0.6rem;
      min-width: 100px;
    }

    .medium {
      font-size: 0.875rem;
      padding: 0.5rem 0.75rem;
      min-width: 120px;
    }

    .large {
      font-size: 1rem;
      padding: 0.625rem 1rem;
      min-width: 150px;
    }

    /* ===== VARIANTS ===== */
    .default {
      background-color: #ff0000;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      border-color: #d0d0d0;
      color: #333;
    }

    .default:hover:not(:disabled) {
      border-color: #999;
      background-color: #f9f9f9;
    }

    .default:focus {
      border-color: #666;
    }

    .dark {
      background-color: #010101fb;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fff' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      color: #ffffff;
    }


    .dark:focus {
      border-color: #ffffff;
    }

    .light {
      background-color: #11d5cb;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      color: #ffffff;
    }

    .primary {
      background-color: #ff0707d7;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fff' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      border-color: #e60606;
      color: #ffffff;
    }

    .primary:hover:not(:disabled) {
      background-color: #e69d0a;
      border-color: #d08c00;
    }

    .primary:focus {
      border-color: #ffae0b;
    }

    /* Full width */
    :host([full-width]) select {
      width: 100%;
    }
  `;

  constructor() {
    super();
    this.options = [];
    this.value = '';
    this.placeholder = 'Select...';
    this.disabled = false;
    this.size = 'medium';
    this.variant = 'default';
    this.fullWidth = false;
    this.label = '';
  }

  updated(changedProperties) {
    if (changedProperties.has('fullWidth')) {
      if (this.fullWidth) {
        this.setAttribute('full-width', '');
      } else {
        this.removeAttribute('full-width');
      }
    }
  }

  handleChange(e) {
    this.value = e.target.value;
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="dropdown-container">
        ${this.label ? html`
          <label class="dropdown-label">${this.label}</label>
        ` : ''}
        
        <select
          class="${this.size} ${this.variant}"
          .value=${this.value}
          ?disabled=${this.disabled}
          @change=${this.handleChange}
        >
          ${this.placeholder && !this.value ? html`
            <option value="" disabled selected>${this.placeholder}</option>
          ` : ''}
          
          ${this.options.map(option => html`
            <option value="${option.value}" ?selected=${option.value === this.value}>
              ${option.label}
            </option>
          `)}
        </select>
      </div>
    `;
  }
}

customElements.define('app-dropdown', AppDropdown);