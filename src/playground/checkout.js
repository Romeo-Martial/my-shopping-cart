import { createCheckoutDependencies } from "../application/composition/checkout";

const checkoutDeps = createCheckoutDependencies();

const checkout = checkoutDeps.startCheckout.execute({
  checkoutId: "123e4567-e89b-12d3-a456-426614174000",
  cartId: "123e4567-e89b-12d3-a456-426614174111",
});

console.log("Started checkout:", checkout);

const withAddress = checkoutDeps.setShippingAddress.execute({
  fullName: "Ada Lovelace",
  line1: "12 Analytical Engine Street",
  city: "Paris",
  postalCode: "75001",
  country: "FR",
});

console.log("With address:", withAddress);

const withPayment = checkoutDeps.setPaymentMethod.execute({
  paymentMethod: "card",
});

console.log("With payment:", withPayment);
console.log("Ready?", withPayment.isReadyForSubmission());

const submitted = checkoutDeps.submitCheckout.execute();

console.log("Submitted:", submitted);