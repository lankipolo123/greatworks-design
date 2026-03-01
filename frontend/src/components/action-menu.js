// action-menu.js (FIXED - Portal positioning + SVG icons)
import { LitElement, html, css, svg } from 'lit';

const MENU_ICONS = {
  more_vert: svg`<circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>`,
  visibility: svg`<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`,
  edit: svg`<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>`,
  delete: svg`<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>`,
  close: svg`<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`,
  check: svg`<polyline points="20 6 9 17 4 12"/>`,
  block: svg`<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>`,
  send: svg`<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>`,
  download: svg`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>`,
  credit_card: svg`<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>`,
  payment: svg`<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>`,
};

function getIconSvg(name) {
  const paths = MENU_ICONS[name];
  if (!paths) return '';
  return html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" style="flex-shrink:0">${paths}</svg>`;
}

export class ActionMenu extends LitElement {
  static styles = css`

.action-menu {
  position: relative;
  display: inline-block;
}

.menu-trigger {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000d7;
}

.menu-trigger:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.menu-trigger.small { padding: 2px; }
.menu-trigger.small svg { width: 18px; height: 18px; }
.menu-trigger.medium { padding: 4px; }
.menu-trigger.medium svg { width: 20px; height: 20px; }
.menu-trigger.large { padding: 6px; }
.menu-trigger.large svg { width: 24px; height: 24px; }

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
  gap: 6px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  flex-shrink: 0;
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

  // Position menu when opened
  updated(changedProperties) {
    if (changedProperties.has('isOpen') && this.isOpen) {
      requestAnimationFrame(() => this.positionMenu());
    }
  }

  // Calculate fixed position relative to button
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
          ${getIconSvg(this.triggerIcon) || getIconSvg('more_vert')}
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
              ${item.icon ? html`<span class="menu-item-icon">${getIconSvg(item.icon)}</span>` : ''}
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
