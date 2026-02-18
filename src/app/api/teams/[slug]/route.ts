import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/api-auth';
import { teamSchema } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';
import { verifyTeamMembership, verifyTeamRole } from '@/lib/team-auth';

// GET /api/teams/[slug] — Team details with members and event types. Requires membership.
export const GET = withAuth(async (_request, context, user) => {
  try {
    const { slug } = await context.params;
    if (!slug) return NextResponse.json({ error: 'Invalid route' }, { status: 400 });

    // Verify the user is a member
    const memberResult = await verifyTeamMembership(user.id, slug);
    if (memberResult.error) return memberResult.error;

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
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { members: true } },
      },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: team });
  } catch (error) {
    console.error('GET /api/teams/[slug] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// PUT /api/teams/[slug] — Update team name, slug, logo, bio. Requires ADMIN or OWNER.
export const PUT = withAuth(async (request, context, user) => {
  try {
    const { slug } = await context.params;
    if (!slug) return NextResponse.json({ error: 'Invalid route' }, { status: 400 });

    // Require ADMIN or OWNER role
    const roleResult = await verifyTeamRole(user.id, slug, 'ADMIN');
    if (roleResult.error) return roleResult.error;

    const { member } = roleResult;

    const body = await request.json();

    const updateSchema = teamSchema
      .extend({
        logoUrl: z.string().url('Invalid logo URL').optional().nullable(),
      })
      .partial();

    const validated = updateSchema.parse(body);

    // Handle slug changes with global deduplication
    let newSlug = validated.slug;
    if (newSlug && newSlug !== slug) {
      const existingSlugs = await prisma.team.findMany({
        where: {
          slug: { startsWith: newSlug },
          id: { not: member.teamId },
        },
        select: { slug: true },
      });

      const slugSet = new Set(existingSlugs.map((t) => t.slug));
      if (slugSet.has(newSlug)) {
        let counter = 2;
        while (slugSet.has(`${newSlug}-${counter}`)) {
          counter++;
        }
        newSlug = `${newSlug}-${counter}`;
      }
    } else if (validated.name && !validated.slug) {
      // Auto-regenerate slug from new name if name changed and no explicit slug
      const baseSlug = generateSlug(validated.name);
      if (baseSlug !== slug) {
        const existingSlugs = await prisma.team.findMany({
          where: {
            slug: { startsWith: baseSlug },
            id: { not: member.teamId },
          },
          select: { slug: true },
        });

        const slugSet = new Set(existingSlugs.map((t) => t.slug));
        newSlug = baseSlug;
        if (slugSet.has(newSlug)) {
          let counter = 2;
          while (slugSet.has(`${newSlug}-${counter}`)) {
            counter++;
          }
          newSlug = `${newSlug}-${counter}`;
        }
      }
    }

    const updated = await prisma.team.update({
      where: { id: member.teamId },
      data: {
        ...(validated.name !== undefined && { name: validated.name }),
        ...(newSlug !== undefined && { slug: newSlug }),
        ...(validated.bio !== undefined && { bio: validated.bio }),
        ...(validated.logoUrl !== undefined && { logoUrl: validated.logoUrl }),
      },
      include: {
        _count: { select: { members: true } },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error('PUT /api/teams/[slug] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// DELETE /api/teams/[slug] — Delete team. OWNER only. Cascades TeamMembers and team EventTypes.
export const DELETE = withAuth(async (_request, context, user) => {
  try {
    const { slug } = await context.params;
    if (!slug) return NextResponse.json({ error: 'Invalid route' }, { status: 400 });

    // Require OWNER role
    const roleResult = await verifyTeamRole(user.id, slug, 'OWNER');
    if (roleResult.error) return roleResult.error;

    const { member } = roleResult;

    // Cascade delete: bookings → event types → members → team
    // (Prisma schema has onDelete: Cascade on TeamMember, but not on EventType or Booking)
    await prisma.$transaction([
      // 1. Delete bookings for team event types (no cascade from EventType → Booking)
      prisma.booking.deleteMany({
        where: { eventType: { teamId: member.teamId } },
      }),
      // 2. Delete team event types (no cascade from Team → EventType)
      prisma.eventType.deleteMany({ where: { teamId: member.teamId } }),
      // 3. Delete team members (schema has Cascade but we do it explicitly for safety)
      prisma.teamMember.deleteMany({ where: { teamId: member.teamId } }),
      // 4. Delete the team itself
      prisma.team.delete({ where: { id: member.teamId } }),
    ]);

    return NextResponse.json({ success: true, message: 'Team deleted' });
  } catch (error) {
    console.error('DELETE /api/teams/[slug] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
