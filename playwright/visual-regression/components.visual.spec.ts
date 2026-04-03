/**
 * components.visual.spec.ts — Screenshot baseline visual regression
 *
 * Suite: visual-regression (component-scoped screenshots)
 * First run: creates baselines in playwright/visual-regression/snapshots/
 * Subsequent runs: diffs against baselines — fail on unexpected changes
 *
 * Update baselines: npx playwright test --update-snapshots
 */

import { test, expect } from '@playwright/test';

const VIEWPORT = { width: 1280, height: 720 };

test.use({ viewport: VIEWPORT });

test.describe('Button visual regression', () => {
  test('Primary button baseline', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--primary&viewMode=story');
    await page.waitForSelector('.arco-btn-primary', { timeout: 10000 });
    await page.waitForTimeout(300); // allow CSS transitions to settle
    await expect(page.locator('.arco-btn-primary').first()).toHaveScreenshot('button-primary.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('Button type matrix baseline', async ({ page }) => {
    // Use the color-matrix-like story showing all variants
    await page.goto('/iframe.html?id=components-button--secondary&viewMode=story');
    await page.waitForSelector('.arco-btn', { timeout: 10000 });
    await page.waitForTimeout(300);
    await expect(page.locator('.arco-btn').first()).toHaveScreenshot('button-secondary.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('Disabled button baseline', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--disabled&viewMode=story');
    await page.waitForSelector('.arco-btn[disabled]', { timeout: 5000 });
    await page.waitForTimeout(300);
    await expect(page.locator('.arco-btn[disabled]').first()).toHaveScreenshot('button-disabled.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});

test.describe('Switch visual regression', () => {
  test('Switch off state baseline', async ({ page }) => {
    await page.goto('/iframe.html?id=components-switch--off&viewMode=story');
    await page.waitForSelector('.arco-switch', { timeout: 10000 });
    await page.waitForTimeout(300);
    await expect(page.locator('.arco-switch').first()).toHaveScreenshot('switch-off.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('Switch on state baseline', async ({ page }) => {
    await page.goto('/iframe.html?id=components-switch--on&viewMode=story');
    await page.waitForSelector('.arco-switch', { timeout: 10000 });
    await page.waitForTimeout(300);
    await expect(page.locator('.arco-switch').first()).toHaveScreenshot('switch-on.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});

test.describe('Tag visual regression', () => {
  test('Tag color matrix baseline', async ({ page }) => {
    await page.goto('/iframe.html?id=components-tag--color-matrix&viewMode=story');
    await page.waitForSelector('.arco-tag', { timeout: 10000 });
    await page.waitForTimeout(300);
    // Full story screenshot to capture all color variants
    await expect(page).toHaveScreenshot('tag-color-matrix.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});

test.describe('Card visual regression', () => {
  test('Card default baseline', async ({ page }) => {
    await page.goto('/iframe.html?id=components-card--default&viewMode=story');
    await page.waitForSelector('.arco-card', { timeout: 10000 });
    await page.waitForTimeout(300);
    await expect(page.locator('.arco-card').first()).toHaveScreenshot('card-default.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});
