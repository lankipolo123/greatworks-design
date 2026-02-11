/**
 * API Service for connecting to Laravel Backend
 */

const API_BASE_URL = 'http://localhost:8080/api';

// Get stored token
const getToken = () => localStorage.getItem('auth_token');

// Get stored user
const getUser = () => {
  const user = localStorage.getItem('auth_user');
  return user ? JSON.parse(user) : null;
};

// Check if user is authenticated
const isAuthenticated = () => !!getToken();

// Check user role
const hasRole = (roles) => {
  const user = getUser();
  if (!user) return false;
  if (typeof roles === 'string') return user.role === roles;
  return roles.includes(user.role);
};

const isAdmin = () => hasRole('admin');
const isModerator = () => hasRole('moderator');
const isCustomer = () => hasRole('customer');

// ─── Data Cache ─────────────────────────────────────────────
// Caches GET responses so switching tabs doesn't re-fetch.
// Write operations (create/update/delete) invalidate the relevant cache.
const _cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function _cacheGet(key) {
  const entry = _cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.time > CACHE_TTL) {
    _cache.delete(key);
    return null;
  }
  return entry.data;
}

function _cacheSet(key, data) {
  _cache.set(key, { data, time: Date.now() });
}

function _cacheInvalidate(prefix) {
  for (const key of _cache.keys()) {
    if (key.startsWith(prefix)) _cache.delete(key);
  }
}

function _cacheInvalidateAll() {
  _cache.clear();
}

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
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
    // Auto-logout on 401 (expired/invalid token)
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

// Auth API
const auth = {
  async login(email, password) {
    const data = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));

    return data;
  },

  async register({ first_name, last_name, email, password, password_confirmation, phone = null, address = null }) {
    const data = await apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify({ first_name, last_name, email, password, password_confirmation, phone, address }),
    });

    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));

    return data;
  },

  async logout() {
    try {
      await apiRequest('/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      _cacheInvalidateAll();
    }
  },

  async getUser() {
    const key = 'auth-user';
    const cached = _cacheGet(key);
    if (cached) return cached;
    const data = await apiRequest('/user');
    localStorage.setItem('auth_user', JSON.stringify(data));
    _cacheSet(key, data);
    return data;
  },

  async updateProfile(profileData) {
    return apiRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  async changePassword(currentPassword, newPassword, newPasswordConfirmation) {
    return apiRequest('/change-password', {
      method: 'PUT',
      body: JSON.stringify({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPasswordConfirmation,
      }),
    });
  },

  async changeEmail(newEmail, password) {
    const data = await apiRequest('/change-email', {
      method: 'PUT',
      body: JSON.stringify({ email: newEmail, password }),
    });
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    return data;
  },

  async deactivateAccount(password) {
    const data = await apiRequest('/deactivate-account', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    return data;
  },

  async deleteAccount(password) {
    const data = await apiRequest('/delete-account', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    return data;
  },
};

// Rooms API
const rooms = {
  async getAll(params = {}) {
    const key = `rooms:${JSON.stringify(params)}`;
    const cached = _cacheGet(key);
    if (cached) return cached;
    const data = await apiRequest(`/rooms${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''}`);
    _cacheSet(key, data);
    return data;
  },

  async get(id) {
    return apiRequest(`/rooms/${id}`);
  },

  async create(roomData) {
    const res = await apiRequest('/rooms', { method: 'POST', body: JSON.stringify(roomData) });
    _cacheInvalidate('rooms:');
    return res;
  },

  async update(id, roomData) {
    const res = await apiRequest(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(roomData) });
    _cacheInvalidate('rooms:');
    return res;
  },

  async delete(id) {
    const res = await apiRequest(`/rooms/${id}`, { method: 'DELETE' });
    _cacheInvalidate('rooms:');
    return res;
  },
};

// Bookings API
const bookings = {
  async getAll(params = {}) {
    const key = `bookings:${JSON.stringify(params)}`;
    const cached = _cacheGet(key);
    if (cached) return cached;
    const data = await apiRequest(`/bookings${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''}`);
    _cacheSet(key, data);
    return data;
  },

  async get(id) {
    return apiRequest(`/bookings/${id}`);
  },

  async create(bookingData) {
    const res = await apiRequest('/bookings', { method: 'POST', body: JSON.stringify(bookingData) });
    _cacheInvalidate('bookings:');
    return res;
  },

  async update(id, bookingData) {
    const res = await apiRequest(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(bookingData) });
    _cacheInvalidate('bookings:');
    return res;
  },

  async delete(id) {
    const res = await apiRequest(`/bookings/${id}`, { method: 'DELETE' });
    _cacheInvalidate('bookings:');
    return res;
  },

  async getCalendar(params = {}) {
    const key = `bookings-cal:${JSON.stringify(params)}`;
    const cached = _cacheGet(key);
    if (cached) return cached;
    const data = await apiRequest(`/bookings/calendar${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''}`);
    _cacheSet(key, data);
    return data;
  },

  async getAvailability(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/bookings/availability${query ? `?${query}` : ''}`);
  },
};

// Reservations API
const reservations = {
  async getAll(params = {}) {
    const key = `reservations:${JSON.stringify(params)}`;
    const cached = _cacheGet(key);
    if (cached) return cached;
    const data = await apiRequest(`/reservations${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''}`);
    _cacheSet(key, data);
    return data;
  },

  async get(id) {
    return apiRequest(`/reservations/${id}`);
  },

  async create(reservationData) {
    const res = await apiRequest('/reservations', { method: 'POST', body: JSON.stringify(reservationData) });
    _cacheInvalidate('reservations:');
    return res;
  },

  async update(id, reservationData) {
    const res = await apiRequest(`/reservations/${id}`, { method: 'PUT', body: JSON.stringify(reservationData) });
    _cacheInvalidate('reservations:');
    return res;
  },

  async delete(id) {
    const res = await apiRequest(`/reservations/${id}`, { method: 'DELETE' });
    _cacheInvalidate('reservations:');
    return res;
  },
};

// Tickets API
const tickets = {
  async getAll(params = {}) {
    const key = `tickets:${JSON.stringify(params)}`;
    const cached = _cacheGet(key);
    if (cached) return cached;
    const data = await apiRequest(`/tickets${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''}`);
    _cacheSet(key, data);
    return data;
  },

  async get(id) {
    return apiRequest(`/tickets/${id}`);
  },

  async create(ticketData) {
    const res = await apiRequest('/tickets', { method: 'POST', body: JSON.stringify(ticketData) });
    _cacheInvalidate('tickets:');
    return res;
  },

  async update(id, ticketData) {
    const res = await apiRequest(`/tickets/${id}`, { method: 'PUT', body: JSON.stringify(ticketData) });
    _cacheInvalidate('tickets:');
    return res;
  },

  async delete(id) {
    const res = await apiRequest(`/tickets/${id}`, { method: 'DELETE' });
    _cacheInvalidate('tickets:');
    return res;
  },
};

// Payments API
const payments = {
  async getAll(params = {}) {
    const key = `payments:${JSON.stringify(params)}`;
    const cached = _cacheGet(key);
    if (cached) return cached;
    const data = await apiRequest(`/payments${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''}`);
    _cacheSet(key, data);
    return data;
  },

  async get(id) {
    return apiRequest(`/payments/${id}`);
  },

  async create(paymentData) {
    const res = await apiRequest('/payments', { method: 'POST', body: JSON.stringify(paymentData) });
    _cacheInvalidate('payments:');
    return res;
  },

  async update(id, paymentData) {
    const res = await apiRequest(`/payments/${id}`, { method: 'PUT', body: JSON.stringify(paymentData) });
    _cacheInvalidate('payments:');
    return res;
  },

  async delete(id) {
    const res = await apiRequest(`/payments/${id}`, { method: 'DELETE' });
    _cacheInvalidate('payments:');
    return res;
  },
};

// Users API (Admin only)
const users = {
  async getAll(params = {}) {
    const key = `users:${JSON.stringify(params)}`;
    const cached = _cacheGet(key);
    if (cached) return cached;
    const data = await apiRequest(`/users${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''}`);
    _cacheSet(key, data);
    return data;
  },

  async get(id) {
    return apiRequest(`/users/${id}`);
  },

  async create(userData) {
    const res = await apiRequest('/users', { method: 'POST', body: JSON.stringify(userData) });
    _cacheInvalidate('users:');
    return res;
  },

  async update(id, userData) {
    const res = await apiRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(userData) });
    _cacheInvalidate('users:');
    return res;
  },

  async delete(id) {
    const res = await apiRequest(`/users/${id}`, { method: 'DELETE' });
    _cacheInvalidate('users:');
    return res;
  },
};

// Activity Logs API (Admin only)
const activityLogs = {
  async getAll(params = {}) {
    const key = `logs:${JSON.stringify(params)}`;
    const cached = _cacheGet(key);
    if (cached) return cached;
    const data = await apiRequest(`/activity-logs${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''}`);
    _cacheSet(key, data);
    return data;
  },

  async get(id) {
    return apiRequest(`/activity-logs/${id}`);
  },
};

export {
  API_BASE_URL,
  getToken,
  getUser,
  isAuthenticated,
  hasRole,
  isAdmin,
  isModerator,
  isCustomer,
  apiRequest,
  auth,
  rooms,
  bookings,
  reservations,
  tickets,
  payments,
  users,
  activityLogs,
  _cacheInvalidate as invalidateCache,
  _cacheInvalidateAll as invalidateAllCache,
};
