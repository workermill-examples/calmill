import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockPrismaClient, mockSession } from "../helpers/setup";

// ─── MOCKS ───────────────────────────────────────────────────────────────────

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrismaClient,
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(() => Promise.resolve(mockSession)),
}));

vi.mock("next/server", () => ({
  NextResponse: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: vi.fn((data: any, init?: any) => ({
      status: init?.status ?? 200,
      json: async () => data,
      body: JSON.stringify(data),
      _data: data,
      _status: init?.status ?? 200,
    })) as unknown as any,
  },
}));

// Mock getAvailableSlots to control slot availability in tests
vi.mock("@/lib/slots", () => ({
  getAvailableSlots: vi.fn(),
}));

// ─── IMPORTS ─────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { GET as _listBookings, POST as _createBooking } from "@/app/api/bookings/route";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { GET as _getBooking, PATCH as _updateBookingStatus, PUT as _rescheduleBooking } from "@/app/api/bookings/[uid]/route";
// Cast handlers to any so TypeScript accepts _data/_status on mock responses
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listBookings = _listBookings as (...args: any[]) => Promise<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createBooking = _createBooking as (...args: any[]) => Promise<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getBooking = _getBooking as (...args: any[]) => Promise<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateBookingStatus = _updateBookingStatus as (...args: any[]) => Promise<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rescheduleBooking = _rescheduleBooking as (...args: any[]) => Promise<any>;
import { getAvailableSlots } from "@/lib/slots";
import { bookingCreateSchema, bookingActionSchema } from "@/lib/validations";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function makeRequest(body?: unknown, method = "GET", searchParams?: Record<string, string>): Request {
  const url = new URL("http://localhost:3000/api/bookings");
  if (searchParams) {
    Object.entries(searchParams).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  return {
    method,
    json: async () => body,
    url: url.toString(),
    headers: new Headers(),
  } as unknown as Request;
}

function makeUidRequest(uid: string, body?: unknown, method = "GET"): [Request, { params: Promise<{ uid: string }> }] {
  const request = {
    method,
    json: async () => body,
    url: `http://localhost:3000/api/bookings/${uid}`,
    headers: new Headers(),
  } as unknown as Request;
  const context = { params: Promise.resolve({ uid }) };
  return [request, context];
}

const mockEventType = {
  id: "clt1234567890abcdefghi",
  title: "30 Minute Meeting",
  duration: 30,
  locations: null,
  color: null,
  requiresConfirmation: false,
  userId: "demo-user-id",
  isActive: true,
  schedule: {
    availability: [],
    dateOverrides: [],
  },
  user: {
    id: "demo-user-id",
    name: "Alex Demo",
    email: "demo@workermill.com",
  },
};

const mockBooking = {
  id: "booking-1",
  uid: "booking-uid-abc123",
  title: "John Doe <> Alex Demo",
  description: null,
  startTime: new Date("2026-03-10T10:00:00Z"),
  endTime: new Date("2026-03-10T10:30:00Z"),
  status: "PENDING",
  attendeeName: "John Doe",
  attendeeEmail: "john@example.com",
  attendeeTimezone: "America/New_York",
  attendeeNotes: null,
  location: null,
  responses: null,
  cancellationReason: null,
  cancelledAt: null,
  recurringEventId: null,
  userId: "demo-user-id",
  eventTypeId: "clt1234567890abcdefghi",
  createdAt: new Date("2026-03-01"),
  updatedAt: new Date("2026-03-01"),
  eventType: {
    id: "clt1234567890abcdefghi",
    title: "30 Minute Meeting",
    duration: 30,
    locations: null,
    color: null,
    userId: "demo-user-id",
    requiresConfirmation: false,
    user: {
      id: "demo-user-id",
      name: "Alex Demo",
      username: "demo",
      avatarUrl: null,
      bio: null,
    },
  },
};

// ─── GET /api/bookings ───────────────────────────────────────────────────────

describe("GET /api/bookings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrismaClient.booking.findMany.mockResolvedValue([mockBooking]);
    mockPrismaClient.booking.count.mockResolvedValue(1);
  });

  it("returns paginated list of bookings for authenticated user", async () => {
    const request = makeRequest(undefined, "GET");
    const response = await listBookings(request);

    expect(response._status).toBe(200);
    expect(response._data.success).toBe(true);
    expect(response._data.data).toHaveLength(1);
  });

  it("queries only the authenticated user's bookings", async () => {
    const request = makeRequest(undefined, "GET");
    await listBookings(request);

    expect(mockPrismaClient.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: mockSession.user.id,
        }),
      })
    );
  });

  it("filters by status when provided", async () => {
    const request = makeRequest(undefined, "GET", { status: "pending" });
    await listBookings(request);

    expect(mockPrismaClient.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: "PENDING",
        }),
      })
    );
  });

  it("includes pagination metadata in the response", async () => {
    const request = makeRequest(undefined, "GET");
    const response = await listBookings(request);

    expect(response._data.pagination).toBeDefined();
    expect(response._data.pagination.page).toBe(1);
    expect(response._data.pagination.total).toBe(1);
  });

  it("returns 500 on database error", async () => {
    mockPrismaClient.booking.findMany.mockRejectedValue(new Error("DB error"));

    const request = makeRequest(undefined, "GET");
    const response = await listBookings(request);

    expect(response._status).toBe(500);
    expect(response._data.error).toBe("Internal server error");
  });
});

// ─── POST /api/bookings ──────────────────────────────────────────────────────

describe("POST /api/bookings", () => {
  const validBody = {
    eventTypeId: "clt1234567890abcdefghi",
    startTime: "2026-03-10T10:00:00.000Z",
    attendeeName: "John Doe",
    attendeeEmail: "john@example.com",
    attendeeTimezone: "America/New_York",
  };

  const availableSlot = { time: "2026-03-10T10:00:00.000Z", localTime: "05:00", duration: 30 };

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrismaClient.eventType.findUnique.mockResolvedValue(mockEventType);
    (getAvailableSlots as ReturnType<typeof vi.fn>).mockResolvedValue([availableSlot]);
    mockPrismaClient.booking.create.mockResolvedValue(mockBooking);
  });

  it("creates a booking when the slot is available", async () => {
    const request = makeRequest(validBody, "POST");
    const response = await createBooking(request);

    expect(response._status).toBe(201);
    expect(response._data.success).toBe(true);
    expect(mockPrismaClient.booking.create).toHaveBeenCalledTimes(1);
  });

  it("re-verifies slot availability before creating booking", async () => {
    const request = makeRequest(validBody, "POST");
    await createBooking(request);

    expect(getAvailableSlots).toHaveBeenCalledWith(
      expect.objectContaining({
        eventTypeId: validBody.eventTypeId,
        timezone: validBody.attendeeTimezone,
      })
    );
  });

  it("returns 409 when the requested slot is no longer available", async () => {
    (getAvailableSlots as ReturnType<typeof vi.fn>).mockResolvedValue([]); // no slots available

    const request = makeRequest(validBody, "POST");
    const response = await createBooking(request);

    expect(response._status).toBe(409);
    expect(response._data.error).toContain("no longer available");
    expect(mockPrismaClient.booking.create).not.toHaveBeenCalled();
  });

  it("returns 404 when event type is not found", async () => {
    mockPrismaClient.eventType.findUnique.mockResolvedValue(null);

    const request = makeRequest(validBody, "POST");
    const response = await createBooking(request);

    expect(response._status).toBe(404);
    expect(response._data.error).toContain("not found");
  });

  it("creates booking with PENDING status when event requires confirmation", async () => {
    mockPrismaClient.eventType.findUnique.mockResolvedValue({
      ...mockEventType,
      requiresConfirmation: true,
    });

    const request = makeRequest(validBody, "POST");
    await createBooking(request);

    expect(mockPrismaClient.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "PENDING",
        }),
      })
    );
  });

  it("creates booking with ACCEPTED status when event does not require confirmation", async () => {
    mockPrismaClient.eventType.findUnique.mockResolvedValue({
      ...mockEventType,
      requiresConfirmation: false,
    });

    const request = makeRequest(validBody, "POST");
    await createBooking(request);

    expect(mockPrismaClient.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "ACCEPTED",
        }),
      })
    );
  });

  it("returns 400 on invalid input (missing attendee email)", async () => {
    const body = { ...validBody, attendeeEmail: "not-an-email" };

    const request = makeRequest(body, "POST");
    const response = await createBooking(request);

    expect(response._status).toBe(400);
    expect(response._data.error).toBe("Validation failed");
  });

  it("returns 400 when startTime is missing", async () => {
    const { startTime: _startTime, ...body } = validBody;

    const request = makeRequest(body, "POST");
    const response = await createBooking(request);

    expect(response._status).toBe(400);
  });

  it("returns 500 on database error during creation", async () => {
    mockPrismaClient.booking.create.mockRejectedValue(new Error("DB error"));

    const request = makeRequest(validBody, "POST");
    const response = await createBooking(request);

    expect(response._status).toBe(500);
  });
});

// ─── GET /api/bookings/[uid] ─────────────────────────────────────────────────

describe("GET /api/bookings/[uid]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrismaClient.booking.findUnique.mockResolvedValue(mockBooking);
  });

  it("returns booking by UID", async () => {
    const [request, context] = makeUidRequest("booking-uid-abc123");
    const response = await getBooking(request, context);

    expect(response._status).toBe(200);
    expect(response._data.success).toBe(true);
    expect(response._data.data.uid).toBe("booking-uid-abc123");
  });

  it("returns 404 when booking is not found", async () => {
    mockPrismaClient.booking.findUnique.mockResolvedValue(null);

    const [request, context] = makeUidRequest("non-existent-uid");
    const response = await getBooking(request, context);

    expect(response._status).toBe(404);
    expect(response._data.error).toBe("Booking not found");
  });

  it("includes event type and host info in response", async () => {
    const [request, context] = makeUidRequest("booking-uid-abc123");
    const response = await getBooking(request, context);

    expect(response._data.data.eventType).toBeDefined();
    expect(response._data.data.eventType.user).toBeDefined();
  });
});

// ─── PATCH /api/bookings/[uid] — Status transitions ──────────────────────────

describe("PATCH /api/bookings/[uid]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrismaClient.booking.findUnique.mockResolvedValue(mockBooking);
    mockPrismaClient.booking.update.mockResolvedValue({ ...mockBooking, status: "ACCEPTED" });
  });

  it("accepts a PENDING booking (host action)", async () => {
    const [request, context] = makeUidRequest(
      "booking-uid-abc123",
      { action: "accept" },
      "PATCH"
    );
    const response = await updateBookingStatus(request, context);

    expect(response._status).toBe(200);
    expect(mockPrismaClient.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "ACCEPTED" }),
      })
    );
  });

  it("rejects a PENDING booking (host action)", async () => {
    mockPrismaClient.booking.update.mockResolvedValue({ ...mockBooking, status: "REJECTED" });

    const [request, context] = makeUidRequest(
      "booking-uid-abc123",
      { action: "reject", reason: "Schedule conflict" },
      "PATCH"
    );
    const response = await updateBookingStatus(request, context);

    expect(response._status).toBe(200);
    expect(mockPrismaClient.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "REJECTED" }),
      })
    );
  });

  it("cancels a booking (attendee or host)", async () => {
    mockPrismaClient.booking.update.mockResolvedValue({ ...mockBooking, status: "CANCELLED" });

    const [request, context] = makeUidRequest(
      "booking-uid-abc123",
      { action: "cancel", reason: "Cannot attend" },
      "PATCH"
    );
    const response = await updateBookingStatus(request, context);

    expect(response._status).toBe(200);
    expect(mockPrismaClient.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "CANCELLED" }),
      })
    );
  });

  it("returns 409 on invalid status transition (CANCELLED → ACCEPTED)", async () => {
    mockPrismaClient.booking.findUnique.mockResolvedValue({
      ...mockBooking,
      status: "CANCELLED",
    });

    const [request, context] = makeUidRequest(
      "booking-uid-abc123",
      { action: "accept" },
      "PATCH"
    );
    const response = await updateBookingStatus(request, context);

    expect(response._status).toBe(409);
    expect(response._data.error).toContain("Cannot transition");
  });

  it("returns 404 when booking is not found", async () => {
    mockPrismaClient.booking.findUnique.mockResolvedValue(null);

    const [request, context] = makeUidRequest(
      "non-existent-uid",
      { action: "cancel" },
      "PATCH"
    );
    const response = await updateBookingStatus(request, context);

    expect(response._status).toBe(404);
  });

  it("returns 400 on invalid action", async () => {
    const [request, context] = makeUidRequest(
      "booking-uid-abc123",
      { action: "invalid-action" },
      "PATCH"
    );
    const response = await updateBookingStatus(request, context);

    expect(response._status).toBe(400);
    expect(response._data.error).toBe("Validation failed");
  });
});

// ─── PUT /api/bookings/[uid] — Reschedule ────────────────────────────────────

describe("PUT /api/bookings/[uid] (reschedule)", () => {
  const newStartTime = "2026-03-11T14:00:00.000Z";
  const newAvailableSlot = { time: newStartTime, localTime: "09:00", duration: 30 };

  const bookingWithEventType = {
    ...mockBooking,
    eventTypeId: "clt1234567890abcdefghi",
    eventType: {
      ...mockBooking.eventType,
      duration: 30,
      requiresConfirmation: false,
      schedule: { availability: [], dateOverrides: [] },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrismaClient.booking.findUnique.mockResolvedValue(bookingWithEventType);
    (getAvailableSlots as ReturnType<typeof vi.fn>).mockResolvedValue([newAvailableSlot]);
    mockPrismaClient.$transaction.mockImplementation(async (ops: unknown[]) => {
      // Simulate transaction by executing the promises
      const results = await Promise.all((ops as Promise<unknown>[]));
      return results;
    });
    mockPrismaClient.booking.update.mockResolvedValue({ ...bookingWithEventType, status: "RESCHEDULED" });
    mockPrismaClient.booking.create.mockResolvedValue({
      ...bookingWithEventType,
      id: "booking-new",
      uid: "booking-uid-new",
      startTime: new Date(newStartTime),
      endTime: new Date(new Date(newStartTime).getTime() + 30 * 60 * 1000),
    });
  });

  it("reschedules a PENDING booking to a new available slot", async () => {
    const [request, context] = makeUidRequest(
      "booking-uid-abc123",
      { startTime: newStartTime },
      "PUT"
    );
    const response = await rescheduleBooking(request, context);

    expect(response._status).toBe(201);
    expect(response._data.success).toBe(true);
  });

  it("verifies new slot availability before rescheduling", async () => {
    const [request, context] = makeUidRequest(
      "booking-uid-abc123",
      { startTime: newStartTime },
      "PUT"
    );
    await rescheduleBooking(request, context);

    expect(getAvailableSlots).toHaveBeenCalledWith(
      expect.objectContaining({
        eventTypeId: bookingWithEventType.eventTypeId,
      })
    );
  });

  it("returns 409 when new slot is not available", async () => {
    (getAvailableSlots as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const [request, context] = makeUidRequest(
      "booking-uid-abc123",
      { startTime: newStartTime },
      "PUT"
    );
    const response = await rescheduleBooking(request, context);

    expect(response._status).toBe(409);
    expect(response._data.error).toContain("not available");
  });

  it("returns 409 when trying to reschedule a CANCELLED booking", async () => {
    mockPrismaClient.booking.findUnique.mockResolvedValue({
      ...bookingWithEventType,
      status: "CANCELLED",
    });

    const [request, context] = makeUidRequest(
      "booking-uid-abc123",
      { startTime: newStartTime },
      "PUT"
    );
    const response = await rescheduleBooking(request, context);

    expect(response._status).toBe(409);
    expect(response._data.error).toContain("Cannot reschedule");
  });

  it("returns 404 when booking is not found", async () => {
    mockPrismaClient.booking.findUnique.mockResolvedValue(null);

    const [request, context] = makeUidRequest(
      "non-existent-uid",
      { startTime: newStartTime },
      "PUT"
    );
    const response = await rescheduleBooking(request, context);

    expect(response._status).toBe(404);
  });

  it("returns 400 on invalid startTime format", async () => {
    const [request, context] = makeUidRequest(
      "booking-uid-abc123",
      { startTime: "not-a-date" },
      "PUT"
    );
    const response = await rescheduleBooking(request, context);

    expect(response._status).toBe(400);
    expect(response._data.error).toBe("Validation failed");
  });
});

// ─── bookingCreateSchema validation ─────────────────────────────────────────

describe("bookingCreateSchema", () => {
  it("accepts valid booking data", () => {
    const result = bookingCreateSchema.safeParse({
      eventTypeId: "clxxxxxxxxxxxxxxxxxxxxxxxx",
      startTime: "2026-03-10T10:00:00.000Z",
      attendeeName: "John Doe",
      attendeeEmail: "john@example.com",
      attendeeTimezone: "America/New_York",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = bookingCreateSchema.safeParse({
      eventTypeId: "clxxxxxxxxxxxxxxxxxxxxxxxx",
      startTime: "2026-03-10T10:00:00.000Z",
      attendeeName: "John Doe",
      attendeeEmail: "not-an-email",
      attendeeTimezone: "UTC",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-datetime startTime", () => {
    const result = bookingCreateSchema.safeParse({
      eventTypeId: "clxxxxxxxxxxxxxxxxxxxxxxxx",
      startTime: "2026-03-10", // date only, not ISO datetime
      attendeeName: "John Doe",
      attendeeEmail: "john@example.com",
      attendeeTimezone: "UTC",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional fields", () => {
    const result = bookingCreateSchema.safeParse({
      eventTypeId: "clxxxxxxxxxxxxxxxxxxxxxxxx",
      startTime: "2026-03-10T10:00:00.000Z",
      attendeeName: "John Doe",
      attendeeEmail: "john@example.com",
      attendeeTimezone: "UTC",
      attendeeNotes: "Please bring your laptop",
      location: "Zoom",
      responses: { question1: "answer1" },
    });
    expect(result.success).toBe(true);
  });
});

// ─── bookingActionSchema validation ─────────────────────────────────────────

describe("bookingActionSchema", () => {
  it("accepts accept action", () => {
    const result = bookingActionSchema.safeParse({ action: "accept" });
    expect(result.success).toBe(true);
  });

  it("accepts reject action with reason", () => {
    const result = bookingActionSchema.safeParse({ action: "reject", reason: "No availability" });
    expect(result.success).toBe(true);
  });

  it("accepts cancel action", () => {
    const result = bookingActionSchema.safeParse({ action: "cancel" });
    expect(result.success).toBe(true);
  });

  it("rejects unknown action", () => {
    const result = bookingActionSchema.safeParse({ action: "approve" });
    expect(result.success).toBe(false);
  });
});
