import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/api-auth";

// GET /api/integrations/google/calendars — List connected Google calendars
export const GET = withAuth(async (_request, _context, user) => {
  try {
    const connections = await prisma.calendarConnection.findMany({
      where: { userId: user.id, provider: "google" },
      select: {
        id: true,
        email: true,
        isPrimary: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, data: connections });
  } catch (error) {
    console.error("GET /api/integrations/google/calendars error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
