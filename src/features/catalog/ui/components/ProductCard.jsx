export function ProductCard({ product, onAddToCart }) {
  return (
    <article>
      <img src={product.imageUrl.value} alt={product.name.value} width="120" />

      <h3>{product.name.value}</h3>

      <p>
        {(product.price.amount / 100).toFixed(2)} {product.price.currency}
      </p>

      <p>{product.category.value}</p>

      <button onClick={() => onAddToCart(product)}>Add to cart</button>
    </article>
  );
}
