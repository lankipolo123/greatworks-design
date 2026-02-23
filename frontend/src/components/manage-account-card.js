import { LitElement, html, css } from 'lit';
import '/src/components/change-email-card.js';
import '/src/components/change-password-card.js';
import '/src/components/termination-card.js';
import '/src/components/app-button.js';
import '/src/components/app-dialog.js';
import { toast } from '/src/service/toast-widget.js';
import { ICONS } from '/src/components/dashboard-icons.js';
import { auth } from '/src/service/api.js';

export class ManageAccountCard extends LitElement {
  static properties = {
    isUnlocked: { type: Boolean },
    userEmail: { type: String },
    authProvider: { type: String },
    _showPasswordDialog: { type: Boolean, state: true },
    _passwordInput: { type: String, state: true },
    _passwordError: { type: String, state: true },
    _verifying: { type: Boolean, state: true },
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .account-card {
      background: #fff;
      border-radius: 8px;
      border: 1px solid #ccc;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-size: 0.8rem;
    }

    .card-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      font-size: 0.85rem;
      color: #ff1500e9;
      padding: 10px 12px;
      border-bottom: 1px solid #ccc;
    }

    .lock-icon {
      cursor: pointer;
      font-size: 1rem;
      transition: transform 0.2s;
      display: flex;
      align-items: center;
    }

    .lock-icon:hover {
      transform: scale(1.1);
    }

    .lock-icon svg {
      width: 18px;
      height: 18px;
      vertical-align: middle;
    }

    .content-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .content-wrapper.unlocked {
      overflow-y: auto;
    }

    .content-wrapper.locked {
      overflow: hidden;
    }

    .section {
      padding: 12px 10px;
      border-bottom: 1px solid #ccc;
    }

    .section:last-of-type {
      border-bottom: none;
    }

    .locked-state {
      text-align: center;
      padding: 20px 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .locked-description {
      color: #666;
      font-size: 0.8rem;
      margin-bottom: 10px;
      line-height: 1.4;
    }

    .security-notice {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 8px;
      margin-top: 10px;
      font-size: 0.7rem;
      color: #495057;
    }

    .password-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .password-form input {
      padding: 10px 12px;
      border-radius: 6px;
      border: 1px solid #d0d0d0;
      font-size: 0.9rem;
      font-family: inherit;
      transition: border-color 0.2s;
      width: 100%;
      box-sizing: border-box;
    }

    .password-form input:focus {
      outline: none;
      border-color: #666;
    }

    .password-error {
      color: #c00;
      font-size: 0.8rem;
      text-align: center;
    }

    .password-hint {
      color: #888;
      font-size: 0.75rem;
      text-align: center;
    }
  `;

  constructor() {
    super();
    this.isUnlocked = false;
    this.userEmail = '';
    this.authProvider = 'email';
    this.sessionTimeout = null;
    this._showPasswordDialog = false;
    this._passwordInput = '';
    this._passwordError = '';
    this._verifying = false;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.sessionTimeout) clearTimeout(this.sessionTimeout);
  }

  _openPasswordDialog() {
    this._passwordInput = '';
    this._passwordError = '';
    this._verifying = false;
    this._showPasswordDialog = true;
  }

  _closePasswordDialog() {
    this._showPasswordDialog = false;
    this._passwordInput = '';
    this._passwordError = '';
  }

  async _verifyPassword() {
    if (!this._passwordInput) {
      this._passwordError = 'Please enter your password';
      return;
    }

    this._verifying = true;
    this._passwordError = '';

    try {
      await auth.login(this.userEmail, this._passwordInput);
      this._closePasswordDialog();
      this.isUnlocked = true;
      toast.success('Account management unlocked');

      if (this.sessionTimeout) clearTimeout(this.sessionTimeout);
      this.sessionTimeout = setTimeout(() => {
        this.handleLockAccount();
        toast.warning('Account management auto-locked for security');
      }, 600000);
    } catch (e) {
      this._passwordError = 'Incorrect password. Please try again.';
    } finally {
      this._verifying = false;
    }
  }

  handleUnlockAccount() {
    this._openPasswordDialog();
  }

  handleLockAccount() {
    this.isUnlocked = false;
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = null;
    }
    toast.info('Account management locked');
  }

  handleChangeEmail(e) {
    if (this.isUnlocked) {
      this.dispatchEvent(new CustomEvent('change-email', {
        detail: e.detail,
        bubbles: true,
        composed: true
      }));
    }
  }

  handleChangePassword(e) {
    if (this.isUnlocked) {
      this.dispatchEvent(new CustomEvent('change-password', {
        detail: e.detail,
        bubbles: true,
        composed: true
      }));
    }
  }

  handleDeactivateAccount(e) {
    if (this.isUnlocked) {
      this.dispatchEvent(new CustomEvent('deactivate-account', {
        detail: e.detail,
        bubbles: true,
        composed: true
      }));
    }
  }

  handleDeleteAccount(e) {
    if (this.isUnlocked) {
      this.dispatchEvent(new CustomEvent('delete-account', {
        detail: e.detail,
        bubbles: true,
        composed: true
      }));
    }
  }

  _handlePasswordKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this._verifyPassword();
    }
  }

  render() {
    return html`
      <div class="account-card">
        <div class="card-title">
          Manage Your Account
          <span
            class="lock-icon"
            @click="${this.isUnlocked ? this.handleLockAccount : this.handleUnlockAccount}"
            title="${this.isUnlocked ? 'Lock account management' : 'Unlock account management'}"
          >
            ${this.isUnlocked ? ICONS.lockOpen : ICONS.lockClosed}
          </span>
        </div>

        <div class="content-wrapper ${this.isUnlocked ? 'unlocked' : 'locked'}">
          ${!this.isUnlocked ? html`
            <div class="locked-state">
              <div class="locked-description">
                Account management is locked for security. Click unlock to access sensitive settings.
              </div>
              <app-button type="danger" size="small" @click="${this.handleUnlockAccount}">
                ${ICONS.lockOpen} Unlock Account Management
              </app-button>
              <div class="security-notice">
              ${ICONS.clock} Session will auto-lock after 10 minutes of activity
                </div>
            </div>
          ` : html`
            <div class="section">
              <change-email-card @change-email="${this.handleChangeEmail}"></change-email-card>
            </div>

            <div class="section">
              <change-password-card @change-password="${this.handleChangePassword}"></change-password-card>
            </div>

            <div class="section">
              <termination-card
                @deactivate-account="${this.handleDeactivateAccount}"
                @delete-account="${this.handleDeleteAccount}">
              </termination-card>
            </div>
          `}
        </div>
      </div>

      <app-dialog
        .isOpen=${this._showPasswordDialog}
        title="Verify Identity"
        description="Enter your password to unlock account management"
        confirmText="${this._verifying ? 'Verifying...' : 'Unlock'}"
        cancelText="Cancel"
        confirmColor="danger"
        size="small"
        styleMode="compact"
        @dialog-confirm=${this._verifyPassword}
        @dialog-cancel=${this._closePasswordDialog}
        @dialog-close=${this._closePasswordDialog}
      >
        <div class="password-form">
          <input
            type="password"
            placeholder="Enter your password"
            .value=${this._passwordInput}
            @input=${e => (this._passwordInput = e.target.value)}
            @keydown=${this._handlePasswordKeydown}
            ?disabled=${this._verifying}
          />
          ${this._passwordError ? html`<div class="password-error">${this._passwordError}</div>` : ''}
          <div class="password-hint">This verifies you are the account owner</div>
        </div>
      </app-dialog>
    `;
  }
}

customElements.define('manage-account-card', ManageAccountCard);
