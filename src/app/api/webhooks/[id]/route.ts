import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/api-auth';

type Params = { params: Promise<{ id: string }> };

// ─── VALIDATION ───────────────────────────────────────────────────────────────

const VALID_TRIGGERS = [
  'BOOKING_CREATED',
  'BOOKING_CANCELLED',
  'BOOKING_RESCHEDULED',
  'BOOKING_ACCEPTED',
  'BOOKING_REJECTED',
] as const;

const webhookUpdateSchema = z.object({
  url: z
    .string()
    .url('Invalid webhook URL')
    .refine(
      (url) => {
        try {
          const parsed = new URL(url);
          return (
            parsed.protocol === 'https:' ||
            parsed.hostname === 'localhost' ||
            parsed.hostname === '127.0.0.1'
          );
        } catch {
          return false;
        }
      },
      { message: 'Webhook URL must use HTTPS (localhost allowed for development)' }
    )
    .optional(),
  eventTriggers: z
    .array(z.enum(VALID_TRIGGERS))
    .min(1, 'At least one event trigger is required')
    .optional(),
  active: z.boolean().optional(),
});

// ─── GET /api/webhooks/[id] — Webhook detail with recent deliveries ───────────

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;

  const authResult = await getAuthenticatedUser();
  if (authResult.error) return authResult.error;
  const { user } = authResult;

  try {
    const webhook = await prisma.webhook.findUnique({
      where: { id },
      include: {
        deliveries: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            eventType: true,
            statusCode: true,
            success: true,
            error: true,
            deliveryId: true,
            createdAt: true,
          },
        },
      },
    });

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    if (webhook.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Return without secret (masked after creation)
    return NextResponse.json({
      success: true,
      data: {
        id: webhook.id,
        url: webhook.url,
        eventTriggers: webhook.eventTriggers,
        active: webhook.active,
        createdAt: webhook.createdAt,
        updatedAt: webhook.updatedAt,
        deliveries: webhook.deliveries,
      },
    });
  } catch (error) {
    console.error('GET /api/webhooks/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── PUT /api/webhooks/[id] — Update webhook ──────────────────────────────────

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;

  const authResult = await getAuthenticatedUser();
  if (authResult.error) return authResult.error;
  const { user } = authResult;

  try {
    const existing = await prisma.webhook.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    if (existing.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validated = webhookUpdateSchema.parse(body);

    const updated = await prisma.webhook.update({
      where: { id },
      data: {
        ...(validated.url !== undefined && { url: validated.url }),
        ...(validated.eventTriggers !== undefined && { eventTriggers: validated.eventTriggers }),
        ...(validated.active !== undefined && { active: validated.active }),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        url: updated.url,
        eventTriggers: updated.eventTriggers,
        active: updated.active,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
    });
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

    console.error('PUT /api/webhooks/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── DELETE /api/webhooks/[id] — Delete webhook ───────────────────────────────

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;

  const authResult = await getAuthenticatedUser();
  if (authResult.error) return authResult.error;
  const { user } = authResult;

  try {
    const existing = await prisma.webhook.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    if (existing.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delivery history is cascade-deleted via the schema relation
    await prisma.webhook.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/webhooks/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
