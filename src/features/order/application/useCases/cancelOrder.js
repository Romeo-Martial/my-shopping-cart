import { Result } from "../../../_shared/domain/result";
import { DomainError } from "../../../_shared/domain/domainError";
import { OrderId } from "../../domain/valueObjects/orderId";

export class CancelOrder {
  constructor(orderRepository) {
    if (!orderRepository) {
      throw new Error("orderRepository is required");
    }

    this.orderRepository = orderRepository;
  }

  execute({ orderId }) {
    try {
      const domainOrderId = new OrderId(orderId);
      const order = this.orderRepository.getById(domainOrderId);

      const updatedOrder = order.cancel();

      this.orderRepository.save(updatedOrder);

      return Result.success(updatedOrder);
    } catch (err) {
      return Result.failure(
        new DomainError("CANCEL_ORDER_FAILED", err.message),
      );
    }
  }
}
