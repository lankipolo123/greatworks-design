import { LitElement, html, css } from 'lit';
import '/src/components/users-avatar.js';
import '/src/components/app-dialog.js';
import '/src/components/app-button.js';
import { auth } from '/src/service/api.js';
import { toast } from '/src/service/toast-widget.js';

export class ProfileHeader extends LitElement {
  static properties = {
    displayName: { type: String },
    role: { type: String },
    email: { type: String },
    status: { type: String },
    joinedDate: { type: String },
    lastLoginDate: { type: String },
    photoURL: { type: String },
    gender: { type: String },
    isUploading: { type: Boolean },
    showUploadDialog: { type: Boolean },
    show2FADialog: { type: Boolean },
    twoFactorEnabled: { type: Boolean },
    // 2FA setup state
    _2faStep: { type: String, state: true },       // null | 'qr' | 'verify' | 'backup' | 'disable'
    _2faSecret: { type: String, state: true },
    _2faQrDataUrl: { type: String, state: true },
    _2faCode: { type: String, state: true },
    _2faBackupCodes: { type: Array, state: true },
    _2faPassword: { type: String, state: true },
    _2faLoading: { type: Boolean, state: true },
    _2faError: { type: String, state: true },
  };

  static styles = css`
  :host {
      display: block;
      width: 100%;
      font-family: Arial, sans-serif;
    }

    .profile-card {
      display: flex;
      position: relative;
      background: #fff;
      border-radius: 12px;
      border: 1.2px solid #2d2b2b45;
      min-height: 100px;
      overflow: hidden;
    }

    .left-bar {
      width: 32px;
      background-color:#d6150b;
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;
      align-self: stretch;
      flex-shrink: 0;
    }

    .content {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
      padding: 16px;
    }

    .avatar-container {
      position: relative;
      width: 80px;
      height: 80px;
      flex-shrink: 0;
    }

    user-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }

    .camera-icon {
      position: absolute;
      bottom: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 2px solid #000;
      font-family: 'Material Symbols Outlined';
      font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      color: black;
      font-size: 18px;
      transition: all 0.2s ease;
    }

    .camera-icon:hover {
      background: #ff3b30;
      color: white;
      transform: scale(1.1);
    }

    .camera-icon.uploading {
      background: rgba(0, 123, 255, 0.8);
      color: white;
      pointer-events: none;
    }

    .info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .name {
      font-weight: bold;
      font-size: 1.2rem;
    }

    .role,
    .joined-date {
      font-size: 0.9rem;
      color: gray;
    }

    .status {
      font-size: 0.75rem;
      color: #28a745;
    }

    .badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background-color: #2fa600;
      color: white;
      font-size: 0.75rem;
      padding: 2px 6px;
      border-radius: 4px;
      z-index: 1;
    }

    .twofa-section {
      position: absolute;
      top: 38px;
      right: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      z-index: 1;
    }

    .twofa-label {
      font-size: 0.7rem;
      font-weight: 600;
      color: #555;
      letter-spacing: 0.04em;
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 32px;
      height: 18px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      inset: 0;
      background-color: #ccc;
      border-radius: 18px;
      transition: background-color 0.2s ease;
    }

    .slider::before {
      content: '';
      position: absolute;
      width: 12px;
      height: 12px;
      left: 3px;
      top: 3px;
      background-color: white;
      border-radius: 50%;
      transition: transform 0.2s ease;
    }

    .switch input:checked + .slider {
      background-color: #d6150b;
    }

    .switch input:checked + .slider::before {
      transform: translateX(14px);
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      z-index: 10;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #ff3b30;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* 2FA Dialog Content Styles */
    .twofa-content {
      text-align: center;
    }

    .twofa-step-title {
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 6px;
      color: #333;
    }

    .twofa-desc {
      font-size: 0.8rem;
      color: #666;
      margin-bottom: 12px;
      line-height: 1.4;
    }

    .qr-box {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 12px;
      display: inline-block;
      margin-bottom: 10px;
    }

    .qr-box img {
      display: block;
      max-width: 180px;
    }

    .secret-key-box {
      background: #f8f9fa;
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 10px;
      font-family: monospace;
      font-size: 0.9rem;
      word-break: break-all;
      cursor: pointer;
      margin: 8px 0;
      user-select: all;
    }

    .secret-key-box:hover {
      background: #e9ecef;
    }

    .copy-hint {
      font-size: 0.7rem;
      color: #999;
      margin-bottom: 12px;
    }

    .totp-input {
      width: 100%;
      padding: 12px;
      border: 1px solid #d0d0d0;
      border-radius: 6px;
      font-size: 1.4rem;
      font-family: monospace;
      text-align: center;
      letter-spacing: 0.5rem;
      box-sizing: border-box;
      margin: 10px 0;
    }

    .totp-input:focus {
      outline: none;
      border-color: #d6150b;
    }

    .disable-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d0d0d0;
      border-radius: 6px;
      font-size: 0.9rem;
      box-sizing: border-box;
      margin: 10px 0;
    }

    .disable-input:focus {
      outline: none;
      border-color: #666;
    }

    .twofa-error {
      color: #c00;
      font-size: 0.8rem;
      margin: 6px 0;
    }

    .twofa-actions {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin-top: 12px;
    }

    .backup-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      margin: 10px 0;
    }

    .backup-code-item {
      background: #f8f9fa;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 8px;
      font-family: monospace;
      font-size: 0.85rem;
      text-align: center;
    }

    .backup-warning {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 6px;
      padding: 10px;
      font-size: 0.75rem;
      color: #856404;
      margin-top: 10px;
      line-height: 1.4;
    }

    .twofa-overlay {
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
      animation: twofaFadeIn 0.2s ease-out;
    }

    @keyframes twofaFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .twofa-dialog {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
      width: 500px;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: twofaSlideUp 0.3s ease-out;
    }

    @keyframes twofaSlideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .twofa-dialog-header {
      padding: 16px 20px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .twofa-dialog-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
    }

    .twofa-close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #f90505;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    }

    .twofa-close-btn:hover {
      background: #f5f5f5;
      color: #d30101;
    }

    .twofa-dialog-body {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }

  `;

  constructor() {
    super();
    this.displayName = '';
    this.role = '';
    this.email = '';
    this.status = '';
    this.joinedDate = '';
    this.lastLoginDate = '';
    this.photoURL = '';
    this.gender = '';
    this.isUploading = false;
    this.showUploadDialog = false;
    this.show2FADialog = false;
    this.twoFactorEnabled = false;
    this._2faStep = null;
    this._2faSecret = '';
    this._2faQrDataUrl = '';
    this._2faCode = '';
    this._2faBackupCodes = [];
    this._2faPassword = '';
    this._2faLoading = false;
    this._2faError = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this._fetch2FAStatus();
  }

  async _fetch2FAStatus() {
    try {
      const data = await auth.get2FAStatus();
      this.twoFactorEnabled = data.two_factor_enabled;
    } catch (e) {
      // user may not be authenticated yet
    }
  }

  formatDate(dateString) {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  changeAvatar() {
    this.showUploadDialog = true;
  }

  handleFileUpload(e) {
    const file = e.detail.file;

    this.dispatchEvent(new CustomEvent('profile-photo-upload', {
      detail: { file },
      bubbles: true,
      composed: true
    }));

    this.showUploadDialog = false;
  }

  handleDialogClose() {
    this.showUploadDialog = false;
  }

  handle2FAToggle(e) {
    e.preventDefault();
    this._2faError = '';
    this._2faCode = '';
    this._2faPassword = '';

    if (this.twoFactorEnabled) {
      // Disable flow — ask for password
      this._2faStep = 'disable';
    } else {
      // Enable flow — start setup
      this._2faStep = 'loading';
      this._startSetup();
    }
    this.show2FADialog = true;
  }

  async _startSetup() {
    this._2faLoading = true;
    this._2faError = '';
    try {
      const data = await auth.setup2FA();
      this._2faSecret = data.secret;
      this._2faQrDataUrl = data.qr_code_data_url;
      this._2faStep = 'qr';
    } catch (e) {
      this._2faError = e.message || 'Failed to start 2FA setup';
      this._2faStep = 'qr';
    } finally {
      this._2faLoading = false;
    }
  }

  _goToVerify() {
    this._2faStep = 'verify';
    this._2faCode = '';
    this._2faError = '';
  }

  async _verifyCode() {
    if (this._2faCode.length !== 6) {
      this._2faError = 'Please enter a 6-digit code';
      return;
    }
    this._2faLoading = true;
    this._2faError = '';
    try {
      const data = await auth.verifySetup2FA(this._2faCode);
      this._2faBackupCodes = data.backup_codes;
      this._2faStep = 'backup';
      this.twoFactorEnabled = true;
      toast.success('Two-factor authentication enabled!');
    } catch (e) {
      this._2faError = e.message || 'Invalid code. Try again.';
    } finally {
      this._2faLoading = false;
    }
  }

  async _disableTwoFactor() {
    if (!this._2faPassword) {
      this._2faError = 'Please enter your password';
      return;
    }
    this._2faLoading = true;
    this._2faError = '';
    try {
      await auth.disable2FA(this._2faPassword);
      this.twoFactorEnabled = false;
      this._close2FADialog();
      toast.success('Two-factor authentication disabled');
    } catch (e) {
      this._2faError = e.message || 'Incorrect password';
    } finally {
      this._2faLoading = false;
    }
  }

  _copySecret() {
    navigator.clipboard.writeText(this._2faSecret).then(() => {
      toast.success('Secret key copied!');
    });
  }

  _handleCodeInput(e) {
    this._2faCode = e.target.value.replace(/\D/g, '').slice(0, 6);
  }

  _handleCodeKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this._verifyCode();
    }
  }

  _handleDisableKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this._disableTwoFactor();
    }
  }

  _close2FADialog() {
    this.show2FADialog = false;
    this._2faStep = null;
    this._2faSecret = '';
    this._2faQrDataUrl = '';
    this._2faCode = '';
    this._2faBackupCodes = [];
    this._2faPassword = '';
    this._2faError = '';
    this._2faLoading = false;
  }

  handle2FADialogClose() {
    // Don't close during backup step (user must click Done)
    if (this._2faStep === 'backup') return;
    this._close2FADialog();
  }

  _render2FAContent() {
    if (this._2faStep === 'loading' || (this._2faStep === 'qr' && this._2faLoading)) {
      return html`<div class="twofa-content"><div class="twofa-desc">Setting up...</div></div>`;
    }

    if (this._2faStep === 'qr') {
      return html`
        <div class="twofa-content">
          <div class="twofa-step-title">Step 1: Scan QR Code</div>
          <div class="twofa-desc">Scan this with your authenticator app (Google Authenticator, Authy, etc.)</div>
          <div class="qr-box">
            <img src="${this._2faQrDataUrl}" alt="2FA QR Code" width="180" height="180" />
          </div>
          <div class="twofa-desc">Can't scan? Enter this key manually:</div>
          <div class="secret-key-box" @click=${this._copySecret}>${this._2faSecret}</div>
          <div class="copy-hint">Click to copy</div>
          ${this._2faError ? html`<div class="twofa-error">${this._2faError}</div>` : ''}
          <div class="twofa-actions">
            <app-button type="secondary" size="small" @click=${this._close2FADialog}>Cancel</app-button>
            <app-button type="primary" size="small" @click=${this._goToVerify}>Next</app-button>
          </div>
        </div>
      `;
    }

    if (this._2faStep === 'verify') {
      return html`
        <div class="twofa-content">
          <div class="twofa-step-title">Step 2: Enter Verification Code</div>
          <div class="twofa-desc">Enter the 6-digit code from your authenticator app</div>
          <input
            class="totp-input"
            type="text"
            inputmode="numeric"
            placeholder="000000"
            .value=${this._2faCode}
            @input=${this._handleCodeInput}
            @keydown=${this._handleCodeKeydown}
            ?disabled=${this._2faLoading}
            autofocus
          />
          ${this._2faError ? html`<div class="twofa-error">${this._2faError}</div>` : ''}
          <div class="twofa-actions">
            <app-button type="secondary" size="small" @click=${() => { this._2faStep = 'qr'; this._2faError = ''; }}>Back</app-button>
            <app-button type="primary" size="small" .loading=${this._2faLoading} @click=${this._verifyCode}>Verify & Enable</app-button>
          </div>
        </div>
      `;
    }

    if (this._2faStep === 'backup') {
      return html`
        <div class="twofa-content">
          <div class="twofa-step-title">Save Your Backup Codes</div>
          <div class="twofa-desc">Store these codes somewhere safe. Each can only be used once.</div>
          <div class="backup-grid">
            ${this._2faBackupCodes.map(code => html`<div class="backup-code-item">${code}</div>`)}
          </div>
          <div class="backup-warning">
            These codes will NOT be shown again. If you lose your authenticator app, use a backup code to sign in.
          </div>
          <div class="twofa-actions">
            <app-button type="primary" size="small" @click=${this._close2FADialog}>Done</app-button>
          </div>
        </div>
      `;
    }

    if (this._2faStep === 'disable') {
      return html`
        <div class="twofa-content">
          <div class="twofa-step-title">Disable Two-Factor Authentication</div>
          <div class="twofa-desc">Enter your password to confirm</div>
          <input
            class="disable-input"
            type="password"
            placeholder="Enter your password"
            .value=${this._2faPassword}
            @input=${e => (this._2faPassword = e.target.value)}
            @keydown=${this._handleDisableKeydown}
            ?disabled=${this._2faLoading}
          />
          ${this._2faError ? html`<div class="twofa-error">${this._2faError}</div>` : ''}
          <div class="twofa-actions">
            <app-button type="secondary" size="small" @click=${this._close2FADialog}>Cancel</app-button>
            <app-button type="danger" size="small" .loading=${this._2faLoading} @click=${this._disableTwoFactor}>Disable 2FA</app-button>
          </div>
        </div>
      `;
    }

    return html``;
  }

  render() {
    const dialogTitle = this._2faStep === 'disable'
      ? 'Disable Two-Factor Authentication'
      : 'Set Up Two-Factor Authentication';

    return html`
      <app-dialog
        .isOpen=${this.showUploadDialog}
        title="Change Profile Photo"
        description="Upload a new profile picture"
        mode="upload"
        styleMode="compact"
        size="medium"
        confirmText="Upload"
        confirmColor="primary"
        @file-upload=${this.handleFileUpload}
        @dialog-close=${this.handleDialogClose}
        @dialog-cancel=${this.handleDialogClose}
      ></app-dialog>

      ${this.show2FADialog ? html`
        <div class="twofa-overlay" @click=${e => { if (e.target === e.currentTarget) this.handle2FADialogClose(); }}>
          <div class="twofa-dialog">
            <div class="twofa-dialog-header">
              <h2 class="twofa-dialog-title">${dialogTitle}</h2>
              ${this._2faStep !== 'backup' ? html`
                <button class="twofa-close-btn" @click=${this._close2FADialog}>&times;</button>
              ` : ''}
            </div>
            <div class="twofa-dialog-body">
              ${this._render2FAContent()}
            </div>
          </div>
        </div>
      ` : ''}

      <div class="profile-card">
        ${this.isUploading ? html`
          <div class="loading-overlay">
            <div class="spinner"></div>
          </div>
        ` : ''}

        <div class="left-bar"></div>

        <div class="content">
          <div class="avatar-container">
            <user-avatar
              size="80"
              .name=${this.displayName}
              .gender=${this.gender}
              .src=${this.photoURL}
            ></user-avatar>

            <div class="camera-icon ${this.isUploading ? 'uploading' : ''}"
                 @click=${this.changeAvatar}>
              add_photo_alternate
            </div>
          </div>

          <div class="info">
            <div class="name">${this.displayName}</div>
            <div class="role">${this.role}</div>
            <div class="joined-date">Joined: ${this.formatDate(this.joinedDate)}</div>
            <div class="status">Last login: ${this.lastLoginDate}</div>
          </div>
        </div>

        <div class="badge">${this.status}</div>

        <div class="twofa-section">
          <span class="twofa-label">2FA</span>
          <label class="switch">
            <input
              type="checkbox"
              ?checked=${this.twoFactorEnabled}
              @click=${this.handle2FAToggle}
            >
            <span class="slider"></span>
          </label>
        </div>
      </div>
    `;
  }
}

customElements.define('profile-header', ProfileHeader);
