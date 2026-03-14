import { CartProvider } from "./features/cart/ui/context/cart-context";
import { useCart } from "./features/cart/ui/hooks/use-cart";
import { createCartDependencies } from "./application/composition/cart";

import { Sku } from "./features/cart/domain/value-objects/sku";
import { Quantity } from "./features/cart/domain/value-objects/quantity";
import { Money } from "./features/cart/domain/value-objects/money";

const cartDeps = createCartDependencies();

function CartDemo() {
  const { cart, addItem, removeItem, changeQuantity } = useCart();

  const handleAdd = () => {
    addItem({
      sku: new Sku("SKU-001"),
      quantity: new Quantity(1),
      unitPrice: new Money(1999, "EUR"),
    });
  };

  return (
    <div>
      <h1>Cart Demo</h1>
      <p>Total items: {cart.getTotalItems()}</p>
      <p>
        Subtotal: {cart.getSubtotal().amount} {cart.getSubtotal().currency}
      </p>

      <button onClick={handleAdd}>Add item</button>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider {...cartDeps}>
      <CartDemo />
    </CartProvider>
  );
}
