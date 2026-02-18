import { NextResponse } from 'next/server';
import { z } from 'zod';
import { slotQuerySchema } from '@/lib/validations';
import { getAvailableSlots } from '@/lib/slots';
import { getRoundRobinSlots, getCollectiveSlots } from '@/lib/team-slots';
import { prisma } from '@/lib/prisma';

// GET /api/slots?eventTypeId=xxx&startDate=2026-02-20&endDate=2026-02-27&timezone=Europe/London
// Public endpoint — no authentication required
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const rawParams = {
      eventTypeId: searchParams.get('eventTypeId'),
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      timezone: searchParams.get('timezone'),
    };

    // Validate query params
    const validated = slotQuerySchema.parse(rawParams);

    // Validate timezone against supported IANA values
    const validTimezones = Intl.supportedValuesOf('timeZone');
    if (!validTimezones.includes(validated.timezone)) {
      return NextResponse.json({ error: 'Invalid timezone' }, { status: 400 });
    }

    // Validate date range ordering
    if (validated.startDate > validated.endDate) {
      return NextResponse.json(
        { error: 'startDate must be before or equal to endDate' },
        { status: 400 }
      );
    }

    // Determine scheduling type for this event type
    const eventType = await prisma.eventType.findUnique({
      where: { id: validated.eventTypeId, isActive: true },
      select: { schedulingType: true },
    });

    const slotParams = {
      eventTypeId: validated.eventTypeId,
      startDate: validated.startDate,
      endDate: validated.endDate,
      timezone: validated.timezone,
    };

    // Dispatch to the appropriate algorithm based on schedulingType
    let slots;
    if (eventType?.schedulingType === 'ROUND_ROBIN') {
      slots = await getRoundRobinSlots(slotParams);
    } else if (eventType?.schedulingType === 'COLLECTIVE') {
      slots = await getCollectiveSlots(slotParams);
    } else {
      // Personal event type (schedulingType is null) — use existing algorithm
      slots = await getAvailableSlots(slotParams);
    }

    return NextResponse.json(
      { success: true, data: slots },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60',
        },
      }
    );
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

    console.error('GET /api/slots error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
