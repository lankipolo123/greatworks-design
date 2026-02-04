// src/components/floating-action-button.js
import { LitElement, html, css } from 'lit';

class FloatingActionButton extends LitElement {
    static properties = {
        options: { type: Array },
        expanded: { type: Boolean }
    };

    static styles = css`
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      z-index: 9997;
    }

    .overlay.visible {
      opacity: 1;
      pointer-events: all;
    }

    .close-btn {
      position: fixed;
      top: 2rem;
      right: 2rem;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: white;
      color: #ff0404;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 300;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      z-index: 10001;
    }

    .close-btn.visible {
      opacity: 1;
      pointer-events: all;
    }

    .close-btn:hover {
      background: #f3f4f6;
      color: #c40505;
    }

    .fab-options {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      z-index: 10000;
    }

    .fab-options.visible {
      opacity: 1;
      pointer-events: all;
    }

    .fab-option {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: white;
      border: none;
      border-radius: 12px;
      padding: 1.25rem 2rem;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      white-space: nowrap;
      min-width: 250px;
    }

    .fab-option:hover {
      background: #0380fd;
    }

    .fab-option:hover .fab-option-icon,
    .fab-option:hover .fab-option-label {
      color: white;
    }

    .fab-option-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #424242;
    }

    .fab-option-label {
      font-size: 16px;
      font-weight: 500;
      color: #424242;
    }

    .fab-main {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: rgb(4, 4, 4);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 300;
      z-index: 10002;
    }

    .fab-main:hover {
      background: rgb(5, 5, 5);
    }

    .fab-main.expanded {
      transform: rotate(45deg);
      background: rgb(212, 36, 6);
    }

    @media (max-width: 768px) {
      .fab-main {
        bottom: 1.5rem;
        right: 1.5rem;
        width: 48px;
        height: 48px;
        font-size: 24px;
      }

      .close-btn {
        top: 1.5rem;
        right: 1.5rem;
        width: 48px;
        height: 48px;
        font-size: 28px;
      }

      .fab-option {
        min-width: 200px;
        padding: 1rem 1.5rem;
      }

      .fab-option-label {
        font-size: 14px;
      }
    }
  `;

    constructor() {
        super();
        this.options = [];
        this.expanded = false;
    }

    toggleExpanded() {
        this.expanded = !this.expanded;
    }

    closeMenu() {
        this.expanded = false;
    }

    handleOptionClick(option) {
        this.dispatchEvent(new CustomEvent('fab-option-click', {
            detail: { action: option.action, label: option.label },
            bubbles: true,
            composed: true
        }));
        this.closeMenu();
    }

    render() {
        return html`
      <div class="overlay ${this.expanded ? 'visible' : ''}"></div>
      
      <button 
        class="close-btn ${this.expanded ? 'visible' : ''}" 
        @click=${this.closeMenu}>
        ×
      </button>

      <div class="fab-options ${this.expanded ? 'visible' : ''}">
        ${this.options.map(option => html`
          <button 
            class="fab-option" 
            @click=${() => this.handleOptionClick(option)}>
            <div class="fab-option-icon">${option.icon}</div>
            <span class="fab-option-label">${option.label}</span>
          </button>
        `)}
      </div>

      <button 
        class="fab-main ${this.expanded ? 'expanded' : ''}" 
        @click=${this.toggleExpanded}>
        +
      </button>
    `;
    }
}

customElements.define('floating-action-button', FloatingActionButton);