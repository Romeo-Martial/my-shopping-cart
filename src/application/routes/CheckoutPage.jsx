import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../features/cart/ui/hooks/useCart";
import { useCheckout } from "../../features/checkout/ui/hooks/useCheckout";
import "./checkoutPage.css";

function formatMoney(money) {
  return `${(money.amount / 100).toFixed(2)} ${money.currency}`;
}

export function CheckoutPage({ submitCheckoutAndCreateOrderUseCase }) {
  if (!submitCheckoutAndCreateOrderUseCase) {
    throw new Error(
      "CheckoutPage requires submitCheckoutAndCreateOrderUseCase",
    );
  }

  const navigate = useNavigate();
  const { cart } = useCart();

  const {
    checkout,
    startCheckout,
    setShippingAddress,
    setPaymentMethod,
    isSubmitting,
    error,
  } = useCheckout();

  const [purchaseError, setPurchaseError] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    line1: "",
    city: "",
    postalCode: "",
    country: "",
    paymentMethod: "card",
  });

  useEffect(() => {
    if (!checkout && cart) {
      const result = startCheckout({
        checkoutId: crypto.randomUUID(),
        cartId: cart.id.value,
      });

      if (result.isFailure()) {
        return;
      }
    }
  }, [checkout, cart, startCheckout]);

  useEffect(() => {
    if (!checkout) {
      return;
    }

    setForm((current) => ({
      ...current,
      fullName: checkout.shippingAddress?.fullName ?? current.fullName,
      line1: checkout.shippingAddress?.line1 ?? current.line1,
      city: checkout.shippingAddress?.city ?? current.city,
      postalCode: checkout.shippingAddress?.postalCode ?? current.postalCode,
      country: checkout.shippingAddress?.country ?? current.country,
      paymentMethod: checkout.paymentMethod?.value ?? current.paymentMethod,
    }));
  }, [checkout]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSaveShippingAddress(event) {
    event.preventDefault();
    setPurchaseError(null);

    const result = await setShippingAddress({
      fullName: form.fullName,
      line1: form.line1,
      city: form.city,
      postalCode: form.postalCode,
      country: form.country,
    });

    if (result.isFailure()) {
      setPurchaseError(result.error);
    }
  }

  async function handleSetPaymentMethod(event) {
    event.preventDefault();
    setPurchaseError(null);

    const result = await setPaymentMethod({
      paymentMethod: form.paymentMethod,
    });

    if (result.isFailure()) {
      setPurchaseError(result.error);
    }
  }

  async function handleSubmitCheckout() {
    setPurchaseError(null);

    const result = await submitCheckoutAndCreateOrderUseCase.execute({
      orderId: crypto.randomUUID(),
    });

    if (result.isFailure()) {
      setPurchaseError(result.error);
      return;
    }

    navigate(`/order-confirmation/${result.value.order.id.value}`);
  }

  if (!cart) {
    return (
      <section className="checkout-page" aria-labelledby="checkout-page-title">
        <header className="checkout-page__header">
          <h1 id="checkout-page-title" className="checkout-page__title">
            Checkout
          </h1>
        </header>

        <div className="checkout-page__empty ui-card ui-section">
          <p>No cart found.</p>
          <Link to="/" className="ui-button-link ui-button-link--secondary">
            Return to store
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page" aria-labelledby="checkout-page-title">
      <header className="checkout-page__header">
        <h1 id="checkout-page-title" className="checkout-page__title">
          Checkout
        </h1>
      </header>

      <div className="checkout-page__grid">
        <div className="checkout-page__main">
          {error ? (
            <div className="ui-alert ui-alert--error" role="alert">
              <p>{error.message}</p>
            </div>
          ) : null}

          {purchaseError ? (
            <div className="ui-alert ui-alert--error" role="alert">
              <p>{purchaseError.message}</p>
            </div>
          ) : null}

          <section
            className="ui-card ui-section"
            aria-labelledby="shipping-address-title"
          >
            <h2
              id="shipping-address-title"
              className="checkout-page__section-title"
            >
              Shipping Address
            </h2>

            <form
              className="checkout-page__form"
              onSubmit={handleSaveShippingAddress}
            >
              <div className="checkout-page__field">
                <label className="checkout-page__label" htmlFor="fullName">
                  Full name
                </label>
                <input
                  className="checkout-page__input"
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="checkout-page__field">
                <label className="checkout-page__label" htmlFor="line1">
                  Address line 1
                </label>
                <input
                  className="checkout-page__input"
                  id="line1"
                  name="line1"
                  value={form.line1}
                  onChange={handleChange}
                />
              </div>

              <div className="checkout-page__field">
                <label className="checkout-page__label" htmlFor="city">
                  City
                </label>
                <input
                  className="checkout-page__input"
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                />
              </div>

              <div className="checkout-page__field">
                <label className="checkout-page__label" htmlFor="postalCode">
                  Postal code
                </label>
                <input
                  className="checkout-page__input"
                  id="postalCode"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                />
              </div>

              <div className="checkout-page__field">
                <label className="checkout-page__label" htmlFor="country">
                  Country code
                </label>
                <input
                  className="checkout-page__input"
                  id="country"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="FR"
                />
              </div>

              <div className="ui-actions">
                <button
                  type="submit"
                  className="ui-button ui-button--secondary"
                >
                  Save shipping address
                </button>
              </div>
            </form>
          </section>

          <section
            className="ui-card ui-section"
            aria-labelledby="payment-method-title"
          >
            <h2
              id="payment-method-title"
              className="checkout-page__section-title"
            >
              Payment Method
            </h2>

            <form
              className="checkout-page__form"
              onSubmit={handleSetPaymentMethod}
            >
              <div className="checkout-page__field">
                <label className="checkout-page__label" htmlFor="paymentMethod">
                  Payment method
                </label>
                <select
                  className="checkout-page__select"
                  id="paymentMethod"
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="card">Card</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              <div className="ui-actions">
                <button
                  type="submit"
                  className="ui-button ui-button--secondary"
                >
                  Save payment method
                </button>
              </div>
            </form>
          </section>
        </div>

        <aside className="checkout-page__sidebar">
          <section className="checkout-page__summary ui-card">
            <div className="checkout-page__summary-row">
              <span className="checkout-page__summary-label">Total items</span>
              <span className="checkout-page__summary-value">
                {cart.getTotalItems()}
              </span>
            </div>

            <div className="checkout-page__summary-row">
              <span className="checkout-page__summary-label">Subtotal</span>
              <span className="checkout-page__summary-value">
                {formatMoney(cart.getSubtotal())}
              </span>
            </div>
          </section>

          <section
            className="ui-card ui-section"
            aria-labelledby="checkout-status-title"
          >
            <h2
              id="checkout-status-title"
              className="checkout-page__section-title"
            >
              Checkout Status
            </h2>

            <div className="checkout-page__status-details">
              <p className="checkout-page__status-line">
                Status: {checkout ? checkout.status.value : "not started"}
              </p>

              <p className="checkout-page__status-line">
                Ready for submission:{" "}
                {checkout && checkout.isReadyForSubmission() ? "yes" : "no"}
              </p>
            </div>

            <div className="ui-actions">
              <Link
                to="/cart"
                className="ui-button-link ui-button-link--secondary"
              >
                Return to cart
              </Link>

              <button
                type="button"
                className="ui-button ui-button--primary"
                onClick={handleSubmitCheckout}
                disabled={
                  !checkout || !checkout.isReadyForSubmission() || isSubmitting
                }
              >
                {isSubmitting ? "Submitting..." : "Submit checkout"}
              </button>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
