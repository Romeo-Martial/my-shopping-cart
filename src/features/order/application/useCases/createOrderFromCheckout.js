import { Result } from "../../../_shared/domain/result";
import { DomainError } from "../../../_shared/domain/domainError";

import { Order } from "../../domain/order";
import { OrderId } from "../../domain/valueObjects/orderId";
import { OrderLine } from "../../domain/orderLine";

export class CreateOrderFromCheckout {
  constructor(orderRepository, cartRepository, checkoutRepository) {
    if (!orderRepository) {
      throw new Error("orderRepository is required");
    }

    if (!cartRepository) {
      throw new Error("cartRepository is required");
    }

    if (!checkoutRepository) {
      throw new Error("checkoutRepository is required");
    }

    this.orderRepository = orderRepository;
    this.cartRepository = cartRepository;
    this.checkoutRepository = checkoutRepository;
  }

  execute({ orderId }) {
    try {
      const cart = this.cartRepository.getCart();
      const checkout = this.checkoutRepository.getCurrent();

      if (!checkout.isReadyForSubmission() && !checkout.status.isSubmitted()) {
        return Result.failure(
          new DomainError(
            "CHECKOUT_NOT_READY",
            "Checkout is not ready to create an order",
          ),
        );
      }

      const lines = cart.lines.map((line) => {
        return new OrderLine({
          sku: line.sku,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
        });
      });

      const order = new Order({
        id: new OrderId(orderId),
        lines,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
      });

      this.orderRepository.save(order);

      return Result.success(order);
    } catch (err) {
      return Result.failure(
        new DomainError("CREATE_ORDER_FROM_CHECKOUT_FAILED", err.message),
      );
    }
  }
}
