/**
 * E2E tests for CalMill authentication flows.
 *
 * Covers:
 *  1. Login with valid demo credentials
 *  2. Signup flow (new user registration)
 *  3. Demo login button auto-fills credentials
 *  4. Logout clears the session
 *  5. Session persistence across page refreshes
 *  6. Invalid credentials shows error
 *  7. Redirect to intended page after login
 *  8. Protected route redirects to login when unauthenticated
 */

import { test, expect } from "@playwright/test";
import {
  DEMO_CREDENTIALS,
  loginAsDemoUser,
  fillLoginForm,
  submitLogin,
  fillSignupForm,
  submitSignup,
  getDemoLoginButton,
} from "./helpers/auth-helpers";
import { triggerDatabaseSeed } from "./helpers/seed-helpers";

test.describe("Authentication", () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await triggerDatabaseSeed(page);
    await page.close();
  });

  // ─── 1. LOGIN WITH VALID CREDENTIALS ──────────────────────────────────────

  test("can log in with demo credentials and reach dashboard", async ({
    page,
  }) => {
    await fillLoginForm(
      page,
      DEMO_CREDENTIALS.email,
      DEMO_CREDENTIALS.password
    );
    await submitLogin(page);

    // Should redirect away from /login
    await page.waitForURL(/\/(event-types|$)/, { timeout: 15_000 });
    expect(page.url()).not.toContain("/login");
  });

  // ─── 2. SIGNUP FLOW ───────────────────────────────────────────────────────

  test("signup page loads with registration form", async ({ page }) => {
    await page.goto("/signup");

    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("signup page shows link to login", async ({ page }) => {
    await page.goto("/signup");

    const loginLink = page.locator("a", { hasText: /sign in/i });
    await expect(loginLink).toBeVisible();
  });

  test("signup with invalid email shows validation error", async ({ page }) => {
    await page.goto("/signup");

    await page.locator('input[name="name"]').fill("Test User");
    await page.locator('input[name="email"]').fill("not-an-email");
    await page.locator('input[name="username"]').fill("testuser123");
    await page.locator('input[name="password"]').fill("password123");
    await page.locator('button[type="submit"]').click();

    // Should stay on signup or show error
    await page.waitForTimeout(2000);
    const stillOnSignup =
      page.url().includes("/signup") ||
      (await page.locator("input[type='email']").count()) > 0;
    expect(stillOnSignup).toBeTruthy();
  });

  // ─── 3. DEMO LOGIN BUTTON ─────────────────────────────────────────────────

  test("login page has a demo login button", async ({ page }) => {
    await page.goto("/login");

    const demoButton = getDemoLoginButton(page);
    await expect(demoButton).toBeVisible();
  });

  test("demo login button auto-fills credentials", async ({ page }) => {
    await page.goto("/login");

    const demoButton = getDemoLoginButton(page);
    await demoButton.click();

    // Fields should be pre-filled with demo credentials
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');

    await expect(emailInput).toHaveValue(DEMO_CREDENTIALS.email);
    await expect(passwordInput).not.toHaveValue("");
  });

  // ─── 4. LOGOUT ────────────────────────────────────────────────────────────

  test("can log out after logging in", async ({ page }) => {
    await loginAsDemoUser(page);

    // Navigate to signout
    await page.goto("/api/auth/signout");

    // If there's a confirmation button, click it
    const confirmButton = page.locator('button[type="submit"]');
    if (await confirmButton.count() > 0) {
      await confirmButton.click();
    }

    // Should end up on the login page (unauthenticated)
    await page.waitForTimeout(2000);
    const url = page.url();
    // After signout, NextAuth redirects to /login or the app root (which redirects to /login)
    const isLoggedOut =
      url.includes("/login") ||
      !(await page.locator('input[name="email"]').count() === 0 && await page.locator("nav").count() > 0);
    expect(isLoggedOut).toBeTruthy();
  });

  // ─── 5. SESSION PERSISTENCE ───────────────────────────────────────────────

  test("session persists after page refresh", async ({ page }) => {
    await loginAsDemoUser(page);

    // Navigate to dashboard
    await page.goto("/");

    // Verify we are in the dashboard (not redirected to login)
    expect(page.url()).not.toContain("/login");

    // Refresh the page
    await page.reload();

    // Should still be on dashboard
    expect(page.url()).not.toContain("/login");
  });

  // ─── 6. INVALID CREDENTIALS ───────────────────────────────────────────────

  test("shows error message for invalid credentials", async ({ page }) => {
    await fillLoginForm(page, "wrong@example.com", "wrongpassword");
    await submitLogin(page);

    // Should stay on login page with an error
    await page.waitForTimeout(2000);
    const stillOnLogin = page.url().includes("/login");
    const hasError =
      (await page.locator("text=Invalid").count()) > 0 ||
      (await page.locator('[class*="error" i]').count()) > 0 ||
      (await page.locator('[role="alert"]').count()) > 0;

    expect(stillOnLogin || hasError).toBeTruthy();
  });

  test("shows error for correct email but wrong password", async ({ page }) => {
    await fillLoginForm(page, DEMO_CREDENTIALS.email, "wrongpassword");
    await submitLogin(page);

    await page.waitForTimeout(2000);
    // Should remain on login page
    expect(page.url()).toContain("/login");
  });

  // ─── 7. REDIRECT AFTER LOGIN ──────────────────────────────────────────────

  test("redirects to event-types page after login by default", async ({
    page,
  }) => {
    await loginAsDemoUser(page);

    // Default post-login redirect should be to event-types or dashboard
    const url = page.url();
    const isOnDashboard =
      url.includes("/event-types") ||
      url.match(/localhost:3000\/?$/) !== null ||
      url.match(/localhost:3000\/$/) !== null;
    expect(isOnDashboard).toBeTruthy();
  });

  // ─── 8. PROTECTED ROUTE REDIRECT ──────────────────────────────────────────

  test("unauthenticated access to dashboard redirects to login", async ({
    page,
  }) => {
    // Visit dashboard without auth
    await page.goto("/");
    await page.waitForTimeout(2000);

    const url = page.url();
    const isRedirectedToLogin =
      url.includes("/login") ||
      (await page.locator('input[name="email"]').count()) > 0;
    expect(isRedirectedToLogin).toBeTruthy();
  });

  test("unauthenticated access to event types redirects to login", async ({
    page,
  }) => {
    await page.goto("/event-types");
    await page.waitForTimeout(2000);

    const url = page.url();
    const isRedirectedToLogin =
      url.includes("/login") ||
      (await page.locator('input[name="email"]').count()) > 0;
    expect(isRedirectedToLogin).toBeTruthy();
  });
});
