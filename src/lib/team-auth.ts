import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { TeamRole } from "@/generated/prisma/client";

// Role tier for comparison — higher = more privilege
const ROLE_TIER: Record<TeamRole, number> = {
  OWNER: 2,
  ADMIN: 1,
  MEMBER: 0,
};

type TeamMemberResult = {
  id: string;
  role: TeamRole;
  accepted: boolean;
  userId: string;
  teamId: string;
};

/**
 * Verify the user is a member of the team (by slug).
 * Returns either { member } or { error: NextResponse }.
 */
export async function verifyTeamMembership(
  userId: string,
  teamSlug: string
): Promise<{ member: TeamMemberResult; error?: never } | { error: NextResponse; member?: never }> {
  const member = await prisma.teamMember.findFirst({
    where: {
      userId,
      team: { slug: teamSlug },
    },
    select: {
      id: true,
      role: true,
      accepted: true,
      userId: true,
      teamId: true,
    },
  });

  if (!member) {
    return {
      error: NextResponse.json({ error: "Team not found or not a member" }, { status: 404 }),
    };
  }

  return { member };
}

/**
 * Verify the user has at least the required role in the team (by slug).
 * Returns either { member } or { error: NextResponse }.
 */
export async function verifyTeamRole(
  userId: string,
  teamSlug: string,
  requiredRole: TeamRole
): Promise<{ member: TeamMemberResult; error?: never } | { error: NextResponse; member?: never }> {
  const result = await verifyTeamMembership(userId, teamSlug);
  if (result.error) return result;

  const { member } = result;

  if (ROLE_TIER[member.role] < ROLE_TIER[requiredRole]) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { member };
}
