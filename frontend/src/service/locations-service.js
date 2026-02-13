import { apiRequest, cacheGet, cacheSet, cacheInvalidate, toQuery } from './api-core.js';

export const locations = {
  async getAll(params = {}) {
    const key = `locations:${JSON.stringify(params)}`;
    const cached = cacheGet(key);
    if (cached) return cached;
    const data = await apiRequest(`/locations${toQuery(params)}`);
    cacheSet(key, data);
    return data;
  },

  async get(id) {
    return apiRequest(`/locations/${id}`);
  },

  async create(locationData) {
    const res = await apiRequest('/locations', { method: 'POST', body: JSON.stringify(locationData) });
    cacheInvalidate('locations:');
    return res;
  },

  async update(id, locationData) {
    const res = await apiRequest(`/locations/${id}`, { method: 'PUT', body: JSON.stringify(locationData) });
    cacheInvalidate('locations:');
    return res;
  },

  async delete(id) {
    const res = await apiRequest(`/locations/${id}`, { method: 'DELETE' });
    cacheInvalidate('locations:');
    return res;
  },

  async uploadImage(locationId, file) {
    const formData = new FormData();
    formData.append('image', file);

    const res = await apiRequest(`/locations/${locationId}/image`, {
      method: 'POST',
      body: formData,
    });

    cacheInvalidate('locations:');
    return res;
  },

  async deleteImage(locationId) {
    const res = await apiRequest(`/locations/${locationId}/image`, { method: 'DELETE' });
    cacheInvalidate('locations:');
    return res;
  },
};
