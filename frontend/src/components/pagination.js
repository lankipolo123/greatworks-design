// src/components/pagination.js
import { LitElement, html, css } from 'lit';
import {
  getVisiblePages,
} from '/src/utility/pagination-helpers.js';
import { PaginationDesign } from '/src/styles/pagination-styles.js';

export class PaginationComponent extends LitElement {
  static properties = {
    currentPage: { type: Number },
    totalPages: { type: Number },
    disabled: { type: Boolean },
    mode: { type: Number },
    _searchValue: { type: String, state: true },
  };

  static styles = [
    PaginationDesign,
    css`
      .search-icon {
        width: 16px;
        height: 16px;
        stroke: currentColor;
        fill: none;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    `
  ];

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 1;
    this.disabled = false;
    this.mode = 1;
    this._searchValue = '';
  }

  updated(changedProperties) {
    if (changedProperties.has('mode')) {
      this.classList.remove('mode-1', 'mode-2');
      this.classList.add(`mode-${this.mode}`);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add(`mode-${this.mode}`);
  }

  _emitPageChange(page) {
    if (
      this.disabled ||
      page === this.currentPage ||
      page === '...' ||
      page < 1 ||
      page > this.totalPages
    ) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent('pagination-change', {
        detail: { page },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handlePrevious() {
    this._emitPageChange(this.currentPage - 1);
  }

  _handleNext() {
    this._emitPageChange(this.currentPage + 1);
  }

  _handleSearchInput(e) {
    this._searchValue = e.target.value;
  }

  _handleSearchSubmit() {
    const page = Number(this._searchValue);

    if (!Number.isNaN(page)) {
      this._emitPageChange(page);
      this._searchValue = '';
    }
  }

  render() {
    if (this.totalPages <= 1) return html``;

    const pages = getVisiblePages(
      this.currentPage,
      this.totalPages,
      3
    );

    return html`
      <div class="pagination-container">
        <button
          class="pagination-btn"
          ?disabled=${this.disabled || this.currentPage === 1}
          @click=${this._handlePrevious}
        >
          ${this.mode === 1 ? '←' : 'Previous'}
        </button>

        ${pages.map((page) =>
      page === '...'
        ? html`<span class="dots">…</span>`
        : html`
                <button
                  class="pagination-btn ${page === this.currentPage ? 'active' : ''}"
                  ?disabled=${this.disabled}
                  @click=${() => this._emitPageChange(page)}
                >
                  ${page}
                </button>
              `
    )}

        <button
          class="pagination-btn"
          ?disabled=${this.disabled || this.currentPage === this.totalPages}
          @click=${this._handleNext}
        >
          ${this.mode === 1 ? '→' : 'Next'}
        </button>

        ${this.mode === 1 ? html`
          <div class="search-box">
            <input
              class="search-input"
              type="number"
              min="1"
              max=${this.totalPages}
              placeholder="Page"
              .value=${this._searchValue}
              @input=${this._handleSearchInput}
            />
            <button
              class="search-btn"
              title="Go to page"
              @click=${this._handleSearchSubmit}
            >
              <svg class="search-icon" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('pagination-component', PaginationComponent);