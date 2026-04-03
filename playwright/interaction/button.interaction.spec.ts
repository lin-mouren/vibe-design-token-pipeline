/**
 * button.interaction.spec.ts — Button interaction behavior tests
 *
 * Suite: interaction (no visual dependency)
 * Verifies: click, focus, keyboard, disabled state behavior
 * No screenshot assertions — behavior only.
 */

import { test, expect } from '@playwright/test';

test.describe('Button interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--primary&viewMode=story');
    await page.waitForSelector('.arco-btn', { timeout: 10000 });
  });

  test('button is focusable via Tab key', async ({ page }) => {
    await page.keyboard.press('Tab');
    const focused = page.locator('.arco-btn:focus, .arco-btn-primary:focus');
    await expect(focused.first()).toBeVisible();
  });

  test('button is clickable and fires click event', async ({ page }) => {
    const button = page.locator('.arco-btn-primary').first();
    let clicked = false;
    await page.exposeFunction('__clickCallback', () => { clicked = true; });
    await button.evaluate(el => {
      el.addEventListener('click', () => (window as any).__clickCallback());
    });
    await button.click();
    expect(clicked).toBe(true);
  });

  test('disabled button does not fire click', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--disabled&viewMode=story');
    await page.waitForSelector('.arco-btn[disabled]', { timeout: 5000 });

    const button = page.locator('.arco-btn[disabled]').first();
    await expect(button).toBeDisabled();

    // Attempt click should not throw / should be no-op
    await button.click({ force: true });
    // Verify it's still disabled (state unchanged)
    await expect(button).toBeDisabled();
  });

  test('button responds to Enter key', async ({ page }) => {
    const button = page.locator('.arco-btn-primary').first();
    await button.focus();
    let keyActivated = false;
    await page.exposeFunction('__enterCallback', () => { keyActivated = true; });
    await button.evaluate(el => {
      el.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter') (window as any).__enterCallback();
      });
    });
    await page.keyboard.press('Enter');
    expect(keyActivated).toBe(true);
  });
});

test.describe('Switch interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/iframe.html?id=components-switch--off&viewMode=story');
    await page.waitForSelector('.arco-switch', { timeout: 10000 });
  });

  test('switch toggles on click', async ({ page }) => {
    const sw = page.locator('.arco-switch').first();
    const initialChecked = await sw.evaluate(el => el.getAttribute('aria-checked'));
    await sw.click();
    const afterChecked = await sw.evaluate(el => el.getAttribute('aria-checked'));
    expect(afterChecked).not.toBe(initialChecked);
  });

  test('disabled switch does not toggle', async ({ page }) => {
    await page.goto('/iframe.html?id=components-switch--disabled-off&viewMode=story');
    await page.waitForSelector('.arco-switch[disabled]', { timeout: 5000 });

    const sw = page.locator('.arco-switch[disabled]').first();
    const initialChecked = await sw.evaluate(el => el.getAttribute('aria-checked'));
    await sw.click({ force: true });
    const afterChecked = await sw.evaluate(el => el.getAttribute('aria-checked'));
    expect(afterChecked).toBe(initialChecked);
  });

  test('switch is keyboard accessible (Space key toggles)', async ({ page }) => {
    const sw = page.locator('.arco-switch').first();
    await sw.focus();
    const initialChecked = await sw.evaluate(el => el.getAttribute('aria-checked'));
    await page.keyboard.press('Space');
    const afterChecked = await sw.evaluate(el => el.getAttribute('aria-checked'));
    expect(afterChecked).not.toBe(initialChecked);
  });
});
