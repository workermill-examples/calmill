// Public user event types endpoint
// GET /api/users/[username]/event-types - Get user's public event types

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;

    // Find user first
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "not_found", message: "User not found" },
        { status: 404 },
      );
    }

    // Get user's active event types (public information only)
    const eventTypes = await prisma.eventType.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        duration: true,
        price: true,
        currency: true,
        color: true,
        requiresConfirmation: true,
        minimumNotice: true,
        beforeBuffer: true,
        afterBuffer: true,
        slotInterval: true,
        maxBookingsPerDay: true,
        maxBookingsPerWeek: true,
        futureLimit: true,
        customQuestions: true,
        recurringEnabled: true,
        recurringFrequency: true,
        createdAt: true,
        schedule: {
          select: {
            id: true,
            name: true,
            timezone: true,
          },
        },
        // Include booking count for popularity
        _count: {
          select: {
            bookings: {
              where: {
                status: {
                  in: ["ACCEPTED", "PENDING"],
                },
              },
            },
          },
        },
      },
      orderBy: [{ createdAt: "desc" }],
    });

    // Format response with JSON parsing for customQuestions
    const formattedEventTypes = eventTypes.map((eventType) => ({
      ...eventType,
      customQuestions: eventType.customQuestions
        ? JSON.parse(eventType.customQuestions as string)
        : [],
      bookingCount: eventType._count.bookings,
    }));

    return NextResponse.json({
      eventTypes: formattedEventTypes,
    });
  } catch (error) {
    console.error("Error fetching public event types:", error);
    return NextResponse.json(
      { error: "internal", message: "Failed to fetch event types" },
      { status: 500 },
    );
  }
}
