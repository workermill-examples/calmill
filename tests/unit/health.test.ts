import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/health/route";

describe("/api/health", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns success response with correct structure", async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      status: "ok",
      timestamp: expect.any(String),
      version: "1.0.0",
    });

    // Validate timestamp format (ISO 8601)
    expect(() => new Date(data.timestamp)).not.toThrow();
    expect(new Date(data.timestamp).toISOString()).toBe(data.timestamp);
  });

  it("includes current timestamp", async () => {
    const beforeRequest = new Date().toISOString();
    const response = await GET();
    const afterRequest = new Date().toISOString();
    const data = await response.json();

    // Timestamp should be between before and after request
    expect(data.timestamp >= beforeRequest).toBe(true);
    expect(data.timestamp <= afterRequest).toBe(true);
  });

  it("returns consistent version", async () => {
    const response1 = await GET();
    const response2 = await GET();

    const data1 = await response1.json();
    const data2 = await response2.json();

    expect(data1.version).toBe("1.0.0");
    expect(data2.version).toBe("1.0.0");
    expect(data1.version).toBe(data2.version);
  });

  it("has correct response headers", async () => {
    const response = await GET();

    expect(response.headers.get("content-type")).toContain("application/json");
  });

  // Test for edge case: multiple concurrent requests
  it("handles concurrent requests correctly", async () => {
    const promises = Array(10).fill(null).map(() => GET());
    const responses = await Promise.all(promises);

    for (const response of responses) {
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.status).toBe("ok");
      expect(data.version).toBe("1.0.0");
      expect(data.timestamp).toBeDefined();
    }
  });
});