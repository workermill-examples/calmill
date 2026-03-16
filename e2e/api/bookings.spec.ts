/**
 * Bookings API E2E Tests
 * Tests CRUD operations for bookings via direct API calls
 */

import { test, expect, Page } from "@playwright/test";
import {
  createAuthenticatedApiClient,
  parseApiResponse,
  testData,
  getFutureDate,
  formatDateString,
  generateTimeSlot,
} from "./auth-helper";

test.describe("Bookings API", () => {
  let apiClient: Awaited<ReturnType<typeof createAuthenticatedApiClient>>;
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    apiClient = await createAuthenticatedApiClient(page);
  });

  test.describe("GET /api/bookings", () => {
    test("should list bookings for authenticated user", async () => {
      const response = await apiClient.fetch("/api/bookings");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.ok).toBe(true);
      expect(result.data).toHaveProperty("bookings");
      expect(result.data).toHaveProperty("pagination");
      expect(Array.isArray(result.data.bookings)).toBe(true);

      // Verify pagination structure
      const pagination = result.data.pagination;
      expect(pagination).toHaveProperty("page");
      expect(pagination).toHaveProperty("limit");
      expect(pagination).toHaveProperty("total");
      expect(pagination).toHaveProperty("totalPages");
      expect(pagination).toHaveProperty("hasNext");
      expect(pagination).toHaveProperty("hasPrev");

      // Should have seeded data
      expect(result.data.bookings.length).toBeGreaterThan(0);

      // Verify structure of booking objects
      const booking = result.data.bookings[0];
      expect(booking).toHaveProperty("id");
      expect(booking).toHaveProperty("uid");
      expect(booking).toHaveProperty("title");
      expect(booking).toHaveProperty("startTime");
      expect(booking).toHaveProperty("endTime");
      expect(booking).toHaveProperty("status");
      expect(booking).toHaveProperty("attendeeName");
      expect(booking).toHaveProperty("attendeeEmail");
      expect(booking).toHaveProperty("eventType");
    });

    test("should filter bookings by status", async () => {
      const response = await apiClient.fetch("/api/bookings?status=PENDING");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);

      // All returned bookings should have PENDING status
      if (result.data.bookings.length > 0) {
        const allPending = result.data.bookings.every(
          (booking: any) => booking.status === "PENDING",
        );
        expect(allPending).toBe(true);
      }
    });

    test("should filter bookings by event type", async () => {
      // First, get an event type ID
      const eventTypesResponse = await apiClient.fetch("/api/event-types");
      const eventTypesResult = await parseApiResponse(eventTypesResponse);

      if (eventTypesResult.data.eventTypes.length > 0) {
        const eventTypeId = eventTypesResult.data.eventTypes[0].id;

        const response = await apiClient.fetch(
          `/api/bookings?eventTypeId=${eventTypeId}`,
        );
        const result = await parseApiResponse(response);

        expect(result.status).toBe(200);

        // All returned bookings should belong to the specified event type
        if (result.data.bookings.length > 0) {
          const allMatchEventType = result.data.bookings.every(
            (booking: any) => booking.eventType.id === eventTypeId,
          );
          expect(allMatchEventType).toBe(true);
        }
      }
    });

    test("should filter bookings by date range", async () => {
      const startDate = formatDateString(new Date());
      const endDate = formatDateString(getFutureDate(30));

      const response = await apiClient.fetch(
        `/api/bookings?startDate=${startDate}&endDate=${endDate}`,
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);

      // All returned bookings should be within the date range
      if (result.data.bookings.length > 0) {
        const startDateObj = new Date(`${startDate}T00:00:00.000Z`);
        const endDateObj = new Date(`${endDate}T23:59:59.999Z`);

        const allInRange = result.data.bookings.every((booking: any) => {
          const bookingDate = new Date(booking.startTime);
          return bookingDate >= startDateObj && bookingDate <= endDateObj;
        });
        expect(allInRange).toBe(true);
      }
    });

    test("should support pagination", async () => {
      const response = await apiClient.fetch("/api/bookings?page=1&limit=5");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data.pagination.page).toBe(1);
      expect(result.data.pagination.limit).toBe(5);
      expect(result.data.bookings.length).toBeLessThanOrEqual(5);
    });

    test("should search by attendee email", async () => {
      const response = await apiClient.fetch(
        "/api/bookings?attendeeEmail=test",
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);

      // All returned bookings should contain "test" in attendee email
      if (result.data.bookings.length > 0) {
        const allMatchEmail = result.data.bookings.every((booking: any) =>
          booking.attendeeEmail.toLowerCase().includes("test"),
        );
        expect(allMatchEmail).toBe(true);
      }
    });

    test("should require authentication", async () => {
      const response = await fetch("http://localhost:3000/api/bookings");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(401);
      expect(result.error).toHaveProperty("error", "unauthorized");
    });
  });

  test.describe("POST /api/bookings", () => {
    test("should create booking with valid data", async () => {
      // First, get an active event type
      const eventTypesResponse = await apiClient.fetch("/api/event-types");
      const eventTypesResult = await parseApiResponse(eventTypesResponse);

      expect(eventTypesResult.status).toBe(200);
      const eventTypes = eventTypesResult.data.eventTypes;
      const activeEventType = eventTypes.find((et: any) => et.isActive);

      if (!activeEventType) {
        console.log("No active event types found, skipping test");
        return;
      }

      // Get available slots for this event type
      const futureDate = getFutureDate(7);
      const dateStr = formatDateString(futureDate);
      const slotsResponse = await apiClient.fetch(
        `/api/slots?eventTypeId=${activeEventType.id}&startDate=${dateStr}&endDate=${dateStr}&timezone=America/New_York`,
      );
      const slotsResult = await parseApiResponse(slotsResponse);

      if (slotsResult.status !== 200 || slotsResult.data.slots.length === 0) {
        console.log("No available slots found, skipping test");
        return;
      }

      const availableSlot = slotsResult.data.slots[0];

      // Create booking
      const bookingData = {
        eventTypeId: activeEventType.id,
        startTime: availableSlot.time,
        attendeeName: "Test Attendee",
        attendeeEmail: `test-${Date.now()}@example.com`,
        attendeeTimezone: "America/New_York",
        attendeeNotes: "This is a test booking",
        location: "Video call",
        responses: {
          customField1: "Test response",
        },
      };

      const response = await apiClient.fetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify(bookingData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(201);
      expect(result.data).toHaveProperty("booking");

      const booking = result.data.booking;
      expect(booking.attendeeName).toBe(bookingData.attendeeName);
      expect(booking.attendeeEmail).toBe(bookingData.attendeeEmail);
      expect(booking.attendeeNotes).toBe(bookingData.attendeeNotes);
      expect(booking.location).toBe(bookingData.location);
      expect(booking).toHaveProperty("uid");

      // Status depends on event type requiresConfirmation
      const expectedStatus = activeEventType.requiresConfirmation
        ? "PENDING"
        : "ACCEPTED";
      expect(booking.status).toBe(expectedStatus);
    });

    test("should reject booking for inactive event type", async () => {
      // Get event types including inactive ones
      const eventTypesResponse = await apiClient.fetch(
        "/api/event-types?includeInactive=true",
      );
      const eventTypesResult = await parseApiResponse(eventTypesResponse);

      const inactiveEventType = eventTypesResult.data.eventTypes.find(
        (et: any) => !et.isActive,
      );

      if (!inactiveEventType) {
        console.log("No inactive event types found, skipping test");
        return;
      }

      const futureTime = generateTimeSlot(getFutureDate(7));
      const bookingData = {
        eventTypeId: inactiveEventType.id,
        startTime: futureTime,
        attendeeName: "Test Attendee",
        attendeeEmail: "test@example.com",
        attendeeTimezone: "America/New_York",
      };

      const response = await apiClient.fetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify(bookingData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "invalid");
      expect(result.error.message).toContain("not active");
    });

    test("should validate required fields", async () => {
      const invalidData = {
        // missing required fields
        attendeeName: "Test Name",
      };

      const response = await apiClient.fetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify(invalidData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation");
    });

    test("should validate email format", async () => {
      const invalidEmailData = {
        eventTypeId: "some-id",
        startTime: generateTimeSlot(getFutureDate(7)),
        attendeeName: "Test Attendee",
        attendeeEmail: "invalid-email",
        attendeeTimezone: "America/New_York",
      };

      const response = await apiClient.fetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify(invalidEmailData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation");
    });

    test("should reject booking for non-existent event type", async () => {
      const futureTime = generateTimeSlot(getFutureDate(7));
      const bookingData = {
        eventTypeId: "non-existent-event-type",
        startTime: futureTime,
        attendeeName: "Test Attendee",
        attendeeEmail: "test@example.com",
        attendeeTimezone: "America/New_York",
      };

      const response = await apiClient.fetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify(bookingData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(404);
      expect(result.error).toHaveProperty("error", "not_found");
    });

    test("should allow public access (no authentication required)", async () => {
      // Get an active event type first through authenticated request
      const eventTypesResponse = await apiClient.fetch("/api/event-types");
      const eventTypesResult = await parseApiResponse(eventTypesResponse);
      const activeEventType = eventTypesResult.data.eventTypes.find(
        (et: any) => et.isActive,
      );

      if (!activeEventType) {
        console.log("No active event types found, skipping test");
        return;
      }

      const futureTime = generateTimeSlot(getFutureDate(7));
      const bookingData = {
        eventTypeId: activeEventType.id,
        startTime: futureTime,
        attendeeName: "Public Test Attendee",
        attendeeEmail: `public-test-${Date.now()}@example.com`,
        attendeeTimezone: "America/New_York",
      };

      // Make request without authentication
      const response = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      const result = await parseApiResponse(response);

      // This might fail due to slot verification, but it should not fail due to auth
      if (result.status === 409) {
        // Slot conflict is acceptable
        expect(result.error).toHaveProperty("error", "conflict");
      } else if (result.status === 201) {
        // Success is also acceptable
        expect(result.data).toHaveProperty("booking");
      } else {
        // Should not be 401 (unauthorized)
        expect(result.status).not.toBe(401);
      }
    });
  });

  test.describe("GET /api/bookings/[uid]", () => {
    test("should get booking by UID (public access)", async () => {
      // First, get a booking UID from the bookings list
      const listResponse = await apiClient.fetch("/api/bookings");
      const listResult = await parseApiResponse(listResponse);

      if (listResult.data.bookings.length === 0) {
        console.log("No bookings found, skipping test");
        return;
      }

      const bookingUid = listResult.data.bookings[0].uid;

      // Access booking by UID without authentication (public access)
      const response = await fetch(
        `http://localhost:3000/api/bookings/${bookingUid}`,
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("booking");

      const booking = result.data.booking;
      expect(booking.uid).toBe(bookingUid);
      expect(booking).toHaveProperty("eventType");
      expect(booking).toHaveProperty("user");
      expect(booking.eventType).toHaveProperty("title");
      expect(booking.user).toHaveProperty("name");
    });

    test("should return 404 for non-existent booking UID", async () => {
      const response = await fetch(
        "http://localhost:3000/api/bookings/non-existent-uid",
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(404);
      expect(result.error).toHaveProperty("error", "not_found");
    });
  });

  test.describe("PATCH /api/bookings/[uid]", () => {
    test("should accept pending booking (host only)", async () => {
      // Find a pending booking
      const listResponse = await apiClient.fetch(
        "/api/bookings?status=PENDING",
      );
      const listResult = await parseApiResponse(listResponse);

      if (listResult.data.bookings.length === 0) {
        console.log("No pending bookings found, skipping test");
        return;
      }

      const pendingBooking = listResult.data.bookings[0];

      const response = await apiClient.fetch(
        `/api/bookings/${pendingBooking.uid}`,
        {
          method: "PATCH",
          body: JSON.stringify({ action: "accept" }),
        },
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data.booking.status).toBe("ACCEPTED");
      expect(result.data.message).toContain("accepted");
    });

    test("should reject pending booking (host only)", async () => {
      // Find a pending booking
      const listResponse = await apiClient.fetch(
        "/api/bookings?status=PENDING",
      );
      const listResult = await parseApiResponse(listResponse);

      if (listResult.data.bookings.length === 0) {
        console.log("No pending bookings found, skipping test");
        return;
      }

      const pendingBooking = listResult.data.bookings[0];

      const response = await apiClient.fetch(
        `/api/bookings/${pendingBooking.uid}`,
        {
          method: "PATCH",
          body: JSON.stringify({ action: "reject" }),
        },
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data.booking.status).toBe("REJECTED");
      expect(result.data.message).toContain("rejected");
    });

    test("should cancel accepted booking (host only)", async () => {
      // Find an accepted booking
      const listResponse = await apiClient.fetch(
        "/api/bookings?status=ACCEPTED",
      );
      const listResult = await parseApiResponse(listResponse);

      if (listResult.data.bookings.length === 0) {
        console.log("No accepted bookings found, skipping test");
        return;
      }

      const acceptedBooking = listResult.data.bookings[0];

      const response = await apiClient.fetch(
        `/api/bookings/${acceptedBooking.uid}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            action: "cancel",
            cancellationReason: "Host cancelled due to conflict",
          }),
        },
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data.booking.status).toBe("CANCELLED");
      expect(result.data.booking.cancellationReason).toBe(
        "Host cancelled due to conflict",
      );
      expect(result.data.message).toContain("cancelled");
    });

    test("should require valid action", async () => {
      const listResponse = await apiClient.fetch("/api/bookings");
      const listResult = await parseApiResponse(listResponse);

      if (listResult.data.bookings.length === 0) {
        console.log("No bookings found, skipping test");
        return;
      }

      const bookingUid = listResult.data.bookings[0].uid;

      const response = await apiClient.fetch(`/api/bookings/${bookingUid}`, {
        method: "PATCH",
        body: JSON.stringify({ action: "invalid-action" }),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation");
    });

    test("should prevent unauthorized access for accept/reject", async () => {
      // Find a PENDING booking specifically to avoid the "already cancelled/rejected"
      // check that runs before the auth check in the route handler.
      const listResponse = await apiClient.fetch(
        "/api/bookings?status=PENDING",
      );
      const listResult = await parseApiResponse(listResponse);

      if (listResult.data.bookings.length === 0) {
        console.log("No pending bookings found, skipping test");
        return;
      }

      const bookingUid = listResult.data.bookings[0].uid;

      // Try to accept without authentication
      const response = await fetch(
        `http://localhost:3000/api/bookings/${bookingUid}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "accept" }),
        },
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(401);
      expect(result.error).toHaveProperty("error", "unauthorized");
    });

    test("should prevent actions on already cancelled bookings", async () => {
      // Find a cancelled booking
      const listResponse = await apiClient.fetch(
        "/api/bookings?status=CANCELLED",
      );
      const listResult = await parseApiResponse(listResponse);

      if (listResult.data.bookings.length === 0) {
        console.log("No cancelled bookings found, skipping test");
        return;
      }

      const cancelledBooking = listResult.data.bookings[0];

      const response = await apiClient.fetch(
        `/api/bookings/${cancelledBooking.uid}`,
        {
          method: "PATCH",
          body: JSON.stringify({ action: "accept" }),
        },
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "invalid");
      expect(result.error.message).toContain("already cancelled");
    });

    test("should return 404 for non-existent booking", async () => {
      const response = await apiClient.fetch("/api/bookings/non-existent-uid", {
        method: "PATCH",
        body: JSON.stringify({ action: "accept" }),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(404);
      expect(result.error).toHaveProperty("error", "not_found");
    });
  });

  test.describe("Recurring bookings", () => {
    test("should create multiple bookings for recurring event", async () => {
      // First, get a recurring-enabled event type
      const eventTypesResponse = await apiClient.fetch("/api/event-types");
      const eventTypesResult = await parseApiResponse(eventTypesResponse);

      const recurringEventType = eventTypesResult.data.eventTypes.find(
        (et: any) => et.recurringEnabled && et.isActive,
      );

      if (!recurringEventType) {
        console.log("No recurring-enabled event types found, skipping test");
        return;
      }

      // Get available slots
      const futureDate = getFutureDate(14);
      const dateStr = formatDateString(futureDate);
      const slotsResponse = await apiClient.fetch(
        `/api/slots?eventTypeId=${recurringEventType.id}&startDate=${dateStr}&endDate=${dateStr}&timezone=America/New_York`,
      );
      const slotsResult = await parseApiResponse(slotsResponse);

      if (slotsResult.status !== 200 || slotsResult.data.slots.length === 0) {
        console.log("No available slots found, skipping test");
        return;
      }

      const availableSlot = slotsResult.data.slots[0];

      // Create recurring booking
      const bookingData = {
        eventTypeId: recurringEventType.id,
        startTime: availableSlot.time,
        attendeeName: "Recurring Test Attendee",
        attendeeEmail: `recurring-test-${Date.now()}@example.com`,
        attendeeTimezone: "America/New_York",
        recurringCount: 3,
      };

      const response = await apiClient.fetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify(bookingData),
      });
      const result = await parseApiResponse(response);

      if (result.status === 201) {
        expect(result.data).toHaveProperty("booking");
        expect(result.data).toHaveProperty("recurringCount");
        expect(result.data.recurringCount).toBe(3);

        const booking = result.data.booking;
        expect(booking).toHaveProperty("recurringEventId");
        expect(booking.recurringEventId).toBeTruthy();
      } else if (result.status === 409) {
        // Some recurring slots might not be available
        console.log("Recurring booking conflict, which is acceptable");
      }
    });
  });

  test.describe("Integration with slots validation", () => {
    test("should re-verify slot availability during booking", async () => {
      // This test simulates a race condition where a slot is booked
      // between when the user selects it and when they submit the booking

      const eventTypesResponse = await apiClient.fetch("/api/event-types");
      const eventTypesResult = await parseApiResponse(eventTypesResponse);
      const activeEventType = eventTypesResult.data.eventTypes.find(
        (et: any) => et.isActive,
      );

      if (!activeEventType) {
        console.log("No active event types found, skipping test");
        return;
      }

      // Try to book a time that might not be available
      // Using a time in the past should fail slot verification
      const pastTime = new Date();
      pastTime.setDate(pastTime.getDate() - 1); // Yesterday

      const bookingData = {
        eventTypeId: activeEventType.id,
        startTime: pastTime.toISOString(),
        attendeeName: "Test Attendee",
        attendeeEmail: `slot-test-${Date.now()}@example.com`,
        attendeeTimezone: "America/New_York",
      };

      const response = await apiClient.fetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify(bookingData),
      });
      const result = await parseApiResponse(response);

      // Should fail due to slot being unavailable (past time)
      expect(result.status).toBe(409);
      expect(result.error).toHaveProperty("error", "conflict");
      expect(result.error.message).toContain("no longer available");
    });
  });
});
