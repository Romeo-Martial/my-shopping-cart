import { PaymentMethod } from "../../domain/value-objects/PaymentMethod";

export class SetPaymentMethod {
  constructor(checkoutRepository) {
    if (!checkoutRepository) {
      throw new Error("checkoutRepository is required");
    }

    this.checkoutRepository = checkoutRepository;
  }

  execute({ paymentMethod }) {
    const checkoutDraft = this.checkoutRepository.getCurrent();

    const domainPaymentMethod = new PaymentMethod(paymentMethod);

    const updatedCheckout = checkoutDraft.setPaymentMethod(domainPaymentMethod);

    this.checkoutRepository.save(updatedCheckout);

    return updatedCheckout;
  }
}
