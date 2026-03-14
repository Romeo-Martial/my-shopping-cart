export class ProductImageUrl {
  constructor(value) {
    if (typeof value !== "string") {
      throw new Error("ProductImageUrl must be a string");
    }

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new Error("ProductImageUrl cannot be empty");
    }

    let url;

    try {
      url = new URL(trimmed);
    } catch {
      throw new Error("ProductImageUrl must be a valid URL");
    }

    if (url.protocol !== "https:") {
      throw new Error("ProductImageUrl must use https");
    }

    this.value = trimmed;
    Object.freeze(this);
  }

  equals(other) {
    return other instanceof ProductImageUrl && this.value === other.value;
  }
}
