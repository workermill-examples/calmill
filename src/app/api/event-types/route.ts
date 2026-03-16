// Event Types API - List and Create
// GET: List authenticated user's event types
// POST: Create new event type

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Validation schema for creating event types
const createEventTypeSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens'
  }),
  description: z.string().optional(),
  duration: z.number().int().min(1).max(480), // 1 minute to 8 hours
  isActive: z.boolean().default(true),
  requiresConfirmation: z.boolean().default(false),
  price: z.number().int().min(0).optional(),
  currency: z.string().length(3).default('USD'),
  minimumNotice: z.number().int().min(0).default(120), // minutes
  beforeBuffer: z.number().int().min(0).default(0),
  afterBuffer: z.number().int().min(0).default(0),
  slotInterval: z.number().int().min(1).optional(),
  maxBookingsPerDay: z.number().int().min(1).optional(),
  maxBookingsPerWeek: z.number().int().min(1).optional(),
  futureLimit: z.number().int().min(1).optional(), // days
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#3B82F6'),
  customQuestions: z.array(z.object({
    id: z.string(),
    type: z.enum(['text', 'textarea', 'select', 'radio', 'checkbox', 'phone']),
    label: z.string(),
    required: z.boolean().default(false),
    options: z.array(z.string()).optional(),
    placeholder: z.string().optional()
  })).optional(),
  recurringEnabled: z.boolean().default(false),
  recurringFrequency: z.enum(['weekly', 'biweekly', 'monthly']).optional(),
  scheduleId: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    // Build where clause
    const where = {
      userId: session.user.id,
      ...(includeInactive ? {} : { isActive: true })
    }

    // Fetch event types with related data
    const eventTypes = await prisma.eventType.findMany({
      where,
      include: {
        schedule: {
          select: {
            id: true,
            name: true,
            timezone: true
          }
        },
        _count: {
          select: {
            bookings: {
              where: {
                status: {
                  notIn: ['CANCELLED', 'REJECTED']
                }
              }
            }
          }
        }
      },
      orderBy: [
        { isActive: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({
      eventTypes: eventTypes.map(eventType => ({
        ...eventType,
        bookingCount: eventType._count.bookings
      }))
    })

  } catch (error) {
    console.error('Error fetching event types:', error)
    return NextResponse.json(
      { error: 'internal_server_error', message: 'Failed to fetch event types' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const data = createEventTypeSchema.parse(body)

    // Check if slug is unique for this user
    const existingEventType = await prisma.eventType.findUnique({
      where: {
        userId_slug: {
          userId: session.user.id,
          slug: data.slug
        }
      }
    })

    if (existingEventType) {
      return NextResponse.json(
        { error: 'conflict', message: 'An event type with this slug already exists' },
        { status: 409 }
      )
    }

    // Validate schedule exists if provided
    if (data.scheduleId) {
      const schedule = await prisma.schedule.findFirst({
        where: {
          id: data.scheduleId,
          userId: session.user.id
        }
      })

      if (!schedule) {
        return NextResponse.json(
          { error: 'not_found', message: 'Schedule not found' },
          { status: 404 }
        )
      }
    }

    // Create event type
    const eventType = await prisma.eventType.create({
      data: {
        ...data,
        userId: session.user.id,
        customQuestions: data.customQuestions ? JSON.stringify(data.customQuestions) : undefined
      },
      include: {
        schedule: {
          select: {
            id: true,
            name: true,
            timezone: true
          }
        }
      }
    })

    return NextResponse.json(
      { eventType },
      { status: 201 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'validation_error',
          message: 'Invalid request data',
          details: error.issues
        },
        { status: 400 }
      )
    }

    console.error('Error creating event type:', error)
    return NextResponse.json(
      { error: 'internal_server_error', message: 'Failed to create event type' },
      { status: 500 }
    )
  }
}