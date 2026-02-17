import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockPrismaClient, mockSession } from "../helpers/setup";

// ─── MOCKS ───────────────────────────────────────────────────────────────────

// Mock the prisma module
vi.mock("@/lib/prisma", () => ({
  prisma: mockPrismaClient,
}));

// Mock NextAuth
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(() => Promise.resolve(mockSession)),
}));

// Mock Next.js server components
vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((data, init) => ({
      status: init?.status ?? 200,
      json: async () => data,
      body: JSON.stringify(data),
      _data: data,
      _status: init?.status ?? 200,
    })),
  },
}));

// ─── IMPORTS ─────────────────────────────────────────────────────────────────

// Import the route handlers
import { GET as listEventTypes, POST as createEventType } from "@/app/api/event-types/route";
import { generateSlug } from "@/lib/utils";
import { eventTypeCreateSchema } from "@/lib/validations";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function makeRequest(body?: unknown, method = "GET"): Request {
  return {
    method,
    json: async () => body,
    url: "http://localhost:3000/api/event-types",
    headers: new Headers(),
  } as unknown as Request;
}

const mockContext = { params: Promise.resolve({}) };

const mockEventType = {
  id: "clt1234567890abcdefghi",
  title: "30 Minute Meeting",
  slug: "30-minute-meeting",
  description: "A standard 30 minute meeting",
  duration: 30,
  isActive: true,
  requiresConfirmation: false,
  price: 0,
  currency: "USD",
  minimumNotice: 120,
  beforeBuffer: 0,
  afterBuffer: 0,
  slotInterval: null,
  maxBookingsPerDay: null,
  maxBookingsPerWeek: null,
  futureLimit: 60,
  color: null,
  customQuestions: null,
  locations: null,
  recurringEnabled: false,
  recurringMaxOccurrences: null,
  recurringFrequency: null,
  userId: "demo-user-id",
  scheduleId: "schedule-1",
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
  _count: { bookings: 3 },
  schedule: { id: "schedule-1", name: "Business Hours", timezone: "America/New_York" },
};

// ─── generateSlug utility ────────────────────────────────────────────────────

describe("generateSlug", () => {
  it("converts title to lowercase hyphenated slug", () => {
    expect(generateSlug("30 Minute Meeting")).toBe("30-minute-meeting");
  });

  it("removes special characters", () => {
    expect(generateSlug("Coffee & Chat!")).toBe("coffee-chat");
  });

  it("handles multiple spaces and hyphens", () => {
    expect(generateSlug("  Tech   Interview  ")).toBe("tech-interview");
  });

  it("trims leading/trailing hyphens", () => {
    expect(generateSlug("-Hello World-")).toBe("hello-world");
  });

  it("converts underscores to hyphens", () => {
    expect(generateSlug("my_event_type")).toBe("my-event-type");
  });
});

// ─── GET /api/event-types ────────────────────────────────────────────────────

describe("GET /api/event-types", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns list of event types for authenticated user", async () => {
    mockPrismaClient.eventType.findMany.mockResolvedValue([mockEventType]);

    const request = makeRequest(undefined, "GET");
    const response = await listEventTypes(request, mockContext);

    expect(response._status).toBe(200);
    expect(response._data.success).toBe(true);
    expect(response._data.data).toHaveLength(1);
    expect(response._data.data[0].title).toBe("30 Minute Meeting");
  });

  it("queries only the authenticated user's event types", async () => {
    mockPrismaClient.eventType.findMany.mockResolvedValue([]);

    const request = makeRequest(undefined, "GET");
    await listEventTypes(request, mockContext);

    expect(mockPrismaClient.eventType.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: mockSession.user.id },
      })
    );
  });

  it("returns empty array when user has no event types", async () => {
    mockPrismaClient.eventType.findMany.mockResolvedValue([]);

    const request = makeRequest(undefined, "GET");
    const response = await listEventTypes(request, mockContext);

    expect(response._data.success).toBe(true);
    expect(response._data.data).toHaveLength(0);
  });

  it("orders event types by createdAt descending", async () => {
    mockPrismaClient.eventType.findMany.mockResolvedValue([]);

    const request = makeRequest(undefined, "GET");
    await listEventTypes(request, mockContext);

    expect(mockPrismaClient.eventType.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: "desc" },
      })
    );
  });

  it("includes booking count and schedule info", async () => {
    mockPrismaClient.eventType.findMany.mockResolvedValue([mockEventType]);

    const request = makeRequest(undefined, "GET");
    const response = await listEventTypes(request, mockContext);

    const eventType = response._data.data[0];
    expect(eventType._count).toBeDefined();
    expect(eventType._count.bookings).toBe(3);
    expect(eventType.schedule).toBeDefined();
  });

  it("returns 500 on database error", async () => {
    mockPrismaClient.eventType.findMany.mockRejectedValue(new Error("DB error"));

    const request = makeRequest(undefined, "GET");
    const response = await listEventTypes(request, mockContext);

    expect(response._status).toBe(500);
    expect(response._data.error).toBe("Internal server error");
  });
});

// ─── POST /api/event-types ───────────────────────────────────────────────────

describe("POST /api/event-types", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // By default, no existing slugs
    mockPrismaClient.eventType.findMany.mockResolvedValue([]);
    // No default schedule
    mockPrismaClient.schedule.findFirst.mockResolvedValue(null);
    // Event type create returns the mock
    mockPrismaClient.eventType.create.mockResolvedValue(mockEventType);
  });

  it("creates an event type with valid data", async () => {
    const body = {
      title: "30 Minute Meeting",
      duration: 30,
    };

    const request = makeRequest(body, "POST");
    const response = await createEventType(request, mockContext);

    expect(response._status).toBe(201);
    expect(response._data.success).toBe(true);
    expect(mockPrismaClient.eventType.create).toHaveBeenCalledTimes(1);
  });

  it("auto-generates slug from title when not provided", async () => {
    const body = { title: "Tech Interview", duration: 45 };

    const request = makeRequest(body, "POST");
    await createEventType(request, mockContext);

    expect(mockPrismaClient.eventType.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          slug: "tech-interview",
        }),
      })
    );
  });

  it("uses provided slug when explicitly given", async () => {
    const body = { title: "Tech Interview", slug: "my-custom-slug", duration: 45 };

    const request = makeRequest(body, "POST");
    await createEventType(request, mockContext);

    expect(mockPrismaClient.eventType.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          slug: "my-custom-slug",
        }),
      })
    );
  });

  it("deduplicates slug with suffix when slug already exists", async () => {
    // Return existing event type with the same slug
    mockPrismaClient.eventType.findMany.mockResolvedValue([
      { slug: "30-minute-meeting" },
    ]);

    const body = { title: "30 Minute Meeting", duration: 30 };
    const request = makeRequest(body, "POST");
    await createEventType(request, mockContext);

    expect(mockPrismaClient.eventType.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          slug: "30-minute-meeting-2",
        }),
      })
    );
  });

  it("increments slug counter past -2 if -2 also exists", async () => {
    mockPrismaClient.eventType.findMany.mockResolvedValue([
      { slug: "30-minute-meeting" },
      { slug: "30-minute-meeting-2" },
    ]);

    const body = { title: "30 Minute Meeting", duration: 30 };
    const request = makeRequest(body, "POST");
    await createEventType(request, mockContext);

    expect(mockPrismaClient.eventType.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          slug: "30-minute-meeting-3",
        }),
      })
    );
  });

  it("uses user's default schedule when scheduleId not provided", async () => {
    const defaultSchedule = { id: "default-schedule-id" };
    mockPrismaClient.schedule.findFirst.mockResolvedValue(defaultSchedule);

    const body = { title: "Meeting", duration: 30 };
    const request = makeRequest(body, "POST");
    await createEventType(request, mockContext);

    expect(mockPrismaClient.eventType.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          scheduleId: "default-schedule-id",
        }),
      })
    );
  });

  it("returns 400 on invalid input (missing duration)", async () => {
    const body = { title: "Meeting" }; // missing required duration

    const request = makeRequest(body, "POST");
    const response = await createEventType(request, mockContext);

    expect(response._status).toBe(400);
    expect(response._data.error).toBe("Validation failed");
  });

  it("returns 400 when duration is below minimum (5 min)", async () => {
    const body = { title: "Meeting", duration: 4 };

    const request = makeRequest(body, "POST");
    const response = await createEventType(request, mockContext);

    expect(response._status).toBe(400);
  });

  it("returns 400 when duration exceeds maximum (720 min)", async () => {
    const body = { title: "Meeting", duration: 721 };

    const request = makeRequest(body, "POST");
    const response = await createEventType(request, mockContext);

    expect(response._status).toBe(400);
  });

  it("sets userId from the authenticated session", async () => {
    const body = { title: "Meeting", duration: 30 };
    const request = makeRequest(body, "POST");
    await createEventType(request, mockContext);

    expect(mockPrismaClient.eventType.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: mockSession.user.id,
        }),
      })
    );
  });

  it("returns 500 on database error during creation", async () => {
    mockPrismaClient.eventType.create.mockRejectedValue(new Error("DB write error"));

    const body = { title: "Meeting", duration: 30 };
    const request = makeRequest(body, "POST");
    const response = await createEventType(request, mockContext);

    expect(response._status).toBe(500);
    expect(response._data.error).toBe("Internal server error");
  });
});

// ─── eventTypeCreateSchema validation ───────────────────────────────────────

describe("eventTypeCreateSchema", () => {
  it("accepts valid event type data", () => {
    const result = eventTypeCreateSchema.safeParse({
      title: "Quick Chat",
      duration: 15,
    });
    expect(result.success).toBe(true);
  });

  it("rejects title longer than 100 characters", () => {
    const result = eventTypeCreateSchema.safeParse({
      title: "A".repeat(101),
      duration: 30,
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional fields", () => {
    const result = eventTypeCreateSchema.safeParse({
      title: "Meeting",
      duration: 30,
      beforeBuffer: 10,
      afterBuffer: 10,
      maxBookingsPerDay: 5,
      requiresConfirmation: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid color format", () => {
    const result = eventTypeCreateSchema.safeParse({
      title: "Meeting",
      duration: 30,
      color: "blue", // not a hex color
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid hex color", () => {
    const result = eventTypeCreateSchema.safeParse({
      title: "Meeting",
      duration: 30,
      color: "#3b82f6",
    });
    expect(result.success).toBe(true);
  });
});
