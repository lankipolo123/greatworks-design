import { apiRequest, cacheGet, cacheSet, cacheInvalidate, cacheInvalidateAll } from './api-core.js';

export const auth = {
  async login(email, password) {
    const data = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
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
};
