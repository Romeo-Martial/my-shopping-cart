# Cart Feature Documentation

## Overview

Complete shopping cart feature implementation following Clean Architecture and Domain-Driven Design principles.

## Architecture Layers

### Domain Layer (`./domain/`)

**Pure business logic with no external dependencies**

- [`README.md`](./domain/README.md) - Cart aggregate root documentation
- `cart.js` - Main Cart entity with business rules
- `cartLine.js` - Cart line value object
- `valueObjects/` - Domain value objects (CartId, SKU, Quantity, Money)

### Application Layer (`./application/`)

**Business use cases and interface definitions**

- **Ports** (`./application/ports/`)
  - [`README.md`](./application/ports/README.md) - CartRepository interface documentation
  - `cartRepository.js` - Repository abstraction
- **Use Cases** (`./application/useCases/`)
  - [`README.md`](./application/useCases/README.md) - Use case documentation and examples
  - `addItemToCart.js` - Add item business process
  - `removeItemFromCart.js` - Remove item business process
  - `changeItemQuantity.js` - Update quantity business process
  - `getCart.js` - Retrieve cart business process

### Infrastructure Layer (`./infrastructure/`)

**External concerns and concrete implementations**

- `inMemoryCartRepository.js` - In-memory storage implementation
- `localStorageCartRepository.js` - Browser storage implementation

### UI Layer (`./ui/`)

**React presentation layer**

- `context/CartContext.jsx` - React Context provider for cart state
- `hooks/useCart.js` - Custom hook for cart operations

## Key Abstractions

### 1. CartRepository Interface

**Location**: `./application/ports/`
**Documentation**: [`README.md`](./application/ports/README.md)

Abstract interface for cart persistence operations enabling multiple storage strategies.

### 2. Cart Use Cases

**Location**: `./application/useCases/`
**Documentation**: [`README.md`](./application/useCases/README.md)

Business use cases implementing cart workflows with full validation and error handling.

### 3. Cart Domain Entity

**Location**: `./domain/`  
**Documentation**: [`README.md`](./domain/README.md)

Core Cart aggregate enforcing business rules and maintaining data consistency.

## Benefits of Documentation

### For Development Teams

- **Clear Contracts**: Interface definitions prevent integration issues
- **Onboarding**: New developers understand abstractions quickly
- **Parallel Development**: Teams can work against interfaces before implementations exist
- **Testing**: Documented behavior enables comprehensive test coverage

### For Enterprise Environments

- **Cross-Team Collaboration**: Different teams can implement/consume interfaces independently
- **API Stability**: Documented contracts prevent breaking changes
- **Code Reviews**: Reviewers can validate against documented specifications
- **Knowledge Transfer**: Domain expertise captured in interface documentation

## Usage Patterns

### Dependency Injection

```javascript
// Composition root
const cartRepository = new LocalStorageCartRepository();
const addItemUseCase = new AddItemToCart(cartRepository);

// React Context
<CartProvider addItemToCart={addItemUseCase}>
  <App />
</CartProvider>;
```

### Error Handling

```javascript
const result = useCase.execute(params);

if (result.isSuccess()) {
  // Handle success
  const data = result.value;
} else {
  // Handle domain error
  const error = result.error;
}
```

### Testing Strategy

```javascript
// Mock abstractions for unit testing
const mockRepository = createMockCartRepository();
const useCase = new AddItemToCart(mockRepository);
```

## Design Principles Applied

- **Single Responsibility**: Each abstraction has focused purpose
- **Open/Closed**: New implementations without changing interfaces
- **Liskov Substitution**: All implementations honor interface contracts
- **Interface Segregation**: Minimal, client-focused interfaces
- **Dependency Inversion**: High-level modules depend on abstractions

This documentation ensures that cart feature abstractions can be safely used by other teams and modules without deep implementation knowledge.
