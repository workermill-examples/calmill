# CalMill Test Suite

This directory contains the test suite for the CalMill scheduling platform.

## Structure

```
tests/
├── helpers/
│   └── setup.ts          # Global test setup (Prisma + NextAuth mocks)
├── unit/
│   └── health.test.ts    # Unit tests for API endpoints
└── e2e/                  # (To be added) End-to-end Playwright tests
```

## Running Tests

### Unit Tests (Vitest)

```bash
# Run all unit tests
npm test

# Watch mode
npm run test:watch

# With coverage report
npm test -- --coverage
```

### E2E Tests (Playwright)

```bash
# Run E2E tests
npm run test:e2e

# Run with UI mode
npm run test:e2e:ui
```

## Configuration

- **vitest.config.ts**: Vitest configuration with path aliases and v8 coverage
- **playwright.config.ts**: Playwright configuration (Chromium-only, CI-optimized)

## Test Patterns

### Unit Tests

Tests use Vitest with global test APIs (`describe`, `it`, `expect`). All tests automatically have:

- **Prisma mocked**: No real database calls
- **NextAuth mocked**: Demo user session available
- **Path aliases**: `@/*` resolves to `./src/*`

Example:

```typescript
import { describe, it, expect } from "vitest";
import { mockPrismaClient } from "../helpers/setup";

describe("My Feature", () => {
  it("should work correctly", () => {
    // Your test here
    expect(true).toBe(true);
  });
});
```

### E2E Tests

Playwright tests run against a real Next.js dev server. Use page objects and data-testid attributes for selectors.

## Coverage Thresholds

The test suite enforces minimum coverage thresholds:

- Lines: 80%
- Functions: 80%
- Branches: 75%
- Statements: 80%

Coverage reports are generated in `coverage/` directory.
