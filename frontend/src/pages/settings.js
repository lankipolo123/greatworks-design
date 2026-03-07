// app-settings.js
import { LitElement, html, css } from 'lit';
import '/src/layouts/settings-layout.js';
import '/src/components/profile-header.js';
import '/src/components/personal-info-form.js';
import '/src/components/manage-account-card.js';
import { toast } from '/src/service/toast-widget.js';
import { auth, getUser, users } from '/src/service/api.js';
import { appState } from '/src/utility/app-state.js';

export class AppSettings extends LitElement {
  static properties = {
    userInfo: { type: Object },
    isUploadingPhoto: { type: Boolean },
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
    this.isUploadingPhoto = false;
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
      const payload = {};
      if (name) payload.name = name;
      payload.phone = data.contact || '';
      payload.address = data.address || '';

      const res = await auth.updateProfile(payload);
      const updated = res.user || { ...this.userInfo, ...payload };
      this.userInfo = { ...updated };
      localStorage.setItem('auth_user', JSON.stringify(this.userInfo));
      toast.success('Profile updated successfully!');
      setTimeout(() => appState.reload(), 500);
    } catch (err) {
      console.error('Profile update failed:', err);
      const msg = err.errors ? Object.values(err.errors)[0] : err.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg || 'Failed to update profile'));
    }
  }

  async handleProfilePhotoUpload(e) {
    const file = e.detail.file;

    if (!this.userInfo.id) {
      toast.error('User ID not found');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    this.isUploadingPhoto = true;
    toast.info('Uploading profile photo...');

    try {
      const res = await users.uploadProfilePhoto(this.userInfo.id, file);

      // Update user info with new photo URL
      this.userInfo = {
        ...this.userInfo,
        profile_photo: res.photo_url || res.user?.profile_photo,
      };

      // Update localStorage
      localStorage.setItem('auth_user', JSON.stringify(this.userInfo));

      toast.success('Profile photo updated successfully!');

      // Trigger a reload to update all components
      setTimeout(() => appState.reload(), 500);
    } catch (err) {
      console.error('Profile photo upload failed:', err);
      const msg = err.errors ? Object.values(err.errors)[0] : err.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg || 'Failed to upload profile photo'));
    } finally {
      this.isUploadingPhoto = false;
    }
  }

  async handleChangeEmail(e) {
    try {
      const res = await auth.changeEmail(e.detail.newEmail, e.detail.password);
      this.userInfo = res.user || { ...this.userInfo, email: e.detail.newEmail };
      localStorage.setItem('auth_user', JSON.stringify(this.userInfo));
      toast.success('Email updated successfully!');
      setTimeout(() => appState.reload(), 500);
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
      setTimeout(() => appState.reload(), 500);
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
          .isUploading=${this.isUploadingPhoto}
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
