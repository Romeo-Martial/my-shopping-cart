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

  const initialCheckoutResult = getCheckoutUseCase.execute();

  const [checkout, setCheckout] = useState(
    initialCheckoutResult.isSuccess() ? initialCheckoutResult.value : null,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(
    initialCheckoutResult.isFailure() ? initialCheckoutResult.error : null,
  );

  const value = useMemo(() => {
    return {
      checkout,
      isSubmitting,
      error,

      startCheckout: ({ checkoutId, cartId }) => {
        const result = startCheckoutUseCase.execute({ checkoutId, cartId });

        if (result.isFailure()) {
          setError(result.error);
          return result;
        }

        setError(null);
        setCheckout(result.value);
        return result;
      },

      setShippingAddress: ({ fullName, line1, city, postalCode, country }) => {
        const result = setShippingAddressUseCase.execute({
          fullName,
          line1,
          city,
          postalCode,
          country,
        });

        if (result.isFailure()) {
          setError(result.error);
          return result;
        }

        setError(null);
        setCheckout(result.value);
        return result;
      },

      setPaymentMethod: ({ paymentMethod }) => {
        const result = setPaymentMethodUseCase.execute({ paymentMethod });

        if (result.isFailure()) {
          setError(result.error);
          return result;
        }

        setError(null);
        setCheckout(result.value);
        return result;
      },

      submitCheckout: async () => {
        setIsSubmitting(true);

        try {
          const result = submitCheckoutUseCase.execute();

          if (result.isFailure()) {
            setError(result.error);
            return result;
          }

          setError(null);
          setCheckout(result.value);
          return result;
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
