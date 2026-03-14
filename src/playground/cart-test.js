import { CartId } from "../features/cart/domain/value-objects/cart-id.js";
import { Cart } from "../features/cart/domain/cart.js";

import { InMemoryCartRepository } from "../features/cart/infrastructure/in-memory-cart-repository.js";
import { AddItemToCart } from "../features/cart/application/use-cases/add-item-to-cart.js";

const cartId = new CartId("123e4567-e89b-12d3-a456-426614174000");
const emptyCart = new Cart(cartId, []);

const repo = new InMemoryCartRepository(emptyCart);

const addItem = new AddItemToCart(repo);

const sku = "SKU-001";
const quantity = 1;
const price = 1999;
const currency = "EUR";

const updatedCart = addItem.execute({
  sku,
  quantity,
  unitPriceAmount: price,
  currency,
});

console.log(updatedCart);
console.log(updatedCart.getTotalItems());
console.log(updatedCart.getSubtotal());
