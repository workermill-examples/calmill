import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateWebhookSchema = z.object({
  url: z.string().url('Must be a valid URL').optional(),
  eventTriggers: z.array(z.enum([
    'BOOKING_CREATED',
    'BOOKING_CANCELLED',
    'BOOKING_RESCHEDULED',
    'BOOKING_ACCEPTED',
    'BOOKING_REJECTED'
  ])).min(1, 'Must select at least one event').optional(),
  active: z.boolean().optional()
})

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const webhook = await prisma.webhook.findFirst({
      where: {
        id,
        userId: session.user.id
      },
      include: {
        deliveries: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 50 // Last 50 deliveries
        }
      }
    })

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })
    }

    return NextResponse.json(webhook)
  } catch (error) {
    console.error('Error fetching webhook:', error)
    return NextResponse.json(
      { error: 'Failed to fetch webhook' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const data = updateWebhookSchema.parse(body)

    // Check if webhook exists and belongs to user
    const existingWebhook = await prisma.webhook.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingWebhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })
    }

    const webhook = await prisma.webhook.update({
      where: { id },
      data
    })

    return NextResponse.json(webhook)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating webhook:', error)
    return NextResponse.json(
      { error: 'Failed to update webhook' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if webhook exists and belongs to user
    const existingWebhook = await prisma.webhook.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingWebhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })
    }

    // Delete webhook and all its deliveries (cascade delete should handle this)
    await prisma.webhook.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting webhook:', error)
    return NextResponse.json(
      { error: 'Failed to delete webhook' },
      { status: 500 }
    )
  }
}