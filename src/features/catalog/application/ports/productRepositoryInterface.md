# ProductRepository Interface

## Overview

Abstract repository interface for Product catalog operations. Provides data access abstraction following the Repository pattern from Domain-Driven Design.

## Purpose

- Decouples product business logic from storage mechanism
- Enables multiple data sources (APIs, databases, mock data)
- Facilitates unit testing through dependency injection
- Maintains clean architecture boundaries

## Interface Contract

### Methods

#### `getProducts(): Promise<Product[]>`

**Purpose**: Retrieves all available products from catalog

**Returns**:

- Promise resolving to array of Product entities

**Throws**:

- Error if product retrieval fails
- Network errors for remote data sources

**Usage**:

```javascript
const products = await productRepository.getProducts();
```

#### `getProductById(productId: ProductId): Promise<Product>`

**Purpose**: Retrieves specific product by identifier

**Parameters**:

- `productId` (ProductId): Product identifier value object

**Returns**:

- Promise resolving to Product entity

**Throws**:

- Error if product not found
- Error if productId is invalid
- Network errors for remote data sources

**Usage**:

```javascript
const productId = new ProductId("product-123");
const product = await productRepository.getProductById(productId);
```

## Implementation Requirements

### Invariants

1. Repository must return valid Product entities
2. getProducts() must handle empty catalog gracefully
3. getProductById() must validate ProductId parameter

### Error Handling

- Implementations should throw descriptive errors on failure
- Use domain-specific error types when possible
- Handle network failures gracefully for remote sources

### Performance Considerations

- Consider caching strategies for frequently accessed products
- Implement pagination for large catalogs
- Optimize network requests for remote data

## Available Implementations

### FakeStoreProductRepository

- External API integration with FakeStore API
- Located: `../infrastructure/fakeStoreProductRepository.js`
- Includes data mapping from external format

## Usage in Use Cases

Use cases depend on this abstraction via constructor injection:

```javascript
class GetProducts {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute() {
    const products = await this.productRepository.getProducts();
    return Result.success(products);
  }
}
```

## Testing Strategy

Mock this interface for unit testing use cases:

```javascript
const mockRepository = {
  getProducts: jest.fn(),
  getProductById: jest.fn(),
};
```

## Design Principles

- **Single Responsibility**: Only product persistence concerns
- **Interface Segregation**: Minimal, focused interface
- **Dependency Inversion**: High-level modules depend on abstraction
- **Open/Closed**: New data sources via new implementations

## External Integration

This interface abstracts external product catalogs:

- Third-party e-commerce APIs
- Content management systems
- Product information management (PIM) systems
- Internal microservices
