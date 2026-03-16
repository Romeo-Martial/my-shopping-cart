export class GetProductById {
  constructor(productRepository) {
    if (!productRepository) {
      throw new Error("productRepository is required");
    }

    this.productRepository = productRepository;
  }

  async execute({ productId }) {
    return this.productRepository.getProductById(productId);
  }
}
