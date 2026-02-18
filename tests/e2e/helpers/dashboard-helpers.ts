/**
 * Dashboard E2E test helpers for CalMill.
 *
 * Provides typed page-object utilities for the authenticated dashboard
 * without coupling tests to brittle CSS selectors.
 */

import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { triggerDatabaseSeed } from './booking-helpers';

export { triggerDatabaseSeed };

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

export const DEMO_CREDENTIALS = {
  email: 'demo@workermill.com',
  password: 'demo1234',
  username: 'demo',
  name: 'Alex Demo',
} as const;

// ─── AUTH HELPERS ─────────────────────────────────────────────────────────────

/**
 * Log in via the /login page with demo credentials.
 * Waits for redirect to /event-types after successful login.
 */
export async function loginAsDemoUser(page: Page): Promise<void> {
  await page.goto('/login');
  await page.locator('input[name="email"]').fill(DEMO_CREDENTIALS.email);
  await page.locator('input[name="password"]').fill(DEMO_CREDENTIALS.password);
  await page.locator('button[type="submit"]').click();
  // NextAuth redirects to /event-types after login (default callback)
  await page.waitForURL(/\/(event-types|$)/, { timeout: 15_000 });
}

/**
 * Navigate to the dashboard home page.
 */
export async function goToDashboard(page: Page): Promise<void> {
  await page.goto('/');
}

/**
 * Navigate to the event types list.
 */
export async function goToEventTypes(page: Page): Promise<void> {
  await page.goto('/event-types');
}

/**
 * Navigate to the bookings list.
 */
export async function goToBookings(page: Page): Promise<void> {
  await page.goto('/bookings');
}

/**
 * Navigate to the availability schedule editor.
 */
export async function goToAvailability(page: Page): Promise<void> {
  await page.goto('/availability');
}

/**
 * Navigate to the profile settings page.
 */
export async function goToSettings(page: Page): Promise<void> {
  await page.goto('/settings');
}

// ─── DASHBOARD HOME HELPERS ───────────────────────────────────────────────────

/**
 * Get the stat cards container (4 summary cards).
 */
export function getStatCards(page: Page): Locator {
  return page.locator(
    '[class*="grid"] a[href="/bookings"], [class*="grid"] a[href="/event-types"]'
  );
}

/**
 * Get a stat card by label text (Upcoming, Pending, This Month, Popular).
 */
export function getStatCardByLabel(page: Page, label: string): Locator {
  return page
    .locator('text=' + label)
    .locator('..')
    .locator('..');
}

/**
 * Get the Upcoming Bookings section heading.
 */
export function getUpcomingBookingsHeading(page: Page): Locator {
  return page.locator('h2', { hasText: 'Upcoming Bookings' });
}

/**
 * Get the Analytics section heading.
 */
export function getAnalyticsHeading(page: Page): Locator {
  return page.locator('h2', { hasText: 'Analytics' });
}

// ─── EVENT TYPES HELPERS ──────────────────────────────────────────────────────

/**
 * Get the "New Event Type" button that opens the create dialog.
 */
export function getNewEventTypeButton(page: Page): Locator {
  return page.locator('button', { hasText: 'New Event Type' });
}

/**
 * Get all event type cards on the event types list page.
 * Each card is a div with a title h3.
 */
export function getEventTypeCards(page: Page): Locator {
  return page.locator('[class*="rounded-lg"][class*="border"] h3');
}

/**
 * Open the "New Event Type" dialog.
 */
export async function openCreateEventTypeDialog(page: Page): Promise<void> {
  await getNewEventTypeButton(page).click();
  // Wait for dialog to appear
  await page.locator('[role="dialog"]').waitFor({ state: 'visible', timeout: 5_000 });
}

/**
 * Fill and submit the create event type dialog.
 * Waits for redirect to the event type editor.
 */
export async function createEventType(
  page: Page,
  title: string,
  duration: number = 30
): Promise<void> {
  await openCreateEventTypeDialog(page);
  // Fill title
  await page
    .locator('input[name="title"], input[placeholder*="title" i], input[placeholder*="name" i]')
    .first()
    .fill(title);
  // Duration is a select — try to find it and pick a value
  const durationSelect = page.locator('select[name="duration"]');
  if ((await durationSelect.count()) > 0) {
    await durationSelect.selectOption(String(duration));
  }
  // Submit
  await page
    .locator('[role="dialog"] button[type="submit"], [role="dialog"] button', {
      hasText: /^Create/,
    })
    .first()
    .click();
  // Wait for navigation to editor
  await page.waitForURL(/\/event-types\/[^/]+/, { timeout: 15_000 });
}

/**
 * Click the Edit link for the event type card with the given title.
 *
 * NOTE: The Edit control is a Next.js <Link> (renders as <a>), not a <button>.
 * We use a tag-agnostic attribute selector to avoid false failures.
 */
export async function editEventType(page: Page, title: string): Promise<void> {
  await page.locator(`[aria-label="Edit ${title}"]`).click();
}

/**
 * Toggle the active/inactive state for the event type with the given title.
 */
export async function toggleEventTypeActive(page: Page, title: string): Promise<void> {
  // The toggle button has aria-label like "Deactivate {title}" or "Activate {title}"
  const toggle = page.locator(`button[role="switch"][aria-label*="${title}"]`);
  await toggle.click();
}

/**
 * Click the Delete button for the event type card with the given title.
 * Does NOT confirm — call confirmDelete() after.
 */
export async function clickDeleteEventType(page: Page, title: string): Promise<void> {
  await page.locator(`button[aria-label="Delete ${title}"]`).click();
}

/**
 * Confirm the delete dialog (click the "Delete" button).
 */
export async function confirmDelete(page: Page): Promise<void> {
  await page.locator('[role="dialog"] button', { hasText: /^Delete$/ }).click();
}

// ─── EVENT TYPE EDITOR HELPERS ────────────────────────────────────────────────

/**
 * Get the tab navigation for the event type editor.
 */
export function getEditorTab(page: Page, label: string): Locator {
  return page.locator('button', { hasText: label });
}

/**
 * Click a tab in the event type editor.
 */
export async function clickEditorTab(page: Page, label: string): Promise<void> {
  await getEditorTab(page, label).click();
}

/**
 * Fill the title field in the event type editor.
 */
export async function fillEventTypeTitle(page: Page, title: string): Promise<void> {
  const titleInput = page.locator('input[name="title"]');
  await titleInput.fill(title);
  await titleInput.blur();
}

/**
 * Wait for the "Saved" indicator to appear after an auto-save.
 */
export async function waitForSaved(page: Page): Promise<void> {
  await page.locator('text=Saved').waitFor({ state: 'visible', timeout: 10_000 });
}

// ─── BOOKINGS HELPERS ─────────────────────────────────────────────────────────

/**
 * Get bookings tab buttons (Upcoming, Past, Cancelled).
 */
export function getBookingsTab(page: Page, label: string): Locator {
  return page.locator('button', { hasText: label });
}

/**
 * Click a bookings list tab.
 */
export async function clickBookingsTab(page: Page, label: string): Promise<void> {
  await getBookingsTab(page, label).click();
  // Brief wait for content to update
  await page.waitForTimeout(500);
}

/**
 * Get booking cards in the list (by attendee name text).
 */
export function getBookingCardByAttendee(page: Page, attendeeName: string): Locator {
  return page
    .locator('text=' + attendeeName)
    .locator('..')
    .locator('..');
}

/**
 * Get the list of upcoming bookings as locators.
 */
export function getUpcomingBookingsList(page: Page): Locator {
  return page.locator('[class*="rounded-lg"][class*="border"]').filter({ hasText: 'Accept' });
}

/**
 * Click the Accept button on a pending booking card.
 */
export async function acceptBooking(page: Page, attendeeName: string): Promise<void> {
  const card = getBookingCardByAttendee(page, attendeeName);
  await card.locator('button', { hasText: 'Accept' }).click();
  await page.waitForTimeout(1000);
}

/**
 * Click the Cancel button on an accepted booking card, then confirm with reason.
 */
export async function cancelBooking(page: Page, attendeeName: string, reason = ''): Promise<void> {
  const card = getBookingCardByAttendee(page, attendeeName);
  await card.locator('button', { hasText: 'Cancel' }).click();
  // Reason dialog should appear
  await page.locator('[role="dialog"]').waitFor({ state: 'visible', timeout: 5_000 });
  if (reason) {
    await page.locator('[role="dialog"] textarea').fill(reason);
  }
  await page.locator('[role="dialog"] button', { hasText: /^Cancel Booking$/ }).click();
  await page.waitForTimeout(1000);
}

/**
 * Search bookings by typing in the search input.
 */
export async function searchBookings(page: Page, query: string): Promise<void> {
  const searchInput = page.locator(
    'input[placeholder*="search" i], input[placeholder*="attendee" i]'
  );
  if ((await searchInput.count()) > 0) {
    await searchInput.fill(query);
    await page.waitForTimeout(500);
  }
}

/**
 * Apply a booking filter (date range, event type dropdown).
 */
export async function applyBookingFilters(page: Page, eventTypeTitle?: string): Promise<void> {
  if (eventTypeTitle) {
    const eventTypeFilter = page.locator(
      'select[name="eventType"], select[aria-label*="event type" i]'
    );
    if ((await eventTypeFilter.count()) > 0) {
      await eventTypeFilter.selectOption({ label: eventTypeTitle });
    }
  }
}

// ─── AVAILABILITY HELPERS ─────────────────────────────────────────────────────

/**
 * Get the schedule name input (editable inline).
 */
export function getScheduleNameInput(page: Page): Locator {
  return page.locator('input[name="scheduleName"], input[placeholder*="schedule name" i]').first();
}

/**
 * Get the timezone selector in the availability editor.
 */
export function selectTimezone(page: Page): Locator {
  return page
    .locator('select[aria-label*="timezone" i], select[name="timezone"]')
    .first()
    .or(
      page
        .locator('select')
        .filter({ hasText: /America|Europe|Asia|UTC/ })
        .first()
    );
}

/**
 * Toggle a day's availability on/off in the weekly grid.
 */
export async function toggleDayAvailability(page: Page, dayName: string): Promise<void> {
  // Each day row has a toggle switch near the day label
  const dayRow = page.locator(`text=${dayName}`).locator('..').locator('..');
  const toggle = dayRow.locator('button[role="switch"]').first();
  await toggle.click();
}

/**
 * Click the Save button in the availability editor.
 */
export async function saveAvailability(page: Page): Promise<void> {
  await page.locator('button', { hasText: /^Save/ }).first().click();
  await page.waitForTimeout(1000);
}

/**
 * Open the "Add Date Override" dialog.
 */
export async function openCreateScheduleDialog(page: Page): Promise<void> {
  await page.locator('button', { hasText: 'Add Date Override' }).click();
  await page.locator('[role="dialog"]').waitFor({ state: 'visible', timeout: 5_000 });
}

// ─── SETTINGS HELPERS ─────────────────────────────────────────────────────────

/**
 * Fill the name field in the profile section of settings.
 */
export async function updateProfileName(page: Page, name: string): Promise<void> {
  const nameInput = page.locator('input[name="name"]').first();
  await nameInput.fill(name);
  await nameInput.blur();
}

/**
 * Get the save indicator for profile/settings sections.
 */
export function getSettingsSaveIndicator(page: Page): Locator {
  return page.locator('text=Saved').first();
}

/**
 * Assert the "Saved" confirmation appeared.
 */
export async function assertSaved(page: Page): Promise<void> {
  await expect(page.locator('text=Saved').first()).toBeVisible({ timeout: 10_000 });
}

// ─── MOBILE HELPERS ───────────────────────────────────────────────────────────

/**
 * Set the viewport to a mobile size.
 */
export async function setMobileViewport(page: Page): Promise<void> {
  await page.setViewportSize({ width: 375, height: 667 });
}

/**
 * Set the viewport to a desktop size.
 */
export async function setDesktopViewport(page: Page): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 800 });
}

// ─── SIDEBAR HELPERS ──────────────────────────────────────────────────────────

/**
 * Click a sidebar navigation link by its label.
 */
export async function clickSidebarNav(page: Page, label: string): Promise<void> {
  await page.locator('nav a', { hasText: label }).first().click();
}

/**
 * Get the sidebar nav link for a given label.
 */
export function getSidebarNavLink(page: Page, label: string): Locator {
  return page.locator('nav a', { hasText: label }).first();
}
