# Catalog Use Cases

## Overview

Business use cases for product catalog operations with full validation and error handling.

## Use Cases

### GetProducts Use Case

#### Overview

Retrieves all available products from the catalog for display in the store interface.

#### Business Rules

1. **Availability**: Only returns products that are available for purchase
2. **Data Integrity**: All returned products must have complete information
3. **Performance**: Results should be cacheable for improved performance
4. **Error Recovery**: Graceful handling of external service failures

#### Interface

##### Constructor

```javascript
new GetProducts(productRepository);
```

**Parameters**:

- `productRepository` (ProductRepository): Product data access abstraction

**Throws**:

- Error if productRepository is null/undefined

##### Execute Method

```javascript
execute(): Promise<Result<Product[]>>
```

**Return Value**:

- `Result.success(Product[])`: Array of products on success
- `Result.failure(DomainError)`: Error details on failure

**Example Usage**:

```javascript
const result = await getProducts.execute();

if (result.isSuccess()) {
  const products = result.value;
  console.log(`Found ${products.length} products`);
} else {
  console.error(`Error: ${result.error.message}`);
}
```

#### Error Scenarios

- **Repository Failure**: External API or database failure
- **Network Issues**: Connectivity problems with remote services
- **Data Validation**: Invalid product data from external sources
- **Empty Catalog**: No products available (handled gracefully)

### GetProductById Use Case

#### Overview

Retrieves specific product details by identifier for product detail views.

#### Business Rules

1. **Product Existence**: Product must exist in catalog
2. **Valid Identifier**: ProductId must be properly formatted
3. **Complete Data**: Returned product must have all required fields
4. **Access Control**: Only accessible products are returned

#### Interface

##### Constructor

```javascript
new GetProductById(productRepository);
```

**Parameters**:

- `productRepository` (ProductRepository): Product data access abstraction

**Throws**:

- Error if productRepository is null/undefined

##### Execute Method

```javascript
execute(productId: ProductId): Promise<Result<Product>>
```

**Input Parameters**:

- `productId` (ProductId): Product identifier value object

**Return Value**:

- `Result.success(Product)`: Product entity on success
- `Result.failure(DomainError)`: Error details on failure

**Example Usage**:

```javascript
const productId = new ProductId("product-123");
const result = await getProductById.execute(productId);

if (result.isSuccess()) {
  const product = result.value;
  console.log(`Product: ${product.name.value}`);
} else {
  console.error(`Error: ${result.error.message}`);
}
```

#### Error Scenarios

- **Product Not Found**: ProductId doesn't exist in catalog
- **Invalid ProductId**: Malformed or null identifier
- **Repository Failure**: Data access errors
- **Data Corruption**: Retrieved product fails validation

## Business Logic Flow

### GetProducts Flow

1. **Repository Access**: Calls productRepository.getProducts()
2. **Data Validation**: Ensures all products are valid entities
3. **Result Mapping**: Converts to Result wrapper
4. **Error Handling**: Catches and wraps any exceptions

### GetProductById Flow

1. **Input Validation**: Validates ProductId parameter
2. **Repository Access**: Calls productRepository.getProductById()
3. **Existence Check**: Verifies product was found
4. **Result Mapping**: Converts to Result wrapper
5. **Error Handling**: Catches and wraps any exceptions

## Integration Points

### Dependencies

- ProductRepository (port interface)
- Product domain entity
- ProductId value object
- Shared: Result, DomainError

### Used By

- Catalog UI components via Context
- Product detail pages
- Search and filtering components
- Product recommendation systems

## Testing Strategy

### Unit Tests

```javascript
describe("GetProducts", () => {
  let mockRepository;
  let useCase;

  beforeEach(() => {
    mockRepository = createMockProductRepository();
    useCase = new GetProducts(mockRepository);
  });

  it("should return all products when catalog has items", async () => {
    // Test implementation
  });

  it("should return empty array when catalog is empty", async () => {
    // Test implementation
  });
});

describe("GetProductById", () => {
  let mockRepository;
  let useCase;

  beforeEach(() => {
    mockRepository = createMockProductRepository();
    useCase = new GetProductById(mockRepository);
  });

  it("should return product when it exists", async () => {
    // Test implementation
  });

  it("should return error when product not found", async () => {
    // Test implementation
  });
});
```

### Test Scenarios

#### GetProducts Tests

- ✅ Return products from populated catalog
- ✅ Handle empty catalog gracefully
- ❌ Repository failure scenarios
- ❌ Network connectivity issues
- ❌ Invalid product data from source

#### GetProductById Tests

- ✅ Return existing product
- ✅ Valid ProductId parameter
- ❌ Product not found
- ❌ Invalid ProductId format
- ❌ Repository failure
- ❌ Data validation errors

## Performance Considerations

- Asynchronous operations for external data sources
- Consider result caching for frequently accessed data
- Pagination support for large catalogs
- Efficient data transfer from repositories
