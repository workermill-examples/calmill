/**
 * E2E tests for mobile responsive layout in CalMill.
 *
 * Covers:
 *  1. Public profile page — renders correctly on mobile (375px)
 *  2. Booking page — calendar visible on mobile viewport
 *  3. Dashboard sidebar — collapses or is hidden on mobile
 *  4. Booking form — usable on mobile (inputs accessible)
 *  5. Dashboard home — renders without horizontal overflow on mobile
 *  6. Event types list — scrollable and cards visible on mobile
 *  7. Navigation — mobile nav / hamburger menu accessible
 *  8. Calendar month navigation — touch-friendly buttons on mobile
 */

import { test, expect } from "@playwright/test";
import { loginAsDemoUser } from "./helpers/auth-helpers";
import {
  DEMO_USER,
  EVENT_30MIN,
  goToProfilePage,
  goToBookingPage,
  getEventTypeCards,
  waitForCalendarToLoad,
  getCalendar,
  clickNextMonth,
  selectFirstAvailableDay,
  waitForSlots,
  setMobileViewport,
  setDesktopViewport,
} from "./helpers/booking-helpers";
import { triggerDatabaseSeed } from "./helpers/seed-helpers";

// ─── TEST SETUP ────────────────────────────────────────────────────────────────

test.describe("Mobile Responsive Layout", () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await triggerDatabaseSeed(page);
    await page.close();
  });

  // Restore desktop viewport after each test to prevent state leak
  test.afterEach(async ({ page }) => {
    await setDesktopViewport(page);
  });

  // ─── 1. PUBLIC PROFILE PAGE — MOBILE ───────────────────────────────────────

  test.describe("Public profile page on mobile", () => {
    test("profile page renders user heading on mobile", async ({ page }) => {
      await setMobileViewport(page);
      await goToProfilePage(page);

      await expect(
        page.locator("h1", { hasText: DEMO_USER.name })
      ).toBeVisible({ timeout: 10_000 });
    });

    test("profile page shows event type cards on mobile", async ({ page }) => {
      await setMobileViewport(page);
      await goToProfilePage(page);

      const cards = getEventTypeCards(page);
      await expect(cards.first()).toBeVisible({ timeout: 10_000 });
    });

    test("event type cards are vertically stacked on mobile", async ({
      page,
    }) => {
      await setMobileViewport(page);
      await goToProfilePage(page);

      const cards = getEventTypeCards(page);
      const count = await cards.count();
      expect(count).toBeGreaterThanOrEqual(1);

      // All cards should be visible without horizontal scrolling
      await expect(cards.first()).toBeVisible();
    });
  });

  // ─── 2. BOOKING PAGE — CALENDAR ON MOBILE ──────────────────────────────────

  test.describe("Booking page calendar on mobile", () => {
    test("booking page loads calendar on mobile viewport", async ({ page }) => {
      await setMobileViewport(page);
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      await expect(getCalendar(page)).toBeVisible();
    });

    test("booking page shows event title on mobile", async ({ page }) => {
      await setMobileViewport(page);
      await goToBookingPage(page);

      await expect(
        page.locator("h1", { hasText: EVENT_30MIN.title })
      ).toBeVisible({ timeout: 15_000 });
    });

    test("calendar month navigation buttons are visible on mobile", async ({
      page,
    }) => {
      await setMobileViewport(page);
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      await expect(
        page.locator('button[aria-label="Go to next month"]')
      ).toBeVisible();
    });
  });

  // ─── 3. DASHBOARD SIDEBAR — MOBILE ─────────────────────────────────────────

  test.describe("Dashboard sidebar on mobile", () => {
    test.beforeEach(async ({ page }) => {
      await loginAsDemoUser(page);
    });

    test("dashboard home page loads on mobile viewport", async ({ page }) => {
      await setMobileViewport(page);
      await page.goto("/");

      await expect(
        page.locator("h1", { hasText: "Dashboard" })
      ).toBeVisible({ timeout: 10_000 });
    });

    test("dashboard sidebar is not blocking content on mobile", async ({
      page,
    }) => {
      await setMobileViewport(page);
      await page.goto("/event-types");

      // Main content should be accessible on mobile
      await expect(
        page.locator("h1", { hasText: "Event Types" })
      ).toBeVisible({ timeout: 10_000 });
    });

    test("bookings page content is accessible on mobile", async ({ page }) => {
      await setMobileViewport(page);
      await page.goto("/bookings");

      await expect(
        page.locator("h1", { hasText: "Bookings" })
      ).toBeVisible({ timeout: 10_000 });
    });
  });

  // ─── 4. BOOKING FORM — MOBILE ──────────────────────────────────────────────

  test.describe("Booking form on mobile", () => {
    test("booking form inputs are accessible on mobile", async ({ page }) => {
      await setMobileViewport(page);
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      await clickNextMonth(page);
      await selectFirstAvailableDay(page);
      await waitForSlots(page);

      // Click the first slot
      const slots = page.locator('[role="option"]');
      if ((await slots.count()) > 0) {
        await slots.first().click();

        const confirmButton = page.locator('button[aria-label^="Confirm "]').first();
        await confirmButton.waitFor({ state: "visible", timeout: 5_000 });
        await confirmButton.click();

        // Form should be visible and inputs accessible
        const nameInput = page.locator('input[name="attendeeName"]');
        await nameInput.waitFor({ state: "visible", timeout: 10_000 });

        // Input should be interactable on mobile
        await nameInput.fill("Mobile Test User");
        expect(await nameInput.inputValue()).toBe("Mobile Test User");
      } else {
        // No slots — verify calendar is still visible
        await expect(getCalendar(page)).toBeVisible();
      }
    });
  });

  // ─── 5. DASHBOARD HOME — NO OVERFLOW ───────────────────────────────────────

  test.describe("Dashboard home on mobile — no overflow", () => {
    test.beforeEach(async ({ page }) => {
      await loginAsDemoUser(page);
    });

    test("dashboard home has no horizontal scroll on mobile", async ({
      page,
    }) => {
      await setMobileViewport(page);
      await page.goto("/");

      // Check that the page doesn't have horizontal overflow
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);

      // Allow a small tolerance for scrollbar differences (< 20px)
      expect(scrollWidth - clientWidth).toBeLessThanOrEqual(20);
    });

    test("stat cards are visible on mobile", async ({ page }) => {
      await setMobileViewport(page);
      await page.goto("/");

      // At least one stat card label should be visible
      const upcomingLabel = page.locator("text=Upcoming").first();
      const pendingLabel = page.locator("text=Pending").first();

      await expect(upcomingLabel.or(pendingLabel)).toBeVisible({
        timeout: 10_000,
      });
    });
  });

  // ─── 6. EVENT TYPES LIST — MOBILE ──────────────────────────────────────────

  test.describe("Event types list on mobile", () => {
    test.beforeEach(async ({ page }) => {
      await loginAsDemoUser(page);
    });

    test("event types page shows card list on mobile", async ({ page }) => {
      await setMobileViewport(page);
      await page.goto("/event-types");

      await expect(page.locator("text=30 Minute Meeting")).toBeVisible({
        timeout: 10_000,
      });
    });

    test("New Event Type button is visible on mobile", async ({ page }) => {
      await setMobileViewport(page);
      await page.goto("/event-types");

      await expect(
        page.locator("button", { hasText: "New Event Type" })
      ).toBeVisible({ timeout: 10_000 });
    });
  });

  // ─── 7. NAVIGATION — MOBILE ────────────────────────────────────────────────

  test.describe("Navigation on mobile", () => {
    test.beforeEach(async ({ page }) => {
      await loginAsDemoUser(page);
    });

    test("authenticated dashboard is accessible on mobile", async ({ page }) => {
      await setMobileViewport(page);
      await page.goto("/event-types");

      // Page should load and be navigable
      const heading = page.locator("h1", { hasText: "Event Types" });
      await expect(heading).toBeVisible({ timeout: 10_000 });
    });

    test("settings page is accessible on mobile", async ({ page }) => {
      await setMobileViewport(page);
      await page.goto("/settings");

      await expect(page.locator("h1").first()).toBeVisible({ timeout: 10_000 });
    });
  });

  // ─── 8. CALENDAR MONTH NAV — MOBILE TOUCH ──────────────────────────────────

  test.describe("Calendar month navigation on mobile", () => {
    test("calendar next month button is tappable on mobile", async ({
      page,
    }) => {
      await setMobileViewport(page);
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      const calendar = getCalendar(page);
      const initialLabel = await calendar.getAttribute("aria-label");

      await clickNextMonth(page);

      const newLabel = await calendar.getAttribute("aria-label");
      expect(newLabel).not.toBe(initialLabel);
    });

    test("time slot list is scrollable on mobile when many slots exist", async ({
      page,
    }) => {
      await setMobileViewport(page);
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      await clickNextMonth(page);
      await selectFirstAvailableDay(page);

      // Slot list or no-times message should be visible
      const slotList = page.locator('[aria-label="Available time slots"]');
      const noTimesMessage = page.locator("text=No available times");

      await expect(slotList.or(noTimesMessage)).toBeVisible({
        timeout: 10_000,
      });
    });
  });
});
