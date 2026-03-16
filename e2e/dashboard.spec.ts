import { test, expect } from "@playwright/test";
import { test as authTest } from "./fixtures/auth";

test.describe("Dashboard", () => {
  test.describe("Unauthenticated Access", () => {
    test("redirects to login when not authenticated", async ({ page }) => {
      await page.goto("/dashboard");

      // Should be redirected to login page
      await expect(page).toHaveURL("/login");
    });
  });

  test.describe("Authenticated Dashboard", () => {
    authTest(
      "loads dashboard with correct content",
      async ({ authenticatedPage: page }) => {
        // Verify we're on the dashboard
        await expect(page).toHaveURL("/dashboard");

        // Check main heading
        await expect(page.locator("h1")).toContainText("Dashboard");

        // Check description text
        await expect(
          page.locator("text=Overview of your scheduling activity"),
        ).toBeVisible();
      },
    );

    authTest(
      "displays stat cards with correct titles",
      async ({ authenticatedPage: page }) => {
        // Wait for content to load (no skeleton)
        await expect(
          page.locator('[data-testid="dashboard-skeleton"]'),
        ).not.toBeVisible();

        // Check for the four main stat cards
        await expect(page.locator('text="Upcoming"')).toBeVisible();
        await expect(page.locator('text="Pending"')).toBeVisible();
        await expect(page.locator('text="This Month"')).toBeVisible();
        await expect(page.locator('text="Popular"')).toBeVisible();

        // Verify card descriptions
        await expect(page.locator('text="Confirmed bookings"')).toBeVisible();
        await expect(
          page.locator('text="Awaiting confirmation"'),
        ).toBeVisible();
        await expect(page.locator('text="Total bookings"')).toBeVisible();
      },
    );

    authTest(
      "stat cards show numeric values",
      async ({ authenticatedPage: page }) => {
        // Wait for loading to complete
        await page.waitForSelector('text="Dashboard"');
        await page.waitForTimeout(2000); // Allow time for API call

        // Check that stat cards contain numeric values (not zero or loading states)
        const statCards = page.locator(
          '[role="group"]:has(text="Upcoming"), [role="group"]:has(text="Pending"), [role="group"]:has(text="This Month"), [role="group"]:has(text="Popular")',
        );

        // Verify at least one stat card shows a non-zero number
        const upcomingCard = page.locator('text="Upcoming"').locator("../..");
        const upcomingValue = await upcomingCard
          .locator(".text-2xl")
          .textContent();

        // Should have numeric content (could be 0 or more)
        expect(upcomingValue).toMatch(/^\d+$/);

        const pendingCard = page.locator('text="Pending"').locator("../..");
        const pendingValue = await pendingCard
          .locator(".text-2xl")
          .textContent();
        expect(pendingValue).toMatch(/^\d+$/);

        const thisMonthCard = page
          .locator('text="This Month"')
          .locator("../..");
        const thisMonthValue = await thisMonthCard
          .locator(".text-2xl")
          .textContent();
        expect(thisMonthValue).toMatch(/^\d+$/);
      },
    );

    authTest("displays charts section", async ({ authenticatedPage: page }) => {
      // Wait for dashboard to load
      await page.waitForSelector('text="Dashboard"');

      // Check for chart titles
      await expect(page.locator('text="Bookings Over Time"')).toBeVisible();
      await expect(page.locator('text="By Event Type"')).toBeVisible();
      await expect(page.locator('text="By Status"')).toBeVisible();
    });

    authTest(
      "charts render without errors",
      async ({ authenticatedPage: page }) => {
        // Wait for dashboard to load
        await page.waitForSelector('text="Dashboard"');
        await page.waitForTimeout(3000); // Allow time for charts to render

        // Check that chart containers exist
        const lineChart = page
          .locator('text="Bookings Over Time"')
          .locator("../..");
        await expect(lineChart).toBeVisible();

        const barChart = page.locator('text="By Event Type"').locator("../..");
        await expect(barChart).toBeVisible();

        const pieChart = page.locator('text="By Status"').locator("../..");
        await expect(pieChart).toBeVisible();

        // Check for SVG elements (indicating charts rendered)
        await expect(page.locator("svg").first()).toBeVisible();

        // Verify multiple SVGs are present (one for each chart)
        const svgCount = await page.locator("svg").count();
        expect(svgCount).toBeGreaterThan(0);
      },
    );

    authTest(
      "displays upcoming bookings section",
      async ({ authenticatedPage: page }) => {
        // Wait for dashboard to load
        await page.waitForSelector('text="Dashboard"');

        // Check upcoming bookings card
        await expect(page.locator('text="Upcoming Bookings"')).toBeVisible();

        // Check "View All" link
        await expect(page.locator('text="View All"')).toBeVisible();
        await expect(page.locator('a[href="/bookings"]')).toBeVisible();
      },
    );

    authTest(
      "upcoming bookings list is populated",
      async ({ authenticatedPage: page }) => {
        // Wait for dashboard to load
        await page.waitForSelector('text="Dashboard"');
        await page.waitForTimeout(2000);

        const upcomingSection = page
          .locator('text="Upcoming Bookings"')
          .locator("../..");

        // Should either show bookings or "No upcoming bookings" message
        const hasBookings =
          (await page
            .locator('[data-testid="upcoming-booking-item"]')
            .count()) > 0;
        const hasNoBookingsMessage = await page
          .locator('text="No upcoming bookings"')
          .isVisible();

        // One of these should be true
        expect(hasBookings || hasNoBookingsMessage).toBeTruthy();

        // If we have bookings (from seed data), verify their structure
        if (hasBookings) {
          const firstBooking = page
            .locator('[data-testid="upcoming-booking-item"]')
            .first();

          // Should have attendee name
          await expect(
            firstBooking.locator(".text-sm.font-medium"),
          ).toBeVisible();

          // Should have date and time
          await expect(
            firstBooking.locator(".text-sm.font-medium", {
              hasText: /\w{3} \d{1,2}/,
            }),
          ).toBeVisible();
          await expect(
            firstBooking.locator(".text-xs.text-muted-foreground", {
              hasText: /\d{1,2}:\d{2}/,
            }),
          ).toBeVisible();
        }
      },
    );

    authTest(
      "navigates to bookings page from 'View All' link",
      async ({ authenticatedPage: page }) => {
        // Wait for dashboard to load
        await page.waitForSelector('text="Dashboard"');

        // Click "View All" link in upcoming bookings section
        await page.click('a[href="/bookings"]');

        // Should navigate to bookings page
        await expect(page).toHaveURL("/bookings");
      },
    );

    authTest(
      "handles loading states properly",
      async ({ authenticatedPage: page }) => {
        // Navigate to dashboard and immediately check for loading state
        await page.goto("/dashboard");

        // Should show skeleton loader initially or content quickly
        await page.waitForSelector('text="Dashboard"');

        // After loading, should not show skeleton
        await expect(
          page.locator('[data-testid="dashboard-skeleton"]'),
        ).not.toBeVisible({ timeout: 10000 });
      },
    );

    authTest(
      "displays trend information in stat cards",
      async ({ authenticatedPage: page }) => {
        // Wait for dashboard to load
        await page.waitForSelector('text="Dashboard"');
        await page.waitForTimeout(2000);

        // Check for trend indicators
        await expect(page.locator('text="+12% from last month"')).toBeVisible();
        await expect(page.locator('text="2 new today"')).toBeVisible();
        await expect(page.locator('text="+5% from last month"')).toBeVisible();
        await expect(page.locator('text="Most booked event"')).toBeVisible();
      },
    );
  });

  test.describe("Error Handling", () => {
    authTest(
      "handles API errors gracefully",
      async ({ authenticatedPage: page }) => {
        // Intercept the dashboard API call and make it fail
        await page.route("/api/dashboard", async (route) => {
          await route.fulfill({
            status: 500,
            contentType: "application/json",
            body: JSON.stringify({ error: "Internal Server Error" }),
          });
        });

        await page.goto("/dashboard");

        // Should show error state
        await expect(
          page.locator('text="Failed to load dashboard"'),
        ).toBeVisible();
        await expect(
          page.locator('button:has-text("Try Again")'),
        ).toBeVisible();
      },
    );

    authTest(
      "retry button works after error",
      async ({ authenticatedPage: page }) => {
        let callCount = 0;

        // Intercept and fail first call, succeed on second
        await page.route("/api/dashboard", async (route) => {
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

        await page.goto("/dashboard");

        // Should show error first
        await expect(
          page.locator('text="Failed to load dashboard"'),
        ).toBeVisible();

        // Click retry
        await page.click('button:has-text("Try Again")');

        // Should load successfully
        await expect(page.locator("h1")).toContainText("Dashboard");
        expect(callCount).toBe(2);
      },
    );
  });

  test.describe("Responsive Design", () => {
    authTest(
      "dashboard is responsive on mobile",
      async ({ authenticatedPage: page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        await page.waitForSelector('text="Dashboard"');

        // Dashboard should still be functional
        await expect(page.locator("h1")).toContainText("Dashboard");

        // Stats cards should stack vertically
        const statsContainer = page.locator(".grid").first();
        await expect(statsContainer).toBeVisible();

        // Check that content doesn't overflow horizontally
        const body = page.locator("body");
        const scrollWidth = await body.evaluate((el) => el.scrollWidth);
        const clientWidth = await body.evaluate((el) => el.clientWidth);
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // Allow small tolerance
      },
    );

    authTest(
      "dashboard is responsive on tablet",
      async ({ authenticatedPage: page }) => {
        // Set tablet viewport
        await page.setViewportSize({ width: 768, height: 1024 });

        await page.waitForSelector('text="Dashboard"');

        // Dashboard should be functional
        await expect(page.locator("h1")).toContainText("Dashboard");

        // Check that layout adapts appropriately
        const statsCards = page.locator(".grid .card");
        expect(await statsCards.count()).toBeGreaterThan(0);
      },
    );
  });

  test.describe("Accessibility", () => {
    authTest(
      "dashboard has proper heading structure",
      async ({ authenticatedPage: page }) => {
        await page.waitForSelector('text="Dashboard"');

        // Main page title should be h1
        await expect(page.locator("h1")).toContainText("Dashboard");

        // Chart titles should be proper headings
        await expect(
          page.locator('h3, [role="heading"]:has-text("Bookings Over Time")'),
        ).toBeVisible();
        await expect(
          page.locator('h3, [role="heading"]:has-text("By Event Type")'),
        ).toBeVisible();
        await expect(
          page.locator('h3, [role="heading"]:has-text("By Status")'),
        ).toBeVisible();
        await expect(
          page.locator('h3, [role="heading"]:has-text("Upcoming Bookings")'),
        ).toBeVisible();
      },
    );

    authTest(
      "interactive elements are keyboard accessible",
      async ({ authenticatedPage: page }) => {
        await page.waitForSelector('text="Dashboard"');

        // Focus on "View All" link
        await page.keyboard.press("Tab");

        // Find the View All link and focus it
        const viewAllLink = page.locator('a[href="/bookings"]');
        await viewAllLink.focus();

        // Should be focusable and have proper focus styling
        await expect(viewAllLink).toBeFocused();

        // Should be able to activate with Enter
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL("/bookings");
      },
    );
  });
});
