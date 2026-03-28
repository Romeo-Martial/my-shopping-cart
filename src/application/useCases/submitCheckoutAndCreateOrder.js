import { Result } from "../../features/_shared/domain/result";
import { DomainError } from "../../features/_shared/domain/domainError";

export class SubmitCheckoutAndCreateOrder {
  constructor(submitCheckoutUseCase, createOrderFromCheckoutUseCase) {
    if (!submitCheckoutUseCase) {
      throw new Error("submitCheckoutUseCase is required");
    }

    if (!createOrderFromCheckoutUseCase) {
      throw new Error("createOrderFromCheckoutUseCase is required");
    }

    this.submitCheckoutUseCase = submitCheckoutUseCase;
    this.createOrderFromCheckoutUseCase = createOrderFromCheckoutUseCase;
  }

  execute({ orderId }) {
    const submitResult = this.submitCheckoutUseCase.execute();

    if (submitResult.isFailure()) {
      return Result.failure(
        new DomainError(
          "SUBMIT_CHECKOUT_AND_CREATE_ORDER_FAILED",
          submitResult.error.message,
          {
            step: "submitCheckout",
            cause: submitResult.error,
          }
        )
      );
    }

    const createOrderResult =
      this.createOrderFromCheckoutUseCase.execute({ orderId });

    if (createOrderResult.isFailure()) {
      return Result.failure(
        new DomainError(
          "SUBMIT_CHECKOUT_AND_CREATE_ORDER_FAILED",
          createOrderResult.error.message,
          {
            step: "createOrderFromCheckout",
            cause: createOrderResult.error,
          }
        )
      );
    }

    return Result.success({
      checkout: submitResult.value,
      order: createOrderResult.value,
    });
  }
}