# AGENTS.md — Developer Agent Instructions & Project Guidelines

This document contains context, style guides, and command references for AI coding agents operating on the **Catálogo Web de Tecnología** repository.

---

## 1. Project Context & Scope

This is a modern technology catalog frontend application. It is frontend-first and offline-capable (mock data), aiming for high visual polish, clean responsive design, and robust code architecture.

- **Stack**: React 19 (Vite), TypeScript 6, Raw CSS custom variables (designed for future Tailwind CSS transition).
- **Scope**: Frontend-only. NO real database, backend, authentication, or shopping cart checkout is implemented. WhatsApp dynamic integration is used for lead generation and product queries.
- **Mock Data**: Fully driven by local JSON files mapping the `Product` data structure.

---

## 2. CLI Reference & Commands

Always use the standard package manager (`npm`) for dependencies and scripts.

- **Start Development Server**:
  ```bash
  npm run dev
  ```
- **Lint the Codebase**:
  ```bash
  npm run lint
  ```
- **Production Build**:
  ```bash
  npm run build
  ```
  _Rule_: NEVER run builds after changes unless explicitly requested by the user. Let the compiler verification handle checks.
- **Testing**:
  - Currently, no testing framework is configured in `package.json`.
  - If a test framework (e.g., Vitest) is introduced, the script will be:
    ```bash
    npm run test
    ```
  - To run a single test file using Vitest:
    ```bash
    npx vitest run path/to/file.test.ts
    ```

---

## 3. Architecture & File Structure

The project implements a **Feature-Based Architecture** combined with **Component-Driven Development**. You must strictly adhere to the following structure:

```
src/
├── features/            # Feature domains (Home, Catalog, Product, Contact)
│   ├── home/
│   │   ├── components/  # Presentation-only components
│   │   ├── sections/    # Modular page sections
│   │   └── Home.tsx     # Feature container component
│   ├── catalog/
│   │   ├── components/  # Product lists, filter bars, search bars
│   │   ├── hooks/       # useSearch, useFilters
│   │   └── Catalog.tsx
│   └── product/
│       ├── components/  # Gallery, specs, reviews, WhatsApp buttons
│       └── ProductDetail.tsx
├── shared/              # Reusable modules across features
│   ├── components/      # Common UI elements (Buttons, Cards, Modals)
│   ├── layouts/         # Layout components (MainLayout)
│   ├── hooks/           # useDarkMode
│   └── interfaces/      # Shared interfaces (Product)
├── routes/              # Routing configurations (React Router DOM)
├── App.tsx              # Application shell & root layout
└── main.tsx             # Application entry point
```

---

## 4. Code Style & Design Patterns

### 4.1 Imports

- Group and order imports to maintain consistency:
  1. React core, hooks, and standard library.
  2. Third-party packages (e.g., React Router, Lucide icons).
  3. Shared utilities, hooks, layouts, and interfaces.
  4. Local feature components, assets, and styles.
- Example:

  ```tsx
  import { useState, useMemo } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';

  import { useDarkMode } from '../../shared/hooks/useDarkMode';
  import { Product } from '../../shared/interfaces/product.interface';
  import { ProductCard } from '../components/ProductCard';
  ```

### 4.2 React & Design Patterns

- **Container / Presentational Pattern**: Keep UI files clean. Separate data fetching, state management, and business logic into Container components or Custom Hooks, passing data as props to Presentational components.
- **Custom Hooks**: Any complex filter logic, search indexing, theme toggles, or interaction with WhatsApp link builders must be isolated into custom hooks.
- **Single Responsibility (SRP)**: Each component must focus on one job. Break down large components into smaller, highly reusable components.
- **Open/Closed Principle**: Design shared UI elements to accept style overrides and configurations via flexible props (`className`, custom icons, sizes) rather than modifying their core implementations.

### 4.3 TypeScript Guidelines

- Maintain strict type safety. Avoid using `any` under any circumstances.
- Declare clear and detailed Interfaces for all data models. E.g.:
  ```typescript
  export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
    description: string;
    brand?: string;
    specs?: Record<string, string>;
  }
  ```
- Always define return types of functions, event handlers, and Custom Hooks.

### 4.4 Naming Conventions

- **Component Files**: `PascalCase.tsx` (e.g., `ProductGallery.tsx`).
- **Hooks**: `camelCase.ts` starting with `use` (e.g., `useProductFilters.ts`).
- **Interfaces / Types**: `PascalCase` with explicit suffixes if shared (e.g., `Product` or `ProductInterface`).
- **Styles / CSS Classnames**: Use consistent class names. If raw CSS is used, declare semantic variables in `:root` and follow simple utility or BEM styling.

### 4.5 Error Handling & Robustness

- **Fallback States**: Provide fallback visual displays for images that fail to load (`src/assets/placeholder.png` or a beautiful empty block).
- **Parameter Validation**: Validate URL dynamic parameters (e.g., `/product/:id`). If a product is not found, render a clean "Product Not Found" fallback page with a clear redirection button to Catalog.
- **WhatsApp String Sanitization**: When generating dynamic WhatsApp strings, always use `encodeURIComponent` to protect URL syntax integrity.

---

## 5. Persistent Memory and Workflow (Engram Protocol)

Coding agents must actively use the **Engram Persistent Memory system**.

- **Save decisions**: Call `mem_save` immediately after any architectural decisions, bug fixes, custom hook designs, or when setting up styling strategies.
- **Session summarizes**: Call `mem_session_summary` before ending any coding segment or declaring the task finished.
- **No attribution**: Do not attribute commits to AI. Use conventional commits exclusively (e.g., `feat(catalog): implement search filtering by category`).
