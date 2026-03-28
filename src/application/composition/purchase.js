import { SubmitCheckoutAndCreateOrder } from "../useCases/submitCheckoutAndCreateOrder";

export function createPurchaseDependencies({
  submitCheckoutUseCase,
  createOrderFromCheckoutUseCase,
}) {
  if (!submitCheckoutUseCase) {
    throw new Error("submitCheckoutUseCase is required");
  }

  if (!createOrderFromCheckoutUseCase) {
    throw new Error("createOrderFromCheckoutUseCase is required");
  }

  return {
    submitCheckoutAndCreateOrderUseCase: new SubmitCheckoutAndCreateOrder(
      submitCheckoutUseCase,
      createOrderFromCheckoutUseCase,
    ),
  };
}
