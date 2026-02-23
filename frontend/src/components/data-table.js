import { LitElement, html, css } from 'lit';
import '/src/components/action-menu.js';

export class DataTable extends LitElement {

    static properties = {
        data: { type: Array },
        conf: { type: Object },
        loading: { type: Boolean },
        skeletonRows: { type: Number },
        mode: { type: Number },
        openMenuId: { type: String }
    };

    /* ✅ YOUR STYLES INLINE */
    static styles = css`

.table-container { 
    background: white;
    border-radius: 8px;
    overflow: visible;
}

.table-header { display: none; }

table { 
    width: 100%; 
    border-collapse: collapse; 
}

thead { 
    background: white; 
}


thead tr:first-child th:last-child {
    border-top-right-radius: 8px;
}

th { 
    padding: 2px; 
    text-align: left; 
    font-weight: bold; 
    font-size: 11px; 
    color: #0f0f0f; 
    text-transform: uppercase; 
    letter-spacing: 0.05em; 
}

td { 
    padding: 3px 5px; 
    font-size: 12px; 
    color: #374151; 
    vertical-align: middle;
}

.action-cell {
  text-align: middle;
  vertical-align: middle;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* Modes */
:host(.mode-1) .table-container {
    box-shadow: none;
    border: none;
}
:host(.mode-1) table th { border: none; }
:host(.mode-1) table td { border: none; }

:host(.mode-2) table th { 
    border: none;
    border-bottom: 1.2px solid #adadadff;
}
:host(.mode-2) table td { 
    border: none;
    border-bottom: 1.2px solid #adadadff;
}
:host(.mode-2) table tbody tr:last-child td {
    border-bottom: none !important;
}

:host(.mode-3) table th { 
    border: none;
    border-bottom: 1.2px solid #adadadff;
}
:host(.mode-3) table td { 
    border: none;
    border-bottom: 1.2px solid #adadadff;
}
:host(.mode-3) table tbody tr:last-child td {
    border-bottom: none !important;
}

.no-data, .loading {
    text-align: center;
    padding: 28px;
    color: #9ca3af;
    font-size: 12px;
}

/* Skeleton shimmer rows */
.skeleton-cell {
    padding: 10px 5px;
}

.skeleton-bar {
    height: 14px;
    border-radius: 4px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* Fade-in for real data rows */
tbody tr {
    animation: fadeIn 0.2s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

`;

    constructor() {
        super();
        this.data = [];
        this.conf = [];
        this.loading = false;
        this.skeletonRows = 5;
        this.mode = 1;
        this.openMenuId = null;
    }

    /* ---------------- CONFIG ---------------- */

    normalizeConfig(conf) {

        if (Array.isArray(conf)) return conf;

        if (conf?.columns) {

            const cols = conf.columns.map(col => ({
                property: col.key,
                header: col.label || col.key,
                html: col.render || null
            }));

            if (Array.isArray(conf.actions)) {
                cols.push({
                    property: 'actions',
                    header: 'Actions',
                    html: (_, row) => this.renderActions(row, conf.actions)
                });
            }

            return cols;
        }

        return [];
    }

    /* ---------------- ACTION MENU ---------------- */

    renderActions(row, actions = []) {

        const menuItems = actions.map(a => ({
            action: a.key,
            label: a.label,
            icon: a.icon || 'more_vert',
            type: a.danger ? 'danger' : 'primary'
        }));

        return html`
      <action-menu
        .items=${menuItems}
        .itemId=${row.id}
        .isOpen=${this.openMenuId === row.id}
        @menu-action=${e => {
                this.closeAllMenus();
                this.handleAction(e.detail.action, row);
            }}
        @click=${e => this.toggleMenu(row.id, e)}
      ></action-menu>
    `;
    }

    handleAction(action, item) {
        this.openMenuId = null;

        this.dispatchEvent(new CustomEvent('table-action', {
            detail: { action, item },
            bubbles: true,
            composed: true
        }));
    }

    toggleMenu(id, e) {
        e.stopPropagation();
        this.openMenuId = this.openMenuId === id ? null : id;
    }

    closeAllMenus() {
        this.openMenuId = null;
    }

    /* ---------------- LIFECYCLE ---------------- */

    updated(changed) {
        if (changed.has('mode')) {
            this.classList.remove('mode-1', 'mode-2', 'mode-3');
            this.classList.add(`mode-${this.mode}`);
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this._clickHandler = () => this.closeAllMenus();
        document.addEventListener('click', this._clickHandler);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this._clickHandler);
    }

    /* ---------------- RENDER ---------------- */

    renderCell(col, row) {

        if (col.html) {
            return col.html(
                row[col.property],
                row,
                action => this.handleAction(action, row),
                this
            );
        }

        return row[col.property] ?? '—';
    }

    render() {

        const conf = this.normalizeConfig(this.conf);

        if (this.loading) {
            const colCount = conf.length || 4;
            const rows = Array.from({ length: this.skeletonRows });
            const widths = ['60%', '45%', '70%', '35%', '55%'];
            return html`
        <div class="table-container">
          <table>
            <thead>
              <tr>
                ${conf.length
                  ? conf.map(c => html`<th>${c.header}</th>`)
                  : Array.from({ length: colCount }, () => html`<th><div class="skeleton-bar" style="width:50%"></div></th>`)
                }
              </tr>
            </thead>
            <tbody>
              ${rows.map((_, ri) => html`
                <tr>
                  ${Array.from({ length: colCount }, (_, ci) => html`
                    <td class="skeleton-cell">
                      <div class="skeleton-bar" style="width:${widths[(ri + ci) % widths.length]}"></div>
                    </td>
                  `)}
                </tr>
              `)}
            </tbody>
          </table>
        </div>
      `;
        }

        if (!conf.length) {
            return html`
        <div class="table-container">
          <div class="no-data">Invalid table configuration</div>
        </div>
      `;
        }

        if (!this.data?.length) {
            return html`
        <div class="table-container">
          <div class="no-data">No data available</div>
        </div>
      `;
        }

        return html`
      <div class="table-container">
        <table>

          <thead>
            <tr>
              ${conf.map(c => html`<th>${c.header}</th>`)}
            </tr>
          </thead>

          <tbody>
            ${this.data.map(row => html`
              <tr>
                ${conf.map(col => html`
                  <td class=${col.property === 'actions' ? 'action-cell' : ''}>
                    ${this.renderCell(col, row)}
                  </td>
                `)}
              </tr>
            `)}
          </tbody>

        </table>
      </div>
    `;
    }

}

customElements.define('data-table', DataTable);
