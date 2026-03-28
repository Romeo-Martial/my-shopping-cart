# AddItemToCart Use Case

## Overview

Business use case for adding items to shopping cart with full validation and domain rule enforcement.

## Business Rules

1. **Quantity Validation**: Quantity must be positive integer
2. **SKU Validation**: SKU must be valid product identifier
3. **Price Validation**: Unit price must be positive monetary amount
4. **Duplicate Handling**: Adding existing SKU increases quantity
5. **Cart Limits**: Respects any cart size limitations
6. **Currency Consistency**: All prices maintain consistent currency

## Interface

### Constructor

```javascript
new AddItemToCart(cartRepository);
```

**Parameters**:

- `cartRepository` (CartRepository): Cart persistence abstraction

**Throws**:

- Error if cartRepository is null/undefined

### Execute Method

```javascript
execute({ sku, quantity, unitPriceAmount, currency }): Result<Cart>
```

**Input Parameters**:

- `sku` (string): Product SKU identifier
- `quantity` (number): Item quantity to add
- `unitPriceAmount` (number): Price per unit in minor currency units
- `currency` (string): ISO currency code (e.g., "USD", "EUR")

**Return Value**:

- `Result.success(Cart)`: Updated cart on success
- `Result.failure(DomainError)`: Error details on failure

**Example Usage**:

```javascript
const result = addItemToCart.execute({
  sku: "PRODUCT-123",
  quantity: 2,
  unitPriceAmount: 2999, // $29.99 in cents
  currency: "USD",
});

if (result.isSuccess()) {
  const updatedCart = result.value;
  console.log(`Cart total: ${updatedCart.getTotal()}`);
} else {
  console.error(`Error: ${result.error.message}`);
}
```

## Error Scenarios

### Domain Validation Errors

- **Invalid SKU**: Empty, null, or malformed SKU format
- **Invalid Quantity**: Zero, negative, or non-integer quantity
- **Invalid Price**: Zero, negative, or non-numeric price
- **Invalid Currency**: Unsupported currency code

### System Errors

- **Repository Failure**: Cart retrieval or persistence failure
- **Memory Limits**: Cart size exceeds system limits

## Business Logic Flow

1. **Input Validation**: Validates all input parameters
2. **Cart Retrieval**: Gets current cart state from repository
3. **Domain Object Creation**: Creates value objects (SKU, Quantity, Money)
4. **Business Rule Application**: Applies cart.addItem() domain logic
5. **Persistence**: Saves updated cart state
6. **Result Return**: Returns success/failure result

## Side Effects

- Modifies cart state in repository
- May trigger cart total recalculation
- Updates cart line items collection

## Integration Points

### Dependencies

- CartRepository (port interface)
- Cart domain entity
- Value objects: SKU, Quantity, Money
- Shared: Result, DomainError

### Used By

- Cart UI components via Context
- Cart integration tests
- Application composition layer

## Testing Strategy

### Unit Tests

```javascript
describe("AddItemToCart", () => {
  let mockRepository;
  let useCase;

  beforeEach(() => {
    mockRepository = createMockCartRepository();
    useCase = new AddItemToCart(mockRepository);
  });

  it("should add new item to empty cart", () => {
    // Test implementation
  });

  it("should increase quantity for existing SKU", () => {
    // Test implementation
  });
});
```

### Test Scenarios

- ✅ Add item to empty cart
- ✅ Add item to existing cart
- ✅ Increase quantity for existing SKU
- ❌ Invalid quantity (zero/negative)
- ❌ Invalid SKU format
- ❌ Repository failure
- ❌ Domain rule violations

## Performance Considerations

- O(n) complexity for duplicate SKU detection
- Single repository transaction per execution
- Immutable cart creation on each update
