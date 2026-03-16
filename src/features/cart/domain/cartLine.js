import { Money } from "./valueObjects/money.js";
import { Quantity } from "./valueObjects/quantity.js";
import { Sku } from "./valueObjects/sku.js";

export class CartLine {
  constructor(sku, quantity, unitPrice) {
    if (!(sku instanceof Sku)) {
      throw new Error("sku should be of type Sku");
    }
    if (!(quantity instanceof Quantity)) {
      throw new Error("quantity should be of type Quantity");
    }
    if (!(unitPrice instanceof Money)) {
      throw new Error("initPrice should be of type Money");
    }
    this.sku = sku;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    Object.freeze(this);
  }

  getSubtotal() {
    return this.unitPrice.multiply(this.quantity);
  }

  sameSku(otherSku) {
    return this.sku.equals(otherSku);
  }

  changeQuantity(newQuantity) {
    if (!(newQuantity instanceof Quantity)) {
      throw new Error("Argument must be of type Quantity");
    }
    return new CartLine(this.sku, newQuantity, this.unitPrice);
  }
}
