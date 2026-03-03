// /src/utility/urgency-tracker.js
// Fetches today's bookings & reservations and counts how many need admin attention.
// Used alongside notification-tracker.js for sidebar urgency badges.

import { bookings, reservations } from '/src/service/api.js';
import { countNeedingAttention } from '/src/utility/reservation-reminder.js';

let _urgencyCounts = { booking: 0, reservation: 0 };
let _fetching = false;
let _lastFetch = 0;
const FETCH_INTERVAL = 30_000; // 30s cache

/**
 * Fetch today's bookings and reservations and count how many need attention.
 * A booking/reservation needs attention when its time has arrived (or is
 * approaching within 30 min) and the admin hasn't changed its status yet.
 */
export async function fetchUrgencyCounts() {
  const now = Date.now();
  if (_fetching || (now - _lastFetch) < FETCH_INTERVAL) return _urgencyCounts;
  _fetching = true;

  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    const params = { date: todayStr, per_page: 200 };

    const [bookingData, reservationData] = await Promise.all([
      bookings.getAll(params),
      reservations.getAll(params),
    ]);

    const bookingList = bookingData?.data || bookingData || [];
    const reservationList = reservationData?.data || reservationData || [];

    _urgencyCounts = {
      booking: countNeedingAttention(bookingList),
      reservation: countNeedingAttention(reservationList),
    };

    _lastFetch = now;
  } catch (e) {
    console.error('[urgency-tracker] fetch failed:', e);
  } finally {
    _fetching = false;
  }

  return _urgencyCounts;
}

/**
 * Get cached urgency counts (synchronous).
 */
export function getUrgencyCounts() {
  return { ..._urgencyCounts };
}

/**
 * Force a fresh refetch next time.
 */
export function invalidateUrgencyCache() {
  _lastFetch = 0;
}
