// src/components/app-dialog.js
import { LitElement, html, } from 'lit';
import { ICONS } from '/src/components/dashboard-icons.js';
import { dialogAppearance } from '/src/styles/app-dialog-appearance.js'

export class AppDialog extends LitElement {
  static properties = {
    isOpen: { type: Boolean },
    title: { type: String },
    description: { type: String },
    cancelText: { type: String },
    confirmText: { type: String },
    confirmColor: { type: String },
    size: { type: String },
    closeOnOverlay: { type: Boolean },
    mode: { type: String },
    hideFooter: { type: Boolean },
    styleMode: { type: String },
    selectedFile: { type: Object },
    previewUrl: { type: String },
    cameraActive: { type: Boolean },
    uploadMethod: { type: String },
    ticketData: { type: Object },
    detailsData: { type: Object }
  };

  static styles = dialogAppearance;


  constructor() {
    super();
    this.isOpen = false;
    this.title = '';
    this.description = '';
    this.cancelText = 'Cancel';
    this.confirmText = 'Confirm';
    this.confirmColor = 'danger';
    this.size = 'medium';
    this.closeOnOverlay = false;
    this.mode = 'default';
    this.styleMode = 'default'; // default, compact, clean
    this.hideFooter = false;
    this.selectedFile = null;
    this.previewUrl = '';
    this.cameraActive = false;
    this.uploadMethod = ''; // 'file' or 'camera'
    this.videoStream = null;
    this.ticketData = null;
    this.detailsData = null;
  }

  updated(changedProperties) {
    if (changedProperties.has('isOpen')) {
      if (this.isOpen) {
        this.setAttribute('open', '');
        document.body.style.overflow = 'hidden';
      } else {
        this.removeAttribute('open');
        document.body.style.overflow = '';
        // Reset upload state when closing
        this.selectedFile = null;
        this.previewUrl = '';
        this.cameraActive = false;
        this.uploadMethod = '';
        this.stopCamera();
      }
    }
    if (changedProperties.has('hideFooter')) {
      if (this.hideFooter) {
        this.setAttribute('hide-footer', '');
      } else {
        this.removeAttribute('hide-footer');
      }
    }
    if (changedProperties.has('styleMode')) {
      this.setAttribute('style-mode', this.styleMode);
    }
  }

  close() {
    this.stopCamera();
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('dialog-close', {
      bubbles: true,
      composed: true
    }));
  }

  handleOverlayClick(e) {
    if (e.target === e.currentTarget && this.closeOnOverlay) {
      this.close();
    }
  }

  handleCancel() {
    this.dispatchEvent(new CustomEvent('dialog-cancel', {
      bubbles: true,
      composed: true
    }));
    this.close();
  }

  handleConfirm() {
    if (this.mode === 'upload' && this.selectedFile) {
      this.dispatchEvent(new CustomEvent('file-upload', {
        detail: { file: this.selectedFile },
        bubbles: true,
        composed: true
      }));
    } else {
      this.dispatchEvent(new CustomEvent('dialog-confirm', {
        bubbles: true,
        composed: true
      }));
    }
    this.close();
  }

  handleTicketAction(action) {
    this.dispatchEvent(new CustomEvent('ticket-action', {
      detail: { action, ticket: this.ticketData },
      bubbles: true,
      composed: true
    }));
    this.close();
  }

  handleExportOption(format) {
    const fromDate = this.shadowRoot.getElementById('export-from-date')?.value || null;
    const toDate = this.shadowRoot.getElementById('export-to-date')?.value || null;

    this.dispatchEvent(new CustomEvent('export-select', {
      detail: { format, fromDate, toDate },
      bubbles: true,
      composed: true
    }));
    this.close();
  }

  handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      this.previewUrl = URL.createObjectURL(file);
      this.uploadMethod = 'file';
      this.requestUpdate();
    }
  }

  async startCamera() {
    try {
      this.uploadMethod = 'camera';
      this.cameraActive = true;
      this.requestUpdate();

      await this.updateComplete;

      const video = this.shadowRoot.getElementById('camera-video');
      if (video) {
        this.videoStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false
        });
        video.srcObject = this.videoStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
      this.cameraActive = false;
      this.uploadMethod = '';
    }
  }

  stopCamera() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
  }

  capturePhoto() {
    const video = this.shadowRoot.getElementById('camera-video');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      this.selectedFile = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      this.previewUrl = URL.createObjectURL(blob);
      this.stopCamera();
      this.cameraActive = false;
      this.requestUpdate();
    }, 'image/jpeg', 0.95);
  }

  cancelCamera() {
    this.stopCamera();
    this.cameraActive = false;
    this.uploadMethod = '';
    this.requestUpdate();
  }

  backToOptions() {
    this.selectedFile = null;
    this.previewUrl = '';
    this.uploadMethod = '';
    this.requestUpdate();
  }

  handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    const uploadContainer = this.shadowRoot.querySelector('.upload-container');
    uploadContainer?.classList.add('drag-over');
  }

  handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    const uploadContainer = this.shadowRoot.querySelector('.upload-container');
    uploadContainer?.classList.remove('drag-over');
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const uploadContainer = this.shadowRoot.querySelector('.upload-container');
    uploadContainer?.classList.remove('drag-over');

    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      this.previewUrl = URL.createObjectURL(file);
      this.requestUpdate();
    }
  }

  openFileDialog() {
    const input = this.shadowRoot.getElementById('file-input');
    input?.click();
  }

  getInitials(name) {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatValue(value) {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object' && value instanceof Date) {
      return value.toLocaleString();
    }
    return value.toString();
  }

  renderDetailsView() {
    if (!this.detailsData) return html`<p>No data available</p>`;

    const entries = Object.entries(this.detailsData);

    return html`
      <div class="details-grid">
        ${entries.map(([key, value]) => {
      // Skip rendering certain system fields
      if (key === 'message' || key === 'description' || key === 'notes') {
        return html`
              <div class="details-item full">
                <div class="details-label">${this.formatLabel(key)}</div>
                <div class="details-value">${this.formatValue(value)}</div>
              </div>
            `;
      }

      // Special rendering for status
      if (key === 'status') {
        return html`
              <div class="details-item">
                <div class="details-label">${this.formatLabel(key)}</div>
                <div class="details-status-badge ${value?.toLowerCase()}">${this.formatValue(value)}</div>
              </div>
            `;
      }

      // Special rendering for dates
      if (key.includes('At') || key.includes('Date') || key === 'date' || key === 'createdAt' || key === 'updatedAt') {
        return html`
              <div class="details-item">
                <div class="details-label">${this.formatLabel(key)}</div>
                <div class="details-value">${this.formatDate(value) || this.formatValue(value)}</div>
              </div>
            `;
      }

      // Default rendering
      return html`
            <div class="details-item">
              <div class="details-label">${this.formatLabel(key)}</div>
              <div class="details-value">${this.formatValue(value)}</div>
            </div>
          `;
    })}
      </div>
    `;
  }

  formatLabel(key) {
    // Convert camelCase or snake_case to Title Case
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  renderTicketView() {
    if (!this.ticketData) return html`<p>No ticket data available</p>`;

    const {
      id,
      userId,
      userName,
      userAvatar,
      subject,
      message,
      category,
      location,
      createdAt,
      status
    } = this.ticketData;

    return html`
      <div class="ticket-header">
        <div class="ticket-avatar">
          ${userAvatar
        ? html`<img src="${userAvatar}" alt="${userName}" />`
        : this.getInitials(userName)
      }
        </div>
        <div class="ticket-user-info">
          <div class="ticket-user-name">${userName || userId}</div>
          <div class="ticket-meta">
            <span class="ticket-meta-item">${this.formatDate(createdAt)}</span>
            ${location ? html`
              <span class="ticket-meta-separator">•</span>
              <span class="ticket-meta-item">${location}</span>
            ` : ''}
          </div>
          ${category ? html`
            <div class="ticket-tags">
              <span class="ticket-tag ${category.toLowerCase()}">${category}</span>
            </div>
          ` : ''}
        </div>
        <button class="ticket-more-btn" @click=${(e) => e.stopPropagation()}>⋮</button>
      </div>

      <div class="ticket-content">
        <div class="ticket-greeting">Dear GreatWorks Team,</div>
        <div class="ticket-message">${message}</div>
        <div class="ticket-signature">
          <div>Regards,</div>
          <div class="ticket-signature-name">${userName || userId}</div>
        </div>
      </div>

      ${status === 'pending' ? html`
        <div class="ticket-actions">
          <button 
            class="ticket-action-btn accept" 
            @click=${() => this.handleTicketAction('accept')}
          >
            Accept
          </button>
          <button 
            class="ticket-action-btn decline" 
            @click=${() => this.handleTicketAction('decline')}
          >
            Decline
          </button>
        </div>
      ` : status === 'ongoing' ? html`
        <div class="ticket-actions">
          <button 
            class="ticket-action-btn respond" 
            @click=${() => this.handleTicketAction('respond')}
          >
            Respond
          </button>
          <button 
            class="ticket-action-btn close" 
            @click=${() => this.handleTicketAction('close')}
          >
            Close Ticket
          </button>
        </div>
      ` : ''}
    `;
  }

  renderUploadMode() {
    // Show preview if file selected
    if (this.previewUrl) {
      return html`
        <div class="preview-container">
          <img src="${this.previewUrl}" alt="Preview" class="preview-image" />
          <div class="preview-name">${this.selectedFile?.name || 'Captured Photo'}</div>
          <button class="change-photo-btn" @click=${this.backToOptions}>
            Choose Different Photo
          </button>
        </div>
      `;
    }

    // Show camera view if active
    if (this.cameraActive) {
      return html`
        <div>
          <video 
            id="camera-video" 
            class="camera-view" 
            autoplay 
            playsinline
          ></video>
          <div class="camera-controls">
            <button class="camera-btn capture" @click=${this.capturePhoto}>
              📸 Capture
            </button>
            <button class="camera-btn cancel" @click=${this.cancelCamera}>
              Cancel
            </button>
          </div>
        </div>
      `;
    }

    // Show upload options (camera or file)
    return html`
      <div class="upload-options">
        <div class="upload-option-card" @click=${this.startCamera}>
          <div class="upload-option-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
          <div class="upload-option-title">Take Photo</div>
          <div class="upload-option-desc">Use your camera</div>
        </div>

        <div class="upload-option-card" @click=${this.openFileDialog}>
          <div class="upload-option-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <div class="upload-option-title">Upload File</div>
          <div class="upload-option-desc">Choose from device</div>
        </div>
      </div>

      <input
        type="file"
        id="file-input"
        class="upload-input"
        accept="image/*"
        @change=${this.handleFileSelect}
      />
    `;
  }

  renderExportMode() {
    return html`
      <div class="export-options">
        <div class="export-option" @click=${() => this.handleExportOption('csv')}>
          <div class="export-option-icon">${ICONS.fileCsv}</div>
          <div class="export-option-content">
            <div class="export-option-title">Export as CSV</div>
            <div class="export-option-desc">Comma-separated values for Excel</div>
          </div>
        </div>

        <div class="export-option" @click=${() => this.handleExportOption('pdf')}>
          <div class="export-option-icon">${ICONS.filePdf}</div>
          <div class="export-option-content">
            <div class="export-option-title">Export as PDF</div>
            <div class="export-option-desc">Portable document format</div>
          </div>
        </div>

        <div class="export-option" @click=${() => this.handleExportOption('excel')}>
          <div class="export-option-icon">${ICONS.fileExcel}</div>
          <div class="export-option-content">
            <div class="export-option-title">Export as Excel</div>
            <div class="export-option-desc">Microsoft Excel spreadsheet</div>
          </div>
        </div>
      </div>

      <div class="date-range-section">
        <div class="date-range-title">Date Range (Optional)</div>
        <div class="date-inputs">
          <div class="date-input-group">
            <label>From</label>
            <input type="date" id="export-from-date" />
          </div>
          <div class="date-input-group">
            <label>To</label>
            <input type="date" id="export-to-date" />
          </div>
        </div>
      </div>
    `;
  }

  renderTitle() {
    if (this.styleMode === 'compact' || this.styleMode === 'clean') {
      return html`<h2 class="dialog-title">${this.title}</h2>`;
    }

    return html`
      <h2 class="dialog-title">
        ${this.title.split(' ').map((word, index) =>
      index === this.title.split(' ').length - 1
        ? html`<span class="highlight">${word}</span>`
        : html`${word} `
    )}
      </h2>
    `;
  }

  render() {
    if (!this.isOpen) return html``;

    return html`
      <div class="dialog-overlay" @click="${this.handleOverlayClick}">
        <div class="dialog-container ${this.size}">
          <div class="dialog-header">
            <div>
              ${this.renderTitle()}
              ${this.description ? html`
                <p class="dialog-description">${this.description}</p>
              ` : ''}
            </div>
            ${this.styleMode === 'compact' || this.mode === 'upload' || this.mode === 'ticket' || this.mode === 'details' ? html`
              <button class="close-btn" @click=${this.close}>×</button>
            ` : ''}
          </div>

          <div class="dialog-body">
            ${this.mode === 'export' ? this.renderExportMode() :
        this.mode === 'upload' ? this.renderUploadMode() :
          this.mode === 'ticket' ? this.renderTicketView() :
            this.mode === 'details' ? this.renderDetailsView() :
              html`<slot></slot>`}
          </div>

          ${!this.hideFooter && this.mode !== 'ticket' && this.mode !== 'details' ? html`
            <div class="dialog-footer">
              <button class="dialog-button cancel-button" @click="${this.handleCancel}">
                ${this.cancelText}
              </button>
              <button 
                class="dialog-button confirm-button ${this.confirmColor}" 
                @click="${this.handleConfirm}"
                ?disabled=${this.mode === 'upload' && !this.selectedFile}
              >
                ${this.confirmText}
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('app-dialog', AppDialog);