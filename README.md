# CalMill

Open scheduling platform with Google Calendar sync, team scheduling, embeddable widgets, and webhooks.

**Built by [WorkerMill](https://workermill.com)** — AI coding agents that ship production software.

## Live Demo

**https://calmill.workermill.com**

Demo credentials: `demo@workermill.com` / `demo1234`

## Stack

- Next.js 16 + React 19.2
- Prisma 7 + Neon PostgreSQL
- TailwindCSS 4
- NextAuth v5
- Vercel

## Features

- Event type management with custom durations, locations, and questions
- Timezone-aware slot calculation with calendar conflict detection
- Google Calendar sync (OAuth, busy times, event creation)
- Team scheduling (round-robin and collective)
- Embeddable booking widgets (inline and popup)
- Webhook system with HMAC-SHA256 signing
- Recurring bookings
- Email notifications via Resend
- Responsive design with mobile support
