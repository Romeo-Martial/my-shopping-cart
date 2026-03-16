export class GetCheckout {
  constructor(checkoutRepository) {
    if (!checkoutRepository) {
      throw new Error("checkoutRepository is required");
    }

    this.checkoutRepository = checkoutRepository;
  }

  execute() {
    return this.checkoutRepository.getCurrent();
  }
}
