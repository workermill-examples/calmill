import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withAuth, verifyOwnership } from '@/lib/api-auth';
import { scheduleUpdateSchema } from '@/lib/validations';

// GET /api/schedules/[id] — Get single schedule with all availability and date overrides
export const GET = withAuth(async (_request, context, user) => {
  try {
    const { id } = await context.params;

    const schedule = await prisma.schedule.findUnique({
      where: { id },
      include: {
        availability: true,
        dateOverrides: {
          orderBy: { date: 'asc' },
        },
        _count: {
          select: { eventTypes: true },
        },
      },
    });

    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    const ownershipError = await verifyOwnership(user.id, schedule.userId);
    if (ownershipError) return ownershipError;

    return NextResponse.json({ success: true, data: schedule });
  } catch (error) {
    console.error('GET /api/schedules/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// PUT /api/schedules/[id] — Update schedule; supports full availability replacement
export const PUT = withAuth(async (request, context, user) => {
  try {
    const { id } = await context.params;

    const existing = await prisma.schedule.findUnique({
      where: { id },
      select: { id: true, userId: true, isDefault: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    const ownershipError = await verifyOwnership(user.id, existing.userId);
    if (ownershipError) return ownershipError;

    const body = await request.json();
    const validated = scheduleUpdateSchema.parse(body);

    // Validate timezone if provided
    if (validated.timezone !== undefined) {
      const validTimezones = Intl.supportedValuesOf('timeZone');
      if (!validTimezones.includes(validated.timezone)) {
        return NextResponse.json({ error: 'Invalid timezone' }, { status: 400 });
      }
    }

    // If setting this as default, unset any existing default schedule first
    if (validated.isDefault && !existing.isDefault) {
      await prisma.schedule.updateMany({
        where: { userId: user.id, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    // Full availability replacement: delete existing rows and recreate from payload
    if (validated.availability !== undefined) {
      await prisma.availability.deleteMany({ where: { scheduleId: id } });
    }

    const updated = await prisma.schedule.update({
      where: { id },
      data: {
        ...(validated.name !== undefined && { name: validated.name }),
        ...(validated.timezone !== undefined && { timezone: validated.timezone }),
        ...(validated.isDefault !== undefined && { isDefault: validated.isDefault }),
        ...(validated.availability !== undefined && {
          availability: {
            create: validated.availability.map((slot) => ({
              day: slot.day,
              startTime: slot.startTime,
              endTime: slot.endTime,
            })),
          },
        }),
      },
      include: {
        availability: true,
        dateOverrides: {
          orderBy: { date: 'asc' },
        },
        _count: {
          select: { eventTypes: true },
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

    console.error('PUT /api/schedules/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// DELETE /api/schedules/[id] — Delete schedule (fails if event types reference it, or it's the only schedule)
export const DELETE = withAuth(async (_request, context, user) => {
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

    // Cannot delete if it's the only schedule
    const totalSchedules = await prisma.schedule.count({
      where: { userId: user.id },
    });

    if (totalSchedules <= 1) {
      return NextResponse.json({ error: 'Cannot delete the only schedule' }, { status: 409 });
    }

    // Fail if any event types reference this schedule
    const referencingEventTypes = await prisma.eventType.count({
      where: { scheduleId: id },
    });

    if (referencingEventTypes > 0) {
      return NextResponse.json(
        { error: 'Cannot delete schedule referenced by event types' },
        { status: 409 }
      );
    }

    await prisma.schedule.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Schedule deleted' });
  } catch (error) {
    console.error('DELETE /api/schedules/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
