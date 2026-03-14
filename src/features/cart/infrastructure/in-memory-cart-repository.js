import { CartRepository } from "../application/ports/cart-repository.js";
import { Cart } from "../domain/cart.js";

export class InMemoryCartRepository extends CartRepository {
  constructor(initialCart) {
    super();

    if (!(initialCart instanceof Cart)) {
      throw new Error("initialCart must be a Cart");
    }

    this.currentCart = initialCart;
  }

  getCart() {
    return this.currentCart;
  }

  save(cart) {
    if (!(cart instanceof Cart)) {
      throw new Error("cart must be a Cart");
    }

    this.currentCart = cart;
  }
}
