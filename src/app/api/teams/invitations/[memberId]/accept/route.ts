// Accept Team Invitation API
// POST: Accept a pending team invitation

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> },
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

    const { memberId } = await params;

    // Find the pending invitation
    const invitation = await prisma.teamMember.findFirst({
      where: {
        id: memberId,
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
          },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        {
          error: "not_found",
          message: "Invitation not found or already processed",
        },
        { status: 404 },
      );
    }

    // Accept the invitation
    const acceptedMembership = await prisma.teamMember.update({
      where: {
        id: memberId,
      },
      data: {
        accepted: true,
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
                eventTypes: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json({
      membership: {
        id: acceptedMembership.id,
        role: acceptedMembership.role,
        accepted: acceptedMembership.accepted,
        createdAt: acceptedMembership.createdAt,
        team: {
          ...acceptedMembership.team,
          memberCount: acceptedMembership.team._count.members,
          eventTypeCount: acceptedMembership.team._count.eventTypes,
        },
      },
      message: `Successfully joined team "${acceptedMembership.team.name}"`,
    });
  } catch (error) {
    console.error("Error accepting team invitation:", error);
    return NextResponse.json(
      {
        error: "internal_server_error",
        message: "Failed to accept team invitation",
      },
      { status: 500 },
    );
  }
}
