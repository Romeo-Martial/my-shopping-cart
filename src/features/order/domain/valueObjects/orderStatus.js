export class OrderStatus {
  static ALLOWED_VALUES = ["placed", "paid", "cancelled"];

  constructor(value) {
    if (typeof value !== "string") {
      throw new Error("OrderStatus must be a string");
    }

    const normalized = value.trim().toLowerCase();

    if (!OrderStatus.ALLOWED_VALUES.includes(normalized)) {
      throw new Error("OrderStatus must be one of: placed, paid, cancelled");
    }

    this.value = normalized;
    Object.freeze(this);
  }

  isPlaced() {
    return this.value === "placed";
  }

  isPaid() {
    return this.value === "paid";
  }

  isCancelled() {
    return this.value === "cancelled";
  }

  equals(other) {
    return other instanceof OrderStatus && this.value === other.value;
  }
}
