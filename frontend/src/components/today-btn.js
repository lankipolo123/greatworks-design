// src/components/today-button.js
import { LitElement, html, css } from 'lit';

class TodayButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }

    .today-btn {
      background: white;
      color: #000000a4;
      border: none;
      border-radius: 6px;
      padding: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
    }

    .today-btn:hover {
      color: #000000;
      transform: translateY(-1px);
    }

    .today-btn svg {
      width: 18px;
      height: 18px;
    }
  `;

  _handleClick() {
    this.dispatchEvent(new CustomEvent('today-click', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <button 
        class="today-btn" 
        @click=${this._handleClick}
        title="Go to today">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
          <circle cx="12" cy="16" r="2" fill="currentColor"></circle>
        </svg>
      </button>
    `;
  }
}

customElements.define('today-button', TodayButton);