export class CheckoutRepository {
  getCurrent() {
    throw new Error("CheckoutRepository.getCurrent must be implemented");
  }

  save(checkoutDraft) {
    throw new Error("CheckoutRepository.save must be implemented");
  }
}
