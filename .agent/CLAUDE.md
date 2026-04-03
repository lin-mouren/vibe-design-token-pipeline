# CLAUDE.md — Arco Design DTCG Token System

## Project Context

This repository contains the Arco Design DTCG 2025.10 token package.
Source of truth: `source/tokens/**/*.tokens.json` (DTCG W3C format)
Build output: `dist/` (CSS, SCSS, Tailwind, JS/TS, JSON, iOS, Android)
Design connection: Tokens Studio Git Sync (Tier 1) + Figma REST API (Tier 2)
Style Dictionary: v5.4.0 (async API, ESM-only)

## Token Authoring Rules

### REQUIRED
- All tokens must use DTCG 2025.10 format: `{ "$value": ..., "$type": ... }`
- Semantic tokens must alias primitives: `"$value": "{primitive.color.blue.500}"`
- Alias chains must be fully resolvable — no dangling references
- Token names: kebab-case, minimum 3 levels deep for primitive/semantic (e.g., `color.brand.primary`)
- Component tokens: 2-level paths accepted (e.g., `input.background`)

### PROHIBITED
- `$type: "composition"` — banned, breaks tool-chain portability
- Magic numbers in component code — always reference a token CSS variable
- Direct hex colors in component styles — use `var(--arco-<token-name>)`
- Modifying `dist/` files directly — always regenerate via `npm run build`
- `node <script>` directly — always use `npm run <script>`

## Build Commands

| Action | Command |
|--------|---------|
| Build all platforms | `npm run build` |
| Validate package | `npm run validate` |
| Validate DTCG format | `npm run validate:tokens` |
| Explode composites (safety check) | `npm run tokens:explode` |
| Lint tokens (Stage 1.5) | `npm run tokens:lint` |
| Figma pull (Tokens Studio) | `npm run figma:sync` |
| Figma push (Tokens Studio) | `npm run figma:push` |
| Run all gates | `npm run gates` |
| Full release | `npm run release` |
| Clean dist | `npm run clean` |

**Command contract:** Never use `node <script>` directly. All scripts must be invoked via `npm run <script>`.

## Code Connect Strategy

Per `.agent/CC_STRATEGY.md`: **Path B (REST API read-only)**.
- Figma account: lybory (Student/Starter plan)
- Publish via `figma connect publish`: NOT available (requires Professional+, returns 403)
- Design-code mapping: `figma/figma-to-react-map.json` (generated via REST API)
- Confidence target: 80-85% per component (not 95% — Path B limitation)

## MVP Components (Phase 2-3)

1. Button — interaction states, color matrix, typography, spacing
2. Input — focus/error/disabled states, border, typography
3. Card — compound spacing, elevation, border-radius
4. Badge/Tag — high-contrast, color variants, compact spacing
5. Toggle/Switch — boolean state, transition duration token, interaction feedback

## WCAG Requirements

All components must pass WCAG 2.1 AA:
- Normal text: 4.5:1 contrast ratio minimum
- Large text (≥18px or ≥14px bold): 3:1 minimum
- Verify with Playwright a11y-audit tests in `playwright/a11y-audit/`

## SD v5 Zero-Value Type Notes

Per `SD_V5_RISK_REGISTER.md`, these tokens changed type string→number in v5:
- `GridBreakpointsXs`: `"0px"` → `0` — check `=== "0px"` comparisons in JS consumers
- `RadiusNone`: `"0"` → `0` — check `=== "0"` comparisons in JS consumers

## Shadow Composites

4 shadow composites exist (`special`, `level1`, `level2`, `level3`).
Style Dictionary handles `$type: "shadow"` natively — no manual explosion needed.
`npm run tokens:explode` validates no banned `$type: "composition"` tokens exist.

## Gate Contracts (Phase 4)

| Gate | Type | Status |
|------|------|--------|
| Gate 1 | Token validation (`npm run validate:tokens`) | Required |
| Gate 2-MVP | Static manifest (`figma-code-map.json` diff) | Required |
| Gate 3 | Codex code review | Deferred to next iteration |
| Gate 4 | Playwright 3-suite test pass | Required |
| Gate 5 | Release publish | Required |

## Stage Locks

Pipeline gate state tracked in `ir/stage-locks.json` (schemaVersion: 2).
Do not manually set `CANONICAL_VALID = true` — this is set by human curator at Stage 3.
