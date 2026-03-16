// Unit tests for slot calculation engine
// Tests core slot algorithm, timezone handling, and business rules

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAvailableSlots } from '@/lib/slots'

// Mock Prisma - completely mock all methods used
vi.mock('@/lib/prisma', () => ({
  prisma: {
    eventType: {
      findUnique: vi.fn(),
    },
    schedule: {
      findFirst: vi.fn(),
    },
    booking: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}))

// Mock Google Calendar integration
vi.mock('@/lib/google-calendar', () => ({
  getBusyTimes: vi.fn(),
}))

// Mock team slots (to prevent circular dependency)
vi.mock('@/lib/team-slots', () => ({
  getTeamAvailableSlots: vi.fn(),
}))

import { prisma } from '@/lib/prisma'
import { getBusyTimes } from '@/lib/google-calendar'
import { getTeamAvailableSlots } from '@/lib/team-slots'

describe('getAvailableSlots', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockEventType = {
    id: 'event-type-1',
    title: '30 Minute Meeting',
    slug: '30min',
    duration: 30,
    isActive: true,
    requiresConfirmation: false,
    minimumNotice: null, // No minimum notice for basic tests
    beforeBuffer: 15,
    afterBuffer: 15,
    slotInterval: 30,
    maxBookingsPerDay: null,
    maxBookingsPerWeek: null,
    futureLimit: null,
    userId: 'user-1',
    teamId: null,
    scheduleId: 'schedule-1',
    user: {
      id: 'user-1',
      calendarConnections: []
    },
    schedule: {
      id: 'schedule-1',
      name: 'Default Schedule',
      timezone: 'America/New_York',
      availabilities: [
        {
          id: 'avail-1',
          day: 1, // Monday
          startTime: '09:00',
          endTime: '17:00'
        },
        {
          id: 'avail-2',
          day: 2, // Tuesday
          startTime: '09:00',
          endTime: '17:00'
        }
      ],
      dateOverrides: []
    }
  }

  const mockSchedule = {
    id: 'schedule-1',
    name: 'Default Schedule',
    timezone: 'America/New_York',
    availabilities: [
      {
        id: 'avail-1',
        day: 1, // Monday
        startTime: '09:00',
        endTime: '17:00'
      }
    ],
    dateOverrides: []
  }

  it('returns available slots for basic availability', async () => {
    vi.mocked(prisma.eventType.findUnique).mockResolvedValue(mockEventType as any)
    vi.mocked(prisma.booking.findMany).mockResolvedValue([])

    const params = {
      eventTypeId: 'event-type-1',
      startDate: '2024-01-08', // Monday
      endDate: '2024-01-08',
      timezone: 'America/New_York'
    }

    const slots = await getAvailableSlots(params)

    expect(slots.length).toBeGreaterThan(0)
    expect(slots[0]).toMatchObject({
      duration: 30,
      localTime: expect.stringMatching(/^\d{2}:\d{2}$/)
    })
    expect(slots[0].time).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
  })

  it('returns empty array for inactive event type', async () => {
    const inactiveEventType = { ...mockEventType, isActive: false }
    vi.mocked(prisma.eventType.findUnique).mockResolvedValue(inactiveEventType as any)

    const params = {
      eventTypeId: 'event-type-1',
      startDate: '2024-01-08',
      endDate: '2024-01-08',
      timezone: 'America/New_York'
    }

    const slots = await getAvailableSlots(params)

    expect(slots).toEqual([])
  })

  it('returns empty array for non-existent event type', async () => {
    vi.mocked(prisma.eventType.findUnique).mockResolvedValue(null)

    const params = {
      eventTypeId: 'non-existent',
      startDate: '2024-01-08',
      endDate: '2024-01-08',
      timezone: 'America/New_York'
    }

    const slots = await getAvailableSlots(params)

    expect(slots).toEqual([])
  })

  it('delegates to team slots for team event types', async () => {
    const teamEventType = { ...mockEventType, teamId: 'team-1' }
    vi.mocked(prisma.eventType.findUnique).mockResolvedValue(teamEventType as any)

    const mockTeamSlots = [
      { time: '2024-01-08T14:00:00.000Z', localTime: '14:00', duration: 30 }
    ]
    vi.mocked(getTeamAvailableSlots).mockResolvedValue(mockTeamSlots as any)

    const params = {
      eventTypeId: 'event-type-1',
      startDate: '2024-01-08',
      endDate: '2024-01-08',
      timezone: 'America/New_York'
    }

    const slots = await getAvailableSlots(params)

    expect(getTeamAvailableSlots).toHaveBeenCalledWith(params)
    expect(slots).toEqual(mockTeamSlots)
  })

  it('falls back to user default schedule when event has no schedule', async () => {
    const eventTypeNoSchedule = { ...mockEventType, schedule: null, scheduleId: null }
    vi.mocked(prisma.eventType.findUnique).mockResolvedValue(eventTypeNoSchedule as any)

    // Mock fallback to default schedule
    vi.mocked(prisma.schedule.findFirst)
      .mockResolvedValueOnce(mockSchedule as any) // For default schedule lookup

    vi.mocked(prisma.booking.findMany).mockResolvedValue([])

    const params = {
      eventTypeId: 'event-type-1',
      startDate: '2024-01-08', // Monday
      endDate: '2024-01-08',
      timezone: 'America/New_York'
    }

    const slots = await getAvailableSlots(params)

    expect(prisma.schedule.findFirst).toHaveBeenCalledWith({
      where: {
        userId: 'user-1',
        isDefault: true
      },
      include: {
        availabilities: true,
        dateOverrides: true
      }
    })
    expect(slots.length).toBeGreaterThan(0)
  })

  it('falls back to first schedule when no default exists', async () => {
    const eventTypeNoSchedule = { ...mockEventType, schedule: null, scheduleId: null }
    vi.mocked(prisma.eventType.findUnique).mockResolvedValue(eventTypeNoSchedule as any)

    // Mock no default schedule, then first schedule
    vi.mocked(prisma.schedule.findFirst)
      .mockResolvedValueOnce(null) // No default schedule
      .mockResolvedValueOnce(mockSchedule as any) // First schedule

    vi.mocked(prisma.booking.findMany).mockResolvedValue([])

    const params = {
      eventTypeId: 'event-type-1',
      startDate: '2024-01-08', // Monday
      endDate: '2024-01-08',
      timezone: 'America/New_York'
    }

    const slots = await getAvailableSlots(params)

    expect(prisma.schedule.findFirst).toHaveBeenCalledTimes(2)
    expect(slots.length).toBeGreaterThan(0)
  })

  it('filters out conflicting booking slots', async () => {
    vi.mocked(prisma.eventType.findUnique).mockResolvedValue(mockEventType as any)

    // Mock existing booking that conflicts with some slots
    vi.mocked(prisma.booking.findMany).mockResolvedValue([
      {
        id: 'booking-1',
        startTime: new Date('2024-01-08T14:00:00.000Z'),
        endTime: new Date('2024-01-08T14:30:00.000Z'),
        status: 'ACCEPTED'
      }
    ] as any)

    const params = {
      eventTypeId: 'event-type-1',
      startDate: '2024-01-08', // Monday
      endDate: '2024-01-08',
      timezone: 'America/New_York'
    }

    const slots = await getAvailableSlots(params)

    // Should have slots but none at 14:00 UTC (conflicts with booking + buffers)
    const conflictingSlot = slots.find(slot => slot.time.includes('T14:00:00'))
    expect(conflictingSlot).toBeUndefined()
  })

  it('excludes cancelled and rejected bookings from conflicts', async () => {
    vi.mocked(prisma.eventType.findUnique).mockResolvedValue(mockEventType as any)

    // Mock cancelled/rejected bookings
    vi.mocked(prisma.booking.findMany).mockResolvedValue([])

    const params = {
      eventTypeId: 'event-type-1',
      startDate: '2024-01-08', // Monday
      endDate: '2024-01-08',
      timezone: 'America/New_York'
    }

    await getAvailableSlots(params)

    // Verify that query excludes cancelled/rejected
    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: {
            notIn: ['CANCELLED', 'REJECTED']
          }
        })
      })
    )
  })

  it('integrates Google Calendar busy times', async () => {
    const eventTypeWithCalendar = {
      ...mockEventType,
      user: {
        id: 'user-1',
        calendarConnections: [
          { id: 'connection-1', isPrimary: true }
        ]
      }
    }

    vi.mocked(prisma.eventType.findUnique).mockResolvedValue(eventTypeWithCalendar as any)
    vi.mocked(prisma.booking.findMany).mockResolvedValue([])

    // Mock Google Calendar busy time
    vi.mocked(getBusyTimes).mockResolvedValue([
      {
        start: '2024-01-08T15:00:00.000Z',
        end: '2024-01-08T15:30:00.000Z'
      }
    ])

    const params = {
      eventTypeId: 'event-type-1',
      startDate: '2024-01-08', // Monday
      endDate: '2024-01-08',
      timezone: 'America/New_York'
    }

    const slots = await getAvailableSlots(params)

    // Should not have slot at 15:00 UTC due to Google Calendar busy time
    const busySlot = slots.find(slot => slot.time.includes('T15:00:00'))
    expect(busySlot).toBeUndefined()

    expect(getBusyTimes).toHaveBeenCalledWith(
      'connection-1',
      expect.stringMatching(/2024-01-08T\d{2}:\d{2}:\d{2}.\d{3}Z/),
      expect.stringMatching(/2024-01-08T\d{2}:\d{2}:\d{2}.\d{3}Z/)
    )
  })

  it('handles Google Calendar errors gracefully', async () => {
    const eventTypeWithCalendar = {
      ...mockEventType,
      user: {
        id: 'user-1',
        calendarConnections: [
          { id: 'connection-1', isPrimary: true }
        ]
      }
    }

    vi.mocked(prisma.eventType.findUnique).mockResolvedValue(eventTypeWithCalendar as any)
    vi.mocked(prisma.booking.findMany).mockResolvedValue([])

    // Mock Google Calendar error
    vi.mocked(getBusyTimes).mockRejectedValue(new Error('Calendar API error'))

    const params = {
      eventTypeId: 'event-type-1',
      startDate: '2024-01-08', // Monday
      endDate: '2024-01-08',
      timezone: 'America/New_York'
    }

    const slots = await getAvailableSlots(params)

    // Should still return slots despite Google Calendar error
    expect(slots.length).toBeGreaterThan(0)
  })

  it('respects minimum notice requirement', async () => {
    // Set minimum notice to 2 hours (120 minutes)
    const eventTypeWithNotice = { ...mockEventType, minimumNotice: 120 }
    vi.mocked(prisma.eventType.findUnique).mockResolvedValue(eventTypeWithNotice as any)
    vi.mocked(prisma.booking.findMany).mockResolvedValue([])

    // Test with current date/time
    const now = new Date()
    const todayStr = now.toISOString().split('T')[0]

    const params = {
      eventTypeId: 'event-type-1',
      startDate: todayStr,
      endDate: todayStr,
      timezone: 'America/New_York'
    }

    const slots = await getAvailableSlots(params)

    // All returned slots should be at least 2 hours in the future
    slots.forEach(slot => {
      const slotTime = new Date(slot.time)
      const minimumTime = new Date(now.getTime() + (120 * 60 * 1000))
      expect(slotTime.getTime()).toBeGreaterThanOrEqual(minimumTime.getTime())
    })
  })

  it('respects future limit', async () => {
    const eventTypeWithLimit = { ...mockEventType, futureLimit: 30 } // 30 days
    vi.mocked(prisma.eventType.findUnique).mockResolvedValue(eventTypeWithLimit as any)
    vi.mocked(prisma.booking.findMany).mockResolvedValue([])

    // Test 60 days in the future (beyond limit)
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 60)
    const futureDateStr = futureDate.toISOString().split('T')[0]

    const params = {
      eventTypeId: 'event-type-1',
      startDate: futureDateStr,
      endDate: futureDateStr,
      timezone: 'America/New_York'
    }

    const slots = await getAvailableSlots(params)

    // Should be empty because it's beyond the 30-day future limit
    expect(slots).toEqual([])
  })

  it('applies daily booking limits', async () => {
    const eventTypeWithDailyLimit = { ...mockEventType, maxBookingsPerDay: 2 }
    vi.mocked(prisma.eventType.findUnique).mockResolvedValue(eventTypeWithDailyLimit as any)
    vi.mocked(prisma.booking.findMany).mockResolvedValue([])

    // Mock that user already has 2 bookings on this day
    vi.mocked(prisma.booking.count).mockResolvedValue(2)

    const params = {
      eventTypeId: 'event-type-1',
      startDate: '2024-01-08', // Monday
      endDate: '2024-01-08',
      timezone: 'America/New_York'
    }

    const slots = await getAvailableSlots(params)

    // Should be empty due to daily limit
    expect(slots).toEqual([])
  })

  it('applies weekly booking limits', async () => {
    const eventTypeWithWeeklyLimit = { ...mockEventType, maxBookingsPerWeek: 5 }
    vi.mocked(prisma.eventType.findUnique).mockResolvedValue(eventTypeWithWeeklyLimit as any)
    vi.mocked(prisma.booking.findMany).mockResolvedValue([])

    // Mock that user already has 5 bookings this week
    vi.mocked(prisma.booking.count).mockResolvedValue(5)

    const params = {
      eventTypeId: 'event-type-1',
      startDate: '2024-01-08', // Monday
      endDate: '2024-01-08',
      timezone: 'America/New_York'
    }

    const slots = await getAvailableSlots(params)

    // Should be empty due to weekly limit
    expect(slots).toEqual([])
  })

  it('uses date overrides instead of regular availability', async () => {
    const scheduleWithOverrides = {
      ...mockEventType.schedule,
      dateOverrides: [
        {
          id: 'override-1',
          date: new Date('2024-01-08'),
          startTime: '10:00',
          endTime: '12:00',
          isUnavailable: false
        }
      ]
    }

    const eventTypeWithOverrides = {
      ...mockEventType,
      schedule: scheduleWithOverrides
    }

    vi.mocked(prisma.eventType.findUnique).mockResolvedValue(eventTypeWithOverrides as any)
    vi.mocked(prisma.booking.findMany).mockResolvedValue([])

    const params = {
      eventTypeId: 'event-type-1',
      startDate: '2024-01-08', // Monday
      endDate: '2024-01-08',
      timezone: 'America/New_York'
    }

    const slots = await getAvailableSlots(params)

    // Should only have slots between 10:00-12:00, not the regular 09:00-17:00
    slots.forEach(slot => {
      const hour = parseInt(slot.localTime.split(':')[0])
      expect(hour).toBeGreaterThanOrEqual(10)
      expect(hour).toBeLessThan(12)
    })
  })

  it('handles unavailable date overrides', async () => {
    const scheduleWithUnavailableOverride = {
      ...mockEventType.schedule,
      dateOverrides: [
        {
          id: 'override-1',
          date: new Date('2024-01-08'),
          startTime: null,
          endTime: null,
          isUnavailable: true
        }
      ]
    }

    const eventTypeWithOverrides = {
      ...mockEventType,
      schedule: scheduleWithUnavailableOverride
    }

    vi.mocked(prisma.eventType.findUnique).mockResolvedValue(eventTypeWithOverrides as any)
    vi.mocked(prisma.booking.findMany).mockResolvedValue([])

    const params = {
      eventTypeId: 'event-type-1',
      startDate: '2024-01-08', // Monday
      endDate: '2024-01-08',
      timezone: 'America/New_York'
    }

    const slots = await getAvailableSlots(params)

    // Should be empty due to unavailable override
    expect(slots).toEqual([])
  })

  it('returns slots sorted by time', async () => {
    vi.mocked(prisma.eventType.findUnique).mockResolvedValue(mockEventType as any)
    vi.mocked(prisma.booking.findMany).mockResolvedValue([])

    const params = {
      eventTypeId: 'event-type-1',
      startDate: '2024-01-08', // Monday
      endDate: '2024-01-09', // Tuesday (multi-day test)
      timezone: 'America/New_York'
    }

    const slots = await getAvailableSlots(params)

    // Verify slots are sorted chronologically
    for (let i = 1; i < slots.length; i++) {
      const prevTime = new Date(slots[i - 1].time)
      const currentTime = new Date(slots[i].time)
      expect(currentTime.getTime()).toBeGreaterThanOrEqual(prevTime.getTime())
    }
  })

  it('handles custom slot intervals', async () => {
    const eventTypeWithInterval = { ...mockEventType, slotInterval: 15 }
    vi.mocked(prisma.eventType.findUnique).mockResolvedValue(eventTypeWithInterval as any)
    vi.mocked(prisma.booking.findMany).mockResolvedValue([])

    const params = {
      eventTypeId: 'event-type-1',
      startDate: '2024-01-08', // Monday
      endDate: '2024-01-08',
      timezone: 'America/New_York'
    }

    const slots = await getAvailableSlots(params)

    // With 15-minute intervals and 30-minute duration, should have more slots than with 30-minute intervals
    expect(slots.length).toBeGreaterThan(10) // Rough expectation based on 8-hour day
  })

  it('handles errors gracefully', async () => {
    vi.mocked(prisma.eventType.findUnique).mockRejectedValue(new Error('Database error'))

    const params = {
      eventTypeId: 'event-type-1',
      startDate: '2024-01-08',
      endDate: '2024-01-08',
      timezone: 'America/New_York'
    }

    const slots = await getAvailableSlots(params)

    // Should return empty array on error, not throw
    expect(slots).toEqual([])
  })
})