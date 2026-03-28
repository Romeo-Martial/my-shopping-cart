import { OrderRepository } from "../application/ports/orderRepository";
import { Order } from "../domain/order";
import { OrderId } from "../domain/valueObjects/orderId";
import { OrderLine } from "../domain/orderLine";
import { OrderStatus } from "../domain/valueObjects/orderStatus";
import { PaymentMethod } from "../../checkout/domain/valueObjects/paymentMethod";
import { ShippingAddress } from "../../checkout/domain/valueObjects/shippingAddress";
import { Money } from "../../cart/domain/valueObjects/money";
import { Quantity } from "../../cart/domain/valueObjects/quantity";
import { Sku } from "../../cart/domain/valueObjects/sku";

const STORAGE_KEY = "ddd-ecommerce-orders";

function serializeOrder(order) {
  return {
    id: order.id.value,
    status: order.status.value,
    paymentMethod: order.paymentMethod.value,
    shippingAddress: {
      fullName: order.shippingAddress.fullName,
      line1: order.shippingAddress.line1,
      city: order.shippingAddress.city,
      postalCode: order.shippingAddress.postalCode,
      country: order.shippingAddress.country,
    },
    lines: order.lines.map((line) => ({
      sku: line.sku.value,
      quantity: line.quantity.value,
      unitPriceAmount: line.unitPrice.amount,
      currency: line.unitPrice.currency,
    })),
  };
}

function deserializeOrder(rawOrder) {
  return new Order({
    id: new OrderId(rawOrder.id),
    status: new OrderStatus(rawOrder.status),
    paymentMethod: new PaymentMethod(rawOrder.paymentMethod),
    shippingAddress: new ShippingAddress(rawOrder.shippingAddress),
    lines: rawOrder.lines.map(
      (line) =>
        new OrderLine({
          sku: new Sku(line.sku),
          quantity: new Quantity(line.quantity),
          unitPrice: new Money(line.unitPriceAmount, line.currency),
        }),
    ),
  });
}

export class LocalStorageOrderRepository extends OrderRepository {
  constructor(initialOrders = []) {
    super();
    this.orders = initialOrders;
  }

  getById(orderId) {
    const rawValue = localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue);
    const orders = parsed.map(deserializeOrder);

    return orders.find((order) => order.id.equals(orderId)) ?? null;
  }

  save(order) {
    const rawValue = localStorage.getItem(STORAGE_KEY);
    const parsed = rawValue ? JSON.parse(rawValue) : [];

    const nextOrders = parsed.filter((item) => item.id !== order.id.value);
    nextOrders.push(serializeOrder(order));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOrders));
  }
}
