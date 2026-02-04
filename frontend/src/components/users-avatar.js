// Fixed /src/components/commons/users-avatar.js
import { LitElement, html, } from 'lit';
import { userAvatarDesign } from '/src/styles/avatar-styles.js'
export class UserAvatar extends LitElement {
  static properties = {
    src: { type: String },
    name: { type: String },
    gender: { type: String },
    size: { type: String },
    backgroundColor: { type: String },
    textColor: { type: String }
  };

  static styles = userAvatarDesign;

  constructor() {
    super();
    this.src = '';
    this.name = '';
    this.gender = '';
    this.size = '40';
    this.backgroundColor = '#e0e0e0';
    this.textColor = '#666';
  }

  _getDefaultAvatar() {
    // If no custom src is provided, use gender-specific default avatars
    if (this.gender === 'male') {
      return 'https://i.imgur.com/uherCAZ.png';
    } else if (this.gender === 'female') {
      return 'https://i.imgur.com/WqV8GTy.png';
    }
    return 'https://i.imgur.com/kXp4fIF.png'; // No default image, will show icon
  }

  _handleClick() {
    this.dispatchEvent(new CustomEvent('avatar-click', {
      detail: { name: this.name, src: this.src },
      bubbles: true,
      composed: true
    }));
  }

  _handleImageError() {
    // Keep your original logic - remove src to show fallback
    this.src = '';
  }

  render() {
    const size = `${this.size}px`;
    const fontSize = `${Math.floor(parseInt(this.size) * 0.4)}px`;

    // Determine which image to show - always show something
    let imageToShow = this.src;

    // If no custom src, use default avatar
    if (!imageToShow || imageToShow.trim() === '') {
      imageToShow = this._getDefaultAvatar();
    }

    return html`
      <div 
        class="avatar"
        style="
          width: ${size};
          height: ${size};
          background-color: ${imageToShow ? 'transparent' : this.backgroundColor};
          color: ${this.textColor};
          font-size: ${fontSize};
          --avatar-size: ${this.size}px;
        "
        @click=${this._handleClick}
      >
        ${imageToShow ? html`
          <img
            src="${imageToShow}"
            alt="${this.name || 'User avatar'}"
            @error=${this._handleImageError}
          />
        ` : html`
          <span class="avatar-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
            </svg>
          </span>
        `}
      </div>
    `;
  }
}

customElements.define('user-avatar', UserAvatar);