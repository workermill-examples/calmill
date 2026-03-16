// Reject Team Invitation API
// POST: Reject a pending team invitation

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: Promise<{ memberId: string }> }) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { memberId } = await params

    // Find the pending invitation
    const invitation = await prisma.teamMember.findFirst({
      where: {
        id: memberId,
        userId: session.user.id,
        accepted: false
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    if (!invitation) {
      return NextResponse.json(
        { error: 'not_found', message: 'Invitation not found or already processed' },
        { status: 404 }
      )
    }

    // Remove the invitation (reject it)
    await prisma.teamMember.delete({
      where: {
        id: memberId
      }
    })

    return NextResponse.json({
      message: `Successfully rejected invitation to team "${invitation.team.name}"`
    })

  } catch (error) {
    console.error('Error rejecting team invitation:', error)
    return NextResponse.json(
      { error: 'internal_server_error', message: 'Failed to reject team invitation' },
      { status: 500 }
    )
  }
}