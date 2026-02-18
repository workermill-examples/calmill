import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/api-auth';

// POST /api/teams/invitations/[memberId]/accept — Accept a team invitation.
export const POST = withAuth(async (_request, context, user) => {
  try {
    const { memberId } = await context.params;

    // Verify the invitation belongs to the authenticated user and is pending
    const invitation = await prisma.teamMember.findFirst({
      where: { id: memberId, userId: user.id, accepted: false },
      include: {
        team: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found or already accepted' },
        { status: 404 }
      );
    }

    const accepted = await prisma.teamMember.update({
      where: { id: memberId },
      data: { accepted: true },
      include: {
        team: {
          select: { id: true, name: true, slug: true, logoUrl: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: accepted });
  } catch (error) {
    console.error('POST /api/teams/invitations/[memberId]/accept error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
