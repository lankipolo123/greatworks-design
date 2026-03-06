// /src/utility/notification-tracker.js
// Tracks "last seen" timestamps per module in localStorage.
// Used to calculate "new" item counts for notification badges.

import { activityLogs } from '/src/service/activity-logs-service.js';
import { appState } from '/src/utility/app-state.js';
import { getUser } from '/src/service/api-core.js';

const STORAGE_KEY = 'notif_last_seen';

/** Read stored timestamps object */
function _getStored() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch { return {}; }
}

/** Write timestamps object */
function _setStored(obj) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

/**
 * Mark a module as "seen" right now. Call this when a user navigates to a page.
 * @param {'booking'|'reservation'|'ticket'} module
 */
export function markSeen(module) {
  const stored = _getStored();
  stored[module] = new Date().toISOString();
  _setStored(stored);
  appState.notify('notifications-changed');
}

/**
 * Get the last-seen timestamp for a module.
 * Returns null if never seen (meaning everything is "new").
 * @param {'booking'|'reservation'|'ticket'} module
 */
export function getLastSeen(module) {
  return _getStored()[module] || null;
}

// --- In-memory cache for badge counts ---
let _counts = { booking: 0, reservation: 0, ticket: 0, user: 0, payment: 0, logs: 0 };
let _fetching = false;
let _lastFetch = 0;
const FETCH_INTERVAL = 30_000; // 30s cache

/**
 * Fetch activity logs and compute how many new items exist per module
 * since the user last visited that page. Excludes own actions.
 */
export async function fetchNotificationCounts() {
  const now = Date.now();
  if (_fetching || (now - _lastFetch) < FETCH_INTERVAL) return _counts;
  _fetching = true;

  try {
    const data = await activityLogs.getAll({ per_page: 100 });
    const logs = data.data || data || [];
    const user = getUser();
    const userId = user?.id;

    const newCounts = { booking: 0, reservation: 0, ticket: 0, user: 0, payment: 0, logs: 0 };

    for (const log of logs) {
      // Skip own actions
      if (log.user_id === userId || log.user?.id === userId) continue;

      // Only count meaningful actions
      if (!['created', 'deleted', 'status_changed', 'activated'].includes(log.action)) continue;

      const mod = (log.module || '').toLowerCase();
      let key = null;
      if (mod === 'booking' || mod === 'bookings') key = 'booking';
      else if (mod === 'reservation' || mod === 'reservations') key = 'reservation';
      else if (mod === 'ticket' || mod === 'tickets') key = 'ticket';
      else if (mod === 'user' || mod === 'users') key = 'user';
      else if (mod === 'payment' || mod === 'payments') key = 'payment';

      // Count towards logs badge (all modules)
      const logsLastSeen = getLastSeen('logs');
      if (!logsLastSeen || new Date(log.created_at) > new Date(logsLastSeen)) {
        newCounts.logs++;
      }

      if (!key) continue;

      const lastSeen = getLastSeen(key);
      if (!lastSeen || new Date(log.created_at) > new Date(lastSeen)) {
        newCounts[key]++;
      }
    }

    _counts = newCounts;
    _lastFetch = now;
  } catch (e) {
    console.error('[notification-tracker] fetch failed:', e);
  } finally {
    _fetching = false;
  }

  return _counts;
}

/**
 * Get cached counts (synchronous). Call fetchNotificationCounts() first.
 */
export function getNotificationCounts() {
  return { ..._counts };
}

/**
 * Force a fresh refetch next time.
 */
export function invalidateNotificationCache() {
  _lastFetch = 0;
}
