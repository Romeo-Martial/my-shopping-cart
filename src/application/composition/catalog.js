import { GetProducts } from "../../features/catalog/application/use-cases/get-products";
import { GetProductById } from "../../features/catalog/application/use-cases/get-product-by-id";
import { FakeStoreHttpClient } from "../../features/catalog/infrastructure/fake-store-http-client";
import { FakeStoreProductRepository } from "../../features/catalog/infrastructure/fake-store-product-repository";

export function createCatalogDependencies() {
  const httpClient = new FakeStoreHttpClient("https://fakestoreapi.com");
  const productRepository = new FakeStoreProductRepository(httpClient);

  return {
    getProducts: new GetProducts(productRepository),
    getProductById: new GetProductById(productRepository),
  };
}
