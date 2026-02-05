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
    showUploadDialog: { type: Boolean }
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
    this.displayName = 'Admin User';
    this.role = 'admin';
    this.email = 'admin@email.com';
    this.status = 'active';
    this.joinedDate = '—';
    this.lastLoginDate = '—';
    this.photoURL = '';
    this.gender = '';
    this.isUploading = false;
    this.showUploadDialog = false;
  }

  changeAvatar() {
    this.showUploadDialog = true;
  }

  handleFileUpload(e) {
    const file = e.detail.file;

    // Dispatch event to parent component
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

  render() {
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
            <div class="joined-date">Joined: ${this.joinedDate}</div>
            <div class="status">Last login: ${this.lastLoginDate}</div>
          </div>
        </div>

        <div class="badge">${this.status}</div>
      </div>
    `;
  }
}

customElements.define('profile-header', ProfileHeader);