import { ProductCard } from "./ProductCard";

export function ProductList({ products, onAddToCart }) {
  return (
    <section>
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
