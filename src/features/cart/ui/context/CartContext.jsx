import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";

const CartContext = createContext(null);

export function CartProvider({
  children,
  getCart,
  addItemToCart,
  removeItemFromCart,
  changeItemQuantity,
}) {
  if (
    !getCart ||
    !addItemToCart ||
    !removeItemFromCart ||
    !changeItemQuantity
  ) {
    throw new Error("CartProvider requires all cart use cases");
  }

  const initialCartResult = getCart.execute();

  const [cart, setCart] = useState(
    initialCartResult.isSuccess() ? initialCartResult.value : null,
  );

  const [error, setError] = useState(
    initialCartResult.isFailure() ? initialCartResult.error : null,
  );

  const addItem = useCallback(
    ({ sku, quantity, unitPriceAmount, currency }) => {
      const result = addItemToCart.execute({
        sku,
        quantity,
        unitPriceAmount,
        currency,
      });

      if (result.isFailure()) {
        setError(result.error);
        return result;
      }

      setError(null);
      setCart(result.value);
      return result;
    },
    [addItemToCart],
  );

  const removeItem = useCallback(
    ({ sku }) => {
      const result = removeItemFromCart.execute({ sku });

      if (result.isFailure()) {
        setError(result.error);
        return result;
      }

      setError(null);
      setCart(result.value);
      return result;
    },
    [removeItemFromCart],
  );

  const changeQuantity = useCallback(
    ({ sku, quantity }) => {
      const result = changeItemQuantity.execute({
        sku,
        quantity,
      });

      if (result.isFailure()) {
        setError(result.error);
        return result;
      }

      setError(null);
      setCart(result.value);
      return result;
    },
    [changeItemQuantity],
  );

  const value = useMemo(() => {
    return {
      cart,
      error,
      addItem,
      removeItem,
      changeQuantity,
    };
  }, [cart, error, addItem, removeItem, changeQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }

  return context;
}
