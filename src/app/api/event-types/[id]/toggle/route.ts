import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, verifyOwnership } from '@/lib/api-auth';

// PATCH /api/event-types/[id]/toggle — Toggle isActive for an event type
export const PATCH = withAuth(async (_request, context, user) => {
  try {
    const { id } = await context.params;

    const eventType = await prisma.eventType.findUnique({
      where: { id },
      select: { id: true, userId: true, isActive: true },
    });

    if (!eventType) {
      return NextResponse.json({ error: 'Event type not found' }, { status: 404 });
    }

    const ownershipError = await verifyOwnership(user.id, eventType.userId);
    if (ownershipError) return ownershipError;

    const updated = await prisma.eventType.update({
      where: { id },
      data: { isActive: !eventType.isActive },
      select: { id: true, isActive: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('PATCH /api/event-types/[id]/toggle error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
