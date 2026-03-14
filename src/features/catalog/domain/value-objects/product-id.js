export class ProductId {
  constructor(value) {
    if (!Number.isInteger(value)) {
      throw new Error("ProductId must be an integer");
    }

    if (value <= 0) {
      throw new Error("ProductId must be greater than 0");
    }

    this.value = value;
    Object.freeze(this);
  }

  equals(other) {
    return other instanceof ProductId && this.value === other.value;
  }
}
