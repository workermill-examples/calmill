import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withAuth, verifyOwnership } from '@/lib/api-auth';
import { eventTypeUpdateSchema } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';

// GET /api/event-types/[id] — Get a single event type
export const GET = withAuth(async (_request, context, user) => {
  try {
    const { id } = await context.params;

    const eventType = await prisma.eventType.findUnique({
      where: { id },
      include: {
        _count: {
          select: { bookings: true },
        },
        schedule: {
          include: {
            availability: true,
            dateOverrides: true,
          },
        },
      },
    });

    if (!eventType) {
      return NextResponse.json({ error: 'Event type not found' }, { status: 404 });
    }

    const ownershipError = await verifyOwnership(user.id, eventType.userId);
    if (ownershipError) return ownershipError;

    return NextResponse.json({ success: true, data: eventType });
  } catch (error) {
    console.error('GET /api/event-types/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// PUT /api/event-types/[id] — Update an event type
export const PUT = withAuth(async (request, context, user) => {
  try {
    const { id } = await context.params;

    const existing = await prisma.eventType.findUnique({
      where: { id },
      select: { id: true, userId: true, slug: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Event type not found' }, { status: 404 });
    }

    const ownershipError = await verifyOwnership(user.id, existing.userId);
    if (ownershipError) return ownershipError;

    const body = await request.json();
    const validated = eventTypeUpdateSchema.parse(body);

    // Handle slug changes with deduplication
    let slug = validated.slug;
    if (slug && slug !== existing.slug) {
      const existingSlugs = await prisma.eventType.findMany({
        where: {
          userId: user.id,
          slug: { startsWith: slug },
          id: { not: id },
        },
        select: { slug: true },
      });

      const slugSet = new Set(existingSlugs.map((e: { slug: string }) => e.slug));
      if (slugSet.has(slug)) {
        let counter = 2;
        while (slugSet.has(`${slug}-${counter}`)) {
          counter++;
        }
        slug = `${slug}-${counter}`;
      }
    } else if (validated.title && !validated.slug) {
      // Auto-regenerate slug from new title only if title changed and no explicit slug
      const baseSlug = generateSlug(validated.title);
      if (baseSlug !== existing.slug) {
        const existingSlugs = await prisma.eventType.findMany({
          where: {
            userId: user.id,
            slug: { startsWith: baseSlug },
            id: { not: id },
          },
          select: { slug: true },
        });

        const slugSet = new Set(existingSlugs.map((e: { slug: string }) => e.slug));
        slug = baseSlug;
        if (slugSet.has(slug)) {
          let counter = 2;
          while (slugSet.has(`${slug}-${counter}`)) {
            counter++;
          }
          slug = `${slug}-${counter}`;
        }
      }
    }

    const updated = await prisma.eventType.update({
      where: { id },
      data: {
        ...(validated.title !== undefined && { title: validated.title }),
        ...(slug !== undefined && { slug }),
        ...(validated.description !== undefined && { description: validated.description }),
        ...(validated.duration !== undefined && { duration: validated.duration }),
        ...(validated.locations !== undefined && { locations: validated.locations }),
        ...(validated.requiresConfirmation !== undefined && {
          requiresConfirmation: validated.requiresConfirmation,
        }),
        ...(validated.price !== undefined && { price: validated.price }),
        ...(validated.currency !== undefined && { currency: validated.currency }),
        ...(validated.minimumNotice !== undefined && { minimumNotice: validated.minimumNotice }),
        ...(validated.beforeBuffer !== undefined && { beforeBuffer: validated.beforeBuffer }),
        ...(validated.afterBuffer !== undefined && { afterBuffer: validated.afterBuffer }),
        ...(validated.slotInterval !== undefined && { slotInterval: validated.slotInterval }),
        ...(validated.maxBookingsPerDay !== undefined && {
          maxBookingsPerDay: validated.maxBookingsPerDay,
        }),
        ...(validated.maxBookingsPerWeek !== undefined && {
          maxBookingsPerWeek: validated.maxBookingsPerWeek,
        }),
        ...(validated.futureLimit !== undefined && { futureLimit: validated.futureLimit }),
        ...(validated.color !== undefined && { color: validated.color }),
        ...(validated.customQuestions !== undefined && {
          customQuestions: validated.customQuestions,
        }),
        ...(validated.recurringEnabled !== undefined && {
          recurringEnabled: validated.recurringEnabled,
        }),
        ...(validated.recurringMaxOccurrences !== undefined && {
          recurringMaxOccurrences: validated.recurringMaxOccurrences,
        }),
        ...(validated.recurringFrequency !== undefined && {
          recurringFrequency: validated.recurringFrequency,
        }),
        ...(validated.scheduleId !== undefined && { scheduleId: validated.scheduleId }),
      },
      include: {
        _count: {
          select: { bookings: true },
        },
        schedule: {
          select: {
            id: true,
            name: true,
            timezone: true,
          },
        },
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

    console.error('PUT /api/event-types/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// DELETE /api/event-types/[id] — Delete an event type
export const DELETE = withAuth(async (_request, context, user) => {
  try {
    const { id } = await context.params;

    const eventType = await prisma.eventType.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!eventType) {
      return NextResponse.json({ error: 'Event type not found' }, { status: 404 });
    }

    const ownershipError = await verifyOwnership(user.id, eventType.userId);
    if (ownershipError) return ownershipError;

    // Delete CANCELLED bookings before deleting the event type
    await prisma.booking.deleteMany({
      where: {
        eventTypeId: id,
        status: 'CANCELLED',
      },
    });

    await prisma.eventType.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Event type deleted' });
  } catch (error) {
    // Prisma foreign key constraint error (P2003) — active bookings still exist
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2003'
    ) {
      return NextResponse.json(
        { error: 'Cannot delete event type with active bookings' },
        { status: 409 }
      );
    }

    console.error('DELETE /api/event-types/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
