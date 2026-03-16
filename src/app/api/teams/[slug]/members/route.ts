// Team Members Management API
// GET: List team members
// POST: Invite new member to team

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { TeamRole } from '@/generated/prisma/client'

// Validation schema for inviting members
const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['ADMIN', 'MEMBER']).default('MEMBER')
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
      }
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'not_found', message: 'Team not found or you are not a member' },
        { status: 404 }
      )
    }

    // Get all team members (including pending invitations)
    const members = await prisma.teamMember.findMany({
      where: {
        team: {
          slug
        }
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
      },
      orderBy: [
        { role: 'asc' }, // OWNER first, then ADMIN, then MEMBER
        { accepted: 'desc' }, // Accepted members first
        { createdAt: 'asc' }
      ]
    })

    return NextResponse.json({
      members: members.map(member => ({
        id: member.id,
        role: member.role,
        accepted: member.accepted,
        createdAt: member.createdAt,
        user: member.user
      }))
    })

  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { error: 'internal_server_error', message: 'Failed to fetch team members' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
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

    // Check team permissions (OWNER or ADMIN can invite)
    const membership = await checkTeamPermission(slug, session.user.id)
    if (!membership) {
      return NextResponse.json(
        { error: 'forbidden', message: 'Insufficient permissions to invite members' },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const data = inviteMemberSchema.parse(body)

    // Only OWNER can invite ADMINs
    if (data.role === 'ADMIN' && membership.role !== 'OWNER') {
      return NextResponse.json(
        { error: 'forbidden', message: 'Only team owners can invite admins' },
        { status: 403 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email: data.email
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'not_found', message: 'User with this email does not exist' },
        { status: 404 }
      )
    }

    // Check if user is already a member or has pending invitation
    const existingMembership = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: user.id,
          teamId: membership.team.id
        }
      }
    })

    if (existingMembership) {
      if (existingMembership.accepted) {
        return NextResponse.json(
          { error: 'conflict', message: 'User is already a member of this team' },
          { status: 409 }
        )
      } else {
        return NextResponse.json(
          { error: 'conflict', message: 'User already has a pending invitation to this team' },
          { status: 409 }
        )
      }
    }

    // Create team membership invitation
    const newMembership = await prisma.teamMember.create({
      data: {
        userId: user.id,
        teamId: membership.team.id,
        role: data.role,
        accepted: false // Invitation pending
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

    // TODO: Send invitation email notification
    // This would typically integrate with the email service
    console.log(`Invitation sent to ${user.email} for team ${membership.team.name}`)

    return NextResponse.json(
      {
        member: {
          id: newMembership.id,
          role: newMembership.role,
          accepted: newMembership.accepted,
          createdAt: newMembership.createdAt,
          user: newMembership.user
        }
      },
      { status: 201 }
    )

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

    console.error('Error inviting team member:', error)
    return NextResponse.json(
      { error: 'internal_server_error', message: 'Failed to invite team member' },
      { status: 500 }
    )
  }
}