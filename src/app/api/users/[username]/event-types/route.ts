import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/users/[username]/event-types — Public active event types for a user
// Returns only public-safe fields: title, slug, description, duration, locations, price, currency
export async function GET(_request: Request, context: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await context.params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const eventTypes = await prisma.eventType.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        duration: true,
        locations: true,
        price: true,
        currency: true,
        color: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, data: eventTypes });
  } catch (error) {
    console.error('GET /api/users/[username]/event-types error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
