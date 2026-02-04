// src/layouts/tabs-wrapper.js
import { LitElement, html, css } from 'lit';

class TabsWrapper extends LitElement {
    static styles = css`
    :host {
      flex: 1;
    }
  `;

    render() {
        return html`<slot></slot>`;
    }
}

customElements.define('tabs-wrapper', TabsWrapper);