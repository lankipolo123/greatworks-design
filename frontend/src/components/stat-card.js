import { LitElement, html, css } from 'lit';

export class StatCard extends LitElement {
  static properties = {
    title: { type: String },
    value: { type: String },
    icon: { type: Object },
    textColor: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .card {
      background: white;
      border-radius: 8px;
      padding: 0.75rem;
      border: 1.25px solid #2d2b2b45;
      width: 100%;
      display: flex;
      flex-direction: column;

      box-sizing: border-box;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .title {
      font-size: 0.8rem;
      color: #080808;
      font-weight: 500;
    }

    .icon {
      color: #080808;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--value-color, #1a1a1a);
    }
  `;

  constructor() {
    super();
    this.title = '';
    this.value = '0';
    this.icon = null;
    this.textColor = '';
  }

  render() {
    return html`
      <div
        class="card"
        style="--value-color: ${this.textColor || '#1a1a1a'}"
      >
        <div class="card-header">
          <div class="title">${this.title}</div>
          ${this.icon ? html`<div class="icon">${this.icon}</div>` : null}
        </div>

        <div class="value">${this.value}</div>
      </div>
    `;
  }
}

customElements.define('stat-card', StatCard);
