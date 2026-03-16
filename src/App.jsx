import { CatalogProvider } from "./features/catalog/ui/context/CatalogContext";
import { CartProvider } from "./features/cart/ui/context/CartContext";

import { createCatalogDependencies } from "./application/composition/catalog";
import { createCartDependencies } from "./application/composition/cart";
import { StorePage } from "./application/routes/StorePage";

const catalogDeps = createCatalogDependencies();
const cartDeps = createCartDependencies();

export default function App() {
  return (
    <CatalogProvider getProducts={catalogDeps.getProducts}>
      <CartProvider {...cartDeps}>
        <StorePage />
      </CartProvider>
    </CatalogProvider>
  );
}
