import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/api-auth';

// GET /api/teams/invitations — List pending invitations for the authenticated user.
export const GET = withAuth(async (_request, _context, user) => {
  try {
    const invitations = await prisma.teamMember.findMany({
      where: { userId: user.id, accepted: false },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            bio: true,
            _count: { select: { members: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: invitations });
  } catch (error) {
    console.error('GET /api/teams/invitations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
