import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withAuth, verifyOwnership } from '@/lib/api-auth';

const dateOverrideCreateSchema = z.object({
  date: z.string().date(), // YYYY-MM-DD
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional(),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional(),
  isUnavailable: z.boolean().optional(),
});

// GET /api/schedules/[id]/overrides — List date overrides for a schedule, ordered by date ASC
export const GET = withAuth(async (_request, context, user) => {
  try {
    const { id } = await context.params;

    const schedule = await prisma.schedule.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    const ownershipError = await verifyOwnership(user.id, schedule.userId);
    if (ownershipError) return ownershipError;

    const overrides = await prisma.dateOverride.findMany({
      where: { scheduleId: id },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ success: true, data: overrides });
  } catch (error) {
    console.error('GET /api/schedules/[id]/overrides error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// POST /api/schedules/[id]/overrides — Create a date override
export const POST = withAuth(async (request, context, user) => {
  try {
    const { id } = await context.params;

    const schedule = await prisma.schedule.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    const ownershipError = await verifyOwnership(user.id, schedule.userId);
    if (ownershipError) return ownershipError;

    const body = await request.json();
    const validated = dateOverrideCreateSchema.parse(body);

    // Validate date is in the future
    const overrideDate = new Date(validated.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (overrideDate < today) {
      return NextResponse.json({ error: 'Date override must be in the future' }, { status: 400 });
    }

    // Prevent duplicate overrides for the same date
    const existing = await prisma.dateOverride.findFirst({
      where: {
        scheduleId: id,
        date: overrideDate,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A date override already exists for this date' },
        { status: 409 }
      );
    }

    const override = await prisma.dateOverride.create({
      data: {
        scheduleId: id as string,
        date: overrideDate,
        startTime: validated.startTime ?? null,
        endTime: validated.endTime ?? null,
        isUnavailable: validated.isUnavailable ?? false,
      },
    });

    return NextResponse.json({ success: true, data: override }, { status: 201 });
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

    console.error('POST /api/schedules/[id]/overrides error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
