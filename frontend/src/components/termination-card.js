import { LitElement, html, css } from 'lit';
import '/src/components/app-dialog.js';

export class TerminationCard extends LitElement {
  static properties = {
    _showDialog: { type: Boolean, state: true },
    _dialogAction: { type: String, state: true },
    _password: { type: String, state: true },
    _error: { type: String, state: true },
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .section-title {
      font-weight: bold;
      font-size: 0.95rem;
      margin: 0;
      padding-bottom: 8px;
      color: #000000ff;
      text-align: center;
    }

    .actions {
      display: flex;
      justify-content: center;
      align-items: stretch;
      border-radius: 1px;
      overflow: hidden;
      width: fit-content;
      margin: 0 auto;
    }

    .action {
      text-align: center;
      padding: 6px 12px;
      font-size: 0.9rem;
      cursor: pointer;
      user-select: none;
      box-sizing: border-box;
      transition: text-decoration 0.2s;
    }

    .action:hover {
      text-decoration: underline;
    }

    .action + .action {
      border-left: 1.2px solid #ddd;
    }

    .disable {
      color: #ff6606ff;
      font-weight: bold;
    }

    .delete {
      color: #c62828;
      font-weight: bold;
    }

    .notice {
      font-size: 0.8rem;
      color: #474545ff;
      text-align: center;
      margin-top: 12px;
    }

    .confirm-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .confirm-form input {
      padding: 10px 12px;
      border-radius: 6px;
      border: 1px solid #d0d0d0;
      font-size: 0.9rem;
      font-family: inherit;
      width: 100%;
      box-sizing: border-box;
    }

    .confirm-form input:focus {
      outline: none;
      border-color: #666;
    }

    .confirm-warning {
      color: #666;
      font-size: 0.8rem;
      text-align: center;
      line-height: 1.4;
    }

    .confirm-warning strong {
      color: #c62828;
    }

    .confirm-error {
      color: #c00;
      font-size: 0.8rem;
      text-align: center;
    }
  `;

  constructor() {
    super();
    this._showDialog = false;
    this._dialogAction = '';
    this._password = '';
    this._error = '';
  }

  _openDialog(action) {
    this._dialogAction = action;
    this._password = '';
    this._error = '';
    this._showDialog = true;
  }

  _closeDialog() {
    this._showDialog = false;
    this._password = '';
    this._error = '';
  }

  _handleConfirm() {
    if (!this._password) {
      this._error = 'Please enter your password';
      return;
    }

    const eventName = this._dialogAction === 'deactivate' ? 'deactivate-account' : 'delete-account';

    this.dispatchEvent(new CustomEvent(eventName, {
      detail: { password: this._password },
      bubbles: true,
      composed: true
    }));

    this._closeDialog();
  }

  _handleKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this._handleConfirm();
    }
  }

  get _dialogTitle() {
    return this._dialogAction === 'deactivate' ? 'Deactivate Account' : 'Delete Account';
  }

  get _dialogDescription() {
    return this._dialogAction === 'deactivate'
      ? 'Your account will be deactivated and you will be logged out.'
      : 'This action is permanent and cannot be undone.';
  }

  render() {
    return html`
      <div class="section">
        <div class="section-title">Account Termination</div>

        <div class="actions">
          <div class="action disable" @click=${() => this._openDialog('deactivate')}>
            Deactivate Account
          </div>
          <div class="action delete" @click=${() => this._openDialog('delete')}>
            Delete Account
          </div>
        </div>

        <div class="notice">
          You can temporarily deactivate your account or permanently delete it. Deleting is irreversible.
        </div>
      </div>

      <app-dialog
        .isOpen=${this._showDialog}
        title=${this._dialogTitle}
        description=${this._dialogDescription}
        confirmText="Confirm"
        cancelText="Cancel"
        confirmColor="danger"
        size="small"
        styleMode="compact"
        @dialog-confirm=${this._handleConfirm}
        @dialog-cancel=${this._closeDialog}
        @dialog-close=${this._closeDialog}
      >
        <div class="confirm-form">
          ${this._dialogAction === 'delete' ? html`
            <div class="confirm-warning">
              <strong>Warning:</strong> All your data including bookings, reservations, tickets, and payments will be permanently deleted.
            </div>
          ` : ''}
          <input
            type="password"
            placeholder="Enter your password to confirm"
            .value=${this._password}
            @input=${e => (this._password = e.target.value)}
            @keydown=${this._handleKeydown}
          />
          ${this._error ? html`<div class="confirm-error">${this._error}</div>` : ''}
        </div>
      </app-dialog>
    `;
  }
}

customElements.define('termination-card', TerminationCard);
