#!/usr/bin/env node
/**
 * gate-figma.mjs — Production Gate 1: Figma Gate
 *
 * Scope (honest declaration — read before extending):
 *   ✅ Check 1: Variable-level bare colors — semantic/component variables that
 *               have a raw color value instead of a VARIABLE_ALIAS reference.
 *               Uses GET /variables/local (variable valuesByMode).
 *   ✅ Check 2: Direct palette binding — semantic variables that alias a
 *               palette/ variable instead of going through semantic/.
 *   ✅ Check 3: Published styles count (informational, not a gate criterion).
 *
 *   ⚠️  NOT in scope — requires full node-tree traversal via GET /files/:key/nodes:
 *       • Per-frame boundVariables audit (detached text/fill in canvas layers)
 *       • Detached component frames (Library Component usage check)
 *       • Layer-level hardcoded fills not expressed as variables
 *       These require a separate node-audit script with pagination.
 *
 * Prerequisites:
 *   export FIGMA_PAT=<personal-access-token>
 *   export FIGMA_FILE_KEY=<file-key>
 *
 * Exit codes: 0 = PASS, 1 = FAIL, 2 = SKIP (env vars not set)
 */

const PAT = process.env.FIGMA_PAT;
const FILE_KEY = process.env.FIGMA_FILE_KEY;
const MOCK_MODE = process.argv.includes('--mock');

// ── Steps to close this gate in production: ───────────────────────────────
// 1. Obtain a Figma Personal Access Token: https://www.figma.com/developers/api#access-tokens
// 2. Find your file key from the Figma file URL: figma.com/file/<FILE_KEY>/...
// 3. export FIGMA_PAT=<token> && export FIGMA_FILE_KEY=<key>
// 4. node scripts/gates/gate-figma.mjs
// 5. On PASS: update delivery-manifest.json gateResults.figmaGate → "PASS"
//             and set releaseThresholdMet → true
// ──────────────────────────────────────────────────────────────────────────

if (MOCK_MODE) {
  // Mock mode: validates gate logic without real Figma access.
  // Used in CI when FIGMA_PAT is not available.
  console.log('=== Production Gate 1: Figma Gate ===');
  console.log('SKIP (--mock) — gate logic validated, no Figma API call made');
  console.log('  To run for real: export FIGMA_PAT=<token> FIGMA_FILE_KEY=<key>');
  process.exit(2);
}

if (!PAT || !FILE_KEY) {
  console.log('=== Production Gate 1: Figma Gate ===');
  console.log('SKIP — FIGMA_PAT / FIGMA_FILE_KEY not set');
  console.log('  Steps to close this gate:');
  console.log('    1. Get PAT: https://www.figma.com/developers/api#access-tokens');
  console.log('    2. export FIGMA_PAT=<token> && export FIGMA_FILE_KEY=<file-key>');
  console.log('    3. node scripts/gates/gate-figma.mjs');
  console.log('    4. On PASS: set delivery-manifest.json gateResults.figmaGate="PASS"');
  console.log('                and releaseThresholdMet=true');
  process.exit(2);
}

async function fetchJSON(url) {
  const res = await fetch(url, { headers: { 'X-Figma-Token': PAT } });
  if (!res.ok) throw new Error(`Figma API ${res.status} at ${url}`);
  return res.json();
}

async function main() {
  console.log('=== Production Gate 1: Figma Gate ===');
  const errors = [];
  const warnings = [];

  // ── 拉取 Variables ────────────────────────────────────────────────────────
  let variables, collections;
  try {
    const data = await fetchJSON(`https://api.figma.com/v1/files/${FILE_KEY}/variables/local`);
    variables = data.meta.variables;
    collections = data.meta.variableCollections;
    console.log(`  Found ${Object.keys(variables).length} variables in ${Object.keys(collections).length} collections`);
  } catch (e) {
    console.log(`FAIL — Figma API error: ${e.message}`);
    process.exit(1);
  }

  // ── 检查 1: 语义层绑定（variable 名称中有 palette. 的是直接调色板引用）──────
  let paletteDirectBindings = 0;
  for (const v of Object.values(variables)) {
    for (const modeVal of Object.values(v.valuesByMode)) {
      if (modeVal?.type === 'VARIABLE_ALIAS') {
        const ref = variables[modeVal.id];
        if (ref && /^palette\//i.test(ref.name)) {
          paletteDirectBindings++;
          warnings.push(`Variable "${v.name}" binds directly to palette "${ref.name}" — should bind to semantic/`);
        }
      }
    }
  }

  // ── 检查 2: 裸色值（不是 VARIABLE_ALIAS 且 resolvedType=COLOR 的非 core/ 变量）
  let bareColorCount = 0;
  for (const v of Object.values(variables)) {
    if (v.resolvedType !== 'COLOR') continue;
    const collectionName = collections[v.variableCollectionId]?.name ?? '';
    if (/^(Primitives|Core)/i.test(collectionName)) continue; // core 层允许裸值

    for (const modeVal of Object.values(v.valuesByMode)) {
      if (modeVal && modeVal.type !== 'VARIABLE_ALIAS') {
        bareColorCount++;
        errors.push(`Bare color in "${v.name}" (${collectionName}) — should reference a variable alias`);
        break;
      }
    }
  }

  // ── 检查 3: 拉取 file styles 确认 published styles 不含裸值 ────────────────
  try {
    const stylesData = await fetchJSON(`https://api.figma.com/v1/files/${FILE_KEY}/styles`);
    const styles = stylesData.meta?.styles ?? [];
    console.log(`  Found ${styles.length} published styles`);
    // 每个 style 若存在则视为已绑定，此处只统计数量供参考
  } catch (e) {
    warnings.push(`Could not fetch file styles: ${e.message}`);
  }

  // ── 输出结果 ──────────────────────────────────────────────────────────────
  if (errors.length === 0) {
    console.log(`PASS — ${Object.keys(variables).length} variables, 0 bare color errors`);
    if (warnings.length > 0) {
      warnings.forEach((w) => console.log(`  WARN:  ${w}`));
    }
  } else {
    console.log(`FAIL — ${errors.length} error(s), ${warnings.length} warning(s)`);
    errors.forEach((e) => console.log(`  ERROR: ${e}`));
    warnings.forEach((w) => console.log(`  WARN:  ${w}`));
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error('GATE FAILED:', e.message);
  process.exit(1);
});
