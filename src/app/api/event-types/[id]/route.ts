// Individual Event Type API - Get, Update, Delete
// GET: Get specific event type
// PUT: Update event type
// DELETE: Delete event type

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Validation schema for updating event types
const updateEventTypeSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens",
    })
    .optional(),
  description: z.string().optional(),
  duration: z.number().int().min(1).max(480).optional(), // 1 minute to 8 hours
  isActive: z.boolean().optional(),
  requiresConfirmation: z.boolean().optional(),
  price: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  minimumNotice: z.number().int().min(0).optional(), // minutes
  beforeBuffer: z.number().int().min(0).optional(),
  afterBuffer: z.number().int().min(0).optional(),
  slotInterval: z.number().int().min(1).optional(),
  maxBookingsPerDay: z.number().int().min(1).optional(),
  maxBookingsPerWeek: z.number().int().min(1).optional(),
  futureLimit: z.number().int().min(1).optional(), // days
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  customQuestions: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum([
          "text",
          "textarea",
          "select",
          "radio",
          "checkbox",
          "phone",
        ]),
        label: z.string(),
        required: z.boolean().default(false),
        options: z.array(z.string()).optional(),
        placeholder: z.string().optional(),
      }),
    )
    .optional(),
  recurringEnabled: z.boolean().optional(),
  recurringFrequency: z.enum(["weekly", "biweekly", "monthly"]).optional(),
  scheduleId: z.string().optional(),
});

async function getEventType(id: string, userId: string) {
  return await prisma.eventType.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      schedule: {
        select: {
          id: true,
          name: true,
          timezone: true,
        },
      },
      _count: {
        select: {
          bookings: {
            where: {
              status: {
                notIn: ["CANCELLED", "REJECTED"],
              },
            },
          },
        },
      },
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "unauthorized", message: "Authentication required" },
        { status: 401 },
      );
    }

    // Await params for Next.js 16 compatibility
    const { id } = await params;

    // Fetch event type
    const eventType = await getEventType(id, session.user.id);

    if (!eventType) {
      return NextResponse.json(
        { error: "not_found", message: "Event type not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      eventType: {
        ...eventType,
        bookingCount: eventType._count.bookings,
        customQuestions: eventType.customQuestions
          ? JSON.parse(eventType.customQuestions as string)
          : null,
      },
    });
  } catch (error) {
    console.error("Error fetching event type:", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Failed to fetch event type" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "unauthorized", message: "Authentication required" },
        { status: 401 },
      );
    }

    // Await params for Next.js 16 compatibility
    const { id } = await params;

    // Parse and validate request body
    const body = await request.json();
    const data = updateEventTypeSchema.parse(body);

    // Check if event type exists and belongs to user
    const existingEventType = await getEventType(id, session.user.id);

    if (!existingEventType) {
      return NextResponse.json(
        { error: "not_found", message: "Event type not found" },
        { status: 404 },
      );
    }

    // Check slug uniqueness if it's being changed
    if (data.slug && data.slug !== existingEventType.slug) {
      const slugExists = await prisma.eventType.findUnique({
        where: {
          userId_slug: {
            userId: session.user.id,
            slug: data.slug,
          },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          {
            error: "conflict",
            message: "An event type with this slug already exists",
          },
          { status: 409 },
        );
      }
    }

    // Validate schedule exists if provided
    if (data.scheduleId) {
      const schedule = await prisma.schedule.findFirst({
        where: {
          id: data.scheduleId,
          userId: session.user.id,
        },
      });

      if (!schedule) {
        return NextResponse.json(
          { error: "not_found", message: "Schedule not found" },
          { status: 404 },
        );
      }
    }

    // Update event type
    const eventType = await prisma.eventType.update({
      where: { id },
      data: {
        ...data,
        customQuestions: data.customQuestions
          ? JSON.stringify(data.customQuestions)
          : undefined,
      },
      include: {
        schedule: {
          select: {
            id: true,
            name: true,
            timezone: true,
          },
        },
        _count: {
          select: {
            bookings: {
              where: {
                status: {
                  notIn: ["CANCELLED", "REJECTED"],
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      eventType: {
        ...eventType,
        bookingCount: eventType._count.bookings,
        customQuestions: eventType.customQuestions
          ? JSON.parse(eventType.customQuestions as string)
          : null,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid request data",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    console.error("Error updating event type:", error);
    return NextResponse.json(
      {
        error: "internal_server_error",
        message: "Failed to update event type",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "unauthorized", message: "Authentication required" },
        { status: 401 },
      );
    }

    // Await params for Next.js 16 compatibility
    const { id } = await params;

    // Check if event type exists and belongs to user
    const eventType = await getEventType(id, session.user.id);

    if (!eventType) {
      return NextResponse.json(
        { error: "not_found", message: "Event type not found" },
        { status: 404 },
      );
    }

    // Check if there are active bookings for this event type
    const activeBookings = await prisma.booking.count({
      where: {
        eventTypeId: id,
        status: {
          in: ["PENDING", "ACCEPTED"],
        },
        startTime: {
          gte: new Date(),
        },
      },
    });

    if (activeBookings > 0) {
      return NextResponse.json(
        {
          error: "conflict",
          message: `Cannot delete event type with ${activeBookings} active or future bookings`,
          details: { activeBookings },
        },
        { status: 409 },
      );
    }

    // Delete the event type (will cascade delete bookings due to schema)
    await prisma.eventType.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Event type deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event type:", error);
    return NextResponse.json(
      {
        error: "internal_server_error",
        message: "Failed to delete event type",
      },
      { status: 500 },
    );
  }
}
