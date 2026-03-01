import { LitElement, html, css, svg } from 'lit';

export class SearchBar extends LitElement {
  static properties = {
    placeholder: { type: String },
    value: { type: String },
    disabled: { type: Boolean },
    showFilter: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      box-sizing: border-box;
    }

    .search-container {
      display: flex;
      align-items: center;
      gap: 4px;
      background: #ffffff;
      border: 1px solid #adadad;
      border-radius: 6px;
      padding: 2px 4px;
      box-sizing: border-box;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 12px;
      color: #111827;
      background: transparent;
      padding: 4px 6px;
    }

    .search-input::placeholder {
      color: #9ca3af;
    }

    .search-input:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 3px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      transition: background 0.15s ease, color 0.15s ease;
    }

    button svg {
      width: 18px;
      height: 18px;
    }

    button:hover:not(:disabled) {
      background: #f3f4f6;
      color: #111827;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .filter-button {
      color: #2563eb;
    }

    .search-button {
      color: #16a34a;
    }
  `;

  constructor() {
    super();
    this.placeholder = 'Search...';
    this.value = '';
    this.disabled = false;
    this.showFilter = true;
  }

  _handleInput(e) {
    this.value = e.target.value;
    this.dispatchEvent(new CustomEvent('search-input', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  _handleKeyDown(e) {
    if (e.key === 'Enter') this._handleSearch();
  }

  _handleSearch() {
    this.dispatchEvent(new CustomEvent('search', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  _handleFilter() {
    this.dispatchEvent(new CustomEvent('filter-click', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="search-container">
        ${this.showFilter ? html`
          <button
            class="filter-button"
            @click=${this._handleFilter}
            title="Filter"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
          </button>
        ` : ''}

        <input
          class="search-input"
          type="text"
          .value=${this.value}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          @input=${this._handleInput}
          @keydown=${this._handleKeyDown}
        />

        <button
          class="search-button"
          @click=${this._handleSearch}
          title="Search"
          ?disabled=${this.disabled}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </button>
      </div>
    `;
  }
}

customElements.define('search-bar', SearchBar);