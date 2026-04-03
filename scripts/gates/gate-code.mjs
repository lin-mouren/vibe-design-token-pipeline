#!/usr/bin/env node
/**
 * gate-code.mjs — Production Gate 2: Code Gate
 *
 * 检查项：
 *   1. 无硬编码颜色值（#hex / rgb() / rgba() 出现在 .tsx/.ts/.css/.scss 中）
 *   2. 组件 token 引用语义层而非调色板层
 *   3. 构建产物从 dist/ 导入，不直接读 source/tokens/
 *
 * 退出码：0 = PASS，1 = FAIL
 */

import { readdirSync, readFileSync, statSync } from 'fs';
import { resolve, extname, relative } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const errors = [];
const warnings = [];

// ── 1. 无硬编码颜色值 ───────────────────────────────────────────────────────
const HARDCODED_COLOR_RE = /(?<!['"a-zA-Z-])(#[0-9a-fA-F]{3,8}|rgb\(|rgba\()/g;
const ALLOWED_DIRS = ['dist/', 'source/tokens/', 'figma/', 'verification/storybook/.storybook/'];
const CODE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.scss']);

function walkDir(dir, cb) {
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (entry.startsWith('.') || entry === 'node_modules') continue;
    if (statSync(full).isDirectory()) walkDir(full, cb);
    else cb(full);
  }
}

walkDir(ROOT, (file) => {
  const rel = relative(ROOT, file);
  if (!CODE_EXTS.has(extname(file))) return;
  if (ALLOWED_DIRS.some((d) => rel.startsWith(d))) return;

  const src = readFileSync(file, 'utf8');
  const lines = src.split('\n');
  lines.forEach((line, i) => {
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;
    const matches = [...line.matchAll(HARDCODED_COLOR_RE)];
    if (matches.length > 0) {
      errors.push(`Hardcoded color in ${rel}:${i + 1} → ${line.trim().slice(0, 80)}`);
    }
  });
});

// ── 2. 组件 token 引用检查（已在 validate_package.py 中覆盖，此处补充 JSON 以外的 JS 检查）
// Note: Python validator covers .tokens.json; this covers compiled JS references.
const DIST_JS = resolve(ROOT, 'dist/ts/arco.tokens.js');
try {
  const src = readFileSync(DIST_JS, 'utf8');
  const paletteDirectRefs = src.match(/palette\.[a-z]+\.\d+/g) ?? [];
  if (paletteDirectRefs.length > 0) {
    warnings.push(`dist/ts/arco.tokens.js contains ${paletteDirectRefs.length} palette.* references — verify these are from core/ not component/ tokens`);
  }
} catch {
  warnings.push('dist/ts/arco.tokens.js not found — run `npm run build` first');
}

// ── 3. 构建产物导入路径检查
walkDir(ROOT, (file) => {
  const rel = relative(ROOT, file);
  if (!CODE_EXTS.has(extname(file))) return;
  if (rel.startsWith('dist/') || rel.startsWith('node_modules')) return;

  const src = readFileSync(file, 'utf8');
  if (src.includes("from 'source/tokens/") || src.includes('from "source/tokens/')) {
    errors.push(`Direct source/tokens/ import in ${rel} — import from dist/ instead`);
  }
});

// ── 결과 출력 ───────────────────────────────────────────────────────────────
console.log('=== Production Gate 2: Code Gate ===');
if (errors.length === 0 && warnings.length === 0) {
  console.log('PASS — no hardcoded values, no layer violations, no source imports');
} else {
  if (errors.length > 0) {
    console.log(`FAIL — ${errors.length} error(s)`);
    errors.forEach((e) => console.log(`  ERROR: ${e}`));
  }
  if (warnings.length > 0) {
    console.log(`WARN — ${warnings.length} warning(s)`);
    warnings.forEach((w) => console.log(`  WARN:  ${w}`));
  }
}

process.exit(errors.length > 0 ? 1 : 0);
