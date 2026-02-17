# CalMill

> **Open Scheduling for Everyone**
>
> A modern scheduling platform built entirely by autonomous AI workers, orchestrated by [WorkerMill](https://workermill.com).

[![CI](https://github.com/workermill-examples/calmill/actions/workflows/ci.yml/badge.svg)](https://github.com/workermill-examples/calmill/actions/workflows/ci.yml)
[![Deploy](https://github.com/workermill-examples/calmill/actions/workflows/deploy.yml/badge.svg)](https://github.com/workermill-examples/calmill/actions/workflows/deploy.yml)

**Live Demo:** [calmill.workermill.com](https://calmill.workermill.com)

---

## What is CalMill?

CalMill is an open-source scheduling platform that lets individuals and teams create customizable booking pages, manage availability, and coordinate meetings — all without the back-and-forth of email scheduling.

**Key Features:**

- 📅 **Event Types** — Create different meeting types with custom durations, locations, and questions
- ⏰ **Smart Scheduling** — Timezone-aware availability with automatic conflict detection
- 👥 **Team Booking** — Round-robin and collective scheduling for teams
- 🔗 **Public Booking Pages** — Share your personalized booking link (e.g., `calmill.workermill.com/demo`)
- 🔐 **Secure Authentication** — Email/password and Google OAuth support
- 🎨 **Modern UI** — Built with Next.js 16, React 19, and TailwindCSS 4
- 🧩 **Embeddable Widgets** — Inline and popup booking widgets for any website
- 🔔 **Webhooks** — Event-driven notifications for booking lifecycle events
- 🔁 **Recurring Bookings** — Weekly, biweekly, and monthly recurring event support

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16.1+ (App Router, Server Components) |
| **UI Library** | React 19.2+ |
| **Language** | TypeScript 5.7+ (strict mode) |
| **Styling** | TailwindCSS 4.1+ (CSS-first configuration) |
| **Database** | PostgreSQL (Neon serverless) |
| **ORM** | Prisma 7.4+ (with Neon adapter) |
| **Authentication** | NextAuth v5 (beta.30) |
| **Validation** | Zod 4.3+ |
| **Testing** | Vitest 4+ (unit), Playwright 1.58+ (E2E) |
| **Deployment** | Vercel (with GitHub Actions CI/CD) |

---

## Getting Started

### Prerequisites

- **Node.js 24+** (required)
- **PostgreSQL database** (Neon recommended)
- **npm** or **pnpm**

### 1. Clone the Repository

```bash
git clone https://github.com/workermill-examples/calmill.git
cd calmill
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your values:

```bash
# Database (required)
DATABASE_URL="postgresql://user:password@host:5432/calmill"
DIRECT_DATABASE_URL="postgresql://user:password@host:5432/calmill"

# Authentication (required)
AUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Optional: Email (Resend)
RESEND_API_KEY=""
EMAIL_FROM="CalMill <noreply@yourdomain.com>"

# Seed Protection
SEED_TOKEN="your-secret-seed-token"
```

### 4. Set Up Database

Generate the Prisma Client and push the schema to your database:

```bash
npx prisma generate
npx prisma db push
```

Seed the database with demo data:

```bash
npx prisma db seed
```

This creates a demo user:
- **Email:** demo@workermill.com
- **Password:** demo1234

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

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
calmill/
├── prisma/
│   ├── schema.prisma          # Database schema (12 models, 3 enums)
│   └── seed.ts                # Demo data seeding
├── prisma.config.ts           # Prisma 7 configuration
├── vercel.json                # Vercel deployment config (CORS, iframe headers)
├── public/
│   ├── embed/
│   │   └── calmill-embed.js   # Embed script (inline + popup widgets)
│   └── calmill-embed-demo.html # Live embed demo page
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (dashboard)/       # Authenticated layout (sidebar + header)
│   │   │   ├── event-types/   # Event type management
│   │   │   │   └── [id]/embed/ # Embed code generator
│   │   │   ├── bookings/      # Booking management
│   │   │   ├── availability/  # Schedule editor
│   │   │   └── settings/
│   │   │       └── webhooks/  # Webhook management
│   │   ├── (public)/          # Public booking pages
│   │   │   └── [username]/    # User profile and booking pages
│   │   ├── embed/             # Embed-optimized booking pages
│   │   │   ├── layout.tsx     # Minimal layout (no nav)
│   │   │   └── [username]/[slug]/ # Embed booking page
│   │   ├── login/             # Authentication pages
│   │   ├── signup/
│   │   └── api/               # API routes
│   │       ├── health/        # Health check endpoint
│   │       ├── webhooks/      # Webhook CRUD + delivery
│   │       └── bookings/      # Booking routes (with webhook integration)
│   ├── components/
│   │   └── ui/                # Reusable UI components
│   ├── generated/
│   │   └── prisma/            # Generated Prisma Client (gitignored)
│   ├── lib/
│   │   ├── auth.ts            # NextAuth v5 configuration
│   │   ├── prisma.ts          # PrismaClient singleton
│   │   ├── utils.ts           # Utility functions
│   │   ├── validations.ts     # Zod schemas
│   │   └── webhooks.ts        # Webhook delivery with HMAC signing
│   └── types/
│       ├── index.ts           # TypeScript types
│       └── next-auth.d.ts     # NextAuth type extensions
├── e2e/                       # Playwright E2E tests (88 tests)
│   ├── helpers/               # Auth, booking, seed utilities
│   └── *.spec.ts              # Test suites by feature
├── tests/
│   ├── unit/                  # Vitest unit tests
│   └── e2e/                   # Legacy E2E tests
└── .github/workflows/         # CI/CD pipelines
```

---

## Database Schema

CalMill uses **12 Prisma models** organized into logical groups:

### Authentication (NextAuth)
- **Account** — OAuth provider accounts
- **Session** — User sessions

### Core Models
- **User** — User profiles, preferences, timezone
- **EventType** — Meeting types with custom settings
- **Booking** — Scheduled meetings
- **Schedule** — User availability templates
- **Availability** — Weekly availability rules
- **DateOverride** — Specific date exceptions

### Team Features
- **Team** — Team profiles
- **TeamMember** — Team membership with roles

### Integrations
- **CalendarConnection** — Google/Outlook calendar sync
- **Webhook** — Event webhooks for integrations

### Enums
- **BookingStatus** — PENDING, ACCEPTED, CANCELLED, REJECTED, RESCHEDULED
- **SchedulingType** — ROUND_ROBIN, COLLECTIVE
- **TeamRole** — OWNER, ADMIN, MEMBER

---

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Pooled database connection (for app) | `postgresql://user:pass@host:5432/db` |
| `DIRECT_DATABASE_URL` | Direct database connection (for Prisma CLI) | `postgresql://user:pass@host:5432/db` |
| `AUTH_SECRET` | NextAuth encryption secret | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Application URL | `https://calmill.workermill.com` |
| `NEXT_PUBLIC_APP_URL` | Public-facing app URL | `https://calmill.workermill.com` |

### Optional

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | From Google Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | From Google Console |
| `RESEND_API_KEY` | Email service API key | From Resend |
| `EMAIL_FROM` | Sender email address | `CalMill <noreply@calmill.workermill.com>` |
| `SEED_TOKEN` | Protect seed endpoint | Any secure random string |

---

## Development

### Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript compiler

# Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # Run E2E tests with UI

# Database
npx prisma generate      # Generate Prisma Client
npx prisma db push       # Push schema to database
npx prisma studio        # Open database GUI
npx prisma db seed       # Seed database with demo data
```

### Testing

CalMill uses a comprehensive testing strategy:

**Unit Tests (Vitest):**
- Fast, isolated tests for utilities, validations, and business logic
- Coverage tracking with v8
- Run with `npm run test`

**E2E Tests (Playwright):**
- Full browser automation testing user flows
- Chromium-only for speed
- Run with `npm run test:e2e`

---

## Deployment

### Production Setup

#### Required GitHub Secrets

Set these in your repository's **Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel API token |
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `DATABASE_URL` | Pooled Neon PostgreSQL connection string |
| `DIRECT_DATABASE_URL` | Direct Neon PostgreSQL connection string |
| `AUTH_SECRET` | NextAuth secret (`openssl rand -base64 32`) |
| `SEED_TOKEN` | Token to protect the `/api/seed` endpoint |

#### Production Deployment Checklist

Before going live, verify:

- [ ] All GitHub secrets are configured
- [ ] Vercel environment variables match your `.env` file
- [ ] Database migrations applied: `npx prisma db push`
- [ ] Demo data seeded via `/api/seed` or `npx prisma db seed`
- [ ] Health check passes: `GET https://calmill.workermill.com/api/health`
- [ ] Public booking page works: `https://calmill.workermill.com/demo/30min`
- [ ] Embed script accessible: `https://calmill.workermill.com/embed/calmill-embed.js`
- [ ] Embed script has CORS header `Access-Control-Allow-Origin: *`
- [ ] Embed pages allow iframe embedding (`X-Frame-Options: ALLOWALL`)

### CI/CD Pipeline

CalMill uses GitHub Actions for continuous integration and deployment:

#### CI Workflow (`.github/workflows/ci.yml`)

Runs on every push and pull request:

1. **Lint** — ESLint and Prettier checks
2. **Type Check** — TypeScript compilation
3. **Unit Tests** — Vitest with coverage
4. **Build** — Next.js production build
5. **E2E Tests** — Playwright browser tests

#### Deploy Workflow (`.github/workflows/deploy.yml`)

Runs on every push to `main` branch:

1. Run database migrations (`prisma db push`)
2. Seed demo data
3. Deploy to Vercel using CLI
4. Health check verification (`/api/health`)
5. Embed script accessibility check (CORS headers)
6. Deployment summary

### Manual Deployment

To deploy manually to Vercel:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## Architecture Decisions

### Prisma 7 Configuration

CalMill uses **Prisma 7.4+** with breaking changes from previous versions:

- **Configuration file:** `prisma.config.ts` (NOT schema.prisma datasource)
- **Generated client location:** `src/generated/prisma/` (NOT node_modules)
- **Import path:** `@/generated/prisma/client` (NOT `@prisma/client`)
- **Neon adapter:** Required for Neon PostgreSQL connections

### TailwindCSS 4 CSS-First

CalMill uses **TailwindCSS 4.1+** with CSS-first configuration:

- **NO JavaScript config** (`tailwind.config.js`)
- **All customization in CSS** via `@theme` block
- **PostCSS plugin:** `@tailwindcss/postcss`

### NextAuth v5

CalMill uses **NextAuth v5 (beta.30)** with modern patterns:

- **Export handlers directly:** `export { GET, POST } from "@/lib/auth"`
- **Server Components:** Use `auth()` function
- **Client Components:** Use `useSession()` hook
- **Session strategy:** JWT (not database sessions)

---

## Contributing

CalMill is built entirely by AI workers orchestrated by WorkerMill. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test && npm run test:e2e`
5. Submit a pull request

All PRs must pass CI checks (lint, typecheck, tests, build).

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Credits

**Built by:** [WorkerMill](https://workermill.com) — Autonomous AI worker orchestration platform

**Inspired by:** [Cal.com](https://cal.com) — Open source scheduling infrastructure

---

## Support

- **Documentation:** [CLAUDE.md](CLAUDE.md) (worker development guide)
- **Issues:** [GitHub Issues](https://github.com/workermill-examples/calmill/issues)
- **Website:** [workermill.com](https://workermill.com)

---

**Last Updated:** 2026-02-17
**Version:** 1.0.0
