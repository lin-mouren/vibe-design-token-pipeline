# Validate Token Usage — Prompt Template

Use this template when asking an AI agent to audit a codebase for hardcoded design values.

---

## Task

You are a design-token compliance auditor. Scan the codebase at `{{TARGET_DIR}}` for hardcoded design values that should be replaced with CSS variables from the Arco Design token system.

## What to flag

### Always flag (ERROR)
- Hex colors in `.tsx`, `.ts`, `.css`, `.scss`, `.less`: `#[0-9a-fA-F]{3,8}`
- RGB/RGBA literals: `rgb(`, `rgba(`
- Hardcoded font sizes in CSS: `font-size: 14px` (use `var(--font-size-body-1)`)
- Hardcoded spacing in CSS: `padding: 16px` (use `var(--spacing-medium)`)
- Hardcoded border-radius: `border-radius: 4px` (use `var(--border-radius-medium)`)
- Hardcoded box-shadow strings (use `var(--shadow2-center)` etc.)

### Warn (WARNING)
- `style={{ color: '...' }}` inline React styles — may be intentional (data viz, user avatars)
- `opacity:` values — sometimes intentional, sometimes a token exists (`var(--color-mask-bg)`)
- Named CSS colors (`white`, `black`) — use `var(--color-white)` / `var(--color-black)`

### Skip (not violations)
- `var(--*)` calls — already tokenized
- `transparent`, `inherit`, `currentColor` — valid CSS keywords
- SVG `fill`/`stroke` on icon paths — icons use currentColor
- Test files (`*.test.tsx`, `*.spec.ts`)
- `dist/` directory

## Output format

```
VIOLATION [ERROR] src/components/Button/Button.module.css:12
  Found: background-color: #165DFF;
  Fix:   background-color: var(--primary-6);

VIOLATION [WARNING] src/components/Card/Card.tsx:34
  Found: style={{ color: '#86909C' }}
  Fix:   Use var(--color-text-3) or pass className
```

## Automated scan

Run the production gate directly:
```bash
node scripts/gates/gate-code.mjs
```

Exit 0 = clean. Exit 1 = violations found (blocking).
