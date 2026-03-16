import { Sku } from "../../domain/valueObjects/sku";
import { Quantity } from "../../domain/valueObjects/quantity";

export class ChangeItemQuantity {
  constructor(cartRepository) {
    if (!cartRepository) {
      throw new Error("cartRepository is required");
    }

    this.cartRepository = cartRepository;
  }

  execute({ sku, quantity }) {
    const cart = this.cartRepository.getCart();

    const domainSku = new Sku(sku);
    const domainQuantity = new Quantity(quantity);

    const updatedCart = cart.changeItemQuantity(domainSku, domainQuantity);

    this.cartRepository.save(updatedCart);

    return updatedCart;
  }
}
