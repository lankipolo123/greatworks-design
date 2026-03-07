import { LitElement, html, css } from 'lit';
import { systemSettings } from '/src/service/api.js';
import { toast } from '/src/service/toast-widget.js';

class SystemSettingsCard extends LitElement {
  static properties = {
    _settings: { type: Object, state: true },
    _loading: { type: Boolean, state: true },
  };

  constructor() {
    super();
    this._settings = {};
    this._loading = true;
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadSettings();
  }

  static styles = css`
    :host {
      display: block;
    }

    .card {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 10px;
      padding: 20px;
    }

    .card-title {
      font-size: 1rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 6px 0;
    }

    .card-desc {
      font-size: 0.78rem;
      color: #888;
      margin: 0 0 16px 0;
    }

    .setting-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .setting-row:last-child {
      border-bottom: none;
    }

    .setting-info {
      flex: 1;
    }

    .setting-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #333;
    }

    .setting-hint {
      font-size: 0.72rem;
      color: #999;
      margin-top: 2px;
    }

    /* Toggle switch */
    .toggle {
      position: relative;
      width: 44px;
      height: 24px;
      flex-shrink: 0;
      margin-left: 12px;
    }

    .toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: 0.25s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.25s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #16a34a;
    }

    input:checked + .slider:before {
      transform: translateX(20px);
    }

    input:disabled + .slider {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .loading-text {
      font-size: 0.8rem;
      color: #999;
      padding: 12px 0;
    }
  `;

  async _loadSettings() {
    this._loading = true;
    try {
      this._settings = await systemSettings.getAll();
    } catch {
      this._settings = {};
    }
    this._loading = false;
  }

  async _toggleSetting(key) {
    const current = this._settings[key];
    const newVal = current === '1' ? '0' : '1';

    try {
      await systemSettings.update(key, newVal);
      this._settings = { ...this._settings, [key]: newVal };
      toast.success(`${key === 'room_availability_check' ? 'Room availability check' : key} ${newVal === '1' ? 'enabled' : 'disabled'}`);
    } catch (err) {
      toast.error(err.message || 'Failed to update setting');
    }
  }

  render() {
    if (this._loading) {
      return html`
        <div class="card">
          <h3 class="card-title">System Settings</h3>
          <p class="loading-text">Loading settings...</p>
        </div>
      `;
    }

    return html`
      <div class="card">
        <h3 class="card-title">System Settings</h3>
        <p class="card-desc">Manage system-wide feature toggles. These apply to all users.</p>

        <div class="setting-row">
          <div class="setting-info">
            <div class="setting-label">Room Availability Check</div>
            <div class="setting-hint">Show available slots in room dropdown when booking. Users can see which rooms are available without selecting each one.</div>
          </div>
          <label class="toggle">
            <input
              type="checkbox"
              .checked=${this._settings['room_availability_check'] === '1'}
              @change=${() => this._toggleSetting('room_availability_check')}
            />
            <span class="slider"></span>
          </label>
        </div>
      </div>
    `;
  }
}

customElements.define('system-settings-card', SystemSettingsCard);
