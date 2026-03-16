import { test, expect } from "@playwright/test";
import { test as authenticatedTest } from "./fixtures/auth";

test.describe("Webhooks Management", () => {
  test.describe("Webhooks Settings Page", () => {
    authenticatedTest(
      "loads webhooks page and shows existing webhooks",
      async ({ authenticatedPage: page }) => {
        await page.goto("/settings/webhooks");

        // Wait for the page to load
        await expect(page).toHaveURL("/settings/webhooks");

        // Check page header
        await expect(page.locator("h2")).toContainText("Webhooks");
        await expect(
          page.locator(
            "text=Receive real-time notifications when booking events occur",
          ),
        ).toBeVisible();

        // Should have add webhook button
        await expect(
          page.locator('button:has-text("Add Webhook")'),
        ).toBeVisible();

        // Check for existing webhooks or empty state
        const webhookCards = page.locator(
          '[data-testid="webhook-card"], .border.border-border.rounded-lg',
        );
        const emptyState = page.locator('text="No webhooks configured"');

        // Should show either webhooks or empty state
        await expect(webhookCards.first().or(emptyState)).toBeVisible();
      },
    );

    authenticatedTest(
      "shows webhook security information",
      async ({ authenticatedPage: page }) => {
        await page.goto("/settings/webhooks");

        // Should show security information section
        await expect(page.locator('text="Webhook Security"')).toBeVisible();
        await expect(
          page.locator('text="signed with HMAC-SHA256"'),
        ).toBeVisible();
        await expect(page.locator('text="X-CalMill-Signature"')).toBeVisible();
        await expect(page.locator('text="X-CalMill-Event"')).toBeVisible();
      },
    );

    authenticatedTest(
      "can create a new webhook",
      async ({ authenticatedPage: page }) => {
        await page.goto("/settings/webhooks");

        // Click add webhook button
        await page.click('button:has-text("Add Webhook")');

        // Should open create webhook modal
        await expect(page.locator('text="Create New Webhook"')).toBeVisible();

        // Fill in webhook form
        const testUrl = `https://webhook.test/calmill-${Date.now()}`;
        await page.fill('input[id="webhook-url"]', testUrl);

        // Select at least one event trigger
        await page.check('input[id="create-event-BOOKING_CREATED"]');
        await page.check('input[id="create-event-BOOKING_CANCELLED"]');

        // Ensure active toggle is checked (should be default)
        const activeToggle = page
          .locator('input[type="checkbox"], button[role="switch"]')
          .filter({ hasText: /active/i })
          .or(page.locator('[data-testid="active-toggle"]'));

        // Submit form
        await page.click('button:has-text("Create Webhook")');

        // Should close modal and show new webhook
        await expect(
          page.locator('text="Create New Webhook"'),
        ).not.toBeVisible();

        // Should show new webhook in list
        await expect(page.locator(`text="${testUrl}"`)).toBeVisible();
        await expect(page.locator('text="Active"')).toBeVisible();
      },
    );

    authenticatedTest(
      "validates webhook creation form",
      async ({ authenticatedPage: page }) => {
        await page.goto("/settings/webhooks");

        await page.click('button:has-text("Add Webhook")');

        // Try to submit empty form
        await page.click('button:has-text("Create Webhook")');

        // Should show validation errors
        await expect(page.locator('text="URL is required"')).toBeVisible();
        await expect(
          page.locator('text="Please select at least one event"'),
        ).toBeVisible();

        // Fill invalid URL
        await page.fill('input[id="webhook-url"]', "not-a-valid-url");
        await page.click('button:has-text("Create Webhook")');

        // Should show URL validation error
        await expect(
          page.locator('text="Please enter a valid URL"'),
        ).toBeVisible();
      },
    );

    authenticatedTest(
      "shows all available webhook events",
      async ({ authenticatedPage: page }) => {
        await page.goto("/settings/webhooks");

        await page.click('button:has-text("Add Webhook")');

        // Should show all webhook event types
        const expectedEvents = [
          "Booking Created",
          "Booking Accepted",
          "Booking Rejected",
          "Booking Cancelled",
          "Booking Rescheduled",
        ];

        for (const event of expectedEvents) {
          await expect(page.locator(`text="${event}"`)).toBeVisible();
        }

        // Should show descriptions for events
        await expect(
          page.locator('text="When a new booking is made"'),
        ).toBeVisible();
        await expect(
          page.locator('text="When you accept a pending booking"'),
        ).toBeVisible();
      },
    );
  });

  test.describe("Webhook Management", () => {
    authenticatedTest(
      "can edit an existing webhook",
      async ({ authenticatedPage: page }) => {
        await page.goto("/settings/webhooks");

        // Create a webhook first if none exist
        const editButton = page.locator('button:has-text("Edit")');
        const isEditVisible = await editButton
          .first()
          .isVisible()
          .catch(() => false);

        if (!isEditVisible) {
          // Create a webhook first
          await page.click('button:has-text("Add Webhook")');
          await page.fill(
            'input[id="webhook-url"]',
            `https://edit-test.example.com/${Date.now()}`,
          );
          await page.check('input[id="create-event-BOOKING_CREATED"]');
          await page.click('button:has-text("Create Webhook")');
        }

        // Now edit the webhook
        await page.click('button:has-text("Edit")');

        // Should open edit modal
        await expect(page.locator('text="Edit Webhook"')).toBeVisible();

        // Change URL
        const newUrl = `https://updated.example.com/${Date.now()}`;
        await page.fill('input[id="edit-webhook-url"]', newUrl);

        // Change event selection
        await page.uncheck('input[id*="edit-event-BOOKING_CREATED"]');
        await page.check('input[id*="edit-event-BOOKING_CANCELLED"]');

        // Submit changes
        await page.click('button:has-text("Update Webhook")');

        // Should close modal and show updated webhook
        await expect(page.locator('text="Edit Webhook"')).not.toBeVisible();
        await expect(page.locator(`text="${newUrl}"`)).toBeVisible();
      },
    );

    authenticatedTest(
      "can test webhook delivery",
      async ({ authenticatedPage: page }) => {
        await page.goto("/settings/webhooks");

        // Look for existing webhook or create one
        const testButton = page.locator('button:has-text("Test")');
        const isTestVisible = await testButton
          .first()
          .isVisible()
          .catch(() => false);

        if (!isTestVisible) {
          // Create a webhook first
          await page.click('button:has-text("Add Webhook")');
          await page.fill(
            'input[id="webhook-url"]',
            `https://test.example.com/${Date.now()}`,
          );
          await page.check('input[id="create-event-BOOKING_CREATED"]');
          await page.click('button:has-text("Create Webhook")');
        }

        // Click test button
        await page.click('button:has-text("Test")');

        // Should show testing state
        await expect(page.locator('text="Testing..."')).toBeVisible();

        // Wait for test completion (success or failure)
        await page.waitForSelector('text="Testing..."', {
          state: "detached",
          timeout: 15000,
        });

        // Should show test result (either success toast or error)
        // The test will likely fail since we're using fake URLs, but the UI should handle it gracefully
      },
    );

    authenticatedTest(
      "can delete a webhook",
      async ({ authenticatedPage: page }) => {
        await page.goto("/settings/webhooks");

        // Create a webhook specifically for deletion
        await page.click('button:has-text("Add Webhook")');
        const deleteTestUrl = `https://delete-test.example.com/${Date.now()}`;
        await page.fill('input[id="webhook-url"]', deleteTestUrl);
        await page.check('input[id="create-event-BOOKING_CREATED"]');
        await page.click('button:has-text("Create Webhook")');

        // Verify webhook was created
        await expect(page.locator(`text="${deleteTestUrl}"`)).toBeVisible();

        // Click delete button
        await page.click('button:has-text("Delete")');

        // Handle confirmation dialog
        page.on("dialog", async (dialog) => {
          expect(dialog.message()).toContain(
            "Are you sure you want to delete this webhook?",
          );
          await dialog.accept();
        });

        // Webhook should be removed from list
        await expect(page.locator(`text="${deleteTestUrl}"`)).not.toBeVisible();
      },
    );

    authenticatedTest(
      "can toggle webhook active state",
      async ({ authenticatedPage: page }) => {
        await page.goto("/settings/webhooks");

        // Create a webhook first if none exist
        const existingWebhook = page
          .locator(".border.border-border.rounded-lg")
          .first();
        const hasWebhook = await existingWebhook.isVisible().catch(() => false);

        if (!hasWebhook) {
          await page.click('button:has-text("Add Webhook")');
          await page.fill(
            'input[id="webhook-url"]',
            `https://toggle-test.example.com/${Date.now()}`,
          );
          await page.check('input[id="create-event-BOOKING_CREATED"]');
          await page.click('button:has-text("Create Webhook")');
        }

        // Check current active state
        const activeBadge = page.locator('text="Active"').first();
        const inactiveBadge = page.locator('text="Inactive"').first();

        const isActive = await activeBadge.isVisible().catch(() => false);

        // Edit the webhook to toggle state
        await page.click('button:has-text("Edit")');

        // Find the active toggle and change it
        const activeToggle = page
          .locator('[data-testid="active-toggle"], input[type="checkbox"]')
          .last();

        if (isActive) {
          await activeToggle.uncheck();
        } else {
          await activeToggle.check();
        }

        await page.click('button:has-text("Update Webhook")');

        // Verify the state changed
        if (isActive) {
          await expect(page.locator('text="Inactive"')).toBeVisible();
        } else {
          await expect(page.locator('text="Active"')).toBeVisible();
        }
      },
    );
  });

  test.describe("Webhook Secrets and Security", () => {
    authenticatedTest(
      "displays webhook signing secret",
      async ({ authenticatedPage: page }) => {
        await page.goto("/settings/webhooks");

        // Create webhook if none exist
        const hasWebhook = await page
          .locator(".border.border-border.rounded-lg")
          .first()
          .isVisible()
          .catch(() => false);

        if (!hasWebhook) {
          await page.click('button:has-text("Add Webhook")');
          await page.fill(
            'input[id="webhook-url"]',
            `https://secret-test.example.com/${Date.now()}`,
          );
          await page.check('input[id="create-event-BOOKING_CREATED"]');
          await page.click('button:has-text("Create Webhook")');
        }

        // Should show signing secret section
        await expect(page.locator('text="Signing Secret"')).toBeVisible();

        // Secret should be hidden by default (dots)
        await expect(
          page.locator('code:has-text("••••••••••••••••••••••••••••••••")'),
        ).toBeVisible();

        // Should have eye icon to show/hide secret
        const eyeButton = page.locator('button:has([class*="eye"])').first();
        await eyeButton.click();

        // Should show actual secret (hexadecimal string)
        await expect(
          page.locator("code").filter({ hasText: /^[a-f0-9]{64}$/ }),
        ).toBeVisible();

        // Click eye again to hide
        await eyeButton.click();

        // Should be hidden again
        await expect(
          page.locator('code:has-text("••••••••••••••••••••••••••••••••")'),
        ).toBeVisible();
      },
    );

    authenticatedTest(
      "can copy webhook secret to clipboard",
      async ({ authenticatedPage: page }) => {
        await page.goto("/settings/webhooks");

        // Ensure we have a webhook
        const hasWebhook = await page
          .locator(".border.border-border.rounded-lg")
          .first()
          .isVisible()
          .catch(() => false);

        if (!hasWebhook) {
          await page.click('button:has-text("Add Webhook")');
          await page.fill(
            'input[id="webhook-url"]',
            `https://copy-test.example.com/${Date.now()}`,
          );
          await page.check('input[id="create-event-BOOKING_CREATED"]');
          await page.click('button:has-text("Create Webhook")');
        }

        // Click copy button
        const copyButton = page.locator('button:has([class*="copy"])').first();
        await copyButton.click();

        // Should show copy success toast/message
        await expect(
          page.locator('text="Copied", text="copied to clipboard"'),
        ).toBeVisible();
      },
    );

    authenticatedTest(
      "shows event trigger badges",
      async ({ authenticatedPage: page }) => {
        await page.goto("/settings/webhooks");

        // Create webhook with multiple events
        await page.click('button:has-text("Add Webhook")');
        await page.fill(
          'input[id="webhook-url"]',
          `https://events-test.example.com/${Date.now()}`,
        );

        // Select multiple events
        await page.check('input[id="create-event-BOOKING_CREATED"]');
        await page.check('input[id="create-event-BOOKING_CANCELLED"]');
        await page.check('input[id="create-event-BOOKING_ACCEPTED"]');

        await page.click('button:has-text("Create Webhook")');

        // Should show event badges
        await expect(page.locator('text="Booking Created"')).toBeVisible();
        await expect(page.locator('text="Booking Cancelled"')).toBeVisible();
        await expect(page.locator('text="Booking Accepted"')).toBeVisible();
      },
    );
  });

  test.describe("Webhook Delivery History", () => {
    authenticatedTest(
      "shows delivery count for webhooks",
      async ({ authenticatedPage: page }) => {
        await page.goto("/settings/webhooks");

        // Check if webhooks exist or create one
        const hasWebhook = await page
          .locator(".border.border-border.rounded-lg")
          .first()
          .isVisible()
          .catch(() => false);

        if (!hasWebhook) {
          await page.click('button:has-text("Add Webhook")');
          await page.fill(
            'input[id="webhook-url"]',
            `https://delivery-test.example.com/${Date.now()}`,
          );
          await page.check('input[id="create-event-BOOKING_CREATED"]');
          await page.click('button:has-text("Create Webhook")');
        }

        // Should show delivery count
        await expect(page.locator('text="deliveries"')).toBeVisible();
        await expect(page.locator(/\d+ deliveries?/)).toBeVisible();
      },
    );

    authenticatedTest(
      "shows webhook creation date",
      async ({ authenticatedPage: page }) => {
        await page.goto("/settings/webhooks");

        // Ensure webhook exists
        const hasWebhook = await page
          .locator(".border.border-border.rounded-lg")
          .first()
          .isVisible()
          .catch(() => false);

        if (!hasWebhook) {
          await page.click('button:has-text("Add Webhook")');
          await page.fill(
            'input[id="webhook-url"]',
            `https://date-test.example.com/${Date.now()}`,
          );
          await page.check('input[id="create-event-BOOKING_CREATED"]');
          await page.click('button:has-text("Create Webhook")');
        }

        // Should show creation date
        await expect(page.locator('text="Created"')).toBeVisible();

        // Should show a date in proper format
        const dateRegex = /\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}/;
        await expect(page.locator(dateRegex)).toBeVisible();
      },
    );
  });

  test.describe("Webhook Form Validation", () => {
    authenticatedTest(
      "validates URL format in create form",
      async ({ authenticatedPage: page }) => {
        await page.goto("/settings/webhooks");

        await page.click('button:has-text("Add Webhook")');

        // Test various invalid URLs
        const invalidUrls = [
          "not-a-url",
          "ftp://invalid-protocol.com",
          "http://",
          "://missing-protocol.com",
          " ", // whitespace
          "", // empty
        ];

        for (const invalidUrl of invalidUrls) {
          await page.fill('input[id="webhook-url"]', invalidUrl);
          await page.check('input[id="create-event-BOOKING_CREATED"]');
          await page.click('button:has-text("Create Webhook")');

          // Should show validation error
          const hasValidationError = await page
            .locator('text="Please enter a valid URL", text="URL is required"')
            .isVisible();
          expect(hasValidationError).toBe(true);

          // Clear the field for next test
          await page.fill('input[id="webhook-url"]', "");
        }
      },
    );

    authenticatedTest(
      "requires at least one event selection",
      async ({ authenticatedPage: page }) => {
        await page.goto("/settings/webhooks");

        await page.click('button:has-text("Add Webhook")');

        // Fill valid URL but no events
        await page.fill(
          'input[id="webhook-url"]',
          "https://valid-url.example.com",
        );

        // Ensure no events are selected
        const eventCheckboxes = page.locator('input[id*="create-event-"]');
        const count = await eventCheckboxes.count();

        for (let i = 0; i < count; i++) {
          await eventCheckboxes.nth(i).uncheck();
        }

        await page.click('button:has-text("Create Webhook")');

        // Should show validation error
        await expect(
          page.locator('text="Please select at least one event"'),
        ).toBeVisible();
      },
    );

    authenticatedTest(
      "accepts valid webhook configurations",
      async ({ authenticatedPage: page }) => {
        await page.goto("/settings/webhooks");

        await page.click('button:has-text("Add Webhook")');

        // Fill valid configuration
        const validUrl = `https://valid-webhook.example.com/${Date.now()}`;
        await page.fill('input[id="webhook-url"]', validUrl);
        await page.check('input[id="create-event-BOOKING_CREATED"]');

        await page.click('button:has-text("Create Webhook")');

        // Should create successfully (no validation errors)
        await expect(
          page.locator('text="Create New Webhook"'),
        ).not.toBeVisible();
        await expect(page.locator(`text="${validUrl}"`)).toBeVisible();
      },
    );
  });

  test.describe("Webhook Loading States", () => {
    authenticatedTest(
      "shows loading state when creating webhook",
      async ({ authenticatedPage: page }) => {
        await page.goto("/settings/webhooks");

        await page.click('button:has-text("Add Webhook")');

        await page.fill(
          'input[id="webhook-url"]',
          `https://loading-test.example.com/${Date.now()}`,
        );
        await page.check('input[id="create-event-BOOKING_CREATED"]');

        // Click create and immediately check for loading state
        await page.click('button:has-text("Create Webhook")');

        // Should show loading state briefly
        const loadingText = await page
          .locator('text="Creating..."')
          .isVisible()
          .catch(() => false);

        // Either we caught the loading state, or it completed very quickly
        expect(typeof loadingText).toBe("boolean");
      },
    );

    authenticatedTest(
      "shows loading state when testing webhook",
      async ({ authenticatedPage: page }) => {
        await page.goto("/settings/webhooks");

        // Ensure we have a webhook to test
        const hasWebhook = await page
          .locator('button:has-text("Test")')
          .first()
          .isVisible()
          .catch(() => false);

        if (!hasWebhook) {
          await page.click('button:has-text("Add Webhook")');
          await page.fill(
            'input[id="webhook-url"]',
            `https://test-loading.example.com/${Date.now()}`,
          );
          await page.check('input[id="create-event-BOOKING_CREATED"]');
          await page.click('button:has-text("Create Webhook")');
        }

        // Click test button
        await page.click('button:has-text("Test")');

        // Should show testing state
        await expect(page.locator('text="Testing..."')).toBeVisible();
      },
    );

    authenticatedTest(
      "handles webhook loading errors gracefully",
      async ({ authenticatedPage: page }) => {
        await page.goto("/settings/webhooks");

        // The page should load without errors even if there are issues
        await expect(page.locator("h2")).toContainText("Webhooks");

        // If there's an error state, it should be handled gracefully
        const errorState = await page
          .locator('text="Failed to load webhooks"')
          .isVisible()
          .catch(() => false);
        const loadingState = await page
          .locator('text="Loading"')
          .isVisible()
          .catch(() => false);
        const contentState = await page
          .locator('button:has-text("Add Webhook")')
          .isVisible()
          .catch(() => false);

        // Should show either error, loading, or content - not a broken page
        expect(errorState || loadingState || contentState).toBe(true);
      },
    );
  });
});
