// Individual Team Management API
// GET: Get team details by slug
// PUT: Update team details
// DELETE: Delete team

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { TeamRole } from '@/generated/prisma/client'

// Validation schema for updating teams
const updateTeamSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens'
  }).optional(),
  logoUrl: z.string().url().optional(),
  bio: z.string().max(1000).optional()
})

// Helper function to check if user has permission (OWNER or ADMIN)
async function checkTeamPermission(teamSlug: string, userId: string, requiredRoles: TeamRole[] = [TeamRole.OWNER, TeamRole.ADMIN]) {
  const membership = await prisma.teamMember.findFirst({
    where: {
      userId,
      accepted: true,
      team: {
        slug: teamSlug
      },
      role: {
        in: requiredRoles
      }
    },
    include: {
      team: true
    }
  })

  return membership
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { slug } = await params

    // Check if user is a member of the team
    const membership = await prisma.teamMember.findFirst({
      where: {
        userId: session.user.id,
        accepted: true,
        team: {
          slug
        }
      },
      include: {
        team: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    username: true
                  }
                }
              },
              orderBy: [
                { role: 'asc' }, // OWNER first, then ADMIN, then MEMBER
                { createdAt: 'asc' }
              ]
            },
            eventTypes: {
              select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                duration: true,
                isActive: true,
                schedulingType: true,
                color: true,
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
              }
            },
            _count: {
              select: {
                members: {
                  where: {
                    accepted: true
                  }
                },
                eventTypes: true
              }
            }
          }
        }
      }
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'not_found', message: 'Team not found or you are not a member' },
        { status: 404 }
      )
    }

    const team = {
      ...membership.team,
      userRole: membership.role,
      memberCount: membership.team._count.members,
      eventTypeCount: membership.team._count.eventTypes,
      eventTypes: membership.team.eventTypes.map(et => ({
        ...et,
        bookingCount: et._count.bookings
      }))
    }

    return NextResponse.json({ team })

  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json(
      { error: 'internal_server_error', message: 'Failed to fetch team' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { slug } = await params

    // Check team permissions (OWNER or ADMIN can update)
    const membership = await checkTeamPermission(slug, session.user.id)
    if (!membership) {
      return NextResponse.json(
        { error: 'forbidden', message: 'Insufficient permissions to update team' },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const data = updateTeamSchema.parse(body)

    // If updating slug, check for uniqueness
    if (data.slug && data.slug !== membership.team.slug) {
      const existingTeam = await prisma.team.findUnique({
        where: {
          slug: data.slug
        }
      })

      if (existingTeam) {
        return NextResponse.json(
          { error: 'conflict', message: 'A team with this slug already exists' },
          { status: 409 }
        )
      }
    }

    // Update team
    const updatedTeam = await prisma.team.update({
      where: {
        slug
      },
      data,
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                username: true
              }
            }
          },
          orderBy: [
            { role: 'asc' },
            { createdAt: 'asc' }
          ]
        },
        eventTypes: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            duration: true,
            isActive: true,
            schedulingType: true,
            color: true
          }
        },
        _count: {
          select: {
            members: {
              where: {
                accepted: true
              }
            },
            eventTypes: true
          }
        }
      }
    })

    return NextResponse.json({
      team: {
        ...updatedTeam,
        userRole: membership.role,
        memberCount: updatedTeam._count.members,
        eventTypeCount: updatedTeam._count.eventTypes
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

    console.error('Error updating team:', error)
    return NextResponse.json(
      { error: 'internal_server_error', message: 'Failed to update team' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { slug } = await params

    // Check team permissions (only OWNER can delete)
    const membership = await checkTeamPermission(slug, session.user.id, ['OWNER'])
    if (!membership) {
      return NextResponse.json(
        { error: 'forbidden', message: 'Only team owners can delete teams' },
        { status: 403 }
      )
    }

    // Check if team has active event types with bookings
    const activeEventTypesWithBookings = await prisma.eventType.findFirst({
      where: {
        teamId: membership.team.id,
        isActive: true,
        bookings: {
          some: {
            status: {
              in: ['PENDING', 'ACCEPTED']
            }
          }
        }
      }
    })

    if (activeEventTypesWithBookings) {
      return NextResponse.json(
        {
          error: 'conflict',
          message: 'Cannot delete team with active event types that have pending or accepted bookings'
        },
        { status: 409 }
      )
    }

    // Delete team (cascade deletes will handle members and event types)
    await prisma.team.delete({
      where: {
        slug
      }
    })

    return NextResponse.json({
      message: 'Team deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting team:', error)
    return NextResponse.json(
      { error: 'internal_server_error', message: 'Failed to delete team' },
      { status: 500 }
    )
  }
}