// Google Calendar disconnect endpoint
// DELETE /api/integrations/google/disconnect - Disconnect Google Calendar

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Find and delete user's Google Calendar connection
    const connection = await prisma.calendarConnection.findFirst({
      where: {
        userId: session.user.id,
        provider: 'google'
      }
    })

    if (!connection) {
      return NextResponse.json(
        { error: 'not_connected', message: 'No Google Calendar connection found' },
        { status: 404 }
      )
    }

    // Delete the connection
    await prisma.calendarConnection.delete({
      where: {
        id: connection.id
      }
    })

    // Optionally revoke the token with Google
    // This is fire-and-forget - we don't want to fail if Google API is down
    if (connection.refreshToken) {
      try {
        await fetch('https://oauth2.googleapis.com/revoke', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            token: connection.refreshToken,
          }),
        })
      } catch (error) {
        // Log but don't fail - we already deleted the connection from our database
        console.warn('Failed to revoke token with Google:', error)
      }
    }

    return NextResponse.json({
      message: 'Google Calendar disconnected successfully'
    })

  } catch (error) {
    console.error('Error disconnecting Google Calendar:', error)
    return NextResponse.json(
      { error: 'internal', message: 'Failed to disconnect Google Calendar' },
      { status: 500 }
    )
  }
}