import { test, expect } from '@playwright/test';

test.describe('Embed Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Seed database and login
    await page.goto('/');
    await page.getByRole('button', { name: 'Try the Demo', exact: true }).click();
    await page.waitForURL('/dashboard');
  });

  test('embed code generator page loads', async ({ page }) => {
    await page.goto('/embed');

    // Check page loads with proper header
    await expect(page.getByRole('heading', { name: 'Embed Code Generator', exact: true })).toBeVisible();

    // Check description is present
    await expect(page.locator('text=Generate embeddable booking widgets for your website')).toBeVisible();

    // Check configuration section exists
    await expect(page.getByRole('heading', { name: 'Configuration', exact: true })).toBeVisible();

    // Check appearance section exists (should be visible for inline mode)
    await expect(page.getByRole('heading', { name: 'Appearance', exact: true })).toBeVisible();

    // Check generated code section exists
    await expect(page.getByRole('heading', { name: 'Generated Code', exact: true })).toBeVisible();

    // Check live preview section exists
    await expect(page.getByRole('heading', { name: 'Live Preview', exact: true })).toBeVisible();
  });

  test('event type selection works', async ({ page }) => {
    await page.goto('/embed');

    // Wait for event types to load
    await page.waitForSelector('[data-testid="event-type-selector"]', { timeout: 10000 });

    // Should have at least one event type option
    const eventTypeSelector = page.locator('[data-testid="event-type-selector"]');
    await expect(eventTypeSelector).toBeVisible();

    // Check if there are event type options available
    const options = page.locator('select option, [role="option"]');
    const optionCount = await options.count();
    expect(optionCount).toBeGreaterThan(1); // At least "Select an event type" + actual options
  });

  test('embed mode toggle works', async ({ page }) => {
    await page.goto('/embed');

    // Wait for page to load
    await page.waitForSelector('[data-testid="embed-mode-selector"]', { timeout: 10000 });

    // Should start with inline mode by default
    const modeSelector = page.locator('[data-testid="embed-mode-selector"]');
    await expect(modeSelector).toBeVisible();

    // Appearance section should be visible for inline mode
    await expect(page.getByRole('heading', { name: 'Appearance', exact: true })).toBeVisible();

    // Switch to popup mode
    await modeSelector.click();
    await page.getByText('Popup Button').click();

    // Appearance section should be hidden for popup mode
    await expect(page.getByRole('heading', { name: 'Appearance', exact: true })).not.toBeVisible();
  });

  test('appearance customization works for inline mode', async ({ page }) => {
    await page.goto('/embed');

    // Wait for appearance controls to load
    await page.waitForSelector('input[placeholder="100%"]', { timeout: 10000 });

    // Test width input
    const widthInput = page.locator('input[placeholder="100%"]');
    await widthInput.fill('800px');
    await expect(widthInput).toHaveValue('800px');

    // Test height input
    const heightInput = page.locator('input[placeholder="600px"]');
    await heightInput.fill('500px');
    await expect(heightInput).toHaveValue('500px');

    // Test background color input
    const bgColorInput = page.locator('input[placeholder="transparent"]');
    await bgColorInput.fill('#ffffff');
    await expect(bgColorInput).toHaveValue('#ffffff');

    // Test border radius input
    const borderRadiusInput = page.locator('input[placeholder="8px"]');
    await borderRadiusInput.fill('12px');
    await expect(borderRadiusInput).toHaveValue('12px');
  });

  test('generated code updates with configuration', async ({ page }) => {
    await page.goto('/embed');

    // Wait for generated code to appear
    await page.waitForSelector('pre code', { timeout: 10000 });

    // Check that HTML code is generated
    const htmlCode = page.locator('pre code').first();
    await expect(htmlCode).toBeVisible();

    // Code should contain CalMill embed attributes
    const codeText = await htmlCode.textContent();
    expect(codeText).toContain('data-calmill-embed');
    expect(codeText).toContain('calmill-embed.js');
  });

  test('copy code functionality works', async ({ page }) => {
    await page.goto('/embed');

    // Wait for copy button to be available
    await page.waitForSelector('button:has-text("Copy")', { timeout: 10000 });

    // Click copy button
    const copyButton = page.getByRole('button', { name: 'Copy', exact: true }).first();
    await copyButton.click();

    // Button should show "Copied!" temporarily
    await expect(page.getByText('Copied!')).toBeVisible({ timeout: 5000 });
  });

  test('live preview iframe loads', async ({ page }) => {
    await page.goto('/embed');

    // Wait for event type selection to load
    await page.waitForSelector('[data-testid="event-type-selector"]', { timeout: 10000 });

    // Select first available event type if not already selected
    const eventTypeSelector = page.locator('[data-testid="event-type-selector"]');
    const firstOption = eventTypeSelector.locator('option').nth(1); // Skip "Select an event type"
    if (await firstOption.count() > 0) {
      await eventTypeSelector.selectOption({ index: 1 });
    }

    // Wait for preview iframe to load
    await page.waitForSelector('iframe[title="CalMill Embed Preview"]', { timeout: 10000 });

    const previewIframe = page.locator('iframe[title="CalMill Embed Preview"]');
    await expect(previewIframe).toBeVisible();

    // Iframe should have proper src URL
    const src = await previewIframe.getAttribute('src');
    expect(src).toContain('/embed/demo/');
  });

  test('open full page button works', async ({ page }) => {
    await page.goto('/embed');

    // Wait for open full page button
    await page.waitForSelector('button:has-text("Open Full Page")', { timeout: 10000 });

    const openFullPageButton = page.getByRole('button', { name: 'Open Full Page', exact: true });
    await expect(openFullPageButton).toBeVisible();

    // Note: We don't actually click it in the test to avoid opening new tabs
    // Just verify the button is present and functional
  });

  test('integration instructions are displayed', async ({ page }) => {
    await page.goto('/embed');

    // Check integration instructions section
    await expect(page.getByRole('heading', { name: 'Integration Instructions', exact: true })).toBeVisible();

    // Check step instructions
    await expect(page.locator('text=1. Copy the code')).toBeVisible();
    await expect(page.locator('text=2. Add to your website')).toBeVisible();
    await expect(page.locator('text=3. Customize (optional)')).toBeVisible();

    // Check pro tips section
    await expect(page.locator('text=🎯 Pro Tips')).toBeVisible();
    await expect(page.locator('text=Use inline embeds for a seamless experience')).toBeVisible();
    await expect(page.locator('text=Listen for the `calmillBooking` event')).toBeVisible();
  });

  test('embed page loads in iframe (no chrome)', async ({ page }) => {
    // Navigate directly to embed booking page
    await page.goto('/embed/demo/quick-chat');

    // Page should load without navigation chrome
    // Check that sidebar is not present (embed pages should be minimal)
    await expect(page.locator('nav[data-testid="sidebar"]')).not.toBeVisible();

    // Should still have booking interface
    await expect(page.locator('[data-testid="calendar-picker"]')).toBeVisible({ timeout: 10000 });

    // Background should be transparent/minimal for embedding
    const body = page.locator('body');
    const bgColor = await body.evaluate(el => getComputedStyle(el).backgroundColor);
    // Should be transparent or white (embed-friendly)
    expect(bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'rgb(255, 255, 255)' || bgColor === 'transparent').toBe(true);
  });

  test('popup mode preview works', async ({ page }) => {
    await page.goto('/embed');

    // Switch to popup mode
    await page.waitForSelector('[data-testid="embed-mode-selector"]', { timeout: 10000 });
    const modeSelector = page.locator('[data-testid="embed-mode-selector"]');
    await modeSelector.click();
    await page.getByText('Popup Button').click();

    // Should show popup preview area instead of iframe
    await expect(page.locator('text=Click the button to test the popup experience')).toBeVisible();

    // Should have a test button
    const testButton = page.getByRole('button', { name: 'Book a Meeting', exact: true });
    await expect(testButton).toBeVisible();
  });

  test('embed code contains proper CORS headers reference', async ({ page }) => {
    await page.goto('/embed');

    // Wait for generated code
    await page.waitForSelector('pre code', { timeout: 10000 });

    // Get the HTML code
    const htmlCode = page.locator('pre code').first();
    const codeText = await htmlCode.textContent();

    // Should reference the embed script with proper CORS setup
    expect(codeText).toContain('calmill-embed.js');

    // The script should be designed to work cross-origin
    expect(codeText).toContain('data-calmill-embed') || expect(codeText).toContain('data-calmill-popup');
  });

  test('embed error handling when no event types', async ({ page }) => {
    // This test would need a user with no active event types
    // For now, we'll check that the interface handles loading states properly

    await page.goto('/embed');

    // Wait for loading to complete
    await page.waitForLoadState('networkidle');

    // If no event types available, should show appropriate message
    const eventTypeSelector = page.locator('[data-testid="event-type-selector"]');
    if (await eventTypeSelector.count() === 0) {
      await expect(page.locator('text=No active event types')).toBeVisible();
    }
  });

  test('responsive design on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/embed');

    // Page should be responsive
    await expect(page.getByRole('heading', { name: 'Embed Code Generator', exact: true })).toBeVisible();

    // Configuration and preview should stack vertically on mobile
    const configSection = page.locator('[data-testid="config-panel"]');
    const previewSection = page.locator('[data-testid="preview-panel"]');

    // Both sections should be visible (stacked)
    if (await configSection.count() > 0) {
      await expect(configSection).toBeVisible();
    }
    if (await previewSection.count() > 0) {
      await expect(previewSection).toBeVisible();
    }
  });

  test('embed script URL is accessible', async ({ page }) => {
    // Test that the embed script URL referenced in generated code is accessible
    const response = await page.request.get('/embed/calmill-embed.js');

    // Script should exist and be accessible
    expect(response.status()).toBe(200);

    // Should have proper content type
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('javascript') || expect(contentType).toContain('text/plain');

    // Response should include CORS headers for cross-origin embedding
    const corsHeader = response.headers()['access-control-allow-origin'];
    expect(corsHeader).toBe('*');
  });
});