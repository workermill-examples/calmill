import { describe, it, expect, vi } from "vitest";
import { mockPrismaClient } from "../helpers/setup";

// Mock prisma before importing slots.ts (which imports prisma at module level)
vi.mock("@/lib/prisma", () => ({
  prisma: mockPrismaClient,
}));

// Import the exported helpers from slots.ts directly
import { isSlotConflicting, generateSlotsForWindow } from "@/lib/slots";
import { slotQuerySchema } from "@/lib/validations";

// ─── TYPE HELPERS ────────────────────────────────────────────────────────────

type ExistingBooking = {
  startTime: Date;
  endTime: Date;
};

type EventTypeConstraints = {
  duration: number;
  slotInterval: number | null;
  beforeBuffer: number;
  afterBuffer: number;
  minimumNotice: number;
  maxBookingsPerDay: number | null;
  maxBookingsPerWeek: number | null;
};

// ─── isSlotConflicting ───────────────────────────────────────────────────────

describe("isSlotConflicting", () => {
  it("returns false when no existing bookings", () => {
    const slotStart = new Date("2026-03-10T10:00:00Z");
    const slotEnd = new Date("2026-03-10T10:30:00Z");

    expect(isSlotConflicting(slotStart, slotEnd, [], 0, 0)).toBe(false);
  });

  it("returns true when slot directly overlaps a booking", () => {
    const slotStart = new Date("2026-03-10T10:00:00Z");
    const slotEnd = new Date("2026-03-10T10:30:00Z");
    const booking: ExistingBooking = {
      startTime: new Date("2026-03-10T10:15:00Z"),
      endTime: new Date("2026-03-10T10:45:00Z"),
    };

    expect(isSlotConflicting(slotStart, slotEnd, [booking], 0, 0)).toBe(true);
  });

  it("returns false when slot ends exactly when booking starts (no overlap)", () => {
    // Adjacent slots: slot [10:00, 10:30], booking [10:30, 11:00]
    const slotStart = new Date("2026-03-10T10:00:00Z");
    const slotEnd = new Date("2026-03-10T10:30:00Z");
    const booking: ExistingBooking = {
      startTime: new Date("2026-03-10T10:30:00Z"),
      endTime: new Date("2026-03-10T11:00:00Z"),
    };

    expect(isSlotConflicting(slotStart, slotEnd, [booking], 0, 0)).toBe(false);
  });

  it("returns false when slot starts exactly when booking ends (no overlap)", () => {
    // Adjacent slots: booking [09:30, 10:00], slot [10:00, 10:30]
    const slotStart = new Date("2026-03-10T10:00:00Z");
    const slotEnd = new Date("2026-03-10T10:30:00Z");
    const booking: ExistingBooking = {
      startTime: new Date("2026-03-10T09:30:00Z"),
      endTime: new Date("2026-03-10T10:00:00Z"),
    };

    expect(isSlotConflicting(slotStart, slotEnd, [booking], 0, 0)).toBe(false);
  });

  it("correctly applies beforeBuffer only to the existing booking (not the candidate slot)", () => {
    // With 15-min beforeBuffer: booking [10:30, 11:00] → blocked zone [10:15, 11:00]
    // Slot [10:00, 10:30]: slotStart(10:00) < blockedEnd(11:00) AND blockedStart(10:15) < slotEnd(10:30) → CONFLICT
    const slotStart = new Date("2026-03-10T10:00:00Z");
    const slotEnd = new Date("2026-03-10T10:30:00Z");
    const booking: ExistingBooking = {
      startTime: new Date("2026-03-10T10:30:00Z"),
      endTime: new Date("2026-03-10T11:00:00Z"),
    };

    expect(isSlotConflicting(slotStart, slotEnd, [booking], 15, 0)).toBe(true);
  });

  it("correctly applies afterBuffer only to the existing booking (not the candidate slot)", () => {
    // With 15-min afterBuffer: booking [09:00, 09:30] → blocked zone [09:00, 09:45]
    // Slot [09:30, 10:00]: slotStart(09:30) < blockedEnd(09:45) → CONFLICT
    const slotStart = new Date("2026-03-10T09:30:00Z");
    const slotEnd = new Date("2026-03-10T10:00:00Z");
    const booking: ExistingBooking = {
      startTime: new Date("2026-03-10T09:00:00Z"),
      endTime: new Date("2026-03-10T09:30:00Z"),
    };

    expect(isSlotConflicting(slotStart, slotEnd, [booking], 0, 15)).toBe(true);
  });

  it("does NOT double-buffer: 15-min buffer should block exactly 15 min, not 30 min", () => {
    // Booking [10:30, 11:00] with 15-min beforeBuffer → blocked zone starts at 10:15
    // Slot [09:45, 10:15]: slotStart(09:45) < blockedEnd(11:00) AND blockedStart(10:15) < slotEnd(10:15)?
    // blockedStart(10:15) is NOT < slotEnd(10:15) → NO CONFLICT
    const slotStart = new Date("2026-03-10T09:45:00Z");
    const slotEnd = new Date("2026-03-10T10:15:00Z");
    const booking: ExistingBooking = {
      startTime: new Date("2026-03-10T10:30:00Z"),
      endTime: new Date("2026-03-10T11:00:00Z"),
    };

    // The slot ends at exactly the start of the buffer zone → no conflict (boundary exclusive)
    expect(isSlotConflicting(slotStart, slotEnd, [booking], 15, 0)).toBe(false);
  });

  it("handles 15-min afterBuffer: slot just after the buffer zone is valid", () => {
    // Booking [09:00, 09:30] with 15-min afterBuffer → blocked zone ends at 09:45
    // Slot [09:45, 10:15]: blockedStart(09:00) < slotEnd(10:15) AND slotStart(09:45) < blockedEnd(09:45)?
    // slotStart(09:45) is NOT < blockedEnd(09:45) → NO CONFLICT
    const slotStart = new Date("2026-03-10T09:45:00Z");
    const slotEnd = new Date("2026-03-10T10:15:00Z");
    const booking: ExistingBooking = {
      startTime: new Date("2026-03-10T09:00:00Z"),
      endTime: new Date("2026-03-10T09:30:00Z"),
    };

    expect(isSlotConflicting(slotStart, slotEnd, [booking], 0, 15)).toBe(false);
  });

  it("returns true when slot is fully contained within a booking", () => {
    const slotStart = new Date("2026-03-10T10:05:00Z");
    const slotEnd = new Date("2026-03-10T10:25:00Z");
    const booking: ExistingBooking = {
      startTime: new Date("2026-03-10T10:00:00Z"),
      endTime: new Date("2026-03-10T11:00:00Z"),
    };

    expect(isSlotConflicting(slotStart, slotEnd, [booking], 0, 0)).toBe(true);
  });

  it("handles multiple bookings — returns true if ANY conflict", () => {
    const slotStart = new Date("2026-03-10T14:00:00Z");
    const slotEnd = new Date("2026-03-10T14:30:00Z");
    const bookings: ExistingBooking[] = [
      { startTime: new Date("2026-03-10T10:00:00Z"), endTime: new Date("2026-03-10T10:30:00Z") },
      { startTime: new Date("2026-03-10T14:15:00Z"), endTime: new Date("2026-03-10T14:45:00Z") }, // conflicts
    ];

    expect(isSlotConflicting(slotStart, slotEnd, bookings, 0, 0)).toBe(true);
  });

  it("handles both before and after buffers simultaneously", () => {
    // Booking [11:00, 11:30] with 10-min before + 10-min after → blocked zone [10:50, 11:40]
    // Slot [10:30, 11:00]: slotStart(10:30) < blockedEnd(11:40) AND blockedStart(10:50) < slotEnd(11:00) → CONFLICT
    const slotStart = new Date("2026-03-10T10:30:00Z");
    const slotEnd = new Date("2026-03-10T11:00:00Z");
    const booking: ExistingBooking = {
      startTime: new Date("2026-03-10T11:00:00Z"),
      endTime: new Date("2026-03-10T11:30:00Z"),
    };

    expect(isSlotConflicting(slotStart, slotEnd, [booking], 10, 10)).toBe(true);
  });
});

// ─── generateSlotsForWindow ──────────────────────────────────────────────────

describe("generateSlotsForWindow", () => {
  const baseEventType: EventTypeConstraints = {
    duration: 30,
    slotInterval: null,
    beforeBuffer: 0,
    afterBuffer: 0,
    minimumNotice: 0,
    maxBookingsPerDay: null,
    maxBookingsPerWeek: null,
  };

  // A fixed "now" in the past so all slots are in the future
  const fixedNow = new Date("2026-03-10T00:00:00Z");
  const fixedFutureLimit = new Date("2026-06-10T00:00:00Z");

  it("generates slots for a 2-hour window with 30-min duration", () => {
    const window = {
      start: new Date("2026-03-10T09:00:00Z"),
      end: new Date("2026-03-10T11:00:00Z"),
    };

    const slots = generateSlotsForWindow({
      window,
      eventType: baseEventType,
      existingBookings: [],
      bookingsThisDay: [],
      bookingsThisWeek: [],
      now: fixedNow,
      futureLimitDate: fixedFutureLimit,
      attendeeTimezone: "UTC",
    });

    expect(slots).toHaveLength(4); // 09:00, 09:30, 10:00, 10:30
    expect(slots[0]!.time).toBe("2026-03-10T09:00:00.000Z");
    expect(slots[3]!.time).toBe("2026-03-10T10:30:00.000Z");
  });

  it("uses slotInterval when set (different from duration)", () => {
    // 30-min duration with 15-min slot interval → more slots
    const window = {
      start: new Date("2026-03-10T09:00:00Z"),
      end: new Date("2026-03-10T11:00:00Z"),
    };

    const slots = generateSlotsForWindow({
      window,
      eventType: { ...baseEventType, slotInterval: 15 },
      existingBookings: [],
      bookingsThisDay: [],
      bookingsThisWeek: [],
      now: fixedNow,
      futureLimitDate: fixedFutureLimit,
      attendeeTimezone: "UTC",
    });

    // 09:00, 09:15, 09:30, 09:45, 10:00, 10:15, 10:30
    expect(slots).toHaveLength(7);
    expect(slots[0]!.time).toBe("2026-03-10T09:00:00.000Z");
    expect(slots[1]!.time).toBe("2026-03-10T09:15:00.000Z");
  });

  it("excludes slots in the past (minimum notice = 0, but slot is before now)", () => {
    // Window is in the past
    const window = {
      start: new Date("2026-03-09T09:00:00Z"), // yesterday
      end: new Date("2026-03-09T11:00:00Z"),
    };

    const slots = generateSlotsForWindow({
      window,
      eventType: baseEventType,
      existingBookings: [],
      bookingsThisDay: [],
      bookingsThisWeek: [],
      now: new Date("2026-03-10T10:00:00Z"), // now = today
      futureLimitDate: fixedFutureLimit,
      attendeeTimezone: "UTC",
    });

    expect(slots).toHaveLength(0);
  });

  it("enforces minimum notice", () => {
    // minimumNotice = 60 min; now = 09:00; slots at 09:00 and 09:30 should be excluded
    const now = new Date("2026-03-10T09:00:00Z");
    const window = {
      start: new Date("2026-03-10T09:00:00Z"),
      end: new Date("2026-03-10T11:00:00Z"),
    };

    const slots = generateSlotsForWindow({
      window,
      eventType: { ...baseEventType, minimumNotice: 60 },
      existingBookings: [],
      bookingsThisDay: [],
      bookingsThisWeek: [],
      now,
      futureLimitDate: fixedFutureLimit,
      attendeeTimezone: "UTC",
    });

    // Slots at 09:00 (starts == now, fails 60-min notice) and 09:30 (starts 30 min from now, fails) excluded
    // 10:00 is exactly 60 min from now → passes (>= 60 min notice), 10:30 also passes
    const slotTimes = slots.map((s) => s.time);
    expect(slotTimes).not.toContain("2026-03-10T09:00:00.000Z");
    expect(slotTimes).not.toContain("2026-03-10T09:30:00.000Z");
    expect(slotTimes).toContain("2026-03-10T10:00:00.000Z");
  });

  it("excludes slots that conflict with existing bookings", () => {
    const window = {
      start: new Date("2026-03-10T09:00:00Z"),
      end: new Date("2026-03-10T12:00:00Z"),
    };
    const existingBookings = [
      {
        startTime: new Date("2026-03-10T10:00:00Z"),
        endTime: new Date("2026-03-10T10:30:00Z"),
      },
    ];

    const slots = generateSlotsForWindow({
      window,
      eventType: baseEventType,
      existingBookings,
      bookingsThisDay: existingBookings,
      bookingsThisWeek: existingBookings,
      now: fixedNow,
      futureLimitDate: fixedFutureLimit,
      attendeeTimezone: "UTC",
    });

    const slotTimes = slots.map((s) => s.time);
    expect(slotTimes).not.toContain("2026-03-10T10:00:00.000Z");
    expect(slotTimes).toContain("2026-03-10T09:00:00.000Z");
    expect(slotTimes).toContain("2026-03-10T10:30:00.000Z");
  });

  it("respects maxBookingsPerDay limit", () => {
    const window = {
      start: new Date("2026-03-10T09:00:00Z"),
      end: new Date("2026-03-10T12:00:00Z"),
    };
    // Already 2 bookings this day, limit is 2
    const bookingsThisDay = [
      { startTime: new Date("2026-03-10T08:00:00Z"), endTime: new Date("2026-03-10T08:30:00Z") },
      { startTime: new Date("2026-03-10T08:30:00Z"), endTime: new Date("2026-03-10T09:00:00Z") },
    ];

    const slots = generateSlotsForWindow({
      window,
      eventType: { ...baseEventType, maxBookingsPerDay: 2 },
      existingBookings: bookingsThisDay,
      bookingsThisDay,
      bookingsThisWeek: bookingsThisDay,
      now: fixedNow,
      futureLimitDate: fixedFutureLimit,
      attendeeTimezone: "UTC",
    });

    expect(slots).toHaveLength(0);
  });

  it("respects maxBookingsPerWeek limit", () => {
    const window = {
      start: new Date("2026-03-10T09:00:00Z"),
      end: new Date("2026-03-10T12:00:00Z"),
    };
    // Already 5 bookings this week, limit is 5
    const bookingsThisWeek = Array.from({ length: 5 }, (_, i) => ({
      startTime: new Date(`2026-03-0${i + 2}T09:00:00Z`),
      endTime: new Date(`2026-03-0${i + 2}T09:30:00Z`),
    }));

    const slots = generateSlotsForWindow({
      window,
      eventType: { ...baseEventType, maxBookingsPerWeek: 5 },
      existingBookings: [],
      bookingsThisDay: [],
      bookingsThisWeek,
      now: fixedNow,
      futureLimitDate: fixedFutureLimit,
      attendeeTimezone: "UTC",
    });

    expect(slots).toHaveLength(0);
  });

  it("stops generating slots beyond the future limit date", () => {
    const window = {
      start: new Date("2026-03-10T09:00:00Z"),
      end: new Date("2026-03-10T12:00:00Z"),
    };
    // futureLimit is before the window
    const futureLimitDate = new Date("2026-03-10T09:45:00Z");

    const slots = generateSlotsForWindow({
      window,
      eventType: baseEventType,
      existingBookings: [],
      bookingsThisDay: [],
      bookingsThisWeek: [],
      now: fixedNow,
      futureLimitDate,
      attendeeTimezone: "UTC",
    });

    // Only slots starting <= futureLimitDate: 09:00 and 09:30
    expect(slots).toHaveLength(2);
    expect(slots[0]!.time).toBe("2026-03-10T09:00:00.000Z");
    expect(slots[1]!.time).toBe("2026-03-10T09:30:00.000Z");
  });

  it("returns localTime in the attendee's timezone", () => {
    // 2026-03-10 is after US DST spring forward (2nd Sunday Mar 2026 = Mar 8)
    // So America/New_York is EDT (UTC-4) on 2026-03-10
    // 15:00 UTC = 11:00 EDT
    const window = {
      start: new Date("2026-03-10T15:00:00Z"), // 11:00 America/New_York (EDT = UTC-4)
      end: new Date("2026-03-10T15:30:00Z"),
    };

    const slots = generateSlotsForWindow({
      window,
      eventType: baseEventType,
      existingBookings: [],
      bookingsThisDay: [],
      bookingsThisWeek: [],
      now: fixedNow,
      futureLimitDate: fixedFutureLimit,
      attendeeTimezone: "America/New_York",
    });

    expect(slots).toHaveLength(1);
    expect(slots[0]!.localTime).toBe("11:00"); // 15:00 UTC = 11:00 EDT (spring forward in effect)
    expect(slots[0]!.duration).toBe(30);
  });

  it("includes duration in each slot object", () => {
    const window = {
      start: new Date("2026-03-10T09:00:00Z"),
      end: new Date("2026-03-10T09:45:00Z"),
    };

    const slots = generateSlotsForWindow({
      window,
      eventType: { ...baseEventType, duration: 45 },
      existingBookings: [],
      bookingsThisDay: [],
      bookingsThisWeek: [],
      now: fixedNow,
      futureLimitDate: fixedFutureLimit,
      attendeeTimezone: "UTC",
    });

    expect(slots).toHaveLength(1);
    expect(slots[0]!.duration).toBe(45);
  });

  it("does not generate a slot if it would extend beyond the window end", () => {
    // 30-min duration, window ends at 10:45 → slot at 10:30 would end at 11:00, excluded
    const window = {
      start: new Date("2026-03-10T09:00:00Z"),
      end: new Date("2026-03-10T10:45:00Z"),
    };

    const slots = generateSlotsForWindow({
      window,
      eventType: baseEventType, // 30-min duration
      existingBookings: [],
      bookingsThisDay: [],
      bookingsThisWeek: [],
      now: fixedNow,
      futureLimitDate: fixedFutureLimit,
      attendeeTimezone: "UTC",
    });

    // 09:00, 09:30, 10:00 → 10:30 would end at 11:00 > 10:45, excluded
    expect(slots).toHaveLength(3);
    const lastSlot = slots[slots.length - 1]!;
    expect(lastSlot.time).toBe("2026-03-10T10:00:00.000Z");
  });

  it("handles buffer times when checking booking conflicts", () => {
    // With 15-min afterBuffer: booking [09:30, 10:00] blocks until 10:15
    // Slot [10:00, 10:30] should be excluded due to afterBuffer
    const window = {
      start: new Date("2026-03-10T09:00:00Z"),
      end: new Date("2026-03-10T11:00:00Z"),
    };
    const existingBookings = [
      {
        startTime: new Date("2026-03-10T09:30:00Z"),
        endTime: new Date("2026-03-10T10:00:00Z"),
      },
    ];

    const slots = generateSlotsForWindow({
      window,
      eventType: { ...baseEventType, afterBuffer: 15 },
      existingBookings,
      bookingsThisDay: existingBookings,
      bookingsThisWeek: existingBookings,
      now: fixedNow,
      futureLimitDate: fixedFutureLimit,
      attendeeTimezone: "UTC",
    });

    const slotTimes = slots.map((s) => s.time);
    expect(slotTimes).not.toContain("2026-03-10T10:00:00.000Z"); // conflicts with afterBuffer
    expect(slotTimes).toContain("2026-03-10T10:30:00.000Z"); // 10:30 is after blocked zone
  });

  it("returns empty array for an empty window (start == end)", () => {
    const window = {
      start: new Date("2026-03-10T10:00:00Z"),
      end: new Date("2026-03-10T10:00:00Z"),
    };

    const slots = generateSlotsForWindow({
      window,
      eventType: baseEventType,
      existingBookings: [],
      bookingsThisDay: [],
      bookingsThisWeek: [],
      now: fixedNow,
      futureLimitDate: fixedFutureLimit,
      attendeeTimezone: "UTC",
    });

    expect(slots).toHaveLength(0);
  });

  it("handles DST transition (UTC time is authoritative, no DST issues in UTC)", () => {
    // This test verifies that UTC slot times are correct regardless of attendee timezone DST
    // US clocks spring forward on 2026-03-08 at 02:00 → 03:00
    // On this date, 09:00 EDT = 13:00 UTC (after spring forward)
    const window = {
      start: new Date("2026-03-08T13:00:00Z"), // 09:00 EDT (after spring forward)
      end: new Date("2026-03-08T15:00:00Z"),   // 11:00 EDT
    };

    // Use a 'now' that is before the DST window so slots aren't filtered as past
    const nowBeforeWindow = new Date("2026-03-08T00:00:00Z");
    const futureLimitFar = new Date("2026-06-10T00:00:00Z");

    const slots = generateSlotsForWindow({
      window,
      eventType: baseEventType,
      existingBookings: [],
      bookingsThisDay: [],
      bookingsThisWeek: [],
      now: nowBeforeWindow,
      futureLimitDate: futureLimitFar,
      attendeeTimezone: "America/New_York",
    });

    // 2-hour window with 30-min slots = 4 slots
    expect(slots.length).toBeGreaterThan(0);
    // UTC times should be exact — no double-conversion artifacts
    expect(slots[0]!.time).toBe("2026-03-08T13:00:00.000Z");
    // After spring forward, the local time should be EDT (+4 hours offset from UTC-4)
    expect(slots[0]!.localTime).toBe("09:00"); // 13:00 UTC = 09:00 EDT
  });
});

// ─── Zod schema tests ────────────────────────────────────────────────────────

describe("slotQuerySchema validation", () => {
  it("accepts valid slot query params", () => {
    const result = slotQuerySchema.safeParse({
      eventTypeId: "clxxxxxxxxxxxxxxxxxxxxxxxx",
      startDate: "2026-03-10",
      endDate: "2026-03-17",
      timezone: "America/New_York",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid date format", () => {
    const result = slotQuerySchema.safeParse({
      eventTypeId: "clxxxxxxxxxxxxxxxxxxxxxxxx",
      startDate: "03/10/2026", // wrong format
      endDate: "2026-03-17",
      timezone: "UTC",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing eventTypeId", () => {
    const result = slotQuerySchema.safeParse({
      startDate: "2026-03-10",
      endDate: "2026-03-17",
      timezone: "UTC",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty timezone", () => {
    const result = slotQuerySchema.safeParse({
      eventTypeId: "clxxxxxxxxxxxxxxxxxxxxxxxx",
      startDate: "2026-03-10",
      endDate: "2026-03-17",
      timezone: "",
    });
    expect(result.success).toBe(false);
  });
});
