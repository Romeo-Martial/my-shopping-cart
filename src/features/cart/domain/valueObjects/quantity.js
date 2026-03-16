export class Quantity {
  constructor(value) {
    if (!Number.isInteger(value)) {
      throw new Error("Quantity must be an integer");
    }
    if (value < 1) {
      throw new Error("Quantity must be greater or equal to 1");
    }
    if (value > 1000) {
      throw new Error("Quantity must be less than or equal to 1000");
    }

    this.value = value;
    Object.freeze(this);
  }

  add(other) {
    if (!(other instanceof Quantity)) {
      throw new Error("Argument must be of Quantity type");
    }
    return new Quantity(this.value + other.value);
  }
  increase(by) {
    if (!Number.isInteger(by)) {
      throw new Errow("Argument must be an integer");
    }
    if (by < 1) {
      throw new Errow("Argument must be greater or equal to 1");
    }
    if (this.value + by > 1000) {
      throw new Error("Quantity cannot exceed 1000");
    }
    return new Quantity(this.value + by);
  }
  decrease(by) {
    if (!Number.isInteger(by)) {
      throw new Error("Argument must be an integer");
    }
    if (by < 1) {
      throw new Error("Argument must be greater or equal to 1");
    }
    if (this.value - by < 1) {
      throw new Error("Quantity cannot go below 1");
    }
    return new Quantity(this.value - by);
  }
}
