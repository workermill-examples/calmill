import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockPrismaClient } from '../helpers/setup';

/**
 * Tests for slot calculation with Google Calendar busy time integration.
 *
 * These tests verify that `getAvailableSlots()` correctly merges external
 * busy times from Google Calendar into the conflict detection logic.
 *
 * Per Story 3 spec, after loading existing bookings (step 2), the slot
 * calculator fetches busy times from CalendarConnections and merges them
 * into the booking conflicts array. Calendar fetch failures are handled
 * gracefully (log warning, continue without external conflicts).
 */

// ─── MODULE MOCKS ─────────────────────────────────────────────────────────────

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrismaClient,
}));

// Shared mock getBusyTimes so individual tests can control its behavior
const mockGetBusyTimes = vi.fn().mockResolvedValue([]);

// GoogleCalendarService must be mocked as a proper constructor
vi.mock('@/lib/google-calendar', () => ({
  GoogleCalendarService: vi.fn(function (this: Record<string, unknown>) {
    this.getBusyTimes = mockGetBusyTimes;
    this.getValidAccessToken = vi.fn();
    this.createEvent = vi.fn();
    this.updateEvent = vi.fn();
    this.deleteEvent = vi.fn();
  }),
}));

import { getAvailableSlots } from '@/lib/slots';
import { GoogleCalendarService } from '@/lib/google-calendar';

// ─── FIXTURES ────────────────────────────────────────────────────────────────

const BASE_EVENT_TYPE = {
  id: 'event-type-123',
  userId: 'user-123',
  isActive: true,
  duration: 30,
  slotInterval: null,
  beforeBuffer: 0,
  afterBuffer: 0,
  minimumNotice: 0,
  maxBookingsPerDay: null,
  maxBookingsPerWeek: null,
  futureLimit: 60, // days
  title: '30 Min Meeting',
  slug: '30-min',
  requiresConfirmation: false,
  schedule: {
    id: 'schedule-123',
    timezone: 'UTC',
    availability: [
      {
        id: 'avail-1',
        day: 2, // Tuesday (2026-03-10 is a Tuesday per date-fns getDay with TZDate)
        startTime: '09:00',
        endTime: '17:00',
      },
    ],
    dateOverrides: [],
  },
};

const CALENDAR_CONNECTION = {
  id: 'conn-123',
  userId: 'user-123',
  provider: 'google',
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  expiresAt: new Date(Date.now() + 3600 * 1000),
  email: 'user@gmail.com',
  isPrimary: true,
};

// ─── TESTS ───────────────────────────────────────────────────────────────────

describe('getAvailableSlots with Google Calendar busy times', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset busy times to empty by default
    mockGetBusyTimes.mockResolvedValue([]);

    // Default: event type found, no existing bookings, no calendar connections
    mockPrismaClient.eventType.findUnique.mockResolvedValue(BASE_EVENT_TYPE);
    mockPrismaClient.booking.findMany.mockResolvedValue([]);
    mockPrismaClient.calendarConnection.findMany.mockResolvedValue([]);
  });

  it('returns slots normally when no calendar connections exist', async () => {
    mockPrismaClient.calendarConnection.findMany.mockResolvedValue([]);

    const slots = await getAvailableSlots({
      eventTypeId: 'event-type-123',
      startDate: '2026-03-10',
      endDate: '2026-03-10',
      timezone: 'UTC',
    });

    // 09:00 to 17:00 with 30-min slots = 16 slots
    expect(slots.length).toBeGreaterThan(0);
    // GoogleCalendarService should not have been instantiated
    expect(GoogleCalendarService).not.toHaveBeenCalled();
  });

  it('excludes slots that overlap with Google Calendar busy times', async () => {
    mockPrismaClient.calendarConnection.findMany.mockResolvedValue([CALENDAR_CONNECTION]);

    // Busy from 10:00 to 11:00
    mockGetBusyTimes.mockResolvedValue([
      {
        start: new Date('2026-03-10T10:00:00Z'),
        end: new Date('2026-03-10T11:00:00Z'),
      },
    ]);

    const slots = await getAvailableSlots({
      eventTypeId: 'event-type-123',
      startDate: '2026-03-10',
      endDate: '2026-03-10',
      timezone: 'UTC',
    });

    const slotTimes = slots.map((s) => s.time);

    // 10:00 and 10:30 should be excluded (overlap with busy 10:00-11:00)
    expect(slotTimes).not.toContain('2026-03-10T10:00:00.000Z');
    expect(slotTimes).not.toContain('2026-03-10T10:30:00.000Z');

    // 09:00 and 09:30 should still be available
    expect(slotTimes).toContain('2026-03-10T09:00:00.000Z');
    expect(slotTimes).toContain('2026-03-10T09:30:00.000Z');

    // 11:00 should be available (busy ends at 11:00, no overlap with adjacent slot)
    expect(slotTimes).toContain('2026-03-10T11:00:00.000Z');
  });

  it("merges multiple calendar connections' busy times", async () => {
    const connection2 = {
      ...CALENDAR_CONNECTION,
      id: 'conn-456',
      email: 'work@gmail.com',
    };
    mockPrismaClient.calendarConnection.findMany.mockResolvedValue([
      CALENDAR_CONNECTION,
      connection2,
    ]);

    // Both connections return distinct busy windows
    // First call: busy 09:00-10:00, second call: busy 14:00-15:00
    mockGetBusyTimes
      .mockResolvedValueOnce([
        { start: new Date('2026-03-10T09:00:00Z'), end: new Date('2026-03-10T10:00:00Z') },
      ])
      .mockResolvedValueOnce([
        { start: new Date('2026-03-10T14:00:00Z'), end: new Date('2026-03-10T15:00:00Z') },
      ]);

    const slots = await getAvailableSlots({
      eventTypeId: 'event-type-123',
      startDate: '2026-03-10',
      endDate: '2026-03-10',
      timezone: 'UTC',
    });

    const slotTimes = slots.map((s) => s.time);

    // First connection's busy period should be excluded
    expect(slotTimes).not.toContain('2026-03-10T09:00:00.000Z');
    expect(slotTimes).not.toContain('2026-03-10T09:30:00.000Z');

    // Second connection's busy period should be excluded
    expect(slotTimes).not.toContain('2026-03-10T14:00:00.000Z');
    expect(slotTimes).not.toContain('2026-03-10T14:30:00.000Z');

    // Between the two busy periods should be available
    expect(slotTimes).toContain('2026-03-10T10:00:00.000Z');
    expect(slotTimes).toContain('2026-03-10T13:00:00.000Z');
  });

  it('falls back gracefully when Google Calendar API throws an error', async () => {
    mockPrismaClient.calendarConnection.findMany.mockResolvedValue([CALENDAR_CONNECTION]);

    // Calendar service fails
    mockGetBusyTimes.mockRejectedValue(new Error('Network error'));

    // Should not throw — calendar failure is best-effort
    const slots = await getAvailableSlots({
      eventTypeId: 'event-type-123',
      startDate: '2026-03-10',
      endDate: '2026-03-10',
      timezone: 'UTC',
    });

    // Should still return slots (calendar errors don't block the request)
    expect(slots.length).toBeGreaterThan(0);
  });

  it('treats calendar busy times exactly like internal bookings for conflict detection', async () => {
    // This verifies that busy times respect buffer settings the same way bookings do
    mockPrismaClient.eventType.findUnique.mockResolvedValue({
      ...BASE_EVENT_TYPE,
      afterBuffer: 15, // 15 min after-buffer
    });

    mockPrismaClient.calendarConnection.findMany.mockResolvedValue([CALENDAR_CONNECTION]);

    // Calendar busy: 09:30-10:00
    // With 15-min afterBuffer, this blocks until 10:15
    // → slot at 10:00 should be excluded (it starts during the buffer zone)
    mockGetBusyTimes.mockResolvedValue([
      { start: new Date('2026-03-10T09:30:00Z'), end: new Date('2026-03-10T10:00:00Z') },
    ]);

    const slots = await getAvailableSlots({
      eventTypeId: 'event-type-123',
      startDate: '2026-03-10',
      endDate: '2026-03-10',
      timezone: 'UTC',
    });

    const slotTimes = slots.map((s) => s.time);

    // 10:00 slot conflicts due to afterBuffer extending the busy time to 10:15
    expect(slotTimes).not.toContain('2026-03-10T10:00:00.000Z');
    // 10:30 is after the buffer zone, should be available
    expect(slotTimes).toContain('2026-03-10T10:30:00.000Z');
  });

  it('combines internal bookings and calendar busy times for conflict detection', async () => {
    // Internal booking at 09:00-09:30
    mockPrismaClient.booking.findMany.mockResolvedValue([
      {
        startTime: new Date('2026-03-10T09:00:00Z'),
        endTime: new Date('2026-03-10T09:30:00Z'),
      },
    ]);

    mockPrismaClient.calendarConnection.findMany.mockResolvedValue([CALENDAR_CONNECTION]);

    // Calendar busy at 13:00-14:00
    mockGetBusyTimes.mockResolvedValue([
      { start: new Date('2026-03-10T13:00:00Z'), end: new Date('2026-03-10T14:00:00Z') },
    ]);

    const slots = await getAvailableSlots({
      eventTypeId: 'event-type-123',
      startDate: '2026-03-10',
      endDate: '2026-03-10',
      timezone: 'UTC',
    });

    const slotTimes = slots.map((s) => s.time);

    // Internal booking blocks 09:00
    expect(slotTimes).not.toContain('2026-03-10T09:00:00.000Z');
    // Calendar busy blocks 13:00 and 13:30
    expect(slotTimes).not.toContain('2026-03-10T13:00:00.000Z');
    expect(slotTimes).not.toContain('2026-03-10T13:30:00.000Z');
    // 09:30, 10:00 should be available
    expect(slotTimes).toContain('2026-03-10T09:30:00.000Z');
    expect(slotTimes).toContain('2026-03-10T10:00:00.000Z');
  });
});
