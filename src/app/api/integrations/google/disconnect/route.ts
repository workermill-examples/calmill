import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/api-auth";

// DELETE /api/integrations/google/disconnect — Revoke token and delete connection
export const DELETE = withAuth(async (_request, _context, user) => {
  try {
    // Find the user's Google calendar connection
    const connection = await prisma.calendarConnection.findFirst({
      where: { userId: user.id, provider: "google" },
      select: { id: true, accessToken: true },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "No Google Calendar connection found" },
        { status: 404 }
      );
    }

    // Revoke the token with Google (best-effort — don't fail if revocation fails)
    try {
      await fetch(
        `https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(connection.accessToken)}`,
        { method: "POST" }
      );
    } catch (err) {
      console.error("Token revocation error (continuing):", err);
    }

    // Delete the CalendarConnection record
    await prisma.calendarConnection.delete({
      where: { id: connection.id },
    });

    return NextResponse.json({
      success: true,
      message: "Google Calendar disconnected",
    });
  } catch (error) {
    console.error("DELETE /api/integrations/google/disconnect error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
