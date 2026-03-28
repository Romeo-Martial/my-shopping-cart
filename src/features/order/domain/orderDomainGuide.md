# Order Domain Entity

## Overview

Order aggregate root representing a customer order with business rules and lifecycle management, following Domain-Driven Design patterns. Central entity for order fulfillment and customer service operations.

## Domain Concepts

- **Aggregate Root**: Main entry point for all order operations
- **Entity**: Has identity (OrderId) and complex lifecycle
- **Immutable**: State changes create new instances
- **Business Rules**: Enforces order lifecycle and validation
- **Event Source**: Order changes can generate domain events

## Constructor

```javascript
new Order(
  id,
  customerId,
  lines,
  shippingAddress,
  paymentMethod,
  status,
  createdAt,
  total,
);
```

**Parameters**:

- `id` (OrderId): Unique order identifier value object
- `customerId` (string): Customer identifier from checkout
- `lines` (OrderLine[]): Ordered items with quantities and prices
- `shippingAddress` (ShippingAddress): Delivery address
- `paymentMethod` (PaymentMethod): Payment information
- `status` (OrderStatus): Current order state
- `createdAt` (Date): Order creation timestamp
- `total` (Money): Calculated order total

**Invariants**:

- Order ID must be unique and valid
- Order lines cannot be empty
- Shipping address must be complete
- Payment method must be valid
- Status must follow valid progression
- Total must match sum of order lines

**Throws**:

- Error if ID is not OrderId instance
- Error if lines are empty or invalid
- Error if addresses or payment data incomplete
- Error if total calculation is incorrect

## Static Factory Methods

### `createFromCheckout(checkout, cart): Order`

**Purpose**: Creates new order from completed checkout and cart

**Parameters**:

- `checkout` (CheckoutDraft): Completed checkout with address/payment
- `cart` (Cart): Original cart with items and pricing

**Returns**: New Order instance in Created status

**Business Rules**:

- Checkout must be in Submitted status
- Cart must have valid items and pricing
- Shipping address must be complete
- Payment method must be valid
- Generates unique OrderId

**Example**:

```javascript
const order = Order.createFromCheckout(submittedCheckout, originalCart);
console.log(`New order: ${order.id.value}`);
```

## Public Interface

### Core Properties

```javascript
order.id; // OrderId - Unique order identifier
order.customerId; // string - Customer identifier
order.lines; // OrderLine[] - Ordered items
order.shippingAddress; // ShippingAddress - Delivery address
order.paymentMethod; // PaymentMethod - Payment information
order.status; // OrderStatus - Current state
order.createdAt; // Date - Order creation timestamp
order.total; // Money - Order total amount
```

### Lifecycle Methods

#### `markAsPaid(paymentConfirmation): Order`

**Purpose**: Transitions order from Created/Pending to Paid status

**Parameters**:

- `paymentConfirmation` (PaymentConfirmation): Payment verification details

**Returns**: New Order instance with Paid status

**Business Rules**:

- Order must be in Created or Pending status
- Payment amount must match order total
- Payment confirmation must be valid and verified
- Updates status and payment tracking information

**Example**:

```javascript
const paidOrder = order.markAsPaid(paymentConfirmation);
console.log(`Order ${paidOrder.id.value} marked as paid`);
```

#### `cancel(reason): Order`

**Purpose**: Cancels order before fulfillment

**Parameters**:

- `reason` (string): Cancellation reason for audit trail

**Returns**: New Order instance with Cancelled status

**Business Rules**:

- Can only cancel orders in Created, Pending, or Paid status
- Cannot cancel orders already shipped or delivered
- Records cancellation reason and timestamp
- Triggers inventory restoration process

**Example**:

```javascript
const cancelledOrder = order.cancel("Customer requested cancellation");
console.log(`Order cancelled: ${cancelledOrder.status.value}`);
```

#### `markAsProcessing(): Order`

**Purpose**: Moves order to processing/fulfillment status

**Returns**: New Order instance with Processing status

**Business Rules**:

- Order must be in Paid status
- Indicates order entered fulfillment workflow
- Triggers inventory allocation and picking

#### `markAsShipped(trackingInfo): Order`

**Purpose**: Updates order to shipped status with tracking information

**Parameters**:

- `trackingInfo` (object): Shipping and tracking details

**Returns**: New Order instance with Shipped status

**Business Rules**:

- Order must be in Processing status
- Cannot be cancelled once shipped
- Customer notification triggered

#### `markAsDelivered(): Order`

**Purpose**: Completes order lifecycle when delivered to customer

**Returns**: New Order instance with Delivered status

**Business Rules**:

- Order must be in Shipped status
- Final status in order lifecycle
- Triggers customer satisfaction surveys

### Query Methods

#### `getTotal(): Money`

**Purpose**: Calculates current order total including taxes and shipping

**Returns**: Money object representing total order cost

**Calculation**:

- Sums all order line totals
- Includes applicable taxes and fees
- Adds shipping costs
- Applies discounts if any

#### `getTotalItems(): number`

**Purpose**: Gets total item count across all order lines

**Returns**: Sum of quantities for all order lines

#### `getLineForSku(sku): OrderLine | null`

**Purpose**: Retrieves order line for specific SKU

**Parameters**:

- `sku` (Sku): SKU to search for

**Returns**: OrderLine if found, null otherwise

#### `canBeCancelled(): boolean`

**Purpose**: Checks if order can be cancelled in current state

**Returns**: true if order is cancellable, false otherwise

**Business Rules**:

- Returns true for Created, Pending, Paid statuses
- Returns false for Processing, Shipped, Delivered, Cancelled

#### `isPaid(): boolean`

**Purpose**: Checks if order payment has been confirmed

**Returns**: true if order is in Paid or later status

#### `isCompleted(): boolean`

**Purpose**: Checks if order lifecycle is complete

**Returns**: true if order is Delivered or Cancelled

#### `getEstimatedDelivery(): Date | null`

**Purpose**: Calculates estimated delivery date based on shipping method

**Returns**: Estimated delivery date or null if not calculable

## Value Objects Used

### OrderId

- Unique identifier for order entity
- UUID format with validation
- Ensures order identity consistency

### OrderLine

- Represents single product line in order
- Contains: SKU, quantity, unit price, line total
- Immutable value object with calculations

### OrderStatus

- Order lifecycle state enumeration
- Valid states: Created, Pending, Paid, Processing, Shipped, Delivered, Cancelled
- Enforces valid state transitions

### ShippingAddress

- Complete delivery address information
- Validates address format and completeness
- Supports international address formats

### PaymentMethod

- Payment method type and details
- Secure handling of payment information
- Validation of payment method support

## Business Invariants

### Data Consistency

1. Order must always have valid OrderId
2. Order lines cannot be empty or contain invalid items
3. Shipping address must be complete and deliverable
4. Payment method must be valid and supported
5. Order total must equal sum of all line totals plus taxes/shipping

### Lifecycle Rules

1. **Sequential Progression**: Status must follow valid order workflow
2. **Payment Verification**: Cannot ship without confirmed payment
3. **Cancellation Window**: Cannot cancel after shipping begins
4. **Data Immutability**: Historical order data cannot be changed
5. **Audit Trail**: All status changes must be recorded

## Usage Examples

### Order Creation

```javascript
// Create order from checkout
const order = Order.createFromCheckout(submittedCheckout, cart);
console.log(`Order created: ${order.id.value}`);
console.log(`Total: ${order.getTotal().toDisplayString()}`);
console.log(`Items: ${order.getTotalItems()}`);
```

### Order Lifecycle Management

```javascript
let order = initialOrder; // Created status

// Payment confirmation
order = order.markAsPaid(paymentConfirmation);
console.log(`Status: ${order.status.value}`); // "Paid"

// Begin fulfillment
if (order.isPaid()) {
  order = order.markAsProcessing();
  console.log(`Status: ${order.status.value}`); // "Processing"
}

// Ship order
order = order.markAsShipped({
  trackingNumber: "1Z999AA1234567890",
  carrier: "UPS",
  estimatedDelivery: new Date(),
});

// Complete delivery
order = order.markAsDelivered();
console.log(`Order completed: ${order.isCompleted()}`); // true
```

### Order Cancellation

```javascript
// Check if cancellation is possible
if (order.canBeCancelled()) {
  const cancelledOrder = order.cancel("Customer requested cancellation");
  console.log(`Cancelled: ${cancelledOrder.status.value}`);
} else {
  console.log("Order cannot be cancelled in current state");
}
```

### Order Query Operations

```javascript
// Get specific order line
const orderLine = order.getLineForSku(new Sku("PRODUCT-123"));
if (orderLine) {
  console.log(`Quantity: ${orderLine.quantity.value}`);
  console.log(`Line total: ${orderLine.getTotal().toDisplayString()}`);
}

// Check order status
console.log(`Is paid: ${order.isPaid()}`);
console.log(`Can cancel: ${order.canBeCancelled()}`);
console.log(`Is completed: ${order.isCompleted()}`);

// Get delivery estimate
const estimatedDelivery = order.getEstimatedDelivery();
if (estimatedDelivery) {
  console.log(`Expected delivery: ${estimatedDelivery.toDateString()}`);
}
```

## Integration Points

### Used By

- Order use cases (CreateOrderFromCheckout, MarkOrderPaid, etc.)
- Order repositories for persistence
- Customer service interfaces
- Fulfillment and shipping systems
- Financial reporting and reconciliation

### Dependencies

- Value objects: OrderId, OrderLine, OrderStatus, ShippingAddress, PaymentMethod
- Domain services for tax calculation and shipping rates
- External payment verification services

## Testing Strategy

### Unit Test Categories

- **Factory method validation** (createFromCheckout with various scenarios)
- **Lifecycle progression** (status transitions and business rules)
- **Calculation accuracy** (totals, taxes, shipping costs)
- **Validation methods** (cancellation rules, payment status)
- **Immutability** (state changes create new instances)

### Test Examples

```javascript
describe("Order Domain Entity", () => {
  it("should create order from valid checkout and cart", () => {
    const order = Order.createFromCheckout(validCheckout, validCart);

    expect(order.id).toBeInstanceOf(OrderId);
    expect(order.status.value).toBe("Created");
    expect(order.lines).toHaveLength(validCart.lines.length);
  });

  it("should transition to paid status with valid payment", () => {
    const paidOrder = order.markAsPaid(validPaymentConfirmation);

    expect(paidOrder).not.toBe(order);
    expect(paidOrder.status.value).toBe("Paid");
    expect(paidOrder.isPaid()).toBe(true);
  });

  it("should prevent cancellation after shipping", () => {
    const shippedOrder = order
      .markAsPaid(paymentConfirmation)
      .markAsProcessing()
      .markAsShipped(trackingInfo);

    expect(shippedOrder.canBeCancelled()).toBe(false);
    expect(() => shippedOrder.cancel("reason")).toThrow();
  });

  it("should calculate correct order total", () => {
    const total = order.getTotal();
    const expectedTotal = sumOrderLines(order.lines) + tax + shipping;
    expect(total.amount).toBe(expectedTotal);
  });
});
```

## Domain Events (Future Enhancement)

### Event Types

- **OrderCreated**: New order from checkout
- **OrderPaid**: Payment confirmation received
- **OrderCancelled**: Order cancelled by customer or system
- **OrderShipped**: Order dispatched to customer
- **OrderDelivered**: Order completed successfully

### Event Usage

```javascript
// Future: Event-driven architecture
order
  .markAsPaid(paymentConfirmation)
  .raise(new OrderPaidEvent(order.id, paymentConfirmation.amount));
```

## Business Logic Patterns

- **State Machine Pattern**: Order status progression
- **Factory Pattern**: Order creation from checkout
- **Value Object Pattern**: Rich domain modeling
- **Aggregate Pattern**: Consistency and transaction boundaries
- **Domain Events**: Integration with external systems
