// src/layouts/search-wrapper.js
import { LitElement, html, css } from 'lit';

class SearchWrapper extends LitElement {
    static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
  `;

    render() {
        return html`<slot></slot>`;
    }
}

customElements.define('search-wrapper', SearchWrapper);