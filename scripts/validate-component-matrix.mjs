#!/usr/bin/env node
/**
 * validate-component-matrix.mjs — Component Token Matrix validator (Node.js)
 *
 * Checks every component token file in source/tokens/components/ against the
 * ComponentTokenMatrix at vibe-design-system-foundry 2/references/component-token-matrix.json.
 *
 * Passes:
 *   Pass 0 — Load matrix + collect token files
 *   Pass 1 — Identify components covered by matrix that have token files
 *   Pass 2 — Build normalized path presence set per component
 *   Pass 3 — Validate required/optional categories against matrix rules
 *   Pass 4 — Report violations and summary
 *
 * Validation rules:
 *   M01 BLOCKING — T3 icon.{info,success,warning,error} ALL 4 states required
 *   M02 BLOCKING — T4 overlay.color required
 *   M03 BLOCKING — T4 zindex required
 *   M04 BLOCKING — T7:image aspect.{7 ratios} ALL required
 *   M05 FAIL     — T1 variant must have bg.default, bg.disabled, text.default, text.disabled
 *   M06 FAIL     — T1 border-variant must additionally have border.default, border.disabled
 *   M07 FAIL     — T2 border.focus required
 *   M08 FAIL     — T2 text.placeholder required
 *   M09 FAIL     — T6 at least one padding token required
 *   M10 WARNING  — $type mismatch between actual token and matrix expectation
 *   M11 ADVISORY — Optional category absent
 *
 * Usage:
 *   node scripts/validate-component-matrix.mjs [--phase 1] [--component button] [--no-advisory]
 *
 * --phase 1        Only validate phase-1 components (Arco spec scope)
 * --phase 2        Only validate phase-2 components (TODO scope)
 * --component NAME Only validate one named component
 * --no-advisory    Suppress M11 advisory output
 *
 * Exit codes: 0 = pass/advisory-only, 1 = BLOCKING violations, 2 = FAIL violations
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Paths ─────────────────────────────────────────────────────────────────────
const MATRIX_PATH = join(
  ROOT, '..', '..', 'vibe-design-system-foundry 2', 'references', 'component-token-matrix.json'
);
const TOKEN_DIR = join(ROOT, 'source', 'tokens', 'components');

// ── CLI args ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const componentFilter = (() => {
  const idx = args.indexOf('--component');
  return idx !== -1 ? args[idx + 1] : null;
})();
const phaseFilter = (() => {
  const idx = args.indexOf('--phase');
  return idx !== -1 ? parseInt(args[idx + 1], 10) : null;
})();
const skipAdvisory = args.includes('--no-advisory');

// ── Load matrix ───────────────────────────────────────────────────────────────
if (!existsSync(MATRIX_PATH)) {
  console.error(`\n❌  Matrix file not found: ${MATRIX_PATH}`);
  console.error('   Run the matrix authoring step first.');
  process.exit(1);
}

let matrix;
try {
  matrix = JSON.parse(readFileSync(MATRIX_PATH, 'utf8'));
} catch (e) {
  console.error(`\n❌  Failed to parse matrix JSON: ${e.message}`);
  process.exit(1);
}

// ── Walk token tree ───────────────────────────────────────────────────────────
function* walkTokens(obj, path = []) {
  if (typeof obj !== 'object' || obj === null) return;
  if ('$value' in obj) {
    yield { path: path.join('.'), token: obj };
    return;
  }
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    yield* walkTokens(val, [...path, key]);
  }
}

// ── Build normalized path set from token file ─────────────────────────────────
// Strip the "comp.{componentName}." prefix so paths match matrix category keys.
// e.g. "comp.message.icon.info" → "icon.info"
// e.g. "comp.button.primary.bg.default" → "primary.bg.default"
function buildPathSet(parsed, componentName) {
  const prefix = `comp.${componentName}.`;
  const paths = new Map(); // normalized path → $type
  for (const { path, token } of walkTokens(parsed)) {
    const normalized = path.startsWith(prefix) ? path.slice(prefix.length) : path;
    paths.set(normalized, token.$type ?? null);
  }
  return paths;
}

// ── Check whether a category's states are all present ────────────────────────
// category: "icon", states: ["info","success","warning","error"]
// expects paths: "icon.info", "icon.success", etc.
// Returns array of missing state paths.
function checkCategoryStates(paths, categoryKey, states) {
  const missing = [];
  for (const state of states) {
    const expected = `${categoryKey}.${state}`;
    if (!paths.has(expected)) {
      missing.push(expected);
    }
  }
  return missing;
}

// ── Check single-state category ───────────────────────────────────────────────
// If states has exactly one entry "default" and there's no "category.default",
// also check if just "category" exists (for categories without explicit state suffix).
function checkCategory(paths, categoryKey, states) {
  if (!states || states.length === 0) {
    return paths.has(categoryKey) ? [] : [categoryKey];
  }
  if (states.length === 1 && states[0] === 'default') {
    if (paths.has(categoryKey) || paths.has(`${categoryKey}.default`)) return [];
    return [categoryKey];
  }
  return checkCategoryStates(paths, categoryKey, states);
}

// ── Check T6 padding ──────────────────────────────────────────────────────────
function checkT6Padding(paths) {
  const paddingKeys = [
    'padding', 'padding.default', 'padding.header', 'padding.body',
    'padding.item', 'padding.v', 'padding.h', 'item.padding', 'content.padding',
    'cell.padding.h', 'cell.padding.v',
    // form uses item.gap as its spacing token — counts as padding-equivalent for T6
    'item.gap', 'gap', 'gap.default'
  ];
  return paddingKeys.some(k => paths.has(k));
}

// ── Collect token files ───────────────────────────────────────────────────────
function collectTokenFiles(dir) {
  if (!existsSync(dir)) return [];
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      files.push(...collectTokenFiles(full));
    } else if (extname(entry) === '.json') {
      files.push(full);
    }
  }
  return files;
}

// ── Severity levels ───────────────────────────────────────────────────────────
const SEV = { BLOCKING: 0, FAIL: 1, WARNING: 2, ADVISORY: 3 };
const SEV_LABEL = { 0: 'BLOCKING', 1: 'FAIL', 2: 'WARNING', 3: 'ADVISORY' };
const SEV_EMOJI = { 0: '🚫', 1: '❌', 2: '⚠️ ', 3: '💡' };

// ── Main validation ───────────────────────────────────────────────────────────
const violations = [];

function addViolation(component, rule, severity, message, detail = '') {
  if (skipAdvisory && severity === SEV.ADVISORY) return;
  violations.push({ component, rule, severity, message, detail });
}

// ─ Pass 0: load token files ──────────────────────────────────────────────────
const tokenFiles = collectTokenFiles(TOKEN_DIR);
const tokenFileMap = new Map(); // componentName → parsed JSON
for (const file of tokenFiles) {
  const name = basename(file, '.tokens.json');
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    console.warn(`  ⚠️  JSON parse error in ${relative(ROOT, file)}: ${e.message}`);
    continue;
  }
  tokenFileMap.set(name, parsed);
}

// ─ Pass 1 & 2: iterate components in matrix ──────────────────────────────────
const components = matrix.components;
// Resolve phase allowlist
const phaseAllowSet = (() => {
  if (!phaseFilter) return null;
  const phases = matrix.phases ?? {};
  const entry = phases[String(phaseFilter)];
  if (!entry) {
    console.error(`\n❌  Unknown phase: ${phaseFilter}. Available: ${Object.keys(phases).join(', ')}`);
    process.exit(1);
  }
  return new Set(entry.components);
})();

const componentNames = Object.keys(components).filter(name => {
  if (componentFilter && name !== componentFilter) return false;
  if (phaseAllowSet && !phaseAllowSet.has(name)) return false;
  return true;
});

let checkedCount = 0;
let missingFileCount = 0;

for (const componentName of componentNames) {
  const spec = components[componentName];
  const parsed = tokenFileMap.get(componentName);

  if (!parsed) {
    missingFileCount++;
    addViolation(
      componentName, 'FILE', SEV.ADVISORY,
      `No token file found: source/tokens/components/${componentName}.tokens.json`,
      'Component is defined in matrix but has no token file yet.'
    );
    continue;
  }

  checkedCount++;
  const paths = buildPathSet(parsed, componentName);
  const compType = spec.type;

  // ─ Pass 3: required categories ─────────────────────────────────────────────

  for (const [catKey, catSpec] of Object.entries(spec.required || {})) {
    const states = catSpec.states ?? [];
    const missing = checkCategory(paths, catKey, states);

    if (missing.length === 0) continue;

    // Determine severity based on validationRule and type
    let rule = 'M10';
    let severity = SEV.FAIL;

    if (catSpec.validationRule === 'ALL_STATES_REQUIRED') {
      // M01 (T3 icon), M04 (T7 image aspect)
      if (compType === 'T3' && catKey === 'icon') rule = 'M01';
      else if (compType === 'T7' && catKey === 'aspect') rule = 'M04';
      else rule = 'M01'; // generic ALL_STATES_REQUIRED
      severity = SEV.BLOCKING;
    } else if (compType === 'T4' && catKey === 'overlay.color') {
      rule = 'M02'; severity = SEV.BLOCKING;
    } else if (compType === 'T4' && catKey === 'zindex') {
      rule = 'M03'; severity = SEV.BLOCKING;
    } else if (compType === 'T2' && catKey === 'border.focus') {
      // border.focus may be embedded within border states
      const hasFocusBorder = paths.has('border.focus') || [...paths.keys()].some(
        k => k === 'border.focus' || k.endsWith('.border.focus')
      );
      if (hasFocusBorder) continue;
      rule = 'M07'; severity = SEV.FAIL;
    } else if (compType === 'T2' && catKey === 'text.placeholder') {
      rule = 'M08'; severity = SEV.FAIL;
    }

    const missingStr = missing.join(', ');
    addViolation(
      componentName, rule, severity,
      `[${catKey}] Missing paths: ${missingStr}`,
      `Expected states: [${states.join(', ')}]. dtcgType: ${catSpec.dtcgType}.`
    );
  }

  // ─ T2: additional checks for border.focus (may be encoded in border states) ─
  if (compType === 'T2') {
    const hasBorderFocus = paths.has('border.focus') ||
      [...paths.keys()].some(k => k === 'border.focus');
    if (!hasBorderFocus && !spec.required['border.focus']) {
      // check if border has focus in its states
      const borderSpec = spec.required?.border;
      if (borderSpec) {
        const borderFocusMissing = !(borderSpec.states ?? []).includes('focus') ||
          checkCategory(paths, 'border', ['focus']).length > 0;
        if (borderFocusMissing && !paths.has('border.focus')) {
          addViolation(componentName, 'M07', SEV.FAIL,
            '[border.focus] Missing focus state border token',
            'T2 data-entry requires border.focus. Add border.focus or include focus in border states.'
          );
        }
      }
    }
  }

  // ─ T6: padding presence check (M09) ─────────────────────────────────────────
  if (compType === 'T6') {
    if (!checkT6Padding(paths)) {
      addViolation(componentName, 'M09', SEV.FAIL,
        '[padding] No padding token found',
        'T6 container-layout requires at least one padding token (padding.header, padding.body, padding.default, padding.item, cell.padding.*).'
      );
    }
  }

  // ─ T1: variant rule (M05, M06) ──────────────────────────────────────────────
  if (compType === 'T1' && spec.variants && spec.variantRule) {
    const always = spec.variantRule.always ?? [];
    const borderRequired = spec.variantRule.ifBorderVariant ?? [];
    const borderVariants = new Set(spec.variantsWithBorder ?? []);

    for (const variant of spec.variants) {
      // Check M05: always-required per variant
      for (const subPath of always) {
        const fullPath = `${variant}.${subPath}`;
        if (!paths.has(fullPath)) {
          addViolation(componentName, 'M05', SEV.FAIL,
            `[${variant}] Missing: ${fullPath}`,
            `T1 variant '${variant}' must have: ${always.join(', ')}.`
          );
        }
      }
      // Check M06: border-variant additional requirements
      if (borderVariants.has(variant)) {
        for (const subPath of borderRequired) {
          const fullPath = `${variant}.${subPath}`;
          if (!paths.has(fullPath)) {
            addViolation(componentName, 'M06', SEV.FAIL,
              `[${variant}] Missing border path: ${fullPath}`,
              `T1 border-variant '${variant}' must have: ${borderRequired.join(', ')}.`
            );
          }
        }
      }
    }
  }

  // ─ Optional categories (M11 ADVISORY) ────────────────────────────────────────
  if (!skipAdvisory) {
    for (const [catKey, catSpec] of Object.entries(spec.optional || {})) {
      const states = catSpec.states ?? [];
      const missing = checkCategory(paths, catKey, states);
      if (missing.length > 0) {
        addViolation(componentName, 'M11', SEV.ADVISORY,
          `[${catKey}] Optional category absent`,
          `Consider adding: ${missing.join(', ')}. dtcgType: ${catSpec.dtcgType}.`
        );
      }
    }
  }

  // ─ M10: $type mismatch for present tokens ────────────────────────────────────
  for (const [catKey, catSpec] of Object.entries({ ...spec.required, ...spec.optional })) {
    const expectedType = catSpec.dtcgType;
    if (!expectedType) continue;
    const states = catSpec.states ?? ['default'];
    const checkPaths = states.length === 1 && states[0] === 'default'
      ? [catKey, `${catKey}.default`]
      : states.map(s => `${catKey}.${s}`);
    for (const p of checkPaths) {
      const actualType = paths.get(p);
      if (actualType && actualType !== expectedType) {
        addViolation(componentName, 'M10', SEV.WARNING,
          `[${p}] $type mismatch`,
          `Expected '${expectedType}', got '${actualType}'.`
        );
      }
    }
  }
}

// ── Pass 4: report ────────────────────────────────────────────────────────────
const blockingViolations = violations.filter(v => v.severity === SEV.BLOCKING);
const failViolations     = violations.filter(v => v.severity === SEV.FAIL);
const warningViolations  = violations.filter(v => v.severity === SEV.WARNING);
const advisoryViolations = violations.filter(v => v.severity === SEV.ADVISORY);

console.log(`\n╔══════════════════════════════════════════════════════════════╗`);
console.log(`║          Component Token Matrix Validator v1.0               ║`);
console.log(`╚══════════════════════════════════════════════════════════════╝`);
console.log(`\nMatrix: ${relative(ROOT, MATRIX_PATH)}`);
console.log(`Token dir: ${relative(ROOT, TOKEN_DIR)}`);
if (componentFilter) console.log(`Filter: --component ${componentFilter}`);
console.log(`\nComponents in matrix : ${componentNames.length}`);
console.log(`Token files found    : ${checkedCount}`);
console.log(`Missing token files  : ${missingFileCount}`);

const totalIssues = blockingViolations.length + failViolations.length + warningViolations.length;
const totalAdvisory = advisoryViolations.length;

if (totalIssues === 0 && totalAdvisory === 0) {
  console.log(`\n✅  PASS — 0 violations, 0 advisories\n`);
  process.exit(0);
}

// Print grouped by severity
for (const [sev, label, list] of [
  [SEV.BLOCKING, 'BLOCKING', blockingViolations],
  [SEV.FAIL,     'FAIL',     failViolations],
  [SEV.WARNING,  'WARNING',  warningViolations],
  [SEV.ADVISORY, 'ADVISORY', advisoryViolations],
]) {
  if (list.length === 0) continue;
  if (sev === SEV.ADVISORY && skipAdvisory) continue;
  console.log(`\n${SEV_EMOJI[sev]} ${label} (${list.length})`);
  console.log('─'.repeat(60));
  for (const v of list) {
    console.log(`  [${v.component}] ${v.rule}  ${v.message}`);
    if (v.detail) console.log(`    → ${v.detail}`);
  }
}

console.log(`\n${'─'.repeat(60)}`);
console.log(`Summary:`);
console.log(`  🚫 BLOCKING : ${blockingViolations.length}`);
console.log(`  ❌ FAIL     : ${failViolations.length}`);
console.log(`  ⚠️  WARNING  : ${warningViolations.length}`);
console.log(`  💡 ADVISORY : ${advisoryViolations.length}`);

if (blockingViolations.length > 0) {
  console.log(`\n🚫  BLOCKED — ${blockingViolations.length} BLOCKING violation(s) found.`);
  console.log('   Fix all BLOCKING issues before setting CANONICAL_VALID = true.\n');
  process.exit(1);
}
if (failViolations.length > 0) {
  console.log(`\n❌  FAIL — ${failViolations.length} FAIL violation(s) found.`);
  console.log('   Address FAIL issues before release.\n');
  process.exit(2);
}
if (warningViolations.length > 0) {
  console.log(`\n⚠️   WARN — ${warningViolations.length} WARNING(s). No blocking issues.\n`);
}
if (!skipAdvisory && advisoryViolations.length > 0) {
  console.log(`\n💡  ADVISORY — ${advisoryViolations.length} optional suggestion(s). Run with --no-advisory to suppress.\n`);
}
process.exit(0);
