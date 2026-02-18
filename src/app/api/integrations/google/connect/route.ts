import { NextResponse } from "next/server";
import crypto from "crypto";
import { withAuth } from "@/lib/api-auth";

const GOOGLE_OAUTH_SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/userinfo.email",
].join(" ");

// GET /api/integrations/google/connect — Generate Google OAuth URL
export const GET = withAuth(async (_request, _context, user) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json(
        { error: "Google OAuth is not configured" },
        { status: 503 }
      );
    }

    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI ??
      `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/google/callback`;

    // Build a signed state: userId.timestamp.hmac
    const secret = process.env.AUTH_SECRET ?? "";
    const timestamp = Date.now().toString();
    const payload = `${user.id}.${timestamp}`;
    const hmac = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("base64url");
    const state = `${Buffer.from(payload).toString("base64url")}.${hmac}`;

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: GOOGLE_OAUTH_SCOPES,
      access_type: "offline",
      prompt: "consent", // Always get refresh token
      state,
    });

    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("GET /api/integrations/google/connect error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
