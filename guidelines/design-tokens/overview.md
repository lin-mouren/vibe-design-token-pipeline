# Token Overview

> The Arco Design token system is a three-layer DTCG 2025.10-compliant hierarchy that connects raw design decisions to component implementations.

---

## Three-layer architecture

```
source/tokens/
├── core/          Layer 1 — raw values (hex, px, number literals)
├── semantic/      Layer 2 — role aliases (references to core tokens)
└── components/    Layer 3 — component-scoped overrides (references to semantic)
```

### Rules
- **No skipping layers:** components reference semantic, semantic references core. Direct component→core references are a CI violation.
- **No hardcoded values in semantic or component layers.** All `$value` fields must use `{path.to.token}` reference syntax.
- **One source of truth:** `source/tokens/` is canonical. `dist/` is generated, `token-index.json` is generated.

---

## Token families

| Family | Files | Description |
|---|---|---|
| Color palette | `core/colors.tokens.json` | Raw brand + neutral hex values |
| Semantic color | `semantic/color.tokens.json` | Role-based aliases (primary, danger, success…) |
| Surface & text | `semantic/surface-text.tokens.json` | Background, text, border, fill roles |
| Typography | `core/typography.tokens.json` | Font family, size, weight, line-height |
| Spacing | `core/spacing.tokens.json` | 4px-base spacing scale (1–10 + base) |
| Radius | `core/radius.tokens.json` | Border radius scale |
| Shadows | `core/shadows.tokens.json` | 3-level shadow + special |
| Grid | `core/grid.tokens.json` | Columns, gutters, breakpoints |
| Component: Button | `components/button.tokens.json` | Button-specific token bindings |
| Component: Input | `components/input.tokens.json` | Input-specific token bindings (stub) |
| Themes | `themes/light.tokens.json`, `themes/dark.tokens.json` | Theme overrides |

---

## Consuming tokens

### In CSS / SCSS
```css
.my-button {
  background: var(--primary-6);
  color: var(--color-white);
  padding: var(--spacing-small) var(--spacing-medium);
  border-radius: var(--border-radius-medium);
  font-size: var(--font-size-body-1);
  font-weight: var(--font-weight-600);
}
```

### In JavaScript (Style Dictionary output)
```js
import tokens from '@arco-design/tokens/dist/ts/arco.tokens.js';
const primary = tokens.color.primary.default; // '#165DFF'
```

### In Figma
Variables are synced via `node figma/variables-sync/dtcg-to-figma.mjs`. Always consume variables from the "Semantic Tokens" collection, not "Core Tokens".

---

## Generated artifacts

| Artifact | Command | Description |
|---|---|---|
| `token-index.json` | `python3 scripts/build_token_index.py source/tokens` | Machine-readable index of all 168 tokens |
| `token-alias-map.json` | _(same command)_ | Maps Arco CSS var names to canonical DTCG paths |
| `dist/css/arco.css` | `npm run build` | CSS custom properties (light mode) |
| `dist/css/arco-dark.css` | `npm run build` | CSS custom properties (dark mode) |
| `dist/ts/arco.tokens.js` | `npm run build` | JS/TS token object |
| `dist/json/arco.resolved.json` | `npm run build` | Fully resolved token values |
