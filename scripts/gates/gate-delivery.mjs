#!/usr/bin/env node
/**
 * gate-delivery.mjs — Production Gate 3: Delivery Gate
 *
 * Scope (honest declaration):
 *   ✅ Check 1: dist/ artifacts exist and are non-empty (CSS light/dark, SCSS, JS, JSON)
 *   ✅ Check 2: release/delivery-manifest.json is valid and has required fields
 *   ✅ Check 3: Storybook story files exist and have exported stories (smoke check)
 *   ✅ Check 4: component-registry.json coverage — every registered component has a story file
 *   ✅ Check 5: CSS custom property count sanity check (dist/css/arco.css must define > 50 vars)
 *
 *   ⚠️  NOT in scope (requires separate tooling):
 *       • Browser rendering / visual baseline comparison — use Chromatic or Percy
 *       • Storybook compilation / accessibility audit — run `npm run storybook:build`
 *       • Token-to-CSS-var coverage (all 183 index tokens present in arco.css)
 *
 * Exit codes: 0 = PASS, 1 = FAIL
 */

import { existsSync, readFileSync, statSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const errors = [];
const warnings = [];

// ── 1. dist/ 构建产物检查 ──────────────────────────────────────────────────
const REQUIRED_DIST = [
  'dist/css/arco.css',
  'dist/css/arco-dark.css',
  'dist/scss/_arco-tokens.scss',
  'dist/ts/arco.tokens.js',
  'dist/json/arco.resolved.json',
];

const OPTIONAL_DIST = [
  'dist/ios/ArcoTokens.swift',
  'dist/android/arco_tokens.xml',
  'dist/tailwind/arco-preset.js',
];

for (const rel of REQUIRED_DIST) {
  const abs = resolve(ROOT, rel);
  if (!existsSync(abs)) {
    errors.push(`Missing required dist artifact: ${rel} — run \`npm run build\``);
  } else if (statSync(abs).size === 0) {
    errors.push(`Empty dist artifact: ${rel}`);
  }
}

for (const rel of OPTIONAL_DIST) {
  const abs = resolve(ROOT, rel);
  if (!existsSync(abs)) {
    warnings.push(`Optional dist artifact missing: ${rel}`);
  }
}

// ── 2. delivery-manifest.json 合法性 ──────────────────────────────────────
const manifestPath = resolve(ROOT, 'release/delivery-manifest.json');
if (!existsSync(manifestPath)) {
  errors.push('Missing release/delivery-manifest.json');
} else {
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

    const REQUIRED_FIELDS = ['releaseId', 'timestamp', 'tokenCoverage', 'gateResults', 'releaseThresholdMet'];
    for (const field of REQUIRED_FIELDS) {
      if (manifest[field] === undefined) {
        errors.push(`delivery-manifest.json missing required field: ${field}`);
      }
    }

    if (manifest.releaseThresholdMet === false) {
      warnings.push('delivery-manifest.json: releaseThresholdMet is false — all three gates must pass before release');
    }

    if (manifest.gateResults) {
      for (const [gate, result] of Object.entries(manifest.gateResults)) {
        if (result === 'FAIL') {
          errors.push(`delivery-manifest.json: ${gate} = FAIL`);
        } else if (result === 'SKIP') {
          warnings.push(`delivery-manifest.json: ${gate} = SKIP — must be RUN before release`);
        }
      }
    }

    if (!manifest.tokenCoverage?.totalTokensUsed || manifest.tokenCoverage.totalTokensUsed === 0) {
      warnings.push('delivery-manifest.json: tokenCoverage.totalTokensUsed is 0 — update after build');
    }

    console.log(`  delivery-manifest: releaseId=${manifest.releaseId}, tokens=${manifest.tokenCoverage?.totalTokensUsed ?? '?'}`);
  } catch (e) {
    errors.push(`delivery-manifest.json parse error: ${e.message}`);
  }
}

// ── 3. Storybook stories 존在检查 ─────────────────────────────────────────
const EXPECTED_STORIES = [
  'verification/storybook/Button.stories.tsx',
  'verification/storybook/Input.stories.tsx',
];

for (const rel of EXPECTED_STORIES) {
  const abs = resolve(ROOT, rel);
  if (!existsSync(abs)) {
    errors.push(`Missing Storybook story: ${rel}`);
  } else {
    const src = readFileSync(abs, 'utf8');
    const exports = (src.match(/^export const /gm) ?? []).length;
    if (exports === 0) {
      errors.push(`Storybook story ${rel} has no exported stories`);
    } else {
      console.log(`  ${rel}: ${exports} stories`);
    }
    // Check uses real library import, not local stub
    if (src.includes("from '@arco-design/web-react'")) {
      // ok
    } else if (src.match(/const\s+\w+\s*=\s*\(\s*\{/)) {
      warnings.push(`${rel}: appears to use a local stub component instead of @arco-design/web-react`);
    }
  }
}

// ── 4. component-registry.json 覆盖检查 ────────────────────────────────────
const registryPath = resolve(ROOT, 'registries/component-registry.json');
if (existsSync(registryPath)) {
  try {
    const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
    for (const comp of (registry.components ?? [])) {
      if (comp.storybookPath) {
        const abs = resolve(ROOT, comp.storybookPath);
        if (!existsSync(abs)) {
          errors.push(`component-registry: ${comp.name} references storybookPath "${comp.storybookPath}" which does not exist`);
        }
      } else if (comp.status === 'stable') {
        errors.push(`component-registry: ${comp.name} is stable but has no storybookPath`);
      } else {
        warnings.push(`component-registry: ${comp.name} (${comp.status}) has no storybookPath`);
      }
    }
  } catch (e) {
    errors.push(`registries/component-registry.json parse error: ${e.message}`);
  }
} else {
  errors.push('Missing registries/component-registry.json');
}

// ── 5. CSS custom property sanity check ───────────────────────────────────
const cssPath = resolve(ROOT, 'dist/css/arco.css');
if (existsSync(cssPath)) {
  const css = readFileSync(cssPath, 'utf8');
  const varCount = (css.match(/--[\w-]+\s*:/g) ?? []).length;
  if (varCount < 50) {
    errors.push(`dist/css/arco.css defines only ${varCount} CSS custom properties — expected > 50`);
  } else {
    console.log(`  dist/css/arco.css: ${varCount} CSS custom properties`);
  }
}

// ── 출력 ──────────────────────────────────────────────────────────────────
console.log('=== Production Gate 3: Delivery Gate ===');
if (errors.length === 0) {
  console.log('PASS');
  warnings.forEach((w) => console.log(`  WARN:  ${w}`));
} else {
  console.log(`FAIL — ${errors.length} error(s)`);
  errors.forEach((e) => console.log(`  ERROR: ${e}`));
  warnings.forEach((w) => console.log(`  WARN:  ${w}`));
}

process.exit(errors.length > 0 ? 1 : 0);
