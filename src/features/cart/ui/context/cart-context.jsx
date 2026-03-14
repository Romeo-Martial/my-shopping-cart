import { createContext, useContext, useMemo, useState } from "react";

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

  const [cart, setCart] = useState(() => getCart.execute());

  const value = useMemo(() => {
    return {
      cart,

      addItem: ({ sku, quantity, unitPriceAmount, currency }) => {
        const updatedCart = addItemToCart.execute({
          sku,
          quantity,
          unitPriceAmount,
          currency,
        });
        setCart(updatedCart);
      },

      removeItem: ({ sku }) => {
        const updatedCart = removeItemFromCart.execute({ sku });
        setCart(updatedCart);
      },

      changeQuantity: ({ sku, quantity }) => {
        const updatedCart = changeItemQuantity.execute({
          sku,
          quantity,
        });
        setCart(updatedCart);
      },
    };
  }, [cart, addItemToCart, removeItemFromCart, changeItemQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }

  return context;
}
