import { GetProducts } from "../../features/catalog/application/useCases/getProducts";
import { GetProductById } from "../../features/catalog/application/useCases/getProductById";
import { FakeStoreHttpClient } from "../../features/catalog/infrastructure/fakeStoreHttpClient";
import { FakeStoreProductRepository } from "../../features/catalog/infrastructure/fakeStoreProductRepository";

export function createCatalogDependencies() {
  const httpClient = new FakeStoreHttpClient("https://fakestoreapi.com");
  const productRepository = new FakeStoreProductRepository(httpClient);

  return {
    getProducts: new GetProducts(productRepository),
    getProductById: new GetProductById(productRepository),
  };
}
