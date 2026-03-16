export class ProductCategory {
  constructor(value) {
    if (typeof value !== "string") {
      throw new Error("ProductCategory must be a string");
    }

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new Error("ProductCategory cannot be empty");
    }

    if (trimmed.length > 50) {
      throw new Error("ProductCategory cannot exceed 50 characters");
    }

    this.value = trimmed;
    Object.freeze(this);
  }

  equals(other) {
    return other instanceof ProductCategory && this.value === other.value;
  }
}
