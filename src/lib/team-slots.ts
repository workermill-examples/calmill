// Team slot calculation for round-robin and collective scheduling
// Handles union/intersection of member availability and assignment logic

import { prisma } from '@/lib/prisma'
import { getBusyTimes } from '@/lib/google-calendar'
import { TZDate } from '@date-fns/tz'
import { startOfDay, endOfDay, addDays, parseISO, format } from 'date-fns'
import type { EventType, TeamMember, User, Schedule, Availability, DateOverride, Booking, CalendarConnection } from '@/generated/prisma'

interface SlotCandidate {
  time: string // ISO string in UTC
  localTime: string // Formatted time in attendee timezone
  duration: number
  assignedUserId?: string // For round-robin assignment
}

interface TeamSlotParams {
  eventTypeId: string
  startDate: string // YYYY-MM-DD in attendee's timezone
  endDate: string // YYYY-MM-DD in attendee's timezone
  timezone: string // Attendee's IANA timezone
}

/**
 * Get available slots for team event types
 * Handles both ROUND_ROBIN (union of availability) and COLLECTIVE (intersection)
 */
export async function getTeamAvailableSlots(params: TeamSlotParams): Promise<SlotCandidate[]> {
  try {
    const { eventTypeId, startDate, endDate, timezone } = params

    // Load event type with team and members
    const eventType = await prisma.eventType.findUnique({
      where: { id: eventTypeId },
      include: {
        team: {
          include: {
            members: {
              where: { accepted: true },
              include: {
                user: {
                  include: {
                    schedules: {
                      include: {
                        availabilities: true,
                        dateOverrides: true
                      }
                    },
                    calendarConnections: {
                      where: { isPrimary: true }
                    }
                  }
                }
              }
            }
          }
        },
        schedule: {
          include: {
            availabilities: true,
            dateOverrides: true
          }
        }
      }
    })

    if (!eventType?.team) {
      throw new Error('Event type is not associated with a team')
    }

    if (!eventType.schedulingType) {
      throw new Error('Team event type must have a scheduling type')
    }

    const teamMembers = eventType.team.members
    if (teamMembers.length === 0) {
      return []
    }

    // Get slots for each team member
    const memberSlots = await Promise.all(
      teamMembers.map(member => getMemberSlots(member, eventType, startDate, endDate, timezone))
    )

    // Apply scheduling logic based on type
    if (eventType.schedulingType === 'ROUND_ROBIN') {
      return calculateRoundRobinSlots(memberSlots, teamMembers, eventType, timezone)
    } else if (eventType.schedulingType === 'COLLECTIVE') {
      return calculateCollectiveSlots(memberSlots, teamMembers, eventType, timezone)
    }

    return []
  } catch (error) {
    console.error('Error getting team available slots:', error)
    return []
  }
}

/**
 * Get available slots for a single team member
 */
async function getMemberSlots(
  teamMember: TeamMember & { user: User & { schedules: (Schedule & { availabilities: Availability[], dateOverrides: DateOverride[] })[], calendarConnections: CalendarConnection[] } },
  eventType: EventType & { schedule?: Schedule & { availabilities: Availability[], dateOverrides: DateOverride[] } | null },
  startDate: string,
  endDate: string,
  attendeeTimezone: string
): Promise<{ userId: string; slots: SlotCandidate[] }> {
  const user = teamMember.user

  // Determine which schedule to use
  // Priority: event type schedule > user's default schedule > user's first schedule
  let schedule = eventType.schedule
  if (!schedule) {
    schedule = user.schedules.find(s => s.isDefault) || user.schedules[0]
  }

  if (!schedule) {
    return { userId: user.id, slots: [] }
  }

  const userSlots = await calculateUserSlots(
    user,
    schedule,
    eventType,
    startDate,
    endDate,
    attendeeTimezone
  )

  return { userId: user.id, slots: userSlots }
}

/**
 * Calculate slots for a single user (adapted from main slots.ts logic)
 */
async function calculateUserSlots(
  user: User & { calendarConnections: CalendarConnection[] },
  schedule: Schedule & { availabilities: Availability[], dateOverrides: DateOverride[] },
  eventType: EventType,
  startDate: string,
  endDate: string,
  attendeeTimezone: string
): Promise<SlotCandidate[]> {
  const slots: SlotCandidate[] = []

  // Parse date range in attendee timezone
  const startDateObj = parseISO(`${startDate}T00:00:00`)
  const endDateObj = parseISO(`${endDate}T23:59:59`)

  // Get existing bookings for this user in the date range
  const startDateTZ = new TZDate(startOfDay(startDateObj), attendeeTimezone)
  const endDateTZ = new TZDate(endOfDay(endDateObj), attendeeTimezone)

  const existingBookings = await prisma.booking.findMany({
    where: {
      userId: user.id,
      startTime: {
        gte: startDateTZ,
        lte: endDateTZ
      },
      status: {
        notIn: ['CANCELLED', 'REJECTED']
      }
    }
  })

  // Get busy times from Google Calendar if connected
  let googleBusyTimes: Array<{ start: string; end: string }> = []
  if (user.calendarConnections.length > 0) {
    const primaryConnection = user.calendarConnections[0]
    try {
      const timeMin = startDateTZ.toISOString()
      const timeMax = endDateTZ.toISOString()
      googleBusyTimes = await getBusyTimes(primaryConnection.id, timeMin, timeMax)
    } catch (error) {
      console.warn('Failed to get Google Calendar busy times:', error)
    }
  }

  // Process each day
  let currentDate = startDateObj
  while (currentDate <= endDateObj) {
    const dateStr = format(currentDate, 'yyyy-MM-dd')
    const dayOfWeek = currentDate.getDay()

    // Check for date overrides first
    const dateOverride = schedule.dateOverrides.find(override =>
      format(override.date, 'yyyy-MM-dd') === dateStr
    )

    let daySlots: SlotCandidate[] = []

    if (dateOverride) {
      if (!dateOverride.isUnavailable && dateOverride.startTime && dateOverride.endTime) {
        daySlots = generateSlotsForTimeRange(
          currentDate,
          dateOverride.startTime,
          dateOverride.endTime,
          schedule.timezone,
          attendeeTimezone,
          eventType
        )
      }
    } else {
      // Use regular availability
      const availabilities = schedule.availabilities.filter(avail => avail.day === dayOfWeek)

      for (const availability of availabilities) {
        const timeRangeSlots = generateSlotsForTimeRange(
          currentDate,
          availability.startTime,
          availability.endTime,
          schedule.timezone,
          attendeeTimezone,
          eventType
        )
        daySlots.push(...timeRangeSlots)
      }
    }

    // Filter out conflicts with existing bookings and Google Calendar
    daySlots = filterConflictingSlots(daySlots, existingBookings, googleBusyTimes, eventType)

    slots.push(...daySlots)
    currentDate = addDays(currentDate, 1)
  }

  // Apply booking limits
  return applyBookingLimits(slots, user.id, eventType, attendeeTimezone)
}

/**
 * Generate slot candidates for a specific time range
 */
function generateSlotsForTimeRange(
  date: Date,
  startTime: string,
  endTime: string,
  scheduleTimezone: string,
  attendeeTimezone: string,
  eventType: EventType
): SlotCandidate[] {
  const slots: SlotCandidate[] = []

  // Parse start and end times in schedule timezone
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)

  const startDateTime = new Date(date)
  startDateTime.setHours(startHour, startMinute, 0, 0)

  const endDateTime = new Date(date)
  endDateTime.setHours(endHour, endMinute, 0, 0)

  // Convert to UTC using TZDate
  const startUTC = new TZDate(startDateTime, scheduleTimezone)
  const endUTC = new TZDate(endDateTime, scheduleTimezone)

  // Generate slots at the specified interval
  const slotInterval = eventType.slotInterval || eventType.duration
  let currentSlot = new Date(startUTC)

  while (currentSlot.getTime() + (eventType.duration * 60 * 1000) <= endUTC.getTime()) {
    const slotEnd = new Date(currentSlot.getTime() + (eventType.duration * 60 * 1000))

    // Convert to attendee timezone for display
    const localTime = new TZDate(currentSlot, attendeeTimezone)

    slots.push({
      time: currentSlot.toISOString(),
      localTime: format(localTime, 'HH:mm'),
      duration: eventType.duration
    })

    currentSlot = new Date(currentSlot.getTime() + (slotInterval * 60 * 1000))
  }

  return slots
}

/**
 * Filter out slots that conflict with existing bookings or Google Calendar
 */
function filterConflictingSlots(
  slots: SlotCandidate[],
  existingBookings: Booking[],
  googleBusyTimes: Array<{ start: string; end: string }>,
  eventType: EventType
): SlotCandidate[] {
  return slots.filter(slot => {
    const slotStart = new Date(slot.time)
    const slotEnd = new Date(slotStart.getTime() + (eventType.duration * 60 * 1000))

    // Add buffers
    const bufferedStart = new Date(slotStart.getTime() - (eventType.beforeBuffer * 60 * 1000))
    const bufferedEnd = new Date(slotEnd.getTime() + (eventType.afterBuffer * 60 * 1000))

    // Check against existing bookings
    for (const booking of existingBookings) {
      if (bufferedStart < booking.endTime && bufferedEnd > booking.startTime) {
        return false
      }
    }

    // Check against Google Calendar busy times
    for (const busyTime of googleBusyTimes) {
      const busyStart = new Date(busyTime.start)
      const busyEnd = new Date(busyTime.end)

      if (bufferedStart < busyEnd && bufferedEnd > busyStart) {
        return false
      }
    }

    // Check minimum notice
    if (eventType.minimumNotice) {
      const now = new Date()
      const minimumTime = new Date(now.getTime() + (eventType.minimumNotice * 60 * 1000))
      if (slotStart < minimumTime) {
        return false
      }
    }

    // Check future limit
    if (eventType.futureLimit) {
      const now = new Date()
      const maxTime = new Date(now.getTime() + (eventType.futureLimit * 24 * 60 * 60 * 1000))
      if (slotStart > maxTime) {
        return false
      }
    }

    return true
  })
}

/**
 * Apply daily and weekly booking limits
 */
async function applyBookingLimits(
  slots: SlotCandidate[],
  userId: string,
  eventType: EventType,
  attendeeTimezone: string
): Promise<SlotCandidate[]> {
  if (!eventType.maxBookingsPerDay && !eventType.maxBookingsPerWeek) {
    return slots
  }

  const filteredSlots: SlotCandidate[] = []

  for (const slot of slots) {
    const slotDate = new TZDate(new Date(slot.time), attendeeTimezone)

    // Check daily limit
    if (eventType.maxBookingsPerDay) {
      const dayStart = startOfDay(slotDate)
      const dayEnd = endOfDay(slotDate)

      const dayBookings = await prisma.booking.count({
        where: {
          userId,
          eventTypeId: eventType.id,
          startTime: {
            gte: new TZDate(dayStart, attendeeTimezone),
            lte: new TZDate(dayEnd, attendeeTimezone)
          },
          status: {
            notIn: ['CANCELLED', 'REJECTED']
          }
        }
      })

      if (dayBookings >= eventType.maxBookingsPerDay) {
        continue
      }
    }

    // Check weekly limit
    if (eventType.maxBookingsPerWeek) {
      const weekStart = startOfDay(slotDate)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      const weekEnd = endOfDay(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)

      const weekBookings = await prisma.booking.count({
        where: {
          userId,
          eventTypeId: eventType.id,
          startTime: {
            gte: new TZDate(weekStart, attendeeTimezone),
            lte: new TZDate(weekEnd, attendeeTimezone)
          },
          status: {
            notIn: ['CANCELLED', 'REJECTED']
          }
        }
      })

      if (weekBookings >= eventType.maxBookingsPerWeek) {
        continue
      }
    }

    filteredSlots.push(slot)
  }

  return filteredSlots
}

/**
 * Calculate Round-Robin slots (union of member availability)
 * Available if ANY member is free, assign to member with fewest bookings
 */
function calculateRoundRobinSlots(
  memberSlots: Array<{ userId: string; slots: SlotCandidate[] }>,
  teamMembers: Array<TeamMember & { user: User }>,
  eventType: EventType,
  attendeeTimezone: string
): SlotCandidate[] {
  const allSlots: Map<string, SlotCandidate[]> = new Map()

  // Collect all unique time slots
  memberSlots.forEach(({ userId, slots }) => {
    slots.forEach(slot => {
      if (!allSlots.has(slot.time)) {
        allSlots.set(slot.time, [])
      }
      allSlots.get(slot.time)!.push({ ...slot, assignedUserId: userId })
    })
  })

  // For each time slot, assign to the member with fewest bookings
  const finalSlots: SlotCandidate[] = []

  for (const [timeSlot, availableMembers] of allSlots) {
    if (availableMembers.length > 0) {
      // Find member with fewest bookings (simplified - in real implementation would check booking counts)
      // For now, just use the first available member
      const selectedMember = availableMembers[0]
      finalSlots.push(selectedMember)
    }
  }

  return finalSlots.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
}

/**
 * Calculate Collective slots (intersection of member availability)
 * Available ONLY if ALL members are free
 */
function calculateCollectiveSlots(
  memberSlots: Array<{ userId: string; slots: SlotCandidate[] }>,
  teamMembers: Array<TeamMember & { user: User }>,
  eventType: EventType,
  attendeeTimezone: string
): SlotCandidate[] {
  if (memberSlots.length === 0) {
    return []
  }

  // Start with first member's slots
  const [firstMember, ...otherMembers] = memberSlots
  let commonSlots = new Map(firstMember.slots.map(slot => [slot.time, slot]))

  // Find intersection with all other members
  otherMembers.forEach(({ slots }) => {
    const memberSlotTimes = new Set(slots.map(slot => slot.time))

    // Remove slots that this member doesn't have
    for (const [timeSlot] of commonSlots) {
      if (!memberSlotTimes.has(timeSlot)) {
        commonSlots.delete(timeSlot)
      }
    }
  })

  return Array.from(commonSlots.values()).sort((a, b) =>
    new Date(a.time).getTime() - new Date(b.time).getTime()
  )
}

/**
 * Assign host for round-robin booking
 * Finds team member with fewest bookings in the last 30 days
 */
export async function assignRoundRobinHost(
  eventTypeId: string,
  requestedTime: string // ISO string
): Promise<string | null> {
  try {
    const eventType = await prisma.eventType.findUnique({
      where: { id: eventTypeId },
      include: {
        team: {
          include: {
            members: {
              where: { accepted: true },
              include: { user: true }
            }
          }
        }
      }
    })

    if (!eventType?.team || eventType.schedulingType !== 'ROUND_ROBIN') {
      return null
    }

    const members = eventType.team.members
    if (members.length === 0) {
      return null
    }

    // Get booking counts for each member in last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const memberBookingCounts = await Promise.all(
      members.map(async (member) => {
        const count = await prisma.booking.count({
          where: {
            userId: member.userId,
            eventTypeId,
            startTime: {
              gte: thirtyDaysAgo
            },
            status: {
              notIn: ['CANCELLED', 'REJECTED']
            }
          }
        })

        return { userId: member.userId, count }
      })
    )

    // Find member(s) with fewest bookings
    const minCount = Math.min(...memberBookingCounts.map(m => m.count))
    const candidatesWithMinCount = memberBookingCounts.filter(m => m.count === minCount)

    // If tie, use least recently assigned (simplified - just pick first for now)
    return candidatesWithMinCount[0].userId
  } catch (error) {
    console.error('Error assigning round-robin host:', error)
    return null
  }
}

/**
 * Get all team members for collective booking
 */
export async function getCollectiveMembers(eventTypeId: string): Promise<string[]> {
  try {
    const eventType = await prisma.eventType.findUnique({
      where: { id: eventTypeId },
      include: {
        team: {
          include: {
            members: {
              where: { accepted: true }
            }
          }
        }
      }
    })

    if (!eventType?.team || eventType.schedulingType !== 'COLLECTIVE') {
      return []
    }

    return eventType.team.members.map(member => member.userId)
  } catch (error) {
    console.error('Error getting collective members:', error)
    return []
  }
}