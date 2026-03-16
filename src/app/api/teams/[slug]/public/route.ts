// Public Team Information API
// GET: Get public team information by slug (no authentication required)

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

    // Get team with public information only
    const team = await prisma.team.findUnique({
      where: {
        slug
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        bio: true,
        createdAt: true,
        members: {
          where: {
            accepted: true
          },
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true
                // Note: email is private and not included in public API
              }
            }
          },
          orderBy: [
            { role: 'asc' }, // OWNER first, then ADMIN, then MEMBER
            { createdAt: 'asc' }
          ]
        },
        eventTypes: {
          where: {
            isActive: true
          },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            duration: true,
            color: true,
            schedulingType: true,
            requiresConfirmation: true,
            minimumNotice: true,
            price: true,
            currency: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            members: {
              where: {
                accepted: true
              }
            },
            eventTypes: {
              where: {
                isActive: true
              }
            }
          }
        }
      }
    })

    if (!team) {
      return NextResponse.json(
        { error: 'not_found', message: 'Team not found' },
        { status: 404 }
      )
    }

    // Format the response
    const publicTeamInfo = {
      id: team.id,
      name: team.name,
      slug: team.slug,
      logoUrl: team.logoUrl,
      bio: team.bio,
      createdAt: team.createdAt,
      memberCount: team._count.members,
      eventTypeCount: team._count.eventTypes,
      members: team.members,
      eventTypes: team.eventTypes
    }

    return NextResponse.json({
      team: publicTeamInfo
    })

  } catch (error) {
    console.error('Error fetching public team info:', error)
    return NextResponse.json(
      { error: 'internal_server_error', message: 'Failed to fetch team information' },
      { status: 500 }
    )
  }
}