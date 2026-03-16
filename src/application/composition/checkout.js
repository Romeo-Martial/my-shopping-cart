import { InMemoryCheckoutRepository } from "../../features/checkout/infrastructure/inMemoryCheckoutRepository";
import { StartCheckout } from "../../features/checkout/application/useCases/startCheckout";
import { GetCheckout } from "../../features/checkout/application/useCases/getCheckout";
import { SetShippingAddress } from "../../features/checkout/application/useCases/setShippingAddress";
import { SetPaymentMethod } from "../../features/checkout/application/useCases/setPaymentMethod";
import { SubmitCheckout } from "../../features/checkout/application/useCases/submitCheckout";

export function createCheckoutDependencies() {
  const checkoutRepository = new InMemoryCheckoutRepository();

  return {
    startCheckoutUseCase: new StartCheckout(checkoutRepository),
    getCheckoutUseCase: new GetCheckout(checkoutRepository),
    setShippingAddressUseCase: new SetShippingAddress(checkoutRepository),
    setPaymentMethodUseCase: new SetPaymentMethod(checkoutRepository),
    submitCheckoutUseCase: new SubmitCheckout(checkoutRepository),
  };
}
