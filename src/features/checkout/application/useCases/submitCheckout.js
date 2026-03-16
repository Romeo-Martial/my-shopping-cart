export class SubmitCheckout {
  constructor(checkoutRepository) {
    if (!checkoutRepository) {
      throw new Error("checkoutRepository is required");
    }

    this.checkoutRepository = checkoutRepository;
  }

  execute() {
    const checkoutDraft = this.checkoutRepository.getCurrent();
    const submittedCheckout = checkoutDraft.submit();

    this.checkoutRepository.save(submittedCheckout);

    return submittedCheckout;
  }
}
