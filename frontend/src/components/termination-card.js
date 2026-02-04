import { LitElement, html, css } from 'lit';

export class TerminationCard extends LitElement {
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
  `;

    disableAccount() {
        console.log('Termination card: deactivate clicked');
        this.dispatchEvent(new CustomEvent('deactivate-account', {
            bubbles: true,
            composed: true
        }));
    }

    deleteAccount() {
        console.log('Termination card: delete clicked');
        this.dispatchEvent(new CustomEvent('delete-account', {
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
      <div class="section">
        <div class="section-title">Account Termination</div>

        <div class="actions">
          <div class="action disable" @click=${this.disableAccount}>
            Deactivate Account
          </div>
          <div class="action delete" @click=${this.deleteAccount}>
            Delete Account
          </div>
        </div>

        <div class="notice">
          You can temporarily deactivate your account or permanently delete it. Deleting is irreversible.
        </div>
      </div>
    `;
    }
}

customElements.define('termination-card', TerminationCard);
