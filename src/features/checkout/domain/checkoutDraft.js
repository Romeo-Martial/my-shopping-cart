import { CheckoutId } from "./value-objects/CheckoutId";
import { ShippingAddress } from "./value-objects/ShippingAddress";
import { PaymentMethod } from "./value-objects/PaymentMethod";
import { CheckoutStatus } from "./value-objects/CheckoutStatus";
import { CartId } from "../../cart/domain/value-objects/cart-id";

export class CheckoutDraft {
  constructor({
    id,
    cartId,
    shippingAddress = null,
    paymentMethod = null,
    status = new CheckoutStatus("draft"),
  }) {
    if (!(id instanceof CheckoutId)) {
      throw new Error("id must be CheckoutId");
    }

    if (!(cartId instanceof CartId)) {
      throw new Error("cartId must be CartId");
    }

    if (
      shippingAddress !== null &&
      !(shippingAddress instanceof ShippingAddress)
    ) {
      throw new Error("shippingAddress must be ShippingAddress or null");
    }

    if (paymentMethod !== null && !(paymentMethod instanceof PaymentMethod)) {
      throw new Error("paymentMethod must be PaymentMethod or null");
    }

    if (!(status instanceof CheckoutStatus)) {
      throw new Error("status must be CheckoutStatus");
    }

    this.id = id;
    this.cartId = cartId;
    this.shippingAddress = shippingAddress;
    this.paymentMethod = paymentMethod;
    this.status = status;

    Object.freeze(this);
  }

  setShippingAddress(address) {
    if (this.status.isSubmitted()) {
      throw new Error("Cannot modify shipping address after submission");
    }

    if (!(address instanceof ShippingAddress)) {
      throw new Error("address must be ShippingAddress");
    }

    return new CheckoutDraft({
      id: this.id,
      cartId: this.cartId,
      shippingAddress: address,
      paymentMethod: this.paymentMethod,
      status: new CheckoutStatus("draft"),
    });
  }

  setPaymentMethod(method) {
    if (this.status.isSubmitted()) {
      throw new Error("Cannot modify payment method after submission");
    }

    if (!(method instanceof PaymentMethod)) {
      throw new Error("method must be PaymentMethod");
    }

    return new CheckoutDraft({
      id: this.id,
      cartId: this.cartId,
      shippingAddress: this.shippingAddress,
      paymentMethod: method,
      status: new CheckoutStatus("draft"),
    });
  }

  isReadyForSubmission() {
    return (
      this.shippingAddress !== null &&
      this.paymentMethod !== null &&
      !this.status.isSubmitted()
    );
  }

  markReady() {
    if (!this.isReadyForSubmission()) {
      throw new Error("CheckoutDraft is not ready");
    }

    return new CheckoutDraft({
      id: this.id,
      cartId: this.cartId,
      shippingAddress: this.shippingAddress,
      paymentMethod: this.paymentMethod,
      status: new CheckoutStatus("ready"),
    });
  }

  submit() {
    if (!this.isReadyForSubmission() && !this.status.isReady()) {
      throw new Error("Cannot submit an incomplete checkout");
    }

    return new CheckoutDraft({
      id: this.id,
      cartId: this.cartId,
      shippingAddress: this.shippingAddress,
      paymentMethod: this.paymentMethod,
      status: new CheckoutStatus("submitted"),
    });
  }
}
