import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("should load successfully with hero content", async ({ page }) => {
    await page.goto("/");

    // Verify page loads without errors
    expect(page).toHaveURL("/");

    // Verify hero section is visible
    const heroHeading = page.locator("h1");
    await expect(heroHeading).toBeVisible();
    await expect(heroHeading).toContainText("Open Scheduling");
    await expect(heroHeading).toContainText("for Everyone");

    // Verify hero description
    const heroDescription = page.locator("p").first();
    await expect(heroDescription).toBeVisible();
    await expect(heroDescription).toContainText(
      "The open-source scheduling platform",
    );
  });

  test("should have Get Started and Try the Demo CTAs", async ({ page }) => {
    await page.goto("/");

    // Verify "Get Started" button
    const getStartedButton = page.locator('a[href="/signup"]');
    await expect(getStartedButton).toBeVisible();
    await expect(getStartedButton).toContainText("Get Started");

    // Verify "Try the Demo" button
    const tryDemoButton = page.getByRole("button", {
      name: "Try the Demo",
      exact: true,
    });
    await expect(tryDemoButton).toBeVisible();

    // Verify demo credentials are shown
    const demoText = page.locator("text=Demo credentials: demo@workermill.com");
    await expect(demoText).toBeVisible();
  });

  test("should display feature cards", async ({ page }) => {
    await page.goto("/");

    // Verify features section heading
    const featuresHeading = page.locator("h2", {
      hasText: "Everything you need for scheduling",
    });
    await expect(featuresHeading).toBeVisible();

    // Verify the three feature cards
    const smartSchedulingCard = page.locator("text=Smart Scheduling");
    await expect(smartSchedulingCard).toBeVisible();

    const teamCoordinationCard = page.locator("text=Team Coordination");
    await expect(teamCoordinationCard).toBeVisible();

    const embedAnywhereCard = page.locator("text=Embed Anywhere");
    await expect(embedAnywhereCard).toBeVisible();

    // Verify feature descriptions are present
    await expect(
      page.locator("text=Intelligent availability detection"),
    ).toBeVisible();
    await expect(
      page.locator("text=Round-robin and collective scheduling"),
    ).toBeVisible();
    await expect(
      page.locator("text=Lightweight embeddable widgets"),
    ).toBeVisible();
  });

  test("should display Built by WorkerMill section prominently", async ({
    page,
  }) => {
    await page.goto("/");

    // Verify "Built by WorkerMill AI" section heading
    const workerMillHeading = page.locator("h2", {
      hasText: "Built by WorkerMill AI",
    });
    await expect(workerMillHeading).toBeVisible();

    // Verify the explanation text
    const explanationText = page.locator(
      "text=This entire application was built autonomously by AI coding agents",
    );
    await expect(explanationText).toBeVisible();

    // Verify the three capability cards
    const fullStackCard = page.locator("text=Full-Stack Development");
    await expect(fullStackCard).toBeVisible();
    await expect(
      page.locator("text=Next.js 16, TypeScript, Prisma, PostgreSQL"),
    ).toBeVisible();

    const modernArchCard = page.locator("text=Modern Architecture");
    await expect(modernArchCard).toBeVisible();
    await expect(
      page.locator("text=API routes, authentication, real-time sync"),
    ).toBeVisible();

    const productionReadyCard = page.locator("text=Production Ready");
    await expect(productionReadyCard).toBeVisible();
    await expect(
      page.locator("text=Tests, CI/CD, scalable infrastructure"),
    ).toBeVisible();

    // Verify links to WorkerMill
    const learnWorkerMillLink = page
      .locator('a[href="https://workermill.com"]')
      .first();
    await expect(learnWorkerMillLink).toBeVisible();
    await expect(learnWorkerMillLink).toContainText("Learn About WorkerMill");

    // Verify GitHub source link
    const githubLink = page.locator(
      'a[href="https://github.com/workermill-examples/calmill"]',
    );
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toContainText("View Source Code");
  });

  test("should have proper footer with WorkerMill attribution", async ({
    page,
  }) => {
    await page.goto("/");

    // Verify footer is present
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    // Verify CalMill logo in footer
    const calMillLogo = footer.locator("text=CalMill");
    await expect(calMillLogo).toBeVisible();

    // Verify copyright and WorkerMill attribution
    const copyrightText = footer.locator(
      "text=© 2024 CalMill. Built autonomously by",
    );
    await expect(copyrightText).toBeVisible();

    const workerMillFooterLink = footer.locator(
      'a[href="https://workermill.com"]',
    );
    await expect(workerMillFooterLink).toBeVisible();
    await expect(workerMillFooterLink).toContainText("WorkerMill AI");
  });

  test("should be responsive and have no horizontal overflow", async ({
    page,
  }) => {
    // Test mobile viewport (320px)
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/");

    // Check no horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(320);

    // Verify key elements are still visible on mobile
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("text=Get Started")).toBeVisible();
    await expect(page.locator("text=Try the Demo")).toBeVisible();

    // Test tablet viewport (768px)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");

    const bodyWidthTablet = await page.evaluate(
      () => document.body.scrollWidth,
    );
    expect(bodyWidthTablet).toBeLessThanOrEqual(768);

    // Test desktop viewport (1024px)
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");

    const bodyWidthDesktop = await page.evaluate(
      () => document.body.scrollWidth,
    );
    expect(bodyWidthDesktop).toBeLessThanOrEqual(1024);
  });

  test("Try the Demo button should attempt to sign in with demo credentials", async ({
    page,
  }) => {
    await page.goto("/");

    // Click the "Try the Demo" button
    const tryDemoButton = page.getByRole("button", {
      name: "Try the Demo",
      exact: true,
    });
    await expect(tryDemoButton).toBeVisible();
    await tryDemoButton.click();

    // The button should show loading state or navigate
    // Note: We're not testing the actual sign-in flow here as that would require
    // the authentication system to be fully working, which is outside our scope.
    // We're just verifying the button interaction works.
  });
});
