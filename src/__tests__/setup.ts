import '@testing-library/jest-dom/vitest';

// Mock Prisma client
import { vi } from 'vitest';

vi.mock('@/generated/prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    eventType: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    booking: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    schedule: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    availability: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    dateOverride: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    $transaction: vi.fn(),
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  })),
}));

// Mock lib/prisma
vi.mock('@/lib/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    eventType: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    booking: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    schedule: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    availability: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    dateOverride: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    $transaction: vi.fn(),
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  },
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  })),
  useSearchParams: vi.fn(() => ({
    get: vi.fn(),
    getAll: vi.fn(),
    has: vi.fn(),
    toString: vi.fn(),
  })),
  usePathname: vi.fn(() => '/test-path'),
  useParams: vi.fn(() => ({})),
}));

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
  signIn: vi.fn(),
  signOut: vi.fn(),
  SessionProvider: vi.fn(({ children }) => children),
}));

// Mock Intl.DateTimeFormat for timezone detection
Object.defineProperty(global.Intl, 'DateTimeFormat', {
  writable: true,
  value: vi.fn().mockImplementation((locale, options) => ({
    resolvedOptions: () => ({ timeZone: 'America/New_York' }),
    format: vi.fn(() => '12/25/2023'),
    formatToParts: vi.fn(() => [
      { type: 'month', value: '12' },
      { type: 'literal', value: '/' },
      { type: 'day', value: '25' },
      { type: 'literal', value: '/' },
      { type: 'year', value: '2023' },
      { type: 'timeZoneName', value: 'EST' }
    ]),
  })),
});

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock lib/utils
vi.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

// Mock date-fns
vi.mock('date-fns', () => ({
  format: vi.fn((date: Date, formatStr: string) => {
    if (formatStr === 'd') return date.getDate().toString();
    if (formatStr === 'h:mm a') return '9:00 AM';
    if (formatStr === 'EEEE, MMMM do, yyyy') return 'Monday, January 15th, 2024';
    if (formatStr === 'EEEE, MMM d') return 'Monday, Jan 15';
    return date.toISOString();
  }),
  addDays: vi.fn((date: Date, days: number) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000)),
  subDays: vi.fn((date: Date, days: number) => new Date(date.getTime() - days * 24 * 60 * 60 * 1000)),
  startOfMonth: vi.fn((date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)),
  endOfMonth: vi.fn((date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0)),
  startOfDay: vi.fn((date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())),
  endOfDay: vi.fn((date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)),
  isSameDay: vi.fn((date1: Date, date2: Date) =>
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  ),
  parseISO: vi.fn((dateStr: string) => {
    try {
      return new Date(dateStr);
    } catch {
      throw new Error('Invalid date');
    }
  }),
  isAfter: vi.fn((date1: Date, date2: Date) => date1.getTime() > date2.getTime()),
  isBefore: vi.fn((date1: Date, date2: Date) => date1.getTime() < date2.getTime()),
  isToday: vi.fn((date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }),
  isTomorrow: vi.fn(() => false),
  isYesterday: vi.fn(() => false),
}));

// Mock @date-fns/tz
vi.mock('@date-fns/tz', () => ({
  TZDate: vi.fn().mockImplementation((date: Date, timezone: string) => {
    const tzDate = new Date(date);
    // Simple mock that just returns the date
    return tzDate;
  }),
  toZonedTime: vi.fn((date: Date, timezone: string) => date),
  fromZonedTime: vi.fn((date: Date, timezone: string) => date),
}));