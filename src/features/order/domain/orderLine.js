import { Sku } from "../../cart/domain/valueObjects/sku";
import { Quantity } from "../../cart/domain/valueObjects/quantity";
import { Money } from "../../cart/domain/valueObjects/money";

export class OrderLine {
  constructor({ sku, quantity, unitPrice }) {
    if (!(sku instanceof Sku)) {
      throw new Error("sku must be Sku");
    }

    if (!(quantity instanceof Quantity)) {
      throw new Error("quantity must be Quantity");
    }

    if (!(unitPrice instanceof Money)) {
      throw new Error("unitPrice must be Money");
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
}
