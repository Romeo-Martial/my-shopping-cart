# Checkout Use Cases

## Overview

Business use cases for checkout workflow operations with full validation and checkout process management.

## Use Cases

### StartCheckout Use Case

#### Overview

Initiates checkout process from shopping cart, creating initial checkout draft with cart contents.

#### Business Rules

1. **Cart Validation**: Cart must have items and valid state
2. **Inventory Check**: All cart items must be available
3. **Price Validation**: Current product prices must be validated
4. **User Session**: Valid user session required for checkout

#### Interface

##### Constructor

```javascript
new StartCheckout(checkoutRepository);
```

**Parameters**:

- `checkoutRepository` (CheckoutRepository): Checkout persistence abstraction

##### Execute Method

```javascript
execute({ checkoutId, cartId }): Result<CheckoutDraft>
```

**Input Parameters**:

- `checkoutId` (CheckoutId): Unique identifier for new checkout
- `cartId` (CartId): Cart to convert to checkout

**Return Value**:

- `Result.success(CheckoutDraft)`: Created checkout draft on success
- `Result.failure(DomainError)`: Error details on failure

**Example Usage**:

```javascript
const result = startCheckout.execute({
  checkoutId: new CheckoutId("checkout-123"),
  cartId: new CartId("cart-456"),
});

if (result.isSuccess()) {
  const checkout = result.value;
  console.log(`Checkout started: ${checkout.id.value}`);
}
```

### SetShippingAddress Use Case

#### Overview

Sets shipping address for the current checkout draft.

#### Business Rules

1. **Address Validation**: All required address fields must be provided
2. **Delivery Area**: Address must be in serviceable delivery area
3. **Format Validation**: Address format must match regional standards
4. **Active Checkout**: Checkout must be in draft or address-setting state

#### Interface

##### Execute Method

```javascript
execute({ fullName, line1, city, postalCode, country }): Result<CheckoutDraft>
```

**Input Parameters**:

- `fullName` (string): Recipient name
- `line1` (string): Primary address line
- `city` (string): City name
- `postalCode` (string): Postal/ZIP code
- `country` (string): Country code

**Return Value**:

- `Result.success(CheckoutDraft)`: Updated checkout with address
- `Result.failure(DomainError)`: Validation errors

### SetPaymentMethod Use Case

#### Overview

Sets payment method for the current checkout draft.

#### Business Rules

1. **Payment Validation**: Payment method must be supported
2. **Security**: Payment data must be securely handled
3. **Prerequisites**: Shipping address must be set first
4. **Fraud Prevention**: Payment method validation and fraud checks

#### Interface

##### Execute Method

```javascript
execute({ paymentMethod }): Result<CheckoutDraft>
```

**Input Parameters**:

- `paymentMethod` (PaymentMethod): Payment method value object

**Return Value**:

- `Result.success(CheckoutDraft)`: Updated checkout with payment method
- `Result.failure(DomainError)`: Payment validation errors

### SubmitCheckout Use Case

#### Overview

Completes and submits the checkout for order processing.

#### Business Rules

1. **Completeness**: All required checkout information must be present
2. **Final Validation**: Re-validate inventory, pricing, and payment
3. **Order Creation**: Triggers order creation process
4. **Notification**: Customer notification of successful checkout

#### Interface

##### Execute Method

```javascript
execute(): Result<CheckoutDraft>
```

**Return Value**:

- `Result.success(CheckoutDraft)`: Submitted checkout
- `Result.failure(DomainError)`: Submission errors

**Example Usage**:

```javascript
const result = await submitCheckout.execute();

if (result.isSuccess()) {
  const submittedCheckout = result.value;
  // Redirect to confirmation page
} else {
  // Handle submission errors
  console.error(result.error.message);
}
```

### GetCheckout Use Case

#### Overview

Retrieves current checkout draft for display and validation.

#### Business Rules

1. **Session Validation**: User session must be valid
2. **State Consistency**: Return checkout in current state
3. **Data Freshness**: Ensure checkout data is up-to-date

#### Interface

##### Execute Method

```javascript
execute(): Result<CheckoutDraft>
```

**Return Value**:

- `Result.success(CheckoutDraft)`: Current checkout state
- `Result.failure(DomainError)`: Retrieval errors

## Checkout Workflow

### Standard Flow

```javascript
// 1. Start checkout from cart
const startResult = await startCheckout.execute({ checkoutId, cartId });

// 2. Set shipping address
const addressResult = await setShippingAddress.execute({
  fullName: "John Doe",
  line1: "123 Main St",
  city: "Anytown",
  postalCode: "12345",
  country: "US",
});

// 3. Set payment method
const paymentResult = await setPaymentMethod.execute({
  paymentMethod: new PaymentMethod("credit-card", cardData),
});

// 4. Submit checkout
const submitResult = await submitCheckout.execute();
```

### Error Recovery

```javascript
// Handle partial checkout states
const checkout = await getCheckout.execute();

if (checkout.isSuccess()) {
  const draft = checkout.value;

  if (!draft.hasShippingAddress()) {
    // Redirect to shipping address step
  } else if (!draft.hasPaymentMethod()) {
    // Redirect to payment step
  } else {
    // Ready for submission
  }
}
```

## Integration Points

### Dependencies

- CheckoutRepository (port interface)
- CheckoutDraft domain entity
- Value objects: CheckoutId, ShippingAddress, PaymentMethod
- Cart service integration
- Shared: Result, DomainError

### Used By

- Checkout UI components via Context
- Checkout wizard/stepper components
- Order creation workflow
- Payment processing integration

## Testing Strategy

### Unit Tests

```javascript
describe("Checkout Use Cases", () => {
  let mockRepository;

  beforeEach(() => {
    mockRepository = createMockCheckoutRepository();
  });

  describe("StartCheckout", () => {
    it("should create checkout from valid cart", () => {
      // Test implementation
    });

    it("should fail with empty cart", () => {
      // Test implementation
    });
  });

  describe("SetShippingAddress", () => {
    it("should update checkout with valid address", () => {
      // Test implementation
    });

    it("should validate required address fields", () => {
      // Test implementation
    });
  });
});
```

### Test Scenarios

#### StartCheckout Tests

- ✅ Create checkout from populated cart
- ✅ Generate unique checkout ID
- ❌ Empty cart validation
- ❌ Invalid cart state
- ❌ Repository failure

#### SetShippingAddress Tests

- ✅ Valid address with all required fields
- ✅ Update existing checkout address
- ❌ Missing required fields
- ❌ Invalid postal code format
- ❌ Unsupported delivery area

#### SetPaymentMethod Tests

- ✅ Valid payment method
- ✅ Replace existing payment method
- ❌ Unsupported payment type
- ❌ Invalid payment data
- ❌ Missing shipping address prerequisite

#### SubmitCheckout Tests

- ✅ Complete checkout submission
- ✅ Final validation passes
- ❌ Incomplete checkout data
- ❌ Inventory unavailable during submission
- ❌ Payment processing failure

## Error Handling Patterns

### Validation Errors

```javascript
// Address validation
if (result.isFailure() && result.error.code === "INVALID_ADDRESS") {
  showAddressValidationErrors(result.error.details);
}

// Payment errors
if (result.isFailure() && result.error.code === "PAYMENT_FAILED") {
  showPaymentErrorMessage(result.error.message);
}
```

### Recovery Strategies

- Graceful degradation for partial checkout completion
- Retry mechanisms for transient failures
- Clear error messaging for user guidance
- Checkout state persistence across sessions

## Performance Considerations

- Minimize repository operations during checkout flow
- Validate data incrementally to provide fast feedback
- Cache checkout state for UI responsiveness
- Asynchronous processing for non-critical validations
