# CalMill Go-Live Checklist

## Overview

This checklist ensures CalMill is production-ready for deployment at https://calmill.workermill.com. Every item must be verified before going live.

## Pre-Deployment Checklist

### 🔧 Infrastructure & Configuration

- [ ] **DNS Configuration**
  - [ ] `calmill.workermill.com` CNAME points to `cname.vercel-dns.com`
  - [ ] DNS propagation complete (check with `nslookup calmill.workermill.com`)
  - [ ] SSL certificate provisioned and valid

- [ ] **Vercel Project Setup**
  - [ ] Project ID: `prj_X16gHljg2G3W6CDAKKWQZuDEVvhu`
  - [ ] Team ID: `team_2ASKtHtTGR8ex1m1CxSgB6kw`
  - [ ] Auto-deploy disabled (manual deployment only)
  - [ ] Environment variables configured in Vercel dashboard

- [ ] **Database Configuration**
  - [ ] Neon PostgreSQL database provisioned
  - [ ] `DATABASE_URL` configured (pooled connection)
  - [ ] `DIRECT_DATABASE_URL` configured (direct connection)
  - [ ] Database accessible from Vercel

### 🔐 Environment Variables

Verify all required environment variables are set in Vercel:

**Required:**
- [ ] `DATABASE_URL` - Neon PostgreSQL pooled connection
- [ ] `DIRECT_DATABASE_URL` - Neon PostgreSQL direct connection
- [ ] `AUTH_SECRET` - NextAuth JWT secret (32+ characters)
- [ ] `NEXTAUTH_URL` - `https://calmill.workermill.com`
- [ ] `NEXT_PUBLIC_APP_URL` - `https://calmill.workermill.com`
- [ ] `SEED_TOKEN` - Secure token for seeding API endpoint

**Optional (but recommended):**
- [ ] `GOOGLE_CLIENT_ID` - For Google Calendar integration
- [ ] `GOOGLE_CLIENT_SECRET` - For Google Calendar integration
- [ ] `RESEND_API_KEY` - For email notifications
- [ ] `EMAIL_FROM` - Default email sender address

### 🔒 Security Configuration

- [ ] **CORS Configuration**
  - [ ] Embed routes allow cross-origin framing
  - [ ] `X-Frame-Options: ALLOWALL` on `/embed/(.*)`
  - [ ] `Content-Security-Policy: frame-ancestors *` on `/embed/(.*)`
  - [ ] `Access-Control-Allow-Origin: *` on embed script

- [ ] **Authentication**
  - [ ] NextAuth v5 properly configured
  - [ ] JWT strategy enabled
  - [ ] Session callbacks populate required fields
  - [ ] Password hashing uses bcryptjs

## Build & Deployment

### 📦 Build Process

- [ ] **Local Build Verification**
  ```bash
  npm ci
  npm run lint
  npm run typecheck
  npm run build
  npm run test
  ```

- [ ] **Build Artifacts**
  - [ ] `.next` folder generated successfully
  - [ ] No TypeScript errors
  - [ ] No ESLint errors
  - [ ] All tests passing
  - [ ] Prisma client generated

### 🚀 Deployment Process

- [ ] **Deploy via GitHub Actions**
  - [ ] Push to `main` branch triggers deploy workflow
  - [ ] Vercel CLI build successful
  - [ ] Vercel deployment successful
  - [ ] Database schema pushed (`prisma db push`)
  - [ ] Seed data populated successfully

- [ ] **Manual Deploy Verification**
  ```bash
  # Alternative manual deployment
  vercel pull --yes --environment=production
  vercel build --prod
  vercel deploy --prebuilt --prod
  npx prisma db push
  ```

## Post-Deployment Verification

### 🌐 Core Functionality

- [ ] **Landing Page** (`https://calmill.workermill.com`)
  - [ ] Page loads within 3 seconds
  - [ ] Hero section with gradient displays properly
  - [ ] "Get Started" CTA links to signup
  - [ ] "Try the Demo" CTA works (auto-login)
  - [ ] "Built by WorkerMill" section visible and prominent
  - [ ] Responsive design on mobile/tablet

- [ ] **Authentication System**
  - [ ] Signup flow creates new users
  - [ ] Login with demo credentials: `demo@workermill.com` / `demo1234`
  - [ ] Password reset flow (if implemented)
  - [ ] Session persistence across page refreshes
  - [ ] Logout functionality works

- [ ] **Demo User Dashboard**
  - [ ] Dashboard loads with pre-seeded data
  - [ ] 4 stat cards display correct numbers
  - [ ] Charts render (bookings/day, by event type, by status)
  - [ ] Next 5 bookings list populated
  - [ ] No empty states visible

### 📅 Booking System

- [ ] **Public Booking Flow**
  - [ ] Visit `/demo/quick-chat` loads booking page
  - [ ] Calendar shows available dates
  - [ ] Time slots display for selected date
  - [ ] Timezone detection and selection works
  - [ ] Booking form accepts all inputs
  - [ ] Form submission creates booking
  - [ ] Confirmation page shows booking details
  - [ ] "Add to Calendar" buttons work (Google, .ics)

- [ ] **Booking Management**
  - [ ] Booking list shows seeded bookings
  - [ ] Filter by status (upcoming/past/cancelled)
  - [ ] Accept/reject actions work for pending bookings
  - [ ] Reschedule flow updates booking time
  - [ ] Cancel flow with reason works

### 👥 Team Features

- [ ] **Team Management**
  - [ ] Team list shows "CalMill Demo Team"
  - [ ] Team members display (Demo, Alice Johnson, Bob Smith)
  - [ ] Team public page loads at `/team/calmill-demo-team`
  - [ ] Team event types show round-robin and collective scheduling

### 🎯 Event Types

- [ ] **Event Type Management**
  - [ ] List shows 6 seeded event types
  - [ ] Create new event type works
  - [ ] Edit event type (all 5 tabs functional)
  - [ ] Toggle active/inactive status
  - [ ] Delete event type works
  - [ ] Public booking pages load for each type

### ⚙️ Settings & Integrations

- [ ] **User Settings**
  - [ ] Profile update (name, email, bio)
  - [ ] Timezone change affects booking display
  - [ ] Password change works
  - [ ] Avatar upload (if implemented)

- [ ] **Calendar Integration**
  - [ ] Google Calendar connect page loads
  - [ ] OAuth redirect works (even if unconfigured)
  - [ ] Disconnect flow works

- [ ] **Webhooks**
  - [ ] Webhook creation works
  - [ ] Test delivery endpoint
  - [ ] Delivery log shows attempts
  - [ ] Delete webhook works

### 🎨 Embed System

- [ ] **Embed Functionality**
  - [ ] Embed code generator at `/embed`
  - [ ] Generated code includes proper script tag
  - [ ] Embed script loads from `/embed/calmill-embed.js`
  - [ ] Cross-origin iframe embedding works
  - [ ] Embed pages load without chrome/navigation

### 📧 Email System

- [ ] **Email Templates**
  - [ ] Templates render without errors (verified by tests)
  - [ ] Works without `RESEND_API_KEY` (graceful degradation)
  - [ ] Booking confirmation emails format correctly
  - [ ] Notification emails include all required details
  - [ ] Cancellation emails handled properly

## Performance & Quality

### ⚡ Performance Metrics

- [ ] **Core Web Vitals**
  - [ ] First Contentful Paint < 1.8s
  - [ ] Largest Contentful Paint < 2.5s
  - [ ] Cumulative Layout Shift < 0.1
  - [ ] First Input Delay < 100ms

- [ ] **Loading Performance**
  - [ ] Landing page loads in < 3s
  - [ ] Dashboard loads in < 5s with data
  - [ ] Booking page loads in < 3s
  - [ ] No console errors on any page

### 🔍 SEO & Accessibility

- [ ] **SEO Basics**
  - [ ] Meta title and description on all pages
  - [ ] Proper heading hierarchy (h1, h2, h3)
  - [ ] Open Graph tags for social sharing
  - [ ] Sitemap generated (if applicable)

- [ ] **Accessibility**
  - [ ] All interactive elements keyboard accessible
  - [ ] Form labels properly associated
  - [ ] Color contrast meets WCAG standards
  - [ ] Alt text on images

### 🧪 Testing Coverage

- [ ] **Automated Tests**
  - [ ] Unit tests pass (target: 202 tests)
  - [ ] E2E tests pass (target: 297 tests)
  - [ ] Email template tests pass
  - [ ] API endpoint tests pass
  - [ ] Test coverage > 80%

## Smoke Test Script

Run the automated smoke test after deployment:

```bash
# From project root
chmod +x scripts/smoke-test.sh
./scripts/smoke-test.sh https://calmill.workermill.com
```

### Manual Smoke Test

1. **Health Check**: `curl https://calmill.workermill.com/api/health`
2. **Landing Page**: Visit homepage, verify layout
3. **Demo Login**: Click "Try the Demo", verify auto-login
4. **Dashboard**: Check charts and stats render
5. **Create Booking**: Book a demo meeting, verify confirmation
6. **Embed Test**: Test iframe embedding on external site

## Data Verification

### 📊 Seed Data Completeness

- [ ] **Demo User Account**
  - [ ] Username: `demo`
  - [ ] Email: `demo@workermill.com`
  - [ ] Password: `demo1234` (hashed with bcryptjs)
  - [ ] Profile complete with timezone

- [ ] **Event Types (6 total)**
  - [ ] Quick Chat (15 min)
  - [ ] 30 Minute Meeting
  - [ ] 60 Minute Consultation
  - [ ] Technical Interview (45 min, 24h notice)
  - [ ] Pair Programming (90 min, 2h buffer)
  - [ ] Coffee Chat (20 min, inactive)

- [ ] **Bookings (15 total)**
  - [ ] 8 ACCEPTED bookings
  - [ ] 3 PENDING bookings
  - [ ] 2 CANCELLED bookings
  - [ ] 2 past bookings
  - [ ] Realistic attendee data

- [ ] **Team Data**
  - [ ] "CalMill Demo Team" with 3 members
  - [ ] 2 team event types with different scheduling modes

## Monitoring & Alerts

### 📈 Post-Launch Monitoring

- [ ] **Vercel Analytics**
  - [ ] Page views tracked
  - [ ] Core Web Vitals monitored
  - [ ] Error rate < 1%

- [ ] **Database Monitoring**
  - [ ] Neon dashboard shows healthy connections
  - [ ] Query performance acceptable
  - [ ] No connection pool exhaustion

- [ ] **Email Delivery**
  - [ ] Resend dashboard (if configured)
  - [ ] Test email flows work end-to-end
  - [ ] Graceful degradation without API key

## Rollback Plan

If critical issues are discovered post-deployment:

1. **Immediate Rollback**
   ```bash
   vercel rollback --token=$VERCEL_TOKEN
   ```

2. **Database Rollback** (if needed)
   - Restore from Neon backup
   - Re-run seed script if data corruption

3. **DNS Rollback** (extreme cases)
   - Point DNS to maintenance page
   - Investigate and fix issues offline

## Final Sign-Off

### ✅ Pre-Launch Approval

- [ ] **Technical Review**: All technical requirements met
- [ ] **UI/UX Review**: Design meets showcase quality standards
- [ ] **Performance Review**: All performance metrics acceptable
- [ ] **Security Review**: Security checklist completed
- [ ] **Content Review**: Demo data is realistic and complete

### 📋 Launch Readiness

- [ ] All checklist items completed
- [ ] Smoke tests passing
- [ ] Monitoring configured
- [ ] Team notified of go-live
- [ ] Rollback plan confirmed

**Deployment Date**: _______________

**Deployed By**: _______________

**Sign-off By**: _______________

---

## Post-Launch Tasks

### 📊 First 24 Hours

- [ ] Monitor error rates and performance
- [ ] Verify all demo flows work correctly
- [ ] Check email delivery (if configured)
- [ ] Review analytics for traffic patterns
- [ ] Test from multiple devices and browsers

### 🔄 Ongoing Maintenance

- [ ] Weekly smoke test runs
- [ ] Monthly dependency updates
- [ ] Quarterly security review
- [ ] Database backup verification
- [ ] Performance metrics review

---

*This checklist ensures CalMill launches successfully as a showcase of WorkerMill's AI development capabilities. Every item represents a critical aspect of the production-ready application.*