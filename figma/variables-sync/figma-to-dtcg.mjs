#!/usr/bin/env node
/**
 * figma-to-dtcg.mjs — Figma Variables REST API → DTCG JSON 同步
 *
 * 用途：从 Figma 文件拉取 Variables，转换为 DTCG 2025.10 格式，
 *       写入 source/tokens/ 对应文件。
 *
 * 使用前提：
 *   export FIGMA_PAT=<your-personal-access-token>
 *   export FIGMA_FILE_KEY=<your-file-key>     # URL 中 figma.com/file/<KEY>/...
 *
 * 运行：
 *   node figma/variables-sync/figma-to-dtcg.mjs
 *   node figma/variables-sync/figma-to-dtcg.mjs --dry-run   # 只打印不写文件
 */

import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const DRY_RUN = process.argv.includes('--dry-run');

// ── 环境变量检查 ────────────────────────────────────────────────────────────
const PAT = process.env.FIGMA_PAT;
const FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!PAT || !FILE_KEY) {
  console.error('ERROR: 请先设置环境变量:');
  console.error('  export FIGMA_PAT=<personal-access-token>');
  console.error('  export FIGMA_FILE_KEY=<file-key>');
  process.exit(1);
}

// ── Figma API 请求 ─────────────────────────────────────────────────────────
async function fetchFigmaVariables(fileKey) {
  const url = `https://api.figma.com/v1/files/${fileKey}/variables/local`;
  console.log(`Fetching: ${url}`);

  const res = await fetch(url, {
    headers: { 'X-Figma-Token': PAT },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API ${res.status}: ${body}`);
  }

  return res.json();
}

// ── Figma Variable → DTCG token 转换 ──────────────────────────────────────
function figmaTypeToDtcg(resolvedType) {
  const map = {
    COLOR: 'color',
    FLOAT: 'number',
    STRING: 'string',
    BOOLEAN: 'boolean',
  };
  return map[resolvedType] ?? 'other';
}

function figmaColorToCss({ r, g, b, a }) {
  const toInt = (v) => Math.round(v * 255);
  if (a === 1) {
    return `#${toInt(r).toString(16).padStart(2, '0')}${toInt(g).toString(16).padStart(2, '0')}${toInt(b).toString(16).padStart(2, '0')}`;
  }
  return `rgba(${toInt(r)},${toInt(g)},${toInt(b)},${Math.round(a * 100) / 100})`;
}

function resolveValue(variable, variables, modeId) {
  const modeValue = variable.valuesByMode[modeId];
  if (!modeValue) return null;

  // Alias reference
  if (modeValue.type === 'VARIABLE_ALIAS') {
    const ref = variables[modeValue.id];
    if (ref) {
      // Convert Figma path (a/b/c) → DTCG reference ({a.b.c})
      return `{${ref.name.replace(/\//g, '.')}}`;
    }
    return null;
  }

  // Raw value
  if (variable.resolvedType === 'COLOR') {
    return figmaColorToCss(modeValue);
  }
  return modeValue;
}

// ── Collection → file path マッピング ──────────────────────────────────────
const COLLECTION_TO_FILE = {
  Primitives: 'source/tokens/core/color.tokens.json',
  'Core/Color': 'source/tokens/core/color.tokens.json',
  'Core/Spacing': 'source/tokens/core/spacing.tokens.json',
  'Core/Typography': 'source/tokens/core/typography.tokens.json',
  'Core/Radius': 'source/tokens/core/radius.tokens.json',
  Semantic: 'source/tokens/semantic/color.tokens.json',
  'Semantic/Color': 'source/tokens/semantic/color.tokens.json',
  'Semantic/Text': 'source/tokens/semantic/text.tokens.json',
  Light: 'source/tokens/themes/light.tokens.json',
  Dark: 'source/tokens/themes/dark.tokens.json',
};

// ── 变量名路径 → 嵌套对象写入 ──────────────────────────────────────────────
function setNestedPath(obj, pathStr, token) {
  const parts = pathStr.replace(/\//g, '.').split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = token;
}

// ── メイン処理 ─────────────────────────────────────────────────────────────
async function main() {
  console.log('=== Figma → DTCG Sync ===');

  const data = await fetchFigmaVariables(FILE_KEY);
  const { variableCollections, variables } = data.meta;

  const fileBuffers = {}; // destFile → token tree

  for (const collection of Object.values(variableCollections)) {
    const destFile = COLLECTION_TO_FILE[collection.name];
    if (!destFile) {
      console.warn(`SKIP collection "${collection.name}" — no file mapping. Add to COLLECTION_TO_FILE.`);
      continue;
    }

    if (!fileBuffers[destFile]) fileBuffers[destFile] = {};

    // Use the default mode (first mode)
    const defaultModeId = collection.defaultModeId ?? collection.modes[0]?.modeId;

    for (const varId of collection.variableIds) {
      const variable = variables[varId];
      if (!variable) continue;

      const value = resolveValue(variable, variables, defaultModeId);
      if (value === null) {
        console.warn(`  SKIP ${variable.name} — no value in default mode`);
        continue;
      }

      const dtcgType = figmaTypeToDtcg(variable.resolvedType);
      const token = {
        $type: dtcgType,
        $value: value,
        $description: variable.description || '',
        $extensions: {
          'com.arco.design': {
            figmaVariableId: variable.id,
            figmaCollection: collection.name,
          },
          'com.anthropic.dtcg-skill': {
            source: 'figma-variables-sync',
            syncedAt: new Date().toISOString(),
            confidence: typeof value === 'string' && value.startsWith('{') ? 'high' : 'high',
          },
        },
      };

      setNestedPath(fileBuffers[destFile], variable.name, token);
      console.log(`  + ${variable.name} (${dtcgType}) → ${destFile}`);
    }
  }

  // ── 写入文件 ──────────────────────────────────────────────────────────────
  let totalTokens = 0;
  for (const [relPath, tree] of Object.entries(fileBuffers)) {
    const absPath = resolve(ROOT, relPath);
    const json = JSON.stringify(tree, null, 2);
    totalTokens += (json.match(/"\$value"/g) || []).length;

    if (DRY_RUN) {
      console.log(`\n[DRY RUN] Would write: ${relPath}`);
      console.log(json.slice(0, 300) + (json.length > 300 ? '\n  ...' : ''));
    } else {
      mkdirSync(dirname(absPath), { recursive: true });
      writeFileSync(absPath, json, 'utf8');
      console.log(`Wrote: ${relPath}`);
    }
  }

  console.log(`\n=== 完成: ${totalTokens} tokens synced to ${Object.keys(fileBuffers).length} files ===`);
  if (!DRY_RUN) {
    console.log('下一步: npm run index && npm run validate');
  }
}

main().catch((err) => {
  console.error('SYNC FAILED:', err.message);
  process.exit(1);
});
