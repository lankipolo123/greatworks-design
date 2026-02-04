// src/components/tool-tips.js
import { LitElement, html, css } from 'lit';

class GlobalTooltip extends LitElement {
  static properties = {
    text: { type: String },
    visible: { type: Boolean },
    x: { type: Number },
    y: { type: Number }
  };

  static styles = css`
    :host {
      position: fixed;
      left: 0;
      top: 0;
      pointer-events: none;
      z-index: 9999;
    }

    .tooltip {
      position: absolute;
      background: #0e0d0d;
      color: white;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.2s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transform: translate(0, -50%);
    }

    .tooltip::before {
      content: '';
      position: absolute;
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      border: 6px solid transparent;
      border-right-color: #2d2b2b;
    }

    .tooltip.visible {
      opacity: 1;
    }
  `;

  constructor() {
    super();
    this.text = '';
    this.visible = false;
    this.x = 0;
    this.y = 0;
  }

  render() {
    return html`
      <div 
        class="tooltip ${this.visible ? 'visible' : ''}"
        style="left: ${this.x}px; top: ${this.y}px;">
        ${this.text}
      </div>
    `;
  }
}

customElements.define('global-tooltip', GlobalTooltip);

// Singleton tooltip manager
export class TooltipManager {
  static instance = null;

  static getInstance() {
    if (!TooltipManager.instance) {
      TooltipManager.instance = document.createElement('global-tooltip');
      document.body.appendChild(TooltipManager.instance);
    }
    return TooltipManager.instance;
  }

  static show(text, element) {
    const tooltip = TooltipManager.getInstance();
    const rect = element.getBoundingClientRect();

    tooltip.text = text;
    tooltip.x = rect.right + 10;
    tooltip.y = rect.top + (rect.height / 2);
    tooltip.visible = true;
  }

  static hide() {
    const tooltip = TooltipManager.getInstance();
    tooltip.visible = false;
  }
}