// action-menu.js (FIXED - Portal positioning)
import { LitElement, html, css } from 'lit';

export class ActionMenu extends LitElement {
  static styles = css`
    
.action-menu {
  position: relative;
  display: inline-block;
}

.menu-trigger {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff0707d7;
}

.menu-trigger:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.menu-trigger.small { font-size: 18px; padding: 2px; }
.menu-trigger.medium { font-size: 20px; padding: 4px; }
.menu-trigger.large { font-size: 24px; padding: 6px; }

.menu-trigger.dots { transform: rotate(90deg); }

.menu-dropdown {
  position: fixed;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,.1);
  z-index: 9999;
  min-width: 180px;

  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: all .15s ease-out;
}

.menu-dropdown.open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 13px;
  color: #374151;
  white-space: nowrap;
}

.menu-item:hover:not(:disabled) {
  background: #f3f4f6;
  color: #111827;
}

.menu-item:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.menu-item-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 16px;
  width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Types */
.menu-item.danger:hover { background:#fef2f2; color:#dc2626; }
.menu-item.success:hover { background:#f0fdf4; color:#16a34a; }
.menu-item.warning:hover { background:#fffbeb; color:#d97706; }
.menu-item.info:hover { background:#eff6ff; color:#2563eb; }
.menu-item.primary:hover { background:#eff6ff; color:#2563eb; }

`;



  static properties = {
    items: { type: Array },
    itemId: { type: String },
    isOpen: { type: Boolean },
    triggerIcon: { type: String },
    position: { type: String },
    size: { type: String },
    disabled: { type: Boolean }
  };

  constructor() {
    super();
    this.items = [];
    this.itemId = '';
    this.isOpen = false;
    this.triggerIcon = 'more_vert';
    this.position = 'right';
    this.size = 'medium';
    this.disabled = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._boundCloseMenu = this._closeMenu.bind(this);
    document.addEventListener('click', this._boundCloseMenu);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._boundCloseMenu);
  }

  // ✅ Position menu when opened
  updated(changedProperties) {
    if (changedProperties.has('isOpen') && this.isOpen) {
      requestAnimationFrame(() => this.positionMenu());
    }
  }

  // ✅ Calculate fixed position relative to button
  positionMenu() {
    const button = this.shadowRoot.querySelector('.menu-trigger');
    const dropdown = this.shadowRoot.querySelector('.menu-dropdown');

    if (!button || !dropdown) return;

    const rect = button.getBoundingClientRect();

    // Default: Position below button, aligned to right
    dropdown.style.top = `${rect.bottom + 4}px`;
    dropdown.style.left = `${rect.right - dropdown.offsetWidth}px`;

    // Check bounds after positioning
    requestAnimationFrame(() => {
      const dropdownRect = dropdown.getBoundingClientRect();

      // If goes off bottom, show above button
      if (dropdownRect.bottom > window.innerHeight - 10) {
        dropdown.style.top = `${rect.top - dropdown.offsetHeight - 4}px`;
      }

      // If goes off left, align to left of button
      if (dropdownRect.left < 10) {
        dropdown.style.left = `${rect.left}px`;
      }

      // If goes off right, align to right edge
      if (dropdownRect.right > window.innerWidth - 10) {
        dropdown.style.left = `${window.innerWidth - dropdown.offsetWidth - 10}px`;
      }
    });
  }

  _closeMenu(event) {
    if (!this.contains(event.target)) this.isOpen = false;
  }

  _toggleMenu(event) {
    event.stopPropagation();
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
  }

  _handleItemClick(item, event) {
    event.stopPropagation();
    if (item.disabled) return;
    this.isOpen = false;

    this.dispatchEvent(new CustomEvent('menu-action', {
      detail: { action: item.action || item.key, item, itemId: this.itemId },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="action-menu">
        <button 
          class="menu-trigger ${this.size} ${this.triggerIcon === 'more_vert' ? 'dots' : ''}"
          @click=${this._toggleMenu}
          ?disabled=${this.disabled}
          title="Actions"
        >
          ${this.triggerIcon}
        </button>

        <div class="menu-dropdown ${this.position} ${this.isOpen ? 'open' : ''}">
          ${this.items.map(item => html`
            <button
              class="menu-item ${item.type || ''}"
              @click=${(e) => this._handleItemClick(item, e)}
              ?disabled=${item.disabled}
              title=${item.tooltip || ''}
              style="position: relative;"
            >
              ${item.icon ? html`<span class="menu-item-icon">${item.icon}</span>` : ''}
              ${item.label}
              ${item.badge ? html`<span style="position:absolute;top:8px;right:8px;min-width:16px;height:16px;padding:0 4px;background:#ff4444;color:white;border-radius:50%;font-size:10px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;">${item.badge}</span>` : ''}
            </button>
          `)}
        </div>
      </div>
    `;
  }
}

customElements.define('action-menu', ActionMenu);