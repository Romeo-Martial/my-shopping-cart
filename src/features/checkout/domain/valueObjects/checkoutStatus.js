export class CheckoutStatus {
  static ALLOWED_VALUES = ["draft", "ready", "submitted"];

  constructor(value) {
    if (typeof value !== "string") {
      throw new Error("CheckoutStatus must be a string");
    }

    const normalized = value.trim().toLowerCase();

    if (!CheckoutStatus.ALLOWED_VALUES.includes(normalized)) {
      throw new Error("CheckoutStatus must be one of: draft, ready, submitted");
    }

    this.value = normalized;
    Object.freeze(this);
  }

  isDraft() {
    return this.value === "draft";
  }

  isReady() {
    return this.value === "ready";
  }

  isSubmitted() {
    return this.value === "submitted";
  }

  equals(other) {
    return other instanceof CheckoutStatus && this.value === other.value;
  }
}
