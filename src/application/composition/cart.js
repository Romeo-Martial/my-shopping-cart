import { Cart } from "../../features/cart/domain/cart";
import { CartId } from "../../features/cart/domain/valueObjects/cartId";
import { InMemoryCartRepository } from "../../features/cart/infrastructure/inMemoryCartRepository";

import { GetCart } from "../../features/cart/application/useCases/getCart";
import { AddItemToCart } from "../../features/cart/application/useCases/addItemToCart";
import { RemoveItemFromCart } from "../../features/cart/application/useCases/removeItemFromCart";
import { ChangeItemQuantity } from "../../features/cart/application/useCases/changeItemQuantity";

export function createCartDependencies() {
  const initialCart = new Cart(
    new CartId("123e4567-e89b-12d3-a456-426614174111"),
    [],
  );

  const cartRepository = new InMemoryCartRepository(initialCart);

  return {
    cartRepository,
    getCart: new GetCart(cartRepository),
    addItemToCart: new AddItemToCart(cartRepository),
    removeItemFromCart: new RemoveItemFromCart(cartRepository),
    changeItemQuantity: new ChangeItemQuantity(cartRepository),
  };
}
