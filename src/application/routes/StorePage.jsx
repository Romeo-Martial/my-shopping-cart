import { useCatalog } from "../../features/catalog/ui/hooks/useCatalog";
import { useCart } from "../../features/cart/ui/hooks/useCart";
import { ProductList } from "../../features/catalog/ui/components/ProductList";

export function StorePage() {
  const { products, isLoading, error } = useCatalog();
  const { cart, addItem } = useCart();

  const handleAddToCart = (product) => {
    addItem({
      sku: String(product.id.value),
      quantity: 1,
      unitPriceAmount: product.price.amount,
      currency: product.price.currency,
    });
  };

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Failed to load products: {error.message}</p>;
  }

  return (
    <div>
      <h1>Store</h1>
      <p>Items in cart: {cart.getTotalItems()}</p>

      <ProductList products={products} onAddToCart={handleAddToCart} />
    </div>
  );
}
