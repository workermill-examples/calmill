import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/api-auth';
import { verifyTeamRole } from '@/lib/team-auth';

// DELETE /api/teams/[slug]/event-types/[eventTypeId] — Delete a team event type. ADMIN+ required.
export const DELETE = withAuth(async (_request, context, user) => {
  try {
    const { slug, eventTypeId } = await context.params;
    if (!slug || !eventTypeId)
      return NextResponse.json({ error: 'Invalid route' }, { status: 400 });

    const roleResult = await verifyTeamRole(user.id, slug, 'ADMIN');
    if (roleResult.error) return roleResult.error;

    const { member } = roleResult;

    if (!member.accepted) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify the event type belongs to this team
    const eventType = await prisma.eventType.findFirst({
      where: { id: eventTypeId, teamId: member.teamId },
    });

    if (!eventType) {
      return NextResponse.json({ error: 'Event type not found' }, { status: 404 });
    }

    // Delete bookings then the event type
    await prisma.$transaction([
      prisma.booking.deleteMany({ where: { eventTypeId } }),
      prisma.eventType.delete({ where: { id: eventTypeId } }),
    ]);

    return NextResponse.json({ success: true, message: 'Event type deleted' });
  } catch (error) {
    console.error('DELETE /api/teams/[slug]/event-types/[eventTypeId] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
