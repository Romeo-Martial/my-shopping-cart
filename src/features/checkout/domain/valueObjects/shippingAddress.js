export class ShippingAddress {
  constructor({ fullName, line1, city, postalCode, country }) {
    this.fullName = ShippingAddress.#validateRequiredString(
      fullName,
      "fullName",
    );
    this.line1 = ShippingAddress.#validateRequiredString(line1, "line1");
    this.city = ShippingAddress.#validateRequiredString(city, "city");
    this.postalCode = ShippingAddress.#validateRequiredString(
      postalCode,
      "postalCode",
    );
    this.country = ShippingAddress.#validateCountry(country);

    Object.freeze(this);
  }

  static #validateRequiredString(value, fieldName) {
    if (typeof value !== "string") {
      throw new Error(`${fieldName} must be a string`);
    }

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new Error(`${fieldName} cannot be empty`);
    }

    return trimmed;
  }

  static #validateCountry(value) {
    if (typeof value !== "string") {
      throw new Error("country must be a string");
    }

    const normalized = value.trim().toUpperCase();

    if (!/^[A-Z]{2}$/.test(normalized)) {
      throw new Error("country must be a 2-letter country code");
    }

    return normalized;
  }

  equals(other) {
    return (
      other instanceof ShippingAddress &&
      this.fullName === other.fullName &&
      this.line1 === other.line1 &&
      this.city === other.city &&
      this.postalCode === other.postalCode &&
      this.country === other.country
    );
  }
}
