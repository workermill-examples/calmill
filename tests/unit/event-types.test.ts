import { describe, it, expect } from "vitest";
import { mockPrismaClient } from "../helpers/setup";

// Import route handlers after mocks are set up
const { GET: getEventTypes, POST: postEventType } = await import(
  "@/app/api/event-types/route"
);
const {
  GET: getEventType,
  PUT: putEventType,
  DELETE: deleteEventType,
} = await import("@/app/api/event-types/[id]/route");
const { PATCH: toggleEventType } = await import(
  "@/app/api/event-types/[id]/toggle/route"
);

const makeRequest = (body?: unknown): Request =>
  ({
    json: async () => body,
    headers: new Headers(),
  }) as unknown as Request;

const makeContext = (id = "event-type-id-1") => ({
  params: Promise.resolve({ id }),
});

const mockEventType = {
  id: "event-type-id-1",
  title: "30 Minute Meeting",
  slug: "30min",
  description: "A quick meeting",
  duration: 30,
  isActive: true,
  requiresConfirmation: false,
  price: 0,
  currency: "USD",
  minimumNotice: 120,
  futureLimit: 60,
  beforeBuffer: 0,
  afterBuffer: 0,
  userId: "demo-user-id",
  scheduleId: "schedule-id-1",
  locations: [],
  customQuestions: null,
  color: null,
  slotInterval: null,
  maxBookingsPerDay: null,
  maxBookingsPerWeek: null,
  recurringEnabled: false,
  recurringMaxOccurrences: null,
  recurringFrequency: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  _count: { bookings: 3 },
  schedule: { id: "schedule-id-1", name: "Business Hours", timezone: "America/New_York" },
};

describe("GET /api/event-types", () => {
  it("returns list of event types for authenticated user", async () => {
    mockPrismaClient.eventType.findMany.mockResolvedValue([mockEventType]);

    const response = await getEventTypes(makeRequest(), makeContext());
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(1);
    expect(data.data[0].title).toBe("30 Minute Meeting");
  });

  it("returns empty array when user has no event types", async () => {
    mockPrismaClient.eventType.findMany.mockResolvedValue([]);

    const response = await getEventTypes(makeRequest(), makeContext());
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(0);
  });

  it("returns 500 on database error", async () => {
    mockPrismaClient.eventType.findMany.mockRejectedValue(new Error("DB error"));

    const response = await getEventTypes(makeRequest(), makeContext());
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBeTruthy();
  });
});

describe("POST /api/event-types", () => {
  it("creates event type with valid data", async () => {
    mockPrismaClient.eventType.findMany.mockResolvedValue([]);
    mockPrismaClient.schedule.findFirst.mockResolvedValue({ id: "schedule-id-1" });
    mockPrismaClient.eventType.create.mockResolvedValue({ ...mockEventType, _count: { bookings: 0 } });

    const request = makeRequest({
      title: "30 Minute Meeting",
      duration: 30,
    });

    const response = await postEventType(request, makeContext());
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.title).toBe("30 Minute Meeting");
  });

  it("auto-generates slug from title", async () => {
    mockPrismaClient.eventType.findMany.mockResolvedValue([]);
    mockPrismaClient.schedule.findFirst.mockResolvedValue({ id: "schedule-id-1" });
    mockPrismaClient.eventType.create.mockResolvedValue({ ...mockEventType, slug: "my-meeting" });

    const request = makeRequest({ title: "My Meeting", duration: 30 });
    const response = await postEventType(request, makeContext());

    expect(response.status).toBe(201);
    expect(mockPrismaClient.eventType.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ slug: "my-meeting" }),
      })
    );
  });

  it("deduplicates slug when conflict exists", async () => {
    mockPrismaClient.eventType.findMany.mockResolvedValue([{ slug: "30min" }]);
    mockPrismaClient.schedule.findFirst.mockResolvedValue({ id: "schedule-id-1" });
    mockPrismaClient.eventType.create.mockResolvedValue({ ...mockEventType, slug: "30min-2" });

    const request = makeRequest({ title: "30 Minute Meeting", duration: 30, slug: "30min" });
    const response = await postEventType(request, makeContext());

    expect(response.status).toBe(201);
    expect(mockPrismaClient.eventType.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ slug: "30min-2" }),
      })
    );
  });

  it("returns 400 for invalid input", async () => {
    const request = makeRequest({ title: "", duration: 0 });
    const response = await postEventType(request, makeContext());
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeTruthy();
  });

  it("uses provided scheduleId instead of default", async () => {
    // Use a valid CUID so Zod schema validation passes
    const customScheduleId = "clh1x2y3z0000abcdefghij01";
    mockPrismaClient.eventType.findMany.mockResolvedValue([]);
    mockPrismaClient.eventType.create.mockResolvedValue(mockEventType);

    const request = makeRequest({
      title: "Test",
      duration: 30,
      scheduleId: customScheduleId,
    });
    await postEventType(request, makeContext());

    expect(mockPrismaClient.schedule.findFirst).not.toHaveBeenCalled();
    expect(mockPrismaClient.eventType.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ scheduleId: customScheduleId }),
      })
    );
  });
});

describe("GET /api/event-types/[id]", () => {
  it("returns event type for owner", async () => {
    mockPrismaClient.eventType.findUnique.mockResolvedValue(mockEventType);

    const response = await getEventType(makeRequest(), makeContext());
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.id).toBe("event-type-id-1");
  });

  it("returns 404 when event type not found", async () => {
    mockPrismaClient.eventType.findUnique.mockResolvedValue(null);

    const response = await getEventType(makeRequest(), makeContext("nonexistent-id"));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBeTruthy();
  });

  it("returns 403 when user does not own the event type", async () => {
    mockPrismaClient.eventType.findUnique.mockResolvedValue({
      ...mockEventType,
      userId: "other-user-id",
    });

    const response = await getEventType(makeRequest(), makeContext());
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBeTruthy();
  });
});

describe("PUT /api/event-types/[id]", () => {
  it("updates event type with valid data", async () => {
    const updatedType = { ...mockEventType, title: "Updated Title" };
    mockPrismaClient.eventType.findUnique.mockResolvedValue(mockEventType);
    mockPrismaClient.eventType.findMany.mockResolvedValue([]);
    mockPrismaClient.eventType.update.mockResolvedValue(updatedType);

    const request = makeRequest({ title: "Updated Title" });
    const response = await putEventType(request, makeContext());
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.title).toBe("Updated Title");
  });

  it("returns 404 when event type not found", async () => {
    mockPrismaClient.eventType.findUnique.mockResolvedValue(null);

    const request = makeRequest({ title: "Updated" });
    const response = await putEventType(request, makeContext());
    await response.json();

    expect(response.status).toBe(404);
  });
});

describe("DELETE /api/event-types/[id]", () => {
  it("deletes event type owned by user", async () => {
    mockPrismaClient.eventType.findUnique.mockResolvedValue(mockEventType);
    mockPrismaClient.booking.deleteMany.mockResolvedValue({ count: 0 });
    mockPrismaClient.eventType.delete.mockResolvedValue(mockEventType);

    const response = await deleteEventType(makeRequest(), makeContext());
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("returns 403 when user does not own the event type", async () => {
    mockPrismaClient.eventType.findUnique.mockResolvedValue({
      ...mockEventType,
      userId: "other-user-id",
    });

    const response = await deleteEventType(makeRequest(), makeContext());
    expect(response.status).toBe(403);
  });
});

describe("PATCH /api/event-types/[id]/toggle", () => {
  it("toggles isActive from true to false", async () => {
    mockPrismaClient.eventType.findUnique.mockResolvedValue({ ...mockEventType, isActive: true });
    mockPrismaClient.eventType.update.mockResolvedValue({ ...mockEventType, isActive: false });

    const response = await toggleEventType(makeRequest(), makeContext());
    await response.json();

    expect(response.status).toBe(200);
    expect(mockPrismaClient.eventType.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { isActive: false },
      })
    );
  });

  it("toggles isActive from false to true", async () => {
    mockPrismaClient.eventType.findUnique.mockResolvedValue({ ...mockEventType, isActive: false });
    mockPrismaClient.eventType.update.mockResolvedValue({ ...mockEventType, isActive: true });

    const response = await toggleEventType(makeRequest(), makeContext());

    expect(response.status).toBe(200);
    expect(mockPrismaClient.eventType.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { isActive: true },
      })
    );
  });

  it("returns 404 when event type not found", async () => {
    mockPrismaClient.eventType.findUnique.mockResolvedValue(null);

    const response = await toggleEventType(makeRequest(), makeContext());
    expect(response.status).toBe(404);
  });
});
