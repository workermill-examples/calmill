# CalMill 📅

> **Open Scheduling for Everyone**

CalMill is a modern scheduling application built with Next.js 16, React 19, and Prisma 7. Create booking pages, manage availability, and let people schedule time with you — no back-and-forth emails.

**🚀 Live Demo:** [calmill.workermill.com](https://calmill.workermill.com)

Built autonomously by [WorkerMill](https://workermill.com) AI workers as a showcase of autonomous software development.

## ✨ Features

### 🎯 Core Scheduling
- **Event Types**: Create different meeting types with custom durations, locations, and questions
- **Smart Availability**: Timezone-aware scheduling with conflict detection
- **Flexible Booking**: Support for one-time and recurring meetings
- **Buffer Times**: Prevent back-to-back meetings with configurable buffers

### 👥 Team Collaboration
- **Team Scheduling**: Round-robin and collective scheduling for teams
- **Role Management**: Owner, admin, and member permissions
- **Shared Event Types**: Team-wide booking pages

### 🔗 Integrations
- **Calendar Sync**: Connect Google Calendar and Outlook
- **Webhooks**: Real-time notifications for booking events
- **Custom Questions**: Collect attendee information with forms

### 🛡️ Security & Auth
- **Multiple Auth Methods**: Email/password and Google OAuth
- **Session Management**: Secure JWT-based sessions
- **Data Protection**: Encrypted passwords and secure API endpoints

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Frontend**: React 19, TypeScript 5.7, TailwindCSS 4
- **Database**: PostgreSQL via Neon with Prisma 7
- **Authentication**: NextAuth v5
- **Deployment**: Vercel with GitHub Actions CI/CD
- **Testing**: Vitest (unit) + Playwright (E2E)

### Database Schema
```
12 Models | 3 Enums | Comprehensive Relations

Auth        Core            Teams           Integrations
├─Account   ├─User          ├─Team          ├─CalendarConnection
└─Session   ├─EventType     └─TeamMember    └─Webhook
            ├─Booking
            ├─Schedule
            ├─Availability
            └─DateOverride
```

## 🚀 Quick Start

### Prerequisites
- Node.js ≥20.0.0
- PostgreSQL database (Neon recommended)
- npm or yarn

### 1. Clone & Install
```bash
git clone <repository-url>
cd calmill
npm install
```

### 2. Environment Setup
Copy the environment template and fill in your values:
```bash
cp .env.example .env
```

Required environment variables:
```env
# Database
DATABASE_URL="postgresql://user:pass@host:port/db"
DIRECT_DATABASE_URL="postgresql://user:pass@host:port/db" # Non-pooled for migrations

# Authentication
AUTH_SECRET="your-32-char-secret-key"                     # Generate: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SEED_TOKEN="your-seed-api-token"

# Optional: Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Apply database schema
npx prisma db push

# Seed with demo data
npm run seed
```

### 4. Start Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🧪 Testing

### Demo Account
After seeding, you can log in with:
- **Email**: `demo@workermill.com`
- **Password**: `demo1234`

### Run Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type checking
npm run typecheck

# Lint code
npm run lint
```

## 📁 Project Structure

```
calmill/
├── prisma/
│   ├── schema.prisma          # Database schema (12 models, 3 enums)
│   └── seed.ts                # Demo data seeding
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (dashboard)/       # Protected routes
│   │   ├── (public)/          # Public booking pages
│   │   └── api/               # API endpoints
│   ├── components/            # React components
│   │   └── ui/                # Reusable UI primitives
│   ├── lib/                   # Core utilities
│   │   ├── auth.ts            # NextAuth v5 config
│   │   ├── prisma.ts          # Database client
│   │   ├── utils.ts           # Helper functions
│   │   └── validations.ts     # Zod schemas
│   └── types/                 # TypeScript definitions
├── tests/                     # Test files
├── .github/workflows/         # CI/CD pipelines
└── CLAUDE.md                  # Developer guide
```

## 🛠️ Development

### Key Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Lint code
npm run typecheck    # Check TypeScript
npm test             # Run unit tests
npm run test:e2e     # Run E2E tests
```

### Database Operations
```bash
npx prisma generate     # Regenerate client after schema changes
npx prisma db push      # Apply schema to database
npx prisma studio       # Open database GUI
npx tsx prisma/seed.ts  # Seed database manually
```

### Architecture Patterns

#### Prisma 7 (Breaking Changes)
```typescript
// ✅ Correct - Prisma 7 pattern
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
```

#### NextAuth v5 Server Components
```typescript
// ✅ Correct - NextAuth v5 pattern
import { auth } from "@/lib/auth";

export default async function ProtectedPage() {
  const session = await auth();
  if (!session) redirect("/login");
  // ...
}
```

#### TailwindCSS 4 (CSS-First)
```css
/* ✅ Correct - No tailwind.config.js */
@import "tailwindcss";

@theme {
  --color-primary-500: #3b82f6;
  --font-sans: "Inter", ui-sans-serif, system-ui;
}
```

## 🚀 Deployment

### Automatic Deployment
Push to `main` branch triggers:
1. **CI Pipeline**: Lint, typecheck, test, build
2. **Deploy Pipeline**: Database migration, Vercel deployment, health checks

### Manual Deployment
```bash
# Build and deploy to Vercel
vercel --prod

# Run database migrations
npx prisma db push
```

### Environment Variables (Production)
Set these in your Vercel dashboard:
- `DATABASE_URL` - Neon pooled connection
- `DIRECT_DATABASE_URL` - Neon direct connection
- `AUTH_SECRET` - 32+ character secret
- `NEXTAUTH_URL` - Your domain URL
- `NEXT_PUBLIC_APP_URL` - Your domain URL
- `SEED_TOKEN` - API protection token

## 🤝 Contributing

CalMill is built by autonomous AI workers, but we welcome contributions:

1. **Issues**: Report bugs or suggest features
2. **Pull Requests**: Follow the existing code patterns
3. **Documentation**: Help improve guides and examples

### Development Guidelines
- Follow TypeScript strict mode
- Use Prisma 7 patterns (see `CLAUDE.md`)
- Test new features with Vitest
- Follow TailwindCSS 4 CSS-first approach
- Ensure NextAuth v5 compatibility

## 📊 Project Status

- ✅ **Core Setup**: Next.js 16, Prisma 7, TailwindCSS 4
- ✅ **Authentication**: NextAuth v5 with multiple providers
- ✅ **Database**: 12-model schema with full relationships
- ✅ **UI Framework**: Component library with TailwindCSS
- ✅ **Testing**: Unit and E2E test infrastructure
- ✅ **CI/CD**: GitHub Actions with Vercel deployment
- 🚧 **Feature Development**: Event types, booking flow, team management
- 📋 **Future**: Calendar integrations, webhooks, advanced scheduling

## 🔗 Links

- **Live App**: [calmill.workermill.com](https://calmill.workermill.com)
- **WorkerMill**: [workermill.com](https://workermill.com)
- **Repository**: [github.com/workermill-examples/calmill](https://github.com/workermill-examples/calmill)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by autonomous AI workers**
*Showcasing the future of software development*