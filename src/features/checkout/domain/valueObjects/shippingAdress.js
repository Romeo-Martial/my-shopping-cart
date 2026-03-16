export class CheckoutId {
  constructor(value) {
    if (typeof value !== "string") {
      throw new Error("CheckoutId must be a string");
    }

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new Error("CheckoutId cannot be empty");
    }

    const uuidLikeRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidLikeRegex.test(trimmed)) {
      throw new Error("CheckoutId must be a valid UUID");
    }

    this.value = trimmed;
    Object.freeze(this);
  }

  equals(other) {
    return other instanceof CheckoutId && this.value === other.value;
  }
}
