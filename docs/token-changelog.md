# Token Changelog

All notable changes to the Vibe Design Token Pipeline. Follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Known gaps
- `input.tokens.json` — stub only; token binding is PLACEHOLDER pending Figma audit
- `dist/` — not yet generated; run `npm run build`
- Figma Variable bindings — not yet audited; requires FIGMA_PAT + FIGMA_FILE_KEY

---

## [0.2.0] — 2026-03-22

### Added
- **Grid tokens** (`source/tokens/core/grid.tokens.json`): 24-column / 12-column layouts, gutter options (8/16/24/32/40 px), breakpoints (xs/sm/md/lg/xl/xxl)
- **Shadow tokens** (`source/tokens/core/shadows.tokens.json`): shadow.level1/2/3 structured objects, shadow.special
- **Semantic alias tokens** in typography: `font.size.body` → `{font.size.14}`, `font.weight.regular` → `{font.weight.400}`, `font.weight.semibold` → `{font.weight.600}`
- **Scripts** self-bootstrapped: `scripts/validate_package.py`, `scripts/build_token_index.py`, `scripts/validate-dtcg.mjs`
- **Figma sync scripts**: `figma/variables-sync/dtcg-to-figma.mjs`, `figma/variables-sync/figma-to-dtcg.mjs`
- **Production gates**: `scripts/gates/gate-code.mjs`, `scripts/gates/gate-delivery.mjs`, `scripts/gates/gate-figma.mjs`
- **CI workflow**: `.github/workflows/token-ci.yml` (5 jobs)

### Fixed
- `fontWeight` values changed from string literals (`"400"`) to numbers (`400`) — DTCG §6.5 compliance
- `grid.gutter.options` changed from invalid array string to 5 separate dimension tokens
- `token-index.json` regenerated: 130 → 168 tokens, 0 gap vs source

### Removed
- Legacy `tokens/` mirror directory (dual-source drift risk) — `source/tokens/` is now the sole canonical location

### Changed
- CI uses `npm install` instead of `npm ci` (no package-lock.json in repo yet)
- `gate-figma.mjs` scope declaration made explicit: variable-level checks only, not node-tree boundVariables audit

---

## [0.1.0] — 2026-03-01

### Added
- Initial token extraction from Arco Design CSS variables and spec documentation
- Core tokens: colors (palette), typography, spacing, radius, shadows
- Semantic tokens: surface, text, border, fill, color roles (primary/danger/success/warning/link)
- Component tokens: button, input (stub)
- `token-index.json` (130 tokens), `token-alias-map.json`
- `build/style-dictionary.config.mjs` (8 output platforms)
- `build/figma.config.json`
- Component contracts: `button.contract.json`, `input.contract.json` (stub)
- Registries: `component-registry.json`, `recipe-registry.json`
- `release/delivery-manifest.schema.json`
