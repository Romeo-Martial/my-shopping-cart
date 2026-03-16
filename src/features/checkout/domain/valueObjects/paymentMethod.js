export class PaymentMethod {
  static ALLOWED_VALUES = ["card", "paypal"];

  constructor(value) {
    if (typeof value !== "string") {
      throw new Error("PaymentMethod must be a string");
    }

    const normalized = value.trim().toLowerCase();

    if (!PaymentMethod.ALLOWED_VALUES.includes(normalized)) {
      throw new Error("PaymentMethod must be one of: card, paypal");
    }

    this.value = normalized;
    Object.freeze(this);
  }

  equals(other) {
    return other instanceof PaymentMethod && this.value === other.value;
  }
}
