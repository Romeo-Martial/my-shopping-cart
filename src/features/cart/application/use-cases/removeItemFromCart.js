export class RemoveItemFromCart {
  constructor(cartRepository) {
    this.cartRepository = cartRepository;
  }

  execute({ sku }) {
    const cart = this.cartRepository.getCart();
    const updatedCart = cart.removeItem(sku);
    this.cartRepository.save(updatedCart);
    return updatedCart;
  }
}
