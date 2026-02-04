import { LitElement, html, css } from 'lit';

export class PaginationWrapper extends LitElement {
  static styles = css`
    :host {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
      width: 100%;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('pagination-wrapper', PaginationWrapper);
