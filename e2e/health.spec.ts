import { test, expect } from "@playwright/test";

test.describe("Health Endpoint", () => {
  test("should return 200 status and correct JSON shape", async ({
    request,
  }) => {
    // Make request to health endpoint
    const response = await request.get("/api/health");

    // Verify response status
    expect(response.status()).toBe(200);

    // Parse JSON response
    const data = await response.json();

    // Verify JSON structure and content
    expect(data).toHaveProperty("status", "ok");
    expect(data).toHaveProperty("timestamp");

    // Verify timestamp is a valid ISO string
    expect(data.timestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    );

    // Verify timestamp is recent (within last 10 seconds)
    const timestampDate = new Date(data.timestamp);
    const now = new Date();
    const timeDiff = Math.abs(now.getTime() - timestampDate.getTime());
    expect(timeDiff).toBeLessThan(10000); // 10 seconds in milliseconds

    // Verify response headers
    expect(response.headers()["content-type"]).toContain("application/json");
  });

  test("should have correct response time", async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get("/api/health");
    const endTime = Date.now();

    // Health endpoint should be fast (under 1 second)
    expect(endTime - startTime).toBeLessThan(1000);
    expect(response.status()).toBe(200);
  });
});
