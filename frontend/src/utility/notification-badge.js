// /src/utility/notification-badge.js
// Lightweight notification badge utility — renders a count bubble.
// Usage: notifBadge(count) returns a lit html template or empty string.

import { html } from 'lit';

/**
 * Returns a small red notification badge with a count.
 * Returns empty string when count is 0 or falsy.
 * @param {number} count
 * @param {'dot'|'count'} mode - 'dot' shows just a circle, 'count' shows the number
 */
export function notifBadge(count, mode = 'count') {
  if (!count || count <= 0) return '';

  if (mode === 'dot') {
    return html`<span style="
      position:absolute;top:4px;right:4px;
      width:8px;height:8px;
      background:#ef4444;border-radius:50%;
      border:2px solid #fff;
      box-sizing:content-box;
    "></span>`;
  }

  const display = count > 99 ? '99+' : count;
  return html`<span style="
    position:absolute;top:2px;right:2px;
    min-width:16px;height:16px;padding:0 4px;
    background:#ef4444;color:#fff;
    border-radius:10px;font-size:10px;font-weight:700;
    display:inline-flex;align-items:center;justify-content:center;
    border:2px solid #fff;box-sizing:content-box;
    line-height:1;letter-spacing:-0.02em;
  ">${display}</span>`;
}

/**
 * Inline badge for calendar days — smaller, no absolute positioning.
 * Sits next to existing booking-count badge.
 */
export function notifBadgeInline(count) {
  if (!count || count <= 0) return '';
  const display = count > 99 ? '99+' : count;
  return html`<span style="
    min-width:14px;height:14px;padding:0 3px;
    background:#ef4444;color:#fff;
    border-radius:7px;font-size:9px;font-weight:700;
    display:inline-flex;align-items:center;justify-content:center;
    line-height:1;margin-left:2px;
  ">${display}</span>`;
}
