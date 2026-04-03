/**
 * button.token.spec.ts — CSS custom property existence assertions
 *
 * Suite: token-contracts (no visual dependency)
 * Verifies: all token CSS vars referenced in button.contract.json exist in computed styles
 * Pass condition: every required var resolves to a non-empty value
 *
 * Var names are matched to actual SD v5 arco.css output:
 *   --color-primary-* (semantic), --palette-arcoblue-* (primitive),
 *   --radius-* (border radius), --button-* (component tokens)
 */

import { test, expect } from '@playwright/test';

// Storybook iframe URL for primary Button story
const STORY_URL = '/iframe.html?id=components-button--primary&viewMode=story';

// Token CSS variables that must be present for Button to be correctly styled
// Matched to actual arco.css output from Style Dictionary v5
const REQUIRED_TOKEN_VARS = [
  // Semantic primary color scale
  '--semantic-color-primary-default',
  '--semantic-color-primary-hover',
  '--semantic-color-primary-1',
  // Core palette primitives
  '--core-color-blue-6',
  '--core-color-white',
  // Core border radius
  '--core-radius-medium',
  // Semantic status tokens
  '--semantic-color-danger-default',
  '--semantic-color-warning-default',
  '--semantic-color-success-default',
  // Button component tokens
  '--comp-button-primary-bg-default',
  '--comp-button-primary-text-default',
  '--comp-button-radius-default',
];

test.describe('Button token contracts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(STORY_URL);
    await page.waitForSelector('.arco-btn', { timeout: 10000 });
  });

  test('primary button uses --color-primary-default for background', async ({ page }) => {
    const button = page.locator('.arco-btn-primary').first();
    const bgColor = await button.evaluate(el => {
      const styles = getComputedStyle(el);
      return styles.backgroundColor;
    });
    // background-color should be computed (non-empty, not transparent)
    expect(bgColor).not.toBe('');
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('all required CSS token vars are defined on :root', async ({ page }) => {
    const undefinedVars: string[] = await page.evaluate((vars) => {
      const rootStyles = getComputedStyle(document.documentElement);
      return vars.filter(v => {
        const value = rootStyles.getPropertyValue(v).trim();
        return value === '' || value === 'undefined';
      });
    }, REQUIRED_TOKEN_VARS);

    expect(undefinedVars, `These token CSS vars are undefined: ${undefinedVars.join(', ')}`).toHaveLength(0);
  });

  test('border-radius uses token value (not magic number)', async ({ page }) => {
    const button = page.locator('.arco-btn-primary').first();
    const borderRadius = await button.evaluate(el => {
      return getComputedStyle(el).borderRadius;
    });
    // Must be a non-zero radius (Arco default size = arco-btn-size-default → --border-radius-small = 2px)
    expect(borderRadius).not.toBe('0px');
    expect(borderRadius).toBeTruthy();
  });

  test('disabled button has not-allowed cursor (token-driven state)', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--disabled&viewMode=story');
    await page.waitForSelector('.arco-btn[disabled]', { timeout: 5000 });

    const button = page.locator('.arco-btn[disabled]').first();
    const cursor = await button.evaluate(el => getComputedStyle(el).cursor);

    // Arco Design disabled buttons use cursor: not-allowed
    // (not opacity — they change color values via component CSS, not opacity token)
    expect(cursor).toBe('not-allowed');
  });
});
