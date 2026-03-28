# Product Domain Entity

## Overview

Product entity representing catalog items with business rules and data validation, following Domain-Driven Design patterns.

## Domain Concepts

- **Entity**: Has identity (ProductId) and rich behavior
- **Immutable**: State changes create new instances
- **Value Objects**: Composed of strongly typed value objects
- **Business Rules**: Enforces product data constraints

## Constructor

```javascript
new Product({ id, name, price, imageUrl, category });
```

**Parameters**:

- `id` (ProductId): Unique product identifier value object
- `name` (ProductName): Product display name value object
- `price` (Money): Product price value object
- `imageUrl` (ProductImageUrl): Product image URL value object
- `category` (ProductCategory): Product category value object

**Invariants**:

- All parameters must be proper value object instances
- Product ID must be unique and valid
- Price must be positive monetary amount
- Name cannot be empty
- Image URL must be valid URL format

**Throws**:

- Error if any parameter is not the expected value object type
- Error if any value object validation fails

## Public Interface

### Core Properties

```javascript
product.id; // ProductId - Unique product identifier
product.name; // ProductName - Product display name
product.price; // Money - Product price with currency
product.imageUrl; // ProductImageUrl - Product image URL
product.category; // ProductCategory - Product category
```

### Business Methods

#### `rename(newName): Product`

**Purpose**: Creates new product instance with updated name

**Parameters**:

- `newName` (ProductName): New product name value object

**Returns**: New Product instance with updated name

**Business Rules**:

- Name must be valid ProductName value object
- All other properties remain unchanged
- Maintains product identity (same ID)

**Example**:

```javascript
const newName = new ProductName("Updated Product Name");
const updatedProduct = product.rename(newName);
```

#### `updatePrice(newPrice): Product`

**Purpose**: Creates new product instance with updated price

**Parameters**:

- `newPrice` (Money): New price value object

**Returns**: New Product instance with updated price

**Business Rules**:

- Price must be positive Money value object
- Currency consistency with existing price
- Maintains product identity

#### `updateCategory(newCategory): Product`

**Purpose**: Creates new product instance with updated category

**Parameters**:

- `newCategory` (ProductCategory): New category value object

**Returns**: New Product instance with updated category

**Business Rules**:

- Category must be valid ProductCategory
- Maintains product identity and other attributes

#### `isInCategory(category): boolean`

**Purpose**: Checks if product belongs to specified category

**Parameters**:

- `category` (ProductCategory): Category to check against

**Returns**: true if product is in the category, false otherwise

#### `isSameProduct(other): boolean`

**Purpose**: Checks if two products represent the same entity

**Parameters**:

- `other` (Product): Another product to compare

**Returns**: true if products have same ProductId

**Business Rules**:

- Identity comparison based on ProductId only
- Properties may differ but represent same product

#### `getDisplayName(): string`

**Purpose**: Gets formatted display name for UI

**Returns**: String representation of product name

#### `getFormattedPrice(): string`

**Purpose**: Gets formatted price for display

**Returns**: Formatted price string with currency symbol

## Value Objects Used

### ProductId

- Unique identifier for product entity
- Validates format and uniqueness constraints
- Ensures product identity consistency

### ProductName

- Product display name with validation
- Enforces naming rules and length constraints
- Handles localization considerations

### Money

- Price representation with currency
- Validates positive amounts and currency codes
- Ensures monetary calculation accuracy

### ProductImageUrl

- Product image URL with validation
- Ensures valid URL format
- Supports different image formats

### ProductCategory

- Product categorization with validation
- Enforces category hierarchy rules
- Supports category-based filtering

## Business Invariants

### Data Consistency

1. Product must always have valid ProductId
2. Name cannot be empty or whitespace only
3. Price must be positive monetary value
4. Image URL must be accessible and valid format
5. Category must be from approved category list

### Domain Rules

1. **Identity Rule**: ProductId uniquely identifies product
2. **Pricing Rule**: Price must be positive with valid currency
3. **Naming Rule**: Name must be descriptive and within length limits
4. **Category Rule**: Must belong to valid product category
5. **Immutable State**: Product properties cannot be modified directly

## Usage Examples

### Creating New Product

```javascript
const product = new Product({
  id: new ProductId("LAPTOP-001"),
  name: new ProductName("Gaming Laptop Pro"),
  price: new Money(149999, "USD"), // $1,499.99
  imageUrl: new ProductImageUrl("https://example.com/laptop.jpg"),
  category: new ProductCategory("Electronics"),
});
```

### Product Operations

```javascript
// Update product name
const renamedProduct = product.rename(new ProductName("Gaming Laptop Pro Max"));

// Update price
const repricedProduct = product.updatePrice(
  new Money(179999, "USD"), // $1,799.99
);

// Check category
const isElectronics = product.isInCategory(new ProductCategory("Electronics")); // true

// Get display values
const displayName = product.getDisplayName(); // "Gaming Laptop Pro"
const priceDisplay = product.getFormattedPrice(); // "$1,499.99"
```

### Product Comparison

```javascript
const product1 = new Product({...});
const product2 = new Product({...});

const isSame = product1.isSameProduct(product2);
console.log(`Same product: ${isSame}`);
```

## Integration Points

### Used By

- Catalog use cases (GetProducts, GetProductById)
- Product repositories for data mapping
- Catalog UI components for display
- Cart operations for item management
- Order creation for product references

### Dependencies

- Value objects: ProductId, ProductName, Money, ProductImageUrl, ProductCategory
- No external service dependencies (pure domain logic)

## Testing Strategy

### Unit Test Categories

- **Constructor validation** (invalid parameters, value object types)
- **Business method behavior** (rename, update price, category operations)
- **Comparison operations** (identity checks, category membership)
- **Display formatting** (name and price formatting)
- **Immutability** (state changes create new instances)

### Test Examples

```javascript
describe("Product Domain Entity", () => {
  it("should enforce valid value object types in constructor", () => {
    expect(() => {
      new Product({
        id: "invalid-string", // Should be ProductId
        name: validName,
        price: validPrice,
        imageUrl: validUrl,
        category: validCategory,
      });
    }).toThrow("id must be of type ProductId");
  });

  it("should create new instance when renaming", () => {
    const newName = new ProductName("New Name");
    const renamedProduct = product.rename(newName);

    expect(renamedProduct).not.toBe(product);
    expect(renamedProduct.name).toBe(newName);
    expect(renamedProduct.id).toBe(product.id);
  });

  it("should correctly identify same products", () => {
    const sameProduct = new Product({
      id: product.id, // Same ID
      name: new ProductName("Different Name"),
      price: new Money(99999, "USD"),
      imageUrl: validUrl,
      category: validCategory,
    });

    expect(product.isSameProduct(sameProduct)).toBe(true);
  });
});
```

## Business Logic Patterns

- **Factory Pattern**: Consider ProductFactory for complex creation
- **Specification Pattern**: Category and filtering rules
- **Value Object Pattern**: Rich domain modeling with validation
- **Entity Pattern**: Identity-based equality and lifecycle management
