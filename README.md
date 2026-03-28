# Shopping Cart Application

A modern e-commerce frontend built with React and Vite.

This project was designed as a portfolio flagship piece to demonstrate how I approach frontend development beyond simple UI building. It focuses on clean code, domain modeling, feature-based architecture, and maintainable application structure.

Rather than treating an e-commerce app as a collection of pages and components, I built it as a structured software system with clear boundaries between business rules, application workflows, infrastructure concerns, and presentation.

## Why this project stands out

Most junior portfolio projects show that a developer can build screens.

This project is meant to show more than that:

- I can organize a frontend codebase for long-term maintainability
- I can model business concepts explicitly instead of scattering logic across components
- I can separate UI concerns from business rules
- I can structure a React application in a way that is easier to test, extend, and refactor
- I can apply software design principles usually associated with larger production systems

This repository reflects the kind of engineering discipline I want to bring to a professional team.

## What the application does

The application implements the core flow of a small e-commerce experience:

- Browse products in a catalog
- Add and remove items from the cart
- Update item quantities with validation
- Review cart contents and totals
- Go through a checkout flow
- Submit an order and display an order confirmation page

The main goal of the project is not just feature delivery, but the quality of the structure behind those features.

## Main technical goals

This project was built to practice and demonstrate:

- React application architecture
- Domain-Driven Design on the frontend
- Clean Architecture principles
- feature-based organization
- dependency injection and composition
- reusable UI design
- separation of concerns
- scalable code organization for future growth

## Architecture

The application follows a layered approach inspired by Clean Architecture and Domain-Driven Design.

### Domain layer

The domain layer contains the core business concepts and rules.

Examples include:

- entities such as cart lines or products
- value objects such as money, quantity, SKU, or product ID
- validation logic tied to business meaning
- domain rules that should not depend on React or browser APIs

This layer is framework-independent and represents the most stable part of the system.

### Application layer

The application layer coordinates business use cases.

Examples include:

- adding an item to the cart
- changing item quantity
- submitting checkout data
- retrieving an order for confirmation

This layer expresses what the system does, while delegating persistence and UI concerns elsewhere.

### Infrastructure layer

The infrastructure layer handles external implementation details.

Examples include:

- local storage persistence
- in-memory repositories
- future API integrations

This allows the business logic to remain independent from specific storage or transport choices.

### UI layer

The UI layer is responsible for rendering the application and handling user interaction.

It includes:

- React components
- route-level pages
- hooks and context providers
- presentational logic

The goal is to keep components focused on presentation and interaction, while pushing business rules into the domain and application layers.

## Project structure

```text
src/
├── App.css
├── App.jsx
├── index.css
├── main.jsx
├── application/
│   ├── composition/
│   │   ├── cart.js
│   │   ├── catalog.js
│   │   ├── checkout.js
│   │   ├── order.js
│   │   └── purchase.js
│   ├── layout/
│   │   ├── AppLayout.jsx
│   │   ├── appLayout.css
│   │   ├── Navbar.jsx
│   │   └── navbar.css
│   ├── routes/
│   │   ├── CartPage.jsx
│   │   ├── cartPage.css
│   │   ├── CheckoutPage.jsx
│   │   ├── checkoutPage.css
│   │   ├── OrderConfirmationPage.jsx
│   │   ├── orderConfirmationPage.css
│   │   ├── StorePage.jsx
│   │   └── storePage.css
│   └── useCases/
├── features/
│   ├── _shared/
│   │   └── domain/
│   ├── cart/
│   │   ├── application/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   └── ui/
│   │       ├── context/
│   │       └── hooks/
│   ├── catalog/
│   │   ├── application/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   └── ui/
│   │       ├── components/
│   │       │   ├── ProductCard.jsx
│   │       │   ├── productCard.css
│   │       │   ├── ProductList.jsx
│   │       │   └── productList.css
│   │       ├── context/
│   │       └── hooks/
│   ├── checkout/
│   └── order/
├── shared/
│   └── components/
│       ├── Button.jsx
│       ├── Card.jsx
│       └── Table.jsx
├── styles/
│   ├── base.css
│   ├── globals.css
│   ├── tokens.css
│   └── utilities.css
├── assets/
└── playground/
```
````

## Feature architecture example

The project is organized by feature so that each business capability owns its own logic.

Example: `cart/`

```text
cart/
├── application/
│   ├── ports/
│   │   └── cartRepository.js
│   └── useCases/
│       ├── addItemToCart.js
│       ├── changeItemQuantity.js
│       ├── getCart.js
│       └── removeItemFromCart.js
├── domain/
│   ├── cart.js
│   ├── cartLine.js
│   └── valueObjects/
│       ├── cartId.js
│       ├── money.js
│       ├── quantity.js
│       └── sku.js
├── infrastructure/
│   ├── inMemoryCartRepository.js
│   └── localStorageCartRepository.js
└── ui/
    ├── context/
    │   └── CartContext.jsx
    └── hooks/
        └── useCart.js
```

This structure helps keep each feature cohesive and makes the codebase easier to extend as the application grows.

## Key implementation highlights

### Business logic modeled explicitly

Instead of placing logic directly in components, core rules are represented through domain objects and use cases.

This leads to code that is easier to reason about and avoids tightly coupling business behavior to React components.

### Separation of concerns

The project separates:

- business rules
- orchestration logic
- persistence details
- rendering logic

This makes the code easier to maintain and reduces the cost of future changes.

### Reusable and scalable organization

The feature-based structure makes it easier to add new features without turning the codebase into a flat collection of unrelated files.

### Frontend architecture with real intent

This is not just a design exercise. The architecture choices support practical development goals:

- easier refactoring
- clearer responsibilities
- better debugging
- easier testing in the future
- smoother transition from mock data to real APIs

## Tech stack

- React
- React Router
- Vite
- JavaScript (ES modules)
- CSS
- ESLint

## Development practices demonstrated

This project reflects the following engineering practices:

- clear folder and naming conventions
- consistent separation between business logic and UI
- use-case driven application flow
- repository pattern for data access abstraction
- component reuse through shared UI building blocks
- comprehensive interface documentation for all abstractions
- preparation for future testing and API integration
- maintainable code organization suitable for team environments

## Interface Documentation

Each feature includes comprehensive documentation for its abstractions, supporting enterprise-level development practices:

- **Repository Interfaces**: Clear contracts for data access patterns ([example](./src/features/cart/application/ports/README.md))
- **Use Case Documentation**: Complete specification of business workflows ([example](./src/features/cart/application/useCases/README.md))
- **Domain Entity Guides**: Detailed object behavior and business rules ([example](./src/features/cart/domain/README.md))
- **Feature Overviews**: Architecture summaries for each business capability ([example](./src/features/cart/README.md))

This approach enables teams to work against interfaces before implementations exist, reduces integration issues, and facilitates knowledge transfer across team members.

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone <repository-url>
cd my-shopping-cart
npm install
npm run dev
```

### Available commands

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## What I learned through this project

This project helped me deepen my understanding of:

- structuring React applications beyond simple component trees
- applying Domain-Driven Design ideas in frontend code
- designing around use cases instead of only pages
- keeping business rules independent from framework code
- building projects that are easier to scale and reason about

It also helped me think more like a software engineer, not only like someone assembling UI.

## Planned improvements

The current version already demonstrates the architectural direction of the project. The next improvements I plan to add include:

- automated tests for domain and application layers
- stronger form validation
- API-backed persistence
- authentication and user-specific carts
- improved accessibility
- stronger production-ready error states
- optional TypeScript migration

## About this portfolio project

I built this application to represent the type of developer I am becoming.

I am especially interested in teams that value:

- clean code
- thoughtful architecture
- maintainable frontend systems
- learning mindset
- long-term product quality

If you are reviewing this project as a recruiter or hiring manager, the main thing I would like you to notice is not only that the app works, but that it was built with structure, intention, and growth in mind.
