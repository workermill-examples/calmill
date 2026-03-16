// Individual Team Member Management API
// PUT: Update member role
// DELETE: Remove member from team

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { TeamRole } from '@/generated/prisma/client'

// Validation schema for updating member role
const updateMemberSchema = z.object({
  role: z.enum(['OWNER', 'ADMIN', 'MEMBER'])
})

// Helper function to check if user has permission
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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string; memberId: string }> }) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { slug, memberId } = await params

    // Check team permissions
    const userMembership = await checkTeamPermission(slug, session.user.id)
    if (!userMembership) {
      return NextResponse.json(
        { error: 'forbidden', message: 'Insufficient permissions to update team members' },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const data = updateMemberSchema.parse(body)

    // Get the member to update
    const targetMember = await prisma.teamMember.findFirst({
      where: {
        id: memberId,
        teamId: userMembership.team.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true
          }
        }
      }
    })

    if (!targetMember) {
      return NextResponse.json(
        { error: 'not_found', message: 'Team member not found' },
        { status: 404 }
      )
    }

    // Business logic checks
    // Only OWNER can change roles to/from OWNER
    if (data.role === 'OWNER' || targetMember.role === 'OWNER') {
      if (userMembership.role !== 'OWNER') {
        return NextResponse.json(
          { error: 'forbidden', message: 'Only team owners can change ownership roles' },
          { status: 403 }
        )
      }
    }

    // Only OWNER can promote to ADMIN
    if (data.role === 'ADMIN' && userMembership.role !== 'OWNER') {
      return NextResponse.json(
        { error: 'forbidden', message: 'Only team owners can promote members to admin' },
        { status: 403 }
      )
    }

    // Prevent owner from demoting themselves if they're the only owner
    if (targetMember.userId === session.user.id && targetMember.role === 'OWNER' && data.role !== 'OWNER') {
      const ownerCount = await prisma.teamMember.count({
        where: {
          teamId: userMembership.team.id,
          role: 'OWNER',
          accepted: true
        }
      })

      if (ownerCount === 1) {
        return NextResponse.json(
          { error: 'conflict', message: 'Cannot demote the only team owner. Promote another member to owner first.' },
          { status: 409 }
        )
      }
    }

    // Update member role
    const updatedMember = await prisma.teamMember.update({
      where: {
        id: memberId
      },
      data: {
        role: data.role
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      member: {
        id: updatedMember.id,
        role: updatedMember.role,
        accepted: updatedMember.accepted,
        createdAt: updatedMember.createdAt,
        user: updatedMember.user
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

    console.error('Error updating team member:', error)
    return NextResponse.json(
      { error: 'internal_server_error', message: 'Failed to update team member' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string; memberId: string }> }) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { slug, memberId } = await params

    // Get the member to remove
    const targetMember = await prisma.teamMember.findFirst({
      where: {
        id: memberId,
        team: {
          slug
        }
      },
      include: {
        team: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!targetMember) {
      return NextResponse.json(
        { error: 'not_found', message: 'Team member not found' },
        { status: 404 }
      )
    }

    // Check permissions
    // Users can remove themselves
    // OWNER/ADMIN can remove other members (but not other owners unless they're owner)
    const canRemove =
      targetMember.userId === session.user.id || // Self removal
      await checkTeamPermission(slug, session.user.id) // Has admin permissions

    if (!canRemove) {
      return NextResponse.json(
        { error: 'forbidden', message: 'Insufficient permissions to remove team members' },
        { status: 403 }
      )
    }

    // Additional checks for removing others
    if (targetMember.userId !== session.user.id) {
      const userMembership = await checkTeamPermission(slug, session.user.id)

      // Only OWNER can remove other OWNERs
      if (targetMember.role === 'OWNER' && userMembership?.role !== 'OWNER') {
        return NextResponse.json(
          { error: 'forbidden', message: 'Only team owners can remove other owners' },
          { status: 403 }
        )
      }
    }

    // Prevent removing the last owner
    if (targetMember.role === 'OWNER') {
      const ownerCount = await prisma.teamMember.count({
        where: {
          teamId: targetMember.team.id,
          role: 'OWNER',
          accepted: true
        }
      })

      if (ownerCount === 1) {
        return NextResponse.json(
          { error: 'conflict', message: 'Cannot remove the only team owner. Promote another member to owner first.' },
          { status: 409 }
        )
      }
    }

    // Remove team member
    await prisma.teamMember.delete({
      where: {
        id: memberId
      }
    })

    return NextResponse.json({
      message: 'Team member removed successfully'
    })

  } catch (error) {
    console.error('Error removing team member:', error)
    return NextResponse.json(
      { error: 'internal_server_error', message: 'Failed to remove team member' },
      { status: 500 }
    )
  }
}