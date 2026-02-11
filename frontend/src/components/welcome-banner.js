// src/components/welcome-banner.js
import { LitElement, html, css } from 'lit';

export class WelcomeBanner extends LitElement {
    static properties = {
        userName: { type: String },
        greeting: { type: String },
        subtitle: { type: String }
    };

    static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .banner-container {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      border: 1.25px solid #2d2b2b45;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
    }

    .greeting {
      font-size: 0.85rem;
      font-weight: 400;
      color: #666;
      margin-bottom: 0.35rem;
    }

    .name {
      font-size: 1.6rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 0.75rem;
    }

    .subtitle {
      font-size: 0.8rem;
      color: #666;
      line-height: 1.5;
    }
  `;

    constructor() {
        super();
        this.userName = 'Guest';
        this.greeting = 'Welcome back,';
        this.subtitle = 'Here\'s an overview of your activity.';
    }

    render() {
        return html`
      <div class="banner-container">
        <div class="greeting">${this.greeting}</div>
        <div class="name">${this.userName}</div>
        <div class="subtitle">${this.subtitle}</div>
      </div>
    `;
    }
}

customElements.define('welcome-banner', WelcomeBanner);