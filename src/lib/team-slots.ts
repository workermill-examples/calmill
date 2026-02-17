import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/lib/slots";
import type { AvailableSlot } from "@/types";

// ─── TYPES ──────────────────────────────────────────────────────────────────

type TeamSlotParams = {
  eventTypeId: string;
  startDate: string; // YYYY-MM-DD in attendee's timezone
  endDate: string;   // YYYY-MM-DD in attendee's timezone
  timezone: string;  // Attendee's IANA timezone
};

// ─── ROUND-ROBIN SLOTS ───────────────────────────────────────────────────────

/**
 * Returns available slots for a round-robin team event type.
 * A slot is available if ANY accepted team member is free at that time.
 * Host assignment happens at booking time, not here.
 */
export async function getRoundRobinSlots(params: TeamSlotParams): Promise<AvailableSlot[]> {
  const { eventTypeId, startDate, endDate, timezone } = params;

  const memberIds = await getAcceptedMemberIds(eventTypeId);
  if (memberIds.length === 0) {
    return [];
  }

  // Compute available slots for each member in parallel
  const memberSlotSets = await Promise.all(
    memberIds.map((memberId) =>
      getMemberAvailableSlots({ memberId, teamEventTypeId: eventTypeId, startDate, endDate, timezone })
    )
  );

  // Union: slot is available if ANY member is free
  const slotMap = new Map<string, AvailableSlot>();
  for (const slots of memberSlotSets) {
    for (const slot of slots) {
      if (!slotMap.has(slot.time)) {
        slotMap.set(slot.time, slot);
      }
    }
  }

  return Array.from(slotMap.values()).sort((a, b) => a.time.localeCompare(b.time));
}

// ─── COLLECTIVE SLOTS ────────────────────────────────────────────────────────

/**
 * Returns available slots for a collective team event type.
 * A slot is available ONLY if ALL accepted team members are free at that time.
 */
export async function getCollectiveSlots(params: TeamSlotParams): Promise<AvailableSlot[]> {
  const { eventTypeId, startDate, endDate, timezone } = params;

  const memberIds = await getAcceptedMemberIds(eventTypeId);
  if (memberIds.length === 0) {
    return [];
  }

  // Compute available slots for each member in parallel
  const memberSlotSets = await Promise.all(
    memberIds.map((memberId) =>
      getMemberAvailableSlots({ memberId, teamEventTypeId: eventTypeId, startDate, endDate, timezone })
    )
  );

  // Intersection: slot is available only if ALL members have it
  const firstSlots = memberSlotSets[0];
  let intersection = new Set<string>(firstSlots.map((s) => s.time));

  for (let i = 1; i < memberSlotSets.length; i++) {
    const memberTimes = new Set(memberSlotSets[i].map((s) => s.time));
    intersection = new Set([...intersection].filter((t) => memberTimes.has(t)));
  }

  // Build result using the first member's slot objects (same time = same localTime/duration)
  const slotByTime = new Map(firstSlots.map((s) => [s.time, s]));
  return [...intersection]
    .sort()
    .map((time) => slotByTime.get(time)!)
    .filter(Boolean);
}

// ─── ROUND-ROBIN ASSIGNMENT ──────────────────────────────────────────────────

/**
 * Returns the userId of the team member who should handle a round-robin booking.
 * Called at booking time to handle races and ensure fair distribution.
 *
 * Selection priority:
 * 1. Member must be available at the requested slot time
 * 2. Fewest bookings in the last 30 days for this event type
 * 3. Tiebreaker: least recently assigned (by last booking date)
 */
export async function getRoundRobinAssignment(params: {
  eventTypeId: string;
  slotTime: string;  // ISO 8601 datetime (UTC)
  startDate: string; // YYYY-MM-DD (same day as slotTime)
  endDate: string;   // YYYY-MM-DD (same day as slotTime)
  timezone: string;
}): Promise<string | null> {
  const { eventTypeId, slotTime, startDate, endDate, timezone } = params;

  const memberIds = await getAcceptedMemberIds(eventTypeId);
  if (memberIds.length === 0) {
    return null;
  }

  // Determine which members are available at this exact slot time
  const memberAvailability = await Promise.all(
    memberIds.map(async (memberId) => {
      const slots = await getMemberAvailableSlots({
        memberId,
        teamEventTypeId: eventTypeId,
        startDate,
        endDate,
        timezone,
      });
      const isAvailable = slots.some((s) => s.time === slotTime);
      return { memberId, isAvailable };
    })
  );

  const availableIds = memberAvailability
    .filter((m) => m.isAvailable)
    .map((m) => m.memberId);

  if (availableIds.length === 0) {
    return null;
  }

  if (availableIds.length === 1) {
    return availableIds[0];
  }

  // Get booking counts in the last 30 days for load balancing
  const bookingCounts = await getBookingCountByMember(eventTypeId, availableIds, 30);

  const minCount = Math.min(...availableIds.map((id) => bookingCounts.get(id) ?? 0));
  const tied = availableIds.filter((id) => (bookingCounts.get(id) ?? 0) === minCount);

  if (tied.length === 1) {
    return tied[0];
  }

  // Tiebreaker: pick the member who was assigned least recently
  const lastBookings = await prisma.booking.findMany({
    where: {
      eventTypeId,
      userId: { in: tied },
      status: { in: ["PENDING", "ACCEPTED"] },
    },
    orderBy: { createdAt: "desc" },
    select: { userId: true, createdAt: true },
    distinct: ["userId"],
  });

  const lastAssigned = new Map(lastBookings.map((b) => [b.userId, b.createdAt]));

  // Sort by last assigned ascending (least recently assigned first)
  // Members with no prior booking sort first (new Date(0))
  tied.sort((a, b) => {
    const aDate = lastAssigned.get(a) ?? new Date(0);
    const bDate = lastAssigned.get(b) ?? new Date(0);
    return aDate.getTime() - bDate.getTime();
  });

  return tied[0] ?? null;
}

// ─── BOOKING COUNT HELPER ────────────────────────────────────────────────────

/**
 * Returns a map of userId → booking count for a team event type
 * within the last `days` days.
 */
export async function getBookingCountByMember(
  eventTypeId: string,
  memberIds: string[],
  days: number
): Promise<Map<string, number>> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const rows = await prisma.booking.groupBy({
    by: ["userId"],
    where: {
      eventTypeId,
      userId: { in: memberIds },
      status: { in: ["PENDING", "ACCEPTED"] },
      createdAt: { gte: since },
    },
    _count: { id: true },
  });

  const result = new Map<string, number>(memberIds.map((id) => [id, 0]));
  for (const row of rows) {
    result.set(row.userId, row._count.id);
  }
  return result;
}

// ─── PRIVATE HELPERS ─────────────────────────────────────────────────────────

/**
 * Returns userIds of accepted team members for a team event type.
 */
async function getAcceptedMemberIds(eventTypeId: string): Promise<string[]> {
  const eventType = await prisma.eventType.findUnique({
    where: { id: eventTypeId, isActive: true },
    select: {
      teamId: true,
    },
  });

  if (!eventType?.teamId) {
    return [];
  }

  const members = await prisma.teamMember.findMany({
    where: { teamId: eventType.teamId, accepted: true },
    select: { userId: true },
  });

  return members.map((m) => m.userId);
}

/**
 * Computes available slots for a specific team member.
 *
 * Uses getAvailableSlots() with an event type that:
 * - If the member owns the team event type (creator): use it directly
 * - Otherwise: find a personal active event type for this member that has a schedule,
 *   so that their own schedule (availability windows, calendar connections) is used
 * - Fallback: use the team event type directly (uses creator's schedule)
 *
 * This approach correctly uses each member's own schedule to determine their
 * personal availability windows while respecting the team event type's constraints
 * (duration, buffers, etc.) via their own event types.
 */
async function getMemberAvailableSlots(params: {
  memberId: string;
  teamEventTypeId: string;
  startDate: string;
  endDate: string;
  timezone: string;
}): Promise<AvailableSlot[]> {
  const { memberId, teamEventTypeId, startDate, endDate, timezone } = params;

  // Check if this member is the creator — use team event type directly
  const teamEventType = await prisma.eventType.findUnique({
    where: { id: teamEventTypeId, isActive: true },
    select: { userId: true },
  });

  if (!teamEventType) {
    return [];
  }

  // If the member is the event type creator, use the team event type directly
  if (teamEventType.userId === memberId) {
    return getAvailableSlots({ eventTypeId: teamEventTypeId, startDate, endDate, timezone });
  }

  // For other members, use their own personal event type (to get their schedule)
  // Find their default personal event type (non-team, active, has schedule)
  const memberEventType = await prisma.eventType.findFirst({
    where: {
      userId: memberId,
      isActive: true,
      teamId: null,
      scheduleId: { not: null },
    },
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (memberEventType) {
    return getAvailableSlots({ eventTypeId: memberEventType.id, startDate, endDate, timezone });
  }

  // Fallback: use the team event type (uses creator's schedule — acceptable approximation
  // for members who haven't configured their own event types yet)
  return getAvailableSlots({ eventTypeId: teamEventTypeId, startDate, endDate, timezone });
}
