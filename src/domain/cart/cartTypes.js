// domain/cart.types.js

import {
  makeInvariant,
  isPlainObject,
  isInt,
  toString,
  toNumber,
  freeze,
  freezeArray,
  ALLOWED_CURRENCIES,
} from "../shared.js";

/**
 * @typedef {Object} CartItem
 * @property {string} productId
 * @property {number} qty              // integer >= 1
 */

/**
 * @typedef {Object} Cart
 * @property {CartItem[]} items
 * @property {string} currency
 */

const invariant = makeInvariant("CartContract");

/**
 * @param {unknown} raw
 * @returns {CartItem}
 */
export function makeCartItem(raw) {
  invariant(isPlainObject(raw), "CartItem must be an object");

  const productId = toString(raw.productId ?? raw.product_id ?? raw.id);
  const qty = toNumber(raw.qty ?? raw.quantity, 1);

  invariant(productId.trim().length > 0, "CartItem.productId is required");
  invariant(isInt(qty), "CartItem.qty must be an integer");
  invariant(qty >= 1, "CartItem.qty must be >= 1");

  /** @type {CartItem} */
  const item = { productId, qty };
  return freeze(item);
}

/**
 * Normalize raw input into a valid Cart.
 * Accepts:
 * - { items: [{productId, qty}], currency }
 * - { itemsById: { [productId]: qty }, currency }
 *
 * @param {unknown} raw
 * @returns {Cart}
 */
export function makeCart(raw) {
  const obj = isPlainObject(raw) ? raw : {};

  const currency = toString(obj.currency, "EUR");
  invariant(
    ALLOWED_CURRENCIES.has(currency),
    `Unsupported currency: ${currency}`,
  );

  let items = [];

  if (Array.isArray(obj.items)) {
    items = obj.items.map(makeCartItem);
  } else if (isPlainObject(obj.itemsById)) {
    items = Object.entries(obj.itemsById).map(([productId, qty]) =>
      makeCartItem({ productId, qty }),
    );
  } else {
    items = [];
  }

  const ids = items.map((i) => i.productId);
  invariant(
    new Set(ids).size === ids.length,
    "Duplicate productId in cart items",
  );

  freezeArray(items);

  /** @type {Cart} */
  const cart = { items, currency };
  return freeze(cart);
}

/**
 * @param {unknown} value
 * @returns {asserts value is CartItem}
 */
export function assertCartItem(value) {
  invariant(isPlainObject(value), "Expected object CartItem");
  invariant(
    typeof value.productId === "string" && value.productId.trim() !== "",
    "Invalid productId",
  );
  invariant(isInt(value.qty) && value.qty >= 1, "Invalid qty");
}

/**
 * @param {unknown} value
 * @returns {asserts value is Cart}
 */
export function assertCart(value) {
  invariant(isPlainObject(value), "Expected object Cart");
  invariant(Array.isArray(value.items), "Cart.items must be an array");
  invariant(
    typeof value.currency === "string",
    "Cart.currency must be a string",
  );
  invariant(
    ALLOWED_CURRENCIES.has(value.currency),
    "Cart.currency not allowed",
  );

  value.items.forEach(assertCartItem);

  const ids = value.items.map((i) => i.productId);
  invariant(
    new Set(ids).size === ids.length,
    "Duplicate productId in cart items",
  );
}
