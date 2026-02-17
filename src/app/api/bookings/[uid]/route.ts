import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/api-auth";
import { bookingActionSchema, bookingRescheduleSchema } from "@/lib/validations";
import { getAvailableSlots } from "@/lib/slots";

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
    });

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
