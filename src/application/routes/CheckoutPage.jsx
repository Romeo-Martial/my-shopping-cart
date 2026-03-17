import { useEffect, useState } from "react";
import { useCart } from "../../features/cart/ui/hooks/useCart";
import { useCheckout } from "../../features/checkout/ui/hooks/useCheckout";

export function CheckoutPage() {
  const { cart } = useCart();

  const {
    checkout,
    startCheckout,
    setShippingAddress,
    setPaymentMethod,
    submitCheckout,
    isSubmitting,
    error,
  } = useCheckout();

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
      startCheckout({
        checkoutId: crypto.randomUUID(),
        cartId: cart.id.value,
      });
    }
  }, [checkout, cart, startCheckout]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveShippingAddress = (event) => {
    event.preventDefault();

    setShippingAddress({
      fullName: form.fullName,
      line1: form.line1,
      city: form.city,
      postalCode: form.postalCode,
      country: form.country,
    });
  };

  const handleSetPaymentMethod = (event) => {
    event.preventDefault();

    setPaymentMethod({
      paymentMethod: form.paymentMethod,
    });
  };

  const handleSubmitCheckout = async () => {
    await submitCheckout();
  };

  if (!cart) {
    return <p>No cart found.</p>;
  }

  return (
    <div>
      <h1>Checkout</h1>

      <p>Total items: {cart.getTotalItems()}</p>
      <p>
        Subtotal: {(cart.getSubtotal().amount / 100).toFixed(2)}{" "}
        {cart.getSubtotal().currency}
      </p>

      {error && <p style={{ color: "red" }}>{error.message}</p>}

      <section>
        <h2>Shipping Address</h2>

        <form onSubmit={handleSaveShippingAddress}>
          <div>
            <label>Full name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Address line 1</label>
            <input name="line1" value={form.line1} onChange={handleChange} />
          </div>

          <div>
            <label>City</label>
            <input name="city" value={form.city} onChange={handleChange} />
          </div>

          <div>
            <label>Postal code</label>
            <input
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Country</label>
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="FR"
            />
          </div>

          <button type="submit">Save shipping address</button>
        </form>
      </section>

      <section>
        <h2>Payment Method</h2>

        <form onSubmit={handleSetPaymentMethod}>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
          >
            <option value="card">Card</option>
            <option value="paypal">PayPal</option>
          </select>

          <button type="submit">Save payment method</button>
        </form>
      </section>

      <section>
        <h2>Checkout Status</h2>

        <p>Status: {checkout ? checkout.status.value : "not started"}</p>

        <p>
          Ready for submission:{" "}
          {checkout && checkout.isReadyForSubmission() ? "yes" : "no"}
        </p>

        <button
          onClick={handleSubmitCheckout}
          disabled={
            !checkout || !checkout.isReadyForSubmission() || isSubmitting
          }
        >
          {isSubmitting ? "Submitting..." : "Submit checkout"}
        </button>
      </section>
    </div>
  );
}
