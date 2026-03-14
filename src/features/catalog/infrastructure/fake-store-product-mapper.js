import { Product } from "../domain/product";
import { ProductId } from "../domain/value-objects/product-id";
import { ProductName } from "../domain/value-objects/product-name";
import { ProductImageUrl } from "../domain/value-objects/product-image-url";
import { ProductCategory } from "../domain/value-objects/product-category";
import { Money } from "../../cart/domain/value-objects/money";

export class FakeStoreProductMapper {
  static toDomain(dto) {
    if (!dto || typeof dto !== "object") {
      throw new Error("Product DTO must be an object");
    }

    const { id, title, price, image, category } = dto;

    if (typeof price !== "number" || Number.isNaN(price)) {
      throw new Error("Product DTO price must be a valid number");
    }

    return new Product({
      id: new ProductId(id),
      name: new ProductName(title),
      price: new Money(Math.round(price * 100), "EUR"),
      imageUrl: new ProductImageUrl(image),
      category: new ProductCategory(category),
    });
  }

  static toDomainList(dtos) {
    if (!Array.isArray(dtos)) {
      throw new Error("Expected an array of product DTOs");
    }

    return dtos.map((dto) => this.toDomain(dto));
  }
}
