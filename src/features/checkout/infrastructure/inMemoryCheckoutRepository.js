import { CheckoutRepository } from "../application/ports/checkoutRepository";
import { CheckoutDraft } from "../domain/checkoutDraft";

export class InMemoryCheckoutRepository extends CheckoutRepository {
  constructor(initialCheckout = null) {
    super();

    if (
      initialCheckout !== null &&
      !(initialCheckout instanceof CheckoutDraft)
    ) {
      throw new Error("initialCheckout must be a CheckoutDraft or null");
    }

    this.currentCheckout = initialCheckout;
  }

  getCurrent() {
    if (this.currentCheckout === null) {
      throw new Error("No current checkout draft found");
    }

    return this.currentCheckout;
  }

  save(checkoutDraft) {
    if (!(checkoutDraft instanceof CheckoutDraft)) {
      throw new Error("checkoutDraft must be a CheckoutDraft");
    }

    this.currentCheckout = checkoutDraft;
  }
}
