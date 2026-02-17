import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/api-auth";
import { verifyTeamRole } from "@/lib/team-auth";
import { generateSlug } from "@/lib/utils";

const createTeamEventTypeSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long").trim(),
  duration: z.number().int().min(5, "Duration must be at least 5 minutes").max(720),
  schedulingType: z.enum(["ROUND_ROBIN", "COLLECTIVE"]),
  description: z.string().max(5000).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  requiresConfirmation: z.boolean().optional(),
});

// GET /api/teams/[slug]/event-types — List team event types. Requires membership.
export const GET = withAuth(async (_request, context, user) => {
  try {
    const { slug } = await context.params;

    const memberResult = await verifyTeamRole(user.id, slug, "MEMBER");
    if (memberResult.error) return memberResult.error;

    const { member } = memberResult;

    const eventTypes = await prisma.eventType.findMany({
      where: { teamId: member.teamId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        duration: true,
        color: true,
        isActive: true,
        schedulingType: true,
        _count: { select: { bookings: true } },
      },
    });

    return NextResponse.json({ success: true, data: eventTypes });
  } catch (error) {
    console.error("GET /api/teams/[slug]/event-types error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

// POST /api/teams/[slug]/event-types — Create team event type. ADMIN+ required.
export const POST = withAuth(async (request, context, user) => {
  try {
    const { slug } = await context.params;

    const roleResult = await verifyTeamRole(user.id, slug, "ADMIN");
    if (roleResult.error) return roleResult.error;

    const { member } = roleResult;

    if (!member.accepted) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validated = createTeamEventTypeSchema.parse(body);

    // Generate a unique slug for this team context (unique per userId+slug)
    let etSlug = generateSlug(validated.title);

    // Deduplicate: event type slug must be unique per user
    const existing = await prisma.eventType.findMany({
      where: { userId: user.id, slug: { startsWith: etSlug } },
      select: { slug: true },
    });

    if (existing.length > 0) {
      const slugSet = new Set(existing.map((e) => e.slug));
      if (slugSet.has(etSlug)) {
        let counter = 2;
        while (slugSet.has(`${etSlug}-${counter}`)) {
          counter++;
        }
        etSlug = `${etSlug}-${counter}`;
      }
    }

    const eventType = await prisma.eventType.create({
      data: {
        title: validated.title,
        slug: etSlug,
        duration: validated.duration,
        schedulingType: validated.schedulingType,
        description: validated.description ?? undefined,
        color: validated.color ?? undefined,
        requiresConfirmation: validated.requiresConfirmation ?? false,
        userId: user.id,
        teamId: member.teamId,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        duration: true,
        color: true,
        isActive: true,
        schedulingType: true,
        _count: { select: { bookings: true } },
      },
    });

    return NextResponse.json({ success: true, data: eventType }, { status: 201 });
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

    console.error("POST /api/teams/[slug]/event-types error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
