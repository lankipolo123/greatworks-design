// src/components/content-card.js
import { LitElement, html, css } from 'lit';

export class ContentCard extends LitElement {
  static properties = {
    mode: { type: Number }
  };

  //mode-4 :data tables
  //mode-3 :calendar
  //mode1-dashboard
  //mode2- no border
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .card {
      background: white;
      border-radius: 12px;
      padding: 1rem;
      box-sizing: border-box;
    }

    .card.mode-1 {
      display: flex;
      height: 100%;
  
    }

    .card.mode-2 {
      border: none;
      display: block;
      height: 100%;
    }

    .card.mode-3 {
      border: 1.25px solid #2d2b2b45;
      padding: 1.5rem;
      display: flex;
    }

    .card.mode-4{
      border: 1.25px solid #2d2b2b45;
      display: block;
    }
  `;

  constructor() {
    super();
    this.mode = 1;
  }

  render() {
    return html`
      <div class="card mode-${this.mode}">
        <slot></slot>
      </div>
    `;
  }
}


customElements.define('content-card', ContentCard);