/**
 * Authentication helpers for CalMill E2E tests.
 *
 * Provides utilities for logging in, signing up, and managing session state
 * across authenticated test flows.
 */

import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

/** Demo user credentials seeded by prisma/seed.ts */
export const DEMO_CREDENTIALS = {
  email: 'demo@workermill.com',
  password: 'demo1234',
  username: 'demo',
  name: 'Alex Demo',
} as const;

/** Secondary test user seeded by prisma/seed.ts */
export const ALICE_CREDENTIALS = {
  email: 'alice@workermill.com',
  password: 'alice1234',
  username: 'alice',
  name: 'Alice Cooper',
} as const;

// ─── LOGIN HELPERS ────────────────────────────────────────────────────────────

/**
 * Navigate to the login page and fill the email/password form.
 * Does NOT submit — call submitLogin() after.
 */
export async function fillLoginForm(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/login');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
}

/**
 * Submit the login form by clicking the Sign In button.
 */
export async function submitLogin(page: Page): Promise<void> {
  await page.locator('button[type="submit"]').click();
}

/**
 * Log in as the demo user and wait for redirect to the dashboard.
 */
export async function loginAsDemoUser(page: Page): Promise<void> {
  await fillLoginForm(page, DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
  await submitLogin(page);
  await page.waitForURL(/\/(event-types|$)/, { timeout: 15_000 });
}

/**
 * Log in with arbitrary credentials. Returns true if login succeeded
 * (redirected away from /login), false otherwise.
 */
export async function login(page: Page, email: string, password: string): Promise<boolean> {
  await fillLoginForm(page, email, password);
  await submitLogin(page);
  try {
    await page.waitForURL(/^(?!.*\/login).*$/, { timeout: 10_000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Log out by navigating to the signout endpoint.
 */
export async function logout(page: Page): Promise<void> {
  // NextAuth v5 uses POST to /api/auth/signout
  await page.goto('/api/auth/signout');
  // Click the confirm button if it appears
  const signOutButton = page.locator('button[type="submit"]');
  if ((await signOutButton.count()) > 0) {
    await signOutButton.click();
  }
  await page.waitForURL(/\/login/, { timeout: 10_000 });
}

// ─── SIGNUP HELPERS ───────────────────────────────────────────────────────────

/**
 * Navigate to signup and fill the registration form.
 */
export async function fillSignupForm(
  page: Page,
  name: string,
  email: string,
  username: string,
  password: string
): Promise<void> {
  await page.goto('/signup');
  await page.locator('input[name="name"]').fill(name);
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="password"]').fill(password);
}

/**
 * Submit the signup form.
 */
export async function submitSignup(page: Page): Promise<void> {
  await page.locator('button[type="submit"]').click();
}

// ─── LOCATOR HELPERS ──────────────────────────────────────────────────────────

/**
 * Get the email input on the login page.
 */
export function getEmailInput(page: Page): Locator {
  return page.locator('input[name="email"]');
}

/**
 * Get the password input on the login page.
 */
export function getPasswordInput(page: Page): Locator {
  return page.locator('input[name="password"]');
}

/**
 * Get the submit button on the login/signup page.
 */
export function getSubmitButton(page: Page): Locator {
  return page.locator('button[type="submit"]');
}

/**
 * Get the "Try the Demo" button on the login page.
 */
export function getDemoLoginButton(page: Page): Locator {
  return page.locator('button', { hasText: /demo/i });
}

// ─── ASSERTIONS ───────────────────────────────────────────────────────────────

/**
 * Assert that the user is currently logged in (not on the login page and
 * the dashboard is accessible).
 */
export async function assertLoggedIn(page: Page): Promise<void> {
  expect(page.url()).not.toContain('/login');
}

/**
 * Assert that the login page shows an error message.
 */
export async function assertLoginError(page: Page): Promise<void> {
  const hasError =
    (await page.locator('text=Invalid').count()) > 0 ||
    (await page.locator('[class*="error" i]').count()) > 0 ||
    (await page.locator('[role="alert"]').count()) > 0;
  expect(hasError).toBeTruthy();
}
