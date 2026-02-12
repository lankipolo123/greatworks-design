import { apiRequest, cacheGet, cacheSet, toQuery } from './api-core.js';

export const activityLogs = {
  async getAll(params = {}) {
    const key = `logs:${JSON.stringify(params)}`;
    const cached = cacheGet(key);
    if (cached) return cached;
    const data = await apiRequest(`/activity-logs${toQuery(params)}`);
    cacheSet(key, data);
    return data;
  },

  async get(id) {
    return apiRequest(`/activity-logs/${id}`);
  },
};
