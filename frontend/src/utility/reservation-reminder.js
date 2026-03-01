// /src/utility/reservation-reminder.js
// Checks if a booking is happening soon (within N minutes).
// Used to show a reminder badge on booking cards and enable attendance actions.

/**
 * Check if a booking is starting within `thresholdMinutes` from now.
 * Only returns true for confirmed bookings on today's date.
 * @param {Object} booking - { date, time, startTime, status }
 * @param {number} thresholdMinutes - default 30
 * @returns {'upcoming'|'now'|null}
 */
export function getBookingUrgency(booking, thresholdMinutes = 30) {
  if (!booking) return null;

  const status = booking.status?.toLowerCase();
  // Only remind for confirmed/pending bookings
  if (!['confirmed', 'pending'].includes(status)) return null;

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  // Must be today
  if (booking.date !== todayStr) return null;

  const time = booking.startTime || booking.time;
  if (!time) return null;

  const [hours, minutes] = time.split(':').map(Number);
  const bookingTime = new Date(today);
  bookingTime.setHours(hours, minutes, 0, 0);

  const diffMs = bookingTime - today;
  const diffMin = diffMs / 60_000;

  // Already started (within the last hour) — "now"
  if (diffMin >= -60 && diffMin <= 0) return 'now';

  // Starting within threshold — "upcoming"
  if (diffMin > 0 && diffMin <= thresholdMinutes) return 'upcoming';

  return null;
}

/**
 * Returns a human-readable time remaining string for a booking.
 * e.g. "25 min", "1 min", "Started 10 min ago"
 * Returns null if not today or not applicable.
 */
export function getTimeRemaining(booking) {
  if (!booking) return null;

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  if (booking.date !== todayStr) return null;

  const time = booking.startTime || booking.time;
  if (!time) return null;

  const [hours, minutes] = time.split(':').map(Number);
  const bookingTime = new Date(today);
  bookingTime.setHours(hours, minutes, 0, 0);

  const diffMs = bookingTime - today;
  const diffMin = Math.round(diffMs / 60_000);

  if (diffMin > 0) return `Starts in ${diffMin} min`;
  if (diffMin === 0) return 'Starting now';
  if (diffMin >= -60) return `Started ${Math.abs(diffMin)} min ago`;
  return null;
}

/**
 * Returns a count of bookings that are upcoming/now from a list.
 */
export function countUpcomingBookings(bookings, thresholdMinutes = 30) {
  let count = 0;
  for (const b of bookings) {
    if (getBookingUrgency(b, thresholdMinutes)) count++;
  }
  return count;
}
