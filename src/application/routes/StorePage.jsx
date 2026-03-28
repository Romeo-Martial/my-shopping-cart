import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../../features/catalog/ui/hooks/useCatalog";
import { useCart } from "../../features/cart/ui/hooks/useCart";
import { ProductList } from "../../features/catalog/ui/components/ProductList";
import "./storePage.css";

export function StorePage() {
  const { products, isLoading, error, loadProducts } = useCatalog();
  const { cart, addItem } = useCart();

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  function handleAddToCart(product) {
    addItem({
      sku: String(product.id.value),
      quantity: 1,
      unitPriceAmount: product.price.amount,
      currency: product.price.currency,
    });
  }

  const totalItems = cart ? cart.getTotalItems() : 0;
  const hasProducts = products && products.length > 0;

  return (
    <section className="store-page" aria-labelledby="store-page-title">
      <header className="store-page__header">
        <div className="store-page__heading">
          <h1 id="store-page-title" className="store-page__title">
            Store
          </h1>
          <p className="store-page__description">
            Browse products and add them to your cart.
          </p>
        </div>

        <Link to="/cart" className="ui-button-link ui-button-link--secondary">
          View cart ({totalItems})
        </Link>
      </header>

      {isLoading ? (
        <div className="ui-alert" role="status">
          <p>Loading products...</p>
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="ui-alert ui-alert--error" role="alert">
          <p>{error.message}</p>
        </div>
      ) : null}

      {!isLoading && !error && !hasProducts ? (
        <div className="ui-alert" role="status">
          <p>No products are available right now.</p>
        </div>
      ) : null}

      {!isLoading && !error && hasProducts ? (
        <ProductList products={products} onAddToCart={handleAddToCart} />
      ) : null}
    </section>
  );
}
