import { LitElement, html, css } from 'lit';
import '/src/components/change-email-card.js';
import '/src/components/change-password-card.js';
import '/src/components/termination-card.js';
import '/src/components/app-button.js';
import { toast } from '/src/service/toast-widget.js';
import { ICONS } from '/src/components/dashboard-icons.js'; // <-- import ICONS

export class ManageAccountCard extends LitElement {
  static properties = {
    isUnlocked: { type: Boolean },
    userEmail: { type: String },
    authProvider: { type: String }
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
  `;

  constructor() {
    super();
    this.isUnlocked = true;
    this.userEmail = '';
    this.authProvider = 'email';
    this.sessionTimeout = null;
  }

  connectedCallback() {
    super.connectedCallback();
    console.log('ManageAccountCard connected');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.sessionTimeout) clearTimeout(this.sessionTimeout);
  }

  handleUnlockAccount() {
    this.isUnlocked = true;
    toast.success('Account management unlocked');

    if (this.sessionTimeout) clearTimeout(this.sessionTimeout);
    this.sessionTimeout = setTimeout(() => {
      this.handleLockAccount();
      toast.warning('Account management auto-locked for security');
    }, 600000);
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
        bubbles: true,
        composed: true
      }));
    }
  }

  handleDeleteAccount(e) {
    if (this.isUnlocked) {
      this.dispatchEvent(new CustomEvent('delete-account', {
        bubbles: true,
        composed: true
      }));
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
    `;
  }
}

customElements.define('manage-account-card', ManageAccountCard);
