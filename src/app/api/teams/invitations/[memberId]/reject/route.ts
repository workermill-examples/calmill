import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/api-auth";

// POST /api/teams/invitations/[memberId]/reject — Reject a team invitation. Deletes the TeamMember record.
export const POST = withAuth(async (_request, context, user) => {
  try {
    const { memberId } = await context.params;

    // Verify the invitation belongs to the authenticated user and is pending
    const invitation = await prisma.teamMember.findFirst({
      where: { id: memberId, userId: user.id, accepted: false },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found or already accepted" },
        { status: 404 }
      );
    }

    await prisma.teamMember.delete({ where: { id: memberId } });

    return NextResponse.json({ success: true, message: "Invitation rejected" });
  } catch (error) {
    console.error("POST /api/teams/invitations/[memberId]/reject error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
