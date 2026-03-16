import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { buildGoogleAuthUrl } from "@/lib/google-calendar";
import crypto from "crypto";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if Google Calendar credentials are configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.json(
        { error: "Google Calendar integration is not configured" },
        { status: 503 },
      );
    }

    // Generate state parameter for security
    const state = crypto.randomBytes(32).toString("hex");

    // Build the OAuth callback URL
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/integrations/google/callback`;

    // Build the Google OAuth URL
    const authUrl = buildGoogleAuthUrl(redirectUri, state);

    // Store state in session or return it to client for verification
    // For now, we'll return it to be stored on the client side
    return NextResponse.json({
      authUrl,
      state, // Client should store this to verify callback
    });
  } catch (error) {
    console.error("Error creating Google OAuth URL:", error);
    return NextResponse.json(
      { error: "Failed to create OAuth URL" },
      { status: 500 },
    );
  }
}
