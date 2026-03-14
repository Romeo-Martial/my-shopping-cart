import { Cart } from "../../features/cart/domain/cart";
import { CartId } from "../../features/cart/domain/value-objects/cart-id";
import { InMemoryCartRepository } from "../../features/cart/infrastructure/in-memory-cart-repository";

import { GetCart } from "../../features/cart/application/use-cases/get-cart";
import { AddItemToCart } from "../../features/cart/application/use-cases/add-item-to-cart";
import { RemoveItemFromCart } from "../../features/cart/application/use-cases/remove-item-from-cart";
import { ChangeItemQuantity } from "../../features/cart/application/use-cases/change-item-quantity";

export function createCartDependencies() {
  const cart = new Cart(new CartId("123e4567-e89b-12d3-a456-426614174000"), []);

  const cartRepository = new InMemoryCartRepository(cart);

  return {
    getCart: new GetCart(cartRepository),
    addItemToCart: new AddItemToCart(cartRepository),
    removeItemFromCart: new RemoveItemFromCart(cartRepository),
    changeItemQuantity: new ChangeItemQuantity(cartRepository),
  };
}
