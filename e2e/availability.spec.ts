import { test, expect } from "@playwright/test";
import { test as authTest } from "./fixtures/auth";

test.describe("Availability Management", () => {
  test.describe("Unauthenticated Access", () => {
    test("redirects to login when not authenticated", async ({ page }) => {
      await page.goto("/availability");

      // Should be redirected to login page
      await expect(page).toHaveURL("/login");
    });
  });

  test.describe("Authenticated Availability", () => {
    authTest(
      "loads availability page with correct content",
      async ({ authenticatedPage: page }) => {
        await page.goto("/availability");

        // Verify we're on the availability page
        await expect(page).toHaveURL("/availability");

        // Check main heading
        await expect(page.locator("h1")).toContainText("Availability");

        // Check description text
        await expect(
          page.locator(
            "text=Configure your weekly schedule and date-specific overrides",
          ),
        ).toBeVisible();
      },
    );

    authTest("displays schedules list", async ({ authenticatedPage: page }) => {
      await page.goto("/availability");

      // Wait for schedules to load
      await page.waitForSelector('[data-testid="schedule-card"]', {
        timeout: 10000,
      });

      // Check that schedules are displayed
      const scheduleCards = page.locator('[data-testid="schedule-card"]');
      await expect(scheduleCards).toHaveCount(2); // Demo should have 2 schedules

      // Check for schedule names from seed data
      await expect(page.locator('text="Business Hours"')).toBeVisible();
      await expect(page.locator('text="Extended Hours"')).toBeVisible();
    });

    authTest(
      "displays default schedule badge",
      async ({ authenticatedPage: page }) => {
        await page.goto("/availability");

        // Wait for content to load
        await page.waitForSelector('[data-testid="schedule-card"]');

        // Check for default badge on Business Hours schedule
        const businessHoursCard = page.locator(
          '[data-testid="schedule-card"]:has(text="Business Hours")',
        );
        await expect(businessHoursCard.locator('text="Default"')).toBeVisible();
      },
    );

    authTest(
      "can view schedule availability grid",
      async ({ authenticatedPage: page }) => {
        await page.goto("/availability");

        // Wait for content to load
        await page.waitForSelector('[data-testid="schedule-card"]');

        // Select the first schedule (Business Hours)
        await page
          .locator('[data-testid="schedule-card"]:has(text="Business Hours")')
          .click();

        // Wait for the schedule details to load
        await expect(
          page.locator('[data-testid="availability-grid"]'),
        ).toBeVisible();

        // Check that weekdays are displayed
        const dayLabels = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ];
        for (const day of dayLabels) {
          await expect(page.locator(`text="${day}"`)).toBeVisible();
        }

        // Check that time inputs are present for enabled days
        await expect(page.locator('input[type="time"]')).toHaveCount(10); // 5 days × 2 times (start/end)
      },
    );

    authTest(
      "can toggle day availability",
      async ({ authenticatedPage: page }) => {
        await page.goto("/availability");

        // Wait for content and select schedule
        await page.waitForSelector('[data-testid="schedule-card"]');
        await page
          .locator('[data-testid="schedule-card"]:has(text="Business Hours")')
          .click();
        await expect(
          page.locator('[data-testid="availability-grid"]'),
        ).toBeVisible();

        // Find Monday toggle switch
        const mondayToggle = page.locator('[data-testid="day-toggle-1"]'); // Monday = 1
        const initialState = await mondayToggle.isChecked();

        // Toggle the day
        await mondayToggle.click();

        // Wait for the toggle to change state
        await expect(mondayToggle).toHaveAttribute(
          "aria-checked",
          String(!initialState),
        );

        // Verify time inputs are shown/hidden accordingly
        if (!initialState) {
          // If we enabled the day, time inputs should be visible
          await expect(
            page.locator('[data-testid="start-time-1"]'),
          ).toBeVisible();
          await expect(
            page.locator('[data-testid="end-time-1"]'),
          ).toBeVisible();
        } else {
          // If we disabled the day, time inputs should be hidden
          await expect(
            page.locator('[data-testid="start-time-1"]'),
          ).not.toBeVisible();
          await expect(
            page.locator('[data-testid="end-time-1"]'),
          ).not.toBeVisible();
        }
      },
    );

    authTest("can modify time ranges", async ({ authenticatedPage: page }) => {
      await page.goto("/availability");

      // Wait for content and select schedule
      await page.waitForSelector('[data-testid="schedule-card"]');
      await page
        .locator('[data-testid="schedule-card"]:has(text="Business Hours")')
        .click();
      await expect(
        page.locator('[data-testid="availability-grid"]'),
      ).toBeVisible();

      // Ensure Monday is enabled
      const mondayToggle = page.locator('[data-testid="day-toggle-1"]');
      if (!(await mondayToggle.isChecked())) {
        await mondayToggle.click();
      }

      // Change start time for Monday
      const startTimeInput = page.locator('[data-testid="start-time-1"]');
      await startTimeInput.fill("08:00");

      // Change end time for Monday
      const endTimeInput = page.locator('[data-testid="end-time-1"]');
      await endTimeInput.fill("18:00");

      // Verify the values were set
      await expect(startTimeInput).toHaveValue("08:00");
      await expect(endTimeInput).toHaveValue("18:00");

      // Save the changes
      const saveButton = page.locator('button:has(text="Save Changes")');
      await expect(saveButton).toBeEnabled();
      await saveButton.click();

      // Wait for save confirmation
      await expect(
        page.locator('text="Schedule updated successfully"'),
      ).toBeVisible({ timeout: 5000 });
    });

    authTest(
      "can view and add date overrides",
      async ({ authenticatedPage: page }) => {
        await page.goto("/availability");

        // Wait for content and select schedule
        await page.waitForSelector('[data-testid="schedule-card"]');
        await page
          .locator('[data-testid="schedule-card"]:has(text="Business Hours")')
          .click();
        await expect(
          page.locator('[data-testid="availability-grid"]'),
        ).toBeVisible();

        // Look for date overrides section
        await expect(page.locator('text="Date Overrides"')).toBeVisible();

        // Check if "Add Date Override" button is present
        const addOverrideButton = page.locator(
          'button:has(text="Add Date Override")',
        );
        await expect(addOverrideButton).toBeVisible();

        // Click to add a date override
        await addOverrideButton.click();

        // Fill out the override form
        const dateInput = page.locator('input[type="date"]').last();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toISOString().split("T")[0];
        await dateInput.fill(tomorrowString);

        // Set override times or mark as unavailable
        const unavailableCheckbox = page
          .locator('input[type="checkbox"]:near(text="Unavailable")')
          .last();
        await unavailableCheckbox.check();

        // Save the override
        const saveOverrideButton = page.locator(
          'button:has(text="Save Override")',
        );
        await saveOverrideButton.click();

        // Verify override was added
        await expect(page.locator(`text="${tomorrowString}"`)).toBeVisible();
      },
    );

    authTest(
      "can delete date overrides",
      async ({ authenticatedPage: page }) => {
        await page.goto("/availability");

        // Wait for content and select schedule
        await page.waitForSelector('[data-testid="schedule-card"]');
        await page
          .locator('[data-testid="schedule-card"]:has(text="Business Hours")')
          .click();
        await expect(
          page.locator('[data-testid="availability-grid"]'),
        ).toBeVisible();

        // Look for existing date overrides
        const deleteButtons = page.locator(
          '[data-testid="delete-override-button"]',
        );
        const initialCount = await deleteButtons.count();

        if (initialCount > 0) {
          // Click first delete button
          await deleteButtons.first().click();

          // Confirm deletion if confirmation dialog appears
          const confirmButton = page
            .locator('button:has(text="Delete")')
            .last();
          if (await confirmButton.isVisible()) {
            await confirmButton.click();
          }

          // Verify one less override exists
          await expect(deleteButtons).toHaveCount(initialCount - 1);
        }
      },
    );

    authTest("can create new schedule", async ({ authenticatedPage: page }) => {
      await page.goto("/availability");

      // Wait for content to load
      await page.waitForSelector('[data-testid="schedule-card"]');

      // Click "Create Schedule" button
      const createButton = page.locator('button:has(text="Create Schedule")');
      await expect(createButton).toBeVisible();
      await createButton.click();

      // Fill out new schedule form
      await page.locator('input[name="name"]').fill("Test Schedule");

      // Select timezone
      const timezoneSelect = page.locator('select[name="timezone"]');
      await timezoneSelect.selectOption("America/Los_Angeles");

      // Save the new schedule
      const saveButton = page.locator('button:has(text="Create Schedule")');
      await saveButton.click();

      // Verify new schedule appears in list
      await expect(page.locator('text="Test Schedule"')).toBeVisible({
        timeout: 5000,
      });
    });

    authTest(
      "can switch between schedules",
      async ({ authenticatedPage: page }) => {
        await page.goto("/availability");

        // Wait for content to load
        await page.waitForSelector('[data-testid="schedule-card"]');

        // Get initial schedule count
        const scheduleCards = page.locator('[data-testid="schedule-card"]');
        const scheduleCount = await scheduleCards.count();
        expect(scheduleCount).toBeGreaterThan(1);

        // Click on first schedule
        await scheduleCards.first().click();
        await expect(
          page.locator('[data-testid="availability-grid"]'),
        ).toBeVisible();

        // Note the schedule name in the header
        const firstScheduleName = await page
          .locator('[data-testid="selected-schedule-name"]')
          .textContent();

        // Click on second schedule
        await scheduleCards.nth(1).click();
        await expect(
          page.locator('[data-testid="availability-grid"]'),
        ).toBeVisible();

        // Verify different schedule is selected
        const secondScheduleName = await page
          .locator('[data-testid="selected-schedule-name"]')
          .textContent();
        expect(firstScheduleName).not.toBe(secondScheduleName);
      },
    );

    authTest(
      "validates time range constraints",
      async ({ authenticatedPage: page }) => {
        await page.goto("/availability");

        // Wait for content and select schedule
        await page.waitForSelector('[data-testid="schedule-card"]');
        await page
          .locator('[data-testid="schedule-card"]:has(text="Business Hours")')
          .click();
        await expect(
          page.locator('[data-testid="availability-grid"]'),
        ).toBeVisible();

        // Ensure Monday is enabled
        const mondayToggle = page.locator('[data-testid="day-toggle-1"]');
        if (!(await mondayToggle.isChecked())) {
          await mondayToggle.click();
        }

        // Set invalid time range (end before start)
        await page.locator('[data-testid="start-time-1"]').fill("17:00");
        await page.locator('[data-testid="end-time-1"]').fill("09:00");

        // Try to save - should show error
        const saveButton = page.locator('button:has(text="Save Changes")');
        await saveButton.click();

        // Check for validation error
        await expect(
          page.locator('text="End time must be after start time"'),
        ).toBeVisible({ timeout: 3000 });
      },
    );

    authTest(
      "shows timezone information",
      async ({ authenticatedPage: page }) => {
        await page.goto("/availability");

        // Wait for content and select schedule
        await page.waitForSelector('[data-testid="schedule-card"]');
        await page
          .locator('[data-testid="schedule-card"]:has(text="Business Hours")')
          .click();
        await expect(
          page.locator('[data-testid="availability-grid"]'),
        ).toBeVisible();

        // Check that timezone is displayed
        await expect(page.locator('text="America/New_York"')).toBeVisible();
      },
    );
  });
});
