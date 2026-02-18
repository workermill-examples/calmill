import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/api-auth';
import { scheduleCreateSchema } from '@/lib/validations';

// GET /api/schedules — List user's schedules with availability and date overrides
export const GET = withAuth(async (_request, _context, user) => {
  try {
    const schedules = await prisma.schedule.findMany({
      where: { userId: user.id },
      include: {
        availability: true,
        dateOverrides: {
          orderBy: { date: 'asc' },
        },
        _count: {
          select: { eventTypes: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, data: schedules });
  } catch (error) {
    console.error('GET /api/schedules error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// POST /api/schedules — Create a new schedule with availability windows
export const POST = withAuth(async (request, _context, user) => {
  try {
    const body = await request.json();
    const validated = scheduleCreateSchema.parse(body);

    // Validate timezone against Intl.supportedValuesOf
    const validTimezones = Intl.supportedValuesOf('timeZone');
    if (!validTimezones.includes(validated.timezone)) {
      return NextResponse.json({ error: 'Invalid timezone' }, { status: 400 });
    }

    // If isDefault: true, unset any existing default schedule for this user
    if (validated.isDefault) {
      await prisma.schedule.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const schedule = await prisma.schedule.create({
      data: {
        name: validated.name,
        timezone: validated.timezone,
        isDefault: validated.isDefault ?? false,
        userId: user.id,
        availability: {
          create: validated.availability.map((slot) => ({
            day: slot.day,
            startTime: slot.startTime,
            endTime: slot.endTime,
          })),
        },
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

    return NextResponse.json({ success: true, data: schedule }, { status: 201 });
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

    console.error('POST /api/schedules error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
