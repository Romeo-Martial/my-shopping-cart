import { CheckoutRepository } from "../application/ports/checkoutRepository";
import { CheckoutDraft } from "../domain/checkoutDraft";
import { CheckoutId } from "../domain/valueObjects/checkoutId";
import { CheckoutStatus } from "../domain/valueObjects/checkoutStatus";
import { PaymentMethod } from "../domain/valueObjects/paymentMethod";
import { ShippingAddress } from "../domain/valueObjects/shippingAddress";
import { CartId } from "../../cart/domain/valueObjects/cartId";

const STORAGE_KEY = "ddd-ecommerce-checkout";

function serializeCheckout(checkout) {
  return {
    id: checkout.id.value,
    cartId: checkout.cartId.value,
    shippingAddress: checkout.shippingAddress
      ? {
          fullName: checkout.shippingAddress.fullName,
          line1: checkout.shippingAddress.line1,
          city: checkout.shippingAddress.city,
          postalCode: checkout.shippingAddress.postalCode,
          country: checkout.shippingAddress.country,
        }
      : null,
    paymentMethod: checkout.paymentMethod ? checkout.paymentMethod.value : null,
    status: checkout.status.value,
  };
}

function deserializeCheckout(rawCheckout) {
  if (!rawCheckout) {
    return null;
  }

  return new CheckoutDraft({
    id: new CheckoutId(rawCheckout.id),
    cartId: new CartId(rawCheckout.cartId),
    shippingAddress: rawCheckout.shippingAddress
      ? new ShippingAddress(rawCheckout.shippingAddress)
      : null,
    paymentMethod: rawCheckout.paymentMethod
      ? new PaymentMethod(rawCheckout.paymentMethod)
      : null,
    status: new CheckoutStatus(rawCheckout.status),
  });
}

export class LocalStorageCheckoutRepository extends CheckoutRepository {
  constructor(initialCheckout = null) {
    super();
    this.initialCheckout = initialCheckout;
  }

  getCurrent() {
    const rawValue = localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return this.initialCheckout;
    }

    const parsed = JSON.parse(rawValue);
    return deserializeCheckout(parsed);
  }

  save(checkoutDraft) {
    const serialized = serializeCheckout(checkoutDraft);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  }
}
