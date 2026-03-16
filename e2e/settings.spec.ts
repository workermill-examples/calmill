import { test, expect } from "@playwright/test";
import { test as authTest } from "./fixtures/auth";

test.describe("Settings Management", () => {
  test.describe("Unauthenticated Access", () => {
    test("redirects to login when not authenticated", async ({ page }) => {
      await page.goto("/settings");

      // Should be redirected to login page
      await expect(page).toHaveURL("/login");
    });
  });

  test.describe("Profile Settings", () => {
    authTest("loads settings page with correct content", async ({ authenticatedPage: page }) => {
      await page.goto("/settings");

      // Verify we're on the settings page
      await expect(page).toHaveURL("/settings");

      // Check main heading
      await expect(page.locator("h1")).toContainText("Profile Settings");

      // Check for main sections
      await expect(page.locator('text="Personal Information"')).toBeVisible();
    });

    authTest("displays current user profile information", async ({ authenticatedPage: page }) => {
      await page.goto("/settings");

      // Wait for profile data to load
      await page.waitForSelector('input[name="name"]', { timeout: 10000 });

      // Verify demo user data is loaded
      const nameInput = page.locator('input[name="name"]');
      const emailInput = page.locator('input[name="email"]');
      const usernameInput = page.locator('input[name="username"]');

      await expect(nameInput).toHaveValue("Alex Demo");
      await expect(emailInput).toHaveValue("demo@workermill.com");
      await expect(usernameInput).toHaveValue("demo");
    });

    authTest("can update profile name", async ({ authenticatedPage: page }) => {
      await page.goto("/settings");

      // Wait for profile data to load
      await page.waitForSelector('input[name="name"]');

      // Update name
      const nameInput = page.locator('input[name="name"]');
      await nameInput.fill("Alex Demo Updated");

      // Save changes
      const saveButton = page.locator('button:has(text("Save Changes"))');
      await expect(saveButton).toBeEnabled();
      await saveButton.click();

      // Wait for success message
      await expect(page.locator('text="Profile updated successfully"')).toBeVisible({ timeout: 5000 });

      // Verify the change persisted
      await expect(nameInput).toHaveValue("Alex Demo Updated");
    });

    authTest("can update profile bio", async ({ authenticatedPage: page }) => {
      await page.goto("/settings");

      // Wait for profile data to load
      await page.waitForSelector('textarea[name="bio"]');

      // Update bio
      const bioTextarea = page.locator('textarea[name="bio"]');
      await bioTextarea.fill("This is my updated bio for testing.");

      // Save changes
      const saveButton = page.locator('button:has(text("Save Changes"))');
      await saveButton.click();

      // Wait for success message
      await expect(page.locator('text="Profile updated successfully"')).toBeVisible();

      // Verify the change persisted
      await expect(bioTextarea).toHaveValue("This is my updated bio for testing.");
    });

    authTest("validates username format", async ({ authenticatedPage: page }) => {
      await page.goto("/settings");

      // Wait for profile data to load
      await page.waitForSelector('input[name="username"]');

      // Try invalid username with spaces
      const usernameInput = page.locator('input[name="username"]');
      await usernameInput.fill("invalid username");

      // Try to save
      const saveButton = page.locator('button:has(text("Save Changes"))');
      await saveButton.click();

      // Check for validation error
      await expect(page.locator('text="Username can only contain letters, numbers, and underscores"')).toBeVisible({ timeout: 3000 });
    });

    authTest("validates required fields", async ({ authenticatedPage: page }) => {
      await page.goto("/settings");

      // Wait for profile data to load
      await page.waitForSelector('input[name="name"]');

      // Clear required name field
      const nameInput = page.locator('input[name="name"]');
      await nameInput.fill("");

      // Try to save
      const saveButton = page.locator('button:has(text("Save Changes"))');
      await saveButton.click();

      // Check for validation error
      await expect(page.locator('text="Name is required"')).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe("Preferences Settings", () => {
    authTest("can navigate to preferences", async ({ authenticatedPage: page }) => {
      await page.goto("/settings");

      // Click on Preferences tab
      await page.locator('a[href="/settings/preferences"]').click();

      // Verify navigation
      await expect(page).toHaveURL("/settings/preferences");

      // Check heading
      await expect(page.locator("h1")).toContainText("Preferences");
    });

    authTest("displays current timezone setting", async ({ authenticatedPage: page }) => {
      await page.goto("/settings/preferences");

      // Wait for preferences data to load
      await page.waitForSelector('select[name="timezone"]', { timeout: 10000 });

      // Verify default timezone for demo user
      const timezoneSelect = page.locator('select[name="timezone"]');
      await expect(timezoneSelect).toHaveValue("America/New_York");
    });

    authTest("can update timezone", async ({ authenticatedPage: page }) => {
      await page.goto("/settings/preferences");

      // Wait for preferences data to load
      await page.waitForSelector('select[name="timezone"]');

      // Change timezone
      const timezoneSelect = page.locator('select[name="timezone"]');
      await timezoneSelect.selectOption("America/Los_Angeles");

      // Save changes
      const saveButton = page.locator('button:has(text("Save Changes"))');
      await expect(saveButton).toBeEnabled();
      await saveButton.click();

      // Wait for success message
      await expect(page.locator('text="Preferences updated successfully"')).toBeVisible({ timeout: 5000 });

      // Verify the change persisted
      await expect(timezoneSelect).toHaveValue("America/Los_Angeles");
    });

    authTest("can detect timezone automatically", async ({ authenticatedPage: page }) => {
      await page.goto("/settings/preferences");

      // Wait for preferences data to load
      await page.waitForSelector('select[name="timezone"]');

      // Click detect timezone button
      const detectButton = page.locator('button:has(text("Auto-detect"))');
      if (await detectButton.isVisible()) {
        await detectButton.click();

        // Should show success message
        await expect(page.locator('text="Timezone Updated"')).toBeVisible({ timeout: 3000 });
      }
    });

    authTest("can update week start day", async ({ authenticatedPage: page }) => {
      await page.goto("/settings/preferences");

      // Wait for preferences data to load
      await page.waitForSelector('select[name="weekStart"]');

      // Change week start
      const weekStartSelect = page.locator('select[name="weekStart"]');
      await weekStartSelect.selectOption("0"); // Sunday

      // Save changes
      const saveButton = page.locator('button:has(text("Save Changes"))');
      await saveButton.click();

      // Wait for success message
      await expect(page.locator('text="Preferences updated successfully"')).toBeVisible();

      // Verify the change persisted
      await expect(weekStartSelect).toHaveValue("0");
    });

    authTest("can update theme preference", async ({ authenticatedPage: page }) => {
      await page.goto("/settings/preferences");

      // Wait for preferences data to load
      await page.waitForSelector('select[name="theme"]');

      // Change theme
      const themeSelect = page.locator('select[name="theme"]');
      await themeSelect.selectOption("dark");

      // Save changes
      const saveButton = page.locator('button:has(text("Save Changes"))');
      await saveButton.click();

      // Wait for success message
      await expect(page.locator('text="Preferences updated successfully"')).toBeVisible();

      // Verify the change persisted
      await expect(themeSelect).toHaveValue("dark");
    });
  });

  test.describe("Password Settings", () => {
    authTest("can navigate to password settings", async ({ authenticatedPage: page }) => {
      await page.goto("/settings");

      // Click on Password tab
      await page.locator('a[href="/settings/password"]').click();

      // Verify navigation
      await expect(page).toHaveURL("/settings/password");

      // Check heading
      await expect(page.locator("h1")).toContainText("Change Password");
    });

    authTest("displays password change form", async ({ authenticatedPage: page }) => {
      await page.goto("/settings/password");

      // Check for required fields
      await expect(page.locator('input[name="currentPassword"]')).toBeVisible();
      await expect(page.locator('input[name="newPassword"]')).toBeVisible();
      await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();

      // Check for password requirements display
      await expect(page.locator('text="At least 8 characters"')).toBeVisible();
      await expect(page.locator('text="At least one uppercase letter"')).toBeVisible();
      await expect(page.locator('text="At least one lowercase letter"')).toBeVisible();
    });

    authTest("shows password strength requirements", async ({ authenticatedPage: page }) => {
      await page.goto("/settings/password");

      // Type a weak password
      const newPasswordInput = page.locator('input[name="newPassword"]');
      await newPasswordInput.fill("weak");

      // Should see unmet requirements
      await expect(page.locator('[data-testid="requirement-length"].text-red-500')).toBeVisible();
      await expect(page.locator('[data-testid="requirement-uppercase"].text-red-500')).toBeVisible();

      // Type a strong password
      await newPasswordInput.fill("StrongPassword123!");

      // Should see met requirements
      await expect(page.locator('[data-testid="requirement-length"].text-green-500')).toBeVisible();
      await expect(page.locator('[data-testid="requirement-uppercase"].text-green-500')).toBeVisible();
    });

    authTest("can toggle password visibility", async ({ authenticatedPage: page }) => {
      await page.goto("/settings/password");

      // Check initial state (should be hidden)
      const currentPasswordInput = page.locator('input[name="currentPassword"]');
      await expect(currentPasswordInput).toHaveAttribute('type', 'password');

      // Click show/hide toggle
      const toggleButton = page.locator('button[aria-label="Show password"]:near(input[name="currentPassword"])');
      await toggleButton.click();

      // Should now be visible
      await expect(currentPasswordInput).toHaveAttribute('type', 'text');

      // Click again to hide
      await toggleButton.click();
      await expect(currentPasswordInput).toHaveAttribute('type', 'password');
    });

    authTest("validates password confirmation match", async ({ authenticatedPage: page }) => {
      await page.goto("/settings/password");

      // Fill form with mismatched passwords
      await page.locator('input[name="currentPassword"]').fill("demo1234");
      await page.locator('input[name="newPassword"]').fill("NewPassword123!");
      await page.locator('input[name="confirmPassword"]').fill("DifferentPassword123!");

      // Try to save
      const saveButton = page.locator('button:has(text("Update Password"))');
      await saveButton.click();

      // Check for validation error
      await expect(page.locator('text="Passwords do not match"')).toBeVisible({ timeout: 3000 });
    });

    authTest("validates current password is required", async ({ authenticatedPage: page }) => {
      await page.goto("/settings/password");

      // Fill form without current password
      await page.locator('input[name="newPassword"]').fill("NewPassword123!");
      await page.locator('input[name="confirmPassword"]').fill("NewPassword123!");

      // Try to save
      const saveButton = page.locator('button:has(text("Update Password"))');
      await saveButton.click();

      // Check for validation error
      await expect(page.locator('text="Current password is required"')).toBeVisible({ timeout: 3000 });
    });

    authTest("validates new password meets requirements", async ({ authenticatedPage: page }) => {
      await page.goto("/settings/password");

      // Fill form with weak new password
      await page.locator('input[name="currentPassword"]').fill("demo1234");
      await page.locator('input[name="newPassword"]').fill("weak");
      await page.locator('input[name="confirmPassword"]').fill("weak");

      // Try to save
      const saveButton = page.locator('button:has(text("Update Password"))');
      await saveButton.click();

      // Check for validation error
      await expect(page.locator('text="Password does not meet requirements"')).toBeVisible({ timeout: 3000 });
    });

    // Note: We don't test successful password change as it would affect other tests
    // In a real scenario, we'd use a test-specific user or reset the password afterward
  });

  test.describe("Settings Navigation", () => {
    authTest("can navigate between settings sections", async ({ authenticatedPage: page }) => {
      await page.goto("/settings");

      // Check that all navigation links are present
      await expect(page.locator('a[href="/settings"]:has(text("Profile"))')).toBeVisible();
      await expect(page.locator('a[href="/settings/preferences"]:has(text("Preferences"))')).toBeVisible();
      await expect(page.locator('a[href="/settings/password"]:has(text("Password"))')).toBeVisible();
      await expect(page.locator('a[href="/settings/calendars"]:has(text("Calendars"))')).toBeVisible();
      await expect(page.locator('a[href="/settings/webhooks"]:has(text("Webhooks"))')).toBeVisible();

      // Test navigation between sections
      await page.locator('a[href="/settings/preferences"]').click();
      await expect(page).toHaveURL("/settings/preferences");

      await page.locator('a[href="/settings/password"]').click();
      await expect(page).toHaveURL("/settings/password");

      await page.locator('a[href="/settings"]').click();
      await expect(page).toHaveURL("/settings");
    });

    authTest("shows active navigation state", async ({ authenticatedPage: page }) => {
      await page.goto("/settings");

      // Check that Profile is active
      const profileLink = page.locator('a[href="/settings"]:has(text("Profile"))');
      await expect(profileLink).toHaveClass(/active|bg-primary|text-primary/);

      // Navigate to preferences
      await page.locator('a[href="/settings/preferences"]').click();

      // Check that Preferences is now active
      const preferencesLink = page.locator('a[href="/settings/preferences"]:has(text("Preferences"))');
      await expect(preferencesLink).toHaveClass(/active|bg-primary|text-primary/);
    });

    authTest("has consistent layout across settings pages", async ({ authenticatedPage: page }) => {
      const settingsPages = ["/settings", "/settings/preferences", "/settings/password"];

      for (const settingsPage of settingsPages) {
        await page.goto(settingsPage);

        // Check for consistent sidebar navigation
        await expect(page.locator('[data-testid="settings-sidebar"]')).toBeVisible();

        // Check for consistent main content area
        await expect(page.locator('[data-testid="settings-content"]')).toBeVisible();

        // Check page has proper heading
        await expect(page.locator("h1")).toBeVisible();
      }
    });
  });

  test.describe("Form State Management", () => {
    authTest("tracks unsaved changes", async ({ authenticatedPage: page }) => {
      await page.goto("/settings");

      // Wait for data to load
      await page.waitForSelector('input[name="name"]');

      // Make a change
      await page.locator('input[name="name"]').fill("Changed Name");

      // Save button should be enabled
      const saveButton = page.locator('button:has(text("Save Changes"))');
      await expect(saveButton).toBeEnabled();
    });

    authTest("disables save button when no changes", async ({ authenticatedPage: page }) => {
      await page.goto("/settings");

      // Wait for data to load
      await page.waitForSelector('input[name="name"]');

      // Save button should be disabled initially (no changes)
      const saveButton = page.locator('button:has(text("Save Changes"))');
      await expect(saveButton).toBeDisabled();
    });

    authTest("handles loading states", async ({ authenticatedPage: page }) => {
      await page.goto("/settings");

      // Should see loading skeleton initially
      await expect(page.locator('[data-testid="settings-skeleton"]')).toBeVisible();

      // Loading should disappear when data loads
      await expect(page.locator('[data-testid="settings-skeleton"]')).not.toBeVisible({ timeout: 10000 });

      // Form fields should be visible
      await expect(page.locator('input[name="name"]')).toBeVisible();
    });
  });
});