// User profile endpoint
// GET /api/user - Get current user profile

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    // Get user profile data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        image: true,
        timezone: true,
        weekStart: true,
        bio: true,
        theme: true,
        createdAt: true,
        updatedAt: true,
        // Include calendar connections
        calendarConnections: {
          select: {
            id: true,
            provider: true,
            email: true,
            isPrimary: true,
            createdAt: true
          }
        },
        // Include basic stats
        _count: {
          select: {
            eventTypes: {
              where: { isActive: true }
            },
            bookings: true,
            schedules: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'not_found', message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        image: user.image,
        timezone: user.timezone,
        weekStart: user.weekStart,
        bio: user.bio,
        theme: user.theme,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        calendarConnections: user.calendarConnections,
        stats: {
          eventTypes: user._count.eventTypes,
          totalBookings: user._count.bookings,
          schedules: user._count.schedules
        }
      }
    })

  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'internal', message: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}