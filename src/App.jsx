import { RouterProvider } from "react-router-dom";

import { CatalogProvider } from "./features/catalog/ui/context/CatalogContext";
import { CartProvider } from "./features/cart/ui/context/CartContext";
import { CheckoutProvider } from "./features/checkout/ui/context/CheckoutContext";

import {
  catalogDeps,
  cartDeps,
  checkoutDeps,
} from "./application/composition/dependencies";
import { router } from "./application/routes/router";

export default function App() {
  return (
    <CatalogProvider getProducts={catalogDeps.getProducts}>
      <CartProvider {...cartDeps}>
        <CheckoutProvider {...checkoutDeps}>
          <RouterProvider router={router} />
        </CheckoutProvider>
      </CartProvider>
    </CatalogProvider>
  );
}
