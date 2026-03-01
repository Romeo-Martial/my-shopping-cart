// domain/product.logic.js

import { assertProduct } from "./product.types.js";

/**
 * Domain helpers / behavior for Product.
 * Pure, deterministic functions only.
 */

/**
 * @param {import("./product.types.js").Product} product
 * @returns {string}
 */
export function formatProductPrice(product) {
  assertProduct(product);
  const amount = (product.priceCents / 100).toFixed(2);
  return `${amount} ${product.currency}`;
}

/**
 * Example: product availability helper.
 * @param {import("./product.types.js").Product} product
 * @returns {boolean}
 */
export function isProductPurchasable(product) {
  assertProduct(product);
  return product.inStock && product.priceCents > 0;
}
