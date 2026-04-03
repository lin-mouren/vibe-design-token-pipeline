/**
 * playwright.config.ts — Arco Design token system test configuration
 *
 * 4 test suites per Blueprint v3 Phase 3:
 *   1. token-contracts/  — CSS var existence + computed style assertions (no visual dependency)
 *   2. interaction/      — click/focus/keyboard behavior (no visual dependency)
 *   3. visual-regression/— screenshot baselines (component-scoped)
 *   4. a11y-audit/       — axe-core WCAG 2.1 AA
 *
 * Storybook must be running at http://localhost:6006 for suites 1-4.
 * Run `npm run storybook` in a separate terminal, then `npx playwright test`.
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'reports/playwright' }],
    ['json', { outputFile: 'reports/playwright-results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:6006',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    channel: 'chrome',
  },
  projects: [
    {
      name: 'token-contracts',
      testDir: './playwright/token-contracts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'interaction',
      testDir: './playwright/interaction',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'visual-regression',
      testDir: './playwright/visual-regression',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'a11y-audit',
      testDir: './playwright/a11y-audit',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run storybook',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
