# CalMill Development Guide

## Commands

| Command             | Description                    |
| ------------------- | ------------------------------ |
| `npm run dev`       | Start development server       |
| `npm run build`     | Build for production           |
| `npm run start`     | Start production server        |
| `npm run lint`      | Run ESLint on src/             |
| `npm run typecheck` | Run TypeScript type checking   |
| `npm run test`      | Run unit tests with Vitest     |
| `npm run test:e2e`  | Run Playwright E2E tests       |
| `npm run db:push`   | Push Prisma schema to database |
| `npm run db:seed`   | Seed database with demo data   |

## Critical Rules (MANDATORY)

### Technology Versions

- **Prisma 7**: Import from `@/generated/prisma/client`, NOT `@prisma/client`
- **TailwindCSS 4**: CSS-first config in `src/app/globals.css` `@theme {}` block, NO `tailwind.config.js`
- **NextAuth v5**: JWT strategy, `bcryptjs` ^3.0.0 (NOT `bcrypt`)
- **date-fns v4 + @date-fns/tz**: Use `TZDate`, `toZonedTime`, `fromZonedTime`, NEVER raw `new Date()`
- **Next.js 16**: Route params are `Promise<{}>`, use `await params`
- **ESLint 9**: Flat config only in `eslint.config.mjs`, NO `.eslintrc.json`

### Database & ORM

- Prisma 7 generates client outside `node_modules` via `output: "../src/generated/prisma"`
- Connection config in `prisma.config.ts`, NOT in `schema.prisma`
- Use `PrismaNeon` adapter from `@prisma/adapter-neon`
- **Neon WebSocket config (CRITICAL):** Node 24 has a built-in `WebSocket` that is INCOMPATIBLE with Neon. You MUST use the `ws` npm package. Set it as the class directly — NOT a factory function, NOT with `typeof WebSocket` checks:
  ```typescript
  import ws from "ws";
  import { neonConfig } from "@neondatabase/serverless";
  neonConfig.webSocketConstructor = ws;
  ```
- All unit tests mock Prisma completely via `vi.mock()` - NO real database

### Testing

- Vitest config: `pool: "forks"`, `testTimeout: 30000`, `fileParallelism: false`
- Unit tests NEVER touch real database - mock everything
- All `useSearchParams()` / `usePathname()` wrapped in `<Suspense>`

### Quality Gates

Always run before commit: `npm run lint && npm run typecheck && npm run build && npm run test`

## Schema Summary

**Models (14)**: Account, Session, User, EventType, Booking, Schedule, Availability, DateOverride, Team, TeamMember, CalendarConnection, Webhook, WebhookDelivery

**Enums (3)**: BookingStatus, SchedulingType, TeamRole

**Key Fields**: All models use `cuid()` IDs, `createdAt`/`updatedAt` timestamps, cascade deletes

## Demo Credentials

- **Email**: `demo@workermill.com`
- **Password**: `demo1234`
- **Username**: `demo`

## Environment Variables

```bash
DATABASE_URL="postgresql://..."
DIRECT_DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SEED_TOKEN="..."
GOOGLE_CLIENT_ID=""    # Optional
GOOGLE_CLIENT_SECRET="" # Optional
RESEND_API_KEY=""      # Optional
```

## Architecture Decisions

**DEC-001**: Created project scaffold with Next.js 16, TailwindCSS 4 CSS-first configuration, ESLint 9 flat config, and Vitest for testing. All configurations follow the latest standards for each technology.
