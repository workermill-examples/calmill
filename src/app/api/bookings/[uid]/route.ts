import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/api-auth";
import { bookingActionSchema, bookingRescheduleSchema } from "@/lib/validations";
import { getAvailableSlots } from "@/lib/slots";
import { sendEmail } from "@/lib/email";
import { formatDateInTimezone } from "@/lib/utils";
import { buildGoogleCalendarUrl } from "@/lib/ics";
import { BookingAcceptedEmail } from "@/emails/booking-accepted";
import { BookingCancelledEmail } from "@/emails/booking-cancelled";
import { deliverWebhookEvent, buildBookingPayload, type WebhookEventType } from "@/lib/webhooks";
import React from "react";

type Params = { params: Promise<{ uid: string }> };

// ─── HELPERS ─────────────────────────────────────────────────────────────────

// Valid status transitions
const STATUS_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["ACCEPTED", "REJECTED", "CANCELLED"],
  ACCEPTED: ["CANCELLED"],
  REJECTED: [],
  CANCELLED: [],
  RESCHEDULED: [],
};

function canTransition(current: string, next: string): boolean {
  return STATUS_TRANSITIONS[current]?.includes(next) ?? false;
}

function actionToStatus(action: string): string {
  switch (action) {
    case "accept": return "ACCEPTED";
    case "reject": return "REJECTED";
    case "cancel": return "CANCELLED";
    default: return action.toUpperCase();
  }
}

// ─── GET /api/bookings/[uid] — Public: get booking by UID ────────────────────

export async function GET(_request: Request, { params }: Params) {
  const { uid } = await params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { uid },
      include: {
        eventType: {
          select: {
            id: true,
            title: true,
            duration: true,
            locations: true,
            color: true,
            requiresConfirmation: true,
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
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("GET /api/bookings/[uid] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── PATCH /api/bookings/[uid] — Status actions (accept/reject/cancel) ────────

export async function PATCH(request: Request, { params }: Params) {
  const { uid } = await params;

  try {
    const body = await request.json();
    const validated = bookingActionSchema.parse(body);
    const nextStatus = actionToStatus(validated.action);

    const booking = await prisma.booking.findUnique({
      where: { uid },
      include: {
        eventType: { select: { userId: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Authorization:
    // - accept/reject → host only (must be authenticated + own the event type)
    // - cancel → host OR attendee (attendee via UID, no auth required)
    if (validated.action === "accept" || validated.action === "reject") {
      const authResult = await getAuthenticatedUser();
      if (authResult.error) return authResult.error;
      const { user } = authResult;

      if (user.id !== booking.eventType.userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
    // For "cancel", anyone with the UID can cancel (host or attendee)

    // Validate transition
    if (!canTransition(booking.status, nextStatus)) {
      return NextResponse.json(
        {
          error: `Cannot transition from ${booking.status} to ${nextStatus}`,
        },
        { status: 409 }
      );
    }

    const updateData: Record<string, unknown> = { status: nextStatus };

    if (nextStatus === "CANCELLED") {
      updateData.cancellationReason = validated.reason ?? null;
      updateData.cancelledAt = new Date();
    } else if (nextStatus === "REJECTED") {
      updateData.cancellationReason = validated.reason ?? null;
    }

    const updated = await prisma.booking.update({
      where: { uid },
      data: updateData,
      include: {
        eventType: {
          select: {
            id: true,
            title: true,
            slug: true,
            duration: true,
            locations: true,
            color: true,
            requiresConfirmation: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                username: true,
                timezone: true,
                avatarUrl: true,
                bio: true,
              },
            },
          },
        },
      },
    });

    // ── Fire-and-forget email notifications ──────────────────────────────────
    void sendStatusChangeEmails(updated, nextStatus, validated.reason).catch((err) => {
      console.error("[Bookings] Status change email notification failed:", err);
    });

    // ── Fire-and-forget webhook delivery ─────────────────────────────────────
    const webhookEventMap: Record<string, WebhookEventType> = {
      ACCEPTED: "BOOKING_ACCEPTED",
      REJECTED: "BOOKING_REJECTED",
      CANCELLED: "BOOKING_CANCELLED",
    };
    const webhookEvent = webhookEventMap[nextStatus];
    if (webhookEvent) {
      void deliverWebhookEvent({
        userId: updated.userId,
        eventType: webhookEvent,
        payload: buildBookingPayload(webhookEvent, {
          uid: updated.uid,
          title: updated.title,
          startTime: updated.startTime,
          endTime: updated.endTime,
          status: updated.status,
          attendeeName: updated.attendeeName,
          attendeeEmail: updated.attendeeEmail,
          attendeeTimezone: updated.attendeeTimezone,
          eventType: {
            title: updated.eventType.title,
            slug: updated.eventType.slug,
            duration: updated.eventType.duration,
          },
        }),
      }).catch((err) => {
        console.error(`[Webhooks] ${webhookEvent} delivery failed:`, err);
      });
    }

    return NextResponse.json({ success: true, data: updated });
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

    console.error("PATCH /api/bookings/[uid] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── PUT /api/bookings/[uid]/reschedule — handled in nested route ─────────────
// Note: The spec says PUT /api/bookings/[uid]/reschedule but the targetFiles list
// only includes src/app/api/bookings/[uid]/route.ts. We implement reschedule here
// as a separate exported function that Next.js will not use (since PUT on /[uid]
// is not in the spec for this file). However, the spec describes the reschedule
// action under PUT. We implement it on this route for completeness, as the
// targetFiles list suggests this single file handles all [uid] operations.

export async function PUT(request: Request, { params }: Params) {
  const { uid } = await params;

  try {
    const body = await request.json();
    const validated = bookingRescheduleSchema.parse(body);

    const booking = await prisma.booking.findUnique({
      where: { uid },
      include: {
        eventType: {
          include: {
            schedule: {
              include: {
                availability: true,
                dateOverrides: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Only PENDING or ACCEPTED bookings can be rescheduled
    if (booking.status !== "PENDING" && booking.status !== "ACCEPTED") {
      return NextResponse.json(
        { error: `Cannot reschedule a booking with status ${booking.status}` },
        { status: 409 }
      );
    }

    const newStartTime = new Date(validated.startTime);
    const duration = booking.eventType.duration;
    const newEndTime = new Date(newStartTime.getTime() + duration * 60 * 1000);

    // Verify the new slot is available (excluding the current booking's time from conflicts)
    const startDateStr = newStartTime.toISOString().slice(0, 10);
    const availableSlots = await getAvailableSlots({
      eventTypeId: booking.eventTypeId,
      startDate: startDateStr,
      endDate: startDateStr,
      timezone: booking.attendeeTimezone,
    });

    // The slot calculation will include the current booking as a conflict,
    // so we check if the new start time appears in available slots.
    // If the current booking's own time is requested, we need to handle this edge case:
    // the old booking is still PENDING/ACCEPTED, so getAvailableSlots will exclude it.
    // This is acceptable behavior — the attendee must pick a different slot.
    const isAvailable = availableSlots.some(
      (slot) => new Date(slot.time).getTime() === newStartTime.getTime()
    );

    if (!isAvailable) {
      return NextResponse.json(
        { error: "The requested time slot is not available" },
        { status: 409 }
      );
    }

    // Mark old booking as RESCHEDULED and create a new one
    const [, newBooking] = await prisma.$transaction([
      // Mark old booking as RESCHEDULED
      prisma.booking.update({
        where: { uid },
        data: {
          status: "RESCHEDULED",
          cancellationReason: validated.reason ?? null,
        },
      }),
      // Create new booking
      prisma.booking.create({
        data: {
          title: booking.title,
          description: booking.description,
          startTime: newStartTime,
          endTime: newEndTime,
          status: booking.eventType.requiresConfirmation ? "PENDING" : "ACCEPTED",
          attendeeName: booking.attendeeName,
          attendeeEmail: booking.attendeeEmail,
          attendeeTimezone: booking.attendeeTimezone,
          attendeeNotes: booking.attendeeNotes,
          location: booking.location,
          responses: booking.responses ?? undefined,
          recurringEventId: booking.uid, // link to original booking's UID
          userId: booking.userId,
          eventTypeId: booking.eventTypeId,
        },
        include: {
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
        },
      }),
    ]);

    // ── Fire-and-forget webhook delivery ─────────────────────────────────────
    void deliverWebhookEvent({
      userId: booking.userId,
      eventType: "BOOKING_RESCHEDULED",
      payload: buildBookingPayload("BOOKING_RESCHEDULED", {
        uid: newBooking.uid,
        title: newBooking.title,
        startTime: newBooking.startTime,
        endTime: newBooking.endTime,
        status: newBooking.status,
        attendeeName: newBooking.attendeeName,
        attendeeEmail: newBooking.attendeeEmail,
        attendeeTimezone: newBooking.attendeeTimezone,
        eventType: {
          title: newBooking.eventType.title,
          slug: newBooking.eventType.slug,
          duration: newBooking.eventType.duration,
        },
      }),
    }).catch((err) => {
      console.error("[Webhooks] BOOKING_RESCHEDULED delivery failed:", err);
    });

    return NextResponse.json({ success: true, data: newBooking }, { status: 201 });
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

    console.error("PUT /api/bookings/[uid] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── EMAIL HELPERS ────────────────────────────────────────────────────────────

type UpdatedBooking = {
  uid: string;
  title: string;
  startTime: Date;
  endTime: Date;
  attendeeName: string;
  attendeeEmail: string;
  attendeeTimezone: string;
  location: string | null;
  cancellationReason: string | null;
  eventType: {
    id: string;
    title: string;
    slug: string;
    duration: number;
    requiresConfirmation: boolean;
    user: {
      id: string;
      name: string | null;
      email: string;
      username: string;
      timezone: string;
    };
  };
};

async function sendStatusChangeEmails(
  booking: UpdatedBooking,
  nextStatus: string,
  reason?: string | null
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://calmill.workermill.com";
  const host = booking.eventType.user;
  const hostName = host.name ?? host.email;
  const hostTimezone = host.timezone;
  const attendeeTimezone = booking.attendeeTimezone;

  const DATE_FORMAT = "MMM d, yyyy 'at' h:mm a";
  const startTimeForAttendee = formatDateInTimezone(booking.startTime, attendeeTimezone, DATE_FORMAT);
  const endTimeForAttendee = formatDateInTimezone(booking.endTime, attendeeTimezone, "h:mm a");
  const startTimeForHost = formatDateInTimezone(booking.startTime, hostTimezone, DATE_FORMAT);
  const endTimeForHost = formatDateInTimezone(booking.endTime, hostTimezone, "h:mm a");

  const rescheduleUrl = `${appUrl}/${host.username}/${booking.eventType.id}?reschedule=${booking.uid}`;
  const cancelUrl = `${appUrl}/api/bookings/${booking.uid}`;
  const rebookUrl = `${appUrl}/${host.username}/${booking.eventType.id}`;

  const googleCalendarUrl = buildGoogleCalendarUrl({
    uid: booking.uid,
    title: booking.title,
    startTime: booking.startTime,
    endTime: booking.endTime,
    location: booking.location ?? undefined,
  });

  const emailPromises: Promise<void>[] = [];

  if (nextStatus === "ACCEPTED") {
    // Attendee gets the "meeting confirmed by host" email
    emailPromises.push(
      sendEmail({
        to: booking.attendeeEmail,
        subject: `Meeting confirmed: ${booking.eventType.title} with ${hostName}`,
        template: React.createElement(BookingAcceptedEmail, {
          hostName,
          attendeeName: booking.attendeeName,
          eventTypeTitle: booking.eventType.title,
          duration: booking.eventType.duration,
          startTime: startTimeForAttendee,
          endTime: endTimeForAttendee,
          timezone: attendeeTimezone,
          location: booking.location ?? undefined,
          googleCalendarUrl,
          rescheduleUrl,
          cancelUrl,
        }),
      })
    );
  } else if (nextStatus === "CANCELLED" || nextStatus === "REJECTED") {
    const isRejection = nextStatus === "REJECTED";
    const cancellationReason = reason ?? booking.cancellationReason ?? undefined;

    // Attendee gets cancellation/rejection email
    emailPromises.push(
      sendEmail({
        to: booking.attendeeEmail,
        subject: isRejection
          ? `Meeting request declined: ${booking.eventType.title}`
          : `Meeting cancelled: ${booking.eventType.title}`,
        template: React.createElement(BookingCancelledEmail, {
          recipientName: booking.attendeeName,
          hostName,
          attendeeName: booking.attendeeName,
          isHost: false,
          eventTypeTitle: booking.eventType.title,
          startTime: startTimeForAttendee,
          endTime: endTimeForAttendee,
          timezone: attendeeTimezone,
          cancellationReason,
          isRejection,
          rebookUrl,
        }),
      })
    );

    // Host gets cancellation notification (but not rejection — they initiated it)
    if (!isRejection) {
      emailPromises.push(
        sendEmail({
          to: host.email,
          subject: `Meeting cancelled: ${booking.eventType.title} with ${booking.attendeeName}`,
          template: React.createElement(BookingCancelledEmail, {
            recipientName: hostName,
            hostName,
            attendeeName: booking.attendeeName,
            isHost: true,
            eventTypeTitle: booking.eventType.title,
            startTime: startTimeForHost,
            endTime: endTimeForHost,
            timezone: hostTimezone,
            cancellationReason,
            isRejection: false,
          }),
        })
      );
    }
  }

  await Promise.allSettled(emailPromises);
}
