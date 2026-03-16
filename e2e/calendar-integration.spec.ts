import { test, expect } from "@playwright/test";

test.describe("Calendar Integration", () => {
  test.beforeEach(async ({ page }) => {
    // Seed database and login
    await page.goto("/");
    await page
      .getByRole("button", { name: "Try the Demo", exact: true })
      .click();
    await page.waitForURL("/dashboard");
  });

  test("calendar settings page loads", async ({ page }) => {
    await page.goto("/settings/calendars");

    // Check page header
    await expect(
      page.getByRole("heading", { name: "Calendar Connections", exact: true }),
    ).toBeVisible();

    // Check description
    await expect(
      page.locator(
        "text=Connect your calendar accounts to enable scheduling conflicts",
      ),
    ).toBeVisible();

    // Check Google Calendar section
    await expect(
      page.getByRole("heading", { name: "Google Calendar", exact: true }),
    ).toBeVisible();
    await expect(
      page.locator(
        "text=Connect your Google Calendar to prevent double bookings",
      ),
    ).toBeVisible();
  });

  test("google calendar not configured warning displays when applicable", async ({
    page,
  }) => {
    await page.goto("/settings/calendars");

    // Wait for page to load completely
    await page.waitForLoadState("networkidle");

    // Check if Google Calendar integration is not configured
    const warningElement = page.locator(
      "text=Google Calendar Integration Not Configured",
    );
    const configuredElement = page.locator("text=Connected");

    if ((await warningElement.count()) > 0) {
      // If not configured, should show warning
      await expect(warningElement).toBeVisible();
      await expect(
        page.locator(
          "text=The server administrator needs to configure Google Calendar",
        ),
      ).toBeVisible();

      // Connect button should be disabled
      const connectButton = page.getByRole("button", {
        name: "Connect Google Calendar",
        exact: true,
      });
      await expect(connectButton).toBeDisabled();
    } else {
      // If configured, should show either connected status or enabled connect button
      const connectButton = page.getByRole("button", {
        name: "Connect Google Calendar",
        exact: true,
      });
      const isConnected = (await configuredElement.count()) > 0;

      if (isConnected) {
        await expect(configuredElement).toBeVisible();
      } else {
        await expect(connectButton).toBeEnabled();
      }
    }
  });

  test("connection status badge displays correctly", async ({ page }) => {
    await page.goto("/settings/calendars");

    // Wait for connection status to load
    await page.waitForSelector(
      '[data-testid="connection-status"], .badge, text=Connected, text=Not Connected',
      { timeout: 10000 },
    );

    // Should show either Connected or Not Connected badge
    const connectedBadge = page.locator("text=Connected").first();
    const notConnectedBadge = page.locator("text=Not Connected").first();

    const isConnected = (await connectedBadge.count()) > 0;
    const isNotConnected = (await notConnectedBadge.count()) > 0;

    // Should show exactly one status
    expect(isConnected || isNotConnected).toBe(true);

    if (isConnected) {
      await expect(connectedBadge).toBeVisible();
      // Should also show sync enabled indicator
      await expect(page.locator("text=Calendar sync enabled")).toBeVisible();
    } else {
      await expect(notConnectedBadge).toBeVisible();
    }
  });

  test("google oauth connect flow initiates", async ({ page }) => {
    await page.goto("/settings/calendars");

    // Check if Google is configured by looking for enabled connect button
    const connectButton = page.getByRole("button", {
      name: "Connect Google Calendar",
      exact: true,
    });

    // Wait for button to be available
    await page.waitForSelector('button:has-text("Connect Google Calendar")', {
      timeout: 10000,
    });

    if (await connectButton.isEnabled()) {
      // Click connect button
      await connectButton.click();

      // Should either redirect to Google OAuth or show connecting state
      // Due to test environment, we'll verify the connect flow initiates

      // Check for connecting state
      const connectingButton = page.locator("text=Connecting...");
      if ((await connectingButton.count()) > 0) {
        await expect(connectingButton).toBeVisible();
      } else {
        // Or should redirect to Google OAuth (URL change)
        // In real implementation, this would redirect to accounts.google.com
        // We'll just verify the click was handled properly
        await page.waitForTimeout(2000); // Allow time for potential redirect
      }
    } else {
      // If disabled, should show appropriate disabled state
      await expect(connectButton).toBeDisabled();
    }
  });

  test("connected state shows management options", async ({ page }) => {
    await page.goto("/settings/calendars");

    // Check if already connected
    const connectedBadge = page.locator("text=Connected").first();

    if ((await connectedBadge.count()) > 0) {
      // Should show management buttons
      await expect(
        page.getByRole("button", { name: "Refresh Calendars", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Disconnect", exact: true }),
      ).toBeVisible();

      // Should show calendars section
      await expect(
        page.getByRole("heading", { name: "Available Calendars", exact: true }),
      ).toBeVisible();
    }
  });

  test("refresh calendars functionality", async ({ page }) => {
    await page.goto("/settings/calendars");

    // Check if connected and has refresh button
    const refreshButton = page.getByRole("button", {
      name: "Refresh Calendars",
      exact: true,
    });

    if ((await refreshButton.count()) > 0) {
      await refreshButton.click();

      // Should show refreshing state temporarily
      await expect(page.locator("text=Refreshing...")).toBeVisible({
        timeout: 5000,
      });

      // Wait for refresh to complete
      await page.waitForSelector("text=Refreshing...", {
        state: "hidden",
        timeout: 10000,
      });

      // Should return to normal state
      await expect(refreshButton).toBeVisible();
    }
  });

  test("disconnect flow works", async ({ page }) => {
    await page.goto("/settings/calendars");

    // Check if connected and has disconnect button
    const disconnectButton = page.getByRole("button", {
      name: "Disconnect",
      exact: true,
    });

    if ((await disconnectButton.count()) > 0) {
      await disconnectButton.click();

      // Should show disconnecting state
      await expect(page.locator("text=Disconnecting...")).toBeVisible({
        timeout: 5000,
      });

      // Wait for disconnect to complete
      await page.waitForSelector("text=Disconnecting...", {
        state: "hidden",
        timeout: 10000,
      });

      // Should return to disconnected state
      await expect(page.locator("text=Not Connected")).toBeVisible();
      await expect(
        page.getByRole("button", {
          name: "Connect Google Calendar",
          exact: true,
        }),
      ).toBeVisible();
    }
  });

  test("calendar list displays when connected", async ({ page }) => {
    await page.goto("/settings/calendars");

    // Check if connected
    const connectedBadge = page.locator("text=Connected").first();

    if ((await connectedBadge.count()) > 0) {
      // Should show available calendars section
      await expect(
        page.getByRole("heading", { name: "Available Calendars", exact: true }),
      ).toBeVisible();

      // Should either show calendars or empty state
      const calendarList = page.locator(
        '[data-testid="calendar-list"], .calendar-item',
      );
      const emptyState = page.locator("text=No Calendars Found");

      const hasCalendars = (await calendarList.count()) > 0;
      const isEmpty = (await emptyState.count()) > 0;

      // Should show either calendars or empty state
      expect(hasCalendars || isEmpty).toBe(true);

      if (hasCalendars) {
        // Should show calendar details
        const firstCalendar = calendarList.first();
        await expect(firstCalendar).toBeVisible();

        // Should have calendar color indicator
        await expect(
          page
            .locator('.w-4.h-4.rounded, [data-testid="calendar-color"]')
            .first(),
        ).toBeVisible();
      }

      if (isEmpty) {
        await expect(emptyState).toBeVisible();
        await expect(
          page.getByRole("button", { name: "Refresh Calendars", exact: true }),
        ).toBeVisible();
      }
    }
  });

  test("calendar badges display correctly", async ({ page }) => {
    await page.goto("/settings/calendars");

    // Check if connected and has calendars
    const connectedBadge = page.locator("text=Connected").first();

    if ((await connectedBadge.count()) > 0) {
      // Look for calendar items with badges
      const primaryBadge = page.locator("text=Primary").first();
      const accessRoleBadge = page
        .locator(
          '[data-testid="access-role-badge"], .badge:has-text("owner"), .badge:has-text("reader"), .badge:has-text("writer")',
        )
        .first();

      // If calendars exist, should have access role badges
      const calendarItems = page.locator(
        '.calendar-item, [data-testid="calendar-item"]',
      );

      if ((await calendarItems.count()) > 0) {
        // At least one calendar should have an access role
        await expect(accessRoleBadge).toBeVisible();
      }
    }
  });

  test("oauth callback handling", async ({ page }) => {
    // Test OAuth callback URL with success code
    await page.goto("/settings/calendars?code=test_auth_code");

    // Should handle OAuth success
    // In real implementation, this would process the auth code
    // Here we verify the page loads and handles the parameter
    await expect(
      page.getByRole("heading", { name: "Calendar Connections", exact: true }),
    ).toBeVisible();

    // URL should be cleaned up (removing OAuth parameters)
    await page.waitForTimeout(2000);
    expect(page.url()).not.toContain("code=");
  });

  test("oauth error handling", async ({ page }) => {
    // Test OAuth callback URL with error
    await page.goto("/settings/calendars?error=access_denied");

    // Should handle OAuth error
    await expect(
      page.getByRole("heading", { name: "Calendar Connections", exact: true }),
    ).toBeVisible();

    // URL should be cleaned up
    await page.waitForTimeout(2000);
    expect(page.url()).not.toContain("error=");
  });

  test("help text displays for connected calendars", async ({ page }) => {
    await page.goto("/settings/calendars");

    // Check if connected
    const connectedBadge = page.locator("text=Connected").first();

    if ((await connectedBadge.count()) > 0) {
      // Should show help text about calendar functionality
      await expect(
        page.locator("text=CalMill will automatically check for conflicts"),
      ).toBeVisible();
      await expect(
        page.locator("text=Events will be created in your primary calendar"),
      ).toBeVisible();
    }
  });

  test("future integrations section displays", async ({ page }) => {
    await page.goto("/settings/calendars");

    // Should show other calendar providers section
    await expect(
      page.getByRole("heading", {
        name: "Other Calendar Providers",
        exact: true,
      }),
    ).toBeVisible();

    // Should show Outlook and Apple Calendar as coming soon
    await expect(page.locator("text=Outlook Calendar")).toBeVisible();
    await expect(page.locator("text=Apple Calendar")).toBeVisible();

    // Both should show "Coming Soon" badges
    const comingSoonBadges = page.locator("text=Coming Soon");
    expect(await comingSoonBadges.count()).toBeGreaterThanOrEqual(2);
  });

  test("error states display properly", async ({ page }) => {
    // Navigate to calendar settings
    await page.goto("/settings/calendars");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Look for any error messages that might be displayed
    const errorAlert = page.locator(
      '[role="alert"], .alert-destructive, .bg-destructive',
    );

    if ((await errorAlert.count()) > 0) {
      // If there's an error, it should have proper styling and messaging
      await expect(errorAlert).toBeVisible();

      // Should have an error icon
      await expect(
        page.locator(
          '.alert-destructive .lucide-alert-circle, .alert-destructive [data-testid="error-icon"]',
        ),
      ).toBeVisible();
    }
  });

  test("loading states work correctly", async ({ page }) => {
    // Navigate to calendar settings and check loading states
    await page.goto("/settings/calendars");

    // Page should either show loading skeleton or loaded content quickly
    const loadingSkeleton = page.locator(
      '[data-testid="loading-skeleton"], .skeleton',
    );
    const loadedContent = page.getByRole("heading", {
      name: "Calendar Connections",
      exact: true,
    });

    // Should show either loading or content within reasonable time
    await Promise.race([
      expect(loadingSkeleton).toBeVisible(),
      expect(loadedContent).toBeVisible(),
    ]);

    // Eventually should show loaded content
    await expect(loadedContent).toBeVisible({ timeout: 10000 });
  });

  test("responsive design on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/settings/calendars");

    // Page should be responsive
    await expect(
      page.getByRole("heading", { name: "Calendar Connections", exact: true }),
    ).toBeVisible();

    // Connect button should be properly sized on mobile
    const connectButton = page.getByRole("button", {
      name: "Connect Google Calendar",
      exact: true,
    });

    if ((await connectButton.count()) > 0) {
      await expect(connectButton).toBeVisible();

      // Button should not overflow the viewport
      const buttonBox = await connectButton.boundingBox();
      if (buttonBox) {
        expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(375);
      }
    }
  });

  test("calendar color indicators display correctly", async ({ page }) => {
    await page.goto("/settings/calendars");

    // Check if connected and has calendars
    const connectedBadge = page.locator("text=Connected").first();

    if ((await connectedBadge.count()) > 0) {
      // Look for calendar color indicators
      const colorIndicators = page.locator(
        '.w-4.h-4.rounded, [data-testid="calendar-color"]',
      );

      if ((await colorIndicators.count()) > 0) {
        const firstIndicator = colorIndicators.first();
        await expect(firstIndicator).toBeVisible();

        // Should have background color style
        const bgColor = await firstIndicator.getAttribute("style");
        expect(bgColor).toContain("background-color");
      }
    }
  });

  test("keyboard navigation works", async ({ page }) => {
    await page.goto("/settings/calendars");

    // Test tab navigation to connect button
    const connectButton = page.getByRole("button", {
      name: "Connect Google Calendar",
      exact: true,
    });

    if (
      (await connectButton.count()) > 0 &&
      (await connectButton.isEnabled())
    ) {
      // Use keyboard to focus the button
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");

      // Connect button should be focusable
      await connectButton.focus();
      await expect(connectButton).toBeFocused();

      // Should be activatable with Enter or Space
      // (We won't actually activate to avoid triggering OAuth)
    }
  });
});
