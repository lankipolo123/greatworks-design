// src/components/reusable-dialog.js
import { LitElement, html, css } from 'lit';

export class ReusableDialog extends LitElement {
  static properties = {
    isOpen: { type: Boolean },
    title: { type: String },
    description: { type: String },
    cancelText: { type: String },
    confirmText: { type: String },
    confirmColor: { type: String },
    size: { type: String },
    closeOnOverlay: { type: Boolean }
  };

  static styles = css`
    :host {
      display: none;
    }

    :host([open]) {
      display: block;
    }

    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .dialog-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .dialog-container.small { width: 400px; }
    .dialog-container.medium { width: 500px; }
    .dialog-container.large { width: 700px; }

    .dialog-header {
      padding: 20px 24px 16px;
      border-bottom: 1px solid #2d2b2b45;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .dialog-title-section {
      flex: 1;
    }

    .dialog-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #ff0707d7;
      margin: 0;
    }

    .dialog-title .highlight {
      color: #ff0000;
    }

    .dialog-description {
      font-size: 0.95rem;
      color: #666;
      margin: 0;
      font-weight: 500;
    }

    .close-button {
      display: none;
    }

    .dialog-body {
      padding: 24px;
      overflow-y: auto;
      flex: 1;
    }

    .dialog-footer {
      padding: 16px 24px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .dialog-button {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .cancel-button {
      background: white;
      color: #333;
      border: 1px solid #2d2b2b45;
    }

    .cancel-button:hover {
      background: #f5f5f5;
    }

    .confirm-button {
      background: var(--confirm-color, #8b2e2e);
      color: white;
    }

    .confirm-button:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .confirm-button.primary {
      background: #007bff;
    }

    .confirm-button.danger {
      background: #dc3545;
    }

    .confirm-button.success {
      background: #28a745;
    }

    .confirm-button.warning {
      background: #ffc107;
      color: #333;
    }
  `;

  constructor() {
    super();
    this.isOpen = false;
    this.title = '';
    this.description = '';
    this.cancelText = 'Cancel';
    this.confirmText = 'Confirm';
    this.confirmColor = 'danger';
    this.size = 'medium';
    this.closeOnOverlay = true;
  }

  updated(changedProperties) {
    if (changedProperties.has('isOpen')) {
      if (this.isOpen) {
        this.setAttribute('open', '');
        document.body.style.overflow = 'hidden';
      } else {
        this.removeAttribute('open');
        document.body.style.overflow = '';
      }
    }
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('dialog-close', {
      bubbles: true,
      composed: true
    }));
  }

  handleOverlayClick(e) {
    if (e.target === e.currentTarget && this.closeOnOverlay) {
      this.close();
    }
  }

  handleCancel() {
    this.dispatchEvent(new CustomEvent('dialog-cancel', {
      bubbles: true,
      composed: true
    }));
    this.close();
  }

  handleConfirm() {
    this.dispatchEvent(new CustomEvent('dialog-confirm', {
      bubbles: true,
      composed: true
    }));
    this.close();
  }

  render() {
    if (!this.isOpen) return html``;

    return html`
      <div class="dialog-overlay" @click="${this.handleOverlayClick}">
        <div class="dialog-container ${this.size}">
          <div class="dialog-header">
            <div class="dialog-title-section">
              <h2 class="dialog-title">
                ${this.title.split(' ').map((word, index) =>
      index === this.title.split(' ').length - 1
        ? html`<span class="highlight">${word}</span>`
        : html`${word} `
    )}
              </h2>
            </div>
          </div>

          <div class="dialog-body">
            ${this.description ? html`
              <p class="dialog-description">${this.description}</p>
            ` : ''}
            <slot></slot>
          </div>

          <div class="dialog-footer">
            <button class="dialog-button cancel-button" @click="${this.handleCancel}">
              ${this.cancelText}
            </button>
            <button 
              class="dialog-button confirm-button ${this.confirmColor}" 
              @click="${this.handleConfirm}"
            >
              ${this.confirmText}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('reusable-dialog', ReusableDialog);