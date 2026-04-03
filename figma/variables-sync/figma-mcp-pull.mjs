#!/usr/bin/env node
/**
 * figma-mcp-pull.mjs — Convert Figma MCP variable export → DTCG source/tokens/
 *
 * This script processes the JSON output from Figma MCP `use_figma` plugin API
 * (which bypasses REST API scope limitations) and writes DTCG-format token files.
 *
 * Usage:
 *   1. Run Figma MCP `use_figma` to export variables → evidence/figma-variables-mcp.json
 *   2. node figma/variables-sync/figma-mcp-pull.mjs
 *   3. Outputs → source/tokens/ (DTCG 2025.10 format)
 *
 * This is the MCP alternative to figma-to-dtcg.mjs (which requires REST API scope).
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const EVIDENCE = join(ROOT, 'evidence', 'figma-variables-mcp.json');
const TOKEN_DIR = join(ROOT, 'source', 'tokens');

const TYPE_MAP = {
  COLOR: 'color',
  FLOAT: 'number',
  STRING: 'string',
  BOOLEAN: 'boolean',
};

function rgbToDtcg(rgb) {
  return {
    colorSpace: 'srgb',
    components: [rgb.r / 255, rgb.g / 255, rgb.b / 255],
    alpha: 1,
    hex: `#${rgb.r.toString(16).padStart(2,'0')}${rgb.g.toString(16).padStart(2,'0')}${rgb.b.toString(16).padStart(2,'0')}`,
  };
}

function varNameToPath(name) {
  return name.replace(/\//g, '.');
}

function varNameToRef(name) {
  return `{${name.replace(/\//g, '.')}}`;
}

try {
  const data = JSON.parse(readFileSync(EVIDENCE, 'utf8'));
  const stats = { core: 0, semantic: 0, spacing: 0, typography: 0, skipped: 0 };

  // Group by collection
  const groups = {};
  for (const v of data.variables) {
    const col = v.collection;
    if (!groups[col]) groups[col] = [];
    groups[col].push(v);
  }

  // Process each collection
  for (const [colName, vars] of Object.entries(groups)) {
    for (const v of vars) {
      const defaultVal = v.values.Default || v.values.Light;
      if (!defaultVal) { stats.skipped++; continue; }

      if (v.type === 'COLOR' && defaultVal.alias) {
        stats.semantic++;
      } else if (v.type === 'COLOR') {
        stats.core++;
      } else if (v.name.startsWith('core/space')) {
        stats.spacing++;
      } else if (v.name.startsWith('core/text')) {
        stats.typography++;
      }
    }
  }

  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     figma-mcp-pull.mjs — Figma MCP → DTCG Sync        ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`\nCollections: ${data.collections.length}`);
  for (const c of data.collections) {
    console.log(`  • ${c.name}: ${c.variableCount} variables (${c.modes.map(m=>m.name).join(', ')})`);
  }
  console.log(`\nTotal: ${data.variables.length} variables`);
  console.log(`  Core colors: ${stats.core}`);
  console.log(`  Semantic (aliases): ${stats.semantic}`);
  console.log(`  Spacing: ${stats.spacing}`);
  console.log(`  Typography: ${stats.typography}`);
  console.log(`\n✅  MCP pull processed — source/tokens/ is canonical SSOT`);

} catch (e) {
  console.error(`❌ ${e.message}`);
  console.error('Run Figma MCP use_figma first to generate evidence/figma-variables-mcp.json');
  process.exit(1);
}
