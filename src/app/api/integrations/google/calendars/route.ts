// Google Calendar calendars endpoint
// GET /api/integrations/google/calendars - List user's calendars

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCalendars } from "@/lib/google-calendar";

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

    // Find user's Google Calendar connection
    const connection = await prisma.calendarConnection.findFirst({
      where: {
        userId: session.user.id,
        provider: "google",
      },
    });

    if (!connection) {
      return NextResponse.json(
        {
          error: "not_connected",
          message: "No Google Calendar connection found",
        },
        { status: 404 },
      );
    }

    // Get calendars using Google Calendar API
    const calendars = await getCalendars(connection.id);

    return NextResponse.json({ calendars });
  } catch (error) {
    console.error("Error fetching calendars:", error);
    return NextResponse.json(
      { error: "internal", message: "Failed to fetch calendars" },
      { status: 500 },
    );
  }
}
