// Team Invitations API
// GET: List pending invitations for the authenticated user

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    // Get pending team invitations for the user
    const invitations = await prisma.teamMember.findMany({
      where: {
        userId: session.user.id,
        accepted: false,
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            bio: true,
            _count: {
              select: {
                members: {
                  where: {
                    accepted: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      invitations: invitations.map((invitation) => ({
        id: invitation.id,
        role: invitation.role,
        createdAt: invitation.createdAt,
        team: {
          ...invitation.team,
          memberCount: invitation.team._count.members,
        },
      })),
    });
  } catch (error) {
    console.error("Error fetching team invitations:", error);
    return NextResponse.json(
      {
        error: "internal_server_error",
        message: "Failed to fetch team invitations",
      },
      { status: 500 },
    );
  }
}
