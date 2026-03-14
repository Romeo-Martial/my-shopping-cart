export class GetCart {
  constructor(cartRepository) {
    if (!cartRepository) {
      throw new Error("cartRepository is required");
    }
    this.cartRepository = cartRepository;
  }

  execute() {
    return this.cartRepository.getCart();
  }
}
