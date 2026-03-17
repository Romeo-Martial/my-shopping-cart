import { CatalogProvider } from "./features/catalog/ui/context/CatalogContext";
import { CartProvider } from "./features/cart/ui/context/CartContext";
import { CheckoutProvider } from "./features/checkout/ui/context/CheckoutContext";

import { createCatalogDependencies } from "./application/composition/catalog";
import { createCartDependencies } from "./application/composition/cart";
import { createCheckoutDependencies } from "./application/composition/checkout";

import { StorePage } from "./application/routes/StorePage";
import { CheckoutPage } from "./application/routes/CheckoutPage";

const catalogDeps = createCatalogDependencies();
const cartDeps = createCartDependencies();
const checkoutDeps = createCheckoutDependencies();

export default function App() {
  return (
    <CatalogProvider getProducts={catalogDeps.getProducts}>
      <CartProvider {...cartDeps}>
        <CheckoutProvider {...checkoutDeps}>
          <StorePage />
          <hr />
          <CheckoutPage />
        </CheckoutProvider>
      </CartProvider>
    </CatalogProvider>
  );
}
