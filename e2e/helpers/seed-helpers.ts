/**
 * Seed helpers for CalMill E2E tests.
 *
 * Provides utilities to reset database state before test suites,
 * ensuring consistent seed data for all test runs.
 */

import type { Page } from "@playwright/test";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

export const SEED_TOKEN = process.env.SEED_TOKEN ?? "calmill-seed-token-dev";

// ─── SEED HELPERS ─────────────────────────────────────────────────────────────

/**
 * Trigger the database seed via the API seed endpoint.
 * This is idempotent — calling it multiple times is safe.
 * Throws if the seed endpoint returns an error response.
 */
export async function triggerDatabaseSeed(page: Page): Promise<void> {
  const response = await page.request.post("/api/seed", {
    headers: { "x-seed-token": SEED_TOKEN },
  });
  if (!response.ok()) {
    throw new Error(
      `Seed endpoint failed: HTTP ${response.status()} — ${await response.text()}`
    );
  }
}

/**
 * Wait for the seed to complete and the app to be ready.
 * Polls the health endpoint until it returns 200.
 */
export async function waitForAppReady(page: Page): Promise<void> {
  let retries = 0;
  while (retries < 10) {
    const response = await page.request.get("/api/health");
    if (response.ok()) break;
    await page.waitForTimeout(500);
    retries++;
  }
}
