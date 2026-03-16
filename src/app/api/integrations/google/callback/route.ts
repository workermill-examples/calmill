import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  exchangeCodeForTokens,
  getGoogleUserInfo
} from '@/lib/google-calendar'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const state = searchParams.get('state')

    // Handle OAuth errors
    if (error) {
      console.error('Google OAuth error:', error)
      const errorUrl = new URL('/settings/calendars', request.url)
      errorUrl.searchParams.set('error', 'oauth_failed')
      return NextResponse.redirect(errorUrl)
    }

    if (!code) {
      const errorUrl = new URL('/settings/calendars', request.url)
      errorUrl.searchParams.set('error', 'no_code')
      return NextResponse.redirect(errorUrl)
    }

    // Build the redirect URI (must match the one used in connect)
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const redirectUri = `${baseUrl}/api/integrations/google/callback`

    // Exchange code for tokens
    const tokenResponse = await exchangeCodeForTokens(code, redirectUri)
    if (!tokenResponse) {
      const errorUrl = new URL('/settings/calendars', request.url)
      errorUrl.searchParams.set('error', 'token_exchange_failed')
      return NextResponse.redirect(errorUrl)
    }

    // Get user info from Google
    const userInfo = await getGoogleUserInfo(tokenResponse.access_token)
    if (!userInfo) {
      const errorUrl = new URL('/settings/calendars', request.url)
      errorUrl.searchParams.set('error', 'user_info_failed')
      return NextResponse.redirect(errorUrl)
    }

    // Calculate token expiration
    const expiresAt = new Date(Date.now() + (tokenResponse.expires_in * 1000))

    // Check if connection already exists for this user and email
    const existingConnection = await prisma.calendarConnection.findFirst({
      where: {
        userId: session.user.id,
        email: userInfo.email
      }
    })

    if (existingConnection) {
      // Update existing connection
      await prisma.calendarConnection.update({
        where: { id: existingConnection.id },
        data: {
          accessToken: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token || existingConnection.refreshToken,
          expiresAt,
          isPrimary: !existingConnection.isPrimary // Keep existing primary status
        }
      })
    } else {
      // Check if user has any calendar connections
      const connectionCount = await prisma.calendarConnection.count({
        where: { userId: session.user.id }
      })

      // Create new connection
      await prisma.calendarConnection.create({
        data: {
          provider: 'google',
          accessToken: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token,
          expiresAt,
          email: userInfo.email,
          isPrimary: connectionCount === 0, // First connection becomes primary
          userId: session.user.id
        }
      })
    }

    // Redirect to settings page with success
    const successUrl = new URL('/settings/calendars', request.url)
    successUrl.searchParams.set('success', 'connected')
    return NextResponse.redirect(successUrl)

  } catch (error) {
    console.error('Error handling Google OAuth callback:', error)
    const errorUrl = new URL('/settings/calendars', request.url)
    errorUrl.searchParams.set('error', 'callback_failed')
    return NextResponse.redirect(errorUrl)
  }
}