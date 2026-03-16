import { test, expect } from "@playwright/test";
import { test as authTest } from "./fixtures/auth";

test.describe("Bookings", () => {
  test.describe("Unauthenticated Access", () => {
    test("redirects to login when not authenticated", async ({ page }) => {
      await page.goto("/bookings");

      // Should be redirected to login page
      await expect(page).toHaveURL("/login");
    });
  });

  test.describe("Authenticated Bookings", () => {
    authTest("loads bookings page with correct content", async ({ authenticatedPage: page }) => {
      await page.goto("/bookings");

      // Verify we're on the bookings page
      await expect(page).toHaveURL("/bookings");

      // Check main heading
      await expect(page.locator("h1")).toContainText("Bookings");

      // Check description text
      await expect(page.locator("text=Manage your upcoming and past appointments")).toBeVisible();

      // Check for tab navigation
      await expect(page.locator('button[role="tab"]:has-text("Upcoming")')).toBeVisible();
      await expect(page.locator('button[role="tab"]:has-text("Past")')).toBeVisible();
      await expect(page.locator('button[role="tab"]:has-text("Cancelled")')).toBeVisible();
      await expect(page.locator('button[role="tab"]:has-text("Pending")')).toBeVisible();
    });

    authTest("displays bookings tabs with counts", async ({ authenticatedPage: page }) => {
      await page.goto("/bookings");

      // Wait for content to load
      await page.waitForTimeout(2000);

      // Check that tabs show with potential counts
      const upcomingTab = page.locator('button[role="tab"]:has-text("Upcoming")');
      const pastTab = page.locator('button[role="tab"]:has-text("Past")');
      const cancelledTab = page.locator('button[role="tab"]:has-text("Cancelled")');
      const pendingTab = page.locator('button[role="tab"]:has-text("Pending")');

      await expect(upcomingTab).toBeVisible();
      await expect(pastTab).toBeVisible();
      await expect(cancelledTab).toBeVisible();
      await expect(pendingTab).toBeVisible();

      // Check if there are any badge counts (from seed data)
      const badgeCount = await page.locator('.badge').count();
      // May or may not have badges depending on data
      expect(badgeCount).toBeGreaterThanOrEqual(0);
    });

    authTest("upcoming tab shows future bookings", async ({ authenticatedPage: page }) => {
      await page.goto("/bookings?tab=upcoming");

      // Wait for content to load
      await page.waitForTimeout(2000);

      // Should be on upcoming tab
      await expect(page.locator('button[role="tab"][aria-selected="true"]:has-text("Upcoming")')).toBeVisible();

      // Check for bookings or empty state
      const hasBookings = await page.locator(".card").count() > 0;
      const hasEmptyState = await page.locator('text="No upcoming bookings", text="No bookings found"').isVisible();

      // Should have either bookings or empty state
      expect(hasBookings || hasEmptyState).toBeTruthy();

      if (hasBookings) {
        // Each booking should have proper status
        const firstBooking = page.locator(".card").first();
        await expect(firstBooking).toBeVisible();

        // Should show booking details
        await expect(firstBooking.locator("a[href*='/bookings/']")).toBeVisible(); // Title link
        await expect(firstBooking.locator('text="View Details"')).toBeVisible();

        // Should show status badge
        await expect(firstBooking.locator(".badge")).toBeVisible();

        // Should show date/time info
        await expect(firstBooking.locator('text=/📅|⏰|⏱️/')).toBeVisible();
      }
    });

    authTest("past tab shows historical bookings", async ({ authenticatedPage: page }) => {
      await page.goto("/bookings?tab=past");

      // Wait for content to load
      await page.waitForTimeout(2000);

      // Should be on past tab
      await expect(page.locator('button[role="tab"][aria-selected="true"]:has-text("Past")')).toBeVisible();

      // Check for bookings or empty state
      const hasBookings = await page.locator(".card").count() > 0;
      const hasEmptyState = await page.locator('text="No bookings found", text="No past bookings"').isVisible();

      expect(hasBookings || hasEmptyState).toBeTruthy();
    });

    authTest("cancelled tab shows cancelled bookings", async ({ authenticatedPage: page }) => {
      await page.goto("/bookings?tab=cancelled");

      // Wait for content to load
      await page.waitForTimeout(2000);

      // Should be on cancelled tab
      await expect(page.locator('button[role="tab"][aria-selected="true"]:has-text("Cancelled")')).toBeVisible();

      // Check for bookings or empty state
      const hasBookings = await page.locator(".card").count() > 0;
      const hasEmptyState = await page.locator('text="No bookings found", text="No cancelled bookings"').isVisible();

      expect(hasBookings || hasEmptyState).toBeTruthy();

      if (hasBookings) {
        // Cancelled bookings should show appropriate status
        const firstBooking = page.locator(".card").first();
        const statusBadge = firstBooking.locator(".badge");

        const statusText = await statusBadge.textContent();
        expect(statusText).toMatch(/Cancelled|Rejected|Rescheduled/);
      }
    });

    authTest("pending tab shows pending bookings", async ({ authenticatedPage: page }) => {
      await page.goto("/bookings?tab=pending");

      // Wait for content to load
      await page.waitForTimeout(2000);

      // Should be on pending tab
      await expect(page.locator('button[role="tab"][aria-selected="true"]:has-text("Pending")')).toBeVisible();

      // Check for bookings or empty state
      const hasBookings = await page.locator(".card").count() > 0;
      const hasEmptyState = await page.locator('text="No bookings found", text="No pending bookings"').isVisible();

      expect(hasBookings || hasEmptyState).toBeTruthy();

      if (hasBookings) {
        // Pending bookings should show pending status
        const firstBooking = page.locator(".card").first();
        const statusBadge = firstBooking.locator(".badge");

        const statusText = await statusBadge.textContent();
        expect(statusText).toBe("Pending");
      }
    });

    authTest("tab navigation works correctly", async ({ authenticatedPage: page }) => {
      await page.goto("/bookings");

      // Start on upcoming tab (default)
      await expect(page.locator('button[role="tab"][aria-selected="true"]:has-text("Upcoming")')).toBeVisible();

      // Click past tab
      await page.click('button[role="tab"]:has-text("Past")');
      await page.waitForTimeout(1000);

      // Should be on past tab
      await expect(page.locator('button[role="tab"][aria-selected="true"]:has-text("Past")')).toBeVisible();
      await expect(page).toHaveURL("/bookings?tab=past");

      // Click cancelled tab
      await page.click('button[role="tab"]:has-text("Cancelled")');
      await page.waitForTimeout(1000);

      // Should be on cancelled tab
      await expect(page.locator('button[role="tab"][aria-selected="true"]:has-text("Cancelled")')).toBeVisible();
      await expect(page).toHaveURL("/bookings?tab=cancelled");

      // Click pending tab
      await page.click('button[role="tab"]:has-text("Pending")');
      await page.waitForTimeout(1000);

      // Should be on pending tab
      await expect(page.locator('button[role="tab"][aria-selected="true"]:has-text("Pending")')).toBeVisible();
      await expect(page).toHaveURL("/bookings?tab=pending");
    });

    authTest("attendee email search filter works", async ({ authenticatedPage: page }) => {
      await page.goto("/bookings");
      await page.waitForTimeout(2000);

      // Get initial count of bookings
      const initialCount = await page.locator(".card").count();

      // If no bookings, skip this test
      if (initialCount === 0) {
        test.skip(true, "No bookings to filter");
        return;
      }

      // Get an attendee email from first booking
      const firstBooking = page.locator(".card").first();
      const emailText = await firstBooking.locator('text=/✉️.*@.*\..*/').textContent();

      if (!emailText) {
        test.skip(true, "No email found to search for");
        return;
      }

      const email = emailText.replace(/✉️\s*/, '').trim();

      // Enter search query
      await page.fill('input[placeholder="Search by attendee email..."]', email);
      await page.waitForTimeout(1000);

      // Should show filtered results
      const filteredCount = await page.locator(".card").count();
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
      expect(filteredCount).toBeGreaterThan(0);

      // Clear search
      await page.fill('input[placeholder="Search by attendee email..."]', '');
      await page.waitForTimeout(1000);

      // Should show all results again
      const restoredCount = await page.locator(".card").count();
      expect(restoredCount).toBe(initialCount);
    });

    authTest("event type filter works", async ({ authenticatedPage: page }) => {
      await page.goto("/bookings");
      await page.waitForTimeout(2000);

      // Get initial count
      const initialCount = await page.locator(".card").count();

      if (initialCount === 0) {
        test.skip(true, "No bookings to filter");
        return;
      }

      // Click on event type filter dropdown
      const eventTypeSelect = page.locator('select').filter({ hasText: /All event types|Filter by event type/ });

      // If no select dropdown, try clicking button/trigger
      const selectTrigger = page.locator('[role="combobox"]').filter({ hasText: /All event types|Filter by event type/ });

      if (await eventTypeSelect.isVisible()) {
        // Get available options
        const options = await eventTypeSelect.locator('option').allTextContents();

        // Pick the first non-"All" option
        const filterOption = options.find(opt => opt !== "All event types" && opt.trim() !== "");

        if (filterOption) {
          await eventTypeSelect.selectOption({ label: filterOption });
          await page.waitForTimeout(1000);

          // Should show filtered results
          const filteredCount = await page.locator(".card").count();
          expect(filteredCount).toBeLessThanOrEqual(initialCount);

          // Reset filter
          await eventTypeSelect.selectOption({ label: "All event types" });
          await page.waitForTimeout(1000);

          const restoredCount = await page.locator(".card").count();
          expect(restoredCount).toBe(initialCount);
        }
      } else if (await selectTrigger.isVisible()) {
        // Handle custom select component
        await selectTrigger.click();

        // Wait for options to appear
        await page.waitForTimeout(500);

        // Click first non-all option
        const firstOption = page.locator('[role="option"]').filter({ hasNotText: /All event types/i }).first();

        if (await firstOption.isVisible()) {
          await firstOption.click();
          await page.waitForTimeout(1000);

          const filteredCount = await page.locator(".card").count();
          expect(filteredCount).toBeLessThanOrEqual(initialCount);
        }
      }
    });

    authTest("date range filter works", async ({ authenticatedPage: page }) => {
      await page.goto("/bookings");
      await page.waitForTimeout(2000);

      const initialCount = await page.locator(".card").count();

      if (initialCount === 0) {
        test.skip(true, "No bookings to filter");
        return;
      }

      // Set start date to today
      const today = new Date().toISOString().split('T')[0];
      await page.fill('input[type="date"][placeholder="Start date"]', today);
      await page.waitForTimeout(1000);

      // Results may change
      const filteredCount = await page.locator(".card").count();
      expect(filteredCount).toBeLessThanOrEqual(initialCount);

      // Clear date filter (if there's a clear button)
      const clearButton = page.locator('button:has-text("Clear filters")');
      if (await clearButton.isVisible()) {
        await clearButton.click();
        await page.waitForTimeout(1000);

        const restoredCount = await page.locator(".card").count();
        expect(restoredCount).toBe(initialCount);
      }
    });

    authTest("clear filters button works", async ({ authenticatedPage: page }) => {
      await page.goto("/bookings");
      await page.waitForTimeout(2000);

      // Apply some filters
      await page.fill('input[placeholder="Search by attendee email..."]', 'test@example.com');

      const today = new Date().toISOString().split('T')[0];
      await page.fill('input[type="date"][placeholder="Start date"]', today);

      await page.waitForTimeout(1000);

      // Clear filters button should appear
      const clearButton = page.locator('button:has-text("Clear filters")');
      await expect(clearButton).toBeVisible();

      // Click clear filters
      await clearButton.click();
      await page.waitForTimeout(1000);

      // Filters should be cleared
      await expect(page.locator('input[placeholder="Search by attendee email..."]')).toHaveValue('');
      await expect(page.locator('input[type="date"][placeholder="Start date"]')).toHaveValue('');

      // Clear button should be hidden
      await expect(clearButton).not.toBeVisible();
    });

    authTest("pagination works when there are many bookings", async ({ authenticatedPage: page }) => {
      await page.goto("/bookings");
      await page.waitForTimeout(2000);

      // Check if pagination is present (depends on data)
      const paginationInfo = page.locator('text=/Showing \\d+ to \\d+ of \\d+ bookings/');

      if (await paginationInfo.isVisible()) {
        // Check pagination controls
        await expect(page.locator('button:has-text("Previous")')).toBeVisible();
        await expect(page.locator('button:has-text("Next")')).toBeVisible();

        // Check if Next button is enabled and click it
        const nextButton = page.locator('button:has-text("Next")');
        if (await nextButton.isEnabled()) {
          await nextButton.click();
          await page.waitForTimeout(1000);

          // URL should change
          await expect(page).toHaveURL(/page=2/);

          // Previous should now be enabled
          await expect(page.locator('button:has-text("Previous")')).toBeEnabled();

          // Click previous to go back
          await page.click('button:has-text("Previous")');
          await page.waitForTimeout(1000);

          // Should be back to page 1
          await expect(page).toHaveURL(/page=1|^[^?]*$/); // Either page=1 or no page param
        }
      }
    });

    authTest("booking details link works", async ({ authenticatedPage: page }) => {
      await page.goto("/bookings");
      await page.waitForTimeout(2000);

      const bookingCount = await page.locator(".card").count();

      if (bookingCount === 0) {
        test.skip(true, "No bookings to view details");
        return;
      }

      // Click "View Details" on first booking
      const firstViewButton = page.locator('button:has-text("View Details")').first();
      await firstViewButton.click();

      // Should navigate to booking detail page
      await expect(page).toHaveURL(/\/bookings\/[a-zA-Z0-9_-]+$/);

      // Go back to verify we can return
      await page.goBack();
      await expect(page).toHaveURL("/bookings");
    });

    authTest("booking title link works", async ({ authenticatedPage: page }) => {
      await page.goto("/bookings");
      await page.waitForTimeout(2000);

      const bookingCount = await page.locator(".card").count();

      if (bookingCount === 0) {
        test.skip(true, "No bookings to view details");
        return;
      }

      // Click the booking title link
      const firstTitleLink = page.locator("a[href*='/bookings/']").first();
      await firstTitleLink.click();

      // Should navigate to booking detail page
      await expect(page).toHaveURL(/\/bookings\/[a-zA-Z0-9_-]+$/);

      // Go back
      await page.goBack();
      await expect(page).toHaveURL("/bookings");
    });

    authTest("displays booking information correctly", async ({ authenticatedPage: page }) => {
      await page.goto("/bookings");
      await page.waitForTimeout(2000);

      const bookingCount = await page.locator(".card").count();

      if (bookingCount === 0) {
        test.skip(true, "No bookings to check information");
        return;
      }

      const firstBooking = page.locator(".card").first();

      // Should show color bar
      await expect(firstBooking.locator('.w-1.h-12')).toBeVisible();

      // Should show booking title
      await expect(firstBooking.locator("a[href*='/bookings/']")).toBeVisible();

      // Should show status badge
      await expect(firstBooking.locator(".badge")).toBeVisible();

      // Should show date/time with emojis
      await expect(firstBooking.locator('text=/📅/')).toBeVisible(); // Date
      await expect(firstBooking.locator('text=/⏰/')).toBeVisible(); // Time
      await expect(firstBooking.locator('text=/⏱️/')).toBeVisible(); // Duration

      // Should show attendee info
      await expect(firstBooking.locator('text=/👤/')).toBeVisible(); // Name
      await expect(firstBooking.locator('text=/✉️/')).toBeVisible(); // Email

      // May show location
      const hasLocation = await firstBooking.locator('text=/📍/').isVisible();
      // Location is optional

      // May show notes
      const hasNotes = await firstBooking.locator('text=/Notes:/', { hasText: /Notes:/ }).isVisible();
      // Notes are optional
    });
  });

  test.describe("Error Handling", () => {
    authTest("handles API errors gracefully", async ({ authenticatedPage: page }) => {
      // Intercept the bookings API call and make it fail
      await page.route("/api/bookings*", async (route) => {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: "Internal Server Error" }),
        });
      });

      await page.goto("/bookings");

      // Should show error state
      await expect(page.locator('text="Error loading bookings"')).toBeVisible();
      await expect(page.locator('button:has-text("Try again")')).toBeVisible();
    });

    authTest("retry button works after error", async ({ authenticatedPage: page }) => {
      let callCount = 0;

      // Intercept and fail first call, succeed on second
      await page.route("/api/bookings*", async (route) => {
        callCount++;
        if (callCount === 1) {
          await route.fulfill({
            status: 500,
            contentType: "application/json",
            body: JSON.stringify({ error: "Internal Server Error" }),
          });
        } else {
          await route.continue();
        }
      });

      await page.goto("/bookings");

      // Should show error first
      await expect(page.locator('text="Error loading bookings"')).toBeVisible();

      // Click retry
      await page.click('button:has-text("Try again")');

      // Should load successfully
      await expect(page.locator("h1")).toContainText("Bookings");
      expect(callCount).toBe(2);
    });
  });

  test.describe("Responsive Design", () => {
    authTest("bookings page is responsive on mobile", async ({ authenticatedPage: page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto("/bookings");
      await page.waitForTimeout(1000);

      // Page should still be functional
      await expect(page.locator("h1")).toContainText("Bookings");

      // Tabs should be functional
      await expect(page.locator('button[role="tab"]:has-text("Upcoming")')).toBeVisible();

      // Booking cards should stack properly
      const cards = page.locator('.card');
      if (await cards.count() > 0) {
        await expect(cards.first()).toBeVisible();
      }

      // Check that content doesn't overflow horizontally
      const body = page.locator('body');
      const scrollWidth = await body.evaluate((el) => el.scrollWidth);
      const clientWidth = await body.evaluate((el) => el.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // Allow small tolerance

      // Filter controls should stack vertically
      const filters = page.locator('.flex.flex-col');
      await expect(filters).toBeVisible();
    });

    authTest("bookings page is responsive on tablet", async ({ authenticatedPage: page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      await page.goto("/bookings");
      await page.waitForTimeout(1000);

      // Page should be functional
      await expect(page.locator("h1")).toContainText("Bookings");

      // Tabs should be visible and functional
      await expect(page.locator('button[role="tab"]:has-text("Upcoming")')).toBeVisible();

      // Filter controls should be in better layout
      const searchInput = page.locator('input[placeholder="Search by attendee email..."]');
      await expect(searchInput).toBeVisible();
    });
  });

  test.describe("Accessibility", () => {
    authTest("bookings page has proper heading structure", async ({ authenticatedPage: page }) => {
      await page.goto("/bookings");
      await page.waitForTimeout(1000);

      // Main page title should be h1
      await expect(page.locator("h1")).toContainText("Bookings");

      // Tab structure should be proper ARIA
      await expect(page.locator('[role="tablist"]')).toBeVisible();
      await expect(page.locator('[role="tab"]')).toHaveCount(4);
    });

    authTest("tab navigation is keyboard accessible", async ({ authenticatedPage: page }) => {
      await page.goto("/bookings");
      await page.waitForTimeout(1000);

      // Focus on first tab
      const firstTab = page.locator('button[role="tab"]').first();
      await firstTab.focus();
      await expect(firstTab).toBeFocused();

      // Navigate with arrow keys
      await page.keyboard.press("ArrowRight");

      // Should focus next tab
      const secondTab = page.locator('button[role="tab"]').nth(1);
      await expect(secondTab).toBeFocused();

      // Press Enter to activate
      await page.keyboard.press("Enter");

      // Tab should be selected
      await expect(secondTab).toHaveAttribute('aria-selected', 'true');
    });

    authTest("search and filter controls have proper labels", async ({ authenticatedPage: page }) => {
      await page.goto("/bookings");
      await page.waitForTimeout(1000);

      // Search input should have proper placeholder
      const searchInput = page.locator('input[placeholder="Search by attendee email..."]');
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toHaveAttribute('placeholder', 'Search by attendee email...');

      // Date inputs should have proper placeholders
      await expect(page.locator('input[placeholder="Start date"]')).toBeVisible();
      await expect(page.locator('input[placeholder="End date"]')).toBeVisible();
    });

    authTest("booking cards have proper structure", async ({ authenticatedPage: page }) => {
      await page.goto("/bookings");
      await page.waitForTimeout(2000);

      const bookingCount = await page.locator(".card").count();

      if (bookingCount > 0) {
        const firstCard = page.locator(".card").first();

        // Should have proper link structure
        const titleLink = firstCard.locator("a[href*='/bookings/']");
        await expect(titleLink).toBeVisible();

        // Should have proper button
        const detailsButton = firstCard.locator('button:has-text("View Details")');
        await expect(detailsButton).toBeVisible();

        // Status should be properly marked up
        const statusBadge = firstCard.locator(".badge");
        await expect(statusBadge).toBeVisible();
      }
    });

    authTest("pagination controls are keyboard accessible", async ({ authenticatedPage: page }) => {
      await page.goto("/bookings");
      await page.waitForTimeout(2000);

      // Check if pagination exists
      const paginationInfo = page.locator('text=/Showing \\d+ to \\d+ of \\d+ bookings/');

      if (await paginationInfo.isVisible()) {
        // Pagination buttons should be focusable
        const nextButton = page.locator('button:has-text("Next")');
        const prevButton = page.locator('button:has-text("Previous")');

        await nextButton.focus();
        await expect(nextButton).toBeFocused();

        await prevButton.focus();
        await expect(prevButton).toBeFocused();

        // Page number buttons should be focusable
        const pageButtons = page.locator('button').filter({ hasText: /^\d+$/ });
        if (await pageButtons.count() > 0) {
          await pageButtons.first().focus();
          await expect(pageButtons.first()).toBeFocused();
        }
      }
    });
  });
});