# CalMill

**A full-stack scheduling platform built entirely by AI agents.**

CalMill is a showcase application demonstrating [WorkerMill](https://workermill.com) — an autonomous AI coding platform that takes Jira/Linear/GitHub tickets and ships production code. Every line of code in this repository was written, tested, and deployed by WorkerMill's AI workers.

[Live Demo](https://calmill.workermill.com) | [WorkerMill Platform](https://workermill.com) | [Documentation](https://workermill.com/docs)

[![CI](https://github.com/workermill-examples/calmill/actions/workflows/ci.yml/badge.svg)](https://github.com/workermill-examples/calmill/actions/workflows/ci.yml)
[![Deploy](https://github.com/workermill-examples/calmill/actions/workflows/deploy.yml/badge.svg)](https://github.com/workermill-examples/calmill/actions/workflows/deploy.yml)

---

## What's Inside

CalMill is a real, functional scheduling platform — not a toy demo. It includes:

- **Event Types** — Create different meeting types with custom durations, locations, and questions
- **Smart Scheduling** — Timezone-aware availability with automatic conflict detection
- **Team Booking** — Round-robin and collective scheduling for teams
- **Public Booking Pages** — Share your personalized link (e.g., `calmill.workermill.com/demo`)
- **Google Calendar Sync** — Connect Google Calendar for real-time busy/free detection
- **Email Notifications** — Booking confirmations and reminders via Resend
- **Authentication** — Email/password and Google OAuth support
- **Responsive UI** — Works on desktop and mobile

## How It Was Built

CalMill was created across multiple WorkerMill task runs (called "epics"), each triggered by tickets on a project board:

| Epic | Stories | What Was Built |
|------|---------|----------------|
| CM-1 | 9 | Project scaffolding, auth, database schema, Prisma 7 + Neon adapter, CI/CD, Vercel deployment |
| CM-2 | 7 | Event types CRUD, schedule/availability management, booking API routes |
| CM-3 | 6 | Public booking pages, timezone-aware slot calculation, booking confirmation flow |
| CM-4 | 8 | Dashboard analytics, Google Calendar integration, email notifications, team features |
| CM-5 | 6 | Settings pages, calendar connection UI, webhook support |
| CM-6 | 5 | Polish — responsive layout, color themes, loading states, error handling |
| CM-7 | 4 | Comprehensive test suite — 202 unit tests + E2E flows |
| CM-8 | 3 | Dashboard page, stat cards, booking charts, upcoming list |

Each epic was planned by a WorkerMill planner agent, decomposed into parallel stories, executed by specialist AI personas (frontend developer, backend developer, QA engineer), reviewed by a tech lead agent, and consolidated into a single PR.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Server Components) |
| UI | React 19 + TailwindCSS 4 |
| Database | PostgreSQL via Prisma 7 ORM (Neon serverless) |
| Auth | NextAuth v5 |
| Validation | Zod 4 |
| Testing | Vitest (unit) + Playwright (E2E) |
| Hosting | Vercel |
| CI/CD | GitHub Actions |

## Try the Demo

Visit [calmill.workermill.com](https://calmill.workermill.com) and click **Try the Demo**, or sign in manually:

| | |
|-|-|
| **Email** | demo@workermill.com |
| **Password** | demo1234 |

The demo account comes pre-configured with availability schedules, event types, and sample bookings.

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
npx prisma db seed
npm run dev
```

Open [localhost:3000](http://localhost:3000).

---

## Embed Widgets

CalMill supports embedding booking pages directly into any website — no redirects required.

### Inline Embed

Renders the booking form inside your page:

```html
<!-- Add this where you want the booking form to appear -->
<div data-calmill-embed="demo/30min" data-calmill-theme="light"></div>

<!-- Add the embed script once, anywhere on the page -->
<script src="https://calmill.workermill.com/embed/calmill-embed.js" async></script>
```

### Popup Embed

Opens the booking form as a modal when a button is clicked:

```html
<!-- Any button or link can trigger the popup -->
<button data-calmill-popup="demo/30min">Book a Meeting</button>

<!-- Or use any element -->
<a href="#" data-calmill-popup="demo/30min">Schedule a call</a>

<script src="https://calmill.workermill.com/embed/calmill-embed.js" async></script>
```

### Embed Options

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-calmill-theme` | `light` / `dark` | Color theme for the embed |
| `data-calmill-hide-details` | `true` | Hide event details panel |
| `data-calmill-timezone` | e.g. `America/New_York` | Override timezone |

### Embed Code Generator

In the dashboard, navigate to **Event Types → [Event] → Embed** to generate embed code with a live preview and configuration options.

### Live Preview

See the embed demo at [calmill.workermill.com/calmill-embed-demo.html](https://calmill.workermill.com/calmill-embed-demo.html).

---

## Webhooks

Receive real-time notifications when bookings are created, cancelled, rescheduled, or change status.

### Setting Up Webhooks

1. Go to **Settings → Webhooks** in the dashboard
2. Click **Add Webhook**
3. Enter your HTTPS endpoint URL
4. Select the events you want to receive
5. Save — CalMill generates a signing secret

### Supported Events

| Event | Description |
|-------|-------------|
| `BOOKING_CREATED` | New booking scheduled |
| `BOOKING_CANCELLED` | Booking cancelled |
| `BOOKING_RESCHEDULED` | Booking moved to a new time |
| `BOOKING_ACCEPTED` | Booking confirmed |
| `BOOKING_REJECTED` | Booking declined |

### Payload Format

```json
{
  "event": "BOOKING_CREATED",
  "createdAt": "2026-02-20T15:00:00Z",
  "data": {
    "booking": {
      "uid": "clxyz...",
      "title": "30 Minute Meeting",
      "startTime": "2026-02-25T15:00:00Z",
      "endTime": "2026-02-25T15:30:00Z",
      "status": "ACCEPTED",
      "attendee": {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "timezone": "Europe/London"
      }
    }
  }
}
```

### Signature Verification

All webhook payloads are signed using HMAC-SHA256. Verify the `X-CalMill-Signature` header:

```javascript
const crypto = require("crypto");

function verifyWebhookSignature(payload, signature, secret) {
  const expected = "sha256=" + crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

---

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    api/                  # Server-side API routes
    (dashboard)/          # Authenticated layout (sidebar + header)
      dashboard/          # Dashboard with analytics
      event-types/        # Event type management
      bookings/           # Booking management
      availability/       # Schedule editor
      settings/           # User and calendar settings
    (public)/             # Public booking pages
      [username]/         # User profile and booking flow
    login/ signup/        # Auth pages
  components/
    ui/                   # Reusable UI components (Button, Input, etc.)
    dashboard/            # Dashboard stat cards, charts, lists
    event-types/          # Event type editor tabs
  lib/
    auth.ts               # NextAuth v5 configuration
    prisma.ts             # PrismaClient singleton
    utils.ts              # Utility functions
    validations.ts        # Zod schemas
prisma/
  schema.prisma           # Database schema (12 models, 3 enums)
  seed.ts                 # Demo data seeder
tests/
  unit/                   # Vitest unit tests (202 tests)
  e2e/                    # Playwright E2E tests
```

## Database Schema

```
User ──< Schedule ──< Availability
  │         │
  │         └──< DateOverride
  │
  ├──< EventType ──< Booking
  │
  ├──< CalendarConnection
  │
  └──< TeamMember >── Team
```

12 models: User, EventType, Booking, Schedule, Availability, DateOverride, Team, TeamMember, CalendarConnection, Webhook, Account, Session.

## Development

```bash
npm run dev          # Start dev server
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm test             # Unit tests (Vitest)
npm run test:e2e     # E2E tests (Playwright)
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
