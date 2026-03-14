export class ProductRepository {
  async getProducts() {
    throw new Error("ProductRepository.getProducts must be implemented");
  }

  async getProductById(productId) {
    throw new Error("ProductRepository.getProductById must be implemented");
  }
}