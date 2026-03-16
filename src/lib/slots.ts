// Slot calculation engine with timezone handling via @date-fns/tz
// Core algorithm for finding available booking slots

import { prisma } from "@/lib/prisma";
import { getBusyTimes } from "@/lib/google-calendar";
import { TZDate } from "@date-fns/tz";
import {
  startOfDay,
  endOfDay,
  addDays,
  parseISO,
  format,
  addMinutes,
  isBefore,
  isAfter,
} from "date-fns";
import type {
  EventType,
  Booking,
  Schedule,
  Availability,
  DateOverride,
  CalendarConnection,
  User,
} from "@/generated/prisma";

export interface SlotResult {
  time: string; // ISO string in UTC
  localTime: string; // HH:mm in attendee's timezone
  duration: number; // minutes
}

export interface GetAvailableSlotsParams {
  eventTypeId: string;
  startDate: string; // YYYY-MM-DD in attendee's timezone
  endDate: string; // YYYY-MM-DD in attendee's timezone
  timezone: string; // Attendee's IANA timezone
}

/**
 * Get available slots for booking
 * Core slot calculation algorithm with timezone handling
 */
export async function getAvailableSlots(
  params: GetAvailableSlotsParams,
): Promise<SlotResult[]> {
  try {
    const { eventTypeId, startDate, endDate, timezone } = params;

    // Load event type with schedule and user
    const eventType = await prisma.eventType.findUnique({
      where: { id: eventTypeId },
      include: {
        user: {
          include: {
            calendarConnections: {
              where: { isPrimary: true },
            },
          },
        },
        schedule: {
          include: {
            availabilities: true,
            dateOverrides: true,
          },
        },
      },
    });

    if (!eventType) {
      throw new Error(`Event type ${eventTypeId} not found`);
    }

    if (!eventType.isActive) {
      return [];
    }

    // For team event types, delegate to team slots
    if (eventType.teamId) {
      const { getTeamAvailableSlots } = await import("@/lib/team-slots");
      return await getTeamAvailableSlots(params);
    }

    if (!eventType.user) {
      throw new Error("Event type must have a user or team");
    }

    // Determine which schedule to use
    let schedule = eventType.schedule;
    if (!schedule) {
      // Fall back to user's default schedule
      schedule = await prisma.schedule.findFirst({
        where: {
          userId: eventType.user.id,
          isDefault: true,
        },
        include: {
          availabilities: true,
          dateOverrides: true,
        },
      });
    }

    if (!schedule) {
      // Fall back to user's first schedule
      schedule = await prisma.schedule.findFirst({
        where: {
          userId: eventType.user.id,
        },
        include: {
          availabilities: true,
          dateOverrides: true,
        },
      });
    }

    if (!schedule) {
      return [];
    }

    const slots: SlotResult[] = [];

    // Parse date range in attendee timezone
    const startDateObj = parseISO(`${startDate}T00:00:00`);
    const endDateObj = parseISO(`${endDate}T23:59:59`);

    // Convert to UTC timezone boundaries for database queries
    const startDateTZ = new TZDate(startOfDay(startDateObj), timezone);
    const endDateTZ = new TZDate(endOfDay(endDateObj), timezone);

    // Load existing bookings in the date range (exclude cancelled/rejected)
    const existingBookings = await prisma.booking.findMany({
      where: {
        userId: eventType.user.id,
        startTime: {
          gte: startDateTZ,
          lte: endDateTZ,
        },
        status: {
          notIn: ["CANCELLED", "REJECTED"],
        },
      },
    });

    // Get busy times from Google Calendar if connected
    let googleBusyTimes: Array<{ start: string; end: string }> = [];
    if (eventType.user.calendarConnections.length > 0) {
      const primaryConnection = eventType.user.calendarConnections[0];
      try {
        // Convert TZDate to UTC for API calls
        const timeMin = new Date(startDateTZ).toISOString();
        const timeMax = new Date(endDateTZ).toISOString();
        googleBusyTimes = await getBusyTimes(
          primaryConnection.id,
          timeMin,
          timeMax,
        );
      } catch (error) {
        console.warn("Failed to get Google Calendar busy times:", error);
        // Continue without Google Calendar data - never fail the booking
      }
    }

    // Process each day in the range
    let currentDate = startDateObj;
    while (currentDate <= endDateObj) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      const dayOfWeek = currentDate.getDay();

      // Check for date overrides first (they have priority)
      const dateOverride = schedule.dateOverrides.find(
        (override) => format(override.date, "yyyy-MM-dd") === dateStr,
      );

      let daySlots: SlotResult[] = [];

      if (dateOverride) {
        if (
          !dateOverride.isUnavailable &&
          dateOverride.startTime &&
          dateOverride.endTime
        ) {
          // Use override time range
          daySlots = generateSlotsForTimeRange(
            currentDate,
            dateOverride.startTime,
            dateOverride.endTime,
            schedule.timezone,
            timezone,
            eventType,
          );
        }
        // If override is unavailable or has no times, daySlots stays empty
      } else {
        // Use regular availability for this day of week
        const availabilities = schedule.availabilities.filter(
          (avail) => avail.day === dayOfWeek,
        );

        for (const availability of availabilities) {
          const timeRangeSlots = generateSlotsForTimeRange(
            currentDate,
            availability.startTime,
            availability.endTime,
            schedule.timezone,
            timezone,
            eventType,
          );
          daySlots.push(...timeRangeSlots);
        }
      }

      // Filter out conflicts with existing bookings and Google Calendar
      daySlots = filterConflictingSlots(
        daySlots,
        existingBookings,
        googleBusyTimes,
        eventType,
      );

      slots.push(...daySlots);
      currentDate = addDays(currentDate, 1);
    }

    // Apply booking limits and other filters
    const filteredSlots = await applyBookingLimits(
      slots,
      eventType.user.id,
      eventType,
      timezone,
    );

    // Sort by time and return
    return filteredSlots.sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
    );
  } catch (error) {
    console.error("Error getting available slots:", error);
    return [];
  }
}

/**
 * Generate slot candidates for a specific time range
 */
function generateSlotsForTimeRange(
  date: Date,
  startTime: string, // "HH:mm" format
  endTime: string, // "HH:mm" format
  scheduleTimezone: string,
  attendeeTimezone: string,
  eventType: EventType,
): SlotResult[] {
  const slots: SlotResult[] = [];

  // Parse start and end times
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  // Create TZDate instances directly in the schedule timezone
  const startUTC = new TZDate(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    startHour,
    startMinute,
    0,
    scheduleTimezone,
  );
  const endUTC = new TZDate(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    endHour,
    endMinute,
    0,
    scheduleTimezone,
  );

  // Generate candidate slots
  const slotInterval = eventType.slotInterval || eventType.duration;
  let currentSlot = new Date(startUTC);

  while (
    currentSlot.getTime() + eventType.duration * 60 * 1000 <=
    endUTC.getTime()
  ) {
    // Convert to attendee timezone for display
    const localTime = new TZDate(currentSlot, attendeeTimezone);

    slots.push({
      time: currentSlot.toISOString(),
      localTime: format(localTime, "HH:mm"),
      duration: eventType.duration,
    });

    currentSlot = addMinutes(currentSlot, slotInterval);
  }

  return slots;
}

/**
 * Filter out slots that conflict with existing bookings or Google Calendar
 */
function filterConflictingSlots(
  slots: SlotResult[],
  existingBookings: Booking[],
  googleBusyTimes: Array<{ start: string; end: string }>,
  eventType: EventType,
): SlotResult[] {
  return slots.filter((slot) => {
    const slotStart = new Date(slot.time);
    const slotEnd = addMinutes(slotStart, eventType.duration);

    // Apply before and after buffers
    const bufferedStart = addMinutes(slotStart, -(eventType.beforeBuffer || 0));
    const bufferedEnd = addMinutes(slotEnd, eventType.afterBuffer || 0);

    // Check minimum notice requirement
    if (eventType.minimumNotice) {
      const now = new Date();
      const minimumTime = addMinutes(now, eventType.minimumNotice);
      if (isBefore(slotStart, minimumTime)) {
        return false;
      }
    }

    // Check future limit
    if (eventType.futureLimit) {
      const now = new Date();
      const maxTime = addDays(now, eventType.futureLimit);
      if (isAfter(slotStart, maxTime)) {
        return false;
      }
    }

    // Check against existing bookings
    for (const booking of existingBookings) {
      // Check if slot conflicts with booking (considering buffers)
      if (
        isBefore(bufferedStart, booking.endTime) &&
        isAfter(bufferedEnd, booking.startTime)
      ) {
        return false;
      }
    }

    // Check against Google Calendar busy times
    for (const busyTime of googleBusyTimes) {
      const busyStart = new Date(busyTime.start);
      const busyEnd = new Date(busyTime.end);

      if (isBefore(bufferedStart, busyEnd) && isAfter(bufferedEnd, busyStart)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Apply daily and weekly booking limits
 */
async function applyBookingLimits(
  slots: SlotResult[],
  userId: string,
  eventType: EventType,
  attendeeTimezone: string,
): Promise<SlotResult[]> {
  if (!eventType.maxBookingsPerDay && !eventType.maxBookingsPerWeek) {
    return slots;
  }

  const filteredSlots: SlotResult[] = [];

  for (const slot of slots) {
    const slotDate = new TZDate(new Date(slot.time), attendeeTimezone);

    // Check daily limit
    if (eventType.maxBookingsPerDay) {
      const dayStart = startOfDay(slotDate);
      const dayEnd = endOfDay(slotDate);

      const dayBookings = await prisma.booking.count({
        where: {
          userId,
          eventTypeId: eventType.id,
          startTime: {
            gte: new TZDate(dayStart, attendeeTimezone),
            lte: new TZDate(dayEnd, attendeeTimezone),
          },
          status: {
            notIn: ["CANCELLED", "REJECTED"],
          },
        },
      });

      if (dayBookings >= eventType.maxBookingsPerDay) {
        continue;
      }
    }

    // Check weekly limit
    if (eventType.maxBookingsPerWeek) {
      const weekStart = startOfDay(slotDate);
      // Adjust to start of week (Sunday = 0)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());

      const weekEnd = endOfDay(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekBookings = await prisma.booking.count({
        where: {
          userId,
          eventTypeId: eventType.id,
          startTime: {
            gte: new TZDate(weekStart, attendeeTimezone),
            lte: new TZDate(weekEnd, attendeeTimezone),
          },
          status: {
            notIn: ["CANCELLED", "REJECTED"],
          },
        },
      });

      if (weekBookings >= eventType.maxBookingsPerWeek) {
        continue;
      }
    }

    filteredSlots.push(slot);
  }

  return filteredSlots;
}
