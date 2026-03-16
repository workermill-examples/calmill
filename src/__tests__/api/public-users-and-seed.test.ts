// Public User Routes and Seed Endpoint Tests
// Tests for /api/users/[username], /api/users/[username]/event-types, and /api/seed

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

// Mock Prisma completely
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      create: vi.fn(),
    },
    eventType: {
      findMany: vi.fn(),
      upsert: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
    },
    schedule: {
      upsert: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    availability: {
      upsert: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
    },
    booking: {
      upsert: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
    dateOverride: {
      upsert: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    team: {
      upsert: vi.fn(),
      create: vi.fn(),
    },
    teamMember: {
      upsert: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock bcryptjs
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
  },
}));

import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { GET as getPublicUserProfile } from "@/app/api/users/[username]/route";
import { GET as getPublicUserEventTypes } from "@/app/api/users/[username]/event-types/route";
import { POST as seedDatabase } from "@/app/api/seed/route";

describe("Public User Routes and Seed Endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockUser = {
    id: "user-123",
    username: "testuser",
    name: "Test User",
    image: "https://example.com/avatar.jpg",
    bio: "Test user bio",
    timezone: "America/New_York",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    _count: {
      eventTypes: 3,
    },
  };

  const mockEventType = {
    id: "event-123",
    title: "30 Minute Meeting",
    slug: "30min",
    description: "A 30-minute meeting",
    duration: 30,
    requiresConfirmation: false,
    price: null,
    currency: "USD",
    minimumNotice: 120,
    beforeBuffer: 0,
    afterBuffer: 0,
    slotInterval: 30,
    maxBookingsPerDay: null,
    maxBookingsPerWeek: null,
    futureLimit: null,
    color: "#3B82F6",
    customQuestions: "[]",
    recurringEnabled: false,
    recurringFrequency: null,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    schedule: {
      id: "schedule-123",
      name: "Business Hours",
      timezone: "America/New_York",
    },
    _count: {
      bookings: 5,
    },
  };

  describe("GET /api/users/[username] - Public User Profile", () => {
    it("should return public user profile for existing user", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

      const request = new NextRequest(
        "http://localhost:3000/api/users/testuser",
      );
      const params = Promise.resolve({ username: "testuser" });
      const response = await getPublicUserProfile(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toEqual({
        id: "user-123",
        username: "testuser",
        name: "Test User",
        image: "https://example.com/avatar.jpg",
        bio: "Test user bio",
        timezone: "America/New_York",
        createdAt: "2024-01-01T00:00:00.000Z",
        stats: {
          eventTypes: 3,
        },
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: "testuser" },
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
          bio: true,
          timezone: true,
          createdAt: true,
          _count: {
            select: {
              eventTypes: {
                where: { isActive: true },
              },
            },
          },
        },
      });
    });

    it("should return 404 for non-existent user", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const request = new NextRequest(
        "http://localhost:3000/api/users/nonexistent",
      );
      const params = Promise.resolve({ username: "nonexistent" });
      const response = await getPublicUserProfile(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({
        error: "not_found",
        message: "User not found",
      });
    });

    it("should handle database errors gracefully", async () => {
      vi.mocked(prisma.user.findUnique).mockRejectedValue(
        new Error("Database error"),
      );

      const request = new NextRequest(
        "http://localhost:3000/api/users/testuser",
      );
      const params = Promise.resolve({ username: "testuser" });
      const response = await getPublicUserProfile(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        error: "internal",
        message: "Failed to fetch user profile",
      });
    });

    it("should handle special characters in username", async () => {
      const specialUsername = "user-with-hyphens_and_underscores123";
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        ...mockUser,
        username: specialUsername,
      } as any);

      const request = new NextRequest(
        `http://localhost:3000/api/users/${specialUsername}`,
      );
      const params = Promise.resolve({ username: specialUsername });
      const response = await getPublicUserProfile(request, { params });

      expect(response.status).toBe(200);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: specialUsername },
        select: expect.any(Object),
      });
    });

    it("should not expose sensitive user data", async () => {
      const userWithSensitiveData = {
        ...mockUser,
        email: "user@example.com",
        passwordHash: "hashed_password",
        theme: "dark",
        weekStart: 1,
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(
        userWithSensitiveData as any,
      );

      const request = new NextRequest(
        "http://localhost:3000/api/users/testuser",
      );
      const params = Promise.resolve({ username: "testuser" });
      const response = await getPublicUserProfile(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).not.toHaveProperty("email");
      expect(data.user).not.toHaveProperty("passwordHash");
      expect(data.user).not.toHaveProperty("theme");
      expect(data.user).not.toHaveProperty("weekStart");
    });
  });

  describe("GET /api/users/[username]/event-types - Public User Event Types", () => {
    it("should return event types for existing user", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-123",
      } as any);
      vi.mocked(prisma.eventType.findMany).mockResolvedValue([
        mockEventType,
      ] as any);

      const request = new NextRequest(
        "http://localhost:3000/api/users/testuser/event-types",
      );
      const params = Promise.resolve({ username: "testuser" });
      const response = await getPublicUserEventTypes(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.eventTypes).toHaveLength(1);
      expect(data.eventTypes[0]).toMatchObject({
        id: "event-123",
        title: "30 Minute Meeting",
        slug: "30min",
        description: "A 30-minute meeting",
        duration: 30,
        price: null,
        currency: "USD",
        color: "#3B82F6",
        requiresConfirmation: false,
        minimumNotice: 120,
        customQuestions: [],
        bookingCount: 5,
        schedule: {
          id: "schedule-123",
          name: "Business Hours",
          timezone: "America/New_York",
        },
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: "testuser" },
        select: { id: true },
      });

      expect(prisma.eventType.findMany).toHaveBeenCalledWith({
        where: {
          userId: "user-123",
          isActive: true,
        },
        select: expect.objectContaining({
          id: true,
          title: true,
          slug: true,
          description: true,
          duration: true,
          customQuestions: true,
          _count: {
            select: {
              bookings: {
                where: {
                  status: {
                    in: ["ACCEPTED", "PENDING"],
                  },
                },
              },
            },
          },
        }),
        orderBy: [{ createdAt: "desc" }],
      });
    });

    it("should return 404 for non-existent user", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const request = new NextRequest(
        "http://localhost:3000/api/users/nonexistent/event-types",
      );
      const params = Promise.resolve({ username: "nonexistent" });
      const response = await getPublicUserEventTypes(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({
        error: "not_found",
        message: "User not found",
      });
    });

    it("should return empty array when user has no active event types", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-123",
      } as any);
      vi.mocked(prisma.eventType.findMany).mockResolvedValue([]);

      const request = new NextRequest(
        "http://localhost:3000/api/users/testuser/event-types",
      );
      const params = Promise.resolve({ username: "testuser" });
      const response = await getPublicUserEventTypes(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.eventTypes).toHaveLength(0);
    });

    it("should parse custom questions from JSON string", async () => {
      const eventTypeWithCustomQuestions = {
        ...mockEventType,
        customQuestions: JSON.stringify([
          {
            id: "name",
            type: "text",
            label: "Your name",
            required: true,
          },
        ]),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-123",
      } as any);
      vi.mocked(prisma.eventType.findMany).mockResolvedValue([
        eventTypeWithCustomQuestions,
      ] as any);

      const request = new NextRequest(
        "http://localhost:3000/api/users/testuser/event-types",
      );
      const params = Promise.resolve({ username: "testuser" });
      const response = await getPublicUserEventTypes(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.eventTypes[0].customQuestions).toEqual([
        {
          id: "name",
          type: "text",
          label: "Your name",
          required: true,
        },
      ]);
    });

    it("should handle null custom questions", async () => {
      const eventTypeWithNullCustomQuestions = {
        ...mockEventType,
        customQuestions: null,
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-123",
      } as any);
      vi.mocked(prisma.eventType.findMany).mockResolvedValue([
        eventTypeWithNullCustomQuestions,
      ] as any);

      const request = new NextRequest(
        "http://localhost:3000/api/users/testuser/event-types",
      );
      const params = Promise.resolve({ username: "testuser" });
      const response = await getPublicUserEventTypes(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.eventTypes[0].customQuestions).toEqual([]);
    });

    it("should handle database errors gracefully", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-123",
      } as any);
      vi.mocked(prisma.eventType.findMany).mockRejectedValue(
        new Error("Database error"),
      );

      const request = new NextRequest(
        "http://localhost:3000/api/users/testuser/event-types",
      );
      const params = Promise.resolve({ username: "testuser" });
      const response = await getPublicUserEventTypes(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        error: "internal",
        message: "Failed to fetch event types",
      });
    });

    it("should only return active event types", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-123",
      } as any);

      const request = new NextRequest(
        "http://localhost:3000/api/users/testuser/event-types",
      );
      const params = Promise.resolve({ username: "testuser" });
      await getPublicUserEventTypes(request, { params });

      expect(prisma.eventType.findMany).toHaveBeenCalledWith({
        where: {
          userId: "user-123",
          isActive: true,
        },
        select: expect.any(Object),
        orderBy: expect.any(Array),
      });
    });

    it("should include all required fields in response", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-123",
      } as any);
      vi.mocked(prisma.eventType.findMany).mockResolvedValue([
        mockEventType,
      ] as any);

      const request = new NextRequest(
        "http://localhost:3000/api/users/testuser/event-types",
      );
      const params = Promise.resolve({ username: "testuser" });
      const response = await getPublicUserEventTypes(request, { params });
      const data = await response.json();

      const eventType = data.eventTypes[0];
      const expectedFields = [
        "id",
        "title",
        "slug",
        "description",
        "duration",
        "requiresConfirmation",
        "price",
        "currency",
        "minimumNotice",
        "beforeBuffer",
        "afterBuffer",
        "slotInterval",
        "maxBookingsPerDay",
        "maxBookingsPerWeek",
        "futureLimit",
        "color",
        "customQuestions",
        "recurringEnabled",
        "recurringFrequency",
        "createdAt",
        "schedule",
        "bookingCount",
      ];

      expectedFields.forEach((field) => {
        expect(eventType).toHaveProperty(field);
      });
    });
  });

  describe("POST /api/seed - Seed Database", () => {
    const validToken = "valid-seed-token";
    const mockHashedPassword = "$2b$12$hashedpassword";

    beforeEach(() => {
      process.env.SEED_TOKEN = validToken;
      vi.mocked(bcryptjs.hash).mockResolvedValue(mockHashedPassword as any);

      // Mock all Prisma upsert operations to return sample data
      vi.mocked(prisma.user.upsert).mockResolvedValue({
        id: "demo-user-123",
      } as any);
      vi.mocked(prisma.schedule.upsert).mockResolvedValue({
        id: "schedule-123",
      } as any);
      vi.mocked(prisma.eventType.upsert).mockResolvedValue({
        id: "event-type-123",
      } as any);
      vi.mocked(prisma.availability.upsert).mockResolvedValue({
        id: "availability-123",
      } as any);
      vi.mocked(prisma.booking.upsert).mockResolvedValue({
        id: "booking-123",
      } as any);
      vi.mocked(prisma.dateOverride.upsert).mockResolvedValue({
        id: "override-123",
      } as any);
      vi.mocked(prisma.team.upsert).mockResolvedValue({
        id: "team-123",
      } as any);
      vi.mocked(prisma.teamMember.upsert).mockResolvedValue({
        id: "member-123",
      } as any);

      // Mock all findFirst operations to return null (not found, so will create)
      vi.mocked(prisma.schedule.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.availability.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.dateOverride.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.eventType.findFirst).mockResolvedValue(null);

      // Mock all create operations
      vi.mocked(prisma.schedule.create).mockResolvedValue({
        id: "schedule-123",
      } as any);
      vi.mocked(prisma.availability.create).mockResolvedValue({
        id: "availability-123",
      } as any);
      vi.mocked(prisma.dateOverride.create).mockResolvedValue({
        id: "override-123",
      } as any);
      vi.mocked(prisma.eventType.create).mockResolvedValue({
        id: "event-type-123",
      } as any);
      vi.mocked(prisma.booking.create).mockResolvedValue({
        id: "booking-123",
      } as any);
      vi.mocked(prisma.team.create).mockResolvedValue({
        id: "team-123",
      } as any);
      vi.mocked(prisma.teamMember.create).mockResolvedValue({
        id: "member-123",
      } as any);

      vi.mocked(prisma.eventType.findMany).mockResolvedValue([
        { id: "event-1", slug: "quick-chat" },
        { id: "event-2", slug: "30-minute-meeting" },
        { id: "event-3", slug: "60-minute-consultation" },
        { id: "event-4", slug: "technical-interview" },
        { id: "event-5", slug: "pair-programming" },
      ] as any);
    });

    afterEach(() => {
      process.env.SEED_TOKEN = undefined;
    });

    it("should seed database successfully with valid token", async () => {
      const request = new NextRequest("http://localhost:3000/api/seed", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      });

      const response = await seedDatabase(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Demo data seeded successfully");
      expect(data.data).toHaveProperty("users");
      expect(data.data).toHaveProperty("schedules");
      expect(data.data).toHaveProperty("team");
      expect(data.data).toHaveProperty("counts");

      // Verify demo user creation
      expect(prisma.user.upsert).toHaveBeenCalledWith({
        where: { email: "demo@workermill.com" },
        update: { passwordHash: mockHashedPassword },
        create: expect.objectContaining({
          email: "demo@workermill.com",
          username: "demo",
          name: "Alex Demo",
          passwordHash: mockHashedPassword,
          timezone: "America/New_York",
          bio: expect.stringContaining("Demo user for CalMill showcase"),
        }),
      });

      // Verify password hashing
      expect(bcryptjs.hash).toHaveBeenCalledWith("demo1234", 12);
    });

    it("should reject requests without valid token", async () => {
      const request = new NextRequest("http://localhost:3000/api/seed", {
        method: "POST",
        headers: {
          Authorization: "Bearer invalid-token",
        },
      });

      const response = await seedDatabase(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data).toEqual({
        error: "forbidden",
        message: "Invalid or missing seed token",
      });
    });

    it("should reject requests without authorization header", async () => {
      const request = new NextRequest("http://localhost:3000/api/seed", {
        method: "POST",
      });

      const response = await seedDatabase(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data).toEqual({
        error: "forbidden",
        message: "Invalid or missing seed token",
      });
    });

    it("should handle missing SEED_TOKEN environment variable", async () => {
      process.env.SEED_TOKEN = undefined;

      const request = new NextRequest("http://localhost:3000/api/seed", {
        method: "POST",
        headers: {
          Authorization: "Bearer any-token",
        },
      });

      const response = await seedDatabase(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data).toEqual({
        error: "forbidden",
        message: "Invalid or missing seed token",
      });
    });

    it("should handle database errors gracefully", async () => {
      vi.mocked(prisma.user.upsert).mockRejectedValue(
        new Error("Database connection failed"),
      );

      const request = new NextRequest("http://localhost:3000/api/seed", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      });

      const response = await seedDatabase(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        error: "internal",
        message: "Failed to seed database",
        details: "Database connection failed",
      });
    });

    it("should be idempotent - safe to run multiple times", async () => {
      const request = new NextRequest("http://localhost:3000/api/seed", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      });

      // Run seed twice
      await seedDatabase(request);
      const secondResponse = await seedDatabase(request);
      const data = await secondResponse.json();

      expect(secondResponse.status).toBe(200);
      expect(data.success).toBe(true);

      // Verify upsert operations (should not create duplicates)
      expect(vi.mocked(prisma.user.upsert).mock.calls.length).toBeGreaterThan(
        0,
      );
      // Each upsert call should have the same where condition
      const firstCall = vi.mocked(prisma.user.upsert).mock.calls[0][0];
      expect(firstCall.where).toEqual({ email: "demo@workermill.com" });
    });

    it("should create all required demo data types", async () => {
      const request = new NextRequest("http://localhost:3000/api/seed", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      });

      await seedDatabase(request);

      // Verify all types of data are created
      expect(prisma.user.upsert).toHaveBeenCalled(); // Demo users
      expect(prisma.schedule.create).toHaveBeenCalled(); // Schedules (uses findFirst + create)
      expect(prisma.availability.create).toHaveBeenCalled(); // Availability (uses findFirst + create)
      expect(prisma.eventType.upsert).toHaveBeenCalled(); // Event types (some use upsert)
      expect(prisma.eventType.create).toHaveBeenCalled(); // Event types (team event types use findFirst + create)
      expect(prisma.booking.upsert).toHaveBeenCalled(); // Bookings
      expect(prisma.dateOverride.create).toHaveBeenCalled(); // Date overrides (uses findFirst + create)
      expect(prisma.team.upsert).toHaveBeenCalled(); // Team
      expect(prisma.teamMember.upsert).toHaveBeenCalled(); // Team members
    });

    it("should create realistic booking data with varied statuses", async () => {
      const request = new NextRequest("http://localhost:3000/api/seed", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      });

      await seedDatabase(request);

      // Check that bookings with different statuses are created
      const bookingCalls = vi.mocked(prisma.booking.upsert).mock.calls;
      expect(bookingCalls.length).toBeGreaterThan(10); // Should create 15 bookings

      // Check for variety in booking statuses
      const statuses = bookingCalls.map((call) => call[0].create.status);
      expect(statuses).toContain("ACCEPTED");
      expect(statuses).toContain("PENDING");
      expect(statuses).toContain("CANCELLED");
    });

    it("should create team with proper member roles", async () => {
      const request = new NextRequest("http://localhost:3000/api/seed", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      });

      await seedDatabase(request);

      // Verify team creation
      expect(prisma.team.upsert).toHaveBeenCalledWith({
        where: { slug: "calmill-demo-team" },
        update: {},
        create: {
          name: "CalMill Demo Team",
          slug: "calmill-demo-team",
          bio: expect.stringContaining("showcase team"),
        },
      });

      // Verify team members with different roles
      const memberCalls = vi.mocked(prisma.teamMember.upsert).mock.calls;
      const roles = memberCalls.map((call) => call[0].create.role);
      expect(roles).toContain("OWNER");
      expect(roles).toContain("MEMBER");
    });

    it("should validate authorization header format", async () => {
      const testCases = [
        { header: "invalid-format", expectedStatus: 403 },
        { header: `Bearer `, expectedStatus: 403 },
        { header: `Basic ${validToken}`, expectedStatus: 403 },
        { header: `Bearer ${validToken}`, expectedStatus: 200 },
      ];

      for (const testCase of testCases) {
        const request = new NextRequest("http://localhost:3000/api/seed", {
          method: "POST",
          headers: {
            Authorization: testCase.header,
          },
        });

        const response = await seedDatabase(request);
        expect(response.status).toBe(testCase.expectedStatus);
      }
    });

    it("should handle bcrypt hashing errors", async () => {
      vi.mocked(bcryptjs.hash).mockRejectedValue(new Error("Hashing failed"));

      const request = new NextRequest("http://localhost:3000/api/seed", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      });

      const response = await seedDatabase(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("internal");
      expect(data.details).toBe("Hashing failed");
    });

    it("should create event types with proper JSON custom questions", async () => {
      const request = new NextRequest("http://localhost:3000/api/seed", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      });

      await seedDatabase(request);

      // Find event type creation calls that include custom questions
      const eventTypeCalls = vi.mocked(prisma.eventType.upsert).mock.calls;
      const callsWithQuestions = eventTypeCalls.filter(
        (call) =>
          call[0].create.customQuestions &&
          call[0].create.customQuestions !== "undefined",
      );

      expect(callsWithQuestions.length).toBeGreaterThan(0);

      // Verify custom questions are valid JSON
      callsWithQuestions.forEach((call) => {
        const questions = call[0].create.customQuestions as string;
        expect(() => JSON.parse(questions)).not.toThrow();

        const parsed = JSON.parse(questions);
        expect(Array.isArray(parsed)).toBe(true);

        if (parsed.length > 0) {
          expect(parsed[0]).toHaveProperty("id");
          expect(parsed[0]).toHaveProperty("type");
          expect(parsed[0]).toHaveProperty("label");
        }
      });
    });
  });
});
