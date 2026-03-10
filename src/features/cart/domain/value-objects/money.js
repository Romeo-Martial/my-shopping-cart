export class Money {
  constructor(amount, currency) {
    if (!Number.isInteger(amount)) {
      throw new Error("Amount must be an integer");
    }
    if (amount < 0) {
      throw new Error("Amount must be greater or equal to 0");
    }

    if (!currency || typeof currency !== "string") {
      throw new Error("Currency is required");
    }

    const normalizedCurrency = currency.trim().toUpperCase();

    if (!/^[A-Z]{3}$/.test(currency)) {
      throw new Error("currency must be 3 letters");
    }

    this.amount = amount;
    this.currency = normalizedCurrency;

    Object.freeze(this);
  }

  add(other) {
    if (!(other instanceof Money)) {
      throw new Error("Argument must be of Money type");
    }
    if (this.currency !== other.currency) {
      throw new Error("Currency mismatch");
    }

    return new Money(this.amount + other.amount, this.currency);
  }

  multiply(quantity) {
    if (!(quantity instanceof Quantity)) {
      throw new Error("Argument must be of Quantity type");
    }
    return new Money(this.amount * quantity.value, this.currency);
  }
  equals(other) {
    if (!(other instanceof Money)) {
      throw new Error("Argument must be of Money type");
    }
    return this.amount === other.amount && this.currency === other.currency;
  }
}
