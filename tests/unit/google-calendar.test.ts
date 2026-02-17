import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Tests for GoogleCalendarService (src/lib/google-calendar.ts)
 *
 * These tests mock the global fetch to verify that the service:
 * - Refreshes tokens when near expiry
 * - Fetches busy times from the freebusy API
 * - Creates, updates, and deletes calendar events
 * - Handles authentication and quota errors gracefully
 */

// ─── MODULE MOCK ─────────────────────────────────────────────────────────────

// Mock the prisma client so token refresh can update the CalendarConnection record
vi.mock("@/lib/prisma", () => ({
  prisma: {
    calendarConnection: {
      update: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/** Build a CalendarConnection fixture */
function makeConnection(overrides: Record<string, unknown> = {}) {
  return {
    id: "conn-123",
    userId: "user-123",
    provider: "google",
    accessToken: "valid-access-token",
    refreshToken: "refresh-token-xyz",
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now (not expired)
    email: "user@gmail.com",
    isPrimary: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/** Build a minimal booking fixture */
function makeBooking(overrides: Record<string, unknown> = {}) {
  return {
    id: "booking-123",
    uid: "uid-abc",
    title: "30 Minute Meeting",
    attendeeName: "Jane Doe",
    attendeeEmail: "jane@example.com",
    startTime: new Date("2026-03-10T15:00:00Z"),
    endTime: new Date("2026-03-10T15:30:00Z"),
    location: "https://meet.google.com/abc-defg-hij",
    notes: "Looking forward to it",
    eventType: {
      title: "30 Minute Meeting",
      duration: 30,
    },
    user: {
      name: "Host User",
      email: "host@example.com",
    },
    ...overrides,
  };
}

// ─── FETCH MOCK HELPERS ───────────────────────────────────────────────────────

function mockFetchSuccess(body: unknown, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  });
}

function mockFetchFailure(status: number, body: unknown = {}) {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  });
}

// ─── DYNAMIC IMPORT HELPER ────────────────────────────────────────────────────

async function getService(connection: ReturnType<typeof makeConnection>) {
  // Re-import module fresh each time to pick up new fetch mocks
  const { GoogleCalendarService } = await import("@/lib/google-calendar");
  return new GoogleCalendarService(connection);
}

// ─── TESTS ───────────────────────────────────────────────────────────────────

describe("GoogleCalendarService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  // ── Token Management ────────────────────────────────────────────────────────

  describe("getValidAccessToken", () => {
    it("returns existing token when not near expiry", async () => {
      const connection = makeConnection({
        accessToken: "current-token",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      });

      vi.stubGlobal("fetch", mockFetchSuccess({}));
      const service = await getService(connection);
      const token = await service.getValidAccessToken();

      expect(token).toBe("current-token");
      // fetch should NOT have been called for token refresh
      const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
      const refreshCalls = fetchMock.mock.calls.filter((call) =>
        String(call[0]).includes("oauth2.googleapis.com/token")
      );
      expect(refreshCalls).toHaveLength(0);
    });

    it("refreshes token when within 5 minutes of expiry", async () => {
      const connection = makeConnection({
        accessToken: "old-token",
        refreshToken: "my-refresh-token",
        expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes from now (< 5 min buffer)
      });

      const newTokenResponse = {
        access_token: "new-access-token",
        expires_in: 3600,
        token_type: "Bearer",
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => newTokenResponse,
        text: async () => JSON.stringify(newTokenResponse),
      }));

      const { prisma: mockPrisma } = await import("@/lib/prisma");
      vi.mocked(mockPrisma.calendarConnection.update).mockResolvedValue({} as never);

      const service = await getService(connection);
      const token = await service.getValidAccessToken();

      expect(token).toBe("new-access-token");

      // Verify fetch was called to refresh token
      const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
      const refreshCall = fetchMock.mock.calls.find((call) =>
        String(call[0]).includes("oauth2.googleapis.com/token")
      );
      expect(refreshCall).toBeDefined();

      // Verify the refresh token was sent
      const body = refreshCall![1]?.body as string;
      expect(body).toContain("refresh_token=my-refresh-token");
      expect(body).toContain("grant_type=refresh_token");
    });

    it("refreshes token when already expired", async () => {
      const connection = makeConnection({
        accessToken: "expired-token",
        refreshToken: "refresh-token",
        expiresAt: new Date(Date.now() - 60 * 1000), // expired 1 minute ago
      });

      const newTokenResponse = {
        access_token: "refreshed-token",
        expires_in: 3600,
        token_type: "Bearer",
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => newTokenResponse,
        text: async () => JSON.stringify(newTokenResponse),
      }));

      const { prisma: mockPrisma } = await import("@/lib/prisma");
      vi.mocked(mockPrisma.calendarConnection.update).mockResolvedValue({} as never);

      const service = await getService(connection);
      const token = await service.getValidAccessToken();

      expect(token).toBe("refreshed-token");
    });

    it("updates CalendarConnection record in database after token refresh", async () => {
      const connection = makeConnection({
        id: "conn-456",
        expiresAt: new Date(Date.now() + 1 * 60 * 1000), // 1 min from now (< 5 min buffer)
        refreshToken: "refresh-token-abc",
      });

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          access_token: "brand-new-token",
          expires_in: 3600,
        }),
        text: async () => "{}",
      }));

      const { prisma: mockPrisma } = await import("@/lib/prisma");
      vi.mocked(mockPrisma.calendarConnection.update).mockResolvedValue({} as never);

      const service = await getService(connection);
      await service.getValidAccessToken();

      expect(mockPrisma.calendarConnection.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "conn-456" },
          data: expect.objectContaining({
            accessToken: "brand-new-token",
            expiresAt: expect.any(Date),
          }),
        })
      );
    });
  });

  // ── Busy Times ──────────────────────────────────────────────────────────────

  describe("getBusyTimes", () => {
    it("returns busy time intervals from the freebusy API", async () => {
      const connection = makeConnection();
      const startDate = new Date("2026-03-10T00:00:00Z");
      const endDate = new Date("2026-03-10T23:59:59Z");

      const freeBusyResponse = {
        calendars: {
          primary: {
            busy: [
              { start: "2026-03-10T09:00:00Z", end: "2026-03-10T10:00:00Z" },
              { start: "2026-03-10T14:00:00Z", end: "2026-03-10T15:00:00Z" },
            ],
          },
        },
      };

      vi.stubGlobal("fetch", mockFetchSuccess(freeBusyResponse));

      const service = await getService(connection);
      const busyTimes = await service.getBusyTimes(startDate, endDate);

      expect(busyTimes).toHaveLength(2);
      expect(busyTimes[0]).toEqual({
        start: new Date("2026-03-10T09:00:00Z"),
        end: new Date("2026-03-10T10:00:00Z"),
      });
      expect(busyTimes[1]).toEqual({
        start: new Date("2026-03-10T14:00:00Z"),
        end: new Date("2026-03-10T15:00:00Z"),
      });
    });

    it("returns empty array when no busy times", async () => {
      const connection = makeConnection();

      const freeBusyResponse = {
        calendars: {
          primary: {
            busy: [],
          },
        },
      };

      vi.stubGlobal("fetch", mockFetchSuccess(freeBusyResponse));

      const service = await getService(connection);
      const busyTimes = await service.getBusyTimes(
        new Date("2026-03-10T00:00:00Z"),
        new Date("2026-03-10T23:59:59Z")
      );

      expect(busyTimes).toHaveLength(0);
    });

    it("sends correct request body to freebusy API", async () => {
      const connection = makeConnection({ accessToken: "test-token" });
      const startDate = new Date("2026-03-10T00:00:00Z");
      const endDate = new Date("2026-03-10T23:59:59Z");

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ calendars: { primary: { busy: [] } } }),
        text: async () => "{}",
      });
      vi.stubGlobal("fetch", fetchMock);

      const service = await getService(connection);
      await service.getBusyTimes(startDate, endDate);

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("calendar/v3/freeBusy"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
          }),
          body: expect.stringContaining('"primary"'),
        })
      );
    });

    it("throws on 401 authentication error", async () => {
      const connection = makeConnection();

      vi.stubGlobal(
        "fetch",
        mockFetchFailure(401, { error: "invalid_token" })
      );

      const service = await getService(connection);
      await expect(
        service.getBusyTimes(
          new Date("2026-03-10T00:00:00Z"),
          new Date("2026-03-10T23:59:59Z")
        )
      ).rejects.toThrow();
    });

    it("throws on 429 quota exceeded error", async () => {
      const connection = makeConnection();

      vi.stubGlobal(
        "fetch",
        mockFetchFailure(429, { error: { code: 429, message: "Rate Limit Exceeded" } })
      );

      const service = await getService(connection);
      await expect(
        service.getBusyTimes(
          new Date("2026-03-10T00:00:00Z"),
          new Date("2026-03-10T23:59:59Z")
        )
      ).rejects.toThrow();
    });
  });

  // ── Event Creation ──────────────────────────────────────────────────────────

  describe("createEvent", () => {
    it("creates a calendar event and returns the event ID", async () => {
      const connection = makeConnection();
      const booking = makeBooking();

      const createdEvent = {
        id: "google-event-id-xyz",
        htmlLink: "https://www.google.com/calendar/event?eid=xyz",
        status: "confirmed",
      };

      vi.stubGlobal("fetch", mockFetchSuccess(createdEvent));

      const service = await getService(connection);
      const eventId = await service.createEvent(booking);

      expect(eventId).toBe("google-event-id-xyz");
    });

    it("sends correct event data to Google Calendar API", async () => {
      const connection = makeConnection({ accessToken: "create-token" });
      const booking = makeBooking({
        attendeeName: "Test Attendee",
        attendeeEmail: "attendee@test.com",
        startTime: new Date("2026-03-10T15:00:00Z"),
        endTime: new Date("2026-03-10T15:30:00Z"),
      });

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: "event-id-123" }),
        text: async () => "{}",
      });
      vi.stubGlobal("fetch", fetchMock);

      const service = await getService(connection);
      await service.createEvent(booking);

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("calendar/v3/calendars/primary/events"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer create-token",
            "Content-Type": "application/json",
          }),
          body: expect.stringContaining("attendee@test.com"),
        })
      );

      // Verify event body structure
      const callBody = JSON.parse(fetchMock.mock.calls[0]![1]!.body as string);
      expect(callBody.start.dateTime).toBe("2026-03-10T15:00:00.000Z");
      expect(callBody.end.dateTime).toBe("2026-03-10T15:30:00.000Z");
      expect(callBody.attendees).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ email: "attendee@test.com" }),
        ])
      );
    });
  });

  // ── Event Updates ───────────────────────────────────────────────────────────

  describe("updateEvent", () => {
    it("updates an existing calendar event via PATCH", async () => {
      const connection = makeConnection({ accessToken: "update-token" });
      const booking = makeBooking({
        startTime: new Date("2026-03-11T10:00:00Z"),
        endTime: new Date("2026-03-11T10:30:00Z"),
      });

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: "event-id-456", status: "confirmed" }),
        text: async () => "{}",
      });
      vi.stubGlobal("fetch", fetchMock);

      const service = await getService(connection);
      await service.updateEvent("event-id-456", booking);

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("event-id-456"),
        expect.objectContaining({
          method: "PATCH",
          headers: expect.objectContaining({
            Authorization: "Bearer update-token",
          }),
        })
      );
    });
  });

  // ── Event Deletion ──────────────────────────────────────────────────────────

  describe("deleteEvent", () => {
    it("deletes a calendar event via DELETE", async () => {
      const connection = makeConnection({ accessToken: "delete-token" });

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
        json: async () => null,
        text: async () => "",
      });
      vi.stubGlobal("fetch", fetchMock);

      const service = await getService(connection);
      await service.deleteEvent("event-to-delete-id");

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("event-to-delete-id"),
        expect.objectContaining({
          method: "DELETE",
          headers: expect.objectContaining({
            Authorization: "Bearer delete-token",
          }),
        })
      );
    });

    it("throws on delete failure (event not found)", async () => {
      const connection = makeConnection();

      vi.stubGlobal(
        "fetch",
        mockFetchFailure(404, { error: { code: 404, message: "Not Found" } })
      );

      const service = await getService(connection);
      await expect(service.deleteEvent("nonexistent-event")).rejects.toThrow();
    });
  });
});
