import { ProductId } from "./value-objects/product-id";
import { ProductName } from "./value-objects/product-name";
import { ProductImageUrl } from "./value-objects/product-image-url";
import { ProductCategory } from "./value-objects/product-category";
import { Money } from "../../cart/domain/value-objects/money";

export class Product {
  constructor({ id, name, price, imageUrl, category }) {
    if (!(id instanceof ProductId)) {
      throw new Error("id must be of type ProductId");
    }

    if (!(name instanceof ProductName)) {
      throw new Error("name must be of type ProductName");
    }

    if (!(price instanceof Money)) {
      throw new Error("price must be of type Money");
    }

    if (!(imageUrl instanceof ProductImageUrl)) {
      throw new Error("imageUrl must be of type ProductImageUrl");
    }

    if (!(category instanceof ProductCategory)) {
      throw new Error("category must be of type ProductCategory");
    }

    this.id = id;
    this.name = name;
    this.price = price;
    this.imageUrl = imageUrl;
    this.category = category;

    Object.freeze(this);
  }

  rename(newName) {
    return new Product({
      id: this.id,
      name: newName,
      price: this.price,
      imageUrl: this.imageUrl,
      category: this.category,
    });
  }

  changePrice(newPrice) {
    return new Product({
      id: this.id,
      name: this.name,
      price: newPrice,
      imageUrl: this.imageUrl,
      category: this.category,
    });
  }

  changeImage(newImageUrl) {
    return new Product({
      id: this.id,
      name: this.name,
      price: this.price,
      imageUrl: newImageUrl,
      category: this.category,
    });
  }

  changeCategory(newCategory) {
    return new Product({
      id: this.id,
      name: this.name,
      price: this.price,
      imageUrl: this.imageUrl,
      category: newCategory,
    });
  }
}
