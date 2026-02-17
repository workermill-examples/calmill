import { vi, beforeEach, afterEach } from "vitest";

/**
 * Global test setup for Vitest.
 * Mocks Prisma and NextAuth to prevent real database/auth calls during tests.
 */

// ─── PRISMA MOCK ────────────────────────────────────────────────────────────

const mockPrismaClient = {
  // User model
  user: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    upsert: vi.fn(),
    count: vi.fn(),
  },
  // EventType model
  eventType: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    upsert: vi.fn(),
    count: vi.fn(),
  },
  // Booking model
  booking: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    upsert: vi.fn(),
    count: vi.fn(),
  },
  // Schedule model
  schedule: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    delete: vi.fn(),
    upsert: vi.fn(),
    count: vi.fn(),
  },
  // Availability model
  availability: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    upsert: vi.fn(),
    count: vi.fn(),
  },
  // DateOverride model
  dateOverride: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    upsert: vi.fn(),
    count: vi.fn(),
  },
  // Team model
  team: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    upsert: vi.fn(),
    count: vi.fn(),
  },
  // TeamMember model
  teamMember: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    upsert: vi.fn(),
    count: vi.fn(),
  },
  // CalendarConnection model
  calendarConnection: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    upsert: vi.fn(),
    count: vi.fn(),
  },
  // Webhook model
  webhook: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    upsert: vi.fn(),
    count: vi.fn(),
  },
  // Account model (NextAuth)
  account: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    upsert: vi.fn(),
    count: vi.fn(),
  },
  // Session model (NextAuth)
  session: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    upsert: vi.fn(),
    count: vi.fn(),
  },
  // Transaction support
  $transaction: vi.fn((callback) => callback(mockPrismaClient)),
  $connect: vi.fn(),
  $disconnect: vi.fn(),
};

vi.mock("@/generated/prisma/client", () => ({
  PrismaClient: vi.fn(() => mockPrismaClient),
  Prisma: {
    DbNull: "DbNull",
    JsonNull: "JsonNull",
  },
}));

// ─── NEXT/SERVER MOCK ───────────────────────────────────────────────────────

/**
 * Mock NextResponse so tests can inspect responses using standard Web API:
 *   const data = await response.json()
 *   const status = response.status
 */
vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((data: unknown, init?: { status?: number }) => {
      const status = init?.status ?? 200;
      return {
        status,
        json: async () => data,
        headers: new Headers(),
      };
    }),
    redirect: vi.fn((url: string, status = 302) => ({
      status,
      headers: new Headers({ location: url }),
      json: async () => null,
    })),
    next: vi.fn(() => ({
      status: 200,
      headers: new Headers(),
      json: async () => null,
    })),
  },
  NextRequest: vi.fn(),
}));

// ─── NEXTAUTH MOCK ──────────────────────────────────────────────────────────

const mockSession = {
  user: {
    id: "demo-user-id",
    email: "demo@workermill.com",
    name: "Alex Demo",
    username: "demo",
    timezone: "America/New_York",
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

vi.mock("next-auth", () => ({
  default: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(() => Promise.resolve(mockSession)),
  signIn: vi.fn(),
  signOut: vi.fn(),
  handlers: {},
}));

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrismaClient,
}));

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({
    data: mockSession,
    status: "authenticated",
  })),
  signIn: vi.fn(),
  signOut: vi.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// ─── RESET MOCKS BETWEEN TESTS ──────────────────────────────────────────────

beforeEach(() => {
  // Reset all mocks to clear call history and return values
  vi.clearAllMocks();
});

afterEach(() => {
  // Additional cleanup if needed
  vi.restoreAllMocks();
});

// Export mock instances for use in specific tests
export { mockPrismaClient, mockSession };
