import { Sku } from "../../domain/valueObjects/sku";
import { Quantity } from "../../domain/valueObjects/quantity";
import { Money } from "../../domain/valueObjects/money";

export class AddItemToCart {
  constructor(cartRepository) {
    if (!cartRepository) {
      throw new Error("cartRepository is required");
    }

    this.cartRepository = cartRepository;
  }

  execute({ sku, quantity, unitPriceAmount, currency }) {
    const cart = this.cartRepository.getCart();

    const domainSku = new Sku(sku);
    const domainQuantity = new Quantity(quantity);
    const domainUnitPrice = new Money(unitPriceAmount, currency);

    const updatedCart = cart.addItem(
      domainSku,
      domainQuantity,
      domainUnitPrice,
    );

    this.cartRepository.save(updatedCart);

    return updatedCart;
  }
}
