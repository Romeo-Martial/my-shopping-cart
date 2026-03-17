import { Result } from "../../../_shared/domain/result";
import { DomainError } from "../../../_shared/domain/domainError";

export class GetCheckout {
  constructor(checkoutRepository) {
    if (!checkoutRepository) {
      throw new Error("checkoutRepository is required");
    }

    this.checkoutRepository = checkoutRepository;
  }

  execute() {
    try {
      const checkout = this.checkoutRepository.getCurrent();
      return Result.success(checkout);
    } catch (err) {
      return Result.failure(
        new DomainError("GET_CHECKOUT_FAILED", err.message),
      );
    }
  }
}
