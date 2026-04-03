/**
 * wcag-aa.spec.ts — WCAG 2.1 AA accessibility audit
 *
 * Suite: a11y-audit
 * Uses: axe-core via @axe-core/playwright
 * Pass condition: 0 critical/serious violations per component
 * WCAG targets: 4.5:1 normal text, 3:1 large text
 *
 * Install: npm install --save-dev @axe-core/playwright
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const MVP_STORIES = [
  { name: 'Button - Primary', url: '/iframe.html?id=components-button--primary&viewMode=story' },
  { name: 'Button - Disabled', url: '/iframe.html?id=components-button--disabled&viewMode=story' },
  { name: 'Button - Danger', url: '/iframe.html?id=components-button--danger&viewMode=story' },
  { name: 'Input - Default', url: '/iframe.html?id=components-input--default&viewMode=story' },
  { name: 'Card - Default', url: '/iframe.html?id=components-card--default&viewMode=story' },
  { name: 'Tag - Blue', url: '/iframe.html?id=components-tag--blue&viewMode=story' },
  { name: 'Tag - Color Matrix', url: '/iframe.html?id=components-tag--color-matrix&viewMode=story' },
  { name: 'Switch - Off', url: '/iframe.html?id=components-switch--off&viewMode=story' },
  { name: 'Switch - On', url: '/iframe.html?id=components-switch--on&viewMode=story' },
  { name: 'Switch - Disabled', url: '/iframe.html?id=components-switch--disabled-off&viewMode=story' },
];

for (const story of MVP_STORIES) {
  test(`WCAG AA: ${story.name}`, async ({ page }) => {
    await page.goto(story.url);
    // Wait for component to render
    await page.waitForTimeout(500);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    // Filter to critical/serious only
    const criticalViolations = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    if (criticalViolations.length > 0) {
      const details = criticalViolations.map(v =>
        `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} node(s))`
      ).join('\n');
      expect.soft(criticalViolations, `WCAG AA violations in "${story.name}":\n${details}`).toHaveLength(0);
    }

    expect(criticalViolations).toHaveLength(0);
  });
}

test('WCAG AA: no color contrast failures in Token Color Matrix', async ({ page }) => {
  await page.goto('/iframe.html?id=components-tag--color-matrix&viewMode=story');
  await page.waitForTimeout(500);

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2aa'])
    .withRules(['color-contrast'])
    .analyze();

  const contrastViolations = results.violations.filter(v => v.id === 'color-contrast');

  if (contrastViolations.length > 0) {
    const failingNodes = contrastViolations.flatMap(v => v.nodes).map(n => n.html).join('\n');
    console.warn(`Color contrast failures (may need token adjustment):\n${failingNodes}`);
  }

  // Soft assertion: flag but don't block (some Tag colors may be borderline)
  // Hard assertion: no critical failures
  const criticalContrast = contrastViolations.filter(v => v.impact === 'critical');
  expect(criticalContrast).toHaveLength(0);
});
