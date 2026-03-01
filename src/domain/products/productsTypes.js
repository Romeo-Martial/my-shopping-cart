// domain/product.types.js

import {
  makeInvariant,
  isPlainObject,
  isInt,
  toString,
  toNumber,
  freeze,
  ALLOWED_CURRENCIES,
} from "../shared.js";

/**
 * @typedef {"EUR"|"USD"|"GBP"} Currency
 */

/**
 * Canonical Product shape used throughout the app.
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {number} priceCents        // integer >= 0
 * @property {Currency} currency
 * @property {boolean} inStock
 * @property {string|null} imageUrl
 * @property {string[]} tags
 */

const invariant = makeInvariant("ProductContract");

/**
 * Normalize raw input into a valid Product.
 * Use at boundaries (API -> domain, storage -> domain, etc.).
 *
 * @param {unknown} raw
 * @returns {Product}
 */
export function makeProduct(raw) {
  invariant(isPlainObject(raw), "Expected an object");

  const id = toString(raw.id ?? raw.productId);
  const name = toString(raw.name ?? raw.title);
  const currency = toString(raw.currency, "EUR");
  const inStock = Boolean(raw.inStock ?? raw.in_stock ?? true);

  // cents preferred; otherwise convert major units to cents
  let priceCents;
  if (raw.priceCents != null || raw.price_cents != null) {
    priceCents = toNumber(raw.priceCents ?? raw.price_cents);
  } else if (raw.price != null) {
    priceCents = Math.round(toNumber(raw.price) * 100);
  } else {
    priceCents = NaN;
  }

  const rawImage = raw.imageUrl ?? raw.image_url;
  const imageUrl =
    rawImage == null || rawImage === "" ? null : toString(rawImage);

  const tagsRaw = raw.tags ?? [];
  const tags = Array.isArray(tagsRaw) ? tagsRaw.map(toString) : [];

  // Invariants
  invariant(id.trim().length > 0, "id is required");
  invariant(name.trim().length > 0, "name is required");
  invariant(isInt(priceCents), "priceCents must be an integer");
  invariant(priceCents >= 0, "priceCents must be >= 0");
  invariant(
    ALLOWED_CURRENCIES.has(currency),
    `Unsupported currency: ${currency}`,
  );

  /** @type {Product} */
  const product = { id, name, priceCents, currency, inStock, imageUrl, tags };

  return freeze(product);
}

/**
 * Internal runtime check (useful in reducers / critical paths).
 *
 * @param {unknown} value
 * @returns {asserts value is Product}
 */
export function assertProduct(value) {
  invariant(isPlainObject(value), "Expected object Product");
  invariant(
    typeof value.id === "string" && value.id.trim() !== "",
    "Invalid id",
  );
  invariant(
    typeof value.name === "string" && value.name.trim() !== "",
    "Invalid name",
  );
  invariant(
    isInt(value.priceCents) && value.priceCents >= 0,
    "Invalid priceCents",
  );
  invariant(ALLOWED_CURRENCIES.has(value.currency), "Invalid currency");
  invariant(typeof value.inStock === "boolean", "Invalid inStock");
  invariant(
    value.imageUrl === null || typeof value.imageUrl === "string",
    "Invalid imageUrl",
  );
  invariant(
    Array.isArray(value.tags) && value.tags.every((t) => typeof t === "string"),
    "Invalid tags",
  );
}
