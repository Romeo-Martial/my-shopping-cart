import { Result } from "../../../_shared/domain/result";
import { DomainError } from "../../../_shared/domain/domainError";

export class GetProducts {
  constructor(productRepository) {
    if (!productRepository) {
      throw new Error("productRepository is required");
    }

    this.productRepository = productRepository;
  }

  async execute() {
    try {
      const products = await this.productRepository.getProducts();
      return Result.success(products);
    } catch (err) {
      return Result.failure(
        new DomainError("GET_PRODUCTS_FAILED", err.message),
      );
    }
  }
}
