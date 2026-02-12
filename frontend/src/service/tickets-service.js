import { apiRequest, cacheGet, cacheSet, cacheInvalidate, toQuery } from './api-core.js';

export const tickets = {
  async getAll(params = {}) {
    const key = `tickets:${JSON.stringify(params)}`;
    const cached = cacheGet(key);
    if (cached) return cached;
    const data = await apiRequest(`/tickets${toQuery(params)}`);
    cacheSet(key, data);
    return data;
  },

  async get(id) {
    return apiRequest(`/tickets/${id}`);
  },

  async create(ticketData) {
    const res = await apiRequest('/tickets', { method: 'POST', body: JSON.stringify(ticketData) });
    cacheInvalidate('tickets:');
    return res;
  },

  async update(id, ticketData) {
    const res = await apiRequest(`/tickets/${id}`, { method: 'PUT', body: JSON.stringify(ticketData) });
    cacheInvalidate('tickets:');
    return res;
  },

  async delete(id) {
    const res = await apiRequest(`/tickets/${id}`, { method: 'DELETE' });
    cacheInvalidate('tickets:');
    return res;
  },
};
