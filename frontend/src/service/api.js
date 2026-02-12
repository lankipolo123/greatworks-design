/**
 * API Service barrel — re-exports from individual service files.
 * Import directly from the specific service when possible:
 *   import { auth } from '/src/service/auth-service.js';
 *   import { bookings } from '/src/service/bookings-service.js';
 */

export { API_BASE_URL, getToken, getUser, isAuthenticated, hasRole, isAdmin, isModerator, isCustomer, apiRequest, cacheInvalidate as invalidateCache, cacheInvalidateAll as invalidateAllCache } from './api-core.js';
export { auth } from './auth-service.js';
export { rooms } from './rooms-service.js';
export { bookings } from './bookings-service.js';
export { reservations } from './reservations-service.js';
export { tickets } from './tickets-service.js';
export { payments } from './payments-service.js';
export { users } from './users-service.js';
export { activityLogs } from './activity-logs-service.js';
