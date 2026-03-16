/**
 * Event Types API E2E Tests
 * Tests CRUD operations for event types via direct API calls
 */

import { test, expect, Page } from "@playwright/test";
import {
  createAuthenticatedApiClient,
  parseApiResponse,
  testData,
} from "./auth-helper";

test.describe("Event Types API", () => {
  let apiClient: Awaited<ReturnType<typeof createAuthenticatedApiClient>>;
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    apiClient = await createAuthenticatedApiClient(page);
  });

  test.describe("GET /api/event-types", () => {
    test("should list event types for authenticated user", async () => {
      const response = await apiClient.fetch("/api/event-types");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.ok).toBe(true);
      expect(result.data).toHaveProperty("eventTypes");
      expect(Array.isArray(result.data.eventTypes)).toBe(true);

      // Should have seeded data
      expect(result.data.eventTypes.length).toBeGreaterThan(0);

      // Verify structure of event type objects
      const eventType = result.data.eventTypes[0];
      expect(eventType).toHaveProperty("id");
      expect(eventType).toHaveProperty("title");
      expect(eventType).toHaveProperty("slug");
      expect(eventType).toHaveProperty("duration");
      expect(eventType).toHaveProperty("isActive");
      expect(eventType).toHaveProperty("bookingCount");
    });

    test("should filter inactive event types by default", async () => {
      const response = await apiClient.fetch("/api/event-types");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      const activeEventTypes = result.data.eventTypes.filter((et: any) => et.isActive);
      expect(activeEventTypes.length).toBe(result.data.eventTypes.length);
    });

    test("should include inactive event types when requested", async () => {
      const response = await apiClient.fetch("/api/event-types?includeInactive=true");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      // Should include both active and inactive
      const hasInactive = result.data.eventTypes.some((et: any) => !et.isActive);
      expect(hasInactive).toBe(true);
    });

    test("should require authentication", async () => {
      const response = await fetch("http://localhost:3000/api/event-types");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(401);
      expect(result.error).toHaveProperty("error", "unauthorized");
    });
  });

  test.describe("POST /api/event-types", () => {
    test("should create event type with minimal data", async () => {
      const eventTypeData = {
        title: "Test Event Type",
        slug: `test-event-${Date.now()}`,
        duration: 30,
      };

      const response = await apiClient.fetch("/api/event-types", {
        method: "POST",
        body: JSON.stringify(eventTypeData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(201);
      expect(result.ok).toBe(true);
      expect(result.data).toHaveProperty("eventType");

      const eventType = result.data.eventType;
      expect(eventType.title).toBe(eventTypeData.title);
      expect(eventType.slug).toBe(eventTypeData.slug);
      expect(eventType.duration).toBe(eventTypeData.duration);
      expect(eventType.isActive).toBe(true); // default
      expect(eventType.color).toBe("#3B82F6"); // default
    });

    test("should create event type with full data", async () => {
      const eventTypeData = {
        title: "Full Test Event Type",
        slug: `full-test-event-${Date.now()}`,
        description: "A comprehensive test event type",
        duration: 60,
        isActive: true,
        requiresConfirmation: true,
        price: 5000, // $50.00
        currency: "USD",
        minimumNotice: 1440, // 24 hours
        beforeBuffer: 15,
        afterBuffer: 10,
        slotInterval: 30,
        maxBookingsPerDay: 5,
        maxBookingsPerWeek: 20,
        futureLimit: 60, // 60 days
        color: "#10B981",
        customQuestions: [
          {
            id: "question1",
            type: "text",
            label: "What is your company?",
            required: true,
          },
          {
            id: "question2",
            type: "textarea",
            label: "Additional notes",
            required: false,
            placeholder: "Optional notes...",
          },
        ],
        recurringEnabled: true,
        recurringFrequency: "weekly" as const,
      };

      const response = await apiClient.fetch("/api/event-types", {
        method: "POST",
        body: JSON.stringify(eventTypeData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(201);
      expect(result.ok).toBe(true);

      const eventType = result.data.eventType;
      expect(eventType.title).toBe(eventTypeData.title);
      expect(eventType.requiresConfirmation).toBe(true);
      expect(eventType.price).toBe(5000);
      expect(eventType.minimumNotice).toBe(1440);
      expect(eventType.recurringEnabled).toBe(true);
      expect(eventType.recurringFrequency).toBe("weekly");

      // Custom questions are stored as JSON string
      const customQuestions = typeof eventType.customQuestions === 'string'
        ? JSON.parse(eventType.customQuestions)
        : eventType.customQuestions;
      expect(customQuestions).toHaveLength(2);
      expect(customQuestions[0].label).toBe("What is your company?");
    });

    test("should validate required fields", async () => {
      const invalidData = {
        // missing title, slug, duration
        description: "Invalid event type",
      };

      const response = await apiClient.fetch("/api/event-types", {
        method: "POST",
        body: JSON.stringify(invalidData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation_error");
      expect(result.error).toHaveProperty("details");
      expect(Array.isArray(result.error.details)).toBe(true);
    });

    test("should validate slug format", async () => {
      const invalidSlugData = {
        title: "Test Event",
        slug: "Invalid Slug With Spaces!",
        duration: 30,
      };

      const response = await apiClient.fetch("/api/event-types", {
        method: "POST",
        body: JSON.stringify(invalidSlugData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation_error");
    });

    test("should reject duplicate slug for same user", async () => {
      const slug = `duplicate-test-${Date.now()}`;
      const eventTypeData = {
        title: "First Event Type",
        slug,
        duration: 30,
      };

      // Create first event type
      const response1 = await apiClient.fetch("/api/event-types", {
        method: "POST",
        body: JSON.stringify(eventTypeData),
      });
      const result1 = await parseApiResponse(response1);
      expect(result1.status).toBe(201);

      // Try to create second with same slug
      const response2 = await apiClient.fetch("/api/event-types", {
        method: "POST",
        body: JSON.stringify({
          ...eventTypeData,
          title: "Second Event Type",
        }),
      });
      const result2 = await parseApiResponse(response2);

      expect(result2.status).toBe(409);
      expect(result2.error).toHaveProperty("error", "conflict");
    });

    test("should validate duration limits", async () => {
      const invalidDurationData = {
        title: "Invalid Duration Event",
        slug: `invalid-duration-${Date.now()}`,
        duration: 600, // 10 hours - should be max 480 (8 hours)
      };

      const response = await apiClient.fetch("/api/event-types", {
        method: "POST",
        body: JSON.stringify(invalidDurationData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation_error");
    });

    test("should validate color format", async () => {
      const invalidColorData = {
        title: "Invalid Color Event",
        slug: `invalid-color-${Date.now()}`,
        duration: 30,
        color: "not-a-color",
      };

      const response = await apiClient.fetch("/api/event-types", {
        method: "POST",
        body: JSON.stringify(invalidColorData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation_error");
    });

    test("should require authentication", async () => {
      const eventTypeData = {
        title: "Unauthorized Event",
        slug: "unauthorized-event",
        duration: 30,
      };

      const response = await fetch("http://localhost:3000/api/event-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventTypeData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(401);
      expect(result.error).toHaveProperty("error", "unauthorized");
    });
  });

  test.describe("Integration with other endpoints", () => {
    test("should reference valid schedule when provided", async () => {
      // First, get a schedule ID from the user's schedules
      const schedulesResponse = await apiClient.fetch("/api/schedules");
      const schedulesResult = await parseApiResponse(schedulesResponse);

      expect(schedulesResult.status).toBe(200);
      const schedules = schedulesResult.data.schedules;
      expect(schedules.length).toBeGreaterThan(0);

      const scheduleId = schedules[0].id;

      // Create event type with valid schedule
      const eventTypeData = {
        title: "Event with Schedule",
        slug: `event-with-schedule-${Date.now()}`,
        duration: 30,
        scheduleId,
      };

      const response = await apiClient.fetch("/api/event-types", {
        method: "POST",
        body: JSON.stringify(eventTypeData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(201);
      expect(result.data.eventType.scheduleId).toBe(scheduleId);
      expect(result.data.eventType.schedule).toBeDefined();
    });

    test("should reject invalid schedule ID", async () => {
      const eventTypeData = {
        title: "Event with Invalid Schedule",
        slug: `event-invalid-schedule-${Date.now()}`,
        duration: 30,
        scheduleId: "invalid-schedule-id",
      };

      const response = await apiClient.fetch("/api/event-types", {
        method: "POST",
        body: JSON.stringify(eventTypeData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(404);
      expect(result.error).toHaveProperty("error", "not_found");
      expect(result.error).toHaveProperty("message", "Schedule not found");
    });
  });

  test.describe("Custom questions validation", () => {
    test("should validate custom question structure", async () => {
      const invalidCustomQuestions = {
        title: "Event with Invalid Questions",
        slug: `event-invalid-questions-${Date.now()}`,
        duration: 30,
        customQuestions: [
          {
            // missing id and type
            label: "Invalid question",
          },
        ],
      };

      const response = await apiClient.fetch("/api/event-types", {
        method: "POST",
        body: JSON.stringify(invalidCustomQuestions),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation_error");
    });

    test("should validate custom question types", async () => {
      const invalidQuestionType = {
        title: "Event with Invalid Question Type",
        slug: `event-invalid-type-${Date.now()}`,
        duration: 30,
        customQuestions: [
          {
            id: "q1",
            type: "invalid-type",
            label: "Question with invalid type",
          },
        ],
      };

      const response = await apiClient.fetch("/api/event-types", {
        method: "POST",
        body: JSON.stringify(invalidQuestionType),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation_error");
    });
  });
});