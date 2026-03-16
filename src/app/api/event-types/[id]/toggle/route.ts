// Event Type Toggle API - Toggle active status
// PATCH: Toggle isActive status of an event type

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
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
    const eventType = await prisma.eventType.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!eventType) {
      return NextResponse.json(
        { error: "not_found", message: "Event type not found" },
        { status: 404 },
      );
    }

    // If deactivating, check for active bookings
    if (eventType.isActive) {
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
            message: `Cannot deactivate event type with ${activeBookings} active or future bookings`,
            details: { activeBookings },
          },
          { status: 409 },
        );
      }
    }

    // Toggle the isActive status
    const updatedEventType = await prisma.eventType.update({
      where: { id },
      data: {
        isActive: !eventType.isActive,
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
        ...updatedEventType,
        bookingCount: updatedEventType._count.bookings,
        customQuestions: updatedEventType.customQuestions
          ? JSON.parse(updatedEventType.customQuestions as string)
          : null,
      },
      message: `Event type ${updatedEventType.isActive ? "activated" : "deactivated"} successfully`,
    });
  } catch (error) {
    console.error("Error toggling event type status:", error);
    return NextResponse.json(
      {
        error: "internal_server_error",
        message: "Failed to toggle event type status",
      },
      { status: 500 },
    );
  }
}
