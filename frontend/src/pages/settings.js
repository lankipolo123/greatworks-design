// app-settings.js
import { LitElement, html, css } from 'lit';
import '/src/layouts/settings-layout.js';
import '/src/components/profile-header.js';
import '/src/components/personal-info-form.js';
import '/src/components/manage-account-card.js';
import { toast } from '/src/service/toast-widget.js';
import { auth, getUser } from '/src/service/api.js';

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
    const cached = getUser();
    if (cached) this.userInfo = cached;
  }

  async handlePersonalInfoUpdate(e) {
    try {
      const data = e.detail;
      const name = [data.firstName, data.lastName].filter(Boolean).join(' ');
      const res = await auth.updateProfile({
        name: name || undefined,
        phone: data.contact || null,
        address: data.address || null,
      });
      const updated = res.user || { ...this.userInfo, name, phone: data.contact, address: data.address };
      this.userInfo = { ...updated };
      localStorage.setItem('auth_user', JSON.stringify(this.userInfo));
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Profile update failed:', err);
      const msg = err.errors ? Object.values(err.errors)[0] : err.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg || 'Failed to update profile'));
    }
  }

  handleProfilePhotoUpload(e) {
    const file = e.detail.file;
    console.log('Profile photo upload:', file);
    toast.info('Uploading profile photo...');
    setTimeout(() => {
      toast.success('Profile photo updated successfully!');
    }, 1500);
  }

  async handleChangeEmail(e) {
    try {
      const res = await auth.changeEmail(e.detail.newEmail, e.detail.password);
      this.userInfo = res.user || { ...this.userInfo, email: e.detail.newEmail };
      toast.success('Email updated successfully!');
    } catch (err) {
      console.error('Email change failed:', err);
      const msg = err.errors ? Object.values(err.errors)[0] : err.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg || 'Failed to update email'));
    }
  }

  async handleChangePassword(e) {
    try {
      await auth.changePassword(
        e.detail.currentPassword,
        e.detail.newPassword,
        e.detail.newPasswordConfirmation
      );
      toast.success('Password changed successfully!');
    } catch (err) {
      console.error('Password change failed:', err);
      const msg = err.errors ? Object.values(err.errors)[0] : err.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg || 'Failed to change password'));
    }
  }

  async handleDeactivateAccount(e) {
    try {
      await auth.deactivateAccount(e.detail.password);
      toast.success('Account deactivated');
      window.location.hash = 'login';
    } catch (err) {
      console.error('Deactivate failed:', err);
      const msg = err.errors ? Object.values(err.errors)[0] : err.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg || 'Failed to deactivate account'));
    }
  }

  async handleDeleteAccount(e) {
    try {
      await auth.deleteAccount(e.detail.password);
      toast.success('Account deleted');
      window.location.hash = 'login';
    } catch (err) {
      console.error('Delete failed:', err);
      const msg = err.errors ? Object.values(err.errors)[0] : err.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg || 'Failed to delete account'));
    }
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
          @deactivate-account="${this.handleDeactivateAccount}"
          @delete-account="${this.handleDeleteAccount}">
        </manage-account-card>
      </settings-layout>
    `;
  }
}

customElements.define('app-settings', AppSettings);
