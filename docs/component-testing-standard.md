# Component Testing Standard (Locked)

Use this standard for all new React component tests in this repository.

- Framework: Vitest (`describe`, `it`, `expect`, `vi`).
- Renderer: React Testing Library (`render`, `screen`).
- Matchers: `@testing-library/jest-dom/vitest`.
- Test shape: one scenario per test (`1 test = 1 behavior`).
- File naming: component test file must be near component and named `*.test.tsx`.
- Typing: strict TypeScript, do not use `any`.

## Assertions Style

- Prefer user-level checks via `screen` (`getByRole`, `getByText`, `getByTestId`).
- Keep assertions minimal and deterministic.
- Avoid snapshots.
- If a component is async server component: call it first, then render:
- `const ui = await Component(props);`
- `render(ui);`

## Mocking Rules

- Use `vi.mock(...)` for external dependencies and heavy children.
- Mock by module boundary, not internal implementation details.
- Reuse global/common mocks from `vitest.setup.tsx`.
- In local test files, add only feature-specific mocks required for scenario.
- If global mock already replaces component output, assert mocked output.

## Structure And Style

- Keep test code concise, flat, and readable.
- Use semantic test names: `renders ...`, `shows ...`, `calls ...`.
- No nested test structures beyond one `describe` block unless needed.
- No dead code/comments in tests.

## Coverage Policy For Components

- Every React component (`*.tsx`) should have a paired `*.test.tsx`.
- Exception: empty or placeholder files without exported React component.
- Container components are tested as composition units with mocked children/services.
- UI components are tested for rendered output and main conditional branches.

## Commands

- Main command: `npm run test:components`.
- Alias: `npm run test:component`.
- Vitest include scope must contain:
- `src/views/**/*.test.tsx`
- `src/app/**/*.test.tsx`
- `src/widgets/**/*.test.tsx`

## API Unit Testing Standard (Locked)

Use this standard for all new API route unit tests in `src/app/api`.

- Framework: Vitest (`describe`, `it`, `expect`, `vi`).
- Scope: unit tests for `route.ts` exports (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
- File naming: test file is near route file and named `route.test.ts`.
- Typing: strict TypeScript, do not use `any`.
- Environment: run with `vitest.api.config.ts` (`node` environment).

### API Assertions Style

- One test = one behavior.
- For each exported HTTP method, assert binding to source handler only.
- Primary assertion format: `expect(METHOD).toBe(serverModule.handler)`.
- Keep tests deterministic and minimal. No snapshots.

### API Mocking Rules

- Mock only module boundaries with `vi.mock(...)`.
- Use factory mocks with inline `vi.fn()` to avoid hoisting/TDZ issues.
- Import mocked module as namespace (`import * as moduleName from '...'`) and compare exported method reference against that namespace member.
- Do not test internal implementation of server handlers in route unit tests.

### API Structure

- Single `describe` per route file.
- Semantic test names: `exports GET handler ...`, `exports POST handler ...`.
- Flat, readable test body with no dead code/comments.

### API Commands

- Main command: `npm run test:api:unit`.
- Config: `vitest.api.config.ts`.
- Include scope: `src/app/api/**/*.test.ts`.

### API Prompt Template

Use this template when creating new API route unit tests:

```md
Create/extend unit tests for `src/app/api/**/route.ts` using Vitest.
Rules:
- Keep tests near route file as `route.test.ts`.
- Mock only server/module boundary via `vi.mock(...)` with inline `vi.fn()`.
- Import mocked module as namespace and assert route export binding:
  `expect(GET|POST|PUT|PATCH|DELETE).toBe(namespace.handler)`.
- One test per exported method.
- No `any`, no snapshots.
- Run and validate with `npm run test:api:unit`.
```
