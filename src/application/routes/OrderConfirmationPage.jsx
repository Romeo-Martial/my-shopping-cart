import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./orderConfirmationPage.css";

function formatMoney(money) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currency,
  }).format(money.amount / 100);
}

export function OrderConfirmationPage({ getOrderByIdUseCase }) {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function loadOrder() {
      if (!orderId) {
        if (!isCancelled) {
          setError("Missing order id.");
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      const result = await getOrderByIdUseCase.execute({ orderId });

      if (isCancelled) {
        return;
      }

      if (result.isFailure()) {
        setOrder(null);
        setError(result.error.message);
        setIsLoading(false);
        return;
      }

      setOrder(result.value);
      setIsLoading(false);
    }

    loadOrder();

    return () => {
      isCancelled = true;
    };
  }, [getOrderByIdUseCase, orderId]);

  if (isLoading) {
    return (
      <section
        className="order-confirmation-page"
        aria-labelledby="order-confirmation-title"
      >
        <div className="ui-alert" role="status">
          <h1
            id="order-confirmation-title"
            className="order-confirmation-page__title"
          >
            Order confirmation
          </h1>
          <p>Loading order...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="order-confirmation-page"
        aria-labelledby="order-confirmation-title"
      >
        <div className="ui-alert ui-alert--error" role="alert">
          <h1
            id="order-confirmation-title"
            className="order-confirmation-page__title"
          >
            Order confirmation
          </h1>
          <p>{error}</p>

          <div className="order-confirmation-page__status-actions">
            <Link to="/" className="ui-button-link ui-button-link--secondary">
              Return to store
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section
        className="order-confirmation-page"
        aria-labelledby="order-confirmation-title"
      >
        <div className="ui-alert ui-alert--error" role="alert">
          <h1
            id="order-confirmation-title"
            className="order-confirmation-page__title"
          >
            Order confirmation
          </h1>
          <p>Order could not be loaded.</p>

          <div className="order-confirmation-page__status-actions">
            <Link to="/" className="ui-button-link ui-button-link--secondary">
              Return to store
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const total = order.getTotal();

  return (
    <section
      className="order-confirmation-page"
      aria-labelledby="order-confirmation-title"
    >
      <header className="order-confirmation-page__hero">
        <p className="order-confirmation-page__eyebrow">Success</p>
        <h1
          id="order-confirmation-title"
          className="order-confirmation-page__title"
        >
          Order confirmed
        </h1>
        <p className="order-confirmation-page__description">
          Your order has been placed successfully. You can review the order
          details, shipping information, and purchased items below.
        </p>
      </header>

      <div className="order-confirmation-page__content">
        <div className="order-confirmation-page__main">
          <section
            className="ui-card ui-section"
            aria-labelledby="order-lines-title"
          >
            <h2
              id="order-lines-title"
              className="order-confirmation-page__section-title"
            >
              Order items
            </h2>

            <ul
              className="order-confirmation-page__items"
              aria-label="Order items"
            >
              {order.lines.map((line) => (
                <li key={line.sku.value}>
                  <article className="order-confirmation-page__item">
                    <h3 className="order-confirmation-page__item-title">
                      Product #{line.sku.value}
                    </h3>

                    <div className="order-confirmation-page__item-details">
                      <p>Quantity: {line.quantity.value}</p>
                      <p>Unit price: {formatMoney(line.unitPrice)}</p>
                      <p>Line subtotal: {formatMoney(line.getSubtotal())}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="order-confirmation-page__sidebar">
          <section className="ui-card ui-section">
            <h2 className="order-confirmation-page__section-title">
              Order summary
            </h2>

            <dl className="order-confirmation-page__summary">
              <div className="order-confirmation-page__summary-row">
                <dt className="order-confirmation-page__summary-label">
                  Order ID
                </dt>
                <dd className="order-confirmation-page__summary-value">
                  {order.id.value}
                </dd>
              </div>

              <div className="order-confirmation-page__summary-row">
                <dt className="order-confirmation-page__summary-label">
                  Status
                </dt>
                <dd className="order-confirmation-page__summary-value">
                  {order.status.value}
                </dd>
              </div>

              <div className="order-confirmation-page__summary-row">
                <dt className="order-confirmation-page__summary-label">
                  Payment method
                </dt>
                <dd className="order-confirmation-page__summary-value">
                  {order.paymentMethod.value}
                </dd>
              </div>

              <div className="order-confirmation-page__summary-row">
                <dt className="order-confirmation-page__summary-label">
                  Total
                </dt>
                <dd className="order-confirmation-page__summary-value">
                  {formatMoney(total)}
                </dd>
              </div>
            </dl>
          </section>

          <section
            className="ui-card ui-section"
            aria-labelledby="shipping-address-title"
          >
            <h2
              id="shipping-address-title"
              className="order-confirmation-page__section-title"
            >
              Shipping address
            </h2>

            <address className="order-confirmation-page__address">
              <div>{order.shippingAddress.fullName}</div>
              <div>{order.shippingAddress.line1}</div>
              <div>
                {order.shippingAddress.postalCode} {order.shippingAddress.city}
              </div>
              <div>{order.shippingAddress.country}</div>
            </address>
          </section>

          <nav className="ui-actions" aria-label="Order confirmation actions">
            <Link to="/" className="ui-button-link ui-button-link--primary">
              Return to store
            </Link>
          </nav>
        </aside>
      </div>
    </section>
  );
}
