import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.describe("Login Flow", () => {
    test("user can login with demo credentials and view dashboard", async ({
      page,
    }) => {
      // Navigate to login page
      await page.goto("/login");

      // Verify login page loaded
      await expect(page).toHaveURL("/login");
      await expect(page.locator("h1")).toContainText("Sign In");

      // Fill in demo credentials
      await page.fill('input[name="email"]', "demo@workermill.com");
      await page.fill('input[name="password"]', "demo1234");

      // Submit the login form
      await page.click('button[type="submit"]');

      // Wait for navigation to dashboard (successful login)
      await expect(page).toHaveURL("/dashboard");

      // Verify we're actually logged in by checking dashboard content
      await expect(page.locator("h1")).toContainText("Dashboard");

      // Check for user menu or other authenticated UI elements
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    });

    test("shows error for invalid credentials", async ({ page }) => {
      await page.goto("/login");

      // Fill in invalid credentials
      await page.fill('input[name="email"]', "invalid@example.com");
      await page.fill('input[name="password"]', "wrongpassword");

      // Submit the form
      await page.click('button[type="submit"]');

      // Should stay on login page
      await expect(page).toHaveURL("/login");

      // Should show error message
      await expect(page.locator('[data-testid="error-message"]')).toContainText(
        "Invalid credentials",
      );
    });

    test("shows error for empty fields", async ({ page }) => {
      await page.goto("/login");

      // Try to submit with empty fields
      await page.click('button[type="submit"]');

      // Should stay on login page
      await expect(page).toHaveURL("/login");

      // Should show validation errors
      await expect(page.locator('text="Email is required"')).toBeVisible();
      await expect(page.locator('text="Password is required"')).toBeVisible();
    });

    test("shows error for invalid email format", async ({ page }) => {
      await page.goto("/login");

      // Fill in invalid email format
      await page.fill('input[name="email"]', "not-an-email");
      await page.fill('input[name="password"]', "password123");

      await page.click('button[type="submit"]');

      // Should show email format error
      await expect(page.locator('text="Invalid email format"')).toBeVisible();
    });
  });

  test.describe("Signup Flow", () => {
    test("user can signup with new credentials", async ({ page }) => {
      await page.goto("/signup");

      // Verify signup page loaded
      await expect(page).toHaveURL("/signup");
      await expect(page.locator("h1")).toContainText("Sign Up");

      // Generate unique credentials for this test
      const timestamp = Date.now();
      const uniqueEmail = `test-user-${timestamp}@example.com`;
      const uniqueUsername = `testuser${timestamp}`;

      // Fill in signup form
      await page.fill('input[name="name"]', "Test User");
      await page.fill('input[name="email"]', uniqueEmail);
      await page.fill('input[name="username"]', uniqueUsername);
      await page.fill('input[name="password"]', "password123");
      await page.fill('input[name="confirmPassword"]', "password123");

      // Submit the form
      await page.click('button[type="submit"]');

      // Should redirect to login page with success message or directly to dashboard
      // Check if redirected to dashboard (auto-login after signup) or login page
      await page.waitForURL(
        (url) => url.includes("/dashboard") || url.includes("/login"),
      );

      if (page.url().includes("/login")) {
        // If redirected to login, should show success message
        await expect(
          page.locator('[data-testid="success-message"]'),
        ).toContainText("Account created successfully");

        // Login with new credentials
        await page.fill('input[name="email"]', uniqueEmail);
        await page.fill('input[name="password"]', "password123");
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL("/dashboard");
      } else {
        // If directly logged in, should be on dashboard
        await expect(page).toHaveURL("/dashboard");
      }

      // Verify we're logged in
      await expect(page.locator("h1")).toContainText("Dashboard");
    });

    test("shows error for existing email", async ({ page }) => {
      await page.goto("/signup");

      // Try to signup with demo user email (already exists)
      await page.fill('input[name="name"]', "Another User");
      await page.fill('input[name="email"]', "demo@workermill.com");
      await page.fill('input[name="username"]', "anotheruser");
      await page.fill('input[name="password"]', "password123");
      await page.fill('input[name="confirmPassword"]', "password123");

      await page.click('button[type="submit"]');

      // Should stay on signup page with error
      await expect(page).toHaveURL("/signup");
      await expect(page.locator('[data-testid="error-message"]')).toContainText(
        "Email already exists",
      );
    });

    test("shows error for existing username", async ({ page }) => {
      await page.goto("/signup");

      // Try to signup with demo username (already exists)
      await page.fill('input[name="name"]', "Another User");
      await page.fill('input[name="email"]', "unique@example.com");
      await page.fill('input[name="username"]', "demo");
      await page.fill('input[name="password"]', "password123");
      await page.fill('input[name="confirmPassword"]', "password123");

      await page.click('button[type="submit"]');

      // Should stay on signup page with error
      await expect(page).toHaveURL("/signup");
      await expect(page.locator('[data-testid="error-message"]')).toContainText(
        "Username already exists",
      );
    });

    test("shows error for password mismatch", async ({ page }) => {
      await page.goto("/signup");

      const timestamp = Date.now();
      await page.fill('input[name="name"]', "Test User");
      await page.fill('input[name="email"]', `test-${timestamp}@example.com`);
      await page.fill('input[name="username"]', `testuser${timestamp}`);
      await page.fill('input[name="password"]', "password123");
      await page.fill('input[name="confirmPassword"]', "differentpassword");

      await page.click('button[type="submit"]');

      // Should show password mismatch error
      await expect(page.locator('text="Passwords do not match"')).toBeVisible();
    });

    test("shows validation errors for empty required fields", async ({
      page,
    }) => {
      await page.goto("/signup");

      // Try to submit with empty fields
      await page.click('button[type="submit"]');

      // Should show validation errors for all required fields
      await expect(page.locator('text="Name is required"')).toBeVisible();
      await expect(page.locator('text="Email is required"')).toBeVisible();
      await expect(page.locator('text="Username is required"')).toBeVisible();
      await expect(page.locator('text="Password is required"')).toBeVisible();
    });
  });

  test.describe("Logout Flow", () => {
    test("user can logout and is redirected to login page", async ({
      page,
    }) => {
      // First login
      await page.goto("/login");
      await page.fill('input[name="email"]', "demo@workermill.com");
      await page.fill('input[name="password"]', "demo1234");
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL("/dashboard");

      // Find and click logout button/link
      // Try different possible selectors for logout
      const logoutSelectors = [
        '[data-testid="logout-button"]',
        'button:has-text("Logout")',
        'button:has-text("Sign Out")',
        '[data-testid="user-menu"] >> text="Logout"',
        '[data-testid="user-menu"] >> text="Sign Out"',
      ];

      let logoutFound = false;
      for (const selector of logoutSelectors) {
        try {
          const element = page.locator(selector);
          if (await element.isVisible({ timeout: 1000 })) {
            await element.click();
            logoutFound = true;
            break;
          }
        } catch (e) {
          // Try next selector
          continue;
        }
      }

      // If logout button not found in main interface, try opening user menu first
      if (!logoutFound) {
        try {
          await page.click('[data-testid="user-menu"]');
          await page.waitForSelector('text="Logout", text="Sign Out"', {
            timeout: 2000,
          });
          await page.click('text="Logout", text="Sign Out"');
          logoutFound = true;
        } catch (e) {
          // Still not found, try more generic approach
        }
      }

      if (!logoutFound) {
        // Fallback: look for any element containing logout text
        await page.click('text="Logout"');
      }

      // Should be redirected to login page or home page
      await page.waitForURL(
        (url) =>
          url.includes("/login") ||
          url === page.url().replace(/\/[^\/]*$/, "/"),
      );

      // Verify we're logged out by trying to access dashboard
      await page.goto("/dashboard");

      // Should be redirected to login page since we're not authenticated
      await expect(page).toHaveURL("/login");
    });
  });

  test.describe("Authentication Persistence", () => {
    test("user remains logged in after page refresh", async ({ page }) => {
      // Login
      await page.goto("/login");
      await page.fill('input[name="email"]', "demo@workermill.com");
      await page.fill('input[name="password"]', "demo1234");
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL("/dashboard");

      // Refresh the page
      await page.reload();

      // Should still be on dashboard (session persisted)
      await expect(page).toHaveURL("/dashboard");
      await expect(page.locator("h1")).toContainText("Dashboard");
    });

    test("unauthenticated user is redirected from protected pages", async ({
      page,
    }) => {
      // Try to access protected pages without logging in
      const protectedRoutes = [
        "/dashboard",
        "/event-types",
        "/bookings",
        "/availability",
        "/settings",
      ];

      for (const route of protectedRoutes) {
        await page.goto(route);
        // Should be redirected to login
        await expect(page).toHaveURL("/login");
      }
    });
  });

  test.describe("Navigation Links", () => {
    test("login page has link to signup", async ({ page }) => {
      await page.goto("/login");

      // Should have link to signup page
      await expect(page.locator('a[href="/signup"]')).toBeVisible();
      await expect(page.locator('text="Sign up"')).toBeVisible();
    });

    test("signup page has link to login", async ({ page }) => {
      await page.goto("/signup");

      // Should have link to login page
      await expect(page.locator('a[href="/login"]')).toBeVisible();
      await expect(page.locator('text="Sign in"')).toBeVisible();
    });
  });
});
