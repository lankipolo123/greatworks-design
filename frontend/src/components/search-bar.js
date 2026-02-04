import { LitElement, html, css } from 'lit';

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
      font-family: 'Material Symbols Outlined', sans-serif;
      font-variation-settings: 
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 18;

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
      font-size: 18px;
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
            tune
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
          search
        </button>
      </div>
    `;
  }
}

customElements.define('search-bar', SearchBar);