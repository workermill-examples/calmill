import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockPrismaClient } from "../helpers/setup";

// ─── MOCKS ───────────────────────────────────────────────────────────────────

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrismaClient,
}));

vi.mock("next/server", () => ({
  NextResponse: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: vi.fn((data: any, init?: any) => ({
      status: init?.status ?? 200,
      json: async () => data,
    })),
  },
}));

// Mock getAvailableSlots — controls what slots each member appears to have
const mockGetAvailableSlots = vi.fn();
vi.mock("@/lib/slots", () => ({
  getAvailableSlots: (...args: unknown[]) => mockGetAvailableSlots(...args),
}));

// Extend the booking mock with groupBy (not included in the shared setup)
const mockBookingGroupBy = vi.fn();

// ─── IMPORTS ─────────────────────────────────────────────────────────────────

import {
  getRoundRobinSlots,
  getRoundRobinAssignment,
  getBookingCountByMember,
} from "@/lib/team-slots";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function slot(time: string, localTime = "09:00") {
  return { time, localTime, duration: 30 };
}

const EVENT_TYPE_ID = "evt-team-rr-1";
const TEAM_ID = "team-1";
const MEMBER_A = "user-alice";
const MEMBER_B = "user-bob";
const MEMBER_C = "user-carol";

/** Sets up prisma mocks for a team event type with the given accepted members */
function setupTeamEventType(memberIds: string[]) {
  // getAcceptedMemberIds: eventType lookup then teamMember lookup
  mockPrismaClient.eventType.findUnique.mockResolvedValue({
    id: EVENT_TYPE_ID,
    teamId: TEAM_ID,
    userId: memberIds[0] ?? MEMBER_A, // first member is creator
    isActive: true,
  });
  mockPrismaClient.teamMember.findMany.mockResolvedValue(
    memberIds.map((userId) => ({ userId }))
  );
}

/** Sets up getMemberAvailableSlots: creator uses team event type, others use their own */
function setupMemberEventTypeLookup(_creatorId: string, _otherIds: string[]) {
  // For non-creator members, findUnique returns same team event type, findFirst returns null
  // (so they fall back to the team event type themselves)
  // We control what slots getMemberAvailableSlots returns via mockGetAvailableSlots
  mockPrismaClient.eventType.findFirst.mockResolvedValue(null);
}

// ─── TESTS ───────────────────────────────────────────────────────────────────

describe("getRoundRobinSlots", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty array when there are no accepted members", async () => {
    mockPrismaClient.eventType.findUnique.mockResolvedValue({
      id: EVENT_TYPE_ID,
      teamId: TEAM_ID,
      userId: MEMBER_A,
      isActive: true,
    });
    mockPrismaClient.teamMember.findMany.mockResolvedValue([]);

    const result = await getRoundRobinSlots({
      eventTypeId: EVENT_TYPE_ID,
      startDate: "2026-03-01",
      endDate: "2026-03-01",
      timezone: "UTC",
    });

    expect(result).toEqual([]);
  });

  it("returns empty array when event type does not belong to a team", async () => {
    mockPrismaClient.eventType.findUnique.mockResolvedValue({
      id: EVENT_TYPE_ID,
      teamId: null, // personal event type
      userId: MEMBER_A,
      isActive: true,
    });

    const result = await getRoundRobinSlots({
      eventTypeId: EVENT_TYPE_ID,
      startDate: "2026-03-01",
      endDate: "2026-03-01",
      timezone: "UTC",
    });

    expect(result).toEqual([]);
    expect(mockPrismaClient.teamMember.findMany).not.toHaveBeenCalled();
  });

  it("returns all slots when only one member has availability", async () => {
    setupTeamEventType([MEMBER_A, MEMBER_B]);
    setupMemberEventTypeLookup(MEMBER_A, [MEMBER_B]);

    // Creator (MEMBER_A) has slots; MEMBER_B has none
    mockGetAvailableSlots
      .mockResolvedValueOnce([slot("2026-03-01T09:00:00Z"), slot("2026-03-01T09:30:00Z")])
      .mockResolvedValueOnce([]); // MEMBER_B unavailable

    const result = await getRoundRobinSlots({
      eventTypeId: EVENT_TYPE_ID,
      startDate: "2026-03-01",
      endDate: "2026-03-01",
      timezone: "UTC",
    });

    expect(result).toHaveLength(2);
    expect(result[0].time).toBe("2026-03-01T09:00:00Z");
    expect(result[1].time).toBe("2026-03-01T09:30:00Z");
  });

  it("unions slots from multiple members (slot available if ANY member is free)", async () => {
    setupTeamEventType([MEMBER_A, MEMBER_B]);
    setupMemberEventTypeLookup(MEMBER_A, [MEMBER_B]);

    // MEMBER_A and MEMBER_B have different slots
    mockGetAvailableSlots
      .mockResolvedValueOnce([slot("2026-03-01T09:00:00Z"), slot("2026-03-01T10:00:00Z")])
      .mockResolvedValueOnce([slot("2026-03-01T10:00:00Z"), slot("2026-03-01T11:00:00Z")]);

    const result = await getRoundRobinSlots({
      eventTypeId: EVENT_TYPE_ID,
      startDate: "2026-03-01",
      endDate: "2026-03-01",
      timezone: "UTC",
    });

    // Union: 09:00, 10:00, 11:00 — no duplicates
    expect(result).toHaveLength(3);
    const times = result.map((s) => s.time);
    expect(times).toContain("2026-03-01T09:00:00Z");
    expect(times).toContain("2026-03-01T10:00:00Z");
    expect(times).toContain("2026-03-01T11:00:00Z");
  });

  it("deduplicates slots that appear for multiple members", async () => {
    setupTeamEventType([MEMBER_A, MEMBER_B, MEMBER_C]);
    mockPrismaClient.eventType.findFirst.mockResolvedValue(null);

    // All three members share the same two slots
    mockGetAvailableSlots
      .mockResolvedValueOnce([slot("2026-03-01T09:00:00Z"), slot("2026-03-01T09:30:00Z")])
      .mockResolvedValueOnce([slot("2026-03-01T09:00:00Z"), slot("2026-03-01T09:30:00Z")])
      .mockResolvedValueOnce([slot("2026-03-01T09:00:00Z"), slot("2026-03-01T09:30:00Z")]);

    const result = await getRoundRobinSlots({
      eventTypeId: EVENT_TYPE_ID,
      startDate: "2026-03-01",
      endDate: "2026-03-01",
      timezone: "UTC",
    });

    expect(result).toHaveLength(2);
  });

  it("returns slots sorted ascending by time", async () => {
    setupTeamEventType([MEMBER_A, MEMBER_B]);
    setupMemberEventTypeLookup(MEMBER_A, [MEMBER_B]);

    mockGetAvailableSlots
      .mockResolvedValueOnce([slot("2026-03-01T11:00:00Z"), slot("2026-03-01T09:00:00Z")])
      .mockResolvedValueOnce([slot("2026-03-01T10:00:00Z")]);

    const result = await getRoundRobinSlots({
      eventTypeId: EVENT_TYPE_ID,
      startDate: "2026-03-01",
      endDate: "2026-03-01",
      timezone: "UTC",
    });

    expect(result[0].time).toBe("2026-03-01T09:00:00Z");
    expect(result[1].time).toBe("2026-03-01T10:00:00Z");
    expect(result[2].time).toBe("2026-03-01T11:00:00Z");
  });

  it("returns empty array when all members have no availability", async () => {
    setupTeamEventType([MEMBER_A, MEMBER_B]);
    setupMemberEventTypeLookup(MEMBER_A, [MEMBER_B]);

    mockGetAvailableSlots.mockResolvedValue([]);

    const result = await getRoundRobinSlots({
      eventTypeId: EVENT_TYPE_ID,
      startDate: "2026-03-01",
      endDate: "2026-03-01",
      timezone: "UTC",
    });

    expect(result).toEqual([]);
  });
});

// ─── ROUND-ROBIN ASSIGNMENT ───────────────────────────────────────────────────

describe("getRoundRobinAssignment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Attach groupBy to the booking mock (not in global setup)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mockPrismaClient.booking as any).groupBy = mockBookingGroupBy;
  });

  it("returns null when no accepted members exist", async () => {
    mockPrismaClient.eventType.findUnique.mockResolvedValue({
      id: EVENT_TYPE_ID,
      teamId: TEAM_ID,
      userId: MEMBER_A,
      isActive: true,
    });
    mockPrismaClient.teamMember.findMany.mockResolvedValue([]);

    const result = await getRoundRobinAssignment({
      eventTypeId: EVENT_TYPE_ID,
      slotTime: "2026-03-01T09:00:00Z",
      startDate: "2026-03-01",
      endDate: "2026-03-01",
      timezone: "UTC",
    });

    expect(result).toBeNull();
  });

  it("returns null when no members are available at the requested slot time", async () => {
    setupTeamEventType([MEMBER_A, MEMBER_B]);
    setupMemberEventTypeLookup(MEMBER_A, [MEMBER_B]);

    // Both members return slots but NOT the requested time
    mockGetAvailableSlots.mockResolvedValue([slot("2026-03-01T10:00:00Z")]);

    const result = await getRoundRobinAssignment({
      eventTypeId: EVENT_TYPE_ID,
      slotTime: "2026-03-01T09:00:00Z",
      startDate: "2026-03-01",
      endDate: "2026-03-01",
      timezone: "UTC",
    });

    expect(result).toBeNull();
  });

  it("returns the only available member when just one is free at the slot", async () => {
    setupTeamEventType([MEMBER_A, MEMBER_B]);
    setupMemberEventTypeLookup(MEMBER_A, [MEMBER_B]);

    // MEMBER_A has the slot; MEMBER_B does not
    mockGetAvailableSlots
      .mockResolvedValueOnce([slot("2026-03-01T09:00:00Z")]) // MEMBER_A
      .mockResolvedValueOnce([slot("2026-03-01T10:00:00Z")]); // MEMBER_B — different slot

    const result = await getRoundRobinAssignment({
      eventTypeId: EVENT_TYPE_ID,
      slotTime: "2026-03-01T09:00:00Z",
      startDate: "2026-03-01",
      endDate: "2026-03-01",
      timezone: "UTC",
    });

    expect(result).toBe(MEMBER_A);
  });

  it("assigns to the member with the fewest recent bookings (load balancing)", async () => {
    setupTeamEventType([MEMBER_A, MEMBER_B]);
    setupMemberEventTypeLookup(MEMBER_A, [MEMBER_B]);

    // Both members are free at the slot
    mockGetAvailableSlots.mockResolvedValue([slot("2026-03-01T09:00:00Z")]);

    // MEMBER_A has 5 bookings; MEMBER_B has 2
    mockBookingGroupBy.mockResolvedValue([
      { userId: MEMBER_A, _count: { id: 5 } },
      { userId: MEMBER_B, _count: { id: 2 } },
    ]);

    const result = await getRoundRobinAssignment({
      eventTypeId: EVENT_TYPE_ID,
      slotTime: "2026-03-01T09:00:00Z",
      startDate: "2026-03-01",
      endDate: "2026-03-01",
      timezone: "UTC",
    });

    expect(result).toBe(MEMBER_B);
  });

  it("uses tiebreaker (least recently assigned) when booking counts are equal", async () => {
    setupTeamEventType([MEMBER_A, MEMBER_B]);
    setupMemberEventTypeLookup(MEMBER_A, [MEMBER_B]);

    // Both members are free
    mockGetAvailableSlots.mockResolvedValue([slot("2026-03-01T09:00:00Z")]);

    // Booking counts are equal
    mockBookingGroupBy.mockResolvedValue([
      { userId: MEMBER_A, _count: { id: 3 } },
      { userId: MEMBER_B, _count: { id: 3 } },
    ]);

    // MEMBER_B was assigned most recently; MEMBER_A last assigned earlier
    mockPrismaClient.booking.findMany.mockResolvedValue([
      { userId: MEMBER_B, createdAt: new Date("2026-02-20T10:00:00Z") },
      { userId: MEMBER_A, createdAt: new Date("2026-02-15T10:00:00Z") },
    ]);

    const result = await getRoundRobinAssignment({
      eventTypeId: EVENT_TYPE_ID,
      slotTime: "2026-03-01T09:00:00Z",
      startDate: "2026-03-01",
      endDate: "2026-03-01",
      timezone: "UTC",
    });

    // MEMBER_A was assigned earlier, so they should be assigned next
    expect(result).toBe(MEMBER_A);
  });

  it("gives priority to members with no prior bookings (new members assigned first in a tie)", async () => {
    setupTeamEventType([MEMBER_A, MEMBER_B]);
    setupMemberEventTypeLookup(MEMBER_A, [MEMBER_B]);

    // Both members are free
    mockGetAvailableSlots.mockResolvedValue([slot("2026-03-01T09:00:00Z")]);

    // Both have equal booking counts
    mockBookingGroupBy.mockResolvedValue([
      { userId: MEMBER_A, _count: { id: 2 } },
      { userId: MEMBER_B, _count: { id: 2 } },
    ]);

    // MEMBER_A has a prior booking; MEMBER_B has none (new to the team)
    mockPrismaClient.booking.findMany.mockResolvedValue([
      { userId: MEMBER_A, createdAt: new Date("2026-02-10T10:00:00Z") },
    ]);

    const result = await getRoundRobinAssignment({
      eventTypeId: EVENT_TYPE_ID,
      slotTime: "2026-03-01T09:00:00Z",
      startDate: "2026-03-01",
      endDate: "2026-03-01",
      timezone: "UTC",
    });

    // MEMBER_B has no prior booking → treated as new Date(0) → assigned first
    expect(result).toBe(MEMBER_B);
  });
});

// ─── BOOKING COUNT BY MEMBER ──────────────────────────────────────────────────

describe("getBookingCountByMember", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Attach groupBy to the booking mock (not in global setup)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mockPrismaClient.booking as any).groupBy = mockBookingGroupBy;
  });

  it("returns zero counts for all members when there are no bookings", async () => {
    mockBookingGroupBy.mockResolvedValue([]);

    const result = await getBookingCountByMember(EVENT_TYPE_ID, [MEMBER_A, MEMBER_B], 30);

    expect(result.get(MEMBER_A)).toBe(0);
    expect(result.get(MEMBER_B)).toBe(0);
  });

  it("correctly maps booking counts to member IDs", async () => {
    mockBookingGroupBy.mockResolvedValue([
      { userId: MEMBER_A, _count: { id: 7 } },
      { userId: MEMBER_B, _count: { id: 3 } },
    ]);

    const result = await getBookingCountByMember(EVENT_TYPE_ID, [MEMBER_A, MEMBER_B], 30);

    expect(result.get(MEMBER_A)).toBe(7);
    expect(result.get(MEMBER_B)).toBe(3);
  });

  it("returns 0 for members with no bookings even when others have bookings", async () => {
    mockBookingGroupBy.mockResolvedValue([
      { userId: MEMBER_A, _count: { id: 4 } },
    ]);

    const result = await getBookingCountByMember(EVENT_TYPE_ID, [MEMBER_A, MEMBER_B, MEMBER_C], 30);

    expect(result.get(MEMBER_A)).toBe(4);
    expect(result.get(MEMBER_B)).toBe(0);
    expect(result.get(MEMBER_C)).toBe(0);
  });

  it("queries with the correct date window", async () => {
    mockBookingGroupBy.mockResolvedValue([]);

    await getBookingCountByMember(EVENT_TYPE_ID, [MEMBER_A], 30);

    const callArgs = mockBookingGroupBy.mock.calls[0][0];
    const since = callArgs.where.createdAt.gte;
    const daysDiff = Math.round((Date.now() - since.getTime()) / (1000 * 60 * 60 * 24));
    expect(daysDiff).toBeCloseTo(30, 0);
  });

  it("only counts PENDING and ACCEPTED bookings (not REJECTED or CANCELLED)", async () => {
    mockBookingGroupBy.mockResolvedValue([]);

    await getBookingCountByMember(EVENT_TYPE_ID, [MEMBER_A], 30);

    const callArgs = mockBookingGroupBy.mock.calls[0][0];
    expect(callArgs.where.status).toEqual({ in: ["PENDING", "ACCEPTED"] });
  });
});
