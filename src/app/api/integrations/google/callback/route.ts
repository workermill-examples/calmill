import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

const STATE_MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes

// GET /api/integrations/google/callback — Exchange OAuth code for tokens
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const errorRedirect = `${appUrl}/settings/calendars?error=`;

  // Handle user-denied access
  if (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(`${errorRedirect}${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${errorRedirect}${encodeURIComponent('missing_params')}`);
  }

  // Verify signed state: base64url(userId.timestamp).hmac
  let userId: string;
  try {
    const [payloadB64, hmac] = state.split('.');
    if (!payloadB64 || !hmac) throw new Error('malformed state');

    const payload = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const secret = process.env.AUTH_SECRET ?? '';
    const expectedHmac = crypto.createHmac('sha256', secret).update(payload).digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac))) {
      throw new Error('invalid signature');
    }

    const [uid, timestamp] = payload.split('.');
    if (!uid || !timestamp) throw new Error('malformed payload');

    // Check expiry
    const age = Date.now() - parseInt(timestamp, 10);
    if (age > STATE_MAX_AGE_MS) {
      throw new Error('state expired');
    }

    userId = uid;
  } catch {
    return NextResponse.redirect(`${errorRedirect}${encodeURIComponent('invalid_state')}`);
  }

  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.redirect(`${errorRedirect}${encodeURIComponent('user_not_found')}`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ?? `${appUrl}/api/integrations/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${errorRedirect}${encodeURIComponent('oauth_not_configured')}`);
  }

  // Exchange authorization code for tokens
  let tokenData: {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    token_type: string;
  };

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.text();
      console.error('Token exchange failed:', errorBody);
      return NextResponse.redirect(
        `${errorRedirect}${encodeURIComponent('token_exchange_failed')}`
      );
    }

    tokenData = await tokenResponse.json();
  } catch (err) {
    console.error('Token exchange error:', err);
    return NextResponse.redirect(`${errorRedirect}${encodeURIComponent('token_exchange_failed')}`);
  }

  // Fetch user's Google email from userinfo endpoint
  let googleEmail: string;
  try {
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userInfoResponse.ok) {
      throw new Error(`Userinfo request failed: ${userInfoResponse.status}`);
    }

    const userInfo = await userInfoResponse.json();
    googleEmail = userInfo.email;

    if (!googleEmail) {
      throw new Error('No email returned from Google userinfo');
    }
  } catch (err) {
    console.error('Userinfo fetch error:', err);
    return NextResponse.redirect(`${errorRedirect}${encodeURIComponent('userinfo_failed')}`);
  }

  // Compute token expiry time
  const expiresAt = tokenData.expires_in
    ? new Date(Date.now() + tokenData.expires_in * 1000)
    : null;

  // Find existing connection for this Google account
  const existing = await prisma.calendarConnection.findFirst({
    where: { userId, provider: 'google', email: googleEmail },
    select: { id: true },
  });

  if (existing) {
    // Update existing connection with fresh tokens
    await prisma.calendarConnection.update({
      where: { id: existing.id },
      data: {
        accessToken: tokenData.access_token,
        ...(tokenData.refresh_token && { refreshToken: tokenData.refresh_token }),
        expiresAt,
      },
    });
  } else {
    // Check if this is the user's first calendar connection (to set isPrimary)
    const connectionCount = await prisma.calendarConnection.count({
      where: { userId },
    });

    await prisma.calendarConnection.create({
      data: {
        provider: 'google',
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token ?? null,
        expiresAt,
        email: googleEmail,
        isPrimary: connectionCount === 0,
        userId,
      },
    });
  }

  return NextResponse.redirect(`${appUrl}/settings/calendars?connected=true`);
}
