import { OrderId } from "./valueObjects/orderId";
import { OrderStatus } from "./valueObjects/orderStatus";
import { OrderLine } from "./orderLine";
import { ShippingAddress } from "../../checkout/domain/valueObjects/shippingAddress";
import { PaymentMethod } from "../../checkout/domain/valueObjects/paymentMethod";
import { Money } from "../../cart/domain/valueObjects/money";

export class Order {
  constructor({
    id,
    lines,
    shippingAddress,
    paymentMethod,
    status = new OrderStatus("placed"),
  }) {
    if (!(id instanceof OrderId)) {
      throw new Error("id must be of type OrderId");
    }

    if (!Array.isArray(lines) || lines.length === 0) {
      throw new Error("lines must be a non-empty array");
    }

    for (const line of lines) {
      if (!(line instanceof OrderLine)) {
        throw new Error("lines must contain only OrderLine");
      }
    }

    if (!(shippingAddress instanceof ShippingAddress)) {
      throw new Error("shippingAddress must be of type ShippingAddress");
    }

    if (!(paymentMethod instanceof PaymentMethod)) {
      throw new Error("paymentMethod must be of type PaymentMethod");
    }

    if (!(status instanceof OrderStatus)) {
      throw new Error("status must be OrderStatus");
    }

    this.#ensureNoDuplicateSkus(lines);

    this.id = id;
    this.lines = [...lines];
    this.shippingAddress = shippingAddress;
    this.paymentMethod = paymentMethod;
    this.status = status;

    Object.freeze(this);
  }

  #ensureNoDuplicateSkus(lines) {
    const seen = new Set();

    for (const line of lines) {
      const key = line.sku.value;

      if (seen.has(key)) {
        throw new Error("Order cannot contain duplicate SKUs");
      }

      seen.add(key);
    }
  }

  getTotal() {
    return this.lines.reduce(
      (total, line) => total.add(line.getSubtotal()),
      new Money(0, this.lines[0].unitPrice.currency),
    );
  }

  markPaid() {
    if (this.status.isCancelled()) {
      throw new Error("Cancelled order cannot be marked as paid");
    }

    if (this.status.isPaid()) {
      throw new Error("Order is already paid");
    }

    return new Order({
      id: this.id,
      lines: this.lines,
      shippingAddress: this.shippingAddress,
      paymentMethod: this.paymentMethod,
      status: new OrderStatus("paid"),
    });
  }

  cancel() {
    if (this.status.isPaid()) {
      throw new Error("Paid order cannot be cancelled");
    }

    if (this.status.isCancelled()) {
      throw new Error("Order is already cancelled");
    }

    return new Order({
      id: this.id,
      lines: this.lines,
      shippingAddress: this.shippingAddress,
      paymentMethod: this.paymentMethod,
      status: new OrderStatus("cancelled"),
    });
  }
}
