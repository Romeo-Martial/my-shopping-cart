import { createCatalogDependencies } from "./catalog";
import { createCartDependencies } from "./cart";
import { createCheckoutDependencies } from "./checkout";
import { createOrderDependencies } from "./order";
import { createPurchaseDependencies } from "./purchase";

export const catalogDeps = createCatalogDependencies();
export const cartDeps = createCartDependencies();
export const checkoutDeps = createCheckoutDependencies();

export const orderDeps = createOrderDependencies({
  cartRepository: cartDeps.cartRepository,
  checkoutRepository: checkoutDeps.checkoutRepository,
});

export const purchaseDeps = createPurchaseDependencies({
  submitCheckoutUseCase: checkoutDeps.submitCheckoutUseCase,
  createOrderFromCheckoutUseCase: orderDeps.createOrderFromCheckoutUseCase,
});
