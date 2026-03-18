import { OrderRepository } from "../application/ports/orderRepository";
import { Order } from "../domain/order";
import { OrderId } from "../domain/valueObjects/orderId";

export class InMemoryOrderRepository extends OrderRepository {
  constructor(initialOrders = []) {
    super();

    if (!Array.isArray(initialOrders)) {
      throw new Error("initialOrders must be an array");
    }

    for (const order of initialOrders) {
      if (!(order instanceof Order)) {
        throw new Error("initialOrders must contain only Order instances");
      }
    }

    this.orders = [...initialOrders];
  }

  save(order) {
    if (!(order instanceof Order)) {
      throw new Error("order must be an Order");
    }

    const existingIndex = this.orders.findIndex((existingOrder) =>
      existingOrder.id.equals(order.id),
    );

    if (existingIndex >= 0) {
      this.orders[existingIndex] = order;
      return;
    }

    this.orders.push(order);
  }

  getById(orderId) {
    if (!(orderId instanceof OrderId)) {
      throw new Error("orderId must be an OrderId");
    }

    const order = this.orders.find((existingOrder) =>
      existingOrder.id.equals(orderId),
    );

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  }
}
