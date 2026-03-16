/**
 * Slots API E2E Tests
 * Tests slot calculation and availability via direct API calls
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

test.describe("Slots API", () => {
  let apiClient: Awaited<ReturnType<typeof createAuthenticatedApiClient>>;
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    apiClient = await createAuthenticatedApiClient(page);
  });

  test.describe("GET /api/slots", () => {
    test("should return available slots for valid event type", async () => {
      // Get an active event type first
      const eventTypesResponse = await apiClient.fetch("/api/event-types");
      const eventTypesResult = await parseApiResponse(eventTypesResponse);

      expect(eventTypesResult.status).toBe(200);
      const activeEventType = eventTypesResult.data.eventTypes.find(
        (et: any) => et.isActive
      );

      if (!activeEventType) {
        console.log("No active event types found, skipping test");
        return;
      }

      const startDate = formatDateString(getFutureDate(7));
      const endDate = formatDateString(getFutureDate(7));

      const response = await fetch(
        `http://localhost:3000/api/slots?eventTypeId=${activeEventType.id}&startDate=${startDate}&endDate=${endDate}&timezone=America/New_York`
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("slots");
      expect(Array.isArray(result.data.slots)).toBe(true);

      // Verify slot structure
      if (result.data.slots.length > 0) {
        const slot = result.data.slots[0];
        expect(slot).toHaveProperty("time");
        expect(slot).toHaveProperty("localTime");
        expect(slot).toHaveProperty("duration");

        // Verify time formats
        expect(slot.time).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/); // ISO format
        expect(slot.localTime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$/); // Local time with timezone

        // Duration should match event type
        expect(slot.duration).toBe(activeEventType.duration);

        // Time should be in future
        const slotTime = new Date(slot.time);
        expect(slotTime.getTime()).toBeGreaterThan(Date.now());
      }
    });

    test("should require all query parameters", async () => {
      // Missing eventTypeId
      const response1 = await fetch(
        "http://localhost:3000/api/slots?startDate=2024-12-01&endDate=2024-12-01&timezone=UTC"
      );
      const result1 = await parseApiResponse(response1);
      expect(result1.status).toBe(400);

      // Missing startDate
      const response2 = await fetch(
        "http://localhost:3000/api/slots?eventTypeId=test&endDate=2024-12-01&timezone=UTC"
      );
      const result2 = await parseApiResponse(response2);
      expect(result2.status).toBe(400);

      // Missing endDate
      const response3 = await fetch(
        "http://localhost:3000/api/slots?eventTypeId=test&startDate=2024-12-01&timezone=UTC"
      );
      const result3 = await parseApiResponse(response3);
      expect(result3.status).toBe(400);

      // Missing timezone
      const response4 = await fetch(
        "http://localhost:3000/api/slots?eventTypeId=test&startDate=2024-12-01&endDate=2024-12-01"
      );
      const result4 = await parseApiResponse(response4);
      expect(result4.status).toBe(400);
    });

    test("should validate date format", async () => {
      const response = await fetch(
        "http://localhost:3000/api/slots?eventTypeId=test&startDate=invalid-date&endDate=2024-12-01&timezone=UTC"
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation");
    });

    test("should validate date range", async () => {
      // End date before start date
      const response = await fetch(
        "http://localhost:3000/api/slots?eventTypeId=test&startDate=2024-12-31&endDate=2024-12-01&timezone=UTC"
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation");
      expect(result.error.message).toContain("Start date must be before");
    });

    test("should limit date range to 30 days", async () => {
      const startDate = formatDateString(getFutureDate(1));
      const endDate = formatDateString(getFutureDate(35)); // 34+ days apart

      const response = await fetch(
        `http://localhost:3000/api/slots?eventTypeId=test&startDate=${startDate}&endDate=${endDate}&timezone=UTC`
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation");
      expect(result.error.message).toContain("cannot exceed 30 days");
    });

    test("should validate timezone", async () => {
      const startDate = formatDateString(getFutureDate(1));
      const endDate = formatDateString(getFutureDate(1));

      const response = await fetch(
        `http://localhost:3000/api/slots?eventTypeId=test&startDate=${startDate}&endDate=${endDate}&timezone=Invalid/Timezone`
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation");
      expect(result.error.message).toContain("Invalid timezone");
    });

    test("should return empty slots for non-existent event type", async () => {
      const startDate = formatDateString(getFutureDate(7));
      const endDate = formatDateString(getFutureDate(7));

      const response = await fetch(
        `http://localhost:3000/api/slots?eventTypeId=non-existent-event&startDate=${startDate}&endDate=${endDate}&timezone=America/New_York`
      );
      const result = await parseApiResponse(response);

      // Should return 200 with empty slots for non-existent event types
      // (This is often preferred UX to avoid leaking information about event types)
      expect(result.status).toBe(200);
      expect(result.data.slots).toEqual([]);
    });

    test("should respect different timezones", async () => {
      // Get an active event type
      const eventTypesResponse = await apiClient.fetch("/api/event-types");
      const eventTypesResult = await parseApiResponse(eventTypesResponse);
      const activeEventType = eventTypesResult.data.eventTypes.find(
        (et: any) => et.isActive
      );

      if (!activeEventType) {
        console.log("No active event types found, skipping test");
        return;
      }

      const startDate = formatDateString(getFutureDate(7));
      const endDate = formatDateString(getFutureDate(7));

      // Get slots in different timezones
      const nyResponse = await fetch(
        `http://localhost:3000/api/slots?eventTypeId=${activeEventType.id}&startDate=${startDate}&endDate=${endDate}&timezone=America/New_York`
      );
      const nyResult = await parseApiResponse(nyResponse);

      const laResponse = await fetch(
        `http://localhost:3000/api/slots?eventTypeId=${activeEventType.id}&startDate=${startDate}&endDate=${endDate}&timezone=America/Los_Angeles`
      );
      const laResult = await parseApiResponse(laResponse);

      expect(nyResult.status).toBe(200);
      expect(laResult.status).toBe(200);

      // Both should have slots (assuming availability)
      if (nyResult.data.slots.length > 0 && laResult.data.slots.length > 0) {
        // The UTC times should be the same, but local times should differ
        const nySlot = nyResult.data.slots[0];
        const laSlot = laResult.data.slots.find(
          (slot: any) => slot.time === nySlot.time
        );

        if (laSlot) {
          expect(nySlot.time).toBe(laSlot.time); // Same UTC time
          expect(nySlot.localTime).not.toBe(laSlot.localTime); // Different local times
        }
      }
    });

    test("should respect event type duration", async () => {
      // Get multiple event types with different durations
      const eventTypesResponse = await apiClient.fetch("/api/event-types");
      const eventTypesResult = await parseApiResponse(eventTypesResponse);
      const eventTypes = eventTypesResult.data.eventTypes.filter(
        (et: any) => et.isActive
      );

      if (eventTypes.length < 2) {
        console.log("Need multiple event types for duration test, skipping");
        return;
      }

      const startDate = formatDateString(getFutureDate(14));
      const endDate = formatDateString(getFutureDate(14));

      // Get slots for different event types
      for (const eventType of eventTypes.slice(0, 2)) {
        const response = await fetch(
          `http://localhost:3000/api/slots?eventTypeId=${eventType.id}&startDate=${startDate}&endDate=${endDate}&timezone=America/New_York`
        );
        const result = await parseApiResponse(response);

        expect(result.status).toBe(200);

        // All slots should have the correct duration
        if (result.data.slots.length > 0) {
          const allCorrectDuration = result.data.slots.every(
            (slot: any) => slot.duration === eventType.duration
          );
          expect(allCorrectDuration).toBe(true);
        }
      }
    });

    test("should respect slot intervals", async () => {
      // Get an event type with custom slot interval
      const eventTypesResponse = await apiClient.fetch("/api/event-types");
      const eventTypesResult = await parseApiResponse(eventTypesResponse);
      const eventTypeWithInterval = eventTypesResult.data.eventTypes.find(
        (et: any) => et.isActive && et.slotInterval
      );

      if (!eventTypeWithInterval) {
        console.log("No event types with slot intervals found, skipping test");
        return;
      }

      const startDate = formatDateString(getFutureDate(7));
      const endDate = formatDateString(getFutureDate(7));

      const response = await fetch(
        `http://localhost:3000/api/slots?eventTypeId=${eventTypeWithInterval.id}&startDate=${startDate}&endDate=${endDate}&timezone=America/New_York`
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);

      // Verify slots are spaced according to slotInterval
      if (result.data.slots.length > 1) {
        const slot1 = new Date(result.data.slots[0].time);
        const slot2 = new Date(result.data.slots[1].time);
        const timeDiff = slot2.getTime() - slot1.getTime();
        const expectedInterval = eventTypeWithInterval.slotInterval * 60 * 1000; // Convert minutes to ms

        expect(timeDiff).toBe(expectedInterval);
      }
    });

    test("should exclude booked slots", async () => {
      // This test verifies that booked slots are not returned
      const eventTypesResponse = await apiClient.fetch("/api/event-types");
      const eventTypesResult = await parseApiResponse(eventTypesResponse);
      const activeEventType = eventTypesResult.data.eventTypes.find(
        (et: any) => et.isActive
      );

      if (!activeEventType) {
        console.log("No active event types found, skipping test");
        return;
      }

      // Get current bookings for this event type
      const bookingsResponse = await apiClient.fetch(
        `/api/bookings?eventTypeId=${activeEventType.id}&status=ACCEPTED`
      );
      const bookingsResult = await parseApiResponse(bookingsResponse);

      if (bookingsResult.status === 200 && bookingsResult.data.bookings.length > 0) {
        // Find a day with a booking
        const existingBooking = bookingsResult.data.bookings[0];
        const bookingDate = new Date(existingBooking.startTime);
        const dateStr = formatDateString(bookingDate);

        const response = await fetch(
          `http://localhost:3000/api/slots?eventTypeId=${activeEventType.id}&startDate=${dateStr}&endDate=${dateStr}&timezone=America/New_York`
        );
        const result = await parseApiResponse(response);

        expect(result.status).toBe(200);

        // The booked time should not appear in available slots
        const bookedTime = new Date(existingBooking.startTime);
        const hasBookedSlot = result.data.slots.some((slot: any) => {
          const slotTime = new Date(slot.time);
          return Math.abs(slotTime.getTime() - bookedTime.getTime()) < 60000; // Within 1 minute
        });

        expect(hasBookedSlot).toBe(false);
      }
    });

    test("should respect minimum notice period", async () => {
      // Get an event type with minimum notice
      const eventTypesResponse = await apiClient.fetch("/api/event-types");
      const eventTypesResult = await parseApiResponse(eventTypesResponse);
      const eventTypeWithNotice = eventTypesResult.data.eventTypes.find(
        (et: any) => et.isActive && et.minimumNotice > 0
      );

      if (!eventTypeWithNotice) {
        console.log("No event types with minimum notice found, skipping test");
        return;
      }

      // Try to get slots for today (should be blocked by minimum notice)
      const today = formatDateString(new Date());

      const response = await fetch(
        `http://localhost:3000/api/slots?eventTypeId=${eventTypeWithNotice.id}&startDate=${today}&endDate=${today}&timezone=America/New_York`
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);

      // Should have no slots due to minimum notice requirement
      expect(result.data.slots).toEqual([]);
    });

    test("should respect future limit", async () => {
      // Get an event type with future limit
      const eventTypesResponse = await apiClient.fetch("/api/event-types");
      const eventTypesResult = await parseApiResponse(eventTypesResponse);
      const eventTypeWithLimit = eventTypesResult.data.eventTypes.find(
        (et: any) => et.isActive && et.futureLimit
      );

      if (!eventTypeWithLimit) {
        console.log("No event types with future limit found, skipping test");
        return;
      }

      // Try to get slots way in the future (beyond future limit)
      const futureDate = getFutureDate(eventTypeWithLimit.futureLimit + 10);
      const dateStr = formatDateString(futureDate);

      const response = await fetch(
        `http://localhost:3000/api/slots?eventTypeId=${eventTypeWithLimit.id}&startDate=${dateStr}&endDate=${dateStr}&timezone=America/New_York`
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);

      // Should have no slots due to future limit
      expect(result.data.slots).toEqual([]);
    });

    test("should return cache headers", async () => {
      const eventTypesResponse = await apiClient.fetch("/api/event-types");
      const eventTypesResult = await parseApiResponse(eventTypesResponse);
      const activeEventType = eventTypesResult.data.eventTypes.find(
        (et: any) => et.isActive
      );

      if (!activeEventType) {
        console.log("No active event types found, skipping test");
        return;
      }

      const startDate = formatDateString(getFutureDate(7));
      const endDate = formatDateString(getFutureDate(7));

      const response = await fetch(
        `http://localhost:3000/api/slots?eventTypeId=${activeEventType.id}&startDate=${startDate}&endDate=${endDate}&timezone=America/New_York`
      );

      expect(response.status).toBe(200);

      // Check cache headers
      const cacheControl = response.headers.get("cache-control");
      expect(cacheControl).toBeTruthy();
      expect(cacheControl).toContain("public");
      expect(cacheControl).toContain("max-age=60");
    });

    test("should work with different schedule configurations", async () => {
      // Get event types that might have different schedules
      const eventTypesResponse = await apiClient.fetch("/api/event-types");
      const eventTypesResult = await parseApiResponse(eventTypesResponse);
      const eventTypesWithSchedules = eventTypesResult.data.eventTypes.filter(
        (et: any) => et.isActive && et.schedule
      );

      if (eventTypesWithSchedules.length === 0) {
        console.log("No event types with schedules found, skipping test");
        return;
      }

      const eventType = eventTypesWithSchedules[0];
      const startDate = formatDateString(getFutureDate(7));
      const endDate = formatDateString(getFutureDate(7));

      const response = await fetch(
        `http://localhost:3000/api/slots?eventTypeId=${eventType.id}&startDate=${startDate}&endDate=${endDate}&timezone=${eventType.schedule.timezone}`
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);

      // Slots should respect the schedule's timezone and availability
      if (result.data.slots.length > 0) {
        // All slots should be within the schedule's working hours
        // This is a complex validation that would require knowing the schedule details
        // For now, just verify we get valid slots
        const slot = result.data.slots[0];
        expect(slot.time).toBeTruthy();
        expect(slot.duration).toBe(eventType.duration);
      }
    });

    test("should handle no available slots gracefully", async () => {
      // Create a scenario with no available slots
      // Using a past date should result in no slots
      const pastDate = "2023-01-01";

      const eventTypesResponse = await apiClient.fetch("/api/event-types");
      const eventTypesResult = await parseApiResponse(eventTypesResponse);
      const activeEventType = eventTypesResult.data.eventTypes.find(
        (et: any) => et.isActive
      );

      if (!activeEventType) {
        console.log("No active event types found, skipping test");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/slots?eventTypeId=${activeEventType.id}&startDate=${pastDate}&endDate=${pastDate}&timezone=America/New_York`
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data.slots).toEqual([]);
    });

    test("should allow public access (no authentication required)", async () => {
      const eventTypesResponse = await apiClient.fetch("/api/event-types");
      const eventTypesResult = await parseApiResponse(eventTypesResponse);
      const activeEventType = eventTypesResult.data.eventTypes.find(
        (et: any) => et.isActive
      );

      if (!activeEventType) {
        console.log("No active event types found, skipping test");
        return;
      }

      const startDate = formatDateString(getFutureDate(7));
      const endDate = formatDateString(getFutureDate(7));

      // Make request without any authentication cookies
      const response = await fetch(
        `http://localhost:3000/api/slots?eventTypeId=${activeEventType.id}&startDate=${startDate}&endDate=${endDate}&timezone=America/New_York`
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("slots");
    });
  });

  test.describe("Slots algorithm validation", () => {
    test("should return slots in chronological order", async () => {
      const eventTypesResponse = await apiClient.fetch("/api/event-types");
      const eventTypesResult = await parseApiResponse(eventTypesResponse);
      const activeEventType = eventTypesResult.data.eventTypes.find(
        (et: any) => et.isActive
      );

      if (!activeEventType) {
        console.log("No active event types found, skipping test");
        return;
      }

      // Get slots for multiple days to ensure ordering
      const startDate = formatDateString(getFutureDate(7));
      const endDate = formatDateString(getFutureDate(9)); // 3 days

      const response = await fetch(
        `http://localhost:3000/api/slots?eventTypeId=${activeEventType.id}&startDate=${startDate}&endDate=${endDate}&timezone=America/New_York`
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);

      if (result.data.slots.length > 1) {
        // Verify slots are in chronological order
        for (let i = 1; i < result.data.slots.length; i++) {
          const prevTime = new Date(result.data.slots[i - 1].time);
          const currTime = new Date(result.data.slots[i].time);
          expect(currTime.getTime()).toBeGreaterThan(prevTime.getTime());
        }
      }
    });

    test("should not return overlapping slots", async () => {
      const eventTypesResponse = await apiClient.fetch("/api/event-types");
      const eventTypesResult = await parseApiResponse(eventTypesResponse);
      const activeEventType = eventTypesResult.data.eventTypes.find(
        (et: any) => et.isActive
      );

      if (!activeEventType) {
        console.log("No active event types found, skipping test");
        return;
      }

      const startDate = formatDateString(getFutureDate(7));
      const endDate = formatDateString(getFutureDate(7));

      const response = await fetch(
        `http://localhost:3000/api/slots?eventTypeId=${activeEventType.id}&startDate=${startDate}&endDate=${endDate}&timezone=America/New_York`
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);

      if (result.data.slots.length > 1) {
        // Check for overlaps
        for (let i = 1; i < result.data.slots.length; i++) {
          const prevSlot = result.data.slots[i - 1];
          const currSlot = result.data.slots[i];

          const prevStart = new Date(prevSlot.time);
          const prevEnd = new Date(prevStart.getTime() + prevSlot.duration * 60000);
          const currStart = new Date(currSlot.time);

          // Current slot should start after previous slot ends
          expect(currStart.getTime()).toBeGreaterThanOrEqual(prevEnd.getTime());
        }
      }
    });
  });
});