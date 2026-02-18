import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/api-auth";
import { inviteTeamMemberSchema } from "@/lib/validations";
import { verifyTeamRole } from "@/lib/team-auth";
import type { TeamRole } from "@/generated/prisma/client";

// Role tier for restricting which roles an inviter can assign
const ROLE_TIER: Record<TeamRole, number> = {
  OWNER: 2,
  ADMIN: 1,
  MEMBER: 0,
};

// GET /api/teams/[slug]/members — List team members with user details, role, and accepted status.
// Requires accepted membership.
export const GET = withAuth(async (_request, context, user) => {
  try {
    const { slug } = await context.params;
    if (!slug) return NextResponse.json({ error: "Invalid route" }, { status: 400 });

    // Require accepted membership to view member list
    const actorMembership = await prisma.teamMember.findFirst({
      where: { userId: user.id, team: { slug }, accepted: true },
      select: { id: true, teamId: true },
    });

    if (!actorMembership) {
      return NextResponse.json({ error: "Team not found or not a member" }, { status: 404 });
    }

    const members = await prisma.teamMember.findMany({
      where: { teamId: actorMembership.teamId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            timezone: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, data: members });
  } catch (error) {
    console.error("GET /api/teams/[slug]/members error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

// POST /api/teams/[slug]/members — Invite a member by email. ADMIN+ required.
export const POST = withAuth(async (request, context, user) => {
  try {
    const { slug } = await context.params;
    if (!slug) return NextResponse.json({ error: "Invalid route" }, { status: 400 });

    // Require ADMIN or OWNER role (verifyTeamRole currently allows pending members — we need accepted check)
    const roleResult = await verifyTeamRole(user.id, slug, "ADMIN");
    if (roleResult.error) return roleResult.error;

    const { member: inviterMember } = roleResult;

    // Ensure the inviter has accepted their membership (not just invited as ADMIN)
    if (!inviterMember.accepted) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validated = inviteTeamMemberSchema.parse(body);

    // Non-OWNER inviter cannot grant OWNER role
    if (ROLE_TIER[validated.role] > ROLE_TIER[inviterMember.role]) {
      return NextResponse.json(
        { error: "Cannot grant a role higher than your own" },
        { status: 403 }
      );
    }

    // Look up the invited user by email
    const invitedUser = await prisma.user.findUnique({
      where: { email: validated.email },
      select: { id: true, name: true, email: true },
    });

    if (!invitedUser) {
      return NextResponse.json(
        { error: "User not found. They must have an account before being invited." },
        { status: 404 }
      );
    }

    // Check if already a member (pending or accepted)
    const existing = await prisma.teamMember.findUnique({
      where: { userId_teamId: { userId: invitedUser.id, teamId: inviterMember.teamId } },
    });

    if (existing) {
      const status = existing.accepted ? "already a member" : "already has a pending invitation";
      return NextResponse.json({ error: `User is ${status} of this team.` }, { status: 409 });
    }

    // Create invitation (accepted: false by default)
    const newMember = await prisma.teamMember.create({
      data: {
        userId: invitedUser.id,
        teamId: inviterMember.teamId,
        role: validated.role,
        accepted: false,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            timezone: true,
          },
        },
      },
    });

    // Log the invitation (no email service required per spec)
    console.log(
      `Invitation sent: ${invitedUser.email} invited to team ${slug} with role ${validated.role}`
    );

    return NextResponse.json({ success: true, data: newMember }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((e) => ({ field: e.path.join("."), message: e.message })),
        },
        { status: 400 }
      );
    }

    console.error("POST /api/teams/[slug]/members error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
