import { chromium, FullConfig } from "@playwright/test";

/**
 * Global setup for Playwright tests
 * Seeds the database before running the test suite via POST /api/seed
 */
async function globalSetup(config: FullConfig) {
  console.log("🌱 Starting global setup - seeding database...");

  // Get base URL from config or default to localhost
  const baseURL = config.projects[0].use.baseURL || "http://localhost:3000";

  // Get seed token from environment
  const seedToken = process.env.SEED_TOKEN;
  if (!seedToken) {
    throw new Error(
      "SEED_TOKEN environment variable is required for E2E tests",
    );
  }

  try {
    // Make request to seed endpoint
    const response = await fetch(`${baseURL}/api/seed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${seedToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to seed database: ${response.status} - ${errorText}`,
      );
    }

    const result = await response.json();
    console.log("✅ Database seeded successfully:", result.message);
    console.log("📊 Seed summary:", result.data?.counts);
  } catch (error) {
    console.error("❌ Failed to seed database:", error);
    throw error;
  }

  console.log("🎉 Global setup completed successfully");
}

export default globalSetup;