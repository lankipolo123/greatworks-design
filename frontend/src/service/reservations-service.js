import { apiRequest, cacheGet, cacheSet, cacheInvalidate, dedupedFetch, toQuery } from './api-core.js';

export const reservations = {
  async getAll(params = {}) {
    const key = `reservations:${JSON.stringify(params)}`;
    const cached = cacheGet(key);
    if (cached) return cached;
    const data = await dedupedFetch(key, () => apiRequest(`/reservations${toQuery(params)}`));
    cacheSet(key, data);
    return data;
  },

  async get(id) {
    return apiRequest(`/reservations/${id}`);
  },

  async create(reservationData) {
    const res = await apiRequest('/reservations', { method: 'POST', body: JSON.stringify(reservationData) });
    cacheInvalidate('reservations:');
    return res;
  },

  async update(id, reservationData) {
    const res = await apiRequest(`/reservations/${id}`, { method: 'PUT', body: JSON.stringify(reservationData) });
    cacheInvalidate('reservations:');
    return res;
  },

  async delete(id) {
    const res = await apiRequest(`/reservations/${id}`, { method: 'DELETE' });
    cacheInvalidate('reservations:');
    return res;
  },
};
