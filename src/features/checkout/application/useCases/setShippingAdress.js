import { ShippingAddress } from "../../domain/value-objects/ShippingAddress";

export class SetShippingAddress {
  constructor(checkoutRepository) {
    if (!checkoutRepository) {
      throw new Error("checkoutRepository is required");
    }

    this.checkoutRepository = checkoutRepository;
  }

  execute({ fullName, line1, city, postalCode, country }) {
    const checkoutDraft = this.checkoutRepository.getCurrent();

    const shippingAddress = new ShippingAddress({
      fullName,
      line1,
      city,
      postalCode,
      country,
    });

    const updatedCheckout = checkoutDraft.setShippingAddress(shippingAddress);

    this.checkoutRepository.save(updatedCheckout);

    return updatedCheckout;
  }
}
