// domain/cart.logic.js

import { makeInvariant, isInt, freeze, freezeArray } from "../shared.js";
import { assertCart } from "./cart.types.js";

const invariant = makeInvariant("CartLogic");

/**
 * Domain operations for Cart (pure, immutable style).
 */

/**
 * @param {import("./cart.types.js").Cart} cart
 * @param {string} productId
 * @param {number} qty
 * @returns {import("./cart.types.js").Cart}
 */
export function addToCart(cart, productId, qty = 1) {
  assertCart(cart);
  invariant(
    typeof productId === "string" && productId.trim() !== "",
    "productId required",
  );
  invariant(isInt(qty) && qty >= 1, "qty must be integer >= 1");

  const idx = cart.items.findIndex((i) => i.productId === productId);
  let nextItems;

  if (idx === -1) {
    nextItems = [...cart.items, freeze({ productId, qty })];
  } else {
    const existing = cart.items[idx];
    const updated = freeze({ productId, qty: existing.qty + qty });
    nextItems = cart.items.map((it, i) => (i === idx ? updated : it));
  }

  // Uniqueness invariant
  const ids = nextItems.map((i) => i.productId);
  invariant(
    new Set(ids).size === ids.length,
    "Duplicate productId in cart items",
  );

  freezeArray(nextItems);
  return freeze({ ...cart, items: nextItems });
}

/**
 * @param {import("./cart.types.js").Cart} cart
 * @param {string} productId
 * @param {number} qty
 * @returns {import("./cart.types.js").Cart}
 */
export function setCartQty(cart, productId, qty) {
  assertCart(cart);
  invariant(
    typeof productId === "string" && productId.trim() !== "",
    "productId required",
  );
  invariant(isInt(qty) && qty >= 0, "qty must be integer >= 0");

  let nextItems;

  if (qty === 0) {
    nextItems = cart.items.filter((i) => i.productId !== productId);
  } else {
    const idx = cart.items.findIndex((i) => i.productId === productId);
    if (idx === -1) {
      nextItems = [...cart.items, freeze({ productId, qty })];
    } else {
      const updated = freeze({ productId, qty });
      nextItems = cart.items.map((it, i) => (i === idx ? updated : it));
    }
  }

  const ids = nextItems.map((i) => i.productId);
  invariant(
    new Set(ids).size === ids.length,
    "Duplicate productId in cart items",
  );

  freezeArray(nextItems);
  return freeze({ ...cart, items: nextItems });
}

/**
 * @param {import("./cart.types.js").Cart} cart
 * @param {string} productId
 * @returns {import("./cart.types.js").Cart}
 */
export function removeFromCart(cart, productId) {
  return setCartQty(cart, productId, 0);
}

/**
 * @param {import("./cart.types.js").Cart} cart
 * @returns {number}
 */
export function getCartItemCount(cart) {
  assertCart(cart);
  return cart.items.reduce((sum, i) => sum + i.qty, 0);
}

/**
 * Compute total price in cents using a product lookup.
 *
 * @param {import("./cart.types.js").Cart} cart
 * @param {(productId: string) => { priceCents: number, currency: string } | undefined} getProduct
 * @returns {number}
 */
export function getCartTotalCents(cart, getProduct) {
  assertCart(cart);
  invariant(typeof getProduct === "function", "getProduct must be a function");

  let total = 0;

  for (const item of cart.items) {
    const product = getProduct(item.productId);
    invariant(!!product, `Missing product for id: ${item.productId}`);
    invariant(
      product.currency === cart.currency,
      "Currency mismatch between cart and product",
    );
    invariant(
      isInt(product.priceCents) && product.priceCents >= 0,
      "Invalid product.priceCents",
    );

    total += product.priceCents * item.qty;
  }

  return total;
}
