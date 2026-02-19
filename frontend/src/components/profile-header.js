import { LitElement, html, css } from 'lit';
import '/src/components/users-avatar.js';
import '/src/components/app-dialog.js';

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
    twoFactorEnabled: { type: Boolean }
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
    this.show2FADialog = true;
  }

  handle2FAConfirm() {
    this.twoFactorEnabled = !this.twoFactorEnabled;
    this.show2FADialog = false;
    this.dispatchEvent(new CustomEvent('2fa-toggle', {
      detail: { enabled: this.twoFactorEnabled },
      bubbles: true,
      composed: true
    }));
  }

  handle2FADialogClose() {
    this.show2FADialog = false;
  }

  render() {
    const action = this.twoFactorEnabled ? 'Disable' : 'Enable';

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

      <app-dialog
        .isOpen=${this.show2FADialog}
        title="${action} Two-Factor Authentication"
        description="${action === 'Enable'
          ? 'Add an extra layer of security to your account. You will be asked for a verification code each time you log in.'
          : 'This will remove the extra security layer from your account. Are you sure?'}"
        confirmText="${action}"
        confirmColor="${action === 'Enable' ? 'primary' : 'danger'}"
        cancelText="Cancel"
        size="medium"
        @dialog-confirm=${this.handle2FAConfirm}
        @dialog-close=${this.handle2FADialogClose}
        @dialog-cancel=${this.handle2FADialogClose}
      ></app-dialog>

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
              @change=${this.handle2FAToggle}
            >
            <span class="slider"></span>
          </label>
        </div>
      </div>
    `;
  }
}

customElements.define('profile-header', ProfileHeader);
