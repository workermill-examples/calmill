import { prisma } from "@/lib/prisma";
import type { CalendarConnection } from "@/generated/prisma/client";
import type { BookingWithDetails } from "@/types";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type BusyTime = {
  start: Date;
  end: Date;
};

// ─── ERRORS ───────────────────────────────────────────────────────────────────

export class GoogleCalendarError extends Error {
  constructor(
    message: string,
    public readonly code: "auth" | "quota" | "network" | "not_found" | "unknown"
  ) {
    super(message);
    this.name = "GoogleCalendarError";
  }
}

function parseGoogleError(status: number, body: string): GoogleCalendarError {
  if (status === 401 || status === 403) {
    return new GoogleCalendarError(
      `Google Calendar authentication failed (${status}): ${body}`,
      "auth"
    );
  }
  if (status === 429) {
    return new GoogleCalendarError(
      `Google Calendar quota exceeded: ${body}`,
      "quota"
    );
  }
  if (status === 404) {
    return new GoogleCalendarError(
      `Google Calendar resource not found: ${body}`,
      "not_found"
    );
  }
  return new GoogleCalendarError(
    `Google Calendar request failed (${status}): ${body}`,
    "unknown"
  );
}

// ─── SERVICE ──────────────────────────────────────────────────────────────────

export class GoogleCalendarService {
  private connection: CalendarConnection;

  constructor(connection: CalendarConnection) {
    this.connection = connection;
  }

  /**
   * Returns a valid access token, refreshing if expired or within 5 minutes of expiry.
   * Updates the CalendarConnection record in the database if the token is refreshed.
   */
  async getValidAccessToken(): Promise<string> {
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);

    // Token is still valid
    if (!this.connection.expiresAt || this.connection.expiresAt > fiveMinutesFromNow) {
      return this.connection.accessToken;
    }

    // Token is expired or about to expire — refresh it
    if (!this.connection.refreshToken) {
      throw new GoogleCalendarError(
        "No refresh token available. User must re-authenticate with Google.",
        "auth"
      );
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new GoogleCalendarError(
        "Google OAuth credentials not configured.",
        "auth"
      );
    }

    let refreshData: {
      access_token: string;
      expires_in?: number;
    };

    try {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: this.connection.refreshToken,
          grant_type: "refresh_token",
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        throw parseGoogleError(response.status, body);
      }

      refreshData = await response.json();
    } catch (err) {
      if (err instanceof GoogleCalendarError) throw err;
      throw new GoogleCalendarError(
        `Token refresh network error: ${err instanceof Error ? err.message : String(err)}`,
        "network"
      );
    }

    const newExpiresAt = typeof refreshData.expires_in === "number"
      ? new Date(Date.now() + refreshData.expires_in * 1000)
      : null;

    // Update the connection in the database and in-memory
    await prisma.calendarConnection.update({
      where: { id: this.connection.id },
      data: {
        accessToken: refreshData.access_token,
        expiresAt: newExpiresAt,
      },
    });

    this.connection = {
      ...this.connection,
      accessToken: refreshData.access_token,
      expiresAt: newExpiresAt,
    };

    return this.connection.accessToken;
  }

  /**
   * Fetches busy time intervals from Google Calendar's primary calendar
   * for the given date range.
   */
  async getBusyTimes(startDate: Date, endDate: Date): Promise<BusyTime[]> {
    const accessToken = await this.getValidAccessToken();

    let data: {
      calendars?: {
        primary?: {
          busy?: Array<{ start: string; end: string }>;
        };
      };
    };

    try {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/freeBusy",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            timeMin: startDate.toISOString(),
            timeMax: endDate.toISOString(),
            items: [{ id: "primary" }],
          }),
        }
      );

      if (!response.ok) {
        const body = await response.text();
        throw parseGoogleError(response.status, body);
      }

      data = await response.json();
    } catch (err) {
      if (err instanceof GoogleCalendarError) throw err;
      throw new GoogleCalendarError(
        `getBusyTimes network error: ${err instanceof Error ? err.message : String(err)}`,
        "network"
      );
    }

    const busyPeriods = data.calendars?.primary?.busy ?? [];

    return busyPeriods.map((period) => ({
      start: new Date(period.start),
      end: new Date(period.end),
    }));
  }

  /**
   * Creates a Google Calendar event for a booking.
   * Returns the Google Calendar event ID to store on the Booking record.
   */
  async createEvent(booking: BookingWithDetails): Promise<string> {
    const accessToken = await this.getValidAccessToken();

    const location = getBookingLocation(booking);
    const description = buildEventDescription(booking);

    let data: { id?: string };

    try {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            summary: booking.title,
            description,
            start: { dateTime: booking.startTime.toISOString() },
            end: { dateTime: booking.endTime.toISOString() },
            attendees: [{ email: booking.attendeeEmail, displayName: booking.attendeeName }],
            ...(location && { location }),
          }),
        }
      );

      if (!response.ok) {
        const body = await response.text();
        throw parseGoogleError(response.status, body);
      }

      data = await response.json();
      if (!data.id) {
        throw new GoogleCalendarError(
          "Google Calendar created event but returned no event ID",
          "unknown"
        );
      }
    } catch (err) {
      if (err instanceof GoogleCalendarError) throw err;
      throw new GoogleCalendarError(
        `createEvent network error: ${err instanceof Error ? err.message : String(err)}`,
        "network"
      );
    }

    return data.id!;
  }

  /**
   * Updates an existing Google Calendar event for a rescheduled booking.
   */
  async updateEvent(eventId: string, booking: BookingWithDetails): Promise<void> {
    const accessToken = await this.getValidAccessToken();

    const location = getBookingLocation(booking);
    const description = buildEventDescription(booking);

    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            summary: booking.title,
            description,
            start: { dateTime: booking.startTime.toISOString() },
            end: { dateTime: booking.endTime.toISOString() },
            attendees: [{ email: booking.attendeeEmail, displayName: booking.attendeeName }],
            ...(location && { location }),
          }),
        }
      );

      if (!response.ok) {
        const body = await response.text();
        throw parseGoogleError(response.status, body);
      }
    } catch (err) {
      if (err instanceof GoogleCalendarError) throw err;
      throw new GoogleCalendarError(
        `updateEvent network error: ${err instanceof Error ? err.message : String(err)}`,
        "network"
      );
    }
  }

  /**
   * Deletes a Google Calendar event (e.g., on booking cancellation).
   */
  async deleteEvent(eventId: string): Promise<void> {
    const accessToken = await this.getValidAccessToken();

    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // 204 No Content is the success response for DELETE
      // 404 means the event was already deleted — treat as success
      if (!response.ok && response.status !== 404) {
        const body = await response.text();
        throw parseGoogleError(response.status, body);
      }
    } catch (err) {
      if (err instanceof GoogleCalendarError) throw err;
      throw new GoogleCalendarError(
        `deleteEvent network error: ${err instanceof Error ? err.message : String(err)}`,
        "network"
      );
    }
  }
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/**
 * Extracts a location string from a booking's event type locations.
 * Returns the first location value, or undefined if none.
 */
function getBookingLocation(booking: BookingWithDetails): string | undefined {
  if (!booking.eventType.locations) return undefined;

  type Location = { type: string; value: string };
  const locations = booking.eventType.locations as Location[];

  if (!Array.isArray(locations) || locations.length === 0) return undefined;

  return locations[0]?.value;
}

/**
 * Builds a plain-text event description for Google Calendar from booking details.
 */
function buildEventDescription(booking: BookingWithDetails): string {
  const lines: string[] = [
    `Booked via CalMill`,
    ``,
    `Attendee: ${booking.attendeeName} (${booking.attendeeEmail})`,
  ];

  if (booking.attendeeNotes) {
    lines.push(`Notes: ${booking.attendeeNotes}`);
  }

  if (booking.meetingUrl) {
    lines.push(`Meeting Link: ${booking.meetingUrl}`);
  }

  return lines.join("\n");
}
