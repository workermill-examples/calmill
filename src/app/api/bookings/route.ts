import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { addDays, addMonths } from "date-fns";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/api-auth";
import { bookingCreateSchema } from "@/lib/validations";
import { getAvailableSlots } from "@/lib/slots";
import { getRoundRobinSlots, getCollectiveSlots, getRoundRobinAssignment } from "@/lib/team-slots";
import { sendEmail } from "@/lib/email";
import { formatDateInTimezone } from "@/lib/utils";
import { buildGoogleCalendarUrl } from "@/lib/ics";
import { BookingConfirmedEmail } from "@/emails/booking-confirmed";
import { BookingNotificationEmail } from "@/emails/booking-notification";
import { deliverWebhookEvent, buildBookingPayload } from "@/lib/webhooks";
import React from "react";

// ─── GET /api/bookings — Authenticated user's bookings ──────────────────────

export async function GET(request: Request) {
  const authResult = await getAuthenticatedUser();
  if (authResult.error) return authResult.error;
  const { user } = authResult;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const recurringEventId = searchParams.get("recurringEventId");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));

  // Build where clause
  const where: Record<string, unknown> = { userId: user.id };

  if (status) {
    const validStatuses = ["PENDING", "ACCEPTED", "CANCELLED", "REJECTED", "RESCHEDULED"];
    if (validStatuses.includes(status.toUpperCase())) {
      where.status = status.toUpperCase();
    }
  }

  if (startDate || endDate) {
    const timeFilter: Record<string, Date> = {};
    if (startDate) timeFilter.gte = new Date(startDate);
    if (endDate) timeFilter.lte = new Date(endDate);
    where.startTime = timeFilter;
  }

  if (recurringEventId) {
    where.recurringEventId = recurringEventId;
  }

  // Determine ordering: upcoming (future) ASC, past DESC
  const now = new Date();
  const isUpcoming = !endDate || new Date(endDate) >= now;
  const orderBy = isUpcoming ? { startTime: "asc" as const } : { startTime: "desc" as const };

  try {
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          eventType: {
            select: {
              id: true,
              title: true,
              duration: true,
              locations: true,
              color: true,
            },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── POST /api/bookings — Public booking creation ───────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = bookingCreateSchema.parse(body);

    // Load event type to determine booking details
    const eventType = await prisma.eventType.findUnique({
      where: { id: validated.eventTypeId, isActive: true },
      include: {
        user: {
          select: { id: true, name: true, email: true, timezone: true, username: true },
        },
        schedule: {
          include: {
            availability: true,
            dateOverrides: true,
          },
        },
      },
    });

    if (!eventType) {
      return NextResponse.json(
        { error: "Event type not found or inactive" },
        { status: 404 }
      );
    }

    const startTime = new Date(validated.startTime);
    const endTime = new Date(startTime.getTime() + eventType.duration * 60 * 1000);

    // Re-verify the requested slot is still available (dispatches to correct algorithm)
    const startDateStr = startTime.toISOString().slice(0, 10);
    const endDateStr = startDateStr;
    const slotParams = {
      eventTypeId: validated.eventTypeId,
      startDate: startDateStr,
      endDate: endDateStr,
      timezone: validated.attendeeTimezone,
    };

    let availableSlots;
    if (eventType.schedulingType === "ROUND_ROBIN") {
      availableSlots = await getRoundRobinSlots(slotParams);
    } else if (eventType.schedulingType === "COLLECTIVE") {
      availableSlots = await getCollectiveSlots(slotParams);
    } else {
      availableSlots = await getAvailableSlots(slotParams);
    }

    const isAvailable = availableSlots.some(
      (slot) => new Date(slot.time).getTime() === startTime.getTime()
    );

    if (!isAvailable) {
      return NextResponse.json(
        { error: "The requested time slot is no longer available" },
        { status: 409 }
      );
    }

    // Determine which user owns this booking and any extra notification recipients
    let bookingUserId = eventType.userId;
    let extraNotificationEmails: string[] = [];

    if (eventType.schedulingType === "ROUND_ROBIN" && eventType.teamId) {
      // Re-evaluate assignment at booking time to handle races
      const assignedUserId = await getRoundRobinAssignment({
        eventTypeId: eventType.id,
        slotTime: startTime.toISOString(),
        startDate: startDateStr,
        endDate: endDateStr,
        timezone: validated.attendeeTimezone,
      });

      if (!assignedUserId) {
        return NextResponse.json(
          { error: "The requested time slot is no longer available" },
          { status: 409 }
        );
      }

      bookingUserId = assignedUserId;
      // Notification goes only to the assigned member (handled via bookingUserId below)
    } else if (eventType.schedulingType === "COLLECTIVE" && eventType.teamId) {
      // For collective: booking userId stays as event type creator (administrative owner)
      // Notify ALL accepted team members
      const teamMembers = await prisma.teamMember.findMany({
        where: { teamId: eventType.teamId, accepted: true },
        include: {
          user: { select: { email: true } },
        },
      });

      extraNotificationEmails = teamMembers
        .map((m) => m.user.email)
        .filter((email) => email !== eventType.user.email);
    }

    // Determine initial status
    const status = eventType.requiresConfirmation ? "PENDING" : "ACCEPTED";

    // Build booking title — use the assigned/creator user for display
    const bookingUser =
      bookingUserId === eventType.userId
        ? eventType.user
        : await prisma.user.findUnique({
            where: { id: bookingUserId },
            select: { id: true, name: true, email: true, timezone: true, username: true },
          });

    if (!bookingUser) {
      return NextResponse.json({ error: "Assigned host not found" }, { status: 500 });
    }

    const title = `${validated.attendeeName} <> ${bookingUser.name ?? bookingUser.email}`;

    // ── Recurring booking creation ─────────────────────────────────────────
    const recurringCount = validated.recurringCount ?? 1;
    const isRecurring =
      recurringCount > 1 &&
      eventType.recurringEnabled &&
      !!eventType.recurringFrequency;

    // Validate recurringCount does not exceed the event type's configured maximum
    if (
      isRecurring &&
      eventType.recurringMaxOccurrences != null &&
      recurringCount > eventType.recurringMaxOccurrences
    ) {
      return NextResponse.json(
        {
          error: `recurringCount (${recurringCount}) exceeds the maximum allowed occurrences (${eventType.recurringMaxOccurrences})`,
        },
        { status: 400 }
      );
    }

    const bookingInclude = {
      eventType: {
        select: {
          id: true,
          title: true,
          slug: true,
          duration: true,
          locations: true,
          color: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
              bio: true,
            },
          },
        },
      },
    };

    if (isRecurring) {
      // Compute all occurrence start times
      const occurrences = computeRecurringOccurrences(
        startTime,
        eventType.recurringFrequency!,
        recurringCount
      );

      // Validate occurrences 1..N are available (occurrence 0 = startTime already verified above)
      for (let i = 1; i < occurrences.length; i++) {
        const occStart = occurrences[i];
        if (!occStart) continue;
        const occDateStr = occStart.toISOString().slice(0, 10);
        const occSlotParams = {
          eventTypeId: validated.eventTypeId,
          startDate: occDateStr,
          endDate: occDateStr,
          timezone: validated.attendeeTimezone,
        };

        let occSlots;
        if (eventType.schedulingType === "ROUND_ROBIN") {
          occSlots = await getRoundRobinSlots(occSlotParams);
        } else if (eventType.schedulingType === "COLLECTIVE") {
          occSlots = await getCollectiveSlots(occSlotParams);
        } else {
          occSlots = await getAvailableSlots(occSlotParams);
        }

        const occAvailable = occSlots.some(
          (slot) => new Date(slot.time).getTime() === occStart.getTime()
        );

        if (!occAvailable) {
          return NextResponse.json(
            {
              error: `Occurrence ${i + 1} (${occStart.toISOString()}) is not available`,
            },
            { status: 409 }
          );
        }
      }

      // Create all bookings in a transaction with a shared recurringEventId
      const sharedRecurringId = randomUUID();
      const bookings = await prisma.$transaction(
        occurrences.map((occStart) => {
          const occEnd = new Date(occStart.getTime() + eventType.duration * 60 * 1000);
          return prisma.booking.create({
            data: {
              title,
              startTime: occStart,
              endTime: occEnd,
              status,
              attendeeName: validated.attendeeName,
              attendeeEmail: validated.attendeeEmail,
              attendeeTimezone: validated.attendeeTimezone,
              attendeeNotes: validated.attendeeNotes,
              location: validated.location,
              responses: validated.responses ?? undefined,
              recurringEventId: sharedRecurringId,
              userId: bookingUserId,
              eventTypeId: eventType.id,
            },
            include: bookingInclude,
          });
        })
      );

      // Fire-and-forget emails and webhooks for the first occurrence only
      const firstBooking = bookings[0];
      if (!firstBooking) {
        return NextResponse.json({ error: "Failed to create bookings" }, { status: 500 });
      }
      void sendBookingEmails(firstBooking, eventType, status, bookingUser, extraNotificationEmails).catch(
        (err) => {
          console.error("[Bookings] Email notification failed:", err);
        }
      );

      void deliverWebhookEvent({
        userId: bookingUserId,
        eventType: "BOOKING_CREATED",
        payload: buildBookingPayload("BOOKING_CREATED", {
          uid: firstBooking.uid,
          title: firstBooking.title,
          startTime: firstBooking.startTime,
          endTime: firstBooking.endTime,
          status: firstBooking.status,
          attendeeName: firstBooking.attendeeName,
          attendeeEmail: firstBooking.attendeeEmail,
          attendeeTimezone: firstBooking.attendeeTimezone,
          eventType: {
            title: eventType.title,
            slug: eventType.slug,
            duration: eventType.duration,
          },
        }),
      }).catch((err) => {
        console.error("[Webhooks] BOOKING_CREATED delivery failed:", err);
      });

      return NextResponse.json(
        { success: true, data: bookings, recurringEventId: sharedRecurringId },
        { status: 201 }
      );
    }

    // ── Single (non-recurring) booking ────────────────────────────────────────
    const booking = await prisma.booking.create({
      data: {
        title,
        startTime,
        endTime,
        status,
        attendeeName: validated.attendeeName,
        attendeeEmail: validated.attendeeEmail,
        attendeeTimezone: validated.attendeeTimezone,
        attendeeNotes: validated.attendeeNotes,
        location: validated.location,
        responses: validated.responses ?? undefined,
        userId: bookingUserId,
        eventTypeId: eventType.id,
      },
      include: bookingInclude,
    });

    // ── Fire-and-forget email notifications ──────────────────────────────────
    void sendBookingEmails(booking, eventType, status, bookingUser, extraNotificationEmails).catch((err) => {
      console.error("[Bookings] Email notification failed:", err);
    });

    // ── Fire-and-forget webhook delivery ─────────────────────────────────────
    void deliverWebhookEvent({
      userId: bookingUserId,
      eventType: "BOOKING_CREATED",
      payload: buildBookingPayload("BOOKING_CREATED", {
        uid: booking.uid,
        title: booking.title,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
        attendeeName: booking.attendeeName,
        attendeeEmail: booking.attendeeEmail,
        attendeeTimezone: booking.attendeeTimezone,
        eventType: {
          title: eventType.title,
          slug: eventType.slug,
          duration: eventType.duration,
        },
      }),
    }).catch((err) => {
      console.error("[Webhooks] BOOKING_CREATED delivery failed:", err);
    });

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── RECURRING HELPERS ───────────────────────────────────────────────────────

/**
 * Compute N occurrence start times given a base time, frequency, and count.
 * The first occurrence is the base time itself.
 */
function computeRecurringOccurrences(
  baseTime: Date,
  frequency: string,
  count: number
): Date[] {
  const occurrences: Date[] = [baseTime];
  for (let i = 1; i < count; i++) {
    const prev = occurrences[i - 1];
    if (!prev) break;
    let next: Date;
    if (frequency === "weekly") {
      next = addDays(prev, 7);
    } else if (frequency === "biweekly") {
      next = addDays(prev, 14);
    } else {
      // "monthly"
      next = addMonths(prev, 1);
    }
    occurrences.push(next);
  }
  return occurrences;
}

// ─── EMAIL HELPERS ────────────────────────────────────────────────────────────

type BookingEmailContext = {
  id: string;
  uid: string;
  title: string;
  startTime: Date;
  endTime: Date;
  attendeeName: string;
  attendeeEmail: string;
  attendeeTimezone: string;
  attendeeNotes: string | null;
  location: string | null;
  responses: unknown;
};

type EventTypeEmailContext = {
  id: string;
  title: string;
  slug: string;
  duration: number;
  requiresConfirmation: boolean;
  user: {
    id: string;
    name: string | null;
    email: string;
    timezone: string;
    username: string;
  };
};

type HostUser = {
  id: string;
  name: string | null;
  email: string;
  timezone: string;
  username: string;
};

async function sendBookingEmails(
  booking: BookingEmailContext,
  eventType: EventTypeEmailContext,
  status: string,
  hostUser?: HostUser,
  extraNotificationEmails: string[] = []
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://calmill.workermill.com";
  // Use the assigned/override host if provided, otherwise fall back to event type creator
  const host = hostUser ?? eventType.user;
  const hostName = host.name ?? host.email;
  const hostTimezone = host.timezone;
  const attendeeTimezone = booking.attendeeTimezone;

  // Format times
  const DATE_FORMAT = "MMM d, yyyy 'at' h:mm a";
  const startTimeForAttendee = formatDateInTimezone(booking.startTime, attendeeTimezone, DATE_FORMAT);
  const endTimeForAttendee = formatDateInTimezone(booking.endTime, attendeeTimezone, "h:mm a");
  const startTimeForHost = formatDateInTimezone(booking.startTime, hostTimezone, DATE_FORMAT);
  const endTimeForHost = formatDateInTimezone(booking.endTime, hostTimezone, "h:mm a");

  const rescheduleUrl = `${appUrl}/${host.username}/${eventType.id}?reschedule=${booking.uid}`;
  const cancelUrl = `${appUrl}/api/bookings/${booking.uid}`;
  const bookingUrl = `${appUrl}/bookings/${booking.uid}`;

  const googleCalendarUrl = buildGoogleCalendarUrl({
    uid: booking.uid,
    title: booking.title,
    startTime: booking.startTime,
    endTime: booking.endTime,
    location: booking.location ?? undefined,
  });

  // Parse responses if present
  const responses =
    booking.responses && typeof booking.responses === "object" && !Array.isArray(booking.responses)
      ? (booking.responses as Record<string, string>)
      : undefined;

  const emailPromises: Promise<void>[] = [];

  // Host always gets notified
  emailPromises.push(
    sendEmail({
      to: host.email,
      subject: `New booking: ${booking.attendeeName} – ${eventType.title}`,
      template: React.createElement(BookingNotificationEmail, {
        hostName,
        attendeeName: booking.attendeeName,
        attendeeEmail: booking.attendeeEmail,
        eventTypeTitle: eventType.title,
        duration: eventType.duration,
        startTime: startTimeForHost,
        endTime: endTimeForHost,
        timezone: hostTimezone,
        location: booking.location ?? undefined,
        notes: booking.attendeeNotes ?? undefined,
        responses,
        bookingUrl,
        requiresConfirmation: eventType.requiresConfirmation,
      }),
    })
  );

  // Attendee gets confirmation only if no manual confirmation is required
  if (status === "ACCEPTED") {
    emailPromises.push(
      sendEmail({
        to: booking.attendeeEmail,
        subject: `Your meeting with ${hostName} is confirmed`,
        template: React.createElement(BookingConfirmedEmail, {
          hostName,
          attendeeName: booking.attendeeName,
          eventTypeTitle: eventType.title,
          duration: eventType.duration,
          startTime: startTimeForAttendee,
          endTime: endTimeForAttendee,
          timezone: attendeeTimezone,
          location: booking.location ?? undefined,
          googleCalendarUrl,
          rescheduleUrl,
          cancelUrl,
          notes: booking.attendeeNotes ?? undefined,
        }),
      })
    );
  }

  // For collective bookings: also notify all other team members
  for (const email of extraNotificationEmails) {
    emailPromises.push(
      sendEmail({
        to: email,
        subject: `New booking: ${booking.attendeeName} – ${eventType.title}`,
        template: React.createElement(BookingNotificationEmail, {
          hostName,
          attendeeName: booking.attendeeName,
          attendeeEmail: booking.attendeeEmail,
          eventTypeTitle: eventType.title,
          duration: eventType.duration,
          startTime: startTimeForHost,
          endTime: endTimeForHost,
          timezone: hostTimezone,
          location: booking.location ?? undefined,
          notes: booking.attendeeNotes ?? undefined,
          responses,
          bookingUrl,
          requiresConfirmation: eventType.requiresConfirmation,
        }),
      })
    );
  }

  await Promise.allSettled(emailPromises);
}
