// app-settings.js
import { LitElement, html, css } from 'lit';
import '/src/layouts/settings-layout.js';
import '/src/components/profile-header.js';
import '/src/components/personal-info-form.js';
import '/src/components/manage-account-card.js';
import { toast } from '/src/service/toast-widget.js';
import { getUser } from '/src/service/api.js';

export class AppSettings extends LitElement {
  static properties = {
    userInfo: { type: Object },
  };

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      min-height: 100vh;
      box-sizing: border-box;
      background-color: #fffefe;
      font-family: Arial, sans-serif;
    }
  `;

  constructor() {
    super();
    this.userInfo = {};
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadUser();
  }

  loadUser() {
    const user = getUser();
    if (user) {
      this.userInfo = user;
    }
  }

  handlePersonalInfoUpdate(e) {
    toast.success('Profile updated successfully!');
    console.log('Updated personal info:', e.detail);
  }

  handleProfilePhotoUpload(e) {
    const file = e.detail.file;

    // Here you would typically upload the file to your storage service
    // For now, we'll just log it and show a toast
    console.log('Profile photo upload:', file);

    // Show loading state
    toast.info('Uploading profile photo...');

    // Simulate upload
    setTimeout(() => {
      toast.success('Profile photo updated successfully!');
      // You would update the photoURL in userInfo here
      // this.userInfo = { ...this.userInfo, photoURL: newPhotoURL };
    }, 1500);
  }

  handleChangeEmail(e) {
    toast.success(`Email change requested: ${e.detail.newEmail}`);
    console.log('Change email event:', e.detail);
  }

  handleChangePassword(e) {
    toast.success('Password change requested');
    console.log('Change password event:', e.detail);
  }

  handleAccountTermination(e) {
    toast.warning('Account termination action triggered');
    console.log('Account termination event:', e.type);
  }

  render() {
    return html`
      <settings-layout>
        <profile-header
          slot="one"
          .displayName=${this.userInfo.name || ''}
          .role=${this.userInfo.role || ''}
          .email=${this.userInfo.email || ''}
          .status=${this.userInfo.status || ''}
          .photoURL=${this.userInfo.profile_photo || ''}
          .joinedDate=${this.userInfo.created_at || ''}
          @profile-photo-upload=${this.handleProfilePhotoUpload}
        ></profile-header>

        <personal-info-form
          slot="three"
          .userInfo="${this.userInfo}"
          @personal-info-update="${this.handlePersonalInfoUpdate}">
        </personal-info-form>

        <manage-account-card
          slot="two"
          .userEmail=${this.userInfo.email || ''}
          @change-email="${this.handleChangeEmail}"
          @change-password="${this.handleChangePassword}"
          @deactivate-account="${this.handleAccountTermination}"
          @delete-account="${this.handleAccountTermination}">
        </manage-account-card>
      </settings-layout>
    `;
  }
}

customElements.define('app-settings', AppSettings);