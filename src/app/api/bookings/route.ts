import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/api-auth";
import { bookingCreateSchema } from "@/lib/validations";
import { getAvailableSlots } from "@/lib/slots";

// ─── GET /api/bookings — Authenticated user's bookings ──────────────────────

export async function GET(request: Request) {
  const authResult = await getAuthenticatedUser();
  if (authResult.error) return authResult.error;
  const { user } = authResult;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
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
          select: { id: true, name: true, email: true },
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

    // Re-verify the requested slot is still available
    const startDateStr = startTime.toISOString().slice(0, 10);
    const endDateStr = startDateStr;
    const availableSlots = await getAvailableSlots({
      eventTypeId: validated.eventTypeId,
      startDate: startDateStr,
      endDate: endDateStr,
      timezone: validated.attendeeTimezone,
    });

    const isAvailable = availableSlots.some(
      (slot) => new Date(slot.time).getTime() === startTime.getTime()
    );

    if (!isAvailable) {
      return NextResponse.json(
        { error: "The requested time slot is no longer available" },
        { status: 409 }
      );
    }

    // Determine initial status
    const status = eventType.requiresConfirmation ? "PENDING" : "ACCEPTED";

    // Build booking title
    const title = `${validated.attendeeName} <> ${eventType.user.name ?? eventType.user.email}`;

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
        userId: eventType.userId,
        eventTypeId: eventType.id,
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
