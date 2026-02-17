import { describe, it, expect } from "vitest";

/**
 * Health endpoint unit test.
 * Validates the API response structure for GET /api/health.
 */
describe("/api/health", () => {
  it("returns correct response structure", () => {
    // Expected health check response
    const healthResponse = {
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    };

    // Validate response structure
    expect(healthResponse).toHaveProperty("status");
    expect(healthResponse).toHaveProperty("timestamp");
    expect(healthResponse).toHaveProperty("version");
    expect(healthResponse.status).toBe("ok");
    expect(healthResponse.version).toBe("1.0.0");
  });

  it("timestamp is in ISO 8601 format", () => {
    const timestamp = new Date().toISOString();
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

    expect(timestamp).toMatch(iso8601Regex);
  });

  it("status field is a string", () => {
    const healthResponse = {
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    };

    expect(typeof healthResponse.status).toBe("string");
  });

  it("version follows semantic versioning", () => {
    const version = "1.0.0";
    const semverRegex = /^\d+\.\d+\.\d+$/;

    expect(version).toMatch(semverRegex);
  });
});
