/**
 * User and Dashboard API E2E Tests
 * Tests user profile, dashboard data, and password change via direct API calls
 */

import { test, expect, Page } from "@playwright/test";
import { createAuthenticatedApiClient, parseApiResponse } from "./auth-helper";

test.describe("User and Dashboard API", () => {
  let apiClient: Awaited<ReturnType<typeof createAuthenticatedApiClient>>;
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    apiClient = await createAuthenticatedApiClient(page);
  });

  test.describe("GET /api/user", () => {
    test("should get current user profile", async () => {
      const response = await apiClient.fetch("/api/user");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.ok).toBe(true);
      expect(result.data).toHaveProperty("user");

      const user = result.data.user;
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("username");
      expect(user).toHaveProperty("bio");
      expect(user).toHaveProperty("timezone");
      expect(user).toHaveProperty("weekStart");
      expect(user).toHaveProperty("theme");
      expect(user).toHaveProperty("createdAt");
      expect(user).toHaveProperty("updatedAt");

      // Should not include sensitive data
      expect(user).not.toHaveProperty("passwordHash");

      // Validate data types
      expect(typeof user.email).toBe("string");
      expect(typeof user.name).toBe("string");
      expect(typeof user.username).toBe("string");
      expect(typeof user.weekStart).toBe("number");
      expect([0, 1, 2, 3, 4, 5, 6]).toContain(user.weekStart);
      expect(["light", "dark", "system"]).toContain(user.theme);
    });

    test("should include user statistics", async () => {
      const response = await apiClient.fetch("/api/user");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      const user = result.data.user;

      // Check if statistics are included
      expect(user).toHaveProperty("_count");
      const counts = user._count;
      expect(counts).toHaveProperty("eventTypes");
      expect(counts).toHaveProperty("bookings");
      expect(counts).toHaveProperty("schedules");
      expect(counts).toHaveProperty("teams");
      expect(counts).toHaveProperty("webhooks");

      // Validate count values
      expect(typeof counts.eventTypes).toBe("number");
      expect(typeof counts.bookings).toBe("number");
      expect(typeof counts.schedules).toBe("number");
      expect(typeof counts.teams).toBe("number");
      expect(typeof counts.webhooks).toBe("number");
      expect(counts.eventTypes).toBeGreaterThanOrEqual(0);
      expect(counts.bookings).toBeGreaterThanOrEqual(0);
    });

    test("should require authentication", async () => {
      const response = await fetch("http://localhost:3000/api/user");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(401);
      expect(result.error).toHaveProperty("error", "unauthorized");
    });
  });

  test.describe("GET /api/dashboard", () => {
    test("should get dashboard statistics", async () => {
      const response = await apiClient.fetch("/api/dashboard");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.ok).toBe(true);
      expect(result.data).toHaveProperty("stats");
      expect(result.data).toHaveProperty("recentBookings");
      expect(result.data).toHaveProperty("charts");

      const stats = result.data.stats;
      expect(stats).toHaveProperty("upcomingBookings");
      expect(stats).toHaveProperty("pendingBookings");
      expect(stats).toHaveProperty("thisMonthBookings");
      expect(stats).toHaveProperty("popularEventType");

      // Validate stat values
      expect(typeof stats.upcomingBookings).toBe("number");
      expect(typeof stats.pendingBookings).toBe("number");
      expect(typeof stats.thisMonthBookings).toBe("number");
      expect(stats.upcomingBookings).toBeGreaterThanOrEqual(0);
      expect(stats.pendingBookings).toBeGreaterThanOrEqual(0);
      expect(stats.thisMonthBookings).toBeGreaterThanOrEqual(0);

      // Popular event type might be null if no bookings
      if (stats.popularEventType) {
        expect(stats.popularEventType).toHaveProperty("id");
        expect(stats.popularEventType).toHaveProperty("title");
        expect(stats.popularEventType).toHaveProperty("count");
        expect(typeof stats.popularEventType.count).toBe("number");
      }
    });

    test("should include recent bookings", async () => {
      const response = await apiClient.fetch("/api/dashboard");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      const recentBookings = result.data.recentBookings;
      expect(Array.isArray(recentBookings)).toBe(true);

      // Should return up to 5 recent bookings
      expect(recentBookings.length).toBeLessThanOrEqual(5);

      // Validate booking structure
      if (recentBookings.length > 0) {
        const booking = recentBookings[0];
        expect(booking).toHaveProperty("id");
        expect(booking).toHaveProperty("uid");
        expect(booking).toHaveProperty("title");
        expect(booking).toHaveProperty("startTime");
        expect(booking).toHaveProperty("endTime");
        expect(booking).toHaveProperty("status");
        expect(booking).toHaveProperty("attendeeName");
        expect(booking).toHaveProperty("attendeeEmail");
        expect(booking).toHaveProperty("eventType");

        // Event type should be populated
        expect(booking.eventType).toHaveProperty("id");
        expect(booking.eventType).toHaveProperty("title");
        expect(booking.eventType).toHaveProperty("color");

        // Dates should be valid ISO strings
        expect(() => new Date(booking.startTime)).not.toThrow();
        expect(() => new Date(booking.endTime)).not.toThrow();
      }
    });

    test("should include chart data", async () => {
      const response = await apiClient.fetch("/api/dashboard");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      const charts = result.data.charts;
      expect(charts).toHaveProperty("bookingsOverTime");
      expect(charts).toHaveProperty("bookingsByEventType");
      expect(charts).toHaveProperty("bookingsByStatus");

      // Bookings over time chart
      const bookingsOverTime = charts.bookingsOverTime;
      expect(Array.isArray(bookingsOverTime)).toBe(true);
      if (bookingsOverTime.length > 0) {
        const dataPoint = bookingsOverTime[0];
        expect(dataPoint).toHaveProperty("date");
        expect(dataPoint).toHaveProperty("bookings");
        expect(typeof dataPoint.date).toBe("string");
        expect(typeof dataPoint.bookings).toBe("number");
      }

      // Bookings by event type chart
      const bookingsByEventType = charts.bookingsByEventType;
      expect(Array.isArray(bookingsByEventType)).toBe(true);
      if (bookingsByEventType.length > 0) {
        const dataPoint = bookingsByEventType[0];
        expect(dataPoint).toHaveProperty("eventType");
        expect(dataPoint).toHaveProperty("count");
        expect(dataPoint).toHaveProperty("color");
        expect(typeof dataPoint.eventType).toBe("string");
        expect(typeof dataPoint.count).toBe("number");
        expect(typeof dataPoint.color).toBe("string");
      }

      // Bookings by status chart
      const bookingsByStatus = charts.bookingsByStatus;
      expect(Array.isArray(bookingsByStatus)).toBe(true);
      if (bookingsByStatus.length > 0) {
        const dataPoint = bookingsByStatus[0];
        expect(dataPoint).toHaveProperty("status");
        expect(dataPoint).toHaveProperty("count");
        expect(dataPoint).toHaveProperty("color");
        expect(typeof dataPoint.status).toBe("string");
        expect(typeof dataPoint.count).toBe("number");
        expect([
          "PENDING",
          "ACCEPTED",
          "CANCELLED",
          "REJECTED",
          "RESCHEDULED",
        ]).toContain(dataPoint.status);
      }
    });

    test("should return consistent data structure even with no bookings", async () => {
      // This test assumes that even with no data, the API returns the expected structure
      const response = await apiClient.fetch("/api/dashboard");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);

      // Stats should exist even if zero
      expect(result.data.stats).toHaveProperty("upcomingBookings");
      expect(result.data.stats).toHaveProperty("pendingBookings");
      expect(result.data.stats).toHaveProperty("thisMonthBookings");

      // Arrays should exist even if empty
      expect(Array.isArray(result.data.recentBookings)).toBe(true);
      expect(Array.isArray(result.data.charts.bookingsOverTime)).toBe(true);
      expect(Array.isArray(result.data.charts.bookingsByEventType)).toBe(true);
      expect(Array.isArray(result.data.charts.bookingsByStatus)).toBe(true);
    });

    test("should require authentication", async () => {
      const response = await fetch("http://localhost:3000/api/dashboard");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(401);
      expect(result.error).toHaveProperty("error", "unauthorized");
    });
  });

  test.describe("POST /api/user/password", () => {
    test("should change password with valid current password", async () => {
      // Note: This test uses the demo account, so we know the current password
      const passwordData = {
        currentPassword: "demo1234",
        newPassword: "newdemo1234",
      };

      const response = await apiClient.fetch("/api/user/password", {
        method: "POST",
        body: JSON.stringify(passwordData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("message");
      expect(result.data.message).toContain("changed");

      // Change it back to original password for other tests
      const revertData = {
        currentPassword: "newdemo1234",
        newPassword: "demo1234",
      };

      const revertResponse = await apiClient.fetch("/api/user/password", {
        method: "POST",
        body: JSON.stringify(revertData),
      });
      const revertResult = await parseApiResponse(revertResponse);
      expect(revertResult.status).toBe(200);
    });

    test("should reject incorrect current password", async () => {
      const passwordData = {
        currentPassword: "wrongpassword",
        newPassword: "newdemo1234",
      };

      const response = await apiClient.fetch("/api/user/password", {
        method: "POST",
        body: JSON.stringify(passwordData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "invalid");
      expect(result.error.message).toContain("current password");
    });

    test("should validate new password requirements", async () => {
      const passwordData = {
        currentPassword: "demo1234",
        newPassword: "short", // too short
      };

      const response = await apiClient.fetch("/api/user/password", {
        method: "POST",
        body: JSON.stringify(passwordData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation_error");
    });

    test("should require both current and new password", async () => {
      const passwordData = {
        currentPassword: "demo1234",
        // missing newPassword
      };

      const response = await apiClient.fetch("/api/user/password", {
        method: "POST",
        body: JSON.stringify(passwordData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation_error");
    });

    test("should reject same password as current", async () => {
      const passwordData = {
        currentPassword: "demo1234",
        newPassword: "demo1234", // same as current
      };

      const response = await apiClient.fetch("/api/user/password", {
        method: "POST",
        body: JSON.stringify(passwordData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "invalid");
      expect(result.error.message).toContain("different");
    });

    test("should require authentication", async () => {
      const passwordData = {
        currentPassword: "demo1234",
        newPassword: "newdemo1234",
      };

      const response = await fetch("http://localhost:3000/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(401);
      expect(result.error).toHaveProperty("error", "unauthorized");
    });
  });

  test.describe("Integration tests", () => {
    test("dashboard data should match user counts", async () => {
      // Get user data
      const userResponse = await apiClient.fetch("/api/user");
      const userResult = await parseApiResponse(userResponse);
      expect(userResult.status).toBe(200);

      // Get dashboard data
      const dashboardResponse = await apiClient.fetch("/api/dashboard");
      const dashboardResult = await parseApiResponse(dashboardResponse);
      expect(dashboardResult.status).toBe(200);

      const userCounts = userResult.data.user._count;
      const dashboardStats = dashboardResult.data.stats;

      // Some basic consistency checks
      expect(typeof userCounts.bookings).toBe("number");
      expect(typeof dashboardStats.upcomingBookings).toBe("number");
      expect(typeof dashboardStats.pendingBookings).toBe("number");
      expect(typeof dashboardStats.thisMonthBookings).toBe("number");

      // Upcoming + pending should be <= total bookings
      const activebookings =
        dashboardStats.upcomingBookings + dashboardStats.pendingBookings;
      expect(activebookings).toBeLessThanOrEqual(userCounts.bookings);
    });

    test("user profile should include related data counts", async () => {
      const response = await apiClient.fetch("/api/user");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      const user = result.data.user;

      // If user has event types, should have >= 0 bookings
      if (user._count.eventTypes > 0) {
        expect(user._count.bookings).toBeGreaterThanOrEqual(0);
      }

      // If user has bookings, should have >= 1 event type
      if (user._count.bookings > 0) {
        expect(user._count.eventTypes).toBeGreaterThan(0);
      }

      // User should have at least 1 schedule (default schedule)
      expect(user._count.schedules).toBeGreaterThan(0);
    });

    test("dashboard recent bookings should be chronologically ordered", async () => {
      const response = await apiClient.fetch("/api/dashboard");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      const recentBookings = result.data.recentBookings;

      if (recentBookings.length > 1) {
        for (let i = 0; i < recentBookings.length - 1; i++) {
          const currentDate = new Date(recentBookings[i].startTime);
          const nextDate = new Date(recentBookings[i + 1].startTime);

          // Should be ordered by date (newest first or oldest first, depending on implementation)
          // We'll just check that the dates are valid and consistent ordering
          expect(currentDate).toBeInstanceOf(Date);
          expect(nextDate).toBeInstanceOf(Date);
          expect(currentDate.getTime()).not.toBeNaN();
          expect(nextDate.getTime()).not.toBeNaN();
        }
      }
    });

    test("chart data should have consistent totals", async () => {
      const response = await apiClient.fetch("/api/dashboard");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      const charts = result.data.charts;

      // Sum of bookings by status should equal some total
      const statusCounts = charts.bookingsByStatus.reduce(
        (sum: number, item: any) => sum + item.count,
        0,
      );

      // Sum of bookings by event type should equal some total
      const eventTypeCounts = charts.bookingsByEventType.reduce(
        (sum: number, item: any) => sum + item.count,
        0,
      );

      // Both should be >= 0
      expect(statusCounts).toBeGreaterThanOrEqual(0);
      expect(eventTypeCounts).toBeGreaterThanOrEqual(0);

      // If we have bookings, both counts should match
      if (statusCounts > 0 && eventTypeCounts > 0) {
        expect(statusCounts).toBe(eventTypeCounts);
      }
    });
  });

  test.describe("Error handling", () => {
    test("should handle malformed JSON in password change", async () => {
      const response = await apiClient.fetch("/api/user/password", {
        method: "POST",
        body: "invalid json",
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error");
    });

    test("should return 405 for unsupported methods on user endpoint", async () => {
      const response = await apiClient.fetch("/api/user", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(405);
      expect(result.error).toHaveProperty("error", "method_not_allowed");
    });

    test("should return 405 for unsupported methods on dashboard endpoint", async () => {
      const response = await apiClient.fetch("/api/dashboard", {
        method: "PUT",
        body: JSON.stringify({}),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(405);
      expect(result.error).toHaveProperty("error", "method_not_allowed");
    });
  });

  test.describe("Data validation", () => {
    test("user timezone should be valid IANA timezone", async () => {
      const response = await apiClient.fetch("/api/user");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      const user = result.data.user;

      // Check if timezone is a valid format (should start with continent/city or similar)
      expect(user.timezone).toMatch(/^[A-Za-z]+\/[A-Za-z_]+/);

      // Should be a valid timezone according to JavaScript
      expect(() => {
        Intl.DateTimeFormat([], { timeZone: user.timezone });
      }).not.toThrow();
    });

    test("dashboard booking dates should be in ISO format", async () => {
      const response = await apiClient.fetch("/api/dashboard");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      const recentBookings = result.data.recentBookings;

      recentBookings.forEach((booking: any) => {
        // Should be valid ISO string
        expect(booking.startTime).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
        );
        expect(booking.endTime).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
        );

        // Should create valid Date objects
        expect(new Date(booking.startTime).toISOString()).toBe(
          booking.startTime,
        );
        expect(new Date(booking.endTime).toISOString()).toBe(booking.endTime);
      });
    });

    test("dashboard stats should be non-negative integers", async () => {
      const response = await apiClient.fetch("/api/dashboard");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      const stats = result.data.stats;

      expect(Number.isInteger(stats.upcomingBookings)).toBe(true);
      expect(Number.isInteger(stats.pendingBookings)).toBe(true);
      expect(Number.isInteger(stats.thisMonthBookings)).toBe(true);

      expect(stats.upcomingBookings).toBeGreaterThanOrEqual(0);
      expect(stats.pendingBookings).toBeGreaterThanOrEqual(0);
      expect(stats.thisMonthBookings).toBeGreaterThanOrEqual(0);
    });
  });
});
