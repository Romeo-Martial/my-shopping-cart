import { Sku } from "../../domain/valueObjects/sku";

export class RemoveItemFromCart {
  constructor(cartRepository) {
    if (!cartRepository) {
      throw new Error("cartRepository is required");
    }

    this.cartRepository = cartRepository;
  }

  execute({ sku }) {
    const cart = this.cartRepository.getCart();

    const domainSku = new Sku(sku);

    const updatedCart = cart.removeItem(domainSku);

    this.cartRepository.save(updatedCart);

    return updatedCart;
  }
}
