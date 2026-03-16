// Teams API - List and Create
// GET: List teams where user is a member
// POST: Create new team

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Validation schema for creating teams
const createTeamSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens",
    }),
  logoUrl: z.string().url().optional(),
  bio: z.string().max(1000).optional(),
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

    // Get teams where user is a member
    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
            accepted: true,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                username: true,
              },
            },
          },
        },
        eventTypes: {
          select: {
            id: true,
            title: true,
            slug: true,
            duration: true,
            isActive: true,
            schedulingType: true,
          },
        },
        _count: {
          select: {
            members: {
              where: {
                accepted: true,
              },
            },
            eventTypes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format response to include user's role in each team
    const formattedTeams = teams.map((team) => {
      const userMembership = team.members.find(
        (m) => m.userId === session.user.id,
      );
      return {
        ...team,
        userRole: userMembership?.role,
        memberCount: team._count.members,
        eventTypeCount: team._count.eventTypes,
      };
    });

    return NextResponse.json({
      teams: formattedTeams,
    });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Failed to fetch teams" },
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
    const data = createTeamSchema.parse(body);

    // Check if slug is unique globally
    const existingTeam = await prisma.team.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (existingTeam) {
      return NextResponse.json(
        { error: "conflict", message: "A team with this slug already exists" },
        { status: 409 },
      );
    }

    // Create team with user as owner
    const team = await prisma.team.create({
      data: {
        ...data,
        members: {
          create: {
            userId: session.user.id,
            role: "OWNER",
            accepted: true,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                username: true,
              },
            },
          },
        },
        eventTypes: true,
        _count: {
          select: {
            members: {
              where: {
                accepted: true,
              },
            },
            eventTypes: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        team: {
          ...team,
          userRole: "OWNER",
          memberCount: team._count.members,
          eventTypeCount: team._count.eventTypes,
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

    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Failed to create team" },
      { status: 500 },
    );
  }
}
