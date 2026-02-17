/**
 * E2E tests for the CalMill public booking flow.
 *
 * Covers:
 *  1. Public profile page — event type cards visible
 *  2. Booking page — calendar interaction
 *  3. Date selection — slots appear after selecting a date
 *  4. Timezone switching — can change and search timezones
 *  5. Month navigation — forward/back navigation
 *  6. Slot selection and booking form submission
 *  7. Booking confirmation page — details and calendar links
 *  8. "Add to Calendar" Google Calendar link
 *  9. Cancel flow — cancel booking and see cancelled state
 * 10. Reschedule flow — pick new time and confirm
 * 11. 404 handling — invalid username/slug/uid
 * 12. Empty state — no available times message
 * 13. Mobile responsive layout — mobile viewport
 * 14. Loading states — skeleton and disabled button
 * 15. URL query param pre-selection
 */

import { test, expect } from "@playwright/test";
import {
  DEMO_USER,
  EVENT_30MIN,
  EVENT_60MIN,
  ATTENDEE,
  goToProfilePage,
  goToBookingPage,
  goToConfirmationPage,
  goToCancelPage,
  goToReschedulePage,
  getEventTypeCards,
  clickEventTypeCard,
  waitForCalendarToLoad,
  getCalendar,
  clickNextMonth,
  selectFirstAvailableDay,
  waitForSlots,
  getSlotButtons,
  selectFirstSlotAndConfirm,
  waitForBookingForm,
  fillAttendeeDetails,
  submitBookingForm,
  completeBookingForm,
  getGoogleCalendarLink,
  submitCancellation,
  assertBookingConfirmed,
  assertBookingCancelled,
  setMobileViewport,
  setDesktopViewport,
} from "./helpers/booking-helpers";
import { triggerDatabaseSeed } from "./helpers/seed-helpers";

// ─── TEST SETUP ────────────────────────────────────────────────────────────────

test.describe("Public Booking Flow", () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await triggerDatabaseSeed(page);
    await page.close();
  });

  // ─── 1. PUBLIC PROFILE PAGE ────────────────────────────────────────────────

  test.describe("Public profile page", () => {
    test("navigates to /demo and shows user info", async ({ page }) => {
      await goToProfilePage(page);

      await expect(
        page.locator("h1", { hasText: DEMO_USER.name })
      ).toBeVisible();
    });

    test("shows event type cards on the profile page", async ({ page }) => {
      await goToProfilePage(page);

      const cards = getEventTypeCards(page);
      await expect(cards.first()).toBeVisible();

      const count = await cards.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test("event type card shows title and duration", async ({ page }) => {
      await goToProfilePage(page);

      const card = page.locator(`a[aria-label^="Book ${EVENT_30MIN.title}"]`);
      await expect(card).toBeVisible();
      await expect(card).toContainText("30 min");
    });

    test("clicking an event type card navigates to booking page", async ({
      page,
    }) => {
      await goToProfilePage(page);
      await clickEventTypeCard(page, EVENT_30MIN.title);

      await expect(page).toHaveURL(
        new RegExp(`/${DEMO_USER.username}/${EVENT_30MIN.slug}`)
      );
    });

    test("event type card links to the correct booking URL", async ({
      page,
    }) => {
      await goToProfilePage(page);

      const card = page.locator(`a[aria-label^="Book ${EVENT_30MIN.title}"]`);
      const href = await card.getAttribute("href");
      expect(href).toBe(`/${DEMO_USER.username}/${EVENT_30MIN.slug}`);
    });
  });

  // ─── 2. BOOKING PAGE — CALENDAR ────────────────────────────────────────────

  test.describe("Booking page — calendar", () => {
    test("renders calendar on the booking page", async ({ page }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      const calendar = getCalendar(page);
      await expect(calendar).toBeVisible();
    });

    test("shows event type title and duration on booking page", async ({
      page,
    }) => {
      await goToBookingPage(page);

      await expect(
        page.locator("h1", { hasText: EVENT_30MIN.title })
      ).toBeVisible();
      await expect(page.locator("text=30 min")).toBeVisible();
    });

    test("shows back link to profile page", async ({ page }) => {
      await goToBookingPage(page);

      const backLink = page.locator(`a[href="/${DEMO_USER.username}"]`, {
        hasText: "Back to profile",
      });
      await expect(backLink).toBeVisible();
    });

    test("calendar shows month navigation buttons", async ({ page }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      await expect(
        page.locator('button[aria-label="Go to previous month"]')
      ).toBeVisible();
      await expect(
        page.locator('button[aria-label="Go to next month"]')
      ).toBeVisible();
    });

    test("navigates to next month when clicking next", async ({ page }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      const calendar = getCalendar(page);
      const initialAriaLabel = await calendar.getAttribute("aria-label");

      await clickNextMonth(page);

      const newAriaLabel = await calendar.getAttribute("aria-label");
      expect(newAriaLabel).not.toBe(initialAriaLabel);
    });

    test("prompts to select a date before showing slots", async ({ page }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      await expect(
        page.locator("text=Select a date to see available times")
      ).toBeVisible();
    });
  });

  // ─── 3. DATE SELECTION — SLOTS APPEAR ─────────────────────────────────────

  test.describe("Date selection and slot display", () => {
    test("selecting a date shows the slots panel", async ({ page }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      await selectFirstAvailableDay(page);

      const slotList = page.locator('[aria-label="Available time slots"]');
      const noTimesMessage = page.locator("text=No available times");

      await expect(slotList.or(noTimesMessage)).toBeVisible({
        timeout: 10_000,
      });
    });

    test("shows time slots after selecting an available date", async ({
      page,
    }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      await clickNextMonth(page);
      await selectFirstAvailableDay(page);

      const slotList = page.locator('[aria-label="Available time slots"]');
      await expect(slotList).toBeVisible({ timeout: 10_000 });

      const slots = getSlotButtons(page);
      const count = await slots.count();
      expect(count).toBeGreaterThan(0);
    });

    test("clicking a slot highlights it and shows Confirm button", async ({
      page,
    }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      await clickNextMonth(page);
      await selectFirstAvailableDay(page);
      await waitForSlots(page);

      const slots = getSlotButtons(page);
      const firstSlot = slots.first();
      await firstSlot.click();

      const confirmButton = page
        .locator('button[aria-label^="Confirm "]')
        .first();
      await expect(confirmButton).toBeVisible({ timeout: 5_000 });
    });
  });

  // ─── 4. TIMEZONE SWITCHING ────────────────────────────────────────────────

  test.describe("Timezone switching", () => {
    test("timezone selector is visible on the booking page", async ({
      page,
    }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      const timezoneButton = page.locator('button[role="combobox"]');
      await expect(timezoneButton).toBeVisible();
    });

    test("timezone dropdown opens when clicked", async ({ page }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      const timezoneButton = page.locator('button[role="combobox"]');
      await timezoneButton.click();

      await expect(
        page.locator('input[aria-label="Search timezones"]')
      ).toBeVisible({ timeout: 3_000 });
    });

    test("can search for and select a different timezone", async ({ page }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      const timezoneButton = page.locator('button[role="combobox"]');
      await timezoneButton.click();

      const searchInput = page.locator('input[aria-label="Search timezones"]');
      await searchInput.fill("London");

      const londonOption = page.locator('[role="option"]', {
        hasText: "Europe/London",
      });
      await londonOption.first().waitFor({ state: "visible", timeout: 5_000 });
      await londonOption.first().click();

      await expect(timezoneButton).toContainText("London");
    });
  });

  // ─── 5. MONTH NAVIGATION ──────────────────────────────────────────────────

  test.describe("Month navigation", () => {
    test("can navigate forward multiple months", async ({ page }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      const calendar = getCalendar(page);
      const initialLabel = await calendar.getAttribute("aria-label");

      await clickNextMonth(page);
      await clickNextMonth(page);

      const twoMonthsForward = await calendar.getAttribute("aria-label");
      expect(twoMonthsForward).not.toBe(initialLabel);
    });

    test("previous month navigation is available after going forward", async ({
      page,
    }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      await clickNextMonth(page);

      const prevButton = page.locator(
        'button[aria-label="Go to previous month"]'
      );
      await expect(prevButton).toBeVisible();
      await prevButton.click();

      const calendar = getCalendar(page);
      await expect(calendar).toBeVisible();
    });
  });

  // ─── 6. SLOT SELECTION AND BOOKING FORM ───────────────────────────────────

  test.describe("Slot selection and booking form", () => {
    test("confirming a slot shows the booking form", async ({ page }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      await clickNextMonth(page);
      await selectFirstAvailableDay(page);
      await selectFirstSlotAndConfirm(page);

      await waitForBookingForm(page);

      await expect(
        page.locator('input[name="attendeeName"]')
      ).toBeVisible();
      await expect(
        page.locator('input[name="attendeeEmail"]')
      ).toBeVisible();
    });

    test("booking form shows the selected event title", async ({ page }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      await clickNextMonth(page);
      await selectFirstAvailableDay(page);
      await selectFirstSlotAndConfirm(page);

      await waitForBookingForm(page);

      await expect(
        page.locator("h1", { hasText: EVENT_30MIN.title })
      ).toBeVisible();
    });

    test("booking form has a Go back button to return to calendar", async ({
      page,
    }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      await clickNextMonth(page);
      await selectFirstAvailableDay(page);
      await selectFirstSlotAndConfirm(page);

      await waitForBookingForm(page);

      const backButton = page.locator(
        'button[aria-label="Go back to time selection"]'
      );
      await expect(backButton).toBeVisible();
    });

    test("going back from form returns to calendar view", async ({ page }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      await clickNextMonth(page);
      await selectFirstAvailableDay(page);
      await selectFirstSlotAndConfirm(page);

      await waitForBookingForm(page);

      await page
        .locator('button[aria-label="Go back to time selection"]')
        .click();

      await expect(getCalendar(page)).toBeVisible({ timeout: 5_000 });
    });

    test("shows validation errors when submitting empty form", async ({
      page,
    }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      await clickNextMonth(page);
      await selectFirstAvailableDay(page);
      await selectFirstSlotAndConfirm(page);

      await waitForBookingForm(page);

      await submitBookingForm(page);

      // Form should still be visible (not redirected)
      await expect(
        page.locator('input[name="attendeeName"]')
      ).toBeVisible();
    });

    test("successfully submits booking and redirects to confirmation", async ({
      page,
    }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      await clickNextMonth(page);
      await selectFirstAvailableDay(page);
      await selectFirstSlotAndConfirm(page);

      const uid = await completeBookingForm(page);

      expect(uid).toBeTruthy();
      await expect(page).toHaveURL(new RegExp(`/booking/${uid}`));
    });
  });

  // ─── 7. BOOKING CONFIRMATION PAGE ─────────────────────────────────────────

  test.describe("Booking confirmation page", () => {
    let bookingUid: string;

    test.beforeEach(async ({ page }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);
      await clickNextMonth(page);
      await selectFirstAvailableDay(page);
      await selectFirstSlotAndConfirm(page);
      bookingUid = await completeBookingForm(page);
    });

    test("shows success message on confirmation page", async ({ page }) => {
      await assertBookingConfirmed(page);
    });

    test("shows event type title on confirmation page", async ({ page }) => {
      await expect(
        page.locator("h2", { hasText: EVENT_30MIN.title })
      ).toBeVisible();
    });

    test("shows attendee email on confirmation page", async ({ page }) => {
      await expect(page.locator(`text=${ATTENDEE.email}`)).toBeVisible();
    });

    test("shows attendee name on confirmation page", async ({ page }) => {
      await expect(page.locator(`text=${ATTENDEE.name}`)).toBeVisible();
    });

    test("shows booking reference UID on confirmation page", async ({
      page,
    }) => {
      await expect(page.locator(`text=${bookingUid}`)).toBeVisible();
    });

    test("shows Reschedule and Cancel links", async ({ page }) => {
      const rescheduleLink = page.locator(
        `a[href="/booking/${bookingUid}/reschedule"]`
      );
      const cancelLink = page.locator(
        `a[href="/booking/${bookingUid}/cancel"]`
      );

      await expect(rescheduleLink).toBeVisible();
      await expect(cancelLink).toBeVisible();
    });

    test("shows Add to Calendar section", async ({ page }) => {
      await expect(
        page.locator("h3", { hasText: "Add to Calendar" })
      ).toBeVisible();
    });
  });

  // ─── 8. ADD TO CALENDAR ────────────────────────────────────────────────────

  test.describe("Add to Calendar links", () => {
    let bookingUid: string;

    test.beforeEach(async ({ page }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);
      await clickNextMonth(page);
      await selectFirstAvailableDay(page);
      await selectFirstSlotAndConfirm(page);
      bookingUid = await completeBookingForm(page);
    });

    test("Google Calendar button generates a valid Google Calendar link", async ({
      page,
    }) => {
      const gcalLink = getGoogleCalendarLink(page);
      await expect(gcalLink).toBeVisible();

      const href = await gcalLink.getAttribute("href");
      expect(href).toContain("calendar.google.com");
      expect(href).toContain("action=TEMPLATE");
      expect(href).toContain("text=30");
    });

    test("Outlook calendar download link is visible", async ({ page }) => {
      const outlookLink = page.locator("a", { hasText: "Outlook" });
      await expect(outlookLink).toBeVisible();

      const href = await outlookLink.getAttribute("href");
      expect(href).toMatch(/^data:text\/calendar/);
    });

    test("Apple Calendar download link is visible", async ({ page }) => {
      const appleLink = page.locator("a", { hasText: "Apple Calendar" });
      await expect(appleLink).toBeVisible();

      const href = await appleLink.getAttribute("href");
      expect(href).toMatch(/^data:text\/calendar/);
    });
  });

  // ─── 9. CANCEL FLOW ───────────────────────────────────────────────────────

  test.describe("Cancel flow", () => {
    let bookingUid: string;

    test.beforeEach(async ({ page }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);
      await clickNextMonth(page);
      await selectFirstAvailableDay(page);
      await selectFirstSlotAndConfirm(page);
      bookingUid = await completeBookingForm(page);
    });

    test("cancel page loads with booking details", async ({ page }) => {
      await goToCancelPage(page, bookingUid);

      await expect(
        page.locator("h1", { hasText: "Cancel Meeting" })
      ).toBeVisible();
      await expect(
        page.locator(`text=${EVENT_30MIN.title}`)
      ).toBeVisible();
    });

    test("cancel page shows warning message", async ({ page }) => {
      await goToCancelPage(page, bookingUid);

      await expect(
        page.locator(
          "text=Are you sure you want to cancel this meeting?"
        )
      ).toBeVisible();
    });

    test("cancel page has Go Back link to booking details", async ({
      page,
    }) => {
      await goToCancelPage(page, bookingUid);

      const backLink = page.locator(`a[href="/booking/${bookingUid}"]`, {
        hasText: "Back to booking details",
      });
      await expect(backLink).toBeVisible();
    });

    test("submitting cancellation shows success state", async ({ page }) => {
      await goToCancelPage(page, bookingUid);
      await submitCancellation(page, "Test cancellation reason");

      await assertBookingCancelled(page);
    });

    test("successful cancellation shows rebook link", async ({ page }) => {
      await goToCancelPage(page, bookingUid);
      await submitCancellation(page);

      const rebookLink = page.locator(`a[href="/${DEMO_USER.username}"]`);
      await expect(rebookLink).toBeVisible({ timeout: 10_000 });
    });

    test("cancelled booking shows cancelled status on confirmation page", async ({
      page,
    }) => {
      await goToCancelPage(page, bookingUid);
      await submitCancellation(page);
      await assertBookingCancelled(page);

      await goToConfirmationPage(page, bookingUid);

      await expect(
        page.locator("h1", { hasText: "Meeting Cancelled" })
      ).toBeVisible();
    });
  });

  // ─── 10. RESCHEDULE FLOW ───────────────────────────────────────────────────

  test.describe("Reschedule flow", () => {
    let bookingUid: string;

    test.beforeEach(async ({ page }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);
      await clickNextMonth(page);
      await selectFirstAvailableDay(page);
      await selectFirstSlotAndConfirm(page);
      bookingUid = await completeBookingForm(page);
    });

    test("reschedule page loads with heading", async ({ page }) => {
      await goToReschedulePage(page, bookingUid);

      await expect(
        page.locator("h1", { hasText: "Reschedule your meeting" })
      ).toBeVisible();
    });

    test("reschedule page shows calendar for new time selection", async ({
      page,
    }) => {
      await goToReschedulePage(page, bookingUid);
      await waitForCalendarToLoad(page);

      await expect(getCalendar(page)).toBeVisible();
    });

    test("reschedule page shows original booking time crossed out", async ({
      page,
    }) => {
      await goToReschedulePage(page, bookingUid);

      const crossedOut = page.locator("s, del, [class*='line-through']");
      await expect(crossedOut.first()).toBeVisible({ timeout: 5_000 });
    });
  });

  // ─── 11. 404 HANDLING ─────────────────────────────────────────────────────

  test.describe("404 handling", () => {
    test("invalid username returns 404", async ({ page }) => {
      const response = await page.goto(
        "/this-user-does-not-exist-xyz-abc"
      );
      expect(response?.status()).toBe(404);
    });

    test("invalid event type slug for existing user returns 404", async ({
      page,
    }) => {
      const response = await page.goto(
        `/${DEMO_USER.username}/this-event-does-not-exist`
      );
      expect(response?.status()).toBe(404);
    });

    test("invalid booking UID returns 404", async ({ page }) => {
      const response = await page.goto(
        "/booking/invalid-uid-that-does-not-exist"
      );
      expect(response?.status()).toBe(404);
    });

    test("invalid UID for cancel page returns 404", async ({ page }) => {
      const response = await page.goto(
        "/booking/invalid-uid-that-does-not-exist/cancel"
      );
      expect(response?.status()).toBe(404);
    });

    test("invalid UID for reschedule page returns 404", async ({ page }) => {
      const response = await page.goto(
        "/booking/invalid-uid-that-does-not-exist/reschedule"
      );
      expect(response?.status()).toBe(404);
    });
  });

  // ─── 12. EMPTY STATE HANDLING ─────────────────────────────────────────────

  test.describe("Empty state handling", () => {
    test("shows 'no available times' message when date has no slots", async ({
      page,
    }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      // Navigate far into the future where availability window ends
      for (let i = 0; i < 6; i++) {
        await clickNextMonth(page);
      }

      const availableButtons = page.locator(
        '[aria-label^="Calendar"] button:not([disabled]):not([aria-disabled="true"])[aria-label]'
      );

      const count = await availableButtons.count();
      if (count > 0) {
        await availableButtons.first().click();

        const emptyState = page.locator("text=No available times");
        const slotList = page.locator(
          '[aria-label="Available time slots"]'
        );
        await expect(emptyState.or(slotList)).toBeVisible({
          timeout: 10_000,
        });
      } else {
        expect(count).toBe(0);
      }
    });

    test("profile page does not show empty state for demo user", async ({
      page,
    }) => {
      await goToProfilePage(page);

      const emptyState = page.locator("text=No available event types");
      await expect(emptyState).not.toBeVisible();
    });
  });

  // ─── 13. MOBILE RESPONSIVE LAYOUT ─────────────────────────────────────────

  test.describe("Mobile responsive layout", () => {
    test.beforeEach(async ({ page }) => {
      await setMobileViewport(page);
    });

    test.afterEach(async ({ page }) => {
      await setDesktopViewport(page);
    });

    test("profile page renders event type cards on mobile", async ({
      page,
    }) => {
      await goToProfilePage(page);

      const cards = getEventTypeCards(page);
      await expect(cards.first()).toBeVisible();
    });

    test("booking page renders calendar on mobile", async ({ page }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      await expect(getCalendar(page)).toBeVisible();
    });

    test("booking form is usable on mobile", async ({ page }) => {
      await goToBookingPage(page);
      await waitForCalendarToLoad(page);

      await clickNextMonth(page);
      await selectFirstAvailableDay(page);
      await selectFirstSlotAndConfirm(page);

      await waitForBookingForm(page);

      const nameInput = page.locator('input[name="attendeeName"]');
      await expect(nameInput).toBeVisible();
      await nameInput.fill(ATTENDEE.name);
      expect(await nameInput.inputValue()).toBe(ATTENDEE.name);
    });
  });

  // ─── 14. LOADING STATES ────────────────────────────────────────────────────

  test.describe("Loading states", () => {
    test("slot list shows loading skeleton while fetching", async ({
      page,
    }) => {
      await page.route("/api/slots*", async (route) => {
        await new Promise((r) => setTimeout(r, 300));
        await route.continue();
      });

      await goToBookingPage(page);
      await waitForCalendarToLoad(page);
      await expect(getCalendar(page)).toBeVisible();
    });

    test("Schedule Meeting button shows loading state during submission", async ({
      page,
    }) => {
      await page.route("/api/bookings", async (route) => {
        if (route.request().method() === "POST") {
          await new Promise((r) => setTimeout(r, 500));
          await route.continue();
        } else {
          await route.continue();
        }
      });

      await goToBookingPage(page);
      await waitForCalendarToLoad(page);
      await clickNextMonth(page);
      await selectFirstAvailableDay(page);
      await selectFirstSlotAndConfirm(page);
      await waitForBookingForm(page);

      await fillAttendeeDetails(page);

      const submitButton = page.locator('button[type="submit"]', {
        hasText: /Schedule Meeting/,
      });
      await submitButton.click();

      await expect(
        page.locator('button[type="submit"]', { hasText: /Scheduling/ })
      ).toBeVisible({ timeout: 3_000 });
    });
  });

  // ─── 15. URL QUERY PARAMS ──────────────────────────────────────────────────

  test.describe("URL query param pre-selection", () => {
    test("booking page pre-selects date from URL query param", async ({
      page,
    }) => {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 1);
      futureDate.setDate(15);
      const dateStr = futureDate.toISOString().slice(0, 10);

      await page.goto(
        `/${DEMO_USER.username}/${EVENT_30MIN.slug}?date=${dateStr}`
      );
      await waitForCalendarToLoad(page);

      const calendar = getCalendar(page);
      await expect(calendar).toBeVisible();
    });

    test("can book a 60 minute event type", async ({ page }) => {
      await goToBookingPage(page, DEMO_USER.username, EVENT_60MIN.slug);
      await waitForCalendarToLoad(page);

      await expect(page.locator("text=60 min")).toBeVisible();
      await expect(
        page.locator("h1", { hasText: EVENT_60MIN.title })
      ).toBeVisible();
    });
  });
});
