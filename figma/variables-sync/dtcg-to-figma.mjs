#!/usr/bin/env node
/**
 * dtcg-to-figma.mjs — Push DTCG tokens → Figma Variables (REST API v1)
 *
 * Reads source/tokens/**\/*.json and POSTs to the Figma Variables API.
 * Requires env vars: FIGMA_PAT, FIGMA_FILE_KEY
 *
 * Scope (honest declaration):
 *   ✅ Creates/updates variable collections from core and semantic token files
 *   ✅ Maps DTCG $type → Figma resolvedType (COLOR, FLOAT, STRING, BOOLEAN)
 *   ✅ Single default mode per collection
 *   ⚠️  Multi-mode (light/dark themes) requires manual wiring in Figma
 *   ⚠️  Component-level tokens are skipped (no component-scoped variables in Figma)
 *
 * Usage:
 *   FIGMA_PAT=figd_xxx FIGMA_FILE_KEY=AbCdEfG node figma/variables-sync/dtcg-to-figma.mjs
 *   node figma/variables-sync/dtcg-to-figma.mjs --dry-run
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const TOKEN_DIR = join(ROOT, 'source', 'tokens');

const PAT = process.env.FIGMA_PAT;
const FILE_KEY = process.env.FIGMA_FILE_KEY;
const DRY_RUN = process.argv.includes('--dry-run');

if (!DRY_RUN && (!PAT || !FILE_KEY)) {
  console.error('Error: FIGMA_PAT and FIGMA_FILE_KEY env vars are required (or use --dry-run)');
  process.exit(1);
}

// ── DTCG $type → Figma resolvedType ─────────────────────────────────────────
const TYPE_MAP = {
  color:       'COLOR',
  dimension:   'FLOAT',
  number:      'FLOAT',
  fontWeight:  'FLOAT',
  fontFamily:  'STRING',
  duration:    'FLOAT',
  cubicBezier: 'STRING',
  boolean:     'BOOLEAN',
  shadow:      'STRING',   // serialised as JSON string
  typography:  'STRING',
  fontStyle:   'STRING',
  strokeStyle: 'STRING',
  border:      'STRING',
  transition:  'STRING',
  gradient:    'STRING',
};

// ── Collection mapping: directory → Figma collection name ───────────────────
const COLLECTION_MAP = {
  'core':       'Core Tokens',
  'semantic':   'Semantic Tokens',
  'themes':     'Themes',
  // 'components' intentionally skipped
};

// ── Collect token files ──────────────────────────────────────────────────────
function collectFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...collectFiles(full));
    } else if (extname(entry) === '.json' && !entry.startsWith('token-')) {
      files.push(full);
    }
  }
  return files;
}

// ── Walk token tree ──────────────────────────────────────────────────────────
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

// ── Parse color hex → Figma RGBA ────────────────────────────────────────────
function hexToFigmaColor(hex) {
  const h = hex.replace('#', '');
  const len = h.length;
  if (len === 3 || len === 6) {
    const r = parseInt(len === 3 ? h[0]+h[0] : h.slice(0,2), 16) / 255;
    const g = parseInt(len === 3 ? h[1]+h[1] : h.slice(2,4), 16) / 255;
    const b = parseInt(len === 3 ? h[2]+h[2] : h.slice(4,6), 16) / 255;
    return { r, g, b, a: 1 };
  }
  if (len === 8) {
    const r = parseInt(h.slice(0,2), 16) / 255;
    const g = parseInt(h.slice(2,4), 16) / 255;
    const b = parseInt(h.slice(4,6), 16) / 255;
    const a = parseInt(h.slice(6,8), 16) / 255;
    return { r, g, b, a };
  }
  return null;
}

// ── Build Figma value from DTCG $value ──────────────────────────────────────
function toFigmaValue(type, value) {
  if (typeof value === 'string' && /^\{[^}]+\}$/.test(value)) {
    return { alias: value.slice(1, -1) }; // reference — resolved by Figma
  }
  switch (type) {
    case 'color': {
      const rgba = hexToFigmaColor(String(value));
      return rgba || { r: 0, g: 0, b: 0, a: 1 };
    }
    case 'dimension': {
      const num = parseFloat(String(value));
      return isNaN(num) ? 0 : num;
    }
    case 'number':
    case 'fontWeight':
      return typeof value === 'number' ? value : parseFloat(String(value));
    case 'shadow':
      return typeof value === 'object' ? JSON.stringify(value) : String(value);
    default:
      return String(value);
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const files = collectFiles(TOKEN_DIR);

  // Group files by collection
  const collections = {};
  for (const file of files) {
    const rel = relative(TOKEN_DIR, file);
    const topDir = rel.split('/')[0];
    if (!COLLECTION_MAP[topDir]) continue; // skip components, token-index, etc.
    const collectionName = COLLECTION_MAP[topDir];
    if (!collections[collectionName]) collections[collectionName] = [];
    collections[collectionName].push(file);
  }

  // Build variable payloads per collection
  const variableCollections = [];
  const variables = [];
  const variableModeValues = [];

  const collectionIdMap = {};
  let colIdx = 0;

  for (const [collectionName, collFiles] of Object.entries(collections)) {
    const collectionId = `col-${colIdx++}`;
    collectionIdMap[collectionName] = collectionId;
    const modeId = `mode-${collectionId}-default`;

    variableCollections.push({
      action: 'CREATE',
      id: collectionId,
      name: collectionName,
      initialModeId: modeId,
    });

    for (const file of collFiles) {
      const parsed = JSON.parse(readFileSync(file, 'utf8'));
      for (const { path, token } of walkTokens(parsed)) {
        const { $type, $value, $description } = token;
        if (!$type) continue;

        const resolvedType = TYPE_MAP[$type] || 'STRING';
        const varId = `var-${path.replace(/\./g, '-')}`;

        variables.push({
          action: 'CREATE',
          id: varId,
          name: path,
          variableCollectionId: collectionId,
          resolvedType,
          description: $description || '',
        });

        variableModeValues.push({
          variableId: varId,
          modeId,
          value: toFigmaValue($type, $value),
        });
      }
    }
  }

  const payload = {
    variableCollections,
    variables,
    variableModeValues,
  };

  const totalVars = variables.length;
  console.log(`\n╔══════════════════════════════════════════════════════════╗`);
  console.log(`║          dtcg-to-figma.mjs — Push to Figma Variables    ║`);
  console.log(`╚══════════════════════════════════════════════════════════╝`);
  console.log(`\nCollections: ${variableCollections.length}`);
  for (const vc of variableCollections) {
    const count = variables.filter(v => v.variableCollectionId === vc.id).length;
    console.log(`  • ${vc.name}: ${count} variables`);
  }
  console.log(`Total variables: ${totalVars}`);

  if (DRY_RUN) {
    console.log(`\n[DRY RUN] Would POST to Figma API — payload summary:`);
    console.log(`  variableCollections: ${variableCollections.length}`);
    console.log(`  variables: ${variables.length}`);
    console.log(`  variableModeValues: ${variableModeValues.length}`);
    console.log(`\n✅  Dry run complete — no changes made\n`);
    return;
  }

  // POST to Figma REST API
  const url = `https://api.figma.com/v1/files/${FILE_KEY}/variables`;
  console.log(`\nPOSTing to ${url} …`);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Figma-Token': PAT,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const body = await res.json();
  if (res.ok) {
    console.log(`\n✅  Figma sync complete`);
    console.log(`    status: ${res.status}`);
  } else {
    console.error(`\n❌  Figma API error (${res.status}):`);
    console.error(JSON.stringify(body, null, 2));
    process.exit(1);
  }
}

main().catch(e => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
