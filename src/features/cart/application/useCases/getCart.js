import { Result } from "../../../_shared/domain/result";
import { DomainError } from "../../../_shared/domain/domainError";

export class GetCart {
  constructor(cartRepository) {
    if (!cartRepository) {
      throw new Error("cartRepository is required");
    }

    this.cartRepository = cartRepository;
  }

  execute() {
    try {
      const cart = this.cartRepository.getCart();
      return Result.success(cart);
    } catch (err) {
      return Result.failure(new DomainError("GET_CART_FAILED", err.message));
    }
  }
}
