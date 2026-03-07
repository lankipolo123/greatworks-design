import { apiRequest } from './api-core.js';

export const systemSettings = {
  async getAll() {
    return apiRequest('/system-settings');
  },

  async get(key) {
    return apiRequest(`/system-settings/${key}`);
  },

  async update(key, value) {
    return apiRequest('/system-settings', {
      method: 'PUT',
      body: JSON.stringify({ key, value }),
    });
  },
};
