import { Result } from "../../../_shared/domain/result";
import { DomainError } from "../../../_shared/domain/domainError";

export class GetProductById {
  constructor(productRepository) {
    if (!productRepository) {
      throw new Error("productRepository is required");
    }

    this.productRepository = productRepository;
  }

  async execute({ productId }) {
    try {
      const product = await this.productRepository.getProductById(productId);
      return Result.success(product);
    } catch (err) {
      return Result.failure(
        new DomainError("GET_PRODUCT_BY_ID_FAILED", err.message),
      );
    }
  }
}
