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

  async register(name, email, password, password_confirmation, phone = null) {
    const data = await apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, password_confirmation, phone }),
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
    }
  },

  async getUser() {
    const data = await apiRequest('/user');
    localStorage.setItem('auth_user', JSON.stringify(data));
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
};

// Rooms API
const rooms = {
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/rooms${query ? `?${query}` : ''}`);
  },

  async get(id) {
    return apiRequest(`/rooms/${id}`);
  },

  async create(roomData) {
    return apiRequest('/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  },

  async update(id, roomData) {
    return apiRequest(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roomData),
    });
  },

  async delete(id) {
    return apiRequest(`/rooms/${id}`, { method: 'DELETE' });
  },
};

// Bookings API
const bookings = {
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/bookings${query ? `?${query}` : ''}`);
  },

  async get(id) {
    return apiRequest(`/bookings/${id}`);
  },

  async create(bookingData) {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  async update(id, bookingData) {
    return apiRequest(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
  },

  async delete(id) {
    return apiRequest(`/bookings/${id}`, { method: 'DELETE' });
  },

  async getCalendar(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/bookings/calendar${query ? `?${query}` : ''}`);
  },
};

// Reservations API
const reservations = {
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/reservations${query ? `?${query}` : ''}`);
  },

  async get(id) {
    return apiRequest(`/reservations/${id}`);
  },

  async create(reservationData) {
    return apiRequest('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
  },

  async update(id, reservationData) {
    return apiRequest(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reservationData),
    });
  },

  async delete(id) {
    return apiRequest(`/reservations/${id}`, { method: 'DELETE' });
  },
};

// Tickets API
const tickets = {
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/tickets${query ? `?${query}` : ''}`);
  },

  async get(id) {
    return apiRequest(`/tickets/${id}`);
  },

  async create(ticketData) {
    return apiRequest('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  },

  async update(id, ticketData) {
    return apiRequest(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ticketData),
    });
  },

  async delete(id) {
    return apiRequest(`/tickets/${id}`, { method: 'DELETE' });
  },
};

// Payments API
const payments = {
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/payments${query ? `?${query}` : ''}`);
  },

  async get(id) {
    return apiRequest(`/payments/${id}`);
  },

  async create(paymentData) {
    return apiRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  async update(id, paymentData) {
    return apiRequest(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    });
  },

  async delete(id) {
    return apiRequest(`/payments/${id}`, { method: 'DELETE' });
  },
};

// Users API (Admin only)
const users = {
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/users${query ? `?${query}` : ''}`);
  },

  async get(id) {
    return apiRequest(`/users/${id}`);
  },

  async create(userData) {
    return apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async update(id, userData) {
    return apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  async delete(id) {
    return apiRequest(`/users/${id}`, { method: 'DELETE' });
  },
};

// Activity Logs API (Admin only)
const activityLogs = {
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/activity-logs${query ? `?${query}` : ''}`);
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
};
