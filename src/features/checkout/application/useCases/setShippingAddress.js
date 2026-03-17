import { Result } from "../../../_shared/domain/result";
import { DomainError } from "../../../_shared/domain/domainError";
import { ShippingAddress } from "../../domain/valueObjects/shippingAddress";

export class SetShippingAddress {
  constructor(checkoutRepository) {
    if (!checkoutRepository) {
      throw new Error("checkoutRepository is required");
    }

    this.checkoutRepository = checkoutRepository;
  }

  execute({ fullName, line1, city, postalCode, country }) {
    try {
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

      return Result.success(updatedCheckout);
    } catch (err) {
      return Result.failure(
        new DomainError("SET_SHIPPING_ADDRESS_FAILED", err.message),
      );
    }
  }
}
