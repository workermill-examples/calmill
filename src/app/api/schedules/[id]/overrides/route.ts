// Date Overrides API - List and Create
// GET: List date overrides for a schedule
// POST: Create new date override

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Validation schema for creating date overrides
const createDateOverrideSchema = z
  .object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
    startTime: z
      .string()
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .optional(), // HH:mm format
    endTime: z
      .string()
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .optional(), // HH:mm format
    isUnavailable: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // If not unavailable, both start and end times are required
      if (!data.isUnavailable) {
        return data.startTime && data.endTime;
      }
      // If unavailable, times should be null
      if (data.isUnavailable) {
        return !data.startTime && !data.endTime;
      }
      return true;
    },
    {
      message:
        "For available overrides, both startTime and endTime are required. For unavailable overrides, both should be omitted.",
    },
  )
  .refine(
    (data) => {
      // If both times are provided, start must be before end
      if (data.startTime && data.endTime) {
        return data.startTime < data.endTime;
      }
      return true;
    },
    {
      message: "Start time must be before end time",
    },
  );

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
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

    const { id: scheduleId } = await context.params;

    // Verify schedule ownership
    const schedule = await prisma.schedule.findFirst({
      where: {
        id: scheduleId,
        userId: session.user.id,
      },
    });

    if (!schedule) {
      return NextResponse.json(
        { error: "not_found", message: "Schedule not found" },
        { status: 404 },
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build where clause
    const where: any = {
      scheduleId,
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    // Fetch date overrides
    const overrides = await prisma.dateOverride.findMany({
      where,
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ overrides });
  } catch (error) {
    console.error("Error fetching date overrides:", error);
    return NextResponse.json(
      {
        error: "internal_server_error",
        message: "Failed to fetch date overrides",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
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

    const { id: scheduleId } = await context.params;

    // Verify schedule ownership
    const schedule = await prisma.schedule.findFirst({
      where: {
        id: scheduleId,
        userId: session.user.id,
      },
    });

    if (!schedule) {
      return NextResponse.json(
        { error: "not_found", message: "Schedule not found" },
        { status: 404 },
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const data = createDateOverrideSchema.parse(body);

    // Check if override already exists for this date
    const existingOverride = await prisma.dateOverride.findFirst({
      where: {
        scheduleId,
        date: new Date(data.date),
      },
    });

    if (existingOverride) {
      return NextResponse.json(
        {
          error: "conflict",
          message: "Date override already exists for this date",
        },
        { status: 409 },
      );
    }

    // Prevent creating overrides for past dates
    const overrideDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (overrideDate < today) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Cannot create override for past dates",
        },
        { status: 400 },
      );
    }

    // Create date override
    const override = await prisma.dateOverride.create({
      data: {
        scheduleId,
        date: new Date(data.date),
        startTime: data.isUnavailable ? null : data.startTime!,
        endTime: data.isUnavailable ? null : data.endTime!,
        isUnavailable: data.isUnavailable,
      },
    });

    return NextResponse.json({ override }, { status: 201 });
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

    console.error("Error creating date override:", error);
    return NextResponse.json(
      {
        error: "internal_server_error",
        message: "Failed to create date override",
      },
      { status: 500 },
    );
  }
}
