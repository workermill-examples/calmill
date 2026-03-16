// Individual Date Override API - Delete
// DELETE: Delete specific date override

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string; overrideId: string }> }) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id: scheduleId, overrideId } = await context.params

    // Verify schedule ownership and override existence
    const override = await prisma.dateOverride.findFirst({
      where: {
        id: overrideId,
        scheduleId
      },
      include: {
        schedule: {
          select: {
            userId: true
          }
        }
      }
    })

    if (!override) {
      return NextResponse.json(
        { error: 'not_found', message: 'Date override not found' },
        { status: 404 }
      )
    }

    // Check ownership
    if (override.schedule.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'forbidden', message: 'Access denied' },
        { status: 403 }
      )
    }

    // Delete the override
    await prisma.dateOverride.delete({
      where: { id: overrideId }
    })

    return NextResponse.json(
      { message: 'Date override deleted successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error deleting date override:', error)
    return NextResponse.json(
      { error: 'internal_server_error', message: 'Failed to delete date override' },
      { status: 500 }
    )
  }
}