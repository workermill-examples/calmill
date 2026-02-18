import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TeamsListClient } from './teams-list';

export default async function TeamsPage() {
  const session = await auth();
  if (!session) redirect('/login');
  const userId = session.user.id;

  // Fetch teams the user belongs to (any role, including pending)
  const memberships = await prisma.teamMember.findMany({
    where: { userId },
    include: {
      team: {
        include: {
          _count: {
            select: { members: true, eventTypes: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  const teams = memberships.map((m) => ({
    id: m.team.id,
    name: m.team.name,
    slug: m.team.slug,
    logoUrl: m.team.logoUrl,
    bio: m.team.bio,
    memberCount: m.team._count.members,
    eventTypeCount: m.team._count.eventTypes,
    userRole: m.role as 'OWNER' | 'ADMIN' | 'MEMBER',
    accepted: m.accepted,
  }));

  // Pending invitations for this user
  const pendingInvitations = memberships
    .filter((m) => !m.accepted)
    .map((m) => ({
      id: m.id,
      teamName: m.team.name,
      teamSlug: m.team.slug,
      role: m.role as 'OWNER' | 'ADMIN' | 'MEMBER',
    }));

  return <TeamsListClient initialTeams={teams} pendingInvitations={pendingInvitations} />;
}
