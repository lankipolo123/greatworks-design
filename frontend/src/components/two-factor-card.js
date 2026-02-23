import { LitElement, html, css } from 'lit';
import { auth } from '/src/service/api.js';
import { toast } from '/src/service/toast-widget.js';
import '/src/components/app-button.js';

class TwoFactorCard extends LitElement {
  static properties = {
    _enabled: { type: Boolean, state: true },
    _setupStep: { type: String, state: true }, // null | 'qr' | 'verify' | 'backup'
    _secret: { type: String, state: true },
    _otpauthUrl: { type: String, state: true },
    _verifyCode: { type: String, state: true },
    _backupCodes: { type: Array, state: true },
    _disablePassword: { type: String, state: true },
    _loading: { type: Boolean, state: true },
    _error: { type: String, state: true },
    _showDisable: { type: Boolean, state: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .title {
      font-weight: 600;
      font-size: 0.85rem;
      color: #333;
    }

    .status {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 10px;
      font-weight: 600;
    }

    .status.on {
      background: #d4edda;
      color: #155724;
    }

    .status.off {
      background: #f8d7da;
      color: #721c24;
    }

    .description {
      font-size: 0.78rem;
      color: #666;
      margin-bottom: 10px;
      line-height: 1.4;
    }

    .setup-section {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 12px;
      margin-top: 8px;
    }

    .step-title {
      font-weight: 600;
      font-size: 0.8rem;
      margin-bottom: 8px;
      color: #333;
    }

    .secret-key {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 8px;
      font-family: monospace;
      font-size: 0.85rem;
      word-break: break-all;
      text-align: center;
      margin: 8px 0;
      user-select: all;
    }

    .qr-placeholder {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 12px;
      text-align: center;
      margin: 8px 0;
    }

    .qr-placeholder img {
      max-width: 180px;
    }

    .qr-hint {
      font-size: 0.72rem;
      color: #888;
      text-align: center;
      margin-top: 4px;
    }

    .verify-input {
      width: 100%;
      padding: 10px;
      border: 1px solid #d0d0d0;
      border-radius: 6px;
      font-size: 1.2rem;
      font-family: monospace;
      text-align: center;
      letter-spacing: 0.4rem;
      box-sizing: border-box;
      margin: 8px 0;
    }

    .verify-input:focus {
      outline: none;
      border-color: #666;
    }

    .error {
      color: #c00;
      font-size: 0.78rem;
      text-align: center;
      margin: 4px 0;
    }

    .actions {
      display: flex;
      gap: 6px;
      margin-top: 8px;
    }

    .backup-codes {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px;
      margin: 8px 0;
    }

    .backup-code {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 6px;
      font-family: monospace;
      font-size: 0.8rem;
      text-align: center;
    }

    .backup-warning {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 4px;
      padding: 8px;
      font-size: 0.72rem;
      color: #856404;
      margin-top: 8px;
      line-height: 1.4;
    }

    .disable-input {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid #d0d0d0;
      border-radius: 6px;
      font-size: 0.85rem;
      box-sizing: border-box;
      margin: 8px 0;
    }

    .disable-input:focus {
      outline: none;
      border-color: #666;
    }
  `;

  constructor() {
    super();
    this._enabled = false;
    this._setupStep = null;
    this._secret = '';
    this._otpauthUrl = '';
    this._verifyCode = '';
    this._backupCodes = [];
    this._disablePassword = '';
    this._loading = false;
    this._error = '';
    this._showDisable = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._fetchStatus();
  }

  async _fetchStatus() {
    try {
      const data = await auth.get2FAStatus();
      this._enabled = data.two_factor_enabled;
    } catch (e) {
      // silently fail — user might not be authenticated yet
    }
  }

  async _startSetup() {
    this._loading = true;
    this._error = '';

    try {
      const data = await auth.setup2FA();
      this._secret = data.secret;
      this._otpauthUrl = data.otpauth_url;
      this._setupStep = 'qr';
    } catch (e) {
      this._error = e.message || 'Failed to start 2FA setup';
    } finally {
      this._loading = false;
    }
  }

  _proceedToVerify() {
    this._setupStep = 'verify';
    this._verifyCode = '';
    this._error = '';
  }

  async _verifySetup() {
    if (this._verifyCode.length !== 6) {
      this._error = 'Please enter a 6-digit code';
      return;
    }

    this._loading = true;
    this._error = '';

    try {
      const data = await auth.verifySetup2FA(this._verifyCode);
      this._backupCodes = data.backup_codes;
      this._setupStep = 'backup';
      this._enabled = true;
      toast.success('Two-factor authentication enabled');
    } catch (e) {
      this._error = e.message || 'Invalid code. Please try again.';
    } finally {
      this._loading = false;
    }
  }

  _finishSetup() {
    this._setupStep = null;
    this._secret = '';
    this._otpauthUrl = '';
    this._verifyCode = '';
    this._backupCodes = [];
  }

  async _disableTwoFactor() {
    if (!this._disablePassword) {
      this._error = 'Please enter your password';
      return;
    }

    this._loading = true;
    this._error = '';

    try {
      await auth.disable2FA(this._disablePassword);
      this._enabled = false;
      this._showDisable = false;
      this._disablePassword = '';
      toast.success('Two-factor authentication disabled');
    } catch (e) {
      this._error = e.message || 'Incorrect password';
    } finally {
      this._loading = false;
    }
  }

  _cancelSetup() {
    this._setupStep = null;
    this._secret = '';
    this._otpauthUrl = '';
    this._verifyCode = '';
    this._error = '';
  }

  _cancelDisable() {
    this._showDisable = false;
    this._disablePassword = '';
    this._error = '';
  }

  _handleVerifyInput(e) {
    this._verifyCode = e.target.value.replace(/\D/g, '').slice(0, 6);
  }

  _handleVerifyKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this._verifySetup();
    }
  }

  _handleDisableKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this._disableTwoFactor();
    }
  }

  _copySecret() {
    navigator.clipboard.writeText(this._secret).then(() => {
      toast.success('Secret key copied');
    });
  }

  render() {
    return html`
      <div>
        <div class="header">
          <span class="title">Two-Factor Authentication</span>
          <span class="status ${this._enabled ? 'on' : 'off'}">
            ${this._enabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>

        <div class="description">
          Add an extra layer of security using a TOTP authenticator app
          (Google Authenticator, Authy, etc.)
        </div>

        ${this._renderContent()}
      </div>
    `;
  }

  _renderContent() {
    // Setup flow
    if (this._setupStep === 'qr') return this._renderQRStep();
    if (this._setupStep === 'verify') return this._renderVerifyStep();
    if (this._setupStep === 'backup') return this._renderBackupStep();

    // Disable flow
    if (this._showDisable) return this._renderDisableForm();

    // Default: show enable/disable button
    if (this._enabled) {
      return html`
        <app-button type="danger" size="small" @click=${() => { this._showDisable = true; this._error = ''; }}>
          Disable 2FA
        </app-button>
      `;
    }

    return html`
      <app-button type="primary" size="small" .loading=${this._loading} @click=${this._startSetup}>
        Enable 2FA
      </app-button>
    `;
  }

  _renderQRStep() {
    // Use a public QR API to render the otpauth URL
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(this._otpauthUrl)}`;

    return html`
      <div class="setup-section">
        <div class="step-title">Step 1: Scan QR Code</div>
        <div class="description">
          Scan this QR code with your authenticator app, or manually enter the secret key below.
        </div>

        <div class="qr-placeholder">
          <img src="${qrUrl}" alt="2FA QR Code" width="180" height="180" />
        </div>

        <div class="qr-hint">Can't scan? Enter the key manually:</div>
        <div class="secret-key" @click=${this._copySecret}>${this._secret}</div>
        <div class="qr-hint">Click to copy</div>

        <div class="actions">
          <app-button type="secondary" size="small" @click=${this._cancelSetup}>Cancel</app-button>
          <app-button type="primary" size="small" @click=${this._proceedToVerify}>Next</app-button>
        </div>
      </div>
    `;
  }

  _renderVerifyStep() {
    return html`
      <div class="setup-section">
        <div class="step-title">Step 2: Verify Code</div>
        <div class="description">
          Enter the 6-digit code from your authenticator app to confirm setup.
        </div>

        <input
          class="verify-input"
          type="text"
          inputmode="numeric"
          placeholder="000000"
          .value=${this._verifyCode}
          @input=${this._handleVerifyInput}
          @keydown=${this._handleVerifyKeydown}
          ?disabled=${this._loading}
          autofocus
        />

        ${this._error ? html`<div class="error">${this._error}</div>` : ''}

        <div class="actions">
          <app-button type="secondary" size="small" @click=${() => { this._setupStep = 'qr'; this._error = ''; }}>Back</app-button>
          <app-button type="primary" size="small" .loading=${this._loading} @click=${this._verifySetup}>
            Verify & Enable
          </app-button>
        </div>
      </div>
    `;
  }

  _renderBackupStep() {
    return html`
      <div class="setup-section">
        <div class="step-title">Backup Codes</div>
        <div class="description">
          Save these backup codes in a safe place. Each code can only be used once.
        </div>

        <div class="backup-codes">
          ${this._backupCodes.map(code => html`
            <div class="backup-code">${code}</div>
          `)}
        </div>

        <div class="backup-warning">
          These codes will not be shown again. Store them securely.
          If you lose access to your authenticator app, you can use a backup code to sign in.
        </div>

        <div class="actions">
          <app-button type="primary" size="small" @click=${this._finishSetup}>Done</app-button>
        </div>
      </div>
    `;
  }

  _renderDisableForm() {
    return html`
      <div class="setup-section">
        <div class="step-title">Disable Two-Factor Authentication</div>
        <div class="description">
          Enter your password to confirm disabling 2FA.
        </div>

        <input
          class="disable-input"
          type="password"
          placeholder="Enter your password"
          .value=${this._disablePassword}
          @input=${e => (this._disablePassword = e.target.value)}
          @keydown=${this._handleDisableKeydown}
          ?disabled=${this._loading}
        />

        ${this._error ? html`<div class="error">${this._error}</div>` : ''}

        <div class="actions">
          <app-button type="secondary" size="small" @click=${this._cancelDisable}>Cancel</app-button>
          <app-button type="danger" size="small" .loading=${this._loading} @click=${this._disableTwoFactor}>
            Disable 2FA
          </app-button>
        </div>
      </div>
    `;
  }
}

customElements.define('two-factor-card', TwoFactorCard);
