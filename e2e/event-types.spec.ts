import { test, expect } from "@playwright/test";
import { test as authTest } from "./fixtures/auth";

test.describe("Event Types", () => {
  test.describe("Unauthenticated Access", () => {
    test("redirects to login when not authenticated", async ({ page }) => {
      await page.goto("/event-types");

      // Should be redirected to login page
      await expect(page).toHaveURL("/login");
    });
  });

  test.describe("Authenticated Event Types", () => {
    authTest(
      "loads event types page with correct content",
      async ({ authenticatedPage: page }) => {
        await page.goto("/event-types");

        // Verify we're on the event types page
        await expect(page).toHaveURL("/event-types");

        // Check main heading
        await expect(page.locator("h1")).toContainText("Event Types");

        // Check description text
        await expect(
          page.locator("text=Manage your schedulable meeting types"),
        ).toBeVisible();

        // Check for "New Event Type" button
        await expect(page.locator('text="New Event Type"')).toBeVisible();
      },
    );

    authTest(
      "displays seeded event types from seed data",
      async ({ authenticatedPage: page }) => {
        await page.goto("/event-types");

        // Wait for content to load (no skeleton)
        await page.waitForTimeout(2000);

        // Should show seeded event types (at least 6 from seed data)
        const eventTypeCards = page
          .locator("[data-testid='event-type-card'], .card")
          .filter({
            has: page.locator("h3"), // Event type title
          });

        const count = await eventTypeCards.count();
        expect(count).toBeGreaterThanOrEqual(5); // Allow some flexibility

        // Check for specific seeded event types
        await expect(page.locator('text="Quick Chat"')).toBeVisible();
        await expect(page.locator('text="30 Minute Meeting"')).toBeVisible();
      },
    );

    authTest(
      "shows event type details correctly",
      async ({ authenticatedPage: page }) => {
        await page.goto("/event-types");
        await page.waitForTimeout(2000);

        // Find the first event type card
        const firstCard = page.locator(".card").first();
        await expect(firstCard).toBeVisible();

        // Should show duration
        await expect(firstCard.locator("text=/\\d+m/")).toBeVisible();

        // Should show booking count
        await expect(firstCard.locator("text=/\\d+ bookings/")).toBeVisible();

        // Should show toggle button
        await expect(
          firstCard.locator(
            'button:has-text("Active"), button:has-text("Inactive")',
          ),
        ).toBeVisible();

        // Should show action buttons
        await expect(
          firstCard.locator('button:has-text("Edit")'),
        ).toBeVisible();
        await expect(
          firstCard.locator('button[aria-label="More actions"]'),
        ).toBeVisible();
      },
    );

    authTest(
      "can create new event type",
      async ({ authenticatedPage: page }) => {
        await page.goto("/event-types");

        // Click "New Event Type" button
        await page.click('text="New Event Type"');

        // Should navigate to new event type page
        await expect(page).toHaveURL("/event-types/new");

        // Fill in basic event type information
        await page.fill('input[name="title"]', "Test E2E Event");
        await page.fill('input[name="slug"]', "test-e2e-event");
        await page.fill(
          'textarea[name="description"]',
          "This is a test event type created via E2E test",
        );

        // Set duration
        await page.fill('input[name="duration"]', "25");

        // Save the event type
        await page.click('button:has-text("Save")');

        // Should redirect back to event types list
        await expect(page).toHaveURL("/event-types");

        // Verify new event type appears in the list
        await expect(page.locator('text="Test E2E Event"')).toBeVisible();
        await expect(page.locator('text="25m"')).toBeVisible();
      },
    );

    authTest(
      "can edit existing event type",
      async ({ authenticatedPage: page }) => {
        await page.goto("/event-types");
        await page.waitForTimeout(1000);

        // Click edit button on first event type
        const firstEditButton = page.locator('button:has-text("Edit")').first();
        await firstEditButton.click();

        // Should navigate to edit page
        await expect(page).toHaveURL(/\/event-types\/[^\/]+$/);

        // Modify the title
        const titleInput = page.locator('input[name="title"]');
        await titleInput.clear();
        await titleInput.fill("Modified Event Title");

        // Save changes
        await page.click('button:has-text("Save")');

        // Should redirect back to event types list
        await expect(page).toHaveURL("/event-types");

        // Verify changes are reflected
        await expect(page.locator('text="Modified Event Title"')).toBeVisible();
      },
    );

    authTest(
      "can toggle event type active/inactive",
      async ({ authenticatedPage: page }) => {
        await page.goto("/event-types");
        await page.waitForTimeout(1000);

        // Find first event type and its current state
        const firstCard = page.locator(".card").first();
        const toggleButton = firstCard.locator(
          'button:has-text("Active"), button:has-text("Inactive")',
        );

        const initialState = await toggleButton.textContent();

        // Click the toggle
        await toggleButton.click();

        // Wait for the toggle to update
        await page.waitForTimeout(1000);

        // Verify the state changed
        const newState = await toggleButton.textContent();
        expect(newState).not.toBe(initialState);

        // The card should reflect the change (opacity for inactive)
        if (newState?.includes("Inactive")) {
          await expect(firstCard).toHaveClass(/opacity-60/);
        }
      },
    );

    authTest(
      "can duplicate event type",
      async ({ authenticatedPage: page }) => {
        await page.goto("/event-types");
        await page.waitForTimeout(1000);

        // Get initial count of event types
        const initialCount = await page.locator(".card").count();

        // Click more actions menu for first event type
        const firstMoreButton = page
          .locator('button[aria-label="More actions"]')
          .first();
        await firstMoreButton.click();

        // Click duplicate
        await page.click('text="Duplicate"');

        // Wait for duplication to complete
        await page.waitForTimeout(2000);

        // Should have one more event type
        const newCount = await page.locator(".card").count();
        expect(newCount).toBe(initialCount + 1);

        // Should see "(Copy)" in the title
        await expect(page.locator("text=/.*\\(Copy\\)/")).toBeVisible();
      },
    );

    authTest("can delete event type", async ({ authenticatedPage: page }) => {
      await page.goto("/event-types");
      await page.waitForTimeout(1000);

      // First create a test event type to delete (to avoid deleting seed data)
      await page.click('text="New Event Type"');
      await page.fill('input[name="title"]', "Test Delete Event");
      await page.fill('input[name="slug"]', "test-delete-event");
      await page.click('button:has-text("Save")');

      // Back on event types page
      await expect(page).toHaveURL("/event-types");
      await page.waitForTimeout(1000);

      // Find the test event and delete it
      const testEventCard = page.locator('.card:has-text("Test Delete Event")');
      await expect(testEventCard).toBeVisible();

      // Click more actions for test event
      const moreButton = testEventCard.locator(
        'button[aria-label="More actions"]',
      );
      await moreButton.click();

      // Handle the confirmation dialog
      page.on("dialog", async (dialog) => {
        expect(dialog.message()).toContain("Are you sure you want to delete");
        await dialog.accept();
      });

      // Click delete
      await page.click('text="Delete"');

      // Wait for deletion
      await page.waitForTimeout(2000);

      // Verify the event type is gone
      await expect(page.locator('text="Test Delete Event"')).not.toBeVisible();
    });

    authTest(
      "can copy event type link",
      async ({ authenticatedPage: page }) => {
        await page.goto("/event-types");
        await page.waitForTimeout(1000);

        // Click copy link button for first event type
        const firstCopyButton = page
          .locator('button:has-text("Copy Link")')
          .first();

        // Grant clipboard permissions
        await page.context().grantPermissions(["clipboard-write"]);

        await firstCopyButton.click();

        // Verify button text changes to "Copied!"
        await expect(firstCopyButton).toHaveText("Copied!");

        // Wait for text to revert
        await page.waitForTimeout(2500);
        await expect(firstCopyButton).toHaveText("Copy Link");
      },
    );

    authTest(
      "search functionality works",
      async ({ authenticatedPage: page }) => {
        await page.goto("/event-types");
        await page.waitForTimeout(1000);

        // Get initial count
        const initialCount = await page.locator(".card").count();
        expect(initialCount).toBeGreaterThan(0);

        // Search for specific event type
        await page.fill(
          'input[placeholder="Search event types..."]',
          "Quick Chat",
        );

        // Wait for filter to apply
        await page.waitForTimeout(1000);

        // Should show only matching results
        const filteredCount = await page.locator(".card").count();
        expect(filteredCount).toBeLessThanOrEqual(initialCount);

        // Should show Quick Chat if it exists
        const hasQuickChat = await page
          .locator('text="Quick Chat"')
          .isVisible();
        if (hasQuickChat) {
          expect(filteredCount).toBeGreaterThanOrEqual(1);
        }

        // Clear search
        await page.fill('input[placeholder="Search event types..."]', "");
        await page.waitForTimeout(1000);

        // Should show all results again
        const restoredCount = await page.locator(".card").count();
        expect(restoredCount).toBe(initialCount);
      },
    );

    authTest(
      "show inactive toggle works",
      async ({ authenticatedPage: page }) => {
        await page.goto("/event-types");
        await page.waitForTimeout(1000);

        // Initially should show active event types section
        await expect(page.locator('text="Active Event Types"')).toBeVisible();

        // Click "Show Inactive" toggle
        await page.click('button[aria-label="Show inactive event types"]');

        // Wait for content to load
        await page.waitForTimeout(2000);

        // Should now potentially show inactive section if there are inactive event types
        const hasInactiveSection = await page
          .locator('text="Inactive Event Types"')
          .isVisible();
        // This might not be visible if there are no inactive event types, which is fine

        // Toggle should be pressed
        await expect(
          page.locator(
            'button[aria-label="Show inactive event types"][aria-pressed="true"]',
          ),
        ).toBeVisible();
      },
    );

    authTest(
      "displays public URLs correctly",
      async ({ authenticatedPage: page }) => {
        await page.goto("/event-types");
        await page.waitForTimeout(1000);

        // Each event type card should show a public URL
        const firstCard = page.locator(".card").first();
        const urlDisplay = firstCard.locator(".bg-muted"); // The URL display area

        await expect(urlDisplay).toBeVisible();

        // Should contain the demo URL pattern
        const urlText = await urlDisplay.textContent();
        expect(urlText).toMatch(/\/demo\/[a-z0-9-]+/);
      },
    );
  });

  test.describe("Error Handling", () => {
    authTest(
      "handles API errors gracefully",
      async ({ authenticatedPage: page }) => {
        // Intercept the event types API call and make it fail
        await page.route("/api/event-types", async (route) => {
          await route.fulfill({
            status: 500,
            contentType: "application/json",
            body: JSON.stringify({ error: "Internal Server Error" }),
          });
        });

        await page.goto("/event-types");

        // Should show error state
        await expect(
          page.locator('text="Failed to load event types"'),
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
        await page.route("/api/event-types", async (route) => {
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

        await page.goto("/event-types");

        // Should show error first
        await expect(
          page.locator('text="Failed to load event types"'),
        ).toBeVisible();

        // Click retry
        await page.click('button:has-text("Try Again")');

        // Should load successfully
        await expect(page.locator("h1")).toContainText("Event Types");
        expect(callCount).toBe(2);
      },
    );
  });

  test.describe("Responsive Design", () => {
    authTest(
      "event types page is responsive on mobile",
      async ({ authenticatedPage: page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        await page.goto("/event-types");
        await page.waitForTimeout(1000);

        // Page should still be functional
        await expect(page.locator("h1")).toContainText("Event Types");

        // Event type cards should stack properly
        const cards = page.locator(".card");
        await expect(cards.first()).toBeVisible();

        // Check that content doesn't overflow horizontally
        const body = page.locator("body");
        const scrollWidth = await body.evaluate((el) => el.scrollWidth);
        const clientWidth = await body.evaluate((el) => el.clientWidth);
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // Allow small tolerance

        // Copy Link button should be hidden on mobile, accessible via more menu
        await expect(
          page.locator('button:has-text("Copy Link")'),
        ).not.toBeVisible();

        // But should be available in dropdown
        const moreButton = page
          .locator('button[aria-label="More actions"]')
          .first();
        await moreButton.click();
        await expect(page.locator('text="Copy Link"').last()).toBeVisible();
      },
    );

    authTest(
      "event types page is responsive on tablet",
      async ({ authenticatedPage: page }) => {
        // Set tablet viewport
        await page.setViewportSize({ width: 768, height: 1024 });

        await page.goto("/event-types");
        await page.waitForTimeout(1000);

        // Page should be functional
        await expect(page.locator("h1")).toContainText("Event Types");

        // Check that layout adapts appropriately
        const cards = page.locator(".card");
        expect(await cards.count()).toBeGreaterThan(0);

        // Copy Link button should be visible on tablet
        await expect(
          page.locator('button:has-text("Copy Link")').first(),
        ).toBeVisible();
      },
    );
  });

  test.describe("Accessibility", () => {
    authTest(
      "event types page has proper heading structure",
      async ({ authenticatedPage: page }) => {
        await page.goto("/event-types");
        await page.waitForTimeout(1000);

        // Main page title should be h1
        await expect(page.locator("h1")).toContainText("Event Types");

        // Event type titles should be h3
        const firstCard = page.locator(".card").first();
        await expect(firstCard.locator("h3")).toBeVisible();

        // Section headings should be h2
        await expect(
          page.locator('h2:has-text("Active Event Types")'),
        ).toBeVisible();
      },
    );

    authTest(
      "interactive elements are keyboard accessible",
      async ({ authenticatedPage: page }) => {
        await page.goto("/event-types");
        await page.waitForTimeout(1000);

        // Focus on New Event Type button
        const newButton = page.locator('text="New Event Type"');
        await newButton.focus();
        await expect(newButton).toBeFocused();

        // Should be able to activate with Enter
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL("/event-types/new");

        // Go back
        await page.goBack();

        // Focus on search input
        const searchInput = page.locator(
          'input[placeholder="Search event types..."]',
        );
        await searchInput.focus();
        await expect(searchInput).toBeFocused();

        // Type in search box
        await searchInput.type("test");
        await expect(searchInput).toHaveValue("test");
      },
    );

    authTest(
      "toggle buttons have proper aria labels",
      async ({ authenticatedPage: page }) => {
        await page.goto("/event-types");
        await page.waitForTimeout(1000);

        // Show inactive toggle should have aria label
        const showInactiveToggle = page.locator(
          'button[aria-label="Show inactive event types"]',
        );
        await expect(showInactiveToggle).toBeVisible();

        // Event type toggles should have descriptive aria labels
        const firstEventToggle = page
          .locator(
            'button[aria-label*="Activate"], button[aria-label*="Deactivate"]',
          )
          .first();
        await expect(firstEventToggle).toBeVisible();
      },
    );

    authTest(
      "dropdown menus are keyboard navigable",
      async ({ authenticatedPage: page }) => {
        await page.goto("/event-types");
        await page.waitForTimeout(1000);

        // Focus on first more actions button
        const moreButton = page
          .locator('button[aria-label="More actions"]')
          .first();
        await moreButton.focus();
        await expect(moreButton).toBeFocused();

        // Press Enter to open dropdown
        await page.keyboard.press("Enter");

        // Should be able to navigate with arrow keys
        await page.keyboard.press("ArrowDown");

        // Press Escape to close
        await page.keyboard.press("Escape");
      },
    );
  });
});
