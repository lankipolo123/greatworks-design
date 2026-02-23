import { apiRequest, cacheGet, cacheSet, cacheInvalidate, cacheInvalidateAll } from './api-core.js';

export const auth = {
  async login(email, password) {
    const data = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // If 2FA is required, return early without storing token
    if (data.two_factor_required) {
      return data;
    }

    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    return data;
  },

  async verify2FA(userId, code, twoFactorToken) {
    const data = await apiRequest('/2fa/verify', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, code, two_factor_token: twoFactorToken }),
    });
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    return data;
  },

  async register({ first_name, last_name, email, password, password_confirmation, phone = null, address = null }) {
    const data = await apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify({ first_name, last_name, email, password, password_confirmation, phone, address }),
    });
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    return data;
  },

  async logout() {
    try {
      await apiRequest('/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      cacheInvalidateAll();
    }
  },

  async getUser() {
    const key = 'auth-user';
    const cached = cacheGet(key);
    if (cached) return cached;
    const data = await apiRequest('/user');
    localStorage.setItem('auth_user', JSON.stringify(data));
    cacheSet(key, data);
    return data;
  },

  async updateProfile(profileData) {
    const res = await apiRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    cacheInvalidate('auth-user');
    if (res.user) {
      localStorage.setItem('auth_user', JSON.stringify(res.user));
    }
    return res;
  },

  async changePassword(currentPassword, newPassword, newPasswordConfirmation) {
    return apiRequest('/change-password', {
      method: 'PUT',
      body: JSON.stringify({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPasswordConfirmation,
      }),
    });
  },

  async changeEmail(newEmail, password) {
    const data = await apiRequest('/change-email', {
      method: 'PUT',
      body: JSON.stringify({ email: newEmail, password }),
    });
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    cacheInvalidate('auth-user');
    return data;
  },

  async deactivateAccount(password) {
    const data = await apiRequest('/deactivate-account', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    return data;
  },

  async deleteAccount(password) {
    const data = await apiRequest('/delete-account', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    return data;
  },

  // ─── Two-Factor Authentication ──────────────────────────
  async get2FAStatus() {
    return apiRequest('/2fa/status');
  },

  async setup2FA() {
    return apiRequest('/2fa/setup', { method: 'POST' });
  },

  async verifySetup2FA(code) {
    return apiRequest('/2fa/verify-setup', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  async disable2FA(password) {
    return apiRequest('/2fa/disable', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  },

  async regenerateBackupCodes(password) {
    return apiRequest('/2fa/backup-codes', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  },
};
