// src/layouts/search-bar-wrapper.js
import { LitElement, html, css } from 'lit';

class SearchBarWrapper extends LitElement {
    static properties = {
        width: { type: String }
    };

    static styles = css`
    :host {
      width: 300px;
    }

    :host([width="small"]) {
      width: 200px;
    }

    :host([width="large"]) {
      width: 400px;
    }
  `;

    constructor() {
        super();
        this.width = 'default';
    }

    updated(changedProperties) {
        if (changedProperties.has('width')) {
            if (this.width === 'small') {
                this.setAttribute('width', 'small');
            } else if (this.width === 'large') {
                this.setAttribute('width', 'large');
            } else {
                this.removeAttribute('width');
            }
        }
    }

    render() {
        return html`<slot></slot>`;
    }
}

customElements.define('search-bar-wrapper', SearchBarWrapper);