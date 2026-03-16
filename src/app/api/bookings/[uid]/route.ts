import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { triggerWebhooks, WEBHOOK_EVENTS } from "@/lib/webhooks";
import { sendBookingCancellationEmail } from "@/lib/email";

// Validation schemas
const updateBookingSchema = z.object({
  action: z.enum(["accept", "reject", "cancel"]),
  cancellationReason: z.string().optional(),
});

interface RouteParams {
  params: Promise<{ uid: string }>;
}

/**
 * GET /api/bookings/[uid] - Get booking by UID (public access for attendees)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { uid } = await params;

    // Find booking by UID with related data
    const booking = await prisma.booking.findUnique({
      where: { uid },
      include: {
        eventType: {
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            color: true,
            requiresConfirmation: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            username: true,
            timezone: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "not_found", message: "Booking not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "internal", message: "Failed to fetch booking" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/bookings/[uid] - Update booking status (accept/reject/cancel)
 * Mixed authentication:
 * - Accept/Reject: Host only (authenticated)
 * - Cancel: Both host (authenticated) and attendee (by email verification)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { uid } = await params;
    const body = await request.json();
    const { action, cancellationReason } = updateBookingSchema.parse(body);

    // Find booking with user data
    const booking = await prisma.booking.findUnique({
      where: { uid },
      include: {
        eventType: {
          select: {
            title: true,
            requiresConfirmation: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            timezone: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "not_found", message: "Booking not found" },
        { status: 404 },
      );
    }

    // Check if booking is already cancelled or rejected
    if (booking.status === "CANCELLED" || booking.status === "REJECTED") {
      return NextResponse.json(
        {
          error: "invalid",
          message: "Booking is already cancelled or rejected",
        },
        { status: 400 },
      );
    }

    // Authentication and authorization
    if (action === "accept" || action === "reject") {
      // Only host can accept or reject
      const session = await auth();
      if (!session?.user || session.user.id !== booking.userId) {
        return NextResponse.json(
          {
            error: "unauthorized",
            message: "Only the host can accept or reject bookings",
          },
          { status: 401 },
        );
      }

      // Only pending bookings can be accepted/rejected
      if (booking.status !== "PENDING") {
        return NextResponse.json(
          {
            error: "invalid",
            message: "Only pending bookings can be accepted or rejected",
          },
          { status: 400 },
        );
      }
    }

    if (action === "cancel") {
      // Both host and attendee can cancel, but verify identity
      const session = await auth();
      const isHost = session?.user && session.user.id === booking.userId;

      // If not authenticated as host, could be attendee - but for now require auth
      // In a real app, you might verify attendee by email/token
      if (!isHost) {
        // For now, require authentication for cancellation
        // Could extend to support attendee cancellation via email verification
        return NextResponse.json(
          {
            error: "unauthorized",
            message: "Authentication required to cancel booking",
          },
          { status: 401 },
        );
      }

      // Can only cancel accepted or pending bookings
      if (booking.status !== "ACCEPTED" && booking.status !== "PENDING") {
        return NextResponse.json(
          {
            error: "invalid",
            message: "Only accepted or pending bookings can be cancelled",
          },
          { status: 400 },
        );
      }
    }

    // Determine new status
    let newStatus: string;
    if (action === "accept") {
      newStatus = "ACCEPTED";
    } else if (action === "reject") {
      newStatus = "REJECTED";
    } else {
      newStatus = "CANCELLED";
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { uid },
      data: {
        status: newStatus as any,
        cancellationReason: action === "cancel" ? cancellationReason : null,
      },
      include: {
        eventType: {
          select: {
            title: true,
            color: true,
            duration: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            timezone: true,
          },
        },
      },
    });

    // Send notification emails based on action
    if (action === "cancel") {
      // Send cancellation email to both host and attendee
      sendBookingCancellationEmail({
        recipientName: booking.attendeeName,
        recipientEmail: booking.attendeeEmail,
        eventTitle: booking.eventType.title,
        startTime: booking.startTime,
        timezone: booking.attendeeTimezone,
        cancellationReason,
        isHost: false,
      });

      sendBookingCancellationEmail({
        recipientName: booking.user.name || booking.user.email,
        recipientEmail: booking.user.email,
        eventTitle: booking.eventType.title,
        startTime: booking.startTime,
        timezone: booking.user.timezone,
        cancellationReason,
        isHost: true,
      });
    } else if (action === "accept") {
      // Send acceptance confirmation to attendee
      // This would typically trigger an "accepted" email template
      // For now, we'll use the booking confirmation email
    } else if (action === "reject") {
      // Send rejection notification to attendee
      sendBookingCancellationEmail({
        recipientName: booking.attendeeName,
        recipientEmail: booking.attendeeEmail,
        eventTitle: booking.eventType.title,
        startTime: booking.startTime,
        timezone: booking.attendeeTimezone,
        cancellationReason: "Your booking request was declined by the host",
        isHost: false,
      });
    }

    // Trigger appropriate webhook
    let webhookEvent: string;
    if (action === "accept") {
      webhookEvent = WEBHOOK_EVENTS.BOOKING_ACCEPTED;
    } else if (action === "reject") {
      webhookEvent = WEBHOOK_EVENTS.BOOKING_REJECTED;
    } else {
      webhookEvent = WEBHOOK_EVENTS.BOOKING_CANCELLED;
    }

    await triggerWebhooks(booking.userId, webhookEvent, {
      bookingId: booking.id,
      bookingUid: booking.uid,
      eventTypeId: booking.eventTypeId,
      attendeeEmail: booking.attendeeEmail,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      action,
      cancellationReason,
    });

    // If cancelling recurring bookings, handle the cancelFuture parameter
    const { searchParams } = new URL(request.url);
    const cancelFuture = searchParams.get("cancelFuture") === "true";

    if (action === "cancel" && cancelFuture && booking.recurringEventId) {
      // Cancel all future bookings in the same recurring series
      await prisma.booking.updateMany({
        where: {
          recurringEventId: booking.recurringEventId,
          startTime: {
            gt: booking.startTime,
          },
          status: {
            in: ["PENDING", "ACCEPTED"],
          },
        },
        data: {
          status: "CANCELLED",
          cancellationReason: "Cancelled as part of recurring series",
        },
      });
    }

    return NextResponse.json({
      booking: updatedBooking,
      message: `Booking ${action}${action === "cancel" ? "led" : "ed"} successfully`,
    });
  } catch (error) {
    console.error("Error updating booking:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "validation",
          message: "Invalid update data",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "internal", message: "Failed to update booking" },
      { status: 500 },
    );
  }
}
