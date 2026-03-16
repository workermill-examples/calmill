import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/lib/slots";
import { triggerWebhooks, WEBHOOK_EVENTS } from "@/lib/webhooks";
import {
  sendBookingConfirmationEmail,
  sendBookingNotificationEmail,
} from "@/lib/email";

// Validation schemas
const createBookingSchema = z.object({
  eventTypeId: z.string(),
  startTime: z.string().datetime(),
  attendeeName: z.string().min(1).max(255),
  attendeeEmail: z.string().email(),
  attendeeTimezone: z.string(),
  attendeeNotes: z.string().optional(),
  responses: z.record(z.string(), z.unknown()).optional(),
  location: z.string().optional(),
  recurringCount: z.number().min(1).max(52).optional(),
});

const listBookingsSchema = z.object({
  status: z
    .enum(["PENDING", "ACCEPTED", "CANCELLED", "REJECTED", "RESCHEDULED"])
    .optional(),
  eventTypeId: z.string().optional(),
  startDate: z.string().optional(), // YYYY-MM-DD
  endDate: z.string().optional(), // YYYY-MM-DD
  attendeeEmail: z.string().optional(),
  page: z
    .string()
    .transform((val, ctx) => {
      const parsed = parseInt(val);
      if (isNaN(parsed) || parsed < 1) return 1;
      return parsed;
    })
    .optional(),
  limit: z
    .string()
    .transform((val, ctx) => {
      const parsed = parseInt(val);
      if (isNaN(parsed) || parsed < 1) return 20;
      return Math.min(parsed, 100);
    })
    .optional(),
});

/**
 * GET /api/bookings - List bookings (authenticated, with filters and pagination)
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "unauthorized", message: "Authentication required" },
        { status: 401 },
      );
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const {
      status,
      eventTypeId,
      startDate,
      endDate,
      attendeeEmail,
      page = 1,
      limit = 20,
    } = listBookingsSchema.parse(queryParams);

    // Build where clause
    const where: any = {
      userId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    if (eventTypeId) {
      where.eventTypeId = eventTypeId;
    }

    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) {
        where.startTime.gte = new Date(`${startDate}T00:00:00.000Z`);
      }
      if (endDate) {
        where.startTime.lte = new Date(`${endDate}T23:59:59.999Z`);
      }
    }

    if (attendeeEmail) {
      where.attendeeEmail = {
        contains: attendeeEmail,
        mode: "insensitive",
      };
    }

    // Get total count for pagination
    const total = await prisma.booking.count({ where });

    // Get bookings with pagination
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        eventType: {
          select: {
            id: true,
            title: true,
            color: true,
            duration: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "validation",
          message: "Invalid query parameters",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "internal", message: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/bookings - Create a new booking (public, with slot re-verification)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createBookingSchema.parse(body);

    // Load event type with user
    const eventType = await prisma.eventType.findUnique({
      where: { id: data.eventTypeId },
      include: {
        user: true,
        schedule: true,
      },
    });

    if (!eventType) {
      return NextResponse.json(
        { error: "not_found", message: "Event type not found" },
        { status: 404 },
      );
    }

    if (!eventType.isActive) {
      return NextResponse.json(
        { error: "invalid", message: "Event type is not active" },
        { status: 400 },
      );
    }

    if (!eventType.user) {
      return NextResponse.json(
        { error: "invalid", message: "Event type must have a user" },
        { status: 400 },
      );
    }

    const startTime = new Date(data.startTime);
    const endTime = new Date(
      startTime.getTime() + eventType.duration * 60 * 1000,
    );

    // Re-verify slot availability (security check)
    const dateStr = startTime.toISOString().split("T")[0];
    const availableSlots = await getAvailableSlots({
      eventTypeId: data.eventTypeId,
      startDate: dateStr,
      endDate: dateStr,
      timezone: data.attendeeTimezone,
    });

    const requestedSlot = availableSlots.find(
      (slot) => new Date(slot.time).getTime() === startTime.getTime(),
    );

    if (!requestedSlot) {
      return NextResponse.json(
        {
          error: "conflict",
          message: "Selected time slot is no longer available",
        },
        { status: 409 },
      );
    }

    // Handle recurring bookings
    let bookingsToCreate = [
      {
        startTime,
        endTime,
        recurringEventId:
          data.recurringCount && data.recurringCount > 1
            ? crypto.randomUUID()
            : null,
      },
    ];

    if (
      data.recurringCount &&
      data.recurringCount > 1 &&
      eventType.recurringEnabled
    ) {
      const recurringEventId = crypto.randomUUID();
      bookingsToCreate = [];

      for (let i = 0; i < data.recurringCount; i++) {
        let nextStart: Date;
        if (eventType.recurringFrequency === "weekly") {
          nextStart = new Date(
            startTime.getTime() + i * 7 * 24 * 60 * 60 * 1000,
          );
        } else if (eventType.recurringFrequency === "biweekly") {
          nextStart = new Date(
            startTime.getTime() + i * 14 * 24 * 60 * 60 * 1000,
          );
        } else if (eventType.recurringFrequency === "monthly") {
          nextStart = new Date(startTime);
          nextStart.setMonth(nextStart.getMonth() + i);
        } else {
          nextStart = new Date(
            startTime.getTime() + i * 7 * 24 * 60 * 60 * 1000,
          );
        }

        const nextEnd = new Date(
          nextStart.getTime() + eventType.duration * 60 * 1000,
        );

        // Verify each recurring slot is available
        const nextDateStr = nextStart.toISOString().split("T")[0];
        const nextAvailableSlots = await getAvailableSlots({
          eventTypeId: data.eventTypeId,
          startDate: nextDateStr,
          endDate: nextDateStr,
          timezone: data.attendeeTimezone,
        });

        const nextSlot = nextAvailableSlots.find(
          (slot) => new Date(slot.time).getTime() === nextStart.getTime(),
        );

        if (!nextSlot) {
          return NextResponse.json(
            {
              error: "conflict",
              message: `Recurring slot ${i + 1} is not available`,
            },
            { status: 409 },
          );
        }

        bookingsToCreate.push({
          startTime: nextStart,
          endTime: nextEnd,
          recurringEventId,
        });
      }
    }

    // Create all bookings in a transaction
    const bookings = await prisma.$transaction(async (tx) => {
      const createdBookings = [];

      for (const bookingData of bookingsToCreate) {
        const booking = await tx.booking.create({
          data: {
            uid: crypto.randomUUID(),
            title: eventType.title,
            startTime: bookingData.startTime,
            endTime: bookingData.endTime,
            status: eventType.requiresConfirmation ? "PENDING" : "ACCEPTED",
            attendeeName: data.attendeeName,
            attendeeEmail: data.attendeeEmail,
            attendeeTimezone: data.attendeeTimezone,
            attendeeNotes: data.attendeeNotes,
            location: data.location || null,
            responses: data.responses as any,
            recurringEventId: bookingData.recurringEventId,
            userId: eventType.user!.id,
            eventTypeId: eventType.id,
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

        createdBookings.push(booking);
      }

      return createdBookings;
    });

    // Send emails for the first/main booking
    const primaryBooking = bookings[0];
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const cancelUrl = `${baseUrl}/booking/${primaryBooking.uid}/cancel`;
    const rescheduleUrl = `${baseUrl}/booking/${primaryBooking.uid}/reschedule`;

    // Send confirmation email to attendee
    sendBookingConfirmationEmail({
      attendeeName: data.attendeeName,
      attendeeEmail: data.attendeeEmail,
      eventTitle: eventType.title,
      startTime: primaryBooking.startTime,
      endTime: primaryBooking.endTime,
      timezone: data.attendeeTimezone,
      location: data.location,
      hostName: eventType.user.name || eventType.user.email,
      bookingUid: primaryBooking.uid,
      cancelUrl,
      rescheduleUrl,
    });

    // Send notification email to host
    const acceptUrl = eventType.requiresConfirmation
      ? `${baseUrl}/api/bookings/${primaryBooking.uid}?action=accept&token=${primaryBooking.uid}`
      : undefined;
    const rejectUrl = eventType.requiresConfirmation
      ? `${baseUrl}/api/bookings/${primaryBooking.uid}?action=reject&token=${primaryBooking.uid}`
      : undefined;

    sendBookingNotificationEmail({
      hostName: eventType.user.name || eventType.user.email,
      hostEmail: eventType.user.email,
      attendeeName: data.attendeeName,
      attendeeEmail: data.attendeeEmail,
      eventTitle: eventType.title,
      startTime: primaryBooking.startTime,
      endTime: primaryBooking.endTime,
      timezone: eventType.user.timezone,
      location: data.location,
      attendeeNotes: data.attendeeNotes,
      bookingUid: primaryBooking.uid,
      acceptUrl,
      rejectUrl,
    });

    // Trigger webhook
    await triggerWebhooks(eventType.user.id, WEBHOOK_EVENTS.BOOKING_CREATED, {
      bookingId: primaryBooking.id,
      bookingUid: primaryBooking.uid,
      eventTypeId: eventType.id,
      attendeeEmail: data.attendeeEmail,
      startTime: primaryBooking.startTime.toISOString(),
      endTime: primaryBooking.endTime.toISOString(),
    });

    // Return the primary booking with UID for client redirect
    return NextResponse.json(
      {
        booking: primaryBooking,
        recurringCount: bookings.length,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating booking:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "validation",
          message: "Invalid booking data",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "internal", message: "Failed to create booking" },
      { status: 500 },
    );
  }
}
