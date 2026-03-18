import { Result } from "../../../_shared/domain/result";
import { DomainError } from "../../../_shared/domain/domainError";
import { OrderId } from "../../domain/valueObjects/orderId";

export class GetOrderById {
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

      return Result.success(order);
    } catch (err) {
      return Result.failure(
        new DomainError("GET_ORDER_BY_ID_FAILED", err.message),
      );
    }
  }
}
