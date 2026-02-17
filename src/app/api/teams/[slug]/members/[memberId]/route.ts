import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/api-auth";
import { verifyTeamRole } from "@/lib/team-auth";

const updateRoleSchema = z.object({
  role: z.enum(["OWNER", "ADMIN", "MEMBER"]),
});

// PUT /api/teams/[slug]/members/[memberId] — Update member role. OWNER only.
export const PUT = withAuth(async (request, context, user) => {
  try {
    const { slug, memberId } = await context.params;

    // Require OWNER role
    const roleResult = await verifyTeamRole(user.id, slug, "OWNER");
    if (roleResult.error) return roleResult.error;

    const { member: actorMember } = roleResult;

    // Ensure the actor has accepted their membership
    if (!actorMember.accepted) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch the target member
    const targetMember = await prisma.teamMember.findFirst({
      where: { id: memberId, teamId: actorMember.teamId },
    });

    if (!targetMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Cannot change own role
    if (targetMember.userId === user.id) {
      return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
    }

    const body = await request.json();
    const validated = updateRoleSchema.parse(body);

    // If demoting an OWNER, protect against zero accepted OWNERs
    if (targetMember.role === "OWNER" && validated.role !== "OWNER") {
      const ownerCount = await prisma.teamMember.count({
        where: { teamId: actorMember.teamId, role: "OWNER", accepted: true },
      });
      if (ownerCount <= 1) {
        return NextResponse.json(
          { error: "Cannot remove the last owner. Assign another owner first." },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.teamMember.update({
      where: { id: memberId },
      data: { role: validated.role },
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

    return NextResponse.json({ success: true, data: updated });
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

    console.error("PUT /api/teams/[slug]/members/[memberId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

// DELETE /api/teams/[slug]/members/[memberId] — Remove a member.
// ADMIN+ to remove others; anyone (accepted or pending) can self-remove. Cannot remove last accepted OWNER.
export const DELETE = withAuth(async (_request, context, user) => {
  try {
    const { slug, memberId } = await context.params;

    // Fetch the target member to remove (must belong to this team by slug)
    const targetMember = await prisma.teamMember.findFirst({
      where: { id: memberId, team: { slug } },
      select: { id: true, userId: true, teamId: true, role: true, accepted: true },
    });

    if (!targetMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const isSelfRemoval = targetMember.userId === user.id;

    if (isSelfRemoval) {
      // Anyone can remove themselves (accepted or pending — effectively rejecting an invite)
      // But verify the user actually belongs to this team at all
      const actorMembership = await prisma.teamMember.findFirst({
        where: { id: memberId, userId: user.id },
      });
      if (!actorMembership) {
        return NextResponse.json({ error: "Member not found" }, { status: 404 });
      }
    } else {
      // Removing someone else requires ADMIN+ with accepted membership
      const roleResult = await verifyTeamRole(user.id, slug, "ADMIN");
      if (roleResult.error) return roleResult.error;

      const { member: actorMember } = roleResult;
      if (!actorMember.accepted) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // Protect against removing the last accepted OWNER (even for self-removal)
    if (targetMember.role === "OWNER" && targetMember.accepted) {
      const ownerCount = await prisma.teamMember.count({
        where: { teamId: targetMember.teamId, role: "OWNER", accepted: true },
      });
      if (ownerCount <= 1) {
        return NextResponse.json(
          { error: "Cannot remove the last owner. Assign another owner first." },
          { status: 400 }
        );
      }
    }

    await prisma.teamMember.delete({ where: { id: memberId } });

    return NextResponse.json({ success: true, message: "Member removed" });
  } catch (error) {
    console.error("DELETE /api/teams/[slug]/members/[memberId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
