import { apiRequest, cacheGet, cacheSet, cacheInvalidate, toQuery } from './api-core.js';

export const bookings = {
  async getAll(params = {}) {
    const key = `bookings:${JSON.stringify(params)}`;
    const cached = cacheGet(key);
    if (cached) return cached;
    const data = await apiRequest(`/bookings${toQuery(params)}`);
    cacheSet(key, data);
    return data;
  },

  async get(id) {
    return apiRequest(`/bookings/${id}`);
  },

  async create(bookingData) {
    const res = await apiRequest('/bookings', { method: 'POST', body: JSON.stringify(bookingData) });
    cacheInvalidate('bookings:');
    return res;
  },

  async update(id, bookingData) {
    const res = await apiRequest(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(bookingData) });
    cacheInvalidate('bookings:');
    return res;
  },

  async delete(id) {
    const res = await apiRequest(`/bookings/${id}`, { method: 'DELETE' });
    cacheInvalidate('bookings:');
    return res;
  },

  async getCalendar(params = {}) {
    const key = `bookings-cal:${JSON.stringify(params)}`;
    const cached = cacheGet(key);
    if (cached) return cached;
    const data = await apiRequest(`/bookings/calendar${toQuery(params)}`);
    cacheSet(key, data);
    return data;
  },

  async getAvailability(params = {}) {
    return apiRequest(`/bookings/availability${toQuery(params)}`);
  },
};
