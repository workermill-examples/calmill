/**
 * API authentication helper for E2E tests
 * Provides authenticated fetch function using NextAuth session cookies
 */

import { Page, expect } from "@playwright/test";

interface AuthenticatedApiClient {
  fetch: (url: string, options?: RequestInit) => Promise<Response>;
  baseUrl: string;
  cookies: string;
}

/**
 * Creates an authenticated API client by logging in and extracting session cookies
 */
export async function createAuthenticatedApiClient(
  page: Page,
): Promise<AuthenticatedApiClient> {
  // Navigate to login page
  await page.goto("/login");

  // Fill in demo credentials and submit
  await page.fill('input[name="email"]', "demo@workermill.com");
  await page.fill('input[name="password"]', "demo1234");

  // Click the sign in button
  await page.click('button[type="submit"]');

  // Wait for navigation to dashboard (successful login)
  await expect(page).toHaveURL("/dashboard");

  // Verify we're actually logged in by checking for user menu or dashboard content
  await expect(page.locator("h1")).toContainText("Dashboard");

  // Get cookies from the browser context
  const cookies = await page.context().cookies();

  // Format cookies for HTTP requests
  const cookieString = cookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const baseUrl = "http://localhost:3000";

  return {
    baseUrl,
    cookies: cookieString,
    fetch: async (url: string, options: RequestInit = {}) => {
      const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

      const defaultOptions: RequestInit = {
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieString,
          ...options.headers,
        },
      };

      const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
          ...defaultOptions.headers,
          ...options.headers,
        },
      };

      return fetch(fullUrl, mergedOptions);
    },
  };
}

/**
 * Helper function to parse JSON response and handle errors
 */
export async function parseApiResponse<T = any>(
  response: Response,
): Promise<{
  status: number;
  ok: boolean;
  data: T | null;
  error: any;
}> {
  let data = null;
  let error = null;

  try {
    const text = await response.text();
    if (text) {
      const parsed = JSON.parse(text);
      if (response.ok) {
        data = parsed;
      } else {
        error = parsed;
      }
    }
  } catch (e) {
    if (!response.ok) {
      error = { message: `HTTP ${response.status}` };
    }
  }

  return {
    status: response.status,
    ok: response.ok,
    data,
    error,
  };
}

/**
 * Generate test data for various API endpoints
 */
export const testData = {
  eventType: {
    title: "API Test Event",
    slug: "api-test-event",
    description: "Test event type created by API tests",
    duration: 30,
    color: "#10B981",
  },

  schedule: {
    name: "API Test Schedule",
    timezone: "America/New_York",
    isDefault: false,
  },

  availability: {
    day: 1, // Monday
    startTime: "09:00",
    endTime: "17:00",
  },

  booking: {
    attendeeName: "Test Attendee",
    attendeeEmail: "test@example.com",
    attendeeTimezone: "America/New_York",
    attendeeNotes: "API test booking",
    location: "Video call",
  },
};

/**
 * Generate a future date for testing slots and bookings
 */
export function getFutureDate(daysFromNow: number = 7): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
}

/**
 * Format date as YYYY-MM-DD for API requests
 */
export function formatDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Generate a time slot for testing (ISO string)
 */
export function generateTimeSlot(
  date: Date,
  hour: number = 10,
  minute: number = 0,
): string {
  const slot = new Date(date);
  slot.setHours(hour, minute, 0, 0);
  return slot.toISOString();
}
