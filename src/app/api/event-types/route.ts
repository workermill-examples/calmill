import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/api-auth';
import { eventTypeCreateSchema } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';

// GET /api/event-types — List authenticated user's event types
export const GET = withAuth(async (_request, _context, user) => {
  try {
    const eventTypes = await prisma.eventType.findMany({
      where: { userId: user.id },
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
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: eventTypes });
  } catch (error) {
    console.error('GET /api/event-types error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// POST /api/event-types — Create a new event type
export const POST = withAuth(async (request, _context, user) => {
  try {
    const body = await request.json();
    const validated = eventTypeCreateSchema.parse(body);

    // Generate slug from title if not provided
    let slug = validated.slug ?? generateSlug(validated.title);

    // Deduplicate slug within user's event types
    const existing = await prisma.eventType.findMany({
      where: {
        userId: user.id,
        slug: { startsWith: slug },
      },
      select: { slug: true },
    });

    if (existing.length > 0) {
      const existingSlugs = new Set(existing.map((e: { slug: string }) => e.slug));
      if (existingSlugs.has(slug)) {
        // Find next available suffix (-2, -3, ...)
        let counter = 2;
        while (existingSlugs.has(`${slug}-${counter}`)) {
          counter++;
        }
        slug = `${slug}-${counter}`;
      }
    }

    // Get user's default schedule if scheduleId not provided
    let scheduleId = validated.scheduleId;
    if (!scheduleId) {
      const defaultSchedule = await prisma.schedule.findFirst({
        where: { userId: user.id, isDefault: true },
        select: { id: true },
      });
      scheduleId = defaultSchedule?.id;
    }

    const eventType = await prisma.eventType.create({
      data: {
        title: validated.title,
        slug,
        description: validated.description,
        duration: validated.duration,
        locations: validated.locations ?? undefined,
        requiresConfirmation: validated.requiresConfirmation,
        price: validated.price,
        currency: validated.currency,
        minimumNotice: validated.minimumNotice,
        beforeBuffer: validated.beforeBuffer,
        afterBuffer: validated.afterBuffer,
        slotInterval: validated.slotInterval,
        maxBookingsPerDay: validated.maxBookingsPerDay,
        maxBookingsPerWeek: validated.maxBookingsPerWeek,
        futureLimit: validated.futureLimit,
        color: validated.color,
        customQuestions: validated.customQuestions ?? undefined,
        recurringEnabled: validated.recurringEnabled,
        recurringMaxOccurrences: validated.recurringMaxOccurrences,
        recurringFrequency: validated.recurringFrequency,
        userId: user.id,
        scheduleId: scheduleId ?? undefined,
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

    return NextResponse.json({ success: true, data: eventType }, { status: 201 });
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

    console.error('POST /api/event-types error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
