// Google Calendar integration via native fetch
// OAuth token refresh and calendar API interactions

import { prisma } from "@/lib/prisma";
import type { CalendarConnection } from "@/generated/prisma";

// Google Calendar API scopes required
export const GOOGLE_CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events",
].join(" ");

// Google OAuth URLs
export const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

// Calendar API base URL
const CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3";

/**
 * Get a valid access token, refreshing if necessary
 */
export async function getValidAccessToken(
  connectionId: string,
): Promise<string | null> {
  try {
    const connection = await prisma.calendarConnection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      return null;
    }

    // Check if token is still valid (with 5 minute buffer)
    const now = new Date();
    const expiresAt = connection.expiresAt;
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds

    if (expiresAt && now.getTime() < expiresAt.getTime() - bufferTime) {
      return connection.accessToken;
    }

    // Token expired or expiring soon, refresh it
    if (!connection.refreshToken) {
      // No refresh token available, need to re-authenticate
      return null;
    }

    return await refreshAccessToken(connection);
  } catch (error) {
    console.error("Error getting valid access token:", error);
    return null;
  }
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(
  connection: CalendarConnection,
): Promise<string | null> {
  try {
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        refresh_token: connection.refreshToken!,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      console.error("Failed to refresh token:", response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.error) {
      console.error("Error refreshing token:", data.error);
      return null;
    }

    // Update the connection with new access token and expiration
    const expiresAt = new Date(Date.now() + data.expires_in * 1000);

    await prisma.calendarConnection.update({
      where: { id: connection.id },
      data: {
        accessToken: data.access_token,
        expiresAt,
        // Some responses include a new refresh token
        ...(data.refresh_token && { refreshToken: data.refresh_token }),
      },
    });

    return data.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
}

/**
 * Get busy times from Google Calendar using FreeBusy API
 */
export async function getBusyTimes(
  connectionId: string,
  timeMin: string, // ISO string
  timeMax: string, // ISO string
  calendarIds?: string[],
): Promise<Array<{ start: string; end: string }>> {
  try {
    const accessToken = await getValidAccessToken(connectionId);
    if (!accessToken) {
      console.warn(
        "No valid access token for calendar connection:",
        connectionId,
      );
      return [];
    }

    const connection = await prisma.calendarConnection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      return [];
    }

    // Default to primary calendar if no specific calendars provided
    const calendarsToCheck = calendarIds || [connection.email];

    const requestBody = {
      timeMin,
      timeMax,
      items: calendarsToCheck.map((id) => ({ id })),
    };

    const response = await fetch(`${CALENDAR_API_BASE}/freeBusy`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error("Failed to fetch busy times:", response.statusText);
      return [];
    }

    const data = await response.json();

    // Flatten all busy periods from all calendars
    const busyTimes: Array<{ start: string; end: string }> = [];

    for (const calendar of Object.values(data.calendars || {}) as any[]) {
      if (calendar.busy) {
        for (const period of calendar.busy) {
          busyTimes.push({
            start: period.start,
            end: period.end,
          });
        }
      }
    }

    return busyTimes;
  } catch (error) {
    console.error("Error getting busy times:", error);
    // Return empty array on error - don't fail the booking
    return [];
  }
}

/**
 * Create a calendar event
 */
export async function createEvent(
  connectionId: string,
  event: {
    summary: string;
    description?: string;
    start: { dateTime: string; timeZone: string };
    end: { dateTime: string; timeZone: string };
    attendees?: Array<{ email: string; displayName?: string }>;
    location?: string;
  },
  calendarId = "primary",
): Promise<string | null> {
  try {
    const accessToken = await getValidAccessToken(connectionId);
    if (!accessToken) {
      console.warn(
        "No valid access token for calendar connection:",
        connectionId,
      );
      return null;
    }

    const response = await fetch(
      `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      },
    );

    if (!response.ok) {
      console.error("Failed to create calendar event:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return null;
  }
}

/**
 * Update a calendar event
 */
export async function updateEvent(
  connectionId: string,
  eventId: string,
  event: {
    summary?: string;
    description?: string;
    start?: { dateTime: string; timeZone: string };
    end?: { dateTime: string; timeZone: string };
    attendees?: Array<{ email: string; displayName?: string }>;
    location?: string;
  },
  calendarId = "primary",
): Promise<boolean> {
  try {
    const accessToken = await getValidAccessToken(connectionId);
    if (!accessToken) {
      console.warn(
        "No valid access token for calendar connection:",
        connectionId,
      );
      return false;
    }

    const response = await fetch(
      `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      },
    );

    if (!response.ok) {
      console.error("Failed to update calendar event:", response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating calendar event:", error);
    return false;
  }
}

/**
 * Delete a calendar event
 */
export async function deleteEvent(
  connectionId: string,
  eventId: string,
  calendarId = "primary",
): Promise<boolean> {
  try {
    const accessToken = await getValidAccessToken(connectionId);
    if (!accessToken) {
      console.warn(
        "No valid access token for calendar connection:",
        connectionId,
      );
      return false;
    }

    const response = await fetch(
      `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok && response.status !== 404) {
      console.error("Failed to delete calendar event:", response.statusText);
      return false;
    }

    // 404 is OK - event doesn't exist (maybe already deleted)
    return true;
  } catch (error) {
    console.error("Error deleting calendar event:", error);
    return false;
  }
}

/**
 * Get user's calendars
 */
export async function getCalendars(connectionId: string): Promise<
  Array<{
    id: string;
    summary: string;
    primary?: boolean;
    accessRole: string;
  }>
> {
  try {
    const accessToken = await getValidAccessToken(connectionId);
    if (!accessToken) {
      console.warn(
        "No valid access token for calendar connection:",
        connectionId,
      );
      return [];
    }

    const response = await fetch(`${CALENDAR_API_BASE}/users/me/calendarList`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch calendars:", response.statusText);
      return [];
    }

    const data = await response.json();

    return (data.items || []).map((cal: any) => ({
      id: cal.id,
      summary: cal.summary,
      primary: cal.primary,
      accessRole: cal.accessRole,
    }));
  } catch (error) {
    console.error("Error getting calendars:", error);
    return [];
  }
}

/**
 * Helper function to build Google OAuth URL
 */
export function buildGoogleAuthUrl(
  redirectUri: string,
  state?: string,
): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GOOGLE_CALENDAR_SCOPES,
    access_type: "offline",
    prompt: "consent", // Force consent to get refresh token
    ...(state && { state }),
  });

  return `${GOOGLE_OAUTH_URL}?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string,
): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
} | null> {
  try {
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      console.error("Failed to exchange code for tokens:", response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.error) {
      console.error("Error exchanging code for tokens:", data.error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    return null;
  }
}

/**
 * Get user info from Google
 */
export async function getGoogleUserInfo(accessToken: string): Promise<{
  email: string;
  name?: string;
  picture?: string;
} | null> {
  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      console.error("Failed to get Google user info:", response.statusText);
      return null;
    }

    const data = await response.json();

    return {
      email: data.email,
      name: data.name,
      picture: data.picture,
    };
  } catch (error) {
    console.error("Error getting Google user info:", error);
    return null;
  }
}
