#!/usr/bin/env node
/**
 * generate-stories.mjs — Auto-generate Storybook stories from component contracts
 *
 * Reads: source/component-contracts/*.contract.json
 * Writes: verification/storybook/generated/*.generated.stories.tsx
 *
 * Also generates Foundation token showcase stories from source/tokens/ + dist/css/
 *
 * Usage:
 *   node scripts/generate-stories.mjs [--dry-run]
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CONTRACT_DIR = join(ROOT, 'source', 'component-contracts');
const TOKEN_DIR = join(ROOT, 'source', 'tokens');
const CSS_FILE = join(ROOT, 'dist', 'css', 'arco.css');
const OUT_DIR = join(ROOT, 'verification', 'storybook', 'generated');
const DRY_RUN = process.argv.includes('--dry-run');

mkdirSync(OUT_DIR, { recursive: true });

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Parse CSS file to extract variable names */
function parseCssVars(cssPath) {
  try {
    const css = readFileSync(cssPath, 'utf8');
    const vars = [];
    for (const m of css.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) {
      vars.push({ name: `--${m[1]}`, value: m[2].trim().replace(/\/\*.*?\*\//, '').trim() });
    }
    return vars;
  } catch { return []; }
}

/** Walk DTCG token tree and collect token entries */
function* walkTokens(obj, path = []) {
  if (typeof obj !== 'object' || obj === null) return;
  if ('$value' in obj) {
    yield { path: path.join('.'), ...obj };
    return;
  }
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue;
    yield* walkTokens(v, [...path, k]);
  }
}

/** Convert component name to PascalCase */
function toPascal(s) {
  return s.replace(/(^|[-_/ ])(\w)/g, (_, __, c) => c.toUpperCase());
}

// ── Component story generator ───────────────────────────────────────────────

function generateComponentStory(contract) {
  const comp = contract.component;
  const pascalName = toPascal(comp.replace('/', ''));

  // Determine imports
  const imports = contract.subComponents
    ? Object.keys(contract.subComponents).join(', ')
    : pascalName;

  const lines = [];
  lines.push(`// Auto-generated from ${comp} contract — do not edit manually`);
  lines.push(`import React from 'react';`);
  lines.push(`import type { Meta, StoryObj } from '@storybook/react';`);
  lines.push(`import { ${imports}${contract.subComponents ? ', Space' : ''} } from '@arco-design/web-react';`);
  lines.push(`import '@arco-design/web-react/dist/css/arco.css';`);
  lines.push('');

  // Use primary component for meta
  const primaryComp = contract.subComponents
    ? Object.keys(contract.subComponents)[0]
    : pascalName;

  lines.push(`const meta: Meta<typeof ${primaryComp}> = {`);
  lines.push(`  title: 'Generated/${comp}',`);
  lines.push(`  component: ${primaryComp},`);
  lines.push(`  tags: ['autodocs'],`);

  // Build argTypes from variants
  const argTypes = {};
  for (const [name, def] of Object.entries(contract.variants || {})) {
    if (typeof def.values[0] === 'boolean') {
      argTypes[name] = `{ control: 'boolean' }`;
    } else {
      const opts = JSON.stringify(def.values);
      argTypes[name] = `{ control: 'select', options: ${opts} }`;
    }
  }

  lines.push(`  argTypes: {`);
  for (const [k, v] of Object.entries(argTypes)) {
    lines.push(`    ${k}: ${v},`);
  }
  lines.push(`  },`);
  lines.push(`};`);
  lines.push('');
  lines.push(`export default meta;`);
  lines.push(`type Story = StoryObj<typeof ${primaryComp}>;`);
  lines.push('');

  // Generate stories for each key variant combination
  const variants = contract.variants || {};

  // 1. Default story
  const defaultArgs = {};
  for (const [name, def] of Object.entries(variants)) {
    if (typeof def.default !== 'boolean') {
      defaultArgs[name] = def.default;
    }
  }
  defaultArgs.children = defaultArgs.children || comp.split('/')[0];

  lines.push(`export const Default: Story = {`);
  lines.push(`  args: ${JSON.stringify(defaultArgs)},`);
  lines.push(`};`);
  lines.push('');

  // 2. Size variant stories (if applicable)
  const sizeVariant = variants.size;
  if (sizeVariant) {
    for (const size of sizeVariant.values) {
      if (size === sizeVariant.default) continue;
      const storyName = `Size${toPascal(String(size))}`;
      lines.push(`export const ${storyName}: Story = {`);
      lines.push(`  name: 'Size: ${size}',`);
      lines.push(`  args: { ...Default.args, size: '${size}' },`);
      lines.push(`};`);
      lines.push('');
    }
  }

  // 3. Type/status variant stories
  for (const variantName of ['type', 'status', 'color']) {
    const variant = variants[variantName];
    if (!variant) continue;
    for (const val of variant.values) {
      if (val === variant.default) continue;
      const storyName = `${toPascal(variantName)}${toPascal(String(val))}`;
      lines.push(`export const ${storyName}: Story = {`);
      lines.push(`  name: '${toPascal(variantName)}: ${val}',`);
      lines.push(`  args: { ...Default.args, ${variantName}: '${val}' },`);
      lines.push(`};`);
      lines.push('');
    }
  }

  // 4. Interaction state stories
  if (variants.disabled) {
    lines.push(`export const Disabled: Story = {`);
    lines.push(`  args: { ...Default.args, disabled: true },`);
    lines.push(`};`);
    lines.push('');
  }
  if (variants.loading) {
    lines.push(`export const Loading: Story = {`);
    lines.push(`  args: { ...Default.args, loading: true },`);
    lines.push(`};`);
    lines.push('');
  }

  return lines.join('\n');
}

// ── Foundation story generator ──────────────────────────────────────────────

function generateFoundationColorStory() {
  const tokenFile = join(TOKEN_DIR, 'core', 'color.tokens.json');
  let tokens;
  try { tokens = JSON.parse(readFileSync(tokenFile, 'utf8')); } catch { return null; }

  const colors = [];
  for (const { path, $value, $type } of walkTokens(tokens)) {
    if ($type === 'color' || path.includes('color')) {
      colors.push({ path, value: $value });
    }
  }

  const cssVars = parseCssVars(CSS_FILE);
  const varMap = new Map(cssVars.map(v => [v.name, v.value]));

  // Group by color family
  const families = {};
  for (const c of colors) {
    const parts = c.path.split('.');
    const family = parts.length >= 3 ? parts.slice(0, 3).join('.') : parts.slice(0, 2).join('.');
    if (!families[family]) families[family] = [];
    families[family].push(c);
  }

  const lines = [];
  lines.push(`// Auto-generated Foundation: Colors — do not edit manually`);
  lines.push(`import React from 'react';`);
  lines.push(`import type { Meta, StoryObj } from '@storybook/react';`);
  lines.push(`import '@arco-design/web-react/dist/css/arco.css';`);
  lines.push('');
  lines.push(`const meta: Meta = {`);
  lines.push(`  title: 'Generated/Foundations/Colors',`);
  lines.push(`  tags: ['autodocs'],`);
  lines.push(`};`);
  lines.push(`export default meta;`);
  lines.push('');

  // Color palette render helper
  lines.push(`const Swatch = ({ name, cssVar, hex }: { name: string; cssVar: string; hex: string }) => (`);
  lines.push(`  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', margin: 4, width: 80 }}>`);
  lines.push(`    <div style={{ width: 64, height: 64, borderRadius: 8, background: cssVar ? \`var(\${cssVar})\` : hex, border: '1px solid #e5e6eb' }} />`);
  lines.push(`    <span style={{ fontSize: 10, marginTop: 4, color: '#4e5969', textAlign: 'center', wordBreak: 'break-all' }}>{name}</span>`);
  lines.push(`  </div>`);
  lines.push(`);`);
  lines.push('');

  // Generate a story per color family
  for (const [family, colorList] of Object.entries(families)) {
    const storyName = toPascal(family.replace(/\./g, '-'));
    lines.push(`export const ${storyName}: StoryObj = {`);
    lines.push(`  name: '${family}',`);
    lines.push(`  render: () => (`);
    lines.push(`    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>`);
    for (const c of colorList) {
      const cssName = '--' + c.path.replace(/\./g, '-');
      const resolvedHex = varMap.get(cssName) || '#ccc';
      lines.push(`      <Swatch name="${c.path.split('.').pop()}" cssVar="${cssName}" hex="${resolvedHex}" />`);
    }
    lines.push(`    </div>`);
    lines.push(`  ),`);
    lines.push(`};`);
    lines.push('');
  }

  return lines.join('\n');
}

function generateFoundationSpacingStory() {
  const tokenFile = join(TOKEN_DIR, 'core', 'spacing.tokens.json');
  let tokens;
  try { tokens = JSON.parse(readFileSync(tokenFile, 'utf8')); } catch { return null; }

  const items = [];
  for (const { path, $value } of walkTokens(tokens)) {
    items.push({ path, value: $value });
  }

  const lines = [];
  lines.push(`// Auto-generated Foundation: Spacing — do not edit manually`);
  lines.push(`import React from 'react';`);
  lines.push(`import type { Meta, StoryObj } from '@storybook/react';`);
  lines.push(`import '@arco-design/web-react/dist/css/arco.css';`);
  lines.push('');
  lines.push(`const meta: Meta = { title: 'Generated/Foundations/Spacing', tags: ['autodocs'] };`);
  lines.push(`export default meta;`);
  lines.push('');

  lines.push(`export const SpacingScale: StoryObj = {`);
  lines.push(`  render: () => (`);
  lines.push(`    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>`);
  for (const item of items) {
    const px = typeof item.value === 'string' ? item.value : `${item.value}px`;
    lines.push(`      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>`);
    lines.push(`        <code style={{ width: 200, fontSize: 12 }}>${item.path}</code>`);
    lines.push(`        <div style={{ width: ${parseInt(px) || 0}, height: 24, background: '#165dff', borderRadius: 2 }} />`);
    lines.push(`        <span style={{ fontSize: 12, color: '#86909c' }}>${px}</span>`);
    lines.push(`      </div>`);
  }
  lines.push(`    </div>`);
  lines.push(`  ),`);
  lines.push(`};`);

  return lines.join('\n');
}

function generateFoundationRadiusStory() {
  const tokenFile = join(TOKEN_DIR, 'core', 'radius.tokens.json');
  let tokens;
  try { tokens = JSON.parse(readFileSync(tokenFile, 'utf8')); } catch { return null; }

  const items = [];
  for (const { path, $value } of walkTokens(tokens)) {
    items.push({ path, value: $value });
  }

  const lines = [];
  lines.push(`// Auto-generated Foundation: Radius — do not edit manually`);
  lines.push(`import React from 'react';`);
  lines.push(`import type { Meta, StoryObj } from '@storybook/react';`);
  lines.push(`import '@arco-design/web-react/dist/css/arco.css';`);
  lines.push('');
  lines.push(`const meta: Meta = { title: 'Generated/Foundations/Radius', tags: ['autodocs'] };`);
  lines.push(`export default meta;`);
  lines.push('');

  lines.push(`export const RadiusScale: StoryObj = {`);
  lines.push(`  render: () => (`);
  lines.push(`    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: 16 }}>`);
  for (const item of items) {
    const px = typeof item.value === 'string' ? item.value : (item.value === 0 ? '0' : `${item.value}px`);
    const radius = item.value >= 9999 ? '50%' : px;
    lines.push(`      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>`);
    lines.push(`        <div style={{ width: 64, height: 64, background: '#e8f3ff', border: '2px solid #165dff', borderRadius: '${radius}' }} />`);
    lines.push(`        <code style={{ fontSize: 10, marginTop: 4 }}>${item.path.split('.').pop()}</code>`);
    lines.push(`        <span style={{ fontSize: 10, color: '#86909c' }}>${px}</span>`);
    lines.push(`      </div>`);
  }
  lines.push(`    </div>`);
  lines.push(`  ),`);
  lines.push(`};`);

  return lines.join('\n');
}

// ── Main ────────────────────────────────────────────────────────────────────

const results = { components: 0, foundations: 0, errors: [] };

// 1. Generate component stories from contracts
const contractFiles = readdirSync(CONTRACT_DIR).filter(f => f.endsWith('.contract.json'));
for (const f of contractFiles) {
  try {
    const contract = JSON.parse(readFileSync(join(CONTRACT_DIR, f), 'utf8'));
    const code = generateComponentStory(contract);
    const outName = basename(f, '.contract.json') + '.generated.stories.tsx';
    const outPath = join(OUT_DIR, outName);

    if (DRY_RUN) {
      console.log(`[DRY RUN] Would write: ${outName} (${code.split('\n').length} lines)`);
    } else {
      writeFileSync(outPath, code + '\n');
      console.log(`✅ ${outName} (${code.split('\n').length} lines)`);
    }
    results.components++;
  } catch (e) {
    results.errors.push(`${f}: ${e.message}`);
  }
}

// 2. Generate foundation stories
const foundations = [
  { name: 'colors', fn: generateFoundationColorStory },
  { name: 'spacing', fn: generateFoundationSpacingStory },
  { name: 'radius', fn: generateFoundationRadiusStory },
];

for (const { name, fn } of foundations) {
  try {
    const code = fn();
    if (!code) { results.errors.push(`${name}: no token data found`); continue; }
    const outPath = join(OUT_DIR, `foundation-${name}.generated.stories.tsx`);

    if (DRY_RUN) {
      console.log(`[DRY RUN] Would write: foundation-${name} (${code.split('\n').length} lines)`);
    } else {
      writeFileSync(outPath, code + '\n');
      console.log(`✅ foundation-${name}.generated.stories.tsx (${code.split('\n').length} lines)`);
    }
    results.foundations++;
  } catch (e) {
    results.errors.push(`foundation-${name}: ${e.message}`);
  }
}

// 3. Summary
console.log(`\n━━━ Summary ━━━`);
console.log(`Components: ${results.components} stories generated`);
console.log(`Foundations: ${results.foundations} stories generated`);
if (results.errors.length) {
  console.log(`Errors: ${results.errors.length}`);
  for (const e of results.errors) console.log(`  ❌ ${e}`);
  process.exit(1);
}
console.log(`\nAll stories written to: verification/storybook/generated/`);
