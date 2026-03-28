# CartRepository Interface

## Overview

Abstract repository interface for Cart aggregate persistence operations. Provides data access abstraction following the Repository pattern from Domain-Driven Design.

## Purpose

- Decouples cart business logic from storage mechanism
- Enables multiple storage implementations (in-memory, localStorage, database)
- Facilitates unit testing through dependency injection
- Maintains clean architecture boundaries

## Interface Contract

### Methods

#### `getCart(): Cart`

**Purpose**: Retrieves the current cart instance

**Returns**:

- Cart aggregate with current state

**Throws**:

- Error if cart retrieval fails

**Usage**:

```javascript
const cart = cartRepository.getCart();
```

#### `save(cart: Cart): void`

**Purpose**: Persists cart changes to storage

**Parameters**:

- `cart` (Cart): The cart aggregate to persist

**Throws**:

- Error if cart is null/undefined
- Error if persistence operation fails

**Usage**:

```javascript
cartRepository.save(updatedCart);
```

## Implementation Requirements

### Invariants

1. Repository must maintain cart state consistency
2. getCart() must always return a valid Cart instance
3. save() must persist all cart changes atomically

### Error Handling

- Implementations should throw descriptive errors on failure
- Use domain-specific error types when possible
- Maintain transaction integrity

## Available Implementations

### InMemoryCartRepository

- Fast, volatile storage for development/testing
- Located: `../infrastructure/inMemoryCartRepository.js`

### LocalStorageCartRepository

- Browser-based persistence
- Located: `../infrastructure/localStorageCartRepository.js`

## Usage in Use Cases

Use cases depend on this abstraction via constructor injection:

```javascript
class AddItemToCart {
  constructor(cartRepository) {
    this.cartRepository = cartRepository;
  }

  execute(params) {
    const cart = this.cartRepository.getCart();
    // ... business logic
    this.cartRepository.save(updatedCart);
  }
}
```

## Testing Strategy

Mock this interface for unit testing use cases:

```javascript
const mockRepository = {
  getCart: jest.fn(),
  save: jest.fn(),
};
```

## Design Principles

- **Single Responsibility**: Only cart persistence concerns
- **Interface Segregation**: Minimal, focused interface
- **Dependency Inversion**: High-level modules depend on abstraction
- **Open/Closed**: New storage mechanisms via new implementations
