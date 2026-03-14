import { CartId } from "../features/cart/domain/value-objects/cart-id.js";
import { Sku } from "../features/cart/domain/value-objects/sku.js";
import { Quantity } from "../features/cart/domain/value-objects/quantity.js";
import { Money } from "../features/cart/domain/value-objects/money.js";
import { Cart } from "../features/cart/domain/cart.js";

import { InMemoryCartRepository } from "../features/cart/infrastructure/in-memory-cart-repository.js";
import { AddItemToCart } from "../features/cart/application/use-cases/add-item-to-cart.js";

const cartId = new CartId("123e4567-e89b-12d3-a456-426614174000");
const emptyCart = new Cart(cartId, []);

const repo = new InMemoryCartRepository(emptyCart);

const addItem = new AddItemToCart(repo);

const sku = new Sku("SKU-001");
const quantity = new Quantity(1);
const price = new Money(1999, "EUR");

const updatedCart = addItem.execute({
  sku,
  quantity,
  unitPrice: price,
});

console.log(updatedCart);
console.log(updatedCart.getTotalItems());
console.log(updatedCart.getSubtotal());
