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

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        timezone: true,
        weekStart: true,
        createdAt: true,
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
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      username: user.username,
      bio: user.bio,
      timezone: user.timezone,
      weekStart: user.weekStart,
      eventTypeCount: user._count.eventTypes,
      memberSince: user.createdAt
    })
  } catch (error) {
    console.error('Error fetching public user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}