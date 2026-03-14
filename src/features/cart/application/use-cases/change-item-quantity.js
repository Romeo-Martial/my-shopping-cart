export class ChangeItemQuantity {
  constructor(cartRepository) {
    if (!cartRepository) {
      throw new Error("cartRepository is required");
    }
    this.cartRepository = cartRepository;
  }

  execute({ sku, quantity }) {
    const cart = this.cartRepository.getCart();
    const updatedCart = cart.changeItemQuantity(sku, quantity);
    this.cartRepository.save(updatedCart);
    return updatedCart;
  }
}
