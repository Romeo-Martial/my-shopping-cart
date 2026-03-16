import { CartId } from "./valueObjects/cartId.js";
import { CartLine } from "./cartLine.js";
import { Money } from "./valueObjects/money.js";

export class Cart {
  constructor(id, lines) {
    if (!(id instanceof CartId)) {
      throw new Error("id must be of type CartId");
    }
    lines.forEach((line) => {
      if (!(line instanceof CartLine)) {
        throw new Error("lines must be an array of CartLine");
      }
    });
    const seen = new Set();

    for (const line of lines) {
      const key = line.sku.value;
      if (seen.has(key)) {
        throw new Error("Duplicate SKU in cart");
      }
      seen.add(key);
    }
    this.id = id;
    this.lines = lines;
    Object.freeze(this);
  }

  addItem(sku, quantity, unitPrice) {
    const existing = this.lines.find((line) => line.sku.equals(sku));

    if (existing) {
      const newQuantity = existing.quantity.add(quantity);

      const newLines = this.lines.map((line) =>
        line.sku.equals(sku) ? new CartLine(sku, newQuantity, unitPrice) : line,
      );

      return new Cart(this.id, newLines);
    }

    const newLines = [...this.lines, new CartLine(sku, quantity, unitPrice)];

    return new Cart(this.id, newLines);
  }

  removeItem(sku) {
    const newLines = this.lines.filter((line) => !line.sku.equals(sku));

    return new Cart(this.id, newLines);
  }

  changeItemQuantity(sku, quantity) {
    const newLines = this.lines.map((line) =>
      line.sku.equals(sku) ? line.changeQuantity(quantity) : line,
    );

    return new Cart(this.id, newLines);
  }

  hasItem(sku) {
    const skus = this.lines.map((elt) => elt.sku);
    return skus.includes(sku);
  }

  getSubtotal() {
    if (this.lines.length === 0) {
      return new Money(0, "EUR");
    }

    return this.lines.reduce(
      (total, line) => total.add(line.getSubtotal()),
      new Money(0, this.lines[0].unitPrice.currency),
    );
  }

  getTotalItems() {
    return this.lines.reduce((total, line) => total + line.quantity.value, 0);
  }
}
