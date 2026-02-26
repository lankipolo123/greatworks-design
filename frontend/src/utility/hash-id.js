// src/utility/hash-id.js

/**
 * Generate a short hashed display ID from a numeric ID.
 * Uses a simple deterministic hash to produce a 6-char hex string.
 * @param {string} prefix - Entity prefix (e.g. 'RES', 'TKT', 'PAY', 'USR')
 * @param {number|string} id - The raw numeric ID
 * @returns {string} e.g. "RES-A1B2C3"
 */
export function hashId(prefix, id) {
  const num = Number(id);
  // Simple deterministic hash: multiply by a large prime, XOR shift, then take 6 hex chars
  let h = ((num * 2654435761) >>> 0); // Knuth multiplicative hash
  h = ((h ^ (h >> 16)) >>> 0);
  const hex = h.toString(16).toUpperCase().padStart(6, '0').slice(0, 6);
  return `${prefix}-${hex}`;
}
