import { addMinutes, format, getDay, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { TZDate } from '@date-fns/tz';
import { prisma } from '@/lib/prisma';
import type { AvailableSlot } from '@/types';
import type { Availability, DateOverride } from '@/generated/prisma/client';
import { GoogleCalendarService } from '@/lib/google-calendar';

// ─── TYPES ──────────────────────────────────────────────────────────────────

type SlotParams = {
  eventTypeId: string;
  startDate: string; // YYYY-MM-DD in attendee's timezone
  endDate: string; // YYYY-MM-DD in attendee's timezone
  timezone: string; // Attendee's IANA timezone
};

type TimeWindow = {
  start: Date; // UTC
  end: Date; // UTC
};

type ExistingBooking = {
  startTime: Date;
  endTime: Date;
};

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export async function getAvailableSlots(params: SlotParams): Promise<AvailableSlot[]> {
  const { eventTypeId, startDate, endDate, timezone } = params;

  // 1. Load event type with schedule, availability, and date overrides
  const eventType = await prisma.eventType.findUnique({
    where: { id: eventTypeId, isActive: true },
    include: {
      schedule: {
        include: {
          availability: true,
          dateOverrides: true,
        },
      },
    },
  });

  if (!eventType || !eventType.schedule) {
    return [];
  }

  const schedule = eventType.schedule;
  const scheduleTimezone = schedule.timezone;

  // 2. Determine date range bounds in UTC
  // Parse startDate/endDate as days in the attendee's timezone
  const [startYear, startMonth, startDay] = startDate.split('-').map(Number) as [
    number,
    number,
    number,
  ];
  const [endYear, endMonth, endDay] = endDate.split('-').map(Number) as [number, number, number];

  // First moment of startDate in attendee's timezone → UTC
  const rangeStart = new TZDate(startYear, startMonth - 1, startDay, 0, 0, 0, 0, timezone);
  // Last moment of endDate in attendee's timezone → UTC
  const rangeEnd = new TZDate(endYear, endMonth - 1, endDay, 23, 59, 59, 999, timezone);

  const now = new Date();
  const futureLimitDate = addDays(now, eventType.futureLimit);

  // 3. Load existing bookings in the range (PENDING and ACCEPTED only)
  const calMillBookings: ExistingBooking[] = await prisma.booking.findMany({
    where: {
      eventTypeId: eventTypeId,
      startTime: { lte: new Date(rangeEnd.getTime()) },
      endTime: { gte: new Date(rangeStart.getTime()) },
      status: { in: ['PENDING', 'ACCEPTED'] },
    },
    select: {
      startTime: true,
      endTime: true,
    },
  });

  // 3b. Fetch busy times from connected Google Calendars and merge with bookings
  const calendarConnections = await prisma.calendarConnection.findMany({
    where: { userId: eventType.userId },
  });

  let calendarBusyTimes: ExistingBooking[] = [];
  if (calendarConnections.length > 0) {
    const busyTimeResults = await Promise.allSettled(
      calendarConnections.map(async (connection) => {
        const service = new GoogleCalendarService(connection);
        return service.getBusyTimes(new Date(rangeStart.getTime()), new Date(rangeEnd.getTime()));
      })
    );

    for (const result of busyTimeResults) {
      if (result.status === 'fulfilled') {
        // Convert BusyTime { start, end } to ExistingBooking { startTime, endTime }
        const converted: ExistingBooking[] = result.value.map((bt) => ({
          startTime: bt.start,
          endTime: bt.end,
        }));
        calendarBusyTimes = calendarBusyTimes.concat(converted);
      } else {
        console.warn('[Slots] Failed to fetch Google Calendar busy times:', result.reason);
      }
    }
  }

  // Merge internal bookings with external calendar busy times
  const existingBookings: ExistingBooking[] = [...calMillBookings, ...calendarBusyTimes];

  // 4. Build date overrides map (keyed by YYYY-MM-DD in the schedule's timezone)
  // @db.Date comes back as UTC midnight; we reformat it in the schedule's timezone
  // to get the correct calendar date for the host's perspective.
  const overrideMap = new Map<string, DateOverride>();
  for (const override of schedule.dateOverrides) {
    const key = format(new TZDate(override.date, scheduleTimezone), 'yyyy-MM-dd');
    overrideMap.set(key, override);
  }

  // 5. Build availability map (keyed by day-of-week 0-6)
  const availabilityMap = new Map<number, Availability[]>();
  for (const avail of schedule.availability) {
    const existing = availabilityMap.get(avail.day) ?? [];
    existing.push(avail);
    availabilityMap.set(avail.day, existing);
  }

  // 6. Iterate over each day in the requested range
  const slots: AvailableSlot[] = [];

  let currentDay = new TZDate(startYear, startMonth - 1, startDay, 0, 0, 0, 0, timezone);

  while (currentDay.getTime() <= rangeEnd.getTime()) {
    // Get calendar date key in the schedule's timezone for override lookups
    // (overrides are stored with the schedule's timezone perspective)
    const dayKey = format(new TZDate(currentDay, scheduleTimezone), 'yyyy-MM-dd');

    // Check future limit — skip days beyond futureLimit
    const dayStartUTC = new Date(currentDay.getTime());
    if (dayStartUTC > futureLimitDate) {
      break;
    }

    // Determine availability windows for this day
    const windows = getWindowsForDay(
      currentDay,
      scheduleTimezone,
      dayKey,
      overrideMap,
      availabilityMap
    );

    if (windows.length > 0) {
      // Count existing bookings for daily/weekly limit checks
      const dayStart = new TZDate(
        currentDay.getFullYear(),
        currentDay.getMonth(),
        currentDay.getDate(),
        0,
        0,
        0,
        0,
        timezone
      );
      const dayEnd = new TZDate(
        currentDay.getFullYear(),
        currentDay.getMonth(),
        currentDay.getDate(),
        23,
        59,
        59,
        999,
        timezone
      );

      const bookingsThisDay = existingBookings.filter(
        (b) => b.startTime < new Date(dayEnd.getTime()) && b.endTime > new Date(dayStart.getTime())
      );

      // Weekly limit: Mon-Sun week containing this day (in UTC for simplicity)
      let bookingsThisWeek: ExistingBooking[] = [];
      if (eventType.maxBookingsPerWeek) {
        const weekStart = startOfWeek(new Date(currentDay.getTime()), { weekStartsOn: 1 });
        const weekEnd = endOfWeek(new Date(currentDay.getTime()), { weekStartsOn: 1 });
        bookingsThisWeek = existingBookings.filter(
          (b) => b.startTime < weekEnd && b.endTime > weekStart
        );
      }

      // Check daily limit before generating slots for this day
      if (
        eventType.maxBookingsPerDay !== null &&
        bookingsThisDay.length >= eventType.maxBookingsPerDay
      ) {
        // Skip all slots this day
        currentDay = addDaysTZ(currentDay, timezone);
        continue;
      }

      // Check weekly limit
      if (
        eventType.maxBookingsPerWeek !== null &&
        bookingsThisWeek.length >= eventType.maxBookingsPerWeek
      ) {
        // Skip remaining days this week
        currentDay = addDaysTZ(currentDay, timezone);
        continue;
      }

      for (const window of windows) {
        const windowSlots = generateSlotsForWindow({
          window,
          eventType: {
            duration: eventType.duration,
            slotInterval: eventType.slotInterval,
            beforeBuffer: eventType.beforeBuffer,
            afterBuffer: eventType.afterBuffer,
            minimumNotice: eventType.minimumNotice,
            maxBookingsPerDay: eventType.maxBookingsPerDay ?? null,
            maxBookingsPerWeek: eventType.maxBookingsPerWeek ?? null,
          },
          existingBookings,
          bookingsThisDay,
          bookingsThisWeek,
          now,
          futureLimitDate,
          attendeeTimezone: timezone,
        });
        slots.push(...windowSlots);
      }
    }

    currentDay = addDaysTZ(currentDay, timezone);
  }

  return slots;
}

// ─── HELPER: Get next day in a timezone ──────────────────────────────────────

function addDaysTZ(date: TZDate, timezone: string): TZDate {
  return new TZDate(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0, 0, timezone);
}

// ─── HELPER: Determine availability windows for a day ───────────────────────

function getWindowsForDay(
  day: TZDate, // start of day in attendee timezone
  scheduleTimezone: string,
  dayKey: string, // YYYY-MM-DD in scheduleTimezone (used for override and window lookups)
  overrideMap: Map<string, DateOverride>,
  availabilityMap: Map<number, Availability[]>
): TimeWindow[] {
  // We need to check overrides using the schedule's timezone date key
  // But since the date is the same calendar day we passed in (dayKey is already correct
  // for the attendee timezone, but overrides are stored as UTC dates), we use dayKey
  // directly as both are the same calendar date.
  const override = overrideMap.get(dayKey);

  if (override) {
    if (override.isUnavailable) {
      return [];
    }
    if (override.startTime && override.endTime) {
      // Use override times, interpreted in schedule's timezone on this calendar day
      const window = parseWindowInTimezone(
        dayKey,
        override.startTime,
        override.endTime,
        scheduleTimezone
      );
      return window ? [window] : [];
    }
  }

  // No override — use regular availability for this day-of-week
  // Get day of week in the schedule's timezone (since availability is defined in host's schedule)
  const dayInScheduleTz = new TZDate(day, scheduleTimezone);
  const dayOfWeek = getDay(dayInScheduleTz);
  const availabilities = availabilityMap.get(dayOfWeek) ?? [];

  const windows: TimeWindow[] = [];
  for (const avail of availabilities) {
    const window = parseWindowInTimezone(dayKey, avail.startTime, avail.endTime, scheduleTimezone);
    if (window) {
      windows.push(window);
    }
  }
  return windows;
}

// ─── HELPER: Parse HH:mm window in schedule timezone for a calendar date ────

function parseWindowInTimezone(
  dateKey: string, // YYYY-MM-DD
  startTime: string, // HH:mm
  endTime: string, // HH:mm
  timezone: string
): TimeWindow | null {
  const [year, month, day] = dateKey.split('-').map(Number) as [number, number, number];
  const [startHour, startMin] = startTime.split(':').map(Number) as [number, number];
  const [endHour, endMin] = endTime.split(':').map(Number) as [number, number];

  // Create dates in the schedule's timezone
  const windowStart = new TZDate(year, month - 1, day, startHour, startMin, 0, 0, timezone);
  const windowEnd = new TZDate(year, month - 1, day, endHour, endMin, 0, 0, timezone);

  if (windowStart.getTime() >= windowEnd.getTime()) {
    return null;
  }

  return {
    start: new Date(windowStart.getTime()),
    end: new Date(windowEnd.getTime()),
  };
}

// ─── HELPER: Generate slots within a single availability window ──────────────

type EventTypeConstraints = {
  duration: number;
  slotInterval: number | null;
  beforeBuffer: number;
  afterBuffer: number;
  minimumNotice: number;
  maxBookingsPerDay: number | null;
  maxBookingsPerWeek: number | null;
};

type GenerateSlotsParams = {
  window: TimeWindow;
  eventType: EventTypeConstraints;
  existingBookings: ExistingBooking[];
  bookingsThisDay: ExistingBooking[];
  bookingsThisWeek: ExistingBooking[];
  now: Date;
  futureLimitDate: Date;
  attendeeTimezone: string;
};

export function generateSlotsForWindow(params: GenerateSlotsParams): AvailableSlot[] {
  const {
    window,
    eventType,
    existingBookings,
    bookingsThisDay,
    bookingsThisWeek,
    now,
    futureLimitDate,
    attendeeTimezone,
  } = params;

  const step = eventType.slotInterval ?? eventType.duration;
  const slots: AvailableSlot[] = [];
  const existingDayCount = bookingsThisDay.length;
  const existingWeekCount = bookingsThisWeek.length;

  // If already at limits from existing bookings, return no slots
  if (eventType.maxBookingsPerDay !== null && existingDayCount >= eventType.maxBookingsPerDay) {
    return [];
  }
  if (eventType.maxBookingsPerWeek !== null && existingWeekCount >= eventType.maxBookingsPerWeek) {
    return [];
  }

  let slotStart = window.start;

  while (true) {
    const slotEnd = addMinutes(slotStart, eventType.duration);

    // Stop if slot end exceeds window end
    if (slotEnd.getTime() > window.end.getTime()) {
      break;
    }

    // Check future limit
    if (slotStart > futureLimitDate) {
      break;
    }

    // Check minimum notice
    const minimumNoticeMs = eventType.minimumNotice * 60 * 1000;
    if (slotStart.getTime() < now.getTime() + minimumNoticeMs) {
      slotStart = addMinutes(slotStart, step);
      continue;
    }

    // Check booking conflicts (with buffers)
    if (
      !isSlotConflicting(
        slotStart,
        slotEnd,
        existingBookings,
        eventType.beforeBuffer,
        eventType.afterBuffer
      )
    ) {
      // Format localTime in attendee's timezone
      const localTime = format(new TZDate(slotStart, attendeeTimezone), 'HH:mm');

      slots.push({
        time: slotStart.toISOString(),
        localTime,
        duration: eventType.duration,
      });
    }

    slotStart = addMinutes(slotStart, step);
  }

  return slots;
}

// ─── HELPER: Check if a slot conflicts with existing bookings ────────────────

export function isSlotConflicting(
  slotStart: Date,
  slotEnd: Date,
  existingBookings: ExistingBooking[],
  beforeBuffer: number,
  afterBuffer: number
): boolean {
  for (const booking of existingBookings) {
    // Only expand the existing booking by its buffers to create the blocked zone.
    // The candidate slot is checked as-is against that blocked zone.
    const blockedStart = addMinutes(booking.startTime, -beforeBuffer);
    const blockedEnd = addMinutes(booking.endTime, afterBuffer);

    // Check overlap: two intervals [A,B] and [C,D] overlap if A < D && C < B
    if (slotStart < blockedEnd && blockedStart < slotEnd) {
      return true;
    }
  }
  return false;
}
