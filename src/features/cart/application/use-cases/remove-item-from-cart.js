export class RemoveItemFromCart {
  constructor(cartRepository) {
    if (!cartRepository) {
      throw new Error("cartRepository is required");
    }
    this.cartRepository = cartRepository;
  }

  execute({ sku }) {
    const cart = this.cartRepository.getCart();
    const updatedCart = cart.removeItem(sku);
    this.cartRepository.save(updatedCart);
    return updatedCart;
  }
}
