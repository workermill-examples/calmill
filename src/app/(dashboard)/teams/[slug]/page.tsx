import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TeamDetailClient } from './team-detail';
import type { TeamMemberData } from '@/components/teams/member-list';
import type { TeamEventTypeCardData } from '@/components/teams/team-event-type-card';

export default async function TeamDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session) redirect('/login');
  const userId = session.user.id;
  const { slug } = await params;

  // Verify membership and load team data
  const team = await prisma.team.findUnique({
    where: { slug },
    include: {
      members: {
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
        orderBy: { createdAt: 'asc' },
      },
      eventTypes: {
        orderBy: { createdAt: 'desc' },
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
      },
      _count: { select: { members: true } },
    },
  });

  if (!team) notFound();

  // Check the current user is a member (accepted)
  const currentMembership = team.members.find((m) => m.user.id === userId && m.accepted);

  if (!currentMembership) {
    // Not an accepted member — redirect to teams list
    redirect('/teams');
  }

  // Cast members to typed shape
  const members: TeamMemberData[] = team.members.map((m) => ({
    id: m.id,
    role: m.role as 'OWNER' | 'ADMIN' | 'MEMBER',
    accepted: m.accepted,
    user: {
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
      avatarUrl: m.user.avatarUrl,
      timezone: m.user.timezone,
    },
  }));

  // Cast event types
  const eventTypes: TeamEventTypeCardData[] = team.eventTypes.map((et) => ({
    id: et.id,
    title: et.title,
    slug: et.slug,
    description: et.description,
    duration: et.duration,
    color: et.color,
    isActive: et.isActive,
    schedulingType: et.schedulingType as 'ROUND_ROBIN' | 'COLLECTIVE' | null,
    _count: et._count,
  }));

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  return (
    <TeamDetailClient
      team={{
        id: team.id,
        name: team.name,
        slug: team.slug,
        logoUrl: team.logoUrl,
        bio: team.bio,
        memberCount: team._count.members,
      }}
      members={members}
      eventTypes={eventTypes}
      currentUserId={userId}
      currentUserRole={currentMembership.role as 'OWNER' | 'ADMIN' | 'MEMBER'}
      appUrl={appUrl}
    />
  );
}
