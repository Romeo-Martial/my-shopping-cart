import { createBrowserRouter, Navigate } from "react-router-dom";

import { AppLayout } from "../layout/AppLayout";
import { StorePage } from "./StorePage";
import { CartPage } from "./CartPage";
import { CheckoutPage } from "./CheckoutPage";
import { OrderConfirmationPage } from "./OrderConfirmationPage";

import { orderDeps, purchaseDeps } from "../composition/dependencies";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <StorePage /> },
      { path: "cart", element: <CartPage /> },
      {
        path: "checkout",
        element: (
          <CheckoutPage
            submitCheckoutAndCreateOrderUseCase={
              purchaseDeps.submitCheckoutAndCreateOrderUseCase
            }
          />
        ),
      },
      {
        path: "order-confirmation/:orderId",
        element: (
          <OrderConfirmationPage
            getOrderByIdUseCase={orderDeps.getOrderByIdUseCase}
          />
        ),
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
