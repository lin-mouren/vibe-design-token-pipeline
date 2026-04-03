/**
 * token-exploder.js — Pre-build composite token validator
 *
 * Runs before Style Dictionary to enforce composite token policy:
 *   - BLOCKING: $type "composition" is banned in this design system
 *   - INFO: $type "shadow" composites are handled natively by SD (no explosion needed)
 *   - INFO: Reports composite count and idempotency status
 *
 * Usage: npm run tokens:explode
 * Exit 0 = pass, Exit 1 = blocking violation found
 */

import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const TOKEN_DIR = join(ROOT, 'source', 'tokens');
const REPORT_DIR = join(ROOT, 'dist');

// DTCG composite types handled natively by Style Dictionary
const SD_NATIVE_COMPOSITE_TYPES = new Set(['shadow', 'typography', 'gradient']);

// Banned composite types (non-standard, breaks tool-chain portability)
const BANNED_TYPES = new Set(['composition']);

// Valid DTCG $type values per 2025.10 spec
const VALID_TYPES = new Set([
  'color', 'dimension', 'fontFamily', 'fontWeight', 'duration',
  'cubicBezier', 'number', 'string', 'boolean',
  'shadow', 'typography', 'gradient', 'transition',
  // Not banned but tracked separately:
  'border', 'asset',
]);

function collectJsonFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectJsonFiles(full));
    } else if (entry.endsWith('.tokens.json')) {
      results.push(full);
    }
  }
  return results;
}

function walkTokens(obj, path, results) {
  if (typeof obj !== 'object' || obj === null) return;

  // Detect token nodes (have $value) vs group nodes
  const hasValue = '$value' in obj;
  const hasType = '$type' in obj;

  if (hasValue) {
    results.push({
      path,
      type: obj.$type ?? 'unknown',
      value: obj.$value,
      isComposite: typeof obj.$value === 'object' && obj.$value !== null,
    });
    return; // Don't recurse into $value
  }

  // Recurse into child nodes (skip $ meta keys)
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    if (typeof val === 'object' && val !== null) {
      walkTokens(val, path ? `${path}.${key}` : key, results);
    }
  }
}

function main() {
  const files = collectJsonFiles(TOKEN_DIR);
  const allTokens = [];
  const violations = [];

  for (const file of files) {
    let data;
    try {
      data = JSON.parse(readFileSync(file, 'utf8'));
    } catch (e) {
      console.error(`[token-exploder] PARSE ERROR: ${file}\n  ${e.message}`);
      process.exit(1);
    }
    walkTokens(data, '', allTokens);
  }

  // Classify tokens
  const compositeTokens = allTokens.filter(t => t.isComposite);
  const shadowComposites = compositeTokens.filter(t => t.type === 'shadow');
  const bannedComposites = compositeTokens.filter(t => BANNED_TYPES.has(t.type));
  const unknownComposites = compositeTokens.filter(
    t => !SD_NATIVE_COMPOSITE_TYPES.has(t.type) && !BANNED_TYPES.has(t.type)
  );

  // Report
  console.log(`[token-exploder] Scanned ${files.length} token files, ${allTokens.length} token entries`);
  console.log(`[token-exploder] Shadow composites: ${shadowComposites.length} (SD handles natively)`);

  if (unknownComposites.length > 0) {
    console.warn(`[token-exploder] WARNING: ${unknownComposites.length} composite(s) with unknown type — may not render correctly:`);
    for (const t of unknownComposites) {
      console.warn(`  - ${t.path} ($type: ${t.type})`);
    }
  }

  // BLOCKING: banned type check
  if (bannedComposites.length > 0) {
    console.error(`[token-exploder] BLOCKING VIOLATION: $type "composition" is banned in this design system.`);
    console.error(`  Found ${bannedComposites.length} composition token(s):`);
    for (const t of bannedComposites) {
      console.error(`  - ${t.path}`);
    }
    violations.push(...bannedComposites.map(t => ({
      path: t.path,
      violation: 'banned-type-composition',
      severity: 'BLOCKING',
    })));
  }

  // Write report to dist/ (create dir if needed)
  try {
    mkdirSync(REPORT_DIR, { recursive: true });
  } catch {}

  const report = {
    generatedAt: new Date().toISOString(),
    scannedFiles: files.length,
    totalTokens: allTokens.length,
    composites: {
      shadow: shadowComposites.length,
      banned: bannedComposites.length,
      unknown: unknownComposites.length,
    },
    idempotent: true, // exploder makes no changes to source files
    violations,
    status: violations.length === 0 ? 'pass' : 'fail',
  };

  writeFileSync(join(REPORT_DIR, 'exploder-report.json'), JSON.stringify(report, null, 2));

  if (violations.length > 0) {
    console.error(`[token-exploder] FAIL — ${violations.length} blocking violation(s). See dist/exploder-report.json`);
    process.exit(1);
  }

  console.log(`[token-exploder] PASS — no blocking violations. ${shadowComposites.length} shadow composite(s) will be handled by Style Dictionary.`);
}

main();
