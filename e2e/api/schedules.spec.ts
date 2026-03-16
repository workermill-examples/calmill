/**
 * Schedules API E2E Tests
 * Tests CRUD operations for schedules, availabilities, and date overrides via direct API calls
 */

import { test, expect, Page } from "@playwright/test";
import {
  createAuthenticatedApiClient,
  parseApiResponse,
  testData,
  getFutureDate,
  formatDateString,
} from "./auth-helper";

test.describe("Schedules API", () => {
  let apiClient: Awaited<ReturnType<typeof createAuthenticatedApiClient>>;
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    apiClient = await createAuthenticatedApiClient(page);
  });

  test.describe("GET /api/schedules", () => {
    test("should list schedules for authenticated user", async () => {
      const response = await apiClient.fetch("/api/schedules");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.ok).toBe(true);
      expect(result.data).toHaveProperty("schedules");
      expect(Array.isArray(result.data.schedules)).toBe(true);

      // Should have seeded data
      expect(result.data.schedules.length).toBeGreaterThan(0);

      // Verify structure of schedule objects
      const schedule = result.data.schedules[0];
      expect(schedule).toHaveProperty("id");
      expect(schedule).toHaveProperty("name");
      expect(schedule).toHaveProperty("timezone");
      expect(schedule).toHaveProperty("isDefault");
      expect(schedule).toHaveProperty("availabilities");
      expect(schedule).toHaveProperty("dateOverrides");
      expect(schedule).toHaveProperty("eventTypeCount");
      expect(Array.isArray(schedule.availabilities)).toBe(true);
      expect(Array.isArray(schedule.dateOverrides)).toBe(true);
    });

    test("should order schedules with default first", async () => {
      const response = await apiClient.fetch("/api/schedules");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      const schedules = result.data.schedules;

      // Find default schedule
      const defaultScheduleIndex = schedules.findIndex((s: any) => s.isDefault);
      expect(defaultScheduleIndex).toBe(0); // Default should be first
    });

    test("should require authentication", async () => {
      const response = await fetch("http://localhost:3000/api/schedules");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(401);
      expect(result.error).toHaveProperty("error", "unauthorized");
    });
  });

  test.describe("POST /api/schedules", () => {
    test("should create schedule with minimal data", async () => {
      const scheduleData = {
        name: "Test Schedule",
        timezone: "America/New_York",
      };

      const response = await apiClient.fetch("/api/schedules", {
        method: "POST",
        body: JSON.stringify(scheduleData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(201);
      expect(result.ok).toBe(true);
      expect(result.data).toHaveProperty("schedule");

      const schedule = result.data.schedule;
      expect(schedule.name).toBe(scheduleData.name);
      expect(schedule.timezone).toBe(scheduleData.timezone);
      expect(schedule.isDefault).toBe(false); // default value
      expect(schedule.availabilities).toEqual([]);
      expect(schedule.dateOverrides).toEqual([]);
    });

    test("should create schedule as default", async () => {
      const scheduleData = {
        name: "New Default Schedule",
        timezone: "America/Los_Angeles",
        isDefault: true,
      };

      const response = await apiClient.fetch("/api/schedules", {
        method: "POST",
        body: JSON.stringify(scheduleData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(201);
      expect(result.data.schedule.isDefault).toBe(true);

      // Verify other schedules are no longer default
      const listResponse = await apiClient.fetch("/api/schedules");
      const listResult = await parseApiResponse(listResponse);

      const defaultSchedules = listResult.data.schedules.filter((s: any) => s.isDefault);
      expect(defaultSchedules).toHaveLength(1);
      expect(defaultSchedules[0].id).toBe(result.data.schedule.id);
    });

    test("should validate required fields", async () => {
      const invalidData = {
        // missing name and timezone
        isDefault: false,
      };

      const response = await apiClient.fetch("/api/schedules", {
        method: "POST",
        body: JSON.stringify(invalidData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation_error");
      expect(result.error).toHaveProperty("details");
    });

    test("should require authentication", async () => {
      const scheduleData = {
        name: "Unauthorized Schedule",
        timezone: "UTC",
      };

      const response = await fetch("http://localhost:3000/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(401);
      expect(result.error).toHaveProperty("error", "unauthorized");
    });
  });

  test.describe("GET /api/schedules/[id]", () => {
    test("should get specific schedule with details", async () => {
      // First, get a schedule ID
      const listResponse = await apiClient.fetch("/api/schedules");
      const listResult = await parseApiResponse(listResponse);
      const scheduleId = listResult.data.schedules[0].id;

      // Get specific schedule
      const response = await apiClient.fetch(`/api/schedules/${scheduleId}`);
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("schedule");

      const schedule = result.data.schedule;
      expect(schedule.id).toBe(scheduleId);
      expect(schedule).toHaveProperty("availabilities");
      expect(schedule).toHaveProperty("dateOverrides");
      expect(schedule).toHaveProperty("eventTypeCount");
    });

    test("should return 404 for non-existent schedule", async () => {
      const response = await apiClient.fetch("/api/schedules/non-existent-id");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(404);
      expect(result.error).toHaveProperty("error", "not_found");
    });

    test("should require authentication", async () => {
      const response = await fetch("http://localhost:3000/api/schedules/any-id");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(401);
      expect(result.error).toHaveProperty("error", "unauthorized");
    });
  });

  test.describe("PUT /api/schedules/[id]", () => {
    test("should update schedule basic fields", async () => {
      // Create a schedule first
      const createResponse = await apiClient.fetch("/api/schedules", {
        method: "POST",
        body: JSON.stringify({
          name: "Original Schedule",
          timezone: "UTC",
        }),
      });
      const createResult = await parseApiResponse(createResponse);
      const scheduleId = createResult.data.schedule.id;

      // Update the schedule
      const updateData = {
        name: "Updated Schedule",
        timezone: "America/New_York",
      };

      const response = await apiClient.fetch(`/api/schedules/${scheduleId}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data.schedule.name).toBe(updateData.name);
      expect(result.data.schedule.timezone).toBe(updateData.timezone);
    });

    test("should update schedule with availabilities", async () => {
      // Create a schedule first
      const createResponse = await apiClient.fetch("/api/schedules", {
        method: "POST",
        body: JSON.stringify({
          name: "Schedule with Availability",
          timezone: "UTC",
        }),
      });
      const createResult = await parseApiResponse(createResponse);
      const scheduleId = createResult.data.schedule.id;

      // Add availabilities
      const updateData = {
        availabilities: [
          {
            day: 1, // Monday
            startTime: "09:00",
            endTime: "17:00",
          },
          {
            day: 2, // Tuesday
            startTime: "10:00",
            endTime: "18:00",
          },
        ],
      };

      const response = await apiClient.fetch(`/api/schedules/${scheduleId}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data.schedule.availabilities).toHaveLength(2);

      const availabilities = result.data.schedule.availabilities;
      expect(availabilities[0].day).toBe(1);
      expect(availabilities[0].startTime).toBe("09:00");
      expect(availabilities[0].endTime).toBe("17:00");
      expect(availabilities[1].day).toBe(2);
    });

    test("should validate time ranges in availabilities", async () => {
      // Create a schedule first
      const createResponse = await apiClient.fetch("/api/schedules", {
        method: "POST",
        body: JSON.stringify({
          name: "Invalid Time Schedule",
          timezone: "UTC",
        }),
      });
      const createResult = await parseApiResponse(createResponse);
      const scheduleId = createResult.data.schedule.id;

      // Try to add invalid availability (end before start)
      const updateData = {
        availabilities: [
          {
            day: 1,
            startTime: "18:00",
            endTime: "09:00", // Invalid: end before start
          },
        ],
      };

      const response = await apiClient.fetch(`/api/schedules/${scheduleId}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation_error");
      expect(result.error.message).toContain("Start time must be before end time");
    });

    test("should return 404 for non-existent schedule", async () => {
      const updateData = {
        name: "Updated Name",
      };

      const response = await apiClient.fetch("/api/schedules/non-existent-id", {
        method: "PUT",
        body: JSON.stringify(updateData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(404);
      expect(result.error).toHaveProperty("error", "not_found");
    });

    test("should require authentication", async () => {
      const updateData = { name: "Updated Name" };

      const response = await fetch("http://localhost:3000/api/schedules/any-id", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(401);
      expect(result.error).toHaveProperty("error", "unauthorized");
    });
  });

  test.describe("DELETE /api/schedules/[id]", () => {
    test("should delete unused schedule", async () => {
      // Create a schedule first
      const createResponse = await apiClient.fetch("/api/schedules", {
        method: "POST",
        body: JSON.stringify({
          name: "Schedule to Delete",
          timezone: "UTC",
          isDefault: false,
        }),
      });
      const createResult = await parseApiResponse(createResponse);
      const scheduleId = createResult.data.schedule.id;

      // Delete the schedule
      const response = await apiClient.fetch(`/api/schedules/${scheduleId}`, {
        method: "DELETE",
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data.message).toContain("deleted successfully");

      // Verify it's deleted
      const getResponse = await apiClient.fetch(`/api/schedules/${scheduleId}`);
      const getResult = await parseApiResponse(getResponse);
      expect(getResult.status).toBe(404);
    });

    test("should prevent deletion of schedule with event types", async () => {
      // Get a schedule that likely has event types (from seed data)
      const listResponse = await apiClient.fetch("/api/schedules");
      const listResult = await parseApiResponse(listResponse);

      // Find a schedule with event types
      const scheduleWithEventTypes = listResult.data.schedules.find(
        (s: any) => s.eventTypeCount > 0
      );

      if (scheduleWithEventTypes) {
        const response = await apiClient.fetch(
          `/api/schedules/${scheduleWithEventTypes.id}`,
          { method: "DELETE" }
        );
        const result = await parseApiResponse(response);

        expect(result.status).toBe(409);
        expect(result.error).toHaveProperty("error", "conflict");
        expect(result.error.message).toContain("used by event types");
      }
    });

    test("should return 404 for non-existent schedule", async () => {
      const response = await apiClient.fetch("/api/schedules/non-existent-id", {
        method: "DELETE",
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(404);
      expect(result.error).toHaveProperty("error", "not_found");
    });

    test("should require authentication", async () => {
      const response = await fetch("http://localhost:3000/api/schedules/any-id", {
        method: "DELETE",
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(401);
      expect(result.error).toHaveProperty("error", "unauthorized");
    });
  });

  test.describe("GET /api/schedules/[id]/overrides", () => {
    test("should list date overrides for schedule", async () => {
      // Get a schedule ID
      const listResponse = await apiClient.fetch("/api/schedules");
      const listResult = await parseApiResponse(listResponse);
      const scheduleId = listResult.data.schedules[0].id;

      const response = await apiClient.fetch(
        `/api/schedules/${scheduleId}/overrides`
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("overrides");
      expect(Array.isArray(result.data.overrides)).toBe(true);
    });

    test("should filter overrides by date range", async () => {
      // Get a schedule ID
      const listResponse = await apiClient.fetch("/api/schedules");
      const listResult = await parseApiResponse(listResponse);
      const scheduleId = listResult.data.schedules[0].id;

      const startDate = formatDateString(getFutureDate(1));
      const endDate = formatDateString(getFutureDate(7));

      const response = await apiClient.fetch(
        `/api/schedules/${scheduleId}/overrides?startDate=${startDate}&endDate=${endDate}`
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("overrides");
    });

    test("should return 404 for non-existent schedule", async () => {
      const response = await apiClient.fetch(
        "/api/schedules/non-existent-id/overrides"
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(404);
      expect(result.error).toHaveProperty("error", "not_found");
    });

    test("should require authentication", async () => {
      const response = await fetch(
        "http://localhost:3000/api/schedules/any-id/overrides"
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(401);
      expect(result.error).toHaveProperty("error", "unauthorized");
    });
  });

  test.describe("POST /api/schedules/[id]/overrides", () => {
    test("should create available date override", async () => {
      // Get a schedule ID
      const listResponse = await apiClient.fetch("/api/schedules");
      const listResult = await parseApiResponse(listResponse);
      const scheduleId = listResult.data.schedules[0].id;

      const futureDate = formatDateString(getFutureDate(3));
      const overrideData = {
        date: futureDate,
        startTime: "10:00",
        endTime: "16:00",
        isUnavailable: false,
      };

      const response = await apiClient.fetch(
        `/api/schedules/${scheduleId}/overrides`,
        {
          method: "POST",
          body: JSON.stringify(overrideData),
        }
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(201);
      expect(result.data).toHaveProperty("override");

      const override = result.data.override;
      expect(override.startTime).toBe("10:00");
      expect(override.endTime).toBe("16:00");
      expect(override.isUnavailable).toBe(false);
    });

    test("should create unavailable date override", async () => {
      // Get a schedule ID
      const listResponse = await apiClient.fetch("/api/schedules");
      const listResult = await parseApiResponse(listResponse);
      const scheduleId = listResult.data.schedules[0].id;

      const futureDate = formatDateString(getFutureDate(5));
      const overrideData = {
        date: futureDate,
        isUnavailable: true,
      };

      const response = await apiClient.fetch(
        `/api/schedules/${scheduleId}/overrides`,
        {
          method: "POST",
          body: JSON.stringify(overrideData),
        }
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(201);
      expect(result.data.override.isUnavailable).toBe(true);
      expect(result.data.override.startTime).toBeNull();
      expect(result.data.override.endTime).toBeNull();
    });

    test("should validate date format", async () => {
      // Get a schedule ID
      const listResponse = await apiClient.fetch("/api/schedules");
      const listResult = await parseApiResponse(listResponse);
      const scheduleId = listResult.data.schedules[0].id;

      const overrideData = {
        date: "invalid-date",
        startTime: "10:00",
        endTime: "16:00",
      };

      const response = await apiClient.fetch(
        `/api/schedules/${scheduleId}/overrides`,
        {
          method: "POST",
          body: JSON.stringify(overrideData),
        }
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation_error");
    });

    test("should prevent duplicate overrides for same date", async () => {
      // Get a schedule ID
      const listResponse = await apiClient.fetch("/api/schedules");
      const listResult = await parseApiResponse(listResponse);
      const scheduleId = listResult.data.schedules[0].id;

      const futureDate = formatDateString(getFutureDate(10));
      const overrideData = {
        date: futureDate,
        startTime: "10:00",
        endTime: "16:00",
        isUnavailable: false,
      };

      // Create first override
      const response1 = await apiClient.fetch(
        `/api/schedules/${scheduleId}/overrides`,
        {
          method: "POST",
          body: JSON.stringify(overrideData),
        }
      );
      const result1 = await parseApiResponse(response1);
      expect(result1.status).toBe(201);

      // Try to create second override for same date
      const response2 = await apiClient.fetch(
        `/api/schedules/${scheduleId}/overrides`,
        {
          method: "POST",
          body: JSON.stringify(overrideData),
        }
      );
      const result2 = await parseApiResponse(response2);

      expect(result2.status).toBe(409);
      expect(result2.error).toHaveProperty("error", "conflict");
      expect(result2.error.message).toContain("already exists");
    });

    test("should prevent overrides for past dates", async () => {
      // Get a schedule ID
      const listResponse = await apiClient.fetch("/api/schedules");
      const listResult = await parseApiResponse(listResponse);
      const scheduleId = listResult.data.schedules[0].id;

      const pastDate = "2023-01-01";
      const overrideData = {
        date: pastDate,
        startTime: "10:00",
        endTime: "16:00",
      };

      const response = await apiClient.fetch(
        `/api/schedules/${scheduleId}/overrides`,
        {
          method: "POST",
          body: JSON.stringify(overrideData),
        }
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation_error");
      expect(result.error.message).toContain("past dates");
    });

    test("should validate time constraints", async () => {
      // Get a schedule ID
      const listResponse = await apiClient.fetch("/api/schedules");
      const listResult = await parseApiResponse(listResponse);
      const scheduleId = listResult.data.schedules[0].id;

      const futureDate = formatDateString(getFutureDate(15));
      const invalidOverrideData = {
        date: futureDate,
        startTime: "16:00",
        endTime: "10:00", // End before start
        isUnavailable: false,
      };

      const response = await apiClient.fetch(
        `/api/schedules/${scheduleId}/overrides`,
        {
          method: "POST",
          body: JSON.stringify(invalidOverrideData),
        }
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation_error");
    });

    test("should return 404 for non-existent schedule", async () => {
      const overrideData = {
        date: formatDateString(getFutureDate(1)),
        startTime: "10:00",
        endTime: "16:00",
      };

      const response = await apiClient.fetch(
        "/api/schedules/non-existent-id/overrides",
        {
          method: "POST",
          body: JSON.stringify(overrideData),
        }
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(404);
      expect(result.error).toHaveProperty("error", "not_found");
    });

    test("should require authentication", async () => {
      const overrideData = {
        date: formatDateString(getFutureDate(1)),
        startTime: "10:00",
        endTime: "16:00",
      };

      const response = await fetch(
        "http://localhost:3000/api/schedules/any-id/overrides",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(overrideData),
        }
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(401);
      expect(result.error).toHaveProperty("error", "unauthorized");
    });
  });
});