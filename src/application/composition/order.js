import { LocalStorageOrderRepository } from "../../features/order/infrastructure/localStorageOrderRepository";
import { CreateOrderFromCheckout } from "../../features/order/application/useCases/createOrderFromCheckout";
import { GetOrderById } from "../../features/order/application/useCases/getOrderById";
import { MarkOrderPaid } from "../../features/order/application/useCases/markOrderPaid";
import { CancelOrder } from "../../features/order/application/useCases/cancelOrder";

export function createOrderDependencies({
  cartRepository,
  checkoutRepository,
}) {
  if (!cartRepository) {
    throw new Error("cartRepository is required");
  }

  if (!checkoutRepository) {
    throw new Error("checkoutRepository is required");
  }

  const orderRepository = new LocalStorageOrderRepository();

  return {
    orderRepository,
    createOrderFromCheckoutUseCase: new CreateOrderFromCheckout(
      orderRepository,
      cartRepository,
      checkoutRepository,
    ),
    getOrderByIdUseCase: new GetOrderById(orderRepository),
    markOrderPaidUseCase: new MarkOrderPaid(orderRepository),
    cancelOrderUseCase: new CancelOrder(orderRepository),
  };
}
