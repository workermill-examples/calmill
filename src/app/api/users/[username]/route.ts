// Public user profile endpoint
// GET /api/users/[username] - Get public user profile by username

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params

    // Get user public profile data
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        bio: true,
        timezone: true,
        createdAt: true,
        // Include active event types count
        _count: {
          select: {
            eventTypes: {
              where: { isActive: true }
            }
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
        username: user.username,
        name: user.name,
        image: user.image,
        bio: user.bio,
        timezone: user.timezone,
        createdAt: user.createdAt,
        stats: {
          eventTypes: user._count.eventTypes
        }
      }
    })

  } catch (error) {
    console.error('Error fetching public user profile:', error)
    return NextResponse.json(
      { error: 'internal', message: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}