export class OrderRepository {
  save(order) {
    throw new Error("OrderRepository.save must be implemented");
  }

  getById(orderId) {
    throw new Error("OrderRepository.getById must be implemented");
  }
}
