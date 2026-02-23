import { apiRequest, cacheGet, cacheSet, cacheInvalidate, dedupedFetch, toQuery } from './api-core.js';

export const rooms = {
  async getAll(params = {}) {
    const key = `rooms:${JSON.stringify(params)}`;
    const cached = cacheGet(key);
    if (cached) return cached;
    const data = await dedupedFetch(key, () => apiRequest(`/rooms${toQuery(params)}`));
    cacheSet(key, data);
    return data;
  },

  async get(id) {
    return apiRequest(`/rooms/${id}`);
  },

  async create(roomData) {
    const res = await apiRequest('/rooms', { method: 'POST', body: JSON.stringify(roomData) });
    cacheInvalidate('rooms:');
    return res;
  },

  async update(id, roomData) {
    const res = await apiRequest(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(roomData) });
    cacheInvalidate('rooms:');
    return res;
  },

  async delete(id) {
    const res = await apiRequest(`/rooms/${id}`, { method: 'DELETE' });
    cacheInvalidate('rooms:');
    return res;
  },

  async uploadImage(roomId, file) {
    const formData = new FormData();
    formData.append('image', file);

    const res = await apiRequest(`/rooms/${roomId}/image`, {
      method: 'POST',
      body: formData,
    });

    cacheInvalidate('rooms:');
    return res;
  },

  async deleteImage(roomId) {
    const res = await apiRequest(`/rooms/${roomId}/image`, { method: 'DELETE' });
    cacheInvalidate('rooms:');
    return res;
  },
};
