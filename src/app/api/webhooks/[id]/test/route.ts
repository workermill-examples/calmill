import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { testWebhookDelivery } from '@/lib/webhooks'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const result = await testWebhookDelivery(id, session.user.id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Test delivery failed' },
        { status: result.error === 'Webhook not found' ? 404 : 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Test webhook delivered successfully',
      statusCode: result.statusCode
    })
  } catch (error) {
    console.error('Error testing webhook delivery:', error)
    return NextResponse.json(
      { error: 'Failed to test webhook delivery' },
      { status: 500 }
    )
  }
}