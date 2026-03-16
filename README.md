# CalMill

**An open scheduling platform built entirely by AI agents.**

CalMill is a showcase application demonstrating [WorkerMill](https://workermill.com) — an autonomous AI coding platform that takes tickets and ships production code. Every line of code in this repository was written, tested, and deployed by WorkerMill's AI workers.

[Live Demo](https://calmill.workermill.com) | [WorkerMill Platform](https://workermill.com) | [Documentation](https://workermill.com/docs)

[![CI](https://github.com/workermill-examples/calmill/actions/workflows/ci.yml/badge.svg)](https://github.com/workermill-examples/calmill/actions/workflows/ci.yml)
[![Deploy](https://github.com/workermill-examples/calmill/actions/workflows/deploy.yml/badge.svg)](https://github.com/workermill-examples/calmill/actions/workflows/deploy.yml)

---

## What's Inside

CalMill is a real, functional scheduling platform — not a toy demo. It includes:

- **Event Types** — Create meeting types with custom durations, locations, questions, and pricing
- **Slot Calculation Engine** — Timezone-aware availability computation with buffer times, booking limits, and date overrides
- **Google Calendar Sync** — OAuth integration for busy time detection and automatic event creation
- **Public Booking Pages** — Shareable profile pages with calendar picker, timezone selection, and booking form
- **Team Scheduling** — Round-robin and collective scheduling algorithms for team event types
- **Embeddable Widgets** — Inline and popup booking widgets with postMessage callbacks
- **Webhook System** — HMAC-SHA256 signed delivery with event triggers and delivery tracking
- **Recurring Bookings** — Weekly, biweekly, and monthly recurring series with bulk cancellation
- **Email Notifications** — React Email templates via Resend for booking confirmations, reminders, and cancellations
- **Dashboard Analytics** — Stats cards, booking charts, and upcoming meeting overview

## How It Was Built

CalMill was created across multiple WorkerMill task runs (called "epics"), each triggered by cards on a project board:

| Epic | What Was Built |
|------|----------------|
| CMBS-1 | Project scaffolding, Prisma 7 + Neon adapter, auth, slot engine, event types, schedules, bookings, teams, webhooks, Google Calendar, email templates, seed data, unit tests, CI/CD |
| CMBS-2 | shadcn/ui components, dashboard layout, sidebar, booking flow UI, event type management, availability editor, settings pages, team management UI |
| CMBS-3 | E2E test suite, deploy workflow, Playwright configuration, smoke tests, production verification |

Each epic was planned by a WorkerMill planner agent, decomposed into parallel stories, executed by specialist AI personas (frontend developer, backend developer, QA engineer), reviewed by a tech lead agent, and consolidated into a single PR.

## Quality Gates

All code passes automated quality checks before merge:

| Gate | Status |
|------|--------|
| **ESLint** | ✅ 0 errors |
| **TypeScript** | ✅ 0 errors |
| **Build** | ✅ Production build passes |
| **Unit Tests** | ✅ All passing (Vitest) |
| **E2E Tests** | ✅ All passing (Playwright) |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19.2 + TailwindCSS 4 |
| Charts | Recharts |
| Database | PostgreSQL via Prisma 7 ORM (Neon serverless) |
| Auth | NextAuth v5 (JWT strategy) |
| Validation | Zod 4 |
| Dates | date-fns 4 + @date-fns/tz |
| Email | React Email + Resend |
| Testing | Vitest (unit) + Playwright (E2E) |
| Hosting | Vercel |
| CI/CD | GitHub Actions |

## Try the Demo

Visit [calmill.workermill.com](https://calmill.workermill.com) and click **Try the Demo**, or sign in manually:

| | |
|-|-|
| **Email** | demo@workermill.com |
| **Password** | demo1234 |

The demo account comes pre-configured with event types, schedules, bookings, a team with members, and availability data.

## Run Locally

```bash
git clone https://github.com/workermill-examples/calmill.git
cd calmill
npm ci
```

Create `.env.local`:

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/calmill"
DIRECT_DATABASE_URL="postgresql://user:pass@localhost:5432/calmill"
AUTH_SECRET="any-random-string"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SEED_TOKEN="any-random-string"
```

Set up the database and start:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Open [localhost:3000](http://localhost:3000).

---

## API

CalMill exposes a RESTful API for scheduling management. Authenticated endpoints require a session cookie from NextAuth.

### Key Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/event-types` | List event types |
| `POST /api/bookings` | Create a booking (public) |
| `GET /api/slots` | Get available time slots (public) |
| `GET /api/schedules` | List schedules with availability |
| `GET /api/teams` | List teams with members |
| `GET /api/webhooks` | List webhooks |
| `GET /api/dashboard` | Dashboard statistics |
| `GET /api/users/:username` | Public user profile |
| `GET /api/health` | Health check |
| `POST /api/seed` | Seed demo data (token protected) |

---

## Database Schema

```
User ──< Account
  │  ──< Session
  │  ──< EventType ──< Booking
  │  ──< Schedule ──< Availability
  │        └──< DateOverride
  │  ──< TeamMember >── Team ──< EventType
  │  ──< CalendarConnection
  │  ──< Webhook ──< WebhookDelivery
```

14 models, 3 enums (BookingStatus, SchedulingType, TeamRole).

## Development

```bash
npm run dev          # Start dev server
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm test             # Unit tests (Vitest)
npm run test:e2e     # E2E tests (Playwright)
npm run db:studio    # Prisma Studio
```

## About WorkerMill

[WorkerMill](https://workermill.com) is an autonomous AI coding platform. Point it at a ticket, and it:

1. **Plans** — Decomposes the task into parallel stories with file targets
2. **Executes** — Specialist AI personas (frontend dev, backend dev, QA) work in parallel
3. **Reviews** — Tech lead agent reviews each story for quality
4. **Ships** — Creates a consolidated PR with all changes

CalMill exists to demonstrate that WorkerMill can build and maintain a real application end-to-end. Every commit in this repo's history traces back to a WorkerMill task.

## For AI Agents

If you're an AI worker building on this codebase, see [CLAUDE.md](./CLAUDE.md) for development guidelines, version constraints, and deployment instructions.

## License

MIT
