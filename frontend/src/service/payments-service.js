import { apiRequest, cacheGet, cacheSet, cacheInvalidate, toQuery } from './api-core.js';

export const payments = {
  async getAll(params = {}) {
    const key = `payments:${JSON.stringify(params)}`;
    const cached = cacheGet(key);
    if (cached) return cached;
    const data = await apiRequest(`/payments${toQuery(params)}`);
    cacheSet(key, data);
    return data;
  },

  async get(id) {
    return apiRequest(`/payments/${id}`);
  },

  async create(paymentData) {
    const res = await apiRequest('/payments', { method: 'POST', body: JSON.stringify(paymentData) });
    cacheInvalidate('payments:');
    return res;
  },

  async update(id, paymentData) {
    const res = await apiRequest(`/payments/${id}`, { method: 'PUT', body: JSON.stringify(paymentData) });
    cacheInvalidate('payments:');
    return res;
  },

  async delete(id) {
    const res = await apiRequest(`/payments/${id}`, { method: 'DELETE' });
    cacheInvalidate('payments:');
    return res;
  },
};
