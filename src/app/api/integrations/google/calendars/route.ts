import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getCalendars } from '@/lib/google-calendar'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all calendar connections for the user
    const connections = await prisma.calendarConnection.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        isPrimary: 'desc' // Primary connection first
      }
    })

    if (connections.length === 0) {
      return NextResponse.json({
        connections: [],
        calendars: []
      })
    }

    // Get calendars for each connection
    const results = await Promise.all(
      connections.map(async (connection) => {
        try {
          const calendars = await getCalendars(connection.id)
          return {
            connection: {
              id: connection.id,
              email: connection.email,
              isPrimary: connection.isPrimary,
              createdAt: connection.createdAt
            },
            calendars
          }
        } catch (error) {
          console.error(`Error fetching calendars for connection ${connection.id}:`, error)
          return {
            connection: {
              id: connection.id,
              email: connection.email,
              isPrimary: connection.isPrimary,
              createdAt: connection.createdAt
            },
            calendars: [],
            error: 'Failed to fetch calendars'
          }
        }
      })
    )

    return NextResponse.json({
      connections: results.map(r => r.connection),
      results
    })

  } catch (error) {
    console.error('Error fetching Google Calendar connections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calendar connections' },
      { status: 500 }
    )
  }
}