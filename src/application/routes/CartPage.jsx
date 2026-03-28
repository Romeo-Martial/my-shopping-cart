import { Link } from "react-router-dom";
import { useCart } from "../../features/cart/ui/hooks/useCart";
import "./cartPage.css";

function formatMoney(money) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currency,
  }).format(money.amount / 100);
}

export function CartPage() {
  const { cart, error, removeItem, changeQuantity } = useCart();

  const lines = cart?.lines ?? [];
  const isEmpty = lines.length === 0;
  const subtotal = cart?.getSubtotal ? cart.getSubtotal() : null;
  const totalItems = cart?.getTotalItems ? cart.getTotalItems() : 0;

  async function handleIncrease(line) {
    const nextQuantity = line.quantity.value + 1;

    await changeQuantity({
      sku: line.sku.value,
      quantity: nextQuantity,
    });
  }

  async function handleDecrease(line) {
    const nextQuantity = line.quantity.value - 1;

    if (nextQuantity < 1) {
      await removeItem({ sku: line.sku.value });
      return;
    }

    await changeQuantity({
      sku: line.sku.value,
      quantity: nextQuantity,
    });
  }

  async function handleRemove(line) {
    await removeItem({ sku: line.sku.value });
  }

  return (
    <section className="cart-page" aria-labelledby="cart-page-title">
      <header className="cart-page__header">
        <div className="cart-page__heading">
          <h1 id="cart-page-title" className="cart-page__title">
            Cart
          </h1>
          <p className="cart-page__meta">Total items: {totalItems}</p>
        </div>
      </header>

      {error ? (
        <div className="ui-alert ui-alert--error" role="alert">
          <p>{error.message}</p>
        </div>
      ) : null}

      {isEmpty ? (
        <div className="cart-page__empty ui-card ui-section">
          <p>Your cart is empty.</p>
          <Link to="/" className="ui-button-link ui-button-link--secondary">
            Continue shopping
          </Link>
        </div>
      ) : (
        <>
          <ul className="cart-page__items" aria-label="Cart items">
            {lines.map((line) => {
              const lineSubtotal = line.getSubtotal();

              return (
                <li key={line.sku.value}>
                  <article className="cart-page__item ui-card">
                    <header className="cart-page__item-header">
                      <h2 className="cart-page__item-title">
                        Product #{line.sku.value}
                      </h2>
                    </header>

                    <div className="cart-page__item-details">
                      <p>Unit price: {formatMoney(line.unitPrice)}</p>
                      <p>Quantity: {line.quantity.value}</p>
                      <p>Line subtotal: {formatMoney(lineSubtotal)}</p>
                    </div>

                    <div className="cart-page__item-actions">
                      <button
                        type="button"
                        className="ui-button ui-button--secondary"
                        onClick={() => handleDecrease(line)}
                      >
                        Decrease quantity
                      </button>

                      <button
                        type="button"
                        className="ui-button ui-button--secondary"
                        onClick={() => handleIncrease(line)}
                      >
                        Increase quantity
                      </button>

                      <button
                        type="button"
                        className="ui-button ui-button--danger"
                        onClick={() => handleRemove(line)}
                      >
                        Remove item
                      </button>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>

          <footer className="cart-page__summary ui-card">
            <div className="cart-page__summary-row">
              <p className="cart-page__summary-label">Subtotal</p>
              <p className="cart-page__summary-value">
                {subtotal
                  ? formatMoney(subtotal)
                  : formatMoney({ amount: 0, currency: "USD" })}
              </p>
            </div>

            <div className="ui-actions">
              <Link to="/" className="ui-button-link ui-button-link--secondary">
                Continue shopping
              </Link>

              <Link
                to="/checkout"
                className="ui-button-link ui-button-link--primary"
              >
                Proceed to checkout
              </Link>
            </div>
          </footer>
        </>
      )}
    </section>
  );
}
