/**
 * Core API utilities — shared by all service files.
 */

import { appState } from '/src/utility/app-state.js';

export const API_BASE_URL = 'http://localhost:8080/api';

// ─── Token / User helpers ──────────────────────────────────
export const getToken = () => localStorage.getItem('auth_token');

export const getUser = () => {
  const user = localStorage.getItem('auth_user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => !!getToken();

export const hasRole = (roles) => {
  const user = getUser();
  if (!user) return false;
  if (typeof roles === 'string') return user.role === roles;
  return roles.includes(user.role);
};

export const isAdmin = () => hasRole('admin');
export const isModerator = () => hasRole('moderator');
export const isCustomer = () => hasRole('customer');

// ─── Data Cache ────────────────────────────────────────────
const _cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

export function cacheGet(key) {
  const entry = _cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.time > CACHE_TTL) {
    _cache.delete(key);
    return null;
  }
  return entry.data;
}

export function cacheSet(key, data) {
  _cache.set(key, { data, time: Date.now() });
}

export function cacheInvalidate(prefix) {
  for (const key of _cache.keys()) {
    if (key.startsWith(prefix)) _cache.delete(key);
  }
  const resource = prefix.replace(':', '');
  appState.notify('data-changed', { resource });
}

export function cacheInvalidateAll() {
  _cache.clear();
}

// ─── API Request ───────────────────────────────────────────
export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  // Don't set Content-Type for FormData - browser will set it with boundary
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401 && endpoint !== '/login' && endpoint !== '/register') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.hash = 'login';
    }

    throw {
      status: response.status,
      message: data.message || 'An error occurred',
      errors: data.errors || {},
    };
  }

  return data;
};

// ─── Helper to build query string ─────────────────────────
export function toQuery(params) {
  if (!Object.keys(params).length) return '';
  return `?${new URLSearchParams(params)}`;
}
