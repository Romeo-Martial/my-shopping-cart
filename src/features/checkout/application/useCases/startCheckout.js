import { CheckoutDraft } from "../../domain/checkoutDraft";
import { CheckoutId } from "../../domain/valueObjects/checkoutId";
import { CartId } from "../../../cart/domain/valueObjects/cartId";

export class StartCheckout {
  constructor(checkoutRepository) {
    if (!checkoutRepository) {
      throw new Error("checkoutRepository is required");
    }

    this.checkoutRepository = checkoutRepository;
  }

  execute({ checkoutId, cartId }) {
    const domainCheckoutId = new CheckoutId(checkoutId);
    const domainCartId = new CartId(cartId);

    const checkoutDraft = new CheckoutDraft({
      id: domainCheckoutId,
      cartId: domainCartId,
    });

    this.checkoutRepository.save(checkoutDraft);

    return checkoutDraft;
  }
}
