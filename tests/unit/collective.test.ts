import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockPrismaClient } from '../helpers/setup';

// ─── MOCKS ───────────────────────────────────────────────────────────────────

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrismaClient,
}));

vi.mock('next/server', () => ({
  NextResponse: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: vi.fn((data: any, init?: any) => ({
      status: init?.status ?? 200,
      json: async () => data,
    })),
  },
}));

// Mock getAvailableSlots — controls what slots each member has
const mockGetAvailableSlots = vi.fn();
vi.mock('@/lib/slots', () => ({
  getAvailableSlots: (...args: unknown[]) => mockGetAvailableSlots(...args),
}));

// ─── IMPORTS ─────────────────────────────────────────────────────────────────

import { getCollectiveSlots } from '@/lib/team-slots';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function slot(time: string, localTime = '09:00') {
  return { time, localTime, duration: 30 };
}

const EVENT_TYPE_ID = 'evt-team-collective-1';
const TEAM_ID = 'team-collective';
const MEMBER_A = 'user-alice';
const MEMBER_B = 'user-bob';
const MEMBER_C = 'user-carol';

/** Sets up prisma mocks for a team event type with the given accepted members */
function setupTeamEventType(memberIds: string[]) {
  mockPrismaClient.eventType.findUnique.mockResolvedValue({
    id: EVENT_TYPE_ID,
    teamId: TEAM_ID,
    userId: memberIds[0] ?? MEMBER_A,
    isActive: true,
  });
  mockPrismaClient.teamMember.findMany.mockResolvedValue(memberIds.map((userId) => ({ userId })));
  // Non-creator members fall back to team event type (no personal event type)
  mockPrismaClient.eventType.findFirst.mockResolvedValue(null);
}

// ─── TESTS ───────────────────────────────────────────────────────────────────

describe('getCollectiveSlots', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty array when there are no accepted members', async () => {
    mockPrismaClient.eventType.findUnique.mockResolvedValue({
      id: EVENT_TYPE_ID,
      teamId: TEAM_ID,
      userId: MEMBER_A,
      isActive: true,
    });
    mockPrismaClient.teamMember.findMany.mockResolvedValue([]);

    const result = await getCollectiveSlots({
      eventTypeId: EVENT_TYPE_ID,
      startDate: '2026-03-01',
      endDate: '2026-03-01',
      timezone: 'UTC',
    });

    expect(result).toEqual([]);
  });

  it('returns empty array when event type is not a team event type', async () => {
    mockPrismaClient.eventType.findUnique.mockResolvedValue({
      id: EVENT_TYPE_ID,
      teamId: null, // personal event type
      userId: MEMBER_A,
      isActive: true,
    });

    const result = await getCollectiveSlots({
      eventTypeId: EVENT_TYPE_ID,
      startDate: '2026-03-01',
      endDate: '2026-03-01',
      timezone: 'UTC',
    });

    expect(result).toEqual([]);
  });

  it('returns slots that ALL members share (intersection)', async () => {
    setupTeamEventType([MEMBER_A, MEMBER_B]);

    // Both members have the 09:00 and 10:00 slots
    mockGetAvailableSlots
      .mockResolvedValueOnce([
        slot('2026-03-01T09:00:00Z'),
        slot('2026-03-01T10:00:00Z'),
        slot('2026-03-01T11:00:00Z'),
      ])
      .mockResolvedValueOnce([
        slot('2026-03-01T09:00:00Z'),
        slot('2026-03-01T10:00:00Z'),
        // MEMBER_B does NOT have 11:00
      ]);

    const result = await getCollectiveSlots({
      eventTypeId: EVENT_TYPE_ID,
      startDate: '2026-03-01',
      endDate: '2026-03-01',
      timezone: 'UTC',
    });

    // Only slots both members have
    expect(result).toHaveLength(2);
    const times = result.map((s) => s.time);
    expect(times).toContain('2026-03-01T09:00:00Z');
    expect(times).toContain('2026-03-01T10:00:00Z');
    expect(times).not.toContain('2026-03-01T11:00:00Z');
  });

  it('returns empty array when one member has no availability', async () => {
    setupTeamEventType([MEMBER_A, MEMBER_B]);

    // MEMBER_A has slots; MEMBER_B has none
    mockGetAvailableSlots
      .mockResolvedValueOnce([slot('2026-03-01T09:00:00Z'), slot('2026-03-01T10:00:00Z')])
      .mockResolvedValueOnce([]); // MEMBER_B unavailable

    const result = await getCollectiveSlots({
      eventTypeId: EVENT_TYPE_ID,
      startDate: '2026-03-01',
      endDate: '2026-03-01',
      timezone: 'UTC',
    });

    // No common slots → empty
    expect(result).toEqual([]);
  });

  it('returns empty when there is no overlap between any two members', async () => {
    setupTeamEventType([MEMBER_A, MEMBER_B]);

    // MEMBER_A and MEMBER_B have completely different slot times
    mockGetAvailableSlots
      .mockResolvedValueOnce([slot('2026-03-01T09:00:00Z'), slot('2026-03-01T09:30:00Z')])
      .mockResolvedValueOnce([slot('2026-03-01T14:00:00Z'), slot('2026-03-01T14:30:00Z')]);

    const result = await getCollectiveSlots({
      eventTypeId: EVENT_TYPE_ID,
      startDate: '2026-03-01',
      endDate: '2026-03-01',
      timezone: 'UTC',
    });

    expect(result).toEqual([]);
  });

  it('correctly intersects slots for three members', async () => {
    setupTeamEventType([MEMBER_A, MEMBER_B, MEMBER_C]);

    // 09:00 and 10:00 shared by A and B; only 09:00 shared by all three
    mockGetAvailableSlots
      .mockResolvedValueOnce([slot('2026-03-01T09:00:00Z'), slot('2026-03-01T10:00:00Z')])
      .mockResolvedValueOnce([slot('2026-03-01T09:00:00Z'), slot('2026-03-01T10:00:00Z')])
      .mockResolvedValueOnce([
        slot('2026-03-01T09:00:00Z'),
        // MEMBER_C does NOT have 10:00
      ]);

    const result = await getCollectiveSlots({
      eventTypeId: EVENT_TYPE_ID,
      startDate: '2026-03-01',
      endDate: '2026-03-01',
      timezone: 'UTC',
    });

    expect(result).toHaveLength(1);
    expect(result[0]!.time).toBe('2026-03-01T09:00:00Z');
  });

  it('returns all slots when a single member has availability (no intersection needed)', async () => {
    setupTeamEventType([MEMBER_A]);

    mockGetAvailableSlots.mockResolvedValueOnce([
      slot('2026-03-01T09:00:00Z'),
      slot('2026-03-01T09:30:00Z'),
      slot('2026-03-01T10:00:00Z'),
    ]);

    const result = await getCollectiveSlots({
      eventTypeId: EVENT_TYPE_ID,
      startDate: '2026-03-01',
      endDate: '2026-03-01',
      timezone: 'UTC',
    });

    expect(result).toHaveLength(3);
  });

  it('returns slots sorted ascending by time', async () => {
    setupTeamEventType([MEMBER_A, MEMBER_B]);

    // Both have the same three slots but returned in different orders
    mockGetAvailableSlots
      .mockResolvedValueOnce([
        slot('2026-03-01T11:00:00Z'),
        slot('2026-03-01T09:00:00Z'),
        slot('2026-03-01T10:00:00Z'),
      ])
      .mockResolvedValueOnce([
        slot('2026-03-01T10:00:00Z'),
        slot('2026-03-01T11:00:00Z'),
        slot('2026-03-01T09:00:00Z'),
      ]);

    const result = await getCollectiveSlots({
      eventTypeId: EVENT_TYPE_ID,
      startDate: '2026-03-01',
      endDate: '2026-03-01',
      timezone: 'UTC',
    });

    expect(result[0]!.time).toBe('2026-03-01T09:00:00Z');
    expect(result[1]!.time).toBe('2026-03-01T10:00:00Z');
    expect(result[2]!.time).toBe('2026-03-01T11:00:00Z');
  });

  it('handles multiple availability windows across the day correctly', async () => {
    setupTeamEventType([MEMBER_A, MEMBER_B]);

    // Morning and afternoon windows for both members — both windows intersect
    const sharedSlots = [
      slot('2026-03-01T09:00:00Z'),
      slot('2026-03-01T09:30:00Z'),
      slot('2026-03-01T14:00:00Z'),
      slot('2026-03-01T14:30:00Z'),
    ];

    mockGetAvailableSlots
      .mockResolvedValueOnce([...sharedSlots, slot('2026-03-01T13:00:00Z')]) // MEMBER_A has extra 13:00
      .mockResolvedValueOnce([...sharedSlots]); // MEMBER_B missing 13:00

    const result = await getCollectiveSlots({
      eventTypeId: EVENT_TYPE_ID,
      startDate: '2026-03-01',
      endDate: '2026-03-01',
      timezone: 'UTC',
    });

    // 4 shared slots — 13:00 excluded
    expect(result).toHaveLength(4);
    const times = result.map((s) => s.time);
    expect(times).not.toContain('2026-03-01T13:00:00Z');
  });

  it('queries getAvailableSlots for each accepted member', async () => {
    setupTeamEventType([MEMBER_A, MEMBER_B, MEMBER_C]);

    mockGetAvailableSlots.mockResolvedValue([slot('2026-03-01T09:00:00Z')]);

    await getCollectiveSlots({
      eventTypeId: EVENT_TYPE_ID,
      startDate: '2026-03-01',
      endDate: '2026-03-01',
      timezone: 'UTC',
    });

    // Should call getAvailableSlots once per member (3 times)
    // Two findUnique calls per member (one for teamId, one for userId check)
    // and one findFirst per non-creator member
    expect(mockGetAvailableSlots).toHaveBeenCalledTimes(3);
  });
});
