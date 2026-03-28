import { ProductCard } from "./ProductCard";
import "./ProductList.css";

export function ProductList({ products, onAddToCart }) {
  return (
    <section className="product-list" aria-label="Product catalog">
      {products.map((product) => (
        <ProductCard
          key={product.id.value}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </section>
  );
}
