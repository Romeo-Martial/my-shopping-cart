# Cart Domain Entity

## Overview

Cart aggregate root representing a shopping cart with items, following Domain-Driven Design patterns. Encapsulates cart business rules and ensures data consistency.

## Domain Concepts

- **Aggregate Root**: Main entry point for cart operations
- **Entity**: Has identity and lifecycle
- **Immutable**: State changes create new instances
- **Business Rules**: Enforces cart constraints and validation

## Constructor

```javascript
new Cart(id, lines);
```

**Parameters**:

- `id` (CartId): Unique cart identifier value object
- `lines` (CartLine[]): Array of cart line items

**Invariants**:

- Cart ID must be valid CartId instance
- All lines must be CartLine instances
- No duplicate SKUs allowed in cart
- All lines must have positive quantities

**Throws**:

- Error if ID is not CartId instance
- Error if lines contain non-CartLine objects
- Error if duplicate SKUs found

## Public Interface

### Core Properties

```javascript
cart.id; // CartId - Unique cart identifier
cart.lines; // CartLine[] - Cart line items (immutable)
```

### Business Methods

#### `addItem(sku, quantity, unitPrice): Cart`

**Purpose**: Adds item or increases quantity for existing SKU

**Parameters**:

- `sku` (Sku): Product SKU value object
- `quantity` (Quantity): Quantity value object
- `unitPrice` (Money): Unit price value object

**Returns**: New Cart instance with updated state

**Business Rules**:

- If SKU exists, increases quantity by specified amount
- If SKU new, creates new cart line
- Validates all parameters are proper value objects
- Maintains cart line ordering

**Example**:

```javascript
const updatedCart = cart.addItem(
  new Sku("PRODUCT-123"),
  new Quantity(2),
  new Money(2999, "USD"),
);
```

#### `removeItem(sku): Cart`

**Purpose**: Removes cart line for specified SKU

**Parameters**:

- `sku` (Sku): SKU to remove

**Returns**: New Cart instance without specified item

**Business Rules**:

- Completely removes cart line for SKU
- No-op if SKU doesn't exist
- Maintains other cart lines unchanged

#### `changeItemQuantity(sku, newQuantity): Cart`

**Purpose**: Updates quantity for existing cart line

**Parameters**:

- `sku` (Sku): SKU to update
- `newQuantity` (Quantity): New quantity value

**Returns**: New Cart instance with updated quantity

**Business Rules**:

- Must be existing SKU in cart
- Quantity must be positive
- Creates new cart line with updated quantity

#### `getTotal(): Money`

**Purpose**: Calculates total cart value

**Returns**: Money object representing cart total

**Calculation**:

- Sums (quantity × unit price) for all cart lines
- Maintains currency consistency
- Returns zero if cart empty

#### `getTotalItems(): number`

**Purpose**: Gets total item count across all cart lines

**Returns**: Sum of quantities for all cart lines

#### `isEmpty(): boolean`

**Purpose**: Checks if cart has no items

**Returns**: true if lines array is empty

#### `getLineForSku(sku): CartLine | null`

**Purpose**: Retrieves cart line for specific SKU

**Parameters**:

- `sku` (Sku): SKU to search for

**Returns**: CartLine if found, null otherwise

## Value Objects Used

### CartId

- Unique identifier for cart instance
- Validates UUID format
- Ensures cart identity consistency

### CartLine

- Represents single product line in cart
- Contains: SKU, quantity, unit price, total price
- Immutable value object

### Supporting Value Objects

- **Sku**: Product identifier with validation
- **Quantity**: Positive integer quantity
- **Money**: Currency amount with precision

## Business Invariants

### Data Consistency

1. Cart must always have valid CartId
2. No duplicate SKUs in cart lines
3. All quantities must be positive
4. All prices must use same currency
5. Cart lines cannot be null/undefined

### Domain Rules

1. **Single SKU Rule**: Each SKU can appear only once
2. **Positive Quantity**: All quantities must be > 0
3. **Currency Consistency**: All money amounts same currency
4. **Immutable State**: Cart state cannot be modified directly

## Usage Examples

### Creating New Cart

```javascript
const cartId = new CartId("123e4567-e89b-12d3-a456-426614174111");
const cart = new Cart(cartId, []);
```

### Adding Items

```javascript
let cart = new Cart(cartId, []);

cart = cart.addItem(
  new Sku("LAPTOP-001"),
  new Quantity(1),
  new Money(99999, "USD"), // $999.99
);

cart = cart.addItem(
  new Sku("MOUSE-001"),
  new Quantity(2),
  new Money(2999, "USD"), // $29.99
);
```

### Checking Cart State

```javascript
console.log(`Total items: ${cart.getTotalItems()}`); // 3
console.log(`Total value: ${cart.getTotal().toDisplayString()}`); // $1,059.97
console.log(`Is empty: ${cart.isEmpty()}`); // false
```

## Integration Points

### Used By

- Cart use cases (AddItemToCart, RemoveItemFromCart, etc.)
- Cart repositories for persistence
- Cart context for React state management
- Order creation during checkout

### Dependencies

- Value objects: CartId, CartLine, Sku, Quantity, Money
- No external service dependencies (pure domain logic)

## Testing Strategy

### Unit Test Categories

- **Constructor validation** (invalid parameters)
- **Business method behavior** (add/remove/change items)
- **Calculation accuracy** (totals, item counts)
- **Immutability** (state changes create new instances)
- **Edge cases** (empty cart, duplicate operations)

### Test Examples

```javascript
describe("Cart Domain Entity", () => {
  it("should enforce no duplicate SKUs", () => {
    expect(() => {
      new Cart(cartId, [line1, duplicateLine1]);
    }).toThrow("Duplicate SKU in cart");
  });

  it("should calculate correct total", () => {
    const total = cart.getTotal();
    expect(total.amount).toBe(expectedAmount);
  });
});
```
