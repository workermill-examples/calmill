import { beforeEach, vi } from "vitest";

// Mock Prisma Client
const mockPrismaClient = {
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    upsert: vi.fn(),
    findFirst: vi.fn(),
  },
  account: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    upsert: vi.fn(),
  },
  session: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    upsert: vi.fn(),
  },
  eventType: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    upsert: vi.fn(),
  },
  booking: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    upsert: vi.fn(),
  },
  schedule: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    upsert: vi.fn(),
  },
  availability: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    upsert: vi.fn(),
  },
  dateOverride: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    upsert: vi.fn(),
  },
  team: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    upsert: vi.fn(),
  },
  teamMember: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    upsert: vi.fn(),
  },
  calendarConnection: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    upsert: vi.fn(),
  },
  webhook: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    upsert: vi.fn(),
  },
  $disconnect: vi.fn(),
  $connect: vi.fn(),
};

// Mock NextAuth session
const mockSession = {
  user: {
    id: "test-user-id",
    email: "demo@workermill.com",
    name: "Alex Demo",
    username: "demo",
    timezone: "America/New_York",
    image: null,
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

// Mock NextAuth functions
const mockNextAuth = {
  auth: vi.fn().mockResolvedValue(mockSession),
  signIn: vi.fn(),
  signOut: vi.fn(),
  handlers: {
    GET: vi.fn(),
    POST: vi.fn(),
  },
};

// Setup mocks
vi.mock("@/lib/prisma", () => ({
  prisma: mockPrismaClient,
}));

vi.mock("@/lib/auth", () => mockNextAuth);

vi.mock("next-auth", () => ({
  default: vi.fn(() => mockNextAuth),
}));

vi.mock("@auth/prisma-adapter", () => ({
  PrismaAdapter: vi.fn(),
}));

// Reset all mocks before each test
beforeEach(() => {
  vi.resetAllMocks();

  // Reset default mock implementations
  mockNextAuth.auth.mockResolvedValue(mockSession);

  // Default Prisma mock implementations
  Object.values(mockPrismaClient).forEach((model) => {
    if (typeof model === "object" && model !== null) {
      Object.values(model).forEach((method) => {
        if (typeof method === "function") {
          method.mockClear();
        }
      });
    }
  });
});

// Export mocks for use in tests
export { mockPrismaClient, mockSession, mockNextAuth };