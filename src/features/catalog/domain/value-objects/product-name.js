export class ProductName {
  constructor(value) {
    if (typeof value !== "string") {
      throw new Error("ProductName must be a string");
    }

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new Error("ProductName cannot be empty");
    }

    if (trimmed.length > 120) {
      throw new Error("ProductName cannot exceed 120 characters");
    }

    this.value = trimmed;
    Object.freeze(this);
  }

  equals(other) {
    return other instanceof ProductName && this.value === other.value;
  }
}
