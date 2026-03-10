export class Sku {
  constructor(value) {
    if (typeof value !== "string") {
      throw new Error("SKU must be a string");
    }
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new Error("SKU cannot be empty");
    }
    if (trimmed.length > 50) {
      throw new Error("SKU cannot be more than 50 characters");
    }

    this.value = trimmed;
    Object.freeze(this);
  }
  equals(other) {
    if (!(other instanceof Sku)) {
      return new Error("Argument must be of type Sku");
    }
    return this.value === other.value;
  }
}
