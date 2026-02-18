import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/teams/[slug]/public — Public team info: name, slug, logoUrl, bio, member names and avatars.
// No auth required.
export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;

    const team = await prisma.team.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        bio: true,
        members: {
          where: { accepted: true },
          select: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const members = team.members.map((m) => m.user);

    return NextResponse.json({
      success: true,
      data: {
        id: team.id,
        name: team.name,
        slug: team.slug,
        logoUrl: team.logoUrl,
        bio: team.bio,
        members,
      },
    });
  } catch (error) {
    console.error('GET /api/teams/[slug]/public error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
