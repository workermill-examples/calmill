import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Use single worker in CI to prevent timeouts with 400+ tests */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    /* Take screenshot on failure */
    screenshot: "only-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Shared test timeout */
  timeout: 30000,
  expect: {
    timeout: 10000,
  },

  /* Global setup to seed the database before running tests */
  globalSetup: require.resolve("./e2e/global-setup.ts"),

  /* Run your local dev server before starting the tests */
  webServer: {
    command: process.env.CI ? "npm run start" : "npm run build && npm run start",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    env: {
      ...process.env,
      AUTH_TRUST_HOST: "true",
    },
    timeout: 180000,
  },
});
