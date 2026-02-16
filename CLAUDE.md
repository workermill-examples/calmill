# CalMill Worker Development Guide

## Project Overview

CalMill is a Next.js 16 scheduling application built with React 19, Prisma 7, and TailwindCSS 4. This guide provides essential information for AI workers contributing to the project.

## Tech Stack & Versions

### Core Framework
- **Next.js:** `^16.1.0` (App Router)
- **React:** `^19.2.0`
- **TypeScript:** `^5.7.0`
- **Node.js:** `>=20.0.0`

### Database & ORM
- **Prisma:** `^7.4.0` with PostgreSQL
- **Database:** Neon PostgreSQL
- **Adapter:** `@prisma/adapter-neon` for Prisma 7

### Styling & UI
- **TailwindCSS:** `^4.1.0` (CSS-first configuration)
- **PostCSS:** `@tailwindcss/postcss`
- No `tailwind.config.js` - all configuration in CSS `@theme` blocks

### Authentication
- **NextAuth:** `5.0.0-beta.30` (v5 with JWT strategy)
- **Providers:** Credentials, Google OAuth
- **Adapter:** `@auth/prisma-adapter`

### Testing
- **Unit Tests:** Vitest `^4.0.0`
- **E2E Tests:** Playwright `^1.58.0`
- **Coverage:** `@vitest/coverage-v8`

## Key Conventions

### Prisma 7 Patterns

**CRITICAL:** Prisma 7 has breaking changes from v5. Follow these patterns exactly:

1. **Client Import:** Import from generated location, NOT `@prisma/client`
   ```typescript
   import { PrismaClient } from "@/generated/prisma/client";
   ```

2. **Neon Adapter Required:** Use the adapter pattern for database connections
   ```typescript
   import { PrismaNeon } from "@prisma/adapter-neon";

   const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
   const prisma = new PrismaClient({ adapter });
   ```

3. **No prisma.config.ts:** Connection configuration is handled via environment variables and adapters

### NextAuth v5 Patterns

1. **Server-side Auth Check:**
   ```typescript
   import { auth } from "@/lib/auth";

   const session = await auth();
   if (!session) redirect("/login");
   ```

2. **Client-side Auth:**
   ```typescript
   import { useSession, signIn, signOut } from "next-auth/react";
   ```

3. **API Route Handlers:**
   ```typescript
   export const { GET, POST } = handlers; // from @/lib/auth
   ```

### TailwindCSS 4 (CSS-First)

**NO JavaScript config files.** All configuration in CSS:

```css
@import "tailwindcss";

@theme {
  --color-primary-500: #3b82f6;
  --font-sans: "Inter", ui-sans-serif, system-ui;
  --radius-md: 0.5rem;
}
```

## File Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── (dashboard)/        # Authenticated route group
│   ├── (public)/           # Public route group
│   ├── api/                # API routes
│   └── globals.css         # TailwindCSS imports & theme
├── components/
│   ├── ui/                 # Reusable UI primitives
│   └── providers.tsx       # Client-side providers
├── lib/
│   ├── auth.ts             # NextAuth v5 configuration
│   ├── prisma.ts           # PrismaClient singleton
│   ├── utils.ts            # Utility functions
│   └── validations.ts      # Zod schemas
├── generated/
│   └── prisma/             # Prisma 7 generated client (gitignored)
└── types/
    ├── index.ts            # App-specific types
    └── next-auth.d.ts      # NextAuth type augmentation
```

## Development Commands

### Essential Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Lint code
npm run lint

# Type checking
npm run typecheck

# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e
```

### Database Commands
```bash
# Generate Prisma client (after schema changes)
npx prisma generate

# Apply schema changes to database
npx prisma db push

# Reset database and apply schema
npx prisma db push --force-reset

# Seed database with demo data
npx tsx prisma/seed.ts

# View database in Prisma Studio
npx prisma studio
```

## Database Schema

The schema includes 12 models across 4 categories:

### Auth Models (NextAuth)
- `Account` - OAuth account connections
- `Session` - User sessions

### Core Models
- `User` - User profiles with timezone, preferences
- `EventType` - Bookable meeting types with duration, pricing, constraints
- `Booking` - Scheduled meetings with attendee details
- `Schedule` - Availability templates
- `Availability` - Time slots (with `@@unique([scheduleId, day])`)
- `DateOverride` - Exceptions to regular availability

### Team Models
- `Team` - Organizations with members
- `TeamMember` - User-team relationships with roles

### Integration Models
- `CalendarConnection` - External calendar integrations
- `Webhook` - Event notifications

## Environment Variables

Required variables for development:

```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://..."           # Pooled connection
DIRECT_DATABASE_URL="postgresql://..."    # Direct connection for migrations

# Authentication
AUTH_SECRET="..."                         # NextAuth secret key
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."                    # Optional: Google OAuth
GOOGLE_CLIENT_SECRET="..."

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SEED_TOKEN="calmill-seed-token-dev"       # Protects seed API route
```

## Testing Setup

### Unit Tests (Vitest)
- **Environment:** Node.js with global test APIs
- **Mocks:** Comprehensive Prisma and NextAuth mocks in `tests/helpers/setup.ts`
- **Coverage:** V8 provider targeting `src/**/*.ts`
- **Path Aliases:** `@/*` resolves to `./src/*`

### E2E Tests (Playwright)
- **Browser:** Chromium-only for CI performance
- **Base URL:** `http://localhost:3000`
- **Web Server:** Integrated dev server startup

## API Routes

### Public Endpoints
- `GET /api/health` - System health check
- `POST /api/seed` - Database seeding (requires Bearer token)
- `POST /api/auth/signup` - User registration

### NextAuth Endpoints
- `GET|POST /api/auth/[...nextauth]` - NextAuth handlers

## Common Patterns

### Server Component with Auth
```typescript
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return <div>Hello {session.user.name}</div>;
}
```

### API Route with Validation
```typescript
import { auth } from "@/lib/auth";
import { eventTypeSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const result = eventTypeSchema.safeParse(body);
  if (!result.success) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  // Handle validated data
}
```

### Prisma Operations
```typescript
import { prisma } from "@/lib/prisma";

// Create with relations
const eventType = await prisma.eventType.create({
  data: {
    title: "30 Min Meeting",
    slug: "30min",
    duration: 30,
    userId: session.user.id,
  },
});

// Query with relations
const userWithEventTypes = await prisma.user.findUnique({
  where: { id: session.user.id },
  include: { eventTypes: true },
});
```

## Deployment

### CI/CD Pipeline
- **CI:** Runs on push/PR to main (lint, typecheck, test, build)
- **Deploy:** Runs on main push after CI passes
- **Platform:** Vercel with pre-configured project and secrets

### Pre-configured Infrastructure
- **Vercel Project:** `prj_X16gHljg2G3W6CDAKKWQZuDEVvhu`
- **Domain:** `calmill.workermill.com`
- **Database:** Neon PostgreSQL with pooling
- **Secrets:** All environment variables pre-set in Vercel and GitHub

## Demo Data

The seed script creates:
- **Demo User:** `demo@workermill.com` / `demo1234`
- **Username:** `demo`
- **Schedule:** "Business Hours" (Mon-Fri 9-5 EST)
- **Event Types:** "30 Minute Meeting", "60 Minute Consultation"

## Troubleshooting

### Common Issues

1. **Prisma Client Not Generated**
   ```bash
   npx prisma generate
   ```

2. **Database Connection Issues**
   - Check `DATABASE_URL` format
   - Ensure Neon adapter is configured
   - Verify database exists and is accessible

3. **Build Errors**
   - Run `npm run typecheck` to catch TypeScript issues
   - Check that all environment variables are set
   - Ensure Prisma client is generated

4. **Auth Issues**
   - Verify `AUTH_SECRET` is set (min 32 characters)
   - Check `NEXTAUTH_URL` matches your domain
   - Confirm NextAuth v5 patterns are used

### Performance Tips
- Use `npm ci` instead of `npm install` in CI
- Generate Prisma client before builds
- Leverage Vercel's edge functions for auth checks
- Optimize images with Next.js Image component

## Migration Notes

This project uses Prisma 7 and NextAuth v5, both of which have breaking changes from previous versions. When working with existing code or examples:

- **Prisma:** Import paths, adapter patterns, and configuration have changed
- **NextAuth:** Session handling, route exports, and TypeScript types are different
- **TailwindCSS 4:** No JavaScript config, CSS-first approach only

Always refer to this guide and the current codebase patterns rather than external documentation for older versions.