// toast-component.js
import { LitElement, html, css } from 'lit';

export class ToastComponent extends LitElement {
  static properties = {
    toasts: { type: Array },
    position: { type: String }, // 'top-right', 'top-center', 'bottom-center', etc.
  };

  static styles = css`
    :host {
      position: fixed;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
      width: auto;
      max-width: 320px;
    }
    :host([position="top-right"]) { top: 16px; right: 16px; align-items: flex-end; }
    :host([position="top-center"]) { top: 16px; left: 50%; transform: translateX(-50%); align-items: center; }
    :host([position="bottom-center"]) { bottom: 16px; left: 50%; transform: translateX(-50%); align-items: center; }

    .toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 8px;
      background: #ffffff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border: 1px solid #e0e0e0;
      pointer-events: auto;
      opacity: 1;
      transition: transform 0.3s ease, opacity 0.3s ease;
      min-width: 280px;
    }

    .toast.removing { 
      opacity: 0; 
      transform: translateY(-20px); 
    }

    .toast-icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toast-icon svg {
      width: 20px;
      height: 20px;
    }

    .toast.success .toast-icon { color: #28a745; }
    .toast.error .toast-icon { color: #dc3545; }
    .toast.warning .toast-icon { color: #ffc107; }
    .toast.info .toast-icon { color: #17a2b8; }

    .toast-message { 
      flex: 1;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .toast.success .toast-message { color: #28a745; }
    .toast.error .toast-message { color: #dc3545; }
    .toast.warning .toast-message { color: #d39e00; }
    .toast.info .toast-message { color: #17a2b8; }

    .toast-close {
      background: none;
      border: none;
      color: #ff0000;
      font-size: 1.25rem;
      cursor: pointer;
      line-height: 1;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .toast-close:hover {
      background: #f0f0f0;
      color: #b00202;
    }
  `;

  constructor() {
    super();
    this.toasts = [];
    this.position = 'top-center';
    this.toastId = 0;
  }

  getIcon(type) {
    const icons = {
      success: html`
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            `,
      error: html`
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            `,
      warning: html`
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
            `,
      info: html`
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            `
    };
    return icons[type] || icons.info;
  }

  show(message, type = 'info', duration = 4000) {
    const id = ++this.toastId;
    const toast = { id, message, type, duration, removing: false };
    this.toasts = [...this.toasts, toast];

    // Auto remove
    setTimeout(() => this.remove(id), duration);
    return id;
  }

  // Convenience methods for different toast types
  success(message, duration = 4000) {
    return this.show(message, 'success', duration);
  }

  error(message, duration = 5000) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration = 4000) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration = 4000) {
    return this.show(message, 'info', duration);
  }

  remove(id) {
    const index = this.toasts.findIndex(t => t.id === id);
    if (index === -1) return;

    this.toasts[index].removing = true;
    this.requestUpdate();

    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
    }, 300);
  }

  removeAll() {
    this.toasts.forEach(t => t.removing = true);
    this.requestUpdate();
    setTimeout(() => this.toasts = [], 300);
  }

  render() {
    return html`
      ${this.toasts.map(t => html`
        <div class="toast ${t.type} ${t.removing ? 'removing' : ''}">
          <span class="toast-icon">${this.getIcon(t.type)}</span>
          <span class="toast-message">${t.message}</span>
          <button class="toast-close" @click="${() => this.remove(t.id)}">×</button>
        </div>
      `)}
    `;
  }
}

customElements.define('toast-component', ToastComponent);