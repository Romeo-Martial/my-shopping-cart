import { InMemoryCheckoutRepository } from "../../features/checkout/infrastructure/inMemoryCheckoutRepository";
import { StartCheckout } from "../../features/checkout/application/useCases/startCheckout";
import { GetCheckout } from "../../features/checkout/application/useCases/getCheckout";
import { SetShippingAddress } from "../../features/checkout/application/useCases/setShippingAddress";
import { SetPaymentMethod } from "../../features/checkout/application/useCases/setPaymentMethod";
import { SubmitCheckout } from "../../features/checkout/application/useCases/submitCheckout";

export function createCheckoutDependencies() {
  const checkoutRepository = new InMemoryCheckoutRepository();

  return {
    startCheckout: new StartCheckout(checkoutRepository),
    getCheckout: new GetCheckout(checkoutRepository),
    setShippingAddress: new SetShippingAddress(checkoutRepository),
    setPaymentMethod: new SetPaymentMethod(checkoutRepository),
    submitCheckout: new SubmitCheckout(checkoutRepository),
  };
}
