import { apiRequest, cacheGet, cacheSet, cacheInvalidate, toQuery } from './api-core.js';

export const users = {
  async getAll(params = {}) {
    const key = `users:${JSON.stringify(params)}`;
    const cached = cacheGet(key);
    if (cached) return cached;
    const data = await apiRequest(`/users${toQuery(params)}`);
    cacheSet(key, data);
    return data;
  },

  async get(id) {
    return apiRequest(`/users/${id}`);
  },

  async create(userData) {
    const res = await apiRequest('/users', { method: 'POST', body: JSON.stringify(userData) });
    cacheInvalidate('users:');
    return res;
  },

  async update(id, userData) {
    const res = await apiRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(userData) });
    cacheInvalidate('users:');
    return res;
  },

  async delete(id) {
    const res = await apiRequest(`/users/${id}`, { method: 'DELETE' });
    cacheInvalidate('users:');
    return res;
  },
};
