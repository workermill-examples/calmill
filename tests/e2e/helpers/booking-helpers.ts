/**
 * Booking flow E2E test helpers for CalMill.
 *
 * Provides typed page-object utilities for navigating the public booking
 * experience without coupling tests to brittle CSS selectors.
 */

import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

/** Demo user credentials and slug set up by prisma/seed.ts */
export const DEMO_USER = {
  username: "demo",
  name: "Alex Demo",
  email: "demo@workermill.com",
} as const;

/** The 30-minute event type created by the seed script */
export const EVENT_30MIN = {
  slug: "30min",
  title: "30 Minute Meeting",
  duration: 30,
} as const;

/** The 60-minute event type created by the seed script */
export const EVENT_60MIN = {
  slug: "60min",
  title: "60 Minute Consultation",
  duration: 60,
} as const;

/** Sample attendee data used for booking form submission */
export const ATTENDEE = {
  name: "Test Attendee",
  email: "testattendee@example.com",
  notes: "These are test notes for the booking",
} as const;

// ─── PROFILE PAGE HELPERS ─────────────────────────────────────────────────────

/**
 * Navigate to the public profile page for a username.
 */
export async function goToProfilePage(page: Page, username = DEMO_USER.username) {
  await page.goto(`/${username}`);
}

/**
 * Get all event type card links on the profile page.
 */
export function getEventTypeCards(page: Page): Locator {
  // Cards are <a> elements with aria-label starting with "Book "
  return page.locator('a[aria-label^="Book "]');
}

/**
 * Click the event type card matching the given title.
 */
export async function clickEventTypeCard(page: Page, title: string) {
  await page.locator(`a[aria-label^="Book ${title}"]`).click();
}

// ─── BOOKING PAGE HELPERS ─────────────────────────────────────────────────────

/**
 * Navigate directly to the booking page for a user/event-type combo.
 */
export async function goToBookingPage(
  page: Page,
  username = DEMO_USER.username,
  slug = EVENT_30MIN.slug
) {
  await page.goto(`/${username}/${slug}`);
}

/**
 * Wait for the calendar to finish loading (skeleton gone, grid visible).
 */
export async function waitForCalendarToLoad(page: Page) {
  // The loading skeleton has role="status" with aria-label="Loading calendar"
  await page.locator('[aria-label="Loading calendar"]').waitFor({ state: "hidden", timeout: 15_000 });
  // Then the real calendar should be visible
  await page.locator('[aria-label^="Calendar"]').waitFor({ state: "visible", timeout: 10_000 });
}

/**
 * Returns the calendar grid locator.
 */
export function getCalendar(page: Page): Locator {
  return page.locator('[aria-label^="Calendar"]');
}

/**
 * Click the "Go to previous month" button in the calendar.
 */
export async function clickPrevMonth(page: Page) {
  await page.locator('button[aria-label="Go to previous month"]').click();
}

/**
 * Click the "Go to next month" button in the calendar.
 */
export async function clickNextMonth(page: Page) {
  await page.locator('button[aria-label="Go to next month"]').click();
}

/**
 * Get all clickable (available) day buttons within the calendar grid.
 * Available days are enabled buttons inside the calendar month grid.
 */
export function getAvailableDayButtons(page: Page): Locator {
  return page
    .locator('[aria-label^="Calendar"] [aria-label][role="gridcell"] button:not([disabled])')
    .filter({ hasNot: page.locator('[aria-disabled="true"]') });
}

/**
 * Select the first available day in the current calendar month.
 * Returns the date string (YYYY-MM-DD) that was selected.
 */
export async function selectFirstAvailableDay(page: Page): Promise<string> {
  await waitForCalendarToLoad(page);

  // Get all day buttons — available ones have normal (non-aria-disabled) state
  // The calendar renders day buttons with aria-label like "Monday, February 17, 2026"
  // Past and unavailable days have aria-disabled="true" or are disabled
  const availableButtons = page.locator(
    '[aria-label^="Calendar"] button[aria-label]:not([disabled]):not([aria-disabled="true"])'
  );

  const count = await availableButtons.count();
  if (count === 0) {
    throw new Error("No available days found in the calendar");
  }

  // Click first available day
  const firstButton = availableButtons.first();
  const ariaLabel = await firstButton.getAttribute("aria-label");
  await firstButton.click();

  return ariaLabel ?? "";
}

// ─── SLOT LIST HELPERS ────────────────────────────────────────────────────────

/**
 * Wait for the slot list to become visible and populated.
 */
export async function waitForSlots(page: Page) {
  // Slot list uses role="listbox" aria-label="Available time slots"
  await page
    .locator('[aria-label="Available time slots"]')
    .waitFor({ state: "visible", timeout: 10_000 });
}

/**
 * Get all slot option buttons in the slot list.
 */
export function getSlotButtons(page: Page): Locator {
  return page.locator('[role="option"]');
}

/**
 * Select the first available time slot and click confirm.
 * Returns the slot time label.
 */
export async function selectFirstSlotAndConfirm(page: Page): Promise<string> {
  await waitForSlots(page);

  const slots = getSlotButtons(page);
  const count = await slots.count();

  if (count === 0) {
    throw new Error("No time slots found in slot list");
  }

  const firstSlot = slots.first();
  const slotText = (await firstSlot.textContent()) ?? "";
  await firstSlot.click();

  // After clicking a slot, a confirm button should appear
  const confirmButton = page.locator(`button[aria-label^="Confirm "]`).first();
  await confirmButton.waitFor({ state: "visible", timeout: 5_000 });
  await confirmButton.click();

  return slotText.trim();
}

// ─── TIMEZONE HELPERS ─────────────────────────────────────────────────────────

/**
 * Get the timezone selector combobox.
 */
export function getTimezoneCombobox(page: Page): Locator {
  return page.locator('[role="combobox"][aria-label*="imezone"]');
}

/**
 * Open the timezone selector and search for a timezone string.
 */
export async function searchTimezone(page: Page, searchText: string) {
  const combobox = getTimezoneCombobox(page);
  await combobox.click();
  // Clear existing value and type search
  await combobox.fill(searchText);
}

// ─── BOOKING FORM HELPERS ─────────────────────────────────────────────────────

/**
 * Wait for the booking form to become visible (after slot confirmation).
 */
export async function waitForBookingForm(page: Page) {
  await page
    .locator('form button[type="submit"]')
    .waitFor({ state: "visible", timeout: 10_000 });
}

/**
 * Fill the attendee name and email fields.
 */
export async function fillAttendeeDetails(
  page: Page,
  name = ATTENDEE.name,
  email = ATTENDEE.email,
  notes?: string
) {
  await page.locator('input[name="attendeeName"]').fill(name);
  await page.locator('input[name="attendeeEmail"]').fill(email);
  if (notes) {
    await page.locator('textarea[name="attendeeNotes"]').fill(notes);
  }
}

/**
 * Submit the booking form by clicking "Schedule Meeting".
 */
export async function submitBookingForm(page: Page) {
  await page.locator('button[type="submit"]', { hasText: "Schedule Meeting" }).click();
}

/**
 * Fill form and submit, waiting for the confirmation redirect.
 * Returns the booking UID extracted from the URL.
 */
export async function completeBookingForm(
  page: Page,
  name = ATTENDEE.name,
  email = ATTENDEE.email
): Promise<string> {
  await waitForBookingForm(page);
  await fillAttendeeDetails(page, name, email);
  await submitBookingForm(page);

  // Wait for redirect to /booking/[uid]
  await page.waitForURL(/\/booking\/[^/]+$/, { timeout: 15_000 });

  const url = page.url();
  const match = url.match(/\/booking\/([^/]+)$/);
  return match?.[1] ?? "";
}

// ─── CONFIRMATION PAGE HELPERS ────────────────────────────────────────────────

/**
 * Navigate directly to a booking confirmation page.
 */
export async function goToConfirmationPage(page: Page, uid: string) {
  await page.goto(`/booking/${uid}`);
}

/**
 * Get the "Add to Calendar" section locator.
 */
export function getAddToCalendarSection(page: Page): Locator {
  return page.locator('h3', { hasText: "Add to Calendar" });
}

/**
 * Get the Google Calendar link.
 */
export function getGoogleCalendarLink(page: Page): Locator {
  return page.locator('a[href*="calendar.google.com"]');
}

// ─── CANCEL PAGE HELPERS ──────────────────────────────────────────────────────

/**
 * Navigate to the booking cancel page.
 */
export async function goToCancelPage(page: Page, uid: string) {
  await page.goto(`/booking/${uid}/cancel`);
}

/**
 * Submit the cancellation form (clicking "Cancel Meeting" button).
 */
export async function submitCancellation(page: Page, reason?: string) {
  if (reason) {
    await page.locator("textarea#cancel-reason").fill(reason);
  }
  await page.locator('button', { hasText: "Cancel Meeting" }).click();
}

// ─── RESCHEDULE PAGE HELPERS ──────────────────────────────────────────────────

/**
 * Navigate to the booking reschedule page.
 */
export async function goToReschedulePage(page: Page, uid: string) {
  await page.goto(`/booking/${uid}/reschedule`);
}

// ─── MOBILE HELPERS ───────────────────────────────────────────────────────────

/**
 * Set the viewport to a mobile size (iPhone SE equivalent).
 */
export async function setMobileViewport(page: Page) {
  await page.setViewportSize({ width: 375, height: 667 });
}

/**
 * Set the viewport to a desktop size.
 */
export async function setDesktopViewport(page: Page) {
  await page.setViewportSize({ width: 1280, height: 800 });
}

// ─── API HELPERS ──────────────────────────────────────────────────────────────

/**
 * Seed a booking via the API seed endpoint (if available) or return
 * a placeholder UID so tests that require an existing booking can proceed.
 *
 * This makes an authenticated request to the seed endpoint which creates
 * demo data in the database.
 */
export async function triggerDatabaseSeed(page: Page) {
  const token = process.env.SEED_TOKEN ?? "calmill-seed-token-dev";
  const response = await page.request.post(`/api/seed`, {
    headers: { "x-seed-token": token },
  });
  return response;
}

/**
 * Check whether slots are available for the demo event type by calling
 * the slots API. Returns true if at least one slot is available.
 */
export async function hasAvailableSlots(page: Page, eventTypeId: string): Promise<boolean> {
  const today = new Date();
  const startDate = today.toISOString().slice(0, 10);
  // Look 30 days ahead
  const endDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const response = await page.request.get(
    `/api/slots?eventTypeId=${eventTypeId}&startDate=${startDate}&endDate=${endDate}&timezone=America%2FNew_York`
  );

  if (!response.ok()) return false;
  const json = await response.json();
  return Array.isArray(json.data) && json.data.length > 0;
}

// ─── ASSERTIONS ───────────────────────────────────────────────────────────────

/**
 * Assert the current page is the profile page for the given username.
 */
export async function assertProfilePage(page: Page, username = DEMO_USER.username) {
  await expect(page).toHaveURL(new RegExp(`/${username}$`));
}

/**
 * Assert that at least one event type card is visible.
 */
export async function assertEventTypeCardsVisible(page: Page) {
  const cards = getEventTypeCards(page);
  await expect(cards.first()).toBeVisible();
}

/**
 * Assert the confirmation page shows "scheduled" success state.
 */
export async function assertBookingConfirmed(page: Page) {
  await expect(page.locator("h1", { hasText: "Your meeting has been scheduled!" })).toBeVisible();
}

/**
 * Assert the booking was cancelled.
 */
export async function assertBookingCancelled(page: Page) {
  await expect(page.locator("h1", { hasText: "Meeting Cancelled" })).toBeVisible();
}
