/**
 * design-tokens.spec.ts — Token SSOT CSS variable smoke test
 *
 * Suite: token-contracts (no visual dependency)
 * Verifies: the arco.css token file is loaded and all expected token families are present
 * Pass condition: each token family has at least 1 non-empty CSS var on :root
 */

import { test, expect } from '@playwright/test';

const STORY_URL = '/iframe.html?id=components-button--primary&viewMode=story';

// Token family prefixes that must be present — matched to actual arco.css SD v5 output
const TOKEN_FAMILIES = [
  { prefix: '--core-color-blue-', description: 'Core blue palette tokens' },
  { prefix: '--core-color-neutral-', description: 'Core neutral palette tokens' },
  { prefix: '--semantic-color-primary-', description: 'Semantic primary color tokens' },
  { prefix: '--semantic-color-danger-', description: 'Semantic danger/error color tokens' },
  { prefix: '--semantic-color-warning-', description: 'Semantic warning color tokens' },
  { prefix: '--semantic-color-success-', description: 'Semantic success color tokens' },
  { prefix: '--core-radius-', description: 'Core border radius tokens' },
  { prefix: '--core-text-size-', description: 'Core text size tokens' },
  { prefix: '--core-space-', description: 'Core spacing tokens' },
  { prefix: '--core-shadow-', description: 'Core shadow tokens' },
  { prefix: '--comp-button-', description: 'Button component tokens' },
];

test.describe('Design token SSOT smoke test', () => {
  test('all token families are loaded from arco.css', async ({ page }) => {
    await page.goto(STORY_URL);
    await page.waitForSelector('.arco-btn', { timeout: 10000 });

    const missingFamilies: string[] = await page.evaluate((families) => {
      // Get all CSS custom properties by reading stylesheet rules
      const allProps = Array.from(document.styleSheets)
        .flatMap(sheet => {
          try {
            return Array.from(sheet.cssRules);
          } catch {
            return [];
          }
        })
        .filter(rule => rule instanceof CSSStyleRule && (rule as CSSStyleRule).selectorText === ':root')
        .flatMap(rule => {
          const styleRule = rule as CSSStyleRule;
          return Array.from(styleRule.style).filter(p => p.startsWith('--'));
        });

      return families
        .filter(f => !allProps.some(p => p.startsWith(f.prefix)))
        .map(f => `${f.prefix}* (${f.description})`);
    }, TOKEN_FAMILIES);

    expect(missingFamilies, `Missing token families in CSS: ${missingFamilies.join(', ')}`).toHaveLength(0);
  });

  test('no [object Object] in CSS custom property values', async ({ page }) => {
    await page.goto(STORY_URL);
    await page.waitForSelector('.arco-btn', { timeout: 10000 });

    const corruptedVars: string[] = await page.evaluate(() => {
      return Array.from(document.styleSheets)
        .flatMap(sheet => {
          try { return Array.from(sheet.cssRules); } catch { return []; }
        })
        .filter(rule => rule instanceof CSSStyleRule && (rule as CSSStyleRule).selectorText === ':root')
        .flatMap(rule => {
          const styleRule = rule as CSSStyleRule;
          return Array.from(styleRule.style)
            .filter(p => p.startsWith('--'))
            .filter(p => styleRule.style.getPropertyValue(p).includes('[object Object]'));
        });
    });

    expect(corruptedVars, `CSS vars with [object Object]: ${corruptedVars.join(', ')}`).toHaveLength(0);
  });
});
