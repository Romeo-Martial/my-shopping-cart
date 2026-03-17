import { Result } from "../../../_shared/domain/result";
import { DomainError } from "../../../_shared/domain/domainError";

export class SubmitCheckout {
  constructor(checkoutRepository) {
    if (!checkoutRepository) {
      throw new Error("checkoutRepository is required");
    }

    this.checkoutRepository = checkoutRepository;
  }

  execute() {
    try {
      const checkoutDraft = this.checkoutRepository.getCurrent();
      const submittedCheckout = checkoutDraft.submit();

      this.checkoutRepository.save(submittedCheckout);

      return Result.success(submittedCheckout);
    } catch (err) {
      return Result.failure(
        new DomainError("SUBMIT_CHECKOUT_FAILED", err.message),
      );
    }
  }
}
