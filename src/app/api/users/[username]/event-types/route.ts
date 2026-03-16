import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ username: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { username } = await params

    // First check if user exists
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get active event types for this user
    const eventTypes = await prisma.eventType.findMany({
      where: {
        userId: user.id,
        isActive: true
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        duration: true,
        color: true,
        price: true,
        currency: true,
        schedulingType: true,
        requiresConfirmation: true,
        _count: {
          select: {
            bookings: {
              where: {
                status: 'ACCEPTED'
              }
            }
          }
        }
      },
      orderBy: [
        { createdAt: 'asc' }
      ]
    })

    return NextResponse.json(
      eventTypes.map(eventType => ({
        id: eventType.id,
        title: eventType.title,
        slug: eventType.slug,
        description: eventType.description,
        duration: eventType.duration,
        color: eventType.color,
        price: eventType.price,
        currency: eventType.currency,
        schedulingType: eventType.schedulingType,
        requiresConfirmation: eventType.requiresConfirmation,
        bookingCount: eventType._count.bookings
      }))
    )
  } catch (error) {
    console.error('Error fetching public event types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event types' },
      { status: 500 }
    )
  }
}