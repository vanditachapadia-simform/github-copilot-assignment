---
applyTo: "src/components/**/*.ts"
---

# Frontend Instructions — Angular Components

These instructions apply **only** to files matching `src/components/**/*.ts`. They supplement the general project rules with Angular-specific best practices.

## 1. Angular Best Practices

- Use the **Angular CLI** conventions for generating components, services, pipes, and directives.
- Leverage **dependency injection** for all service consumption — never instantiate services manually.
- Use `OnPush` change detection strategy for presentational/pure components to improve performance.
- Always unsubscribe from Observables — prefer `AsyncPipe` in templates or use `takeUntilDestroyed()`.
- Use **Angular Signals** or **RxJS** for reactive state management, depending on the project's Angular version.

## 2. Component Design

- Keep components **small and focused** — each component should represent a single UI concern.
- Separate **smart (container) components** from **dumb (presentational) components**.
  - Smart components handle data fetching and state management.
  - Dumb components receive data via `@Input()` and emit events via `@Output()`.
- Limit component template files to under 50 lines — extract sub-components when templates grow large.
- Avoid putting business logic inside components — delegate to services.

## 3. TypeScript Strictness

- Enable and respect `strict` mode in `tsconfig.json`.
- Define **interfaces** or **types** for all data models, API responses, and component inputs/outputs.
- Avoid using `any` — use `unknown` with type guards when the type is truly dynamic.
- Use **enums** or **union types** for fixed sets of values (e.g., status codes, roles).
- Explicitly type function return values for all public methods.

## 4. Folder Structure and Naming

- Follow this folder structure inside `src/components/`:
  ```
  src/components/
  ├── feature-name/
  │   ├── feature-name.component.ts
  │   ├── feature-name.component.html
  │   ├── feature-name.component.css
  │   ├── feature-name.component.spec.ts
  │   ├── feature-name.service.ts        (if feature-specific)
  │   └── feature-name.model.ts          (interfaces/types)
  ```
- Use **kebab-case** for all file and folder names.
- Suffix files by type: `.component.ts`, `.service.ts`, `.pipe.ts`, `.directive.ts`, `.model.ts`, `.spec.ts`.
- Group related components under a shared **feature folder**.

## 5. Styling

- Use **component-scoped styles** (`encapsulation: ViewEncapsulation.Emulated` — the default).
- Avoid global style overrides from within components.
- Prefer CSS custom properties (variables) for theming.
- Use BEM naming convention or Angular's `:host` and `::ng-deep` (sparingly) for style targeting.

## 6. Template Guidelines

- Use `trackBy` functions with `*ngFor` / `@for` to optimize list rendering.
- Avoid complex expressions in templates — move logic to the component class or a pipe.
- Use Angular's built-in directives and pipes before creating custom ones.
- Always provide `alt` attributes for images and `aria-*` attributes for accessibility.
