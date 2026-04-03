/**
 * token-linter.mjs — Stage 1.5 automated token lint
 *
 * 5 rules per Blueprint v3 Stage 1.5 specification:
 *   L1 (BLOCKING): All $value alias references must resolve (no dangling {path.to.token})
 *   L2 (WARNING):  State matrix completeness — default/hover/pressed/disabled
 *   L3 (WARNING):  WCAG 2.1 AA contrast — 4.5:1 normal text, 3:1 large text
 *   L4 (WARNING):  Naming convention — kebab-case, minimum 3-level depth
 *   L5 (BLOCKING): No $type "composition"; all $type values must be valid DTCG types
 *
 * Usage: npm run tokens:lint
 * Exit 0 = pass (no BLOCKING violations). Exit 1 = BLOCKING violation(s) found.
 * WARNINGs are logged but do not cause exit 1.
 */

import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const TOKEN_DIR = join(ROOT, 'source', 'tokens');
const REPORT_DIR = join(ROOT, 'dist');

// ── Valid DTCG types (2025.10) ────────────────────────────────────────────────
const VALID_DTCG_TYPES = new Set([
  'color', 'dimension', 'fontFamily', 'fontWeight', 'duration',
  'cubicBezier', 'number', 'string', 'boolean',
  'shadow', 'typography', 'gradient', 'transition', 'border', 'asset',
]);

// ── Utility: collect all .tokens.json files ──────────────────────────────────
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

// ── Utility: walk token tree, collect flat token list ────────────────────────
function walkTokens(obj, path, fileMap, results) {
  if (typeof obj !== 'object' || obj === null) return;
  if ('$value' in obj) {
    results.push({ path, type: obj.$type, value: obj.$value, fileMap });
    return;
  }
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    if (typeof val === 'object' && val !== null) {
      walkTokens(val, path ? `${path}.${key}` : key, fileMap, results);
    }
  }
}

// ── Utility: resolve alias string {path.to.token} ────────────────────────────
const ALIAS_RE = /^\{(.+)\}$/;
function resolveAlias(value, tokenIndex) {
  if (typeof value !== 'string') return { resolved: true };
  const m = ALIAS_RE.exec(value.trim());
  if (!m) return { resolved: true };
  const targetPath = m[1];
  const exists = tokenIndex.has(targetPath);
  return { resolved: exists, targetPath };
}

// ── Utility: parse hex/rgba color to luminance ────────────────────────────────
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return [
      parseInt(clean[0] + clean[0], 16),
      parseInt(clean[1] + clean[1], 16),
      parseInt(clean[2] + clean[2], 16),
    ];
  }
  if (clean.length === 6 || clean.length === 8) {
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16),
    ];
  }
  return null;
}

function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return null;
  const l1 = relativeLuminance(...rgb1);
  const l2 = relativeLuminance(...rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ── Main ─────────────────────────────────────────────────────────────────────
function main() {
  const files = collectJsonFiles(TOKEN_DIR);
  const allTokens = [];
  const tokenIndex = new Map(); // path → token entry

  // Parse all token files
  for (const file of files) {
    let data;
    try {
      data = JSON.parse(readFileSync(file, 'utf8'));
    } catch (e) {
      console.error(`[token-linter] PARSE ERROR: ${file}\n  ${e.message}`);
      process.exit(1);
    }
    walkTokens(data, '', file, allTokens);
  }

  // Build token index for alias resolution
  for (const token of allTokens) {
    tokenIndex.set(token.path, token);
  }

  const blockingViolations = [];
  const warnings = [];

  // ── L1: Alias resolution (BLOCKING) ─────────────────────────────────────────
  for (const token of allTokens) {
    if (typeof token.value === 'string' && ALIAS_RE.test(token.value.trim())) {
      const { resolved, targetPath } = resolveAlias(token.value, tokenIndex);
      if (!resolved) {
        blockingViolations.push({
          rule: 'L1',
          severity: 'BLOCKING',
          path: token.path,
          message: `Unresolved alias: ${token.value} → "${targetPath}" not found in token index`,
        });
      }
    }
  }

  // ── L2: State matrix completeness (WARNING) ───────────────────────────────
  // Group tokens by their parent path (strip last segment) and check for state suffixes
  const stateGroups = new Map();
  for (const token of allTokens) {
    const parts = token.path.split('.');
    if (parts.length >= 2) {
      const parent = parts.slice(0, -1).join('.');
      const leaf = parts[parts.length - 1];
      if (!stateGroups.has(parent)) stateGroups.set(parent, new Set());
      stateGroups.get(parent).add(leaf);
    }
  }

  const INTERACTION_STATES = ['default', 'hover', 'pressed', 'disabled'];
  for (const [parent, leaves] of stateGroups) {
    const hasAnyState = INTERACTION_STATES.some(s => leaves.has(s));
    if (hasAnyState) {
      const missing = INTERACTION_STATES.filter(s => !leaves.has(s));
      if (missing.length > 0) {
        warnings.push({
          rule: 'L2',
          severity: 'WARNING',
          path: parent,
          message: `State matrix incomplete — missing: ${missing.join(', ')}`,
        });
      }
    }
  }

  // ── L3: WCAG 2.1 AA contrast (WARNING) ───────────────────────────────────
  // Check pairs of color tokens where one ends in 'foreground'/'text' and another in 'background'/'bg'
  const colorTokens = allTokens.filter(t => t.type === 'color' && typeof t.value === 'string' && t.value.startsWith('#'));
  const fgTokens = colorTokens.filter(t =>
    t.path.includes('foreground') || t.path.includes('text') || t.path.endsWith('on-')
  );
  const bgTokens = colorTokens.filter(t =>
    t.path.includes('background') || t.path.includes('surface') || t.path.includes('bg')
  );

  // Only check explicit fg/bg sibling pairs (same parent group, fg+bg suffix)
  const colorGroups = new Map();
  for (const t of colorTokens) {
    const parts = t.path.split('.');
    const parent = parts.slice(0, -1).join('.');
    const leaf = parts[parts.length - 1];
    if (!colorGroups.has(parent)) colorGroups.set(parent, {});
    colorGroups.get(parent)[leaf] = t.value;
  }

  for (const [parent, tokens] of colorGroups) {
    const fgKey = Object.keys(tokens).find(k => k.includes('text') || k.includes('foreground') || k === 'on');
    const bgKey = Object.keys(tokens).find(k => k.includes('bg') || k.includes('background') || k.includes('surface'));
    if (fgKey && bgKey) {
      const ratio = contrastRatio(tokens[fgKey], tokens[bgKey]);
      if (ratio !== null && ratio < 4.5) {
        warnings.push({
          rule: 'L3',
          severity: 'WARNING',
          path: parent,
          message: `WCAG AA contrast: ${ratio.toFixed(2)}:1 (< 4.5:1 required for normal text) between ${fgKey} and ${bgKey}`,
        });
      }
    }
  }

  // ── L4: Naming convention (WARNING) ──────────────────────────────────────
  const KEBAB_RE = /^[a-z][a-z0-9-]*$/;
  for (const token of allTokens) {
    const parts = token.path.split('.');
    // Check minimum 3-level depth
    if (parts.length < 3) {
      warnings.push({
        rule: 'L4',
        severity: 'WARNING',
        path: token.path,
        message: `Token path has fewer than 3 levels (${parts.length}). Expected: category.group.name`,
      });
    }
    // Check kebab-case per segment
    for (const part of parts) {
      if (!KEBAB_RE.test(part)) {
        warnings.push({
          rule: 'L4',
          severity: 'WARNING',
          path: token.path,
          message: `Path segment "${part}" is not kebab-case`,
        });
        break; // one warning per token
      }
    }
  }

  // ── L5: DTCG compliance (BLOCKING) ───────────────────────────────────────
  for (const token of allTokens) {
    if (!token.type) continue; // type inherited from parent — not flagged here

    // Banned type
    if (token.type === 'composition') {
      blockingViolations.push({
        rule: 'L5',
        severity: 'BLOCKING',
        path: token.path,
        message: `$type "composition" is banned in this design system (non-standard, breaks tool portability)`,
      });
    } else if (!VALID_DTCG_TYPES.has(token.type)) {
      blockingViolations.push({
        rule: 'L5',
        severity: 'BLOCKING',
        path: token.path,
        message: `Unknown $type "${token.type}" — not in DTCG 2025.10 type registry`,
      });
    }
  }

  // ── Output ────────────────────────────────────────────────────────────────
  const totalIssues = blockingViolations.length + warnings.length;
  console.log(`[token-linter] Scanned ${allTokens.length} tokens from ${files.length} files`);
  console.log(`[token-linter] L1 alias check: ${blockingViolations.filter(v=>v.rule==='L1').length} BLOCKING`);
  console.log(`[token-linter] L2 state matrix: ${warnings.filter(w=>w.rule==='L2').length} warnings`);
  console.log(`[token-linter] L3 WCAG contrast: ${warnings.filter(w=>w.rule==='L3').length} warnings`);
  console.log(`[token-linter] L4 naming: ${warnings.filter(w=>w.rule==='L4').length} warnings`);
  console.log(`[token-linter] L5 DTCG compliance: ${blockingViolations.filter(v=>v.rule==='L5').length} BLOCKING`);

  if (warnings.length > 0) {
    console.warn(`\n[token-linter] WARNINGS (${warnings.length}):`);
    for (const w of warnings.slice(0, 20)) { // cap at 20 for readability
      console.warn(`  [${w.rule}] ${w.path}: ${w.message}`);
    }
    if (warnings.length > 20) {
      console.warn(`  ... and ${warnings.length - 20} more. See dist/lint-report.json for full list.`);
    }
  }

  if (blockingViolations.length > 0) {
    console.error(`\n[token-linter] BLOCKING VIOLATIONS (${blockingViolations.length}):`);
    for (const v of blockingViolations) {
      console.error(`  [${v.rule}] ${v.path}: ${v.message}`);
    }
  }

  // Write lint report
  try { mkdirSync(REPORT_DIR, { recursive: true }); } catch {}
  writeFileSync(join(REPORT_DIR, 'lint-report.json'), JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalTokens: allTokens.length,
    filesScanned: files.length,
    blocking: blockingViolations,
    warnings,
    status: blockingViolations.length === 0 ? 'pass' : 'fail',
  }, null, 2));

  if (blockingViolations.length > 0) {
    console.error(`\n[token-linter] FAIL — ${blockingViolations.length} blocking violation(s). Fix before proceeding.`);
    process.exit(1);
  }

  console.log(`\n[token-linter] PASS — 0 blocking violations. ${warnings.length} warning(s) logged to dist/lint-report.json`);
}

main();
