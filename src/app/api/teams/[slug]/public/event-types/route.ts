import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/teams/[slug]/public/event-types — Active team event types. No auth required.
export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const team = await prisma.team.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const eventTypes = await prisma.eventType.findMany({
      where: {
        teamId: team.id,
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        duration: true,
        locations: true,
        price: true,
        currency: true,
        color: true,
        schedulingType: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, data: eventTypes });
  } catch (error) {
    console.error("GET /api/teams/[slug]/public/event-types error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
