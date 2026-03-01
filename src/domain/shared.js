// domain/_shared.js

/**
 * Shared, low-level domain helpers.
 * Keep this file generic (no Product/Cart-specific rules).
 */

/** Create a scoped invariant that prefixes errors consistently. */
export function makeInvariant(scope) {
  return (condition, message) => {
    if (!condition) throw new Error(`[${scope}] ${message}`);
  };
}

/** @param {unknown} v */
export function isPlainObject(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** @param {unknown} n */
export function isInt(n) {
  return typeof n === "number" && Number.isInteger(n);
}

/** @param {unknown} v @param {string} fallback */
export function toString(v, fallback = "") {
  return v == null ? fallback : String(v);
}

/** @param {unknown} v @param {number} fallback */
export function toNumber(v, fallback = NaN) {
  if (v == null) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/** Freeze an object (shallow). */
export function freeze(obj) {
  return Object.freeze(obj);
}

/** Freeze an array (and assumes elements are already frozen if needed). */
export function freezeArray(arr) {
  return Object.freeze(arr);
}

/**
 * App-wide currency policy.
 * If currency is truly domain-wide (Product + Cart), it belongs here.
 * Otherwise, move this back into each module.
 */
export const ALLOWED_CURRENCIES = new Set(["EUR", "USD", "GBP"]);
