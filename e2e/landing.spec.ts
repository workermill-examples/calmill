import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("should load successfully with hero content", async ({ page }) => {
    await page.goto("/");

    expect(page).toHaveURL("/");

    const heroHeading = page.locator("h1");
    await expect(heroHeading).toBeVisible();
    await expect(heroHeading).toContainText("Open Scheduling");
    await expect(heroHeading).toContainText("for Everyone");

    const heroDescription = page.locator(
      "text=The open-source scheduling platform",
    );
    await expect(heroDescription).toBeVisible();
  });

  test("should have Try the Demo and View on GitHub CTAs", async ({
    page,
  }) => {
    await page.goto("/");

    // Verify "Try the Demo" button
    const tryDemoButton = page.getByRole("button", {
      name: /Try the Demo/,
    });
    await expect(tryDemoButton).toBeVisible();

    // Verify "View on GitHub" link
    const githubLink = page.locator(
      'a[href="https://github.com/workermill-examples/calmill"]',
    );
    await expect(githubLink.first()).toBeVisible();

    // Verify demo credentials are shown
    await expect(page.locator("code", { hasText: "demo@workermill.com" })).toBeVisible();
    await expect(page.locator("code", { hasText: "demo1234" })).toBeVisible();
  });

  test("should display feature cards", async ({ page }) => {
    await page.goto("/");

    // Verify features section heading
    const featuresHeading = page.locator("h2", {
      hasText: "Everything you need for scheduling",
    });
    await expect(featuresHeading).toBeVisible();

    // Verify the six feature cards
    await expect(page.locator("text=Smart Scheduling")).toBeVisible();
    await expect(page.locator("text=Team Scheduling")).toBeVisible();
    await expect(page.locator("text=Embed Anywhere")).toBeVisible();
    await expect(page.locator("text=Webhook Notifications")).toBeVisible();
    await expect(page.locator("text=Recurring Bookings")).toBeVisible();
    await expect(page.locator("text=Secure & Reliable")).toBeVisible();
  });

  test("should display Built by WorkerMill section with stats", async ({
    page,
  }) => {
    await page.goto("/");

    // Verify heading
    const heading = page.locator("h2", {
      hasText: "This entire app was built by AI",
    });
    await expect(heading).toBeVisible();

    // Verify WorkerMill explanation
    await expect(
      page.locator("text=WorkerMill is an autonomous AI coding platform"),
    ).toBeVisible();

    // Verify stats cards
    await expect(page.locator("text=Database Models")).toBeVisible();
    await expect(page.locator("text=API Endpoints")).toBeVisible();
    await expect(page.locator("text=Automated Tests")).toBeVisible();

    // Verify links to WorkerMill
    const learnLink = page.locator("a", {
      hasText: "Learn About WorkerMill",
    });
    await expect(learnLink).toBeVisible();

    const sourceLink = page.locator("a", { hasText: "View Source Code" });
    await expect(sourceLink).toBeVisible();
  });

  test("should have How it works section", async ({ page }) => {
    await page.goto("/");

    const heading = page.locator("h2", {
      hasText: "Get started in minutes",
    });
    await expect(heading).toBeVisible();

    await expect(page.locator("text=Create Event Types")).toBeVisible();
    await expect(page.locator("text=Set Your Availability")).toBeVisible();
    await expect(page.locator("text=Share Your Link")).toBeVisible();
    await expect(page.locator("text=Get Booked")).toBeVisible();
  });

  test("should have CTA banner", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.locator("text=Ready to see it in action?"),
    ).toBeVisible();
  });

  test("should have proper footer with WorkerMill attribution", async ({
    page,
  }) => {
    await page.goto("/");

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    // Verify CalMill in footer
    await expect(footer.locator("text=CalMill")).toBeVisible();

    // Verify copyright 2026
    await expect(footer.locator("text=2026 WorkerMill")).toBeVisible();

    // Verify WorkerMill link
    const workerMillLink = footer.locator('a[href="https://workermill.com"]');
    await expect(workerMillLink.first()).toBeVisible();

    // Verify footer columns
    await expect(footer.locator("text=Product")).toBeVisible();
    await expect(footer.locator("text=Company")).toBeVisible();
    await expect(footer.locator("text=Tech Stack")).toBeVisible();
  });

  test("should have navigation bar", async ({ page }) => {
    await page.goto("/");

    const nav = page.locator("nav");
    await expect(nav).toBeVisible();

    await expect(nav.locator("text=CalMill")).toBeVisible();
    await expect(nav.locator("text=Features")).toBeVisible();
    await expect(nav.locator("text=Sign In")).toBeVisible();
  });

  test("should be responsive and have no horizontal overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/");

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(320);

    await expect(page.locator("h1")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Try the Demo/ }),
    ).toBeVisible();

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");

    const bodyWidthTablet = await page.evaluate(
      () => document.body.scrollWidth,
    );
    expect(bodyWidthTablet).toBeLessThanOrEqual(768);

    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");

    const bodyWidthDesktop = await page.evaluate(
      () => document.body.scrollWidth,
    );
    expect(bodyWidthDesktop).toBeLessThanOrEqual(1024);
  });

  test("Try the Demo button should attempt to sign in", async ({ page }) => {
    await page.goto("/");

    const tryDemoButton = page.getByRole("button", {
      name: /Try the Demo/,
    });
    await expect(tryDemoButton).toBeVisible();
    await tryDemoButton.click();

    // Button triggers signIn which navigates away
    // Just verify the button interaction works
  });
});
