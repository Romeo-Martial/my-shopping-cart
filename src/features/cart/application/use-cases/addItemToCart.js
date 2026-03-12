export class AddItemToCart {
  constructor(cartRepository) {
    this.cartRepository = cartRepository;
  }

  execute({ sku, quantity, unitPrice }) {
    const cart = this.cartRepository.getCart();
    const updatedCart = cart.addItem(sku, quantity, unitPrice);
    this.cartRepository.save(updatedCart);
    return updatedCart;
  }
}
