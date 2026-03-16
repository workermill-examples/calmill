import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const disconnectSchema = z.object({
  connectionId: z.string().optional(),
  disconnectAll: z.boolean().optional()
})

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { connectionId, disconnectAll } = disconnectSchema.parse(body)

    if (disconnectAll) {
      // Disconnect all Google Calendar connections for the user
      const deletedConnections = await prisma.calendarConnection.deleteMany({
        where: {
          userId: session.user.id,
          provider: 'google'
        }
      })

      return NextResponse.json({
        success: true,
        message: `Disconnected ${deletedConnections.count} calendar connection(s)`
      })
    } else if (connectionId) {
      // Disconnect specific connection
      const connection = await prisma.calendarConnection.findFirst({
        where: {
          id: connectionId,
          userId: session.user.id
        }
      })

      if (!connection) {
        return NextResponse.json(
          { error: 'Calendar connection not found' },
          { status: 404 }
        )
      }

      await prisma.calendarConnection.delete({
        where: { id: connectionId }
      })

      // If this was the primary connection, make another one primary if available
      if (connection.isPrimary) {
        const remainingConnection = await prisma.calendarConnection.findFirst({
          where: {
            userId: session.user.id,
            provider: 'google'
          }
        })

        if (remainingConnection) {
          await prisma.calendarConnection.update({
            where: { id: remainingConnection.id },
            data: { isPrimary: true }
          })
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Calendar connection disconnected'
      })
    } else {
      return NextResponse.json(
        { error: 'Must specify connectionId or disconnectAll' },
        { status: 400 }
      )
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error disconnecting Google Calendar:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect calendar' },
      { status: 500 }
    )
  }
}