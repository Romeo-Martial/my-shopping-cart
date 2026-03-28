import { CartRepository } from "../application/ports/cartRepository";
import { Cart } from "../domain/cart";
import { CartId } from "../domain/valueObjects/cartId";
import { CartLine } from "../domain/cartLine";
import { Money } from "../domain/valueObjects/money";
import { Quantity } from "../domain/valueObjects/quantity";
import { Sku } from "../domain/valueObjects/sku";

const STORAGE_KEY = "ddd-ecommerce-cart";

function serializeCart(cart) {
  return {
    id: cart.id.value,
    lines: cart.lines.map((line) => ({
      sku: line.sku.value,
      quantity: line.quantity.value,
      unitPriceAmount: line.unitPrice.amount,
      currency: line.unitPrice.currency,
    })),
  };
}

function deserializeCart(rawCart) {
  if (!rawCart) {
    return null;
  }

  return new Cart(
    new CartId(rawCart.id),
    rawCart.lines.map(
      (line) =>
        new CartLine(
          new Sku(line.sku),
          new Quantity(line.quantity),
          new Money(line.unitPriceAmount, line.currency),
        ),
    ),
  );
}

export class LocalStorageCartRepository extends CartRepository {
  getCart() {
    const rawValue = localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return new Cart(new CartId(crypto.randomUUID()), []);
    }

    const parsed = JSON.parse(rawValue);
    const cart = deserializeCart(parsed);

    if (!cart) {
      return new Cart(new CartId(crypto.randomUUID()), []);
    }

    return cart;
  }

  save(cart) {
    const serialized = serializeCart(cart);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  }
}
