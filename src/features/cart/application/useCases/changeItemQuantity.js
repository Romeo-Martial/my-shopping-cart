import { Result } from "../../../_shared/domain/result";
import { DomainError } from "../../../_shared/domain/domainError";
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
    try {
      const cart = this.cartRepository.getCart();

      const domainSku = new Sku(sku);
      const domainQuantity = new Quantity(quantity);

      const updatedCart = cart.changeItemQuantity(domainSku, domainQuantity);

      this.cartRepository.save(updatedCart);

      return Result.success(updatedCart);
    } catch (err) {
      return Result.failure(
        new DomainError("CHANGE_ITEM_QUANTITY_FAILED", err.message),
      );
    }
  }
}
