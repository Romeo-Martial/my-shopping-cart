import { Money } from "./value-objects/money";
import { Quantity } from "./value-objects/quantity";
import { Sku } from "./value-objects/sku";

class CartLine {
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
    new CartLine(this.sku, newQuantity, this.unitPrice);
  }
}
