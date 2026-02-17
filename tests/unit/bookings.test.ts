import { describe, it, expect, vi } from "vitest";
import { mockPrismaClient } from "../helpers/setup";

// Mock @/lib/slots at module level so it takes effect before imports
vi.mock("@/lib/slots", () => ({
  getAvailableSlots: vi.fn(),
}));

const { getAvailableSlots } = await import("@/lib/slots");
const { GET: getBookings, POST: postBooking } = await import(
  "@/app/api/bookings/route"
);
const {
  GET: getBookingByUid,
  PATCH: patchBooking,
  PUT: putBooking,
} = await import("@/app/api/bookings/[uid]/route");

// Use a valid CUID for eventTypeId to pass Zod schema validation
const EVENT_TYPE_CUID = "clh1x2y3z0000abcdefghij01";

const makeRequest = (
  body?: unknown,
  searchParams?: Record<string, string>
): Request => {
  const url = "http://localhost:3000/api/bookings" +
    (searchParams
      ? "?" + new URLSearchParams(searchParams).toString()
      : "");
  return {
    url,
    json: async () => body,
    headers: new Headers(),
  } as unknown as Request;
};

const makeContext = (uid = "booking-uid-001") => ({
  params: Promise.resolve({ uid }),
});

const mockBooking = {
  id: "booking-id-1",
  uid: "booking-uid-001",
  eventTypeId: EVENT_TYPE_CUID,
  userId: "demo-user-id",
  startTime: new Date("2026-03-10T14:00:00Z"),
  endTime: new Date("2026-03-10T14:30:00Z"),
  status: "PENDING",
  attendeeName: "John Doe",
  attendeeEmail: "john@example.com",
  attendeeTimezone: "America/New_York",
  attendeeNotes: null,
  cancellationReason: null,
  rejectionReason: null,
  location: null,
  responses: null,
  recurringEventId: null,
  title: "John Doe <> Alex Demo",
  description: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  eventType: {
    id: EVENT_TYPE_CUID,
    title: "30 Minute Meeting",
    duration: 30,
    locations: [],
    color: null,
    requiresConfirmation: false,
    userId: "demo-user-id",
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
  it("returns paginated bookings for authenticated user", async () => {
    mockPrismaClient.booking.findMany.mockResolvedValue([mockBooking]);
    mockPrismaClient.booking.count.mockResolvedValue(1);

    const response = await getBookings(makeRequest(undefined, {}));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(1);
    expect(data.pagination).toBeDefined();
  });

  it("filters bookings by status", async () => {
    mockPrismaClient.booking.findMany.mockResolvedValue([]);
    mockPrismaClient.booking.count.mockResolvedValue(0);

    const response = await getBookings(makeRequest(undefined, { status: "ACCEPTED" }));
    await response.json();

    expect(response.status).toBe(200);
    expect(mockPrismaClient.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: "ACCEPTED" }),
      })
    );
  });

  it("filters bookings by date range", async () => {
    mockPrismaClient.booking.findMany.mockResolvedValue([]);
    mockPrismaClient.booking.count.mockResolvedValue(0);

    const response = await getBookings(
      makeRequest(undefined, { startDate: "2026-03-01", endDate: "2026-03-31" })
    );

    expect(response.status).toBe(200);
    expect(mockPrismaClient.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          startTime: expect.objectContaining({
            gte: expect.any(Date),
            lte: expect.any(Date),
          }),
        }),
      })
    );
  });
});

// ─── POST /api/bookings ──────────────────────────────────────────────────────

describe("POST /api/bookings", () => {
  const validBookingInput = {
    eventTypeId: EVENT_TYPE_CUID,
    startTime: "2026-03-10T14:00:00.000Z",
    attendeeName: "John Doe",
    attendeeEmail: "john@example.com",
    attendeeTimezone: "America/New_York",
  };

  it("creates booking when slot is available", async () => {
    vi.mocked(getAvailableSlots).mockResolvedValue([
      { time: "2026-03-10T14:00:00.000Z", localTime: "09:00", duration: 30 },
    ]);

    mockPrismaClient.eventType.findUnique.mockResolvedValue({
      id: EVENT_TYPE_CUID,
      userId: "demo-user-id",
      duration: 30,
      requiresConfirmation: false,
      isActive: true,
      user: { id: "demo-user-id", name: "Alex Demo", email: "demo@workermill.com" },
      schedule: null,
    });
    mockPrismaClient.booking.create.mockResolvedValue({ ...mockBooking, status: "ACCEPTED" });

    const request = makeRequest(validBookingInput);
    const response = await postBooking(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
  });

  it("returns 400 for invalid booking data", async () => {
    const request = makeRequest({ eventTypeId: "not-a-cuid" });
    const response = await postBooking(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeTruthy();
  });

  it("returns 409 when slot is no longer available", async () => {
    vi.mocked(getAvailableSlots).mockResolvedValue([]);

    mockPrismaClient.eventType.findUnique.mockResolvedValue({
      id: EVENT_TYPE_CUID,
      userId: "demo-user-id",
      duration: 30,
      requiresConfirmation: false,
      isActive: true,
      user: { id: "demo-user-id", name: "Alex Demo", email: "demo@workermill.com" },
      schedule: null,
    });

    const request = makeRequest(validBookingInput);
    const response = await postBooking(request);

    expect(response.status).toBe(409);
  });
});

// ─── GET /api/bookings/[uid] ─────────────────────────────────────────────────

describe("GET /api/bookings/[uid]", () => {
  it("returns booking by UID (public endpoint)", async () => {
    mockPrismaClient.booking.findUnique.mockResolvedValue(mockBooking);

    const response = await getBookingByUid(makeRequest(), makeContext("booking-uid-001"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.uid).toBe("booking-uid-001");
  });

  it("returns 404 for non-existent booking UID", async () => {
    mockPrismaClient.booking.findUnique.mockResolvedValue(null);

    const response = await getBookingByUid(makeRequest(), makeContext("nonexistent-uid"));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBeTruthy();
  });
});

// ─── PATCH /api/bookings/[uid] — Status transitions ─────────────────────────

describe("PATCH /api/bookings/[uid]", () => {
  it("allows host to accept a PENDING booking", async () => {
    mockPrismaClient.booking.findUnique.mockResolvedValue({
      ...mockBooking,
      status: "PENDING",
      eventType: { userId: "demo-user-id" },
    });
    mockPrismaClient.booking.update.mockResolvedValue({ ...mockBooking, status: "ACCEPTED" });

    const request = makeRequest({ action: "accept" });
    const response = await patchBooking(request, makeContext("booking-uid-001"));
    await response.json();

    expect(response.status).toBe(200);
    expect(mockPrismaClient.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "ACCEPTED" }),
      })
    );
  });

  it("allows host to reject a PENDING booking", async () => {
    mockPrismaClient.booking.findUnique.mockResolvedValue({
      ...mockBooking,
      status: "PENDING",
      eventType: { userId: "demo-user-id" },
    });
    mockPrismaClient.booking.update.mockResolvedValue({ ...mockBooking, status: "REJECTED" });

    const request = makeRequest({ action: "reject", reason: "Not available" });
    const response = await patchBooking(request, makeContext("booking-uid-001"));

    expect(response.status).toBe(200);
  });

  it("allows cancellation of ACCEPTED booking", async () => {
    mockPrismaClient.booking.findUnique.mockResolvedValue({
      ...mockBooking,
      status: "ACCEPTED",
      eventType: { userId: "demo-user-id" },
    });
    mockPrismaClient.booking.update.mockResolvedValue({ ...mockBooking, status: "CANCELLED" });

    const request = makeRequest({ action: "cancel" });
    const response = await patchBooking(request, makeContext("booking-uid-001"));

    expect(response.status).toBe(200);
  });

  it("returns 409 for invalid status transition (CANCELLED → ACCEPTED)", async () => {
    mockPrismaClient.booking.findUnique.mockResolvedValue({
      ...mockBooking,
      status: "CANCELLED",
      eventType: { userId: "demo-user-id" },
    });

    const request = makeRequest({ action: "accept" });
    const response = await patchBooking(request, makeContext("booking-uid-001"));

    expect(response.status).toBe(409);
  });

  it("returns 404 for non-existent booking", async () => {
    mockPrismaClient.booking.findUnique.mockResolvedValue(null);

    const request = makeRequest({ action: "cancel" });
    const response = await patchBooking(request, makeContext("nonexistent"));

    expect(response.status).toBe(404);
  });

  it("returns 400 for invalid action", async () => {
    const request = makeRequest({ action: "invalid-action" });
    const response = await patchBooking(request, makeContext());
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeTruthy();
  });
});

// ─── PUT /api/bookings/[uid] — Reschedule ───────────────────────────────────

describe("PUT /api/bookings/[uid] (reschedule)", () => {
  it("reschedules booking to new time slot", async () => {
    mockPrismaClient.booking.findUnique.mockResolvedValue({
      ...mockBooking,
      status: "ACCEPTED",
      eventTypeId: EVENT_TYPE_CUID,
      eventType: {
        ...mockBooking.eventType,
        duration: 30,
        requiresConfirmation: false,
        schedule: null,
      },
    });

    vi.mocked(getAvailableSlots).mockResolvedValue([
      { time: "2026-03-11T14:00:00.000Z", localTime: "09:00", duration: 30 },
    ]);

    mockPrismaClient.$transaction.mockImplementation(async (ops: unknown[]) => {
      return Promise.all(ops.map((op) => Promise.resolve(op)));
    });
    mockPrismaClient.booking.update.mockResolvedValue({ ...mockBooking, status: "RESCHEDULED" });
    mockPrismaClient.booking.create.mockResolvedValue({
      ...mockBooking,
      uid: "new-booking-uid",
      startTime: new Date("2026-03-11T14:00:00Z"),
      status: "ACCEPTED",
    });

    const request = makeRequest({ startTime: "2026-03-11T14:00:00.000Z" });
    const response = await putBooking(request, makeContext("booking-uid-001"));

    expect(response.status).toBe(201);
  });

  it("returns 400 for invalid reschedule input", async () => {
    const request = makeRequest({ startTime: "not-a-date" });
    const response = await putBooking(request, makeContext("booking-uid-001"));

    expect(response.status).toBe(400);
  });
});
