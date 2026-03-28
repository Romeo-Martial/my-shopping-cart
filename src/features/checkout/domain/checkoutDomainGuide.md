# CheckoutDraft Domain Entity

## Overview

CheckoutDraft aggregate root representing the checkout process state with business rules, following Domain-Driven Design patterns. Manages the complete checkout workflow from cart to order submission.

## Domain Concepts

- **Aggregate Root**: Main entry point for checkout operations
- **Entity**: Has identity (CheckoutId) and lifecycle management
- **Immutable**: State changes create new instances
- **Business Rules**: Enforces checkout workflow and validation
- **State Machine**: Manages checkout progression through defined states

## Constructor

```javascript
new CheckoutDraft(id, cartId, lines, shippingAddress, paymentMethod, status);
```

**Parameters**:

- `id` (CheckoutId): Unique checkout identifier value object
- `cartId` (CartId): Associated cart identifier
- `lines` (CheckoutLine[]): Items being checked out
- `shippingAddress` (ShippingAddress | null): Delivery address
- `paymentMethod` (PaymentMethod | null): Payment information
- `status` (CheckoutStatus): Current checkout state

**Invariants**:

- Checkout ID must be valid CheckoutId instance
- Cart ID must reference existing cart
- Lines cannot be empty for active checkout
- Status must progress through valid states
- Shipping address required before payment
- Payment method required before submission

**Throws**:

- Error if ID is not CheckoutId instance
- Error if cartId is invalid
- Error if lines are empty or invalid
- Error if status transitions are invalid

## Public Interface

### Core Properties

```javascript
checkout.id; // CheckoutId - Unique checkout identifier
checkout.cartId; // CartId - Associated cart reference
checkout.lines; // CheckoutLine[] - Items in checkout
checkout.shippingAddress; // ShippingAddress | null - Delivery address
checkout.paymentMethod; // PaymentMethod | null - Payment information
checkout.status; // CheckoutStatus - Current workflow state
```

### Workflow Methods

#### `setShippingAddress(address): CheckoutDraft`

**Purpose**: Sets or updates shipping address for checkout

**Parameters**:

- `address` (ShippingAddress): Validated shipping address value object

**Returns**: New CheckoutDraft instance with shipping address

**Business Rules**:

- Address must be complete and valid
- Can only set address in Draft or AddressSet states
- Moves status to AddressSet if successful
- Validates address format and deliverability

**Example**:

```javascript
const address = new ShippingAddress({
  fullName: "John Doe",
  line1: "123 Main St",
  city: "Anytown",
  postalCode: "12345",
  country: "US",
});

const withAddress = checkout.setShippingAddress(address);
```

#### `setPaymentMethod(payment): CheckoutDraft`

**Purpose**: Sets or updates payment method for checkout

**Parameters**:

- `payment` (PaymentMethod): Validated payment method value object

**Returns**: New CheckoutDraft instance with payment method

**Business Rules**:

- Shipping address must be set first
- Payment method must be supported and valid
- Can only set payment in AddressSet or PaymentSet states
- Moves status to PaymentSet if successful

**Example**:

```javascript
const payment = new PaymentMethod("credit-card", {
  cardNumber: "****-****-****-1234",
  expiryDate: "12/25",
  cvv: "123",
});

const withPayment = checkout.setPaymentMethod(payment);
```

#### `submit(): CheckoutDraft`

**Purpose**: Submits checkout for order processing

**Returns**: New CheckoutDraft instance with Submitted status

**Business Rules**:

- Both shipping address and payment method must be set
- All checkout lines must be valid and available
- Final validation of prices and inventory
- Moves status to Submitted
- Triggers order creation process

**Example**:

```javascript
const submittedCheckout = checkout.submit();
```

### Query Methods

#### `getTotal(): Money`

**Purpose**: Calculates total checkout amount including taxes and shipping

**Returns**: Money object representing total checkout cost

**Calculation**:

- Sums all checkout line totals
- Adds applicable taxes
- Includes shipping costs
- Applies any discounts or promotions

#### `getTotalItems(): number`

**Purpose**: Gets total item count across all checkout lines

**Returns**: Sum of quantities for all checkout lines

#### `hasShippingAddress(): boolean`

**Purpose**: Checks if shipping address has been set

**Returns**: true if valid shipping address exists

#### `hasPaymentMethod(): boolean`

**Purpose**: Checks if payment method has been set

**Returns**: true if valid payment method exists

#### `isReadyToSubmit(): boolean`

**Purpose**: Checks if checkout meets all submission requirements

**Returns**: true if address, payment, and all validations pass

**Business Rules**:

- Shipping address must be complete
- Payment method must be valid
- All checkout lines must be available
- Status must be PaymentSet or ready state

#### `getLineForSku(sku): CheckoutLine | null`

**Purpose**: Retrieves checkout line for specific SKU

**Parameters**:

- `sku` (Sku): SKU to search for

**Returns**: CheckoutLine if found, null otherwise

## Value Objects Used

### CheckoutId

- Unique identifier for checkout instance
- Validates UUID format
- Ensures checkout identity consistency

### CartId

- Reference to original shopping cart
- Maintains cart-checkout relationship
- Used for order history and tracking

### CheckoutLine

- Represents single product line in checkout
- Contains: SKU, quantity, unit price, line total
- Immutable value object with validation

### ShippingAddress

- Complete delivery address information
- Validates address format and completeness
- Supports international address formats

### PaymentMethod

- Payment method type and details
- Secure handling of payment information
- Validation of payment method support

### CheckoutStatus

- Workflow state enumeration
- Valid states: Draft, AddressSet, PaymentSet, Submitted
- Enforces valid state transitions

## Business Invariants

### Data Consistency

1. Checkout must always have valid CheckoutId
2. Cart reference must be maintained throughout workflow
3. Checkout lines cannot be empty or invalid
4. Status must follow valid progression sequence
5. Required information must be present for each state

### Workflow Rules

1. **Sequential Progression**: Address before payment before submission
2. **State Validation**: Each state has specific requirements
3. **Immutable History**: Previous states cannot be undone
4. **Final Validation**: All requirements verified before submission
5. **Business Rule Enforcement**: Domain rules applied at each step

## Usage Examples

### Creating New Checkout

```javascript
const checkout = new CheckoutDraft(
  new CheckoutId("checkout-123"),
  new CartId("cart-456"),
  checkoutLines,
  null, // No address initially
  null, // No payment initially
  new CheckoutStatus("Draft"),
);
```

### Checkout Workflow

```javascript
let checkout = startingCheckout;

// Set shipping address
checkout = checkout.setShippingAddress(shippingAddress);
console.log(`Has address: ${checkout.hasShippingAddress()}`); // true

// Set payment method
checkout = checkout.setPaymentMethod(paymentMethod);
console.log(`Has payment: ${checkout.hasPaymentMethod()}`); // true

// Check if ready to submit
if (checkout.isReadyToSubmit()) {
  checkout = checkout.submit();
  console.log(`Status: ${checkout.status.value}`); // "Submitted"
}
```

### Validation and Totals

```javascript
// Calculate totals
const total = checkout.getTotal();
console.log(`Total: ${total.toDisplayString()}`); // "$123.45"

const itemCount = checkout.getTotalItems();
console.log(`Items: ${itemCount}`); // 3

// Validate checkout state
const canSubmit = checkout.isReadyToSubmit();
if (!canSubmit) {
  if (!checkout.hasShippingAddress()) {
    console.log("Shipping address required");
  }
  if (!checkout.hasPaymentMethod()) {
    console.log("Payment method required");
  }
}
```

## Integration Points

### Used By

- Checkout use cases (SetShippingAddress, SetPaymentMethod, SubmitCheckout)
- Checkout repositories for persistence
- Checkout UI components for state display
- Order creation during submission
- Payment processing integration

### Dependencies

- Value objects: CheckoutId, CartId, CheckoutLine, ShippingAddress, PaymentMethod, CheckoutStatus
- Cart entities for line item validation
- Money calculations for totals

## Testing Strategy

### Unit Test Categories

- **Constructor validation** (invalid parameters, value object types)
- **Workflow progression** (state transitions, business rules)
- **Calculation accuracy** (totals, taxes, shipping costs)
- **Validation methods** (readiness checks, requirement validation)
- **Immutability** (state changes create new instances)

### Test Examples

```javascript
describe("CheckoutDraft Domain Entity", () => {
  it("should require shipping address before payment method", () => {
    const checkout = new CheckoutDraft(
      id,
      cartId,
      lines,
      null,
      null,
      draftStatus,
    );

    expect(() => {
      checkout.setPaymentMethod(paymentMethod);
    }).toThrow("Shipping address must be set before payment method");
  });

  it("should calculate correct total with taxes and shipping", () => {
    const total = checkout.getTotal();
    const expected = lineTotal + tax + shipping;
    expect(total.amount).toBe(expected);
  });

  it("should validate checkout readiness for submission", () => {
    const completeCheckout = checkout
      .setShippingAddress(validAddress)
      .setPaymentMethod(validPayment);

    expect(completeCheckout.isReadyToSubmit()).toBe(true);
  });
});
```

## State Machine Behavior

### Valid State Transitions

```
Draft → AddressSet → PaymentSet → Submitted
  ↓         ↓           ↓
(Can set    (Can set     (Can submit
 address)   payment)     checkout)
```

### Business Rules by State

- **Draft**: Can accept shipping address
- **AddressSet**: Can accept payment method, modify address
- **PaymentSet**: Can modify payment, submit checkout
- **Submitted**: Read-only, triggers order creation

## Security Considerations

- Payment information handling and PCI compliance
- Address validation and fraud prevention
- Secure state transitions and validation
- Audit trail for checkout modifications
