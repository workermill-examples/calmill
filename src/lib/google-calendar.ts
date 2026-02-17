import { prisma } from "@/lib/prisma";

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type BusyTime = {
  start: Date;
  end: Date;
};

type CalendarConnection = {
  id: string;
  userId: string;
  provider: string;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
  email: string | null;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type BookingWithDetails = {
  id: string;
  uid: string;
  title: string | null;
  attendeeName: string;
  attendeeEmail: string;
  startTime: Date;
  endTime: Date;
  location: string | null;
  notes: string | null;
  eventType?: {
    title: string;
    duration: number;
  };
  user?: {
    name: string | null;
    email: string | null;
  };
  [key: string]: unknown;
};

// ─── SERVICE ─────────────────────────────────────────────────────────────────

export class GoogleCalendarService {
  private connection: CalendarConnection;

  constructor(connection: CalendarConnection) {
    this.connection = connection;
  }

  /**
   * Returns a valid access token, refreshing it if it's within 5 minutes of expiry.
   */
  async getValidAccessToken(): Promise<string> {
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);

    if (
      this.connection.expiresAt &&
      this.connection.expiresAt < fiveMinutesFromNow &&
      this.connection.refreshToken
    ) {
      // Token is expired or about to expire — refresh it
      const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID ?? "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        refresh_token: this.connection.refreshToken,
        grant_type: "refresh_token",
      });

      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `Failed to refresh Google token: ${error.error ?? response.status}`
        );
      }

      const data = await response.json();
      const newAccessToken: string = data.access_token;
      const expiresAt = new Date(Date.now() + data.expires_in * 1000);

      // Persist the refreshed token
      await prisma.calendarConnection.update({
        where: { id: this.connection.id },
        data: { accessToken: newAccessToken, expiresAt },
      });

      this.connection = {
        ...this.connection,
        accessToken: newAccessToken,
        expiresAt,
      };
    }

    return this.connection.accessToken;
  }

  /**
   * Fetches busy times from the user's primary Google Calendar.
   */
  async getBusyTimes(startDate: Date, endDate: Date): Promise<BusyTime[]> {
    const token = await this.getValidAccessToken();

    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/freeBusy",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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
      const error = await response.json();
      throw new Error(
        `Google Calendar freebusy error: ${response.status} ${JSON.stringify(error)}`
      );
    }

    const data = await response.json();
    const busy: Array<{ start: string; end: string }> =
      data.calendars?.primary?.busy ?? [];

    return busy.map((slot) => ({
      start: new Date(slot.start),
      end: new Date(slot.end),
    }));
  }

  /**
   * Creates a Google Calendar event for a booking.
   * Returns the created event ID.
   */
  async createEvent(booking: BookingWithDetails): Promise<string> {
    const token = await this.getValidAccessToken();

    const eventBody = {
      summary: booking.eventType?.title ?? booking.title ?? "Meeting",
      description: booking.notes ?? "",
      start: {
        dateTime: booking.startTime.toISOString(),
      },
      end: {
        dateTime: booking.endTime.toISOString(),
      },
      location: booking.location ?? "",
      attendees: [
        { email: booking.attendeeEmail, displayName: booking.attendeeName },
        ...(booking.user?.email
          ? [{ email: booking.user.email, displayName: booking.user.name ?? "" }]
          : []),
      ],
    };

    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventBody),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to create Google Calendar event: ${response.status} ${JSON.stringify(error)}`
      );
    }

    const data = await response.json();
    return data.id as string;
  }

  /**
   * Updates an existing Google Calendar event for a rescheduled booking.
   */
  async updateEvent(
    eventId: string,
    booking: BookingWithDetails
  ): Promise<void> {
    const token = await this.getValidAccessToken();

    const eventBody = {
      summary: booking.eventType?.title ?? booking.title ?? "Meeting",
      description: booking.notes ?? "",
      start: {
        dateTime: booking.startTime.toISOString(),
      },
      end: {
        dateTime: booking.endTime.toISOString(),
      },
      location: booking.location ?? "",
      attendees: [
        { email: booking.attendeeEmail, displayName: booking.attendeeName },
        ...(booking.user?.email
          ? [{ email: booking.user.email, displayName: booking.user.name ?? "" }]
          : []),
      ],
    };

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventBody),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to update Google Calendar event: ${response.status} ${JSON.stringify(error)}`
      );
    }
  }

  /**
   * Deletes a Google Calendar event (e.g., on booking cancellation).
   */
  async deleteEvent(eventId: string): Promise<void> {
    const token = await this.getValidAccessToken();

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to delete Google Calendar event: ${response.status} ${JSON.stringify(error)}`
      );
    }
  }
}
