import { Cart } from "../../features/cart/domain/cart";
import { CartId } from "../../features/cart/domain/valueObjects/cartId";
import { LocalStorageCartRepository } from "../../features/cart/infrastructure/localStorageCartRepository";

import { GetCart } from "../../features/cart/application/useCases/getCart";
import { AddItemToCart } from "../../features/cart/application/useCases/addItemToCart";
import { RemoveItemFromCart } from "../../features/cart/application/useCases/removeItemFromCart";
import { ChangeItemQuantity } from "../../features/cart/application/useCases/changeItemQuantity";

export function createCartDependencies() {
  const cartRepository = new LocalStorageCartRepository();

  return {
    cartRepository,
    getCart: new GetCart(cartRepository),
    addItemToCart: new AddItemToCart(cartRepository),
    removeItemFromCart: new RemoveItemFromCart(cartRepository),
    changeItemQuantity: new ChangeItemQuantity(cartRepository),
  };
}
