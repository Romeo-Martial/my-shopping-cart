import { Result } from "../../../_shared/domain/result";
import { DomainError } from "../../../_shared/domain/domainError";
import { Sku } from "../../domain/valueObjects/sku";

export class RemoveItemFromCart {
  constructor(cartRepository) {
    if (!cartRepository) {
      throw new Error("cartRepository is required");
    }

    this.cartRepository = cartRepository;
  }

  execute({ sku }) {
    try {
      const cart = this.cartRepository.getCart();

      const domainSku = new Sku(sku);

      const updatedCart = cart.removeItem(domainSku);

      this.cartRepository.save(updatedCart);

      return Result.success(updatedCart);
    } catch (err) {
      return Result.failure(
        new DomainError("REMOVE_ITEM_FROM_CART_FAILED", err.message),
      );
    }
  }
}
