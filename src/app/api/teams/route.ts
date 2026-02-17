import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/api-auth";
import { teamSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";

// GET /api/teams — List teams the authenticated user belongs to
export const GET = withAuth(async (_request, _context, user) => {
  try {
    const memberships = await prisma.teamMember.findMany({
      where: { userId: user.id },
      include: {
        team: {
          include: {
            _count: {
              select: { members: true },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const teams = memberships.map((m) => ({
      ...m.team,
      memberCount: m.team._count.members,
      userRole: m.role,
      accepted: m.accepted,
    }));

    return NextResponse.json({ success: true, data: teams });
  } catch (error) {
    console.error("GET /api/teams error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

// POST /api/teams — Create a new team; creator becomes OWNER
export const POST = withAuth(async (request, _context, user) => {
  try {
    const body = await request.json();

    // Allow name-only creation — auto-generate slug if not provided
    const createSchema = teamSchema.extend({
      slug: teamSchema.shape.slug.optional(),
      logoUrl: z.string().url("Invalid logo URL").optional().nullable(),
    });

    const validated = createSchema.parse(body);

    // Generate slug from name if not provided
    let slug = validated.slug ?? generateSlug(validated.name);

    // Deduplicate slug globally (team slugs are globally unique)
    const existing = await prisma.team.findMany({
      where: { slug: { startsWith: slug } },
      select: { slug: true },
    });

    if (existing.length > 0) {
      const existingSlugs = new Set(existing.map((t) => t.slug));
      if (existingSlugs.has(slug)) {
        let counter = 2;
        while (existingSlugs.has(`${slug}-${counter}`)) {
          counter++;
        }
        slug = `${slug}-${counter}`;
      }
    }

    // Create team + creator as OWNER in a transaction
    const team = await prisma.$transaction(async (tx) => {
      const newTeam = await tx.team.create({
        data: {
          name: validated.name,
          slug,
          logoUrl: validated.logoUrl ?? undefined,
          bio: validated.bio ?? undefined,
        },
      });

      await tx.teamMember.create({
        data: {
          userId: user.id,
          teamId: newTeam.id,
          role: "OWNER",
          accepted: true,
        },
      });

      return newTeam;
    });

    const teamWithCount = await prisma.team.findUnique({
      where: { id: team.id },
      include: {
        _count: { select: { members: true } },
      },
    });

    return NextResponse.json({ success: true, data: teamWithCount }, { status: 201 });
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

    console.error("POST /api/teams error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
