export class ChangeItemQuantity {
  constructor(cartRepository) {
    this.cartRepository = cartRepository;
  }

  execute({ sku, quantity }) {
    const cart = this.cartRepository.getCart();
    const updatedCart = cart.changeItemQuantity(sku, quantity);
    this.cartRepository.save(updatedCart);
    return updatedCart;
  }
}
