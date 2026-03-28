import "./productCard.css";

function formatPrice(price) {
  return `${(price.amount / 100).toFixed(2)} ${price.currency}`;
}

export function ProductCard({ product, onAddToCart }) {
  return (
    <article className="product-card">
      <div className="product-card__image-wrapper">
        <img
          className="product-card__image"
          src={product.imageUrl.value}
          alt={product.name.value}
        />
      </div>

      <div className="product-card__body">
        <p className="product-card__category">{product.category.value}</p>

        <h3 className="product-card__name">{product.name.value}</h3>

        <div className="product-card__footer">
          <p className="product-card__price">{formatPrice(product.price)}</p>

          <button
            type="button"
            className="product-card__button"
            onClick={() => onAddToCart(product)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
