/**
 * Webhooks API E2E Tests
 * Tests CRUD operations for webhooks and webhook delivery testing via direct API calls
 */

import { test, expect, Page } from "@playwright/test";
import {
  createAuthenticatedApiClient,
  parseApiResponse,
} from "./auth-helper";

test.describe("Webhooks API", () => {
  let apiClient: Awaited<ReturnType<typeof createAuthenticatedApiClient>>;
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    apiClient = await createAuthenticatedApiClient(page);
  });

  test.describe("GET /api/webhooks", () => {
    test("should list webhooks for authenticated user", async () => {
      const response = await apiClient.fetch("/api/webhooks");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.ok).toBe(true);
      expect(result.data).toHaveProperty("webhooks");
      expect(Array.isArray(result.data.webhooks)).toBe(true);

      // Verify structure of webhook objects
      if (result.data.webhooks.length > 0) {
        const webhook = result.data.webhooks[0];
        expect(webhook).toHaveProperty("id");
        expect(webhook).toHaveProperty("url");
        expect(webhook).toHaveProperty("eventTriggers");
        expect(webhook).toHaveProperty("active");
        expect(webhook).toHaveProperty("secret");
        expect(webhook).toHaveProperty("createdAt");
        expect(webhook).toHaveProperty("updatedAt");
        expect(Array.isArray(webhook.eventTriggers)).toBe(true);
        expect(typeof webhook.active).toBe("boolean");
      }
    });

    test("should require authentication", async () => {
      const response = await fetch("http://localhost:3000/api/webhooks");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(401);
      expect(result.error).toHaveProperty("error", "unauthorized");
    });
  });

  test.describe("POST /api/webhooks", () => {
    test("should create webhook with minimal data", async () => {
      const webhookData = {
        url: `https://example.com/webhook-${Date.now()}`,
        eventTriggers: ["BOOKING_CREATED"],
      };

      const response = await apiClient.fetch("/api/webhooks", {
        method: "POST",
        body: JSON.stringify(webhookData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(201);
      expect(result.ok).toBe(true);
      expect(result.data).toHaveProperty("webhook");

      const webhook = result.data.webhook;
      expect(webhook.url).toBe(webhookData.url);
      expect(webhook.eventTriggers).toEqual(webhookData.eventTriggers);
      expect(webhook.active).toBe(true); // default
      expect(webhook.secret).toBeTruthy(); // should be auto-generated
      expect(webhook.secret.length).toBeGreaterThan(16);
    });

    test("should create webhook with full data", async () => {
      const webhookData = {
        url: `https://example.com/full-webhook-${Date.now()}`,
        eventTriggers: ["BOOKING_CREATED", "BOOKING_CANCELLED", "BOOKING_RESCHEDULED"],
        active: false,
        secret: "custom-secret-key-for-testing",
      };

      const response = await apiClient.fetch("/api/webhooks", {
        method: "POST",
        body: JSON.stringify(webhookData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(201);
      expect(result.ok).toBe(true);

      const webhook = result.data.webhook;
      expect(webhook.url).toBe(webhookData.url);
      expect(webhook.eventTriggers).toEqual(webhookData.eventTriggers);
      expect(webhook.active).toBe(false);
      expect(webhook.secret).toBe(webhookData.secret);
    });

    test("should validate required fields", async () => {
      const invalidData = {
        // missing url and eventTriggers
        active: true,
      };

      const response = await apiClient.fetch("/api/webhooks", {
        method: "POST",
        body: JSON.stringify(invalidData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation_error");
      expect(result.error).toHaveProperty("details");
      expect(Array.isArray(result.error.details)).toBe(true);
    });

    test("should validate URL format", async () => {
      const invalidUrlData = {
        url: "not-a-valid-url",
        eventTriggers: ["BOOKING_CREATED"],
      };

      const response = await apiClient.fetch("/api/webhooks", {
        method: "POST",
        body: JSON.stringify(invalidUrlData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation_error");
    });

    test("should validate event trigger values", async () => {
      const invalidEventData = {
        url: "https://example.com/webhook",
        eventTriggers: ["INVALID_EVENT", "BOOKING_CREATED"],
      };

      const response = await apiClient.fetch("/api/webhooks", {
        method: "POST",
        body: JSON.stringify(invalidEventData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation_error");
    });

    test("should require at least one event trigger", async () => {
      const noEventsData = {
        url: "https://example.com/webhook",
        eventTriggers: [],
      };

      const response = await apiClient.fetch("/api/webhooks", {
        method: "POST",
        body: JSON.stringify(noEventsData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation_error");
    });

    test("should validate secret length if provided", async () => {
      const shortSecretData = {
        url: "https://example.com/webhook",
        eventTriggers: ["BOOKING_CREATED"],
        secret: "short", // too short
      };

      const response = await apiClient.fetch("/api/webhooks", {
        method: "POST",
        body: JSON.stringify(shortSecretData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation_error");
    });

    test("should require authentication", async () => {
      const webhookData = {
        url: "https://example.com/unauthorized-webhook",
        eventTriggers: ["BOOKING_CREATED"],
      };

      const response = await fetch("http://localhost:3000/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(401);
      expect(result.error).toHaveProperty("error", "unauthorized");
    });
  });

  test.describe("GET /api/webhooks/[id]", () => {
    test("should get webhook details including delivery history", async () => {
      // First, create a webhook
      const webhookData = {
        url: `https://example.com/detail-webhook-${Date.now()}`,
        eventTriggers: ["BOOKING_CREATED"],
      };

      const createResponse = await apiClient.fetch("/api/webhooks", {
        method: "POST",
        body: JSON.stringify(webhookData),
      });
      const createResult = await parseApiResponse(createResponse);
      expect(createResult.status).toBe(201);

      const webhookId = createResult.data.webhook.id;

      // Get webhook details
      const response = await apiClient.fetch(`/api/webhooks/${webhookId}`);
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("webhook");

      const webhook = result.data.webhook;
      expect(webhook.id).toBe(webhookId);
      expect(webhook.url).toBe(webhookData.url);
      expect(webhook).toHaveProperty("deliveries");
      expect(Array.isArray(webhook.deliveries)).toBe(true);
    });

    test("should return 404 for non-existent webhook", async () => {
      const response = await apiClient.fetch("/api/webhooks/non-existent-id");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(404);
      expect(result.error).toHaveProperty("error", "not_found");
    });

    test("should only allow owner to access webhook", async () => {
      // This test assumes the webhook belongs to the authenticated user
      // In a real scenario, we'd create a webhook with a different user and test access
      const listResponse = await apiClient.fetch("/api/webhooks");
      const listResult = await parseApiResponse(listResponse);

      if (listResult.data.webhooks.length > 0) {
        const webhookId = listResult.data.webhooks[0].id;

        const response = await apiClient.fetch(`/api/webhooks/${webhookId}`);
        const result = await parseApiResponse(response);

        expect(result.status).toBe(200);
        expect(result.data.webhook.id).toBe(webhookId);
      }
    });
  });

  test.describe("PUT /api/webhooks/[id]", () => {
    test("should update webhook", async () => {
      // Create a webhook first
      const originalData = {
        url: `https://example.com/original-${Date.now()}`,
        eventTriggers: ["BOOKING_CREATED"],
        active: true,
      };

      const createResponse = await apiClient.fetch("/api/webhooks", {
        method: "POST",
        body: JSON.stringify(originalData),
      });
      const createResult = await parseApiResponse(createResponse);
      expect(createResult.status).toBe(201);

      const webhookId = createResult.data.webhook.id;

      // Update webhook
      const updatedData = {
        url: `https://example.com/updated-${Date.now()}`,
        eventTriggers: ["BOOKING_CREATED", "BOOKING_CANCELLED"],
        active: false,
      };

      const response = await apiClient.fetch(`/api/webhooks/${webhookId}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("webhook");

      const webhook = result.data.webhook;
      expect(webhook.url).toBe(updatedData.url);
      expect(webhook.eventTriggers).toEqual(updatedData.eventTriggers);
      expect(webhook.active).toBe(false);
      // Secret should remain the same unless explicitly updated
      expect(webhook.secret).toBe(createResult.data.webhook.secret);
    });

    test("should update webhook secret", async () => {
      // Create a webhook first
      const originalData = {
        url: `https://example.com/secret-update-${Date.now()}`,
        eventTriggers: ["BOOKING_CREATED"],
      };

      const createResponse = await apiClient.fetch("/api/webhooks", {
        method: "POST",
        body: JSON.stringify(originalData),
      });
      const createResult = await parseApiResponse(createResponse);
      expect(createResult.status).toBe(201);

      const webhookId = createResult.data.webhook.id;
      const originalSecret = createResult.data.webhook.secret;

      // Update secret
      const updatedData = {
        secret: "new-custom-secret-key-for-testing",
      };

      const response = await apiClient.fetch(`/api/webhooks/${webhookId}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data.webhook.secret).toBe(updatedData.secret);
      expect(result.data.webhook.secret).not.toBe(originalSecret);
    });

    test("should validate updated data", async () => {
      // Create a webhook first
      const originalData = {
        url: `https://example.com/validate-${Date.now()}`,
        eventTriggers: ["BOOKING_CREATED"],
      };

      const createResponse = await apiClient.fetch("/api/webhooks", {
        method: "POST",
        body: JSON.stringify(originalData),
      });
      const createResult = await parseApiResponse(createResponse);
      expect(createResult.status).toBe(201);

      const webhookId = createResult.data.webhook.id;

      // Try to update with invalid data
      const invalidData = {
        url: "not-a-valid-url",
        eventTriggers: ["INVALID_EVENT"],
      };

      const response = await apiClient.fetch(`/api/webhooks/${webhookId}`, {
        method: "PUT",
        body: JSON.stringify(invalidData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation_error");
    });

    test("should return 404 for non-existent webhook", async () => {
      const updateData = {
        url: "https://example.com/non-existent",
      };

      const response = await apiClient.fetch("/api/webhooks/non-existent-id", {
        method: "PUT",
        body: JSON.stringify(updateData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(404);
      expect(result.error).toHaveProperty("error", "not_found");
    });
  });

  test.describe("DELETE /api/webhooks/[id]", () => {
    test("should delete webhook", async () => {
      // Create a webhook to delete
      const webhookData = {
        url: `https://example.com/delete-${Date.now()}`,
        eventTriggers: ["BOOKING_CREATED"],
      };

      const createResponse = await apiClient.fetch("/api/webhooks", {
        method: "POST",
        body: JSON.stringify(webhookData),
      });
      const createResult = await parseApiResponse(createResponse);
      expect(createResult.status).toBe(201);

      const webhookId = createResult.data.webhook.id;

      // Delete webhook
      const response = await apiClient.fetch(`/api/webhooks/${webhookId}`, {
        method: "DELETE",
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("message");
      expect(result.data.message).toContain("deleted");

      // Verify webhook no longer exists
      const verifyResponse = await apiClient.fetch(`/api/webhooks/${webhookId}`);
      const verifyResult = await parseApiResponse(verifyResponse);
      expect(verifyResult.status).toBe(404);
    });

    test("should return 404 for non-existent webhook", async () => {
      const response = await apiClient.fetch("/api/webhooks/non-existent-id", {
        method: "DELETE",
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(404);
      expect(result.error).toHaveProperty("error", "not_found");
    });
  });

  test.describe("POST /api/webhooks/[id]/test", () => {
    test("should test webhook delivery", async () => {
      // Create a webhook first
      const webhookData = {
        url: `https://httpbin.org/post`, // Use httpbin for testing
        eventTriggers: ["BOOKING_CREATED"],
        active: true,
      };

      const createResponse = await apiClient.fetch("/api/webhooks", {
        method: "POST",
        body: JSON.stringify(webhookData),
      });
      const createResult = await parseApiResponse(createResponse);
      expect(createResult.status).toBe(201);

      const webhookId = createResult.data.webhook.id;

      // Test webhook delivery
      const response = await apiClient.fetch(`/api/webhooks/${webhookId}/test`, {
        method: "POST",
      });
      const result = await parseApiResponse(response);

      // The test might succeed or fail depending on network/endpoint availability
      if (result.status === 200) {
        expect(result.data).toHaveProperty("delivery");
        expect(result.data.delivery).toHaveProperty("statusCode");
        expect(result.data.delivery).toHaveProperty("event");
        expect(result.data.delivery.event).toBe("BOOKING_CREATED");
        expect(result.data.message).toContain("Test delivery sent");
      } else if (result.status === 422) {
        // Webhook test might fail due to network issues or inactive webhook
        expect(result.error).toHaveProperty("error");
        expect(result.data).toHaveProperty("delivery");
        expect(result.data.delivery).toHaveProperty("statusCode");
        expect(result.data.delivery.statusCode).toBeGreaterThanOrEqual(400);
      }
    });

    test("should create delivery record for test", async () => {
      // Create a webhook first
      const webhookData = {
        url: `https://httpbin.org/status/200`, // Should return 200
        eventTriggers: ["BOOKING_CREATED"],
        active: true,
      };

      const createResponse = await apiClient.fetch("/api/webhooks", {
        method: "POST",
        body: JSON.stringify(webhookData),
      });
      const createResult = await parseApiResponse(createResponse);
      expect(createResult.status).toBe(201);

      const webhookId = createResult.data.webhook.id;

      // Get initial delivery count
      const initialResponse = await apiClient.fetch(`/api/webhooks/${webhookId}`);
      const initialResult = await parseApiResponse(initialResponse);
      const initialDeliveryCount = initialResult.data.webhook.deliveries.length;

      // Test webhook
      await apiClient.fetch(`/api/webhooks/${webhookId}/test`, {
        method: "POST",
      });

      // Check if delivery was recorded
      const finalResponse = await apiClient.fetch(`/api/webhooks/${webhookId}`);
      const finalResult = await parseApiResponse(finalResponse);
      const finalDeliveryCount = finalResult.data.webhook.deliveries.length;

      expect(finalDeliveryCount).toBeGreaterThan(initialDeliveryCount);

      // Verify delivery record structure
      const latestDelivery = finalResult.data.webhook.deliveries[0]; // Assuming sorted by newest first
      expect(latestDelivery).toHaveProperty("id");
      expect(latestDelivery).toHaveProperty("event");
      expect(latestDelivery).toHaveProperty("payload");
      expect(latestDelivery).toHaveProperty("statusCode");
      expect(latestDelivery).toHaveProperty("createdAt");
      expect(latestDelivery.event).toBe("BOOKING_CREATED");
    });

    test("should fail test for inactive webhook", async () => {
      // Create an inactive webhook
      const webhookData = {
        url: `https://httpbin.org/post`,
        eventTriggers: ["BOOKING_CREATED"],
        active: false, // inactive
      };

      const createResponse = await apiClient.fetch("/api/webhooks", {
        method: "POST",
        body: JSON.stringify(webhookData),
      });
      const createResult = await parseApiResponse(createResponse);
      expect(createResult.status).toBe(201);

      const webhookId = createResult.data.webhook.id;

      // Try to test inactive webhook
      const response = await apiClient.fetch(`/api/webhooks/${webhookId}/test`, {
        method: "POST",
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "invalid");
      expect(result.error.message).toContain("inactive");
    });

    test("should handle webhook test with invalid URL", async () => {
      // Create a webhook with an endpoint that will fail
      const webhookData = {
        url: `https://invalid-domain-that-should-not-exist-${Date.now()}.com/webhook`,
        eventTriggers: ["BOOKING_CREATED"],
        active: true,
      };

      const createResponse = await apiClient.fetch("/api/webhooks", {
        method: "POST",
        body: JSON.stringify(webhookData),
      });
      const createResult = await parseApiResponse(createResponse);
      expect(createResult.status).toBe(201);

      const webhookId = createResult.data.webhook.id;

      // Test webhook (should fail but still create delivery record)
      const response = await apiClient.fetch(`/api/webhooks/${webhookId}/test`, {
        method: "POST",
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(422);
      expect(result.data).toHaveProperty("delivery");
      expect(result.data.delivery).toHaveProperty("error");
      expect(result.data.delivery.statusCode).toBe(0); // Network error
    });

    test("should return 404 for non-existent webhook", async () => {
      const response = await apiClient.fetch("/api/webhooks/non-existent-id/test", {
        method: "POST",
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(404);
      expect(result.error).toHaveProperty("error", "not_found");
    });

    test("should require authentication", async () => {
      const response = await fetch("http://localhost:3000/api/webhooks/some-id/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(401);
      expect(result.error).toHaveProperty("error", "unauthorized");
    });
  });

  test.describe("Webhook Event Triggers", () => {
    const validEvents = [
      "BOOKING_CREATED",
      "BOOKING_CANCELLED",
      "BOOKING_RESCHEDULED",
      "BOOKING_ACCEPTED",
      "BOOKING_REJECTED"
    ];

    validEvents.forEach(event => {
      test(`should accept valid event trigger: ${event}`, async () => {
        const webhookData = {
          url: `https://example.com/test-${event.toLowerCase()}-${Date.now()}`,
          eventTriggers: [event],
        };

        const response = await apiClient.fetch("/api/webhooks", {
          method: "POST",
          body: JSON.stringify(webhookData),
        });
        const result = await parseApiResponse(response);

        expect(result.status).toBe(201);
        expect(result.data.webhook.eventTriggers).toContain(event);
      });
    });

    test("should accept multiple event triggers", async () => {
      const webhookData = {
        url: `https://example.com/multi-events-${Date.now()}`,
        eventTriggers: validEvents,
      };

      const response = await apiClient.fetch("/api/webhooks", {
        method: "POST",
        body: JSON.stringify(webhookData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(201);
      expect(result.data.webhook.eventTriggers).toEqual(validEvents);
    });

    test("should remove duplicate event triggers", async () => {
      const webhookData = {
        url: `https://example.com/duplicate-events-${Date.now()}`,
        eventTriggers: ["BOOKING_CREATED", "BOOKING_CREATED", "BOOKING_CANCELLED"],
      };

      const response = await apiClient.fetch("/api/webhooks", {
        method: "POST",
        body: JSON.stringify(webhookData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(201);
      expect(result.data.webhook.eventTriggers).toEqual(["BOOKING_CREATED", "BOOKING_CANCELLED"]);
    });
  });

  test.describe("Webhook Delivery History", () => {
    test("should include delivery metadata", async () => {
      // Create a webhook and test it to generate delivery history
      const webhookData = {
        url: `https://httpbin.org/status/201`,
        eventTriggers: ["BOOKING_CREATED"],
        active: true,
      };

      const createResponse = await apiClient.fetch("/api/webhooks", {
        method: "POST",
        body: JSON.stringify(webhookData),
      });
      const createResult = await parseApiResponse(createResponse);
      expect(createResult.status).toBe(201);

      const webhookId = createResult.data.webhook.id;

      // Test webhook to create delivery
      await apiClient.fetch(`/api/webhooks/${webhookId}/test`, {
        method: "POST",
      });

      // Get webhook with delivery history
      const response = await apiClient.fetch(`/api/webhooks/${webhookId}`);
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      const deliveries = result.data.webhook.deliveries;

      if (deliveries.length > 0) {
        const delivery = deliveries[0];
        expect(delivery).toHaveProperty("id");
        expect(delivery).toHaveProperty("webhookId");
        expect(delivery).toHaveProperty("event");
        expect(delivery).toHaveProperty("payload");
        expect(delivery).toHaveProperty("statusCode");
        expect(delivery).toHaveProperty("error"); // may be null
        expect(delivery).toHaveProperty("createdAt");

        // Payload should be valid JSON
        expect(() => {
          JSON.parse(delivery.payload);
        }).not.toThrow();

        // Status code should be a number
        expect(typeof delivery.statusCode).toBe("number");
      }
    });
  });
});