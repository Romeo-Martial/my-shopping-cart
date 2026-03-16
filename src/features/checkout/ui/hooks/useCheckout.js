import { useCheckoutContext } from "../context/CheckoutContext";

export function useCheckout() {
  return useCheckoutContext();
}
