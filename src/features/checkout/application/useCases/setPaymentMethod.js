import { Result } from "../../../_shared/domain/result";
import { DomainError } from "../../../_shared/domain/domainError";
import { PaymentMethod } from "../../domain/valueObjects/paymentMethod";

export class SetPaymentMethod {
  constructor(checkoutRepository) {
    if (!checkoutRepository) {
      throw new Error("checkoutRepository is required");
    }

    this.checkoutRepository = checkoutRepository;
  }

  execute({ paymentMethod }) {
    try {
      const checkoutDraft = this.checkoutRepository.getCurrent();

      const domainPaymentMethod = new PaymentMethod(paymentMethod);

      const updatedCheckout =
        checkoutDraft.setPaymentMethod(domainPaymentMethod);

      this.checkoutRepository.save(updatedCheckout);

      return Result.success(updatedCheckout);
    } catch (err) {
      return Result.failure(
        new DomainError("SET_PAYMENT_METHOD_FAILED", err.message),
      );
    }
  }
}
