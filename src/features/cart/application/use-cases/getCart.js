export class GetCart {
  constructor(cartRepository) {
    this.cartRepository = cartRepository;
  }

  execute() {
    return this.cartRepository.getCart();
  }
}