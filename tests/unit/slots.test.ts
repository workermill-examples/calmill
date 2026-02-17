import { describe, it, expect } from "vitest";
import { mockPrismaClient } from "../helpers/setup";

const { getAvailableSlots } = await import("@/lib/slots");

// ─── FIXTURES ───────────────────────────────────────────────────────────────

const baseEventType = {
  id: "event-type-id-1",
  title: "30 Minute Meeting",
  slug: "30min",
  duration: 30,
  isActive: true,
  requiresConfirmation: false,
  price: 0,
  currency: "USD",
  userId: "demo-user-id",
  scheduleId: "schedule-id-1",
  minimumNotice: 0, // no minimum notice for most tests
  futureLimit: 60,
  beforeBuffer: 0,
  afterBuffer: 0,
  slotInterval: null, // use duration as interval
  maxBookingsPerDay: null,
  maxBookingsPerWeek: null,
  recurringEnabled: false,
  recurringMaxOccurrences: null,
  recurringFrequency: null,
  description: null,
  locations: [],
  customQuestions: null,
  color: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  teamId: null,
  schedulingType: null,
  successRedirectUrl: null,
  schedule: {
    id: "schedule-id-1",
    name: "Business Hours",
    timezone: "America/New_York",
    userId: "demo-user-id",
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    availability: [
      // Monday (1) 09:00-17:00 America/New_York
      { id: "avail-mon", day: 1, startTime: "09:00", endTime: "17:00", scheduleId: "schedule-id-1" },
      { id: "avail-tue", day: 2, startTime: "09:00", endTime: "17:00", scheduleId: "schedule-id-1" },
      { id: "avail-wed", day: 3, startTime: "09:00", endTime: "17:00", scheduleId: "schedule-id-1" },
      { id: "avail-thu", day: 4, startTime: "09:00", endTime: "17:00", scheduleId: "schedule-id-1" },
      { id: "avail-fri", day: 5, startTime: "09:00", endTime: "17:00", scheduleId: "schedule-id-1" },
    ],
    dateOverrides: [] as Array<{ id: string; scheduleId: string; date: Date; isUnavailable: boolean; startTime: string | null; endTime: string | null }>,
  },
};

// A known Monday for deterministic tests: 2026-02-23 (UTC)
const TEST_MONDAY = "2026-02-23";
const TEST_TIMEZONE = "America/New_York";

function setupMocks(eventType: unknown = baseEventType, existingBookings: unknown[] = []) {
  mockPrismaClient.eventType.findUnique.mockResolvedValue(eventType);
  mockPrismaClient.booking.findMany.mockResolvedValue(existingBookings);
}

// ─── BASIC SLOT GENERATION ───────────────────────────────────────────────────

describe("getAvailableSlots — basic generation", () => {
  it("returns slots for a single weekday", async () => {
    setupMocks();

    const slots = await getAvailableSlots({
      eventTypeId: "event-type-id-1",
      startDate: TEST_MONDAY,
      endDate: TEST_MONDAY,
      timezone: TEST_TIMEZONE,
    });

    expect(slots.length).toBeGreaterThan(0);
    // 09:00 to 17:00, 30 min slots = 16 slots
    expect(slots.length).toBe(16);
    expect(slots[0]!.duration).toBe(30);
    expect(slots[0]!.time).toBeTruthy(); // ISO 8601 UTC
    expect(slots[0]!.localTime).toMatch(/^\d{2}:\d{2}$/);
  });

  it("returns empty array for unknown event type", async () => {
    mockPrismaClient.eventType.findUnique.mockResolvedValue(null);
    mockPrismaClient.booking.findMany.mockResolvedValue([]);

    const slots = await getAvailableSlots({
      eventTypeId: "nonexistent",
      startDate: TEST_MONDAY,
      endDate: TEST_MONDAY,
      timezone: TEST_TIMEZONE,
    });

    expect(slots).toHaveLength(0);
  });

  it("returns empty array for event type without schedule", async () => {
    mockPrismaClient.eventType.findUnique.mockResolvedValue({
      ...baseEventType,
      schedule: null,
    });
    mockPrismaClient.booking.findMany.mockResolvedValue([]);

    const slots = await getAvailableSlots({
      eventTypeId: "event-type-id-1",
      startDate: TEST_MONDAY,
      endDate: TEST_MONDAY,
      timezone: TEST_TIMEZONE,
    });

    expect(slots).toHaveLength(0);
  });

  it("returns no slots on weekends when availability is Mon-Fri only", async () => {
    setupMocks();

    // Sunday 2026-02-22
    const slots = await getAvailableSlots({
      eventTypeId: "event-type-id-1",
      startDate: "2026-02-22",
      endDate: "2026-02-22",
      timezone: TEST_TIMEZONE,
    });

    expect(slots).toHaveLength(0);
  });

  it("uses slotInterval when specified instead of duration", async () => {
    setupMocks({ ...baseEventType, slotInterval: 15, duration: 30 });

    const slots = await getAvailableSlots({
      eventTypeId: "event-type-id-1",
      startDate: TEST_MONDAY,
      endDate: TEST_MONDAY,
      timezone: TEST_TIMEZONE,
    });

    // 09:00-17:00 with 15min interval, 30min duration: slots at 09:00, 09:15, 09:30, ... 16:30 = 31 slots
    expect(slots.length).toBe(31);
  });
});

// ─── BUFFER TIMES ────────────────────────────────────────────────────────────

describe("getAvailableSlots — buffer times", () => {
  it("does not generate slot that conflicts with booking + afterBuffer", async () => {
    // Booking from 10:00-10:30, afterBuffer=30min → blocks 10:00-11:00
    // So slot at 10:00 (conflicts) and 10:30 (starts during buffer) should be blocked
    const bookingStart = new Date("2026-02-23T15:00:00Z"); // 10:00 AM EST
    const bookingEnd = new Date("2026-02-23T15:30:00Z"); // 10:30 AM EST

    setupMocks(
      { ...baseEventType, afterBuffer: 30 },
      [{ startTime: bookingStart, endTime: bookingEnd }]
    );

    const slots = await getAvailableSlots({
      eventTypeId: "event-type-id-1",
      startDate: TEST_MONDAY,
      endDate: TEST_MONDAY,
      timezone: TEST_TIMEZONE,
    });

    // Slot at 10:00 AM EST = 15:00 UTC should NOT appear
    const slotTimes = slots.map((s) => s.time);
    expect(slotTimes).not.toContain("2026-02-23T15:00:00.000Z");
    // Slot at 10:30 AM EST = 15:30 UTC should NOT appear (starts during booking + buffer)
    expect(slotTimes).not.toContain("2026-02-23T15:30:00.000Z");
  });

  it("blocks slot that starts within beforeBuffer of an existing booking", async () => {
    // Booking from 11:00-11:30, beforeBuffer=15min → blocked zone starts at 10:45
    const bookingStart = new Date("2026-02-23T16:00:00Z"); // 11:00 AM EST
    const bookingEnd = new Date("2026-02-23T16:30:00Z"); // 11:30 AM EST

    setupMocks(
      { ...baseEventType, beforeBuffer: 15 },
      [{ startTime: bookingStart, endTime: bookingEnd }]
    );

    const slots = await getAvailableSlots({
      eventTypeId: "event-type-id-1",
      startDate: TEST_MONDAY,
      endDate: TEST_MONDAY,
      timezone: TEST_TIMEZONE,
    });

    // Slot at 11:00 AM EST = 16:00 UTC should NOT appear (conflicts with booking)
    const slotTimes = slots.map((s) => s.time);
    expect(slotTimes).not.toContain("2026-02-23T16:00:00.000Z");
  });
});

// ─── MINIMUM NOTICE ──────────────────────────────────────────────────────────

describe("getAvailableSlots — minimum notice", () => {
  it("filters out slots within minimum notice window", async () => {
    // Use a very large minimum notice (9999 hours) to block all near-future slots
    setupMocks({ ...baseEventType, minimumNotice: 9999 * 60 }); // 9999 hours in minutes

    const slots = await getAvailableSlots({
      eventTypeId: "event-type-id-1",
      startDate: TEST_MONDAY,
      endDate: TEST_MONDAY,
      timezone: TEST_TIMEZONE,
    });

    // All slots should be filtered out since minimumNotice pushes beyond 60-day futureLimit
    expect(slots).toHaveLength(0);
  });
});

// ─── FUTURE LIMIT ────────────────────────────────────────────────────────────

describe("getAvailableSlots — future limit", () => {
  it("returns empty for date range beyond futureLimit", async () => {
    setupMocks({ ...baseEventType, futureLimit: 1 }); // only 1 day in future

    // 30 days from now
    const farFuture = new Date();
    farFuture.setDate(farFuture.getDate() + 30);
    const farFutureDate = farFuture.toISOString().slice(0, 10);

    const slots = await getAvailableSlots({
      eventTypeId: "event-type-id-1",
      startDate: farFutureDate,
      endDate: farFutureDate,
      timezone: TEST_TIMEZONE,
    });

    expect(slots).toHaveLength(0);
  });
});

// ─── DATE OVERRIDES ──────────────────────────────────────────────────────────

describe("getAvailableSlots — date overrides", () => {
  it("returns empty slots for day marked as unavailable", async () => {
    const eventTypeWithOverride = {
      ...baseEventType,
      schedule: {
        ...baseEventType.schedule,
        dateOverrides: [
          {
            id: "override-1",
            scheduleId: "schedule-id-1",
            date: new Date("2026-02-23T05:00:00Z"),
            isUnavailable: true,
            startTime: null,
            endTime: null,
          },
        ],
      },
    };
    setupMocks(eventTypeWithOverride);

    const slots = await getAvailableSlots({
      eventTypeId: "event-type-id-1",
      startDate: TEST_MONDAY,
      endDate: TEST_MONDAY,
      timezone: TEST_TIMEZONE,
    });

    expect(slots).toHaveLength(0);
  });

  it("uses override startTime/endTime when provided", async () => {
    const eventTypeWithOverride = {
      ...baseEventType,
      schedule: {
        ...baseEventType.schedule,
        dateOverrides: [
          {
            id: "override-1",
            scheduleId: "schedule-id-1",
            date: new Date("2026-02-23T05:00:00Z"),
            isUnavailable: false,
            startTime: "10:00",
            endTime: "12:00",
          },
        ],
      },
    };
    setupMocks(eventTypeWithOverride);

    const slots = await getAvailableSlots({
      eventTypeId: "event-type-id-1",
      startDate: TEST_MONDAY,
      endDate: TEST_MONDAY,
      timezone: TEST_TIMEZONE,
    });

    // 10:00-12:00 with 30min slots = 4 slots
    expect(slots.length).toBe(4);
  });
});

// ─── DAILY BOOKING LIMITS ────────────────────────────────────────────────────

describe("getAvailableSlots — daily booking limits", () => {
  it("returns no slots when daily limit is reached", async () => {
    const bookingStart = new Date("2026-02-23T14:00:00Z"); // 9:00 AM EST
    const bookingEnd = new Date("2026-02-23T14:30:00Z"); // 9:30 AM EST

    setupMocks(
      { ...baseEventType, maxBookingsPerDay: 1 },
      [{ startTime: bookingStart, endTime: bookingEnd }]
    );

    const slots = await getAvailableSlots({
      eventTypeId: "event-type-id-1",
      startDate: TEST_MONDAY,
      endDate: TEST_MONDAY,
      timezone: TEST_TIMEZONE,
    });

    expect(slots).toHaveLength(0);
  });

  it("returns slots when daily limit is not yet reached", async () => {
    const bookingStart = new Date("2026-02-23T14:00:00Z");
    const bookingEnd = new Date("2026-02-23T14:30:00Z");

    setupMocks(
      { ...baseEventType, maxBookingsPerDay: 5 },
      [{ startTime: bookingStart, endTime: bookingEnd }]
    );

    const slots = await getAvailableSlots({
      eventTypeId: "event-type-id-1",
      startDate: TEST_MONDAY,
      endDate: TEST_MONDAY,
      timezone: TEST_TIMEZONE,
    });

    expect(slots.length).toBeGreaterThan(0);
  });
});

// ─── WEEKLY BOOKING LIMITS ───────────────────────────────────────────────────

describe("getAvailableSlots — weekly booking limits", () => {
  it("returns no slots when weekly limit is reached", async () => {
    // 5 bookings on Monday
    const bookings = Array.from({ length: 5 }, (_, i) => ({
      startTime: new Date(`2026-02-23T${14 + i}:00:00Z`),
      endTime: new Date(`2026-02-23T${14 + i}:30:00Z`),
    }));

    setupMocks(
      { ...baseEventType, maxBookingsPerWeek: 5 },
      bookings
    );

    const slots = await getAvailableSlots({
      eventTypeId: "event-type-id-1",
      startDate: TEST_MONDAY,
      endDate: TEST_MONDAY,
      timezone: TEST_TIMEZONE,
    });

    expect(slots).toHaveLength(0);
  });
});

// ─── MULTI-DAY RANGE ─────────────────────────────────────────────────────────

describe("getAvailableSlots — multi-day range", () => {
  it("returns slots for a full week (Mon-Fri)", async () => {
    setupMocks();

    const slots = await getAvailableSlots({
      eventTypeId: "event-type-id-1",
      startDate: "2026-02-23", // Monday
      endDate: "2026-02-27", // Friday
      timezone: TEST_TIMEZONE,
    });

    // 5 days × 16 slots = 80 slots
    expect(slots.length).toBe(80);
  });

  it("excludes weekends from a full week range", async () => {
    setupMocks();

    const slots = await getAvailableSlots({
      eventTypeId: "event-type-id-1",
      startDate: "2026-02-22", // Sunday
      endDate: "2026-02-28", // Saturday
      timezone: TEST_TIMEZONE,
    });

    // Only Mon-Fri, 5 days × 16 slots = 80 slots
    expect(slots.length).toBe(80);
  });
});

// ─── BOOKING CONFLICTS ───────────────────────────────────────────────────────

describe("getAvailableSlots — booking conflicts", () => {
  it("removes slot that exactly overlaps existing booking", async () => {
    const bookingStart = new Date("2026-02-23T14:00:00Z"); // 9:00 AM EST
    const bookingEnd = new Date("2026-02-23T14:30:00Z"); // 9:30 AM EST

    setupMocks(baseEventType, [{ startTime: bookingStart, endTime: bookingEnd }]);

    const slots = await getAvailableSlots({
      eventTypeId: "event-type-id-1",
      startDate: TEST_MONDAY,
      endDate: TEST_MONDAY,
      timezone: TEST_TIMEZONE,
    });

    // 9:00 AM slot should be removed
    const slotTimes = slots.map((s) => s.time);
    expect(slotTimes).not.toContain("2026-02-23T14:00:00.000Z");
    // But other slots remain
    expect(slots.length).toBe(15);
  });

  it("includes slot that starts after booking ends", async () => {
    const bookingStart = new Date("2026-02-23T14:00:00Z"); // 9:00 AM EST
    const bookingEnd = new Date("2026-02-23T14:30:00Z"); // 9:30 AM EST

    setupMocks(baseEventType, [{ startTime: bookingStart, endTime: bookingEnd }]);

    const slots = await getAvailableSlots({
      eventTypeId: "event-type-id-1",
      startDate: TEST_MONDAY,
      endDate: TEST_MONDAY,
      timezone: TEST_TIMEZONE,
    });

    // 9:30 AM slot should be included (starts exactly when booking ends)
    const slotTimes = slots.map((s) => s.time);
    expect(slotTimes).toContain("2026-02-23T14:30:00.000Z");
  });
});

// ─── TIMEZONE HANDLING ───────────────────────────────────────────────────────

describe("getAvailableSlots — timezone handling", () => {
  it("returns localTime in attendee's timezone", async () => {
    setupMocks();

    const slots = await getAvailableSlots({
      eventTypeId: "event-type-id-1",
      startDate: TEST_MONDAY,
      endDate: TEST_MONDAY,
      timezone: TEST_TIMEZONE, // America/New_York
    });

    // First slot should be 9:00 AM in Eastern Time
    expect(slots[0]!.localTime).toBe("09:00");
  });

  it("returns different localTime for attendee in different timezone", async () => {
    setupMocks();

    const slots = await getAvailableSlots({
      eventTypeId: "event-type-id-1",
      startDate: TEST_MONDAY,
      endDate: TEST_MONDAY,
      timezone: "America/Los_Angeles", // Pacific time (3h behind EST)
    });

    // First slot at 9:00 AM EST = 6:00 AM PST
    expect(slots[0]!.localTime).toBe("06:00");
  });

  it("returns UTC time in the time field", async () => {
    setupMocks();

    const slots = await getAvailableSlots({
      eventTypeId: "event-type-id-1",
      startDate: TEST_MONDAY,
      endDate: TEST_MONDAY,
      timezone: TEST_TIMEZONE,
    });

    // 9:00 AM EST = 14:00 UTC in February (EST = UTC-5)
    expect(slots[0]!.time).toBe("2026-02-23T14:00:00.000Z");
  });
});
