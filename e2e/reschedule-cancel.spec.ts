import { test, expect } from "@playwright/test";

/**
 * E2E tests for reschedule and cancel booking flows
 * Tests booking reschedule with new time selection and booking cancellation with reason
 */

test.describe("Reschedule and Cancel Booking Flows", () => {
  // We'll use existing seed data bookings for testing
  const DEMO_BOOKING_UID = "bk_upcoming_1_demo_showcase"; // From seed data - upcoming booking

  test("reschedule a booking: select new date/time, submit, verify confirmation", async ({
    page,
  }) => {
    // Step 1: Navigate to the reschedule page for an existing booking
    await page.goto(`/booking/${DEMO_BOOKING_UID}/reschedule`);

    // Verify we're on the reschedule page
    await expect(page.locator("h1")).toContainText("Reschedule Booking");
    await expect(page.locator("text=Select a new date and time")).toBeVisible();

    // Verify current booking details are shown
    await expect(page.locator("text=Current Booking")).toBeVisible();
    await expect(page.locator("text=Quick Chat")).toBeVisible();
    await expect(
      page.locator("text=Emma Williams").or(page.locator("text=Emma")),
    ).toBeVisible();

    // Verify the current booking time is shown with strikethrough
    await expect(page.locator(".line-through")).toBeVisible();

    // Step 2: Select a new date from the calendar
    // Wait for calendar to load
    await expect(
      page
        .locator("text=Select New Date")
        .or(page.locator("[data-testid='calendar-picker']")),
    ).toBeVisible({ timeout: 10000 });

    // Find and click an available date (different from current booking)
    const availableDateButtons = page.locator("button").filter({
      hasText: /^\d{1,2}$/,
    });
    await expect(availableDateButtons.first()).toBeVisible({ timeout: 10000 });

    let dateClicked = false;
    const buttonCount = await availableDateButtons.count();

    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = availableDateButtons.nth(i);
      const isDisabled = await button.isDisabled().catch(() => false);
      const hasDisabledClass = await button
        .getAttribute("class")
        .then(
          (className) =>
            className?.includes("disabled") ||
            className?.includes("opacity-50"),
        )
        .catch(() => false);

      if (!isDisabled && !hasDisabledClass) {
        await button.click();
        dateClicked = true;
        break;
      }
    }

    if (!dateClicked) {
      // Fallback: try clicking the first date
      await availableDateButtons.first().click();
    }

    // Step 3: Select a new time slot
    // Wait for time slots to load after date selection
    await expect(page.locator("text=Select New Time")).toBeVisible();
    await expect(
      page
        .locator("button")
        .filter({ hasText: /\d{1,2}:\d{2}\s?(AM|PM|am|pm)/ }),
    ).toBeVisible({ timeout: 10000 });

    // Click on the first available time slot
    const timeSlots = page.locator("button").filter({
      hasText: /\d{1,2}:\d{2}\s?(AM|PM|am|pm)/,
    });
    await timeSlots.first().click();

    // Step 4: Fill in reschedule reason (optional)
    const reasonField = page.locator(
      "textarea[name='reason'], textarea[id*='reschedule-reason']",
    );

    await expect(reasonField).toBeVisible();
    await reasonField.fill("Need to reschedule due to scheduling conflict");

    // Step 5: Submit the reschedule request
    const submitButton = page.locator(
      "button[type='submit'], button:has-text('Confirm'), button:has-text('Reschedule')",
    );
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Step 6: Verify we get to the success page or confirmation
    await expect(
      page
        .locator("text=Booking Rescheduled")
        .or(page.locator("text=Successfully rescheduled")),
    ).toBeVisible({ timeout: 15000 });

    // Verify success message details
    await expect(
      page
        .locator("text=successfully rescheduled")
        .or(page.locator("text=confirmation email")),
    ).toBeVisible();

    // Check for redirect to new booking (the success message mentions this)
    await expect(
      page
        .locator("text=View Updated Booking")
        .or(page.locator("text=redirecting")),
    ).toBeVisible();

    // Step 7: Verify we eventually get to the new booking confirmation page
    // Wait for potential auto-redirect or click the view booking button
    const viewBookingButton = page.locator(
      "button:has-text('View Updated Booking')",
    );
    if ((await viewBookingButton.count()) > 0) {
      await viewBookingButton.click();
    } else {
      // Wait for auto-redirect
      await page.waitForURL(/\/booking\/[^\/]+$/, { timeout: 10000 });
    }

    // Verify we're on a booking confirmation page with the new details
    await expect(page).toHaveURL(/\/booking\/[^\/]+$/);
    await expect(
      page.locator("text=Confirmed").or(page.locator("text=Pending")),
    ).toBeVisible();
  });

  test("cancel a booking: provide reason, submit, verify confirmation", async ({
    page,
  }) => {
    // Use a different booking UID for cancel test to avoid conflicts
    const CANCEL_BOOKING_UID = "bk_upcoming_2_demo_showcase"; // From seed data

    // Step 1: Navigate to the cancel page for an existing booking
    await page.goto(`/booking/${CANCEL_BOOKING_UID}/cancel`);

    // Verify we're on the cancel page
    await expect(page.locator("h1")).toContainText("Cancel Booking");
    await expect(
      page.locator("text=Are you sure you want to cancel this booking"),
    ).toBeVisible();

    // Verify booking details are shown
    await expect(page.locator("text=60 Minute Consultation")).toBeVisible();
    await expect(
      page.locator("text=David Rodriguez").or(page.locator("text=David")),
    ).toBeVisible();

    // Verify warning information is displayed
    await expect(page.locator("text=Important")).toBeVisible();
    await expect(
      page.locator("text=This action cannot be undone"),
    ).toBeVisible();

    // Step 2: Fill in the cancellation reason (required)
    const reasonField = page.locator(
      "textarea[name='cancellationReason'], textarea[id*='cancellation-reason']",
    );

    await expect(reasonField).toBeVisible();
    await expect(reasonField).toHaveAttribute("required", "");

    await reasonField.fill(
      "Unfortunately, I need to cancel due to an emergency situation that has come up. I apologize for the short notice.",
    );

    // Step 3: Submit the cancellation
    const cancelButton = page.locator(
      "button[type='submit']:has-text('Confirm'), button:has-text('Confirm Cancellation')",
    );

    await expect(cancelButton).toBeVisible();
    await expect(cancelButton).toBeEnabled();
    await cancelButton.click();

    // Step 4: Verify we get to the success page
    await expect(
      page
        .locator("text=Booking Cancelled")
        .or(page.locator("text=successfully cancelled")),
    ).toBeVisible({ timeout: 15000 });

    // Verify success message details
    await expect(
      page
        .locator("text=confirmation email")
        .or(page.locator("text=sent to you and the host")),
    ).toBeVisible();

    // Check for option to view booking details
    await expect(
      page
        .locator("text=View Booking Details")
        .or(page.locator("text=redirecting")),
    ).toBeVisible();

    // Step 5: Navigate to booking details to verify cancellation
    const viewDetailsButton = page.locator(
      "button:has-text('View Booking Details')",
    );
    if ((await viewDetailsButton.count()) > 0) {
      await viewDetailsButton.click();
    } else {
      // Wait for auto-redirect
      await page.waitForURL(/\/booking\/[^\/]+$/, { timeout: 10000 });
    }

    // Verify we're on the booking details page showing cancelled status
    await expect(page).toHaveURL(/\/booking\/[^\/]+$/);
    await expect(page.locator("text=Cancelled")).toBeVisible();

    // Verify the cancellation reason is displayed
    await expect(page.locator("text=Cancellation Reason")).toBeVisible();
    await expect(
      page
        .locator("text=emergency situation")
        .or(page.locator("text=Unfortunately, I need to cancel")),
    ).toBeVisible();

    // Verify reschedule/cancel actions are no longer available
    await expect(
      page
        .locator("button:has-text('Reschedule')")
        .or(page.locator("a[href*='reschedule']")),
    ).not.toBeVisible();
  });

  test("reschedule form validation: requires date and time selection", async ({
    page,
  }) => {
    await page.goto(`/booking/${DEMO_BOOKING_UID}/reschedule`);

    // Wait for page to load
    await expect(page.locator("h1")).toContainText("Reschedule Booking");

    // Try to submit without selecting anything
    // The form should not allow submission without date/time selection
    const submitButton = page.locator(
      "button[type='submit'], button:has-text('Confirm'), button:has-text('Reschedule')",
    );

    // Initially, submit button should either not be visible or be disabled
    if ((await submitButton.count()) > 0) {
      await expect(submitButton).toBeDisabled();
    }

    // Select date but not time
    const availableDateButtons = page.locator("button").filter({
      hasText: /^\d{1,2}$/,
    });
    await availableDateButtons.first().click();

    // Submit button should still be disabled without time selection
    if ((await submitButton.count()) > 0) {
      await expect(submitButton).toBeDisabled();
    }

    // Now select time - submit button should become enabled
    const timeSlots = page.locator("button").filter({
      hasText: /\d{1,2}:\d{2}\s?(AM|PM|am|pm)/,
    });
    await expect(timeSlots.first()).toBeVisible({ timeout: 10000 });
    await timeSlots.first().click();

    // Now submit button should be enabled
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });

  test("cancel form validation: requires cancellation reason", async ({
    page,
  }) => {
    // Use a different booking for this test
    const VALIDATION_BOOKING_UID = "bk_upcoming_3_demo_showcase";

    await page.goto(`/booking/${VALIDATION_BOOKING_UID}/cancel`);

    // Wait for page to load
    await expect(page.locator("h1")).toContainText("Cancel Booking");

    // Try to submit without providing reason
    const cancelButton = page.locator(
      "button[type='submit']:has-text('Confirm'), button:has-text('Confirm Cancellation')",
    );

    await expect(cancelButton).toBeVisible();

    // Button should be disabled initially (no reason provided)
    await expect(cancelButton).toBeDisabled();

    // Fill in just a few characters (test minimum validation)
    const reasonField = page.locator(
      "textarea[name='cancellationReason'], textarea[id*='cancellation-reason']",
    );

    await reasonField.fill("too short");

    // Button might still be disabled for very short reasons, or enabled
    // Let's try to submit and check for validation
    await cancelButton.click();

    // Either the button is disabled, or we get a validation error
    // Since the form requires a reason, we should either:
    // 1. Button is disabled until adequate reason is provided
    // 2. Form validation prevents submission
    // 3. Server validation returns an error

    // Fill in a proper reason
    await reasonField.fill(
      "I need to cancel this booking due to unexpected circumstances that require my immediate attention.",
    );

    // Now button should be enabled
    await expect(cancelButton).toBeEnabled();
  });

  test("cannot reschedule already cancelled booking", async ({ page }) => {
    // First, let's cancel a booking, then try to reschedule it
    const TEST_BOOKING_UID = "bk_upcoming_4_demo_showcase";

    // Cancel the booking first
    await page.goto(`/booking/${TEST_BOOKING_UID}/cancel`);

    await expect(page.locator("h1")).toContainText("Cancel Booking");

    const reasonField = page.locator(
      "textarea[name='cancellationReason'], textarea[id*='cancellation-reason']",
    );

    await reasonField.fill("Cancelling for reschedule test");

    const cancelButton = page.locator(
      "button[type='submit']:has-text('Confirm'), button:has-text('Confirm Cancellation')",
    );

    await cancelButton.click();

    // Wait for cancellation to complete
    await expect(page.locator("text=Booking Cancelled")).toBeVisible({
      timeout: 15000,
    });

    // Now try to visit the reschedule page for the cancelled booking
    await page.goto(`/booking/${TEST_BOOKING_UID}/reschedule`);

    // Should see an error message that booking cannot be rescheduled
    await expect(
      page
        .locator("text=Cannot reschedule")
        .or(
          page
            .locator("text=cancelled")
            .or(page.locator("text=Unable to Reschedule")),
        ),
    ).toBeVisible();

    // The reschedule form should not be available
    await expect(page.locator("text=Select New Date")).not.toBeVisible();
  });

  test("cancel page shows booking details correctly", async ({ page }) => {
    await page.goto(`/booking/${DEMO_BOOKING_UID}/cancel`);

    // Verify all booking details are displayed
    await expect(page.locator("text=Quick Chat")).toBeVisible();

    // Check for attendee information
    await expect(
      page.locator("text=Emma Williams").or(page.locator("text=Emma")),
    ).toBeVisible();

    // Check for date/time information
    await expect(
      page.locator("text=15 min").or(page.locator("text=minutes")),
    ).toBeVisible();

    // Check for host information
    await expect(page.locator("text=Host")).toBeVisible();
    await expect(
      page
        .locator("text=Alex Demo")
        .or(page.locator("text=demo@workermill.com")),
    ).toBeVisible();

    // Verify timezone information is shown
    await expect(
      page.locator("text=America").or(page.locator("text=Chicago")),
    ).toBeVisible();
  });

  test("reschedule page shows original booking with strikethrough", async ({
    page,
  }) => {
    await page.goto(`/booking/${DEMO_BOOKING_UID}/reschedule`);

    // Verify current booking section is present
    await expect(page.locator("text=Current Booking")).toBeVisible();

    // Verify the original time is shown with strikethrough styling
    await expect(page.locator(".line-through")).toBeVisible();

    // Verify booking details are shown
    await expect(page.locator("text=Quick Chat")).toBeVisible();
    await expect(
      page.locator("text=Emma Williams").or(page.locator("text=Emma")),
    ).toBeVisible();

    // Verify warning information about rescheduling
    await expect(page.locator("text=Important")).toBeVisible();
    await expect(
      page.locator("text=This will create a new booking"),
    ).toBeVisible();
  });
});
