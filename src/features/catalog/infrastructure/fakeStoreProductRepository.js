import { ProductRepository } from "../application/ports/productRepository";
import { ProductId } from "../domain/valueObjects/productId";
import { FakeStoreProductMapper } from "./fakeStoreProductMapper";

export class FakeStoreProductRepository extends ProductRepository {
  constructor(httpClient) {
    super();

    if (!httpClient) {
      throw new Error("httpClient is required");
    }

    this.httpClient = httpClient;
  }

  async getProducts() {
    const dtos = await this.httpClient.get("/products");
    return FakeStoreProductMapper.toDomainList(dtos);
  }

  async getProductById(productId) {
    const normalizedId =
      productId instanceof ProductId ? productId.value : productId;

    const dto = await this.httpClient.get(`/products/${normalizedId}`);
    return FakeStoreProductMapper.toDomain(dto);
  }
}
