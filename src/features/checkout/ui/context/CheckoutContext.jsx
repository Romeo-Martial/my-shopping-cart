import { createContext, useContext, useMemo, useState } from "react";

const CheckoutContext = createContext(null);

export function CheckoutProvider({
  children,
  startCheckoutUseCase,
  getCheckoutUseCase,
  setShippingAddressUseCase,
  setPaymentMethodUseCase,
  submitCheckoutUseCase,
}) {
  if (
    !startCheckoutUseCase ||
    !getCheckoutUseCase ||
    !setShippingAddressUseCase ||
    !setPaymentMethodUseCase ||
    !submitCheckoutUseCase
  ) {
    throw new Error("CheckoutProvider requires all checkout use cases");
  }

  const [checkout, setCheckout] = useState(() => {
    try {
      return getCheckoutUseCase.execute();
    } catch {
      return null;
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const value = useMemo(() => {
    return {
      checkout,
      isSubmitting,
      error,

      startCheckout: ({ checkoutId, cartId }) => {
        try {
          setError(null);
          const createdCheckout = startCheckoutUseCase.execute({
            checkoutId,
            cartId,
          });
          setCheckout(createdCheckout);
          return createdCheckout;
        } catch (err) {
          setError(err);
          throw err;
        }
      },

      setShippingAddress: ({ fullName, line1, city, postalCode, country }) => {
        try {
          setError(null);
          const updatedCheckout = setShippingAddressUseCase.execute({
            fullName,
            line1,
            city,
            postalCode,
            country,
          });
          setCheckout(updatedCheckout);
          return updatedCheckout;
        } catch (err) {
          setError(err);
          throw err;
        }
      },

      setPaymentMethod: ({ paymentMethod }) => {
        try {
          setError(null);
          const updatedCheckout = setPaymentMethodUseCase.execute({
            paymentMethod,
          });
          setCheckout(updatedCheckout);
          return updatedCheckout;
        } catch (err) {
          setError(err);
          throw err;
        }
      },

      submitCheckout: async () => {
        try {
          setError(null);
          setIsSubmitting(true);

          const submittedCheckout = submitCheckoutUseCase.execute();
          setCheckout(submittedCheckout);
          return submittedCheckout;
        } catch (err) {
          setError(err);
          throw err;
        } finally {
          setIsSubmitting(false);
        }
      },
    };
  }, [
    checkout,
    isSubmitting,
    error,
    startCheckoutUseCase,
    setShippingAddressUseCase,
    setPaymentMethodUseCase,
    submitCheckoutUseCase,
  ]);

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckoutContext() {
  const context = useContext(CheckoutContext);

  if (!context) {
    throw new Error(
      "useCheckoutContext must be used within a CheckoutProvider",
    );
  }

  return context;
}
