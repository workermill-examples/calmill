// Schedules API - List and Create
// GET: List authenticated user's schedules
// POST: Create new schedule

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Validation schema for creating schedules
const createScheduleSchema = z.object({
  name: z.string().min(1).max(255),
  timezone: z.string().min(1),
  isDefault: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "unauthorized", message: "Authentication required" },
        { status: 401 },
      );
    }

    // Fetch schedules with related data
    const schedules = await prisma.schedule.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        availabilities: {
          orderBy: [{ day: "asc" }, { startTime: "asc" }],
        },
        dateOverrides: {
          orderBy: { date: "asc" },
        },
        _count: {
          select: {
            eventTypes: true,
          },
        },
      },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      schedules: schedules.map((schedule) => ({
        ...schedule,
        eventTypeCount: schedule._count.eventTypes,
      })),
    });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Failed to fetch schedules" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "unauthorized", message: "Authentication required" },
        { status: 401 },
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const data = createScheduleSchema.parse(body);

    // If setting as default, update existing default to false
    if (data.isDefault) {
      await prisma.schedule.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Create schedule
    const schedule = await prisma.schedule.create({
      data: {
        ...data,
        userId: session.user.id,
      },
      include: {
        availabilities: {
          orderBy: [{ day: "asc" }, { startTime: "asc" }],
        },
        dateOverrides: {
          orderBy: { date: "asc" },
        },
        _count: {
          select: {
            eventTypes: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        schedule: {
          ...schedule,
          eventTypeCount: schedule._count.eventTypes,
        },
      },
      { status: 201 },
    );
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

    console.error("Error creating schedule:", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Failed to create schedule" },
      { status: 500 },
    );
  }
}
