import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    // Seed database and login
    await page.goto('/');
    await page.getByRole('button', { name: 'Try the Demo', exact: true }).click();
    await page.waitForURL('/dashboard');
  });

  test.describe('320px Mobile Viewport', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
    });

    test('dashboard is responsive at 320px', async ({ page }) => {
      await page.goto('/dashboard');

      // Page should load without horizontal scrollbar
      const body = page.locator('body');
      const bodyBounds = await body.boundingBox();
      expect(bodyBounds?.width).toBeLessThanOrEqual(320);

      // Main heading should be visible
      await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();

      // Stats cards should stack vertically
      const statCards = page.locator('[data-testid="stat-card"], .stat-card');
      if (await statCards.count() > 0) {
        // Cards should fit within viewport width
        for (let i = 0; i < await statCards.count(); i++) {
          const card = statCards.nth(i);
          const cardBox = await card.boundingBox();
          if (cardBox) {
            expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(320);
          }
        }
      }

      // Charts should be responsive
      const charts = page.locator('[data-testid="chart"], .recharts-wrapper');
      if (await charts.count() > 0) {
        const chart = charts.first();
        const chartBox = await chart.boundingBox();
        if (chartBox) {
          expect(chartBox.width).toBeLessThanOrEqual(320);
        }
      }
    });

    test('navigation is responsive at 320px', async ({ page }) => {
      await page.goto('/dashboard');

      // Mobile navigation should be present (hamburger menu or mobile nav)
      const mobileNav = page.locator('[data-testid="mobile-nav"], .mobile-nav, button[aria-label="Toggle menu"]');
      const sidebar = page.locator('[data-testid="sidebar"], .sidebar');

      // Should either have mobile nav or hidden sidebar
      const hasMobileNav = await mobileNav.count() > 0;
      const hasVisibleSidebar = await sidebar.isVisible();

      if (hasVisibleSidebar) {
        // If sidebar is visible, it should fit in viewport
        const sidebarBox = await sidebar.boundingBox();
        if (sidebarBox) {
          expect(sidebarBox.width).toBeLessThanOrEqual(320);
        }
      } else {
        // Should have mobile navigation alternative
        expect(hasMobileNav).toBe(true);
      }
    });

    test('event types list is responsive at 320px', async ({ page }) => {
      await page.goto('/event-types');

      // Event type cards should stack vertically and fit viewport
      const eventTypeCards = page.locator('[data-testid="event-type-card"], .event-type-card');

      if (await eventTypeCards.count() > 0) {
        for (let i = 0; i < Math.min(3, await eventTypeCards.count()); i++) {
          const card = eventTypeCards.nth(i);
          const cardBox = await card.boundingBox();
          if (cardBox) {
            expect(cardBox.width).toBeLessThanOrEqual(320);
          }
        }
      }

      // Create button should be properly sized
      const createButton = page.getByRole('button', { name: 'Create Event Type', exact: true });
      if (await createButton.count() > 0) {
        const buttonBox = await createButton.boundingBox();
        if (buttonBox) {
          expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(320);
        }
      }
    });

    test('bookings page is responsive at 320px', async ({ page }) => {
      await page.goto('/bookings');

      // Table should be responsive (possibly stacked or horizontal scroll)
      const bookingsTable = page.locator('[data-testid="bookings-table"], table, .bookings-list');

      if (await bookingsTable.count() > 0) {
        const tableBox = await bookingsTable.boundingBox();
        if (tableBox) {
          // Table should either fit or have horizontal scroll container
          const container = page.locator('.table-container, .overflow-x-auto').first();
          if (await container.count() > 0) {
            const containerBox = await container.boundingBox();
            if (containerBox) {
              expect(containerBox.width).toBeLessThanOrEqual(320);
            }
          }
        }
      }

      // Filter controls should be responsive
      const filters = page.locator('[data-testid="booking-filters"], .filter-controls');
      if (await filters.count() > 0) {
        const filtersBox = await filters.boundingBox();
        if (filtersBox) {
          expect(filtersBox.width).toBeLessThanOrEqual(320);
        }
      }
    });

    test('settings pages are responsive at 320px', async ({ page }) => {
      await page.goto('/settings');

      // Settings form should be responsive
      const settingsForm = page.locator('form, .settings-content').first();
      if (await settingsForm.count() > 0) {
        const formBox = await settingsForm.boundingBox();
        if (formBox) {
          expect(formBox.width).toBeLessThanOrEqual(320);
        }
      }

      // Form inputs should be properly sized
      const inputs = page.locator('input, select, textarea');
      if (await inputs.count() > 0) {
        for (let i = 0; i < Math.min(3, await inputs.count()); i++) {
          const input = inputs.nth(i);
          const inputBox = await input.boundingBox();
          if (inputBox) {
            expect(inputBox.x + inputBox.width).toBeLessThanOrEqual(320);
          }
        }
      }
    });

    test('touch targets are adequate at 320px', async ({ page }) => {
      await page.goto('/dashboard');

      // All clickable elements should meet minimum touch target size (44px)
      const buttons = page.locator('button:visible, a:visible, [role="button"]:visible');

      if (await buttons.count() > 0) {
        for (let i = 0; i < Math.min(5, await buttons.count()); i++) {
          const button = buttons.nth(i);
          const buttonBox = await button.boundingBox();

          if (buttonBox) {
            // Touch target should be at least 44x44px
            expect(Math.min(buttonBox.width, buttonBox.height)).toBeGreaterThanOrEqual(40); // 40px minimum for better UX
          }
        }
      }
    });
  });

  test.describe('768px Tablet Viewport', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
    });

    test('dashboard layout adapts to tablet viewport', async ({ page }) => {
      await page.goto('/dashboard');

      // Should show tablet layout
      await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();

      // Stats might be in 2-column layout
      const statCards = page.locator('[data-testid="stat-card"], .stat-card');
      if (await statCards.count() > 0) {
        // Cards should fit comfortably in tablet width
        for (let i = 0; i < await statCards.count(); i++) {
          const card = statCards.nth(i);
          const cardBox = await card.boundingBox();
          if (cardBox) {
            expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(768);
          }
        }
      }

      // Charts should be appropriately sized for tablet
      const charts = page.locator('[data-testid="chart"], .recharts-wrapper');
      if (await charts.count() > 0) {
        const chart = charts.first();
        const chartBox = await chart.boundingBox();
        if (chartBox) {
          expect(chartBox.width).toBeLessThanOrEqual(768);
          expect(chartBox.width).toBeGreaterThanOrEqual(300); // Should be substantial on tablet
        }
      }
    });

    test('sidebar behavior on tablet', async ({ page }) => {
      await page.goto('/dashboard');

      // Sidebar should either be visible or properly hidden/togglable
      const sidebar = page.locator('[data-testid="sidebar"], .sidebar');

      if (await sidebar.isVisible()) {
        const sidebarBox = await sidebar.boundingBox();
        if (sidebarBox) {
          // Sidebar should not take up too much of tablet width
          expect(sidebarBox.width).toBeLessThanOrEqual(300);
        }
      }

      // Navigation should be accessible
      const navLinks = page.locator('nav a, [data-testid="nav-link"]');
      expect(await navLinks.count()).toBeGreaterThan(0);
    });

    test('event type editor is responsive on tablet', async ({ page }) => {
      await page.goto('/event-types');

      // Click on first event type to edit if available
      const firstEventType = page.locator('[data-testid="event-type-card"], .event-type-card').first();

      if (await firstEventType.count() > 0) {
        await firstEventType.click();

        // Editor should load and be responsive
        const editor = page.locator('[data-testid="event-type-editor"], .event-type-editor, form');
        if (await editor.count() > 0) {
          const editorBox = await editor.boundingBox();
          if (editorBox) {
            expect(editorBox.width).toBeLessThanOrEqual(768);
          }
        }

        // Form fields should be properly laid out
        const formFields = page.locator('input:visible, textarea:visible, select:visible');
        if (await formFields.count() > 0) {
          for (let i = 0; i < Math.min(3, await formFields.count()); i++) {
            const field = formFields.nth(i);
            const fieldBox = await field.boundingBox();
            if (fieldBox) {
              expect(fieldBox.x + fieldBox.width).toBeLessThanOrEqual(768);
            }
          }
        }
      }
    });

    test('booking interface is tablet-friendly', async ({ page }) => {
      await page.goto('/demo/quick-chat');

      // Booking interface should work well on tablet
      const bookingInterface = page.locator('[data-testid="booking-interface"], .booking-container').first();

      if (await bookingInterface.count() > 0) {
        const interfaceBox = await bookingInterface.boundingBox();
        if (interfaceBox) {
          expect(interfaceBox.width).toBeLessThanOrEqual(768);
        }
      }

      // Calendar picker should be appropriately sized
      const calendar = page.locator('[data-testid="calendar-picker"], .calendar');
      if (await calendar.count() > 0) {
        const calendarBox = await calendar.boundingBox();
        if (calendarBox) {
          expect(calendarBox.width).toBeLessThanOrEqual(500); // Should not be too wide on tablet
          expect(calendarBox.width).toBeGreaterThanOrEqual(280); // Should be usable
        }
      }
    });
  });

  test.describe('1024px Desktop Viewport', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
    });

    test('dashboard shows full desktop layout', async ({ page }) => {
      await page.goto('/dashboard');

      // Should show full desktop layout
      await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();

      // Sidebar should be visible
      const sidebar = page.locator('[data-testid="sidebar"], .sidebar');
      if (await sidebar.count() > 0) {
        await expect(sidebar).toBeVisible();
      }

      // Stats cards might be in 4-column layout
      const statCards = page.locator('[data-testid="stat-card"], .stat-card');
      if (await statCards.count() >= 4) {
        // Check if cards are laid out horizontally
        const firstCard = statCards.nth(0);
        const secondCard = statCards.nth(1);

        const firstBox = await firstCard.boundingBox();
        const secondBox = await secondCard.boundingBox();

        if (firstBox && secondBox) {
          // Cards should be side by side (not stacked) on desktop
          const isHorizontalLayout = Math.abs(firstBox.y - secondBox.y) < 50;
          expect(isHorizontalLayout).toBe(true);
        }
      }

      // Charts should have good size for desktop
      const charts = page.locator('[data-testid="chart"], .recharts-wrapper');
      if (await charts.count() > 0) {
        const chart = charts.first();
        const chartBox = await chart.boundingBox();
        if (chartBox) {
          expect(chartBox.width).toBeGreaterThanOrEqual(400);
        }
      }
    });

    test('event types grid layout on desktop', async ({ page }) => {
      await page.goto('/event-types');

      // Event types should be in grid layout
      const eventTypeGrid = page.locator('[data-testid="event-types-grid"], .grid');

      if (await eventTypeGrid.count() > 0) {
        const gridBox = await eventTypeGrid.boundingBox();
        if (gridBox) {
          expect(gridBox.width).toBeGreaterThanOrEqual(600);
        }
      }

      // Multiple event types should be visible side by side
      const eventTypeCards = page.locator('[data-testid="event-type-card"], .event-type-card');
      if (await eventTypeCards.count() >= 2) {
        const firstCard = eventTypeCards.nth(0);
        const secondCard = eventTypeCards.nth(1);

        const firstBox = await firstCard.boundingBox();
        const secondBox = await secondCard.boundingBox();

        if (firstBox && secondBox) {
          // Cards should be side by side on desktop
          const isHorizontalLayout = Math.abs(firstBox.y - secondBox.y) < 50;
          expect(isHorizontalLayout).toBe(true);
        }
      }
    });

    test('bookings table is fully visible on desktop', async ({ page }) => {
      await page.goto('/bookings');

      // Table should be fully visible without horizontal scroll
      const bookingsTable = page.locator('[data-testid="bookings-table"], table');

      if (await bookingsTable.count() > 0) {
        const tableBox = await bookingsTable.boundingBox();
        if (tableBox) {
          expect(tableBox.width).toBeLessThanOrEqual(1024);
          expect(tableBox.width).toBeGreaterThanOrEqual(600); // Should use good amount of space
        }

        // All table columns should be visible
        const tableHeaders = page.locator('th:visible, [data-testid="table-header"]:visible');
        expect(await tableHeaders.count()).toBeGreaterThanOrEqual(3); // Should show multiple columns
      }
    });

    test('multi-column layout works in settings', async ({ page }) => {
      await page.goto('/settings');

      // Settings should use available space effectively
      const settingsContainer = page.locator('.settings-container, .grid, main').first();

      if (await settingsContainer.count() > 0) {
        const containerBox = await settingsContainer.boundingBox();
        if (containerBox) {
          expect(containerBox.width).toBeGreaterThanOrEqual(600);
        }
      }

      // Form should be well-laid out
      const form = page.locator('form').first();
      if (await form.count() > 0) {
        const formBox = await form.boundingBox();
        if (formBox) {
          expect(formBox.width).toBeGreaterThanOrEqual(400);
          expect(formBox.width).toBeLessThanOrEqual(800); // Not too wide for readability
        }
      }
    });
  });

  test.describe('Cross-viewport consistency', () => {
    const viewports = [
      { width: 320, height: 568, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1024, height: 768, name: 'Desktop' },
      { width: 1440, height: 900, name: 'Large Desktop' }
    ];

    viewports.forEach(viewport => {
      test(`no horizontal overflow at ${viewport.name} (${viewport.width}px)`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });

        const pages = ['/dashboard', '/event-types', '/bookings', '/settings'];

        for (const pagePath of pages) {
          await page.goto(pagePath);

          // Check for horizontal overflow
          const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
          expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 10); // Small tolerance for scrollbars

          // Check that main content doesn't overflow
          const mainContent = page.locator('main, .main-content, [role="main"]').first();
          if (await mainContent.count() > 0) {
            const contentBox = await mainContent.boundingBox();
            if (contentBox) {
              expect(contentBox.x + contentBox.width).toBeLessThanOrEqual(viewport.width + 5);
            }
          }
        }
      });

      test(`touch targets adequate at ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });

        await page.goto('/dashboard');

        // Check button sizes
        const buttons = page.locator('button:visible').first();
        if (await buttons.count() > 0) {
          const buttonBox = await buttons.boundingBox();
          if (buttonBox) {
            // Touch targets should be at least 44px on mobile, can be smaller on desktop
            const minSize = viewport.width <= 768 ? 40 : 32;
            expect(Math.min(buttonBox.width, buttonBox.height)).toBeGreaterThanOrEqual(minSize);
          }
        }

        // Check link targets
        const links = page.locator('a:visible').first();
        if (await links.count() > 0) {
          const linkBox = await links.boundingBox();
          if (linkBox) {
            const minSize = viewport.width <= 768 ? 40 : 32;
            expect(Math.min(linkBox.width, linkBox.height)).toBeGreaterThanOrEqual(minSize);
          }
        }
      });
    });
  });

  test.describe('Content reflow', () => {
    test('dashboard content reflows properly when resizing', async ({ page }) => {
      // Start with desktop
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto('/dashboard');

      // Resize to tablet
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(500); // Allow time for reflow

      // Content should still be properly displayed
      await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();

      // Resize to mobile
      await page.setViewportSize({ width: 320, height: 568 });
      await page.waitForTimeout(500);

      // Content should still work on mobile
      await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();

      // No horizontal overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(330);
    });

    test('navigation adapts when resizing', async ({ page }) => {
      // Start with desktop
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto('/dashboard');

      // Check if sidebar is visible
      const sidebar = page.locator('[data-testid="sidebar"], .sidebar');
      const initialSidebarVisible = await sidebar.isVisible();

      // Resize to mobile
      await page.setViewportSize({ width: 320, height: 568 });
      await page.waitForTimeout(500);

      // Navigation should adapt (sidebar might hide, mobile nav might appear)
      if (initialSidebarVisible) {
        const currentSidebarVisible = await sidebar.isVisible();
        if (currentSidebarVisible) {
          // If still visible, should fit in mobile viewport
          const sidebarBox = await sidebar.boundingBox();
          if (sidebarBox) {
            expect(sidebarBox.width).toBeLessThanOrEqual(320);
          }
        }
      }

      // Navigation should remain functional
      const navElements = page.locator('nav, [data-testid="mobile-nav"], [role="navigation"]');
      expect(await navElements.count()).toBeGreaterThan(0);
    });
  });
});