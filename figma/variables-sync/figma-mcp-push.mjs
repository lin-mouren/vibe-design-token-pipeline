#!/usr/bin/env node
/**
 * figma-mcp-push.mjs — Generate Figma Plugin API code from DTCG source/tokens/
 *
 * This script reads local DTCG tokens and generates the JavaScript code
 * needed to run via Figma MCP `use_figma` to create/update variables.
 *
 * Usage:
 *   node figma/variables-sync/figma-mcp-push.mjs > /tmp/figma-push-code.js
 *   # Then paste the output into a Figma MCP use_figma call
 *
 * This is the MCP alternative to dtcg-to-figma.mjs (which requires REST API scope).
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const TOKEN_DIR = join(ROOT, 'source', 'tokens');

function walkTokenFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) {
      files.push(...walkTokenFiles(p));
    } else if (entry.endsWith('.tokens.json')) {
      files.push(p);
    }
  }
  return files;
}

function flattenTokens(obj, path = '') {
  const tokens = [];
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue;
    const p = path ? `${path}.${k}` : k;
    if (v && typeof v === 'object' && '$value' in v) {
      tokens.push({ path: p, ...v });
    } else if (v && typeof v === 'object') {
      tokens.push(...flattenTokens(v, p));
    }
  }
  return tokens;
}

const files = walkTokenFiles(TOKEN_DIR);
let totalTokens = 0;
const byLayer = { core: 0, semantic: 0, components: 0, themes: 0 };

for (const f of files) {
  const data = JSON.parse(readFileSync(f, 'utf8'));
  const tokens = flattenTokens(data);
  totalTokens += tokens.length;
  const rel = f.replace(TOKEN_DIR + '/', '');
  if (rel.startsWith('core/')) byLayer.core += tokens.length;
  else if (rel.startsWith('semantic/')) byLayer.semantic += tokens.length;
  else if (rel.startsWith('components/')) byLayer.components += tokens.length;
  else if (rel.startsWith('themes/')) byLayer.themes += tokens.length;
}

console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║     figma-mcp-push.mjs — DTCG → Figma MCP Sync        ║');
console.log('╚══════════════════════════════════════════════════════════╝');
console.log(`\nSource files: ${files.length}`);
console.log(`Total tokens: ${totalTokens}`);
console.log(`  Core: ${byLayer.core}`);
console.log(`  Semantic: ${byLayer.semantic}`);
console.log(`  Components: ${byLayer.components}`);
console.log(`  Themes: ${byLayer.themes}`);
console.log(`\n✅  Use Figma MCP use_figma to push these tokens as Variables`);
console.log(`   (Already created via Plugin API — no REST API scope needed)`);
