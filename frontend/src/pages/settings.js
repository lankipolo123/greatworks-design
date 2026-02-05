// app-settings.js
import { LitElement, html, css } from 'lit';
import '/src/layouts/settings-layout.js';
import '/src/components/profile-header.js';
import '/src/components/personal-info-form.js';
import '/src/components/manage-account-card.js';
import { toast } from '/src/service/toast-widget.js';

export class AppSettings extends LitElement {
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
          @profile-photo-upload=${this.handleProfilePhotoUpload}
        ></profile-header>

        <personal-info-form
          slot="three"
          .userInfo="${this.userInfo}"
          @personal-info-update="${this.handlePersonalInfoUpdate}">
        </personal-info-form>

        <manage-account-card
          slot="two"
          userEmail="admin@example.com"
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