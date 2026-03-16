import { test as base, expect } from "@playwright/test";

/**
 * Auth fixture for Playwright tests
 * Provides an authenticated page with the demo user logged in
 */

export const test = base.extend<{
  authenticatedPage: typeof base.prototype.page;
}>({
  authenticatedPage: async ({ page }, use) => {
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

    // Provide the authenticated page to the test
    await use(page);
  },
});

export { expect } from "@playwright/test";
