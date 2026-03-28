# Order Use Cases

## Overview

Business use cases for order management operations with full validation and order lifecycle management.

## Use Cases

### CreateOrderFromCheckout Use Case

#### Overview

Creates a new order from a completed checkout, transitioning from checkout workflow to order fulfillment process.

#### Business Rules

1. **Checkout Validation**: Checkout must be in submitted state
2. **Inventory Check**: All items must be available at order creation
3. **Price Validation**: Final price confirmation before order creation
4. **Data Integrity**: All checkout data must transfer correctly to order

#### Interface

##### Constructor

```javascript
new CreateOrderFromCheckout(
  orderRepository,
  cartRepository,
  checkoutRepository,
);
```

**Parameters**:

- `orderRepository` (OrderRepository): Order persistence abstraction
- `cartRepository` (CartRepository): Cart data access for order details
- `checkoutRepository` (CheckoutRepository): Checkout completion verification

##### Execute Method

```javascript
execute({ checkoutId }): Result<Order>
```

**Input Parameters**:

- `checkoutId` (CheckoutId): Identifier of completed checkout

**Return Value**:

- `Result.success(Order)`: Created order on success
- `Result.failure(DomainError)`: Error details on failure

**Example Usage**:

```javascript
const result = await createOrderFromCheckout.execute({
  checkoutId: new CheckoutId("checkout-123"),
});

if (result.isSuccess()) {
  const order = result.value;
  console.log(`Order created: ${order.id.value}`);
  // Redirect to order confirmation page
} else {
  console.error(`Order creation failed: ${result.error.message}`);
}
```

#### Error Scenarios

- **Checkout Not Found**: Invalid or non-existent checkout ID
- **Invalid Checkout State**: Checkout not in submitted state
- **Inventory Unavailable**: Items not available during order creation
- **Price Changes**: Product prices changed since checkout
- **Repository Failure**: Database or persistence errors

### GetOrderById Use Case

#### Overview

Retrieves specific order details by order identifier for customer review and order management.

#### Business Rules

1. **Order Existence**: Order must exist in the system
2. **Access Control**: User authorization for order access (future enhancement)
3. **Data Completeness**: Return complete order with all details
4. **Current State**: Order returned in current lifecycle state

#### Interface

##### Execute Method

```javascript
execute({ orderId }): Promise<Result<Order>>
```

**Input Parameters**:

- `orderId` (OrderId): Order identifier value object

**Return Value**:

- `Result.success(Order)`: Order entity on success
- `Result.failure(DomainError)`: Error details on failure

**Example Usage**:

```javascript
const orderId = new OrderId("order-456");
const result = await getOrderById.execute({ orderId });

if (result.isSuccess()) {
  const order = result.value;
  console.log(`Order status: ${order.status.value}`);
  console.log(`Order total: ${order.getTotal().toDisplayString()}`);
} else {
  console.error(`Order not found: ${result.error.message}`);
}
```

### MarkOrderPaid Use Case

#### Overview

Updates order status to paid when payment confirmation is received from payment processor.

#### Business Rules

1. **Payment Verification**: Payment confirmation must be valid and verified
2. **Order State**: Order must be in created or pending state
3. **Amount Verification**: Paid amount must match order total
4. **Idempotency**: Multiple payment confirmations handled gracefully

#### Interface

##### Execute Method

```javascript
execute({ orderId, paymentConfirmation }): Result<Order>
```

**Input Parameters**:

- `orderId` (OrderId): Order to mark as paid
- `paymentConfirmation` (PaymentConfirmation): Payment verification details

**Return Value**:

- `Result.success(Order)`: Updated order with paid status
- `Result.failure(DomainError)`: Payment validation errors

**Example Usage**:

```javascript
const result = await markOrderPaid.execute({
  orderId: new OrderId("order-456"),
  paymentConfirmation: new PaymentConfirmation({
    transactionId: "txn-789",
    amount: new Money(9999, "USD"),
    timestamp: new Date(),
  }),
});

if (result.isSuccess()) {
  const paidOrder = result.value;
  console.log(`Payment confirmed for order ${paidOrder.id.value}`);
  // Trigger fulfillment process
} else {
  console.error(`Payment confirmation failed: ${result.error.message}`);
}
```

### CancelOrder Use Case

#### Overview

Cancels an existing order before fulfillment, handling inventory restoration and refund processing.

#### Business Rules

1. **Cancellation Window**: Orders can only be cancelled before shipping
2. **Inventory Restoration**: Cancelled items returned to inventory
3. **Refund Processing**: Initiate refund if payment was captured
4. **Audit Trail**: Record cancellation reason and timestamp

#### Interface

##### Execute Method

```javascript
execute({ orderId, reason }): Result<Order>
```

**Input Parameters**:

- `orderId` (OrderId): Order to cancel
- `reason` (string): Cancellation reason for audit trail

**Return Value**:

- `Result.success(Order)`: Cancelled order
- `Result.failure(DomainError)`: Cancellation validation errors

**Example Usage**:

```javascript
const result = await cancelOrder.execute({
  orderId: new OrderId("order-456"),
  reason: "Customer requested cancellation",
});

if (result.isSuccess()) {
  const cancelledOrder = result.value;
  console.log(`Order ${cancelledOrder.id.value} cancelled`);
  // Process refund if applicable
} else {
  console.error(`Cancellation failed: ${result.error.message}`);
}
```

## Order Lifecycle Flow

### Standard Order Process

```javascript
// 1. Create order from completed checkout
const orderResult = await createOrderFromCheckout.execute({ checkoutId });

// 2. Mark order as paid when payment confirmed
const paidResult = await markOrderPaid.execute({
  orderId: order.id,
  paymentConfirmation,
});

// 3. Order proceeds to fulfillment (future use cases)
// - markOrderProcessing.execute()
// - markOrderShipped.execute()
// - markOrderDelivered.execute()
```

### Exception Handling

```javascript
// Handle order cancellation
const cancelResult = await cancelOrder.execute({
  orderId: order.id,
  reason: "Inventory unavailable",
});

// Retrieve order current state
const orderState = await getOrderById.execute({ orderId: order.id });
```

## Integration Points

### Dependencies

- OrderRepository (port interface)
- Order domain entity
- Value objects: OrderId, OrderStatus, PaymentConfirmation
- Cart and Checkout services for order creation
- Shared: Result, DomainError

### Used By

- Order confirmation pages
- Customer order history
- Admin order management interfaces
- Payment processing webhooks
- Inventory management systems

### External Service Integration

```javascript
// Payment processor webhook integration
app.post("/webhook/payment-confirmed", async (req, res) => {
  const { orderId, transactionId, amount } = req.body;

  const result = await markOrderPaid.execute({
    orderId: new OrderId(orderId),
    paymentConfirmation: new PaymentConfirmation({
      transactionId,
      amount: new Money(amount, "USD"),
      timestamp: new Date(),
    }),
  });

  if (result.isSuccess()) {
    res.status(200).send("Payment confirmed");
  } else {
    res.status(400).send(result.error.message);
  }
});
```

## Testing Strategy

### Unit Tests

```javascript
describe("Order Use Cases", () => {
  let mockOrderRepository;
  let mockCartRepository;
  let mockCheckoutRepository;

  beforeEach(() => {
    mockOrderRepository = createMockOrderRepository();
    mockCartRepository = createMockCartRepository();
    mockCheckoutRepository = createMockCheckoutRepository();
  });

  describe("CreateOrderFromCheckout", () => {
    it("should create order from valid checkout", async () => {
      const useCase = new CreateOrderFromCheckout(
        mockOrderRepository,
        mockCartRepository,
        mockCheckoutRepository,
      );

      mockCheckoutRepository.getCurrent.mockReturnValue(submittedCheckout);
      mockCartRepository.getCart.mockReturnValue(validCart);

      const result = await useCase.execute({ checkoutId });

      expect(result.isSuccess()).toBe(true);
      expect(mockOrderRepository.save).toHaveBeenCalledWith(expect.any(Order));
    });
  });

  describe("MarkOrderPaid", () => {
    it("should update order status to paid", async () => {
      const useCase = new MarkOrderPaid(mockOrderRepository);

      mockOrderRepository.getById.mockResolvedValue(pendingOrder);

      const result = await useCase.execute({
        orderId: order.id,
        paymentConfirmation: validPaymentConfirmation,
      });

      expect(result.isSuccess()).toBe(true);
      expect(result.value.status.value).toBe("Paid");
    });
  });
});
```

### Test Scenarios

#### CreateOrderFromCheckout Tests

- ✅ Create order from valid submitted checkout
- ✅ Transfer all checkout data to order
- ✅ Set initial order status correctly
- ❌ Invalid checkout ID
- ❌ Checkout not in submitted state
- ❌ Inventory unavailable during creation
- ❌ Repository persistence failure

#### GetOrderById Tests

- ✅ Return existing order by valid ID
- ✅ Include all order details and lines
- ❌ Order not found
- ❌ Invalid order ID format
- ❌ Repository access failure

#### MarkOrderPaid Tests

- ✅ Update order status from pending to paid
- ✅ Record payment confirmation details
- ✅ Handle duplicate payment confirmations
- ❌ Order not found
- ❌ Invalid order state for payment
- ❌ Payment amount mismatch
- ❌ Invalid payment confirmation

#### CancelOrder Tests

- ✅ Cancel order in valid state
- ✅ Record cancellation reason
- ✅ Update order status to cancelled
- ❌ Order already shipped
- ❌ Order not found
- ❌ Invalid cancellation state

## Error Handling Patterns

### Comprehensive Error Management

```javascript
const handleOrderOperation = async (operation, params) => {
  try {
    const result = await operation.execute(params);

    if (result.isSuccess()) {
      return { success: true, data: result.value };
    } else {
      const error = result.error;

      switch (error.code) {
        case "ORDER_NOT_FOUND":
          return {
            success: false,
            message: "Order not found",
            statusCode: 404,
          };
        case "INVALID_ORDER_STATE":
          return {
            success: false,
            message: "Order cannot be modified in current state",
            statusCode: 400,
          };
        case "PAYMENT_VERIFICATION_FAILED":
          return {
            success: false,
            message: "Payment could not be verified",
            statusCode: 402,
          };
        case "INVENTORY_UNAVAILABLE":
          return {
            success: false,
            message: "Items no longer available",
            statusCode: 409,
          };
        default:
          return {
            success: false,
            message: "Order operation failed",
            statusCode: 500,
          };
      }
    }
  } catch (error) {
    console.error("Unexpected error in order operation:", error);
    return {
      success: false,
      message: "Internal server error",
      statusCode: 500,
    };
  }
};
```

## Performance Considerations

- Efficient order retrieval with related data loading
- Optimistic locking for concurrent order modifications
- Asynchronous processing for non-critical order updates
- Caching strategies for frequently accessed orders
- Batch processing for bulk order operations

## Business Logic Validation

- Order total calculations with taxes and discounts
- Inventory availability confirmation at order creation
- Payment amount verification against order total
- Order state transition validation and business rules
- Audit trail maintenance for compliance requirements
