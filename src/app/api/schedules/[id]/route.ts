// Individual Schedule API - Get, Update, Delete
// GET: Get specific schedule with availability and overrides
// PUT: Update schedule details
// DELETE: Delete schedule (with validation)

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Validation schema for updating schedules
const updateScheduleSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  timezone: z.string().min(1).optional(),
  isDefault: z.boolean().optional(),
  availabilities: z.array(z.object({
    id: z.string().optional(), // For existing availability updates
    day: z.number().int().min(0).max(6), // 0 = Sunday, 6 = Saturday
    startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:mm format
    endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:mm format
    _delete: z.boolean().optional() // Mark for deletion
  })).optional()
})

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = await context.params

    // Fetch schedule with related data
    const schedule = await prisma.schedule.findFirst({
      where: {
        id,
        userId: session.user.id
      },
      include: {
        availabilities: {
          orderBy: [
            { day: 'asc' },
            { startTime: 'asc' }
          ]
        },
        dateOverrides: {
          orderBy: { date: 'asc' }
        },
        _count: {
          select: {
            eventTypes: true
          }
        }
      }
    })

    if (!schedule) {
      return NextResponse.json(
        { error: 'not_found', message: 'Schedule not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      schedule: {
        ...schedule,
        eventTypeCount: schedule._count.eventTypes
      }
    })

  } catch (error) {
    console.error('Error fetching schedule:', error)
    return NextResponse.json(
      { error: 'internal_server_error', message: 'Failed to fetch schedule' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = await context.params

    // Parse and validate request body
    const body = await request.json()
    const data = updateScheduleSchema.parse(body)

    // Check if schedule exists and belongs to user
    const existingSchedule = await prisma.schedule.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingSchedule) {
      return NextResponse.json(
        { error: 'not_found', message: 'Schedule not found' },
        { status: 404 }
      )
    }

    // Validate time ranges in availabilities
    if (data.availabilities) {
      for (const availability of data.availabilities) {
        if (availability.startTime >= availability.endTime) {
          return NextResponse.json(
            { error: 'validation_error', message: 'Start time must be before end time' },
            { status: 400 }
          )
        }
      }
    }

    // Start transaction for atomic updates
    const result = await prisma.$transaction(async (prisma) => {
      // If setting as default, update existing default to false
      if (data.isDefault) {
        await prisma.schedule.updateMany({
          where: {
            userId: session.user.id,
            isDefault: true,
            id: { not: id }
          },
          data: {
            isDefault: false
          }
        })
      }

      // Update schedule basic fields
      const { availabilities, ...scheduleData } = data
      const updatedSchedule = await prisma.schedule.update({
        where: { id },
        data: scheduleData
      })

      // Handle availability updates if provided
      if (availabilities) {
        // Delete marked availabilities
        const toDelete = availabilities.filter(a => a._delete && a.id)
        if (toDelete.length > 0) {
          await prisma.availability.deleteMany({
            where: {
              id: { in: toDelete.map(a => a.id!).filter(Boolean) },
              scheduleId: id
            }
          })
        }

        // Update or create availabilities
        const toUpdate = availabilities.filter(a => !a._delete)
        for (const availability of toUpdate) {
          const { id: availabilityId, _delete, ...availabilityData } = availability

          if (availabilityId) {
            // Update existing availability
            await prisma.availability.update({
              where: {
                id: availabilityId,
                scheduleId: id
              },
              data: availabilityData
            })
          } else {
            // Create new availability
            await prisma.availability.create({
              data: {
                ...availabilityData,
                scheduleId: id
              }
            })
          }
        }
      }

      // Return updated schedule with all relations
      return await prisma.schedule.findFirst({
        where: { id },
        include: {
          availabilities: {
            orderBy: [
              { day: 'asc' },
              { startTime: 'asc' }
            ]
          },
          dateOverrides: {
            orderBy: { date: 'asc' }
          },
          _count: {
            select: {
              eventTypes: true
            }
          }
        }
      })
    })

    return NextResponse.json({
      schedule: {
        ...result,
        eventTypeCount: result!._count.eventTypes
      }
    })

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

    console.error('Error updating schedule:', error)
    return NextResponse.json(
      { error: 'internal_server_error', message: 'Failed to update schedule' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = await context.params

    // Check if schedule exists and belongs to user
    const existingSchedule = await prisma.schedule.findFirst({
      where: {
        id,
        userId: session.user.id
      },
      include: {
        _count: {
          select: {
            eventTypes: true
          }
        }
      }
    })

    if (!existingSchedule) {
      return NextResponse.json(
        { error: 'not_found', message: 'Schedule not found' },
        { status: 404 }
      )
    }

    // Prevent deletion of schedule with active event types
    if (existingSchedule._count.eventTypes > 0) {
      return NextResponse.json(
        { error: 'conflict', message: 'Cannot delete schedule that is used by event types' },
        { status: 409 }
      )
    }

    // Prevent deletion of default schedule if it's the only one
    if (existingSchedule.isDefault) {
      const scheduleCount = await prisma.schedule.count({
        where: { userId: session.user.id }
      })

      if (scheduleCount <= 1) {
        return NextResponse.json(
          { error: 'conflict', message: 'Cannot delete the only schedule' },
          { status: 409 }
        )
      }
    }

    // Delete schedule (cascade will handle availabilities and date overrides)
    await prisma.schedule.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Schedule deleted successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error deleting schedule:', error)
    return NextResponse.json(
      { error: 'internal_server_error', message: 'Failed to delete schedule' },
      { status: 500 }
    )
  }
}