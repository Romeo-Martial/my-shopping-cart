export class GetProducts {
  constructor(productRepository) {
    if (!productRepository) {
      throw new Error("productRepository is required");
    }

    this.productRepository = productRepository;
  }

  async execute() {
    return this.productRepository.getProducts();
  }
}
