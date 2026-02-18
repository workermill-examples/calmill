# CalMill Worker Development Guide

> **For AI Workers building CalMill features**
> This guide contains critical conventions, patterns, and commands for working on the CalMill codebase.

## Tech Stack

### Core Framework
- **Next.js 16.1+** — App Router, Server Components, Server Actions
- **React 19.2+** — Latest features including automatic batching
- **TypeScript 5.7+** — Strict mode enabled

### Database & ORM
- **Prisma 7.4+** — Modern ORM with new configuration patterns
- **PostgreSQL** — Hosted on Neon (serverless Postgres)
- **@prisma/adapter-neon** — Required for Prisma 7 + Neon compatibility

### Authentication
- **NextAuth v5** (beta.30) — Next-generation auth for Next.js
- **@auth/prisma-adapter** — Prisma integration for NextAuth

### Styling
- **TailwindCSS 4.1+** — CSS-first configuration (NO JavaScript config)
- **@tailwindcss/postcss** — PostCSS plugin for Tailwind 4

### Validation & Utilities
- **Zod 4.3+** — Schema validation
- **date-fns 4.1+** — Date manipulation
- **bcryptjs** — Password hashing

### Testing
- **Vitest 4+** — Unit testing with v8 coverage
- **Playwright 1.58+** — E2E testing (Chromium only)

---

## Critical Conventions

### 1. Prisma 7 Configuration (BREAKING CHANGES)

**Connection URLs go in `prisma.config.ts`, NOT in schema:**

```typescript
// prisma.config.ts (root of project)
import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    url: process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL || "postgresql://localhost:5432/calmill",
  },
});
```

**Schema uses generator output path:**

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}
```

**Import from generated path:**

```typescript
import { PrismaClient } from "@/generated/prisma/client";
```

**NOT** from `@prisma/client` — Prisma 7 moves generated code outside node_modules.

### 2. Neon Adapter Required

Prisma 7 requires an adapter for Neon connections:

```typescript
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL!;
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

// Singleton pattern for development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

### 3. TailwindCSS 4 CSS-First Configuration

**NO `tailwind.config.js` or `tailwind.config.ts`** — Tailwind 4 uses CSS-first configuration.

**PostCSS config:**

```javascript
// postcss.config.js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

**All customization in CSS:**

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  --color-primary-500: #3b82f6;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --radius-md: 0.5rem;
}
```

### 4. NextAuth v5 Patterns

**Export handlers, auth, signIn, signOut:**

```typescript
// src/lib/auth.ts
import NextAuth from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // ... config
});
```

**Use `auth()` for session checks:**

```typescript
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return <div>Dashboard</div>;
}
```

**Route handlers:**

```typescript
// src/app/api/auth/[...nextauth]/route.ts
export { GET, POST } from "@/lib/auth";
```

### 5. Path Aliases

All imports use `@/*` alias:

```typescript
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import type { User } from "@/types";
```

Configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Common Commands

### Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run typecheck
```

### Database

```bash
# Generate Prisma Client (run after schema changes)
npx prisma generate

# Push schema to database (dev/staging)
npx prisma db push

# Create and apply migration (production)
npx prisma migrate dev --name migration_name

# Open Prisma Studio (database GUI)
npx prisma studio

# Seed database
npx prisma db seed
```

### Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

---

## Project Structure

```
calmill/
├── prisma/
│   ├── schema.prisma          # Database schema (12 models, 3 enums)
│   └── seed.ts                # Demo data seeding
├── prisma.config.ts           # Prisma 7 configuration
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (dashboard)/       # Authenticated routes
│   │   ├── (public)/          # Public booking pages
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── ui/                # Reusable UI primitives
│   │   └── providers.tsx      # Client-side providers
│   ├── generated/
│   │   └── prisma/            # Generated Prisma Client (gitignored)
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # PrismaClient singleton
│   │   ├── utils.ts           # Shared utilities
│   │   └── validations.ts     # Zod schemas
│   └── types/
│       ├── index.ts           # App types
│       └── next-auth.d.ts     # NextAuth type augmentation
├── tests/
│   ├── helpers/setup.ts       # Test mocks and setup
│   ├── unit/                  # Vitest unit tests
│   └── e2e/                   # Playwright E2E tests
└── .github/workflows/         # CI/CD pipelines
```

---

## Key Files

### Database

- **`prisma/schema.prisma`** — 12 models: User, Account, Session, EventType, Booking, Schedule, Availability, DateOverride, Team, TeamMember, CalendarConnection, Webhook
- **`src/lib/prisma.ts`** — PrismaClient singleton with Neon adapter
- **`prisma/seed.ts`** — Creates demo user (email: demo@workermill.com, password: demo1234)

### Authentication

- **`src/lib/auth.ts`** — NextAuth v5 config with Credentials + Google providers
- **`src/types/next-auth.d.ts`** — Augments session with `id`, `username`, `timezone`
- **`src/app/api/auth/[...nextauth]/route.ts`** — NextAuth route handlers

### Utilities

- **`src/lib/utils.ts`** — `cn()`, `formatDate()`, `generateSlug()`, `generateUsername()`, `debounce()`
- **`src/lib/validations.ts`** — Zod schemas for login, signup, event types, bookings, schedules

---

## Environment Variables

Required environment variables (see `.env.example`):

```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://..."              # Pooled connection (used by app)
DIRECT_DATABASE_URL="postgresql://..."       # Direct connection (used by Prisma CLI)

# Authentication
AUTH_SECRET="openssl rand -base64 32"        # NextAuth secret
NEXTAUTH_URL="http://localhost:3000"         # App URL
GOOGLE_CLIENT_ID=""                          # OAuth (optional)
GOOGLE_CLIENT_SECRET=""                      # OAuth (optional)

# Email (Resend)
RESEND_API_KEY=""                            # Email service (optional)
EMAIL_FROM="CalMill <noreply@calmill.workermill.com>"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # Public app URL
SEED_TOKEN="<random-string>"                 # Protect seed endpoint (openssl rand -hex 32)
```

---

## Testing Patterns

### Unit Tests (Vitest)

```typescript
import { describe, it, expect } from "vitest";

describe("formatDate", () => {
  it("formats dates correctly", () => {
    const date = new Date("2024-01-15T10:00:00Z");
    expect(formatDate(date)).toBe("Jan 15, 2024");
  });
});
```

### E2E Tests (Playwright)

```typescript
import { test, expect } from "@playwright/test";

test("user can log in", async ({ page }) => {
  await page.goto("/login");
  await page.fill('input[name="email"]', "demo@workermill.com");
  await page.fill('input[name="password"]', "demo1234");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/event-types");
});
```

---

## Common Gotchas

### 1. Prisma Client Not Regenerating

If you change `schema.prisma`, you **must** run:

```bash
npx prisma generate
```

Otherwise imports from `@/generated/prisma/client` will be stale.

### 2. Database Connection in Development

Use `DATABASE_URL` (pooled) for application code.
Use `DIRECT_DATABASE_URL` (direct) for Prisma CLI commands.

Neon requires the adapter — don't try to use `PrismaClient` without it.

### 3. NextAuth v5 Session Access

Server Components: use `auth()`
Client Components: use `useSession()` hook (from `next-auth/react`)

```typescript
// Server Component
import { auth } from "@/lib/auth";
const session = await auth();

// Client Component
"use client";
import { useSession } from "next-auth/react";
const { data: session } = useSession();
```

### 4. TailwindCSS 4 Import

Always use `@import "tailwindcss"` in your CSS, NOT `@tailwind base; @tailwind components; @tailwind utilities;`

### 5. Path Imports in Tests

Vitest is configured with the `@/*` alias. Use it consistently:

```typescript
import { prisma } from "@/lib/prisma";  // ✅ Correct
import { prisma } from "../../lib/prisma";  // ❌ Avoid
```

---

## Deployment

### CI/CD

- **`.github/workflows/ci.yml`** — Runs on all pushes and PRs: lint, typecheck, test, build
- **`.github/workflows/deploy.yml`** — Deploys to Vercel on main branch push after CI passes

### Production

- **Platform:** Vercel
- **URL:** https://calmill.workermill.com
- **Database:** Neon PostgreSQL (serverless)
- **Auto-deploy:** DISABLED — manual deployment via GitHub Actions only

---

## Getting Help

### Resources

- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- NextAuth v5 Docs: https://authjs.dev
- TailwindCSS 4 Docs: https://tailwindcss.com/docs

### Demo Credentials

- **Email:** demo@workermill.com
- **Password:** demo1234
- **Public Profile:** https://calmill.workermill.com/demo

---

**Last Updated:** 2026-02-16
**Version:** 1.0.0
