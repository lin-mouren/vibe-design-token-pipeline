# Implement From Figma — Prompt Template

Use this template when asking an AI agent to generate production React/CSS from a Figma design using Arco Design tokens.

---

## Task

You are a frontend engineer implementing a UI component from a Figma design using the Arco Design token system.

**Input:**
- Figma frame: `{{FIGMA_FRAME_URL}}`
- Component: `{{COMPONENT_NAME}}`

**Constraints:**

1. **Never use hardcoded values.** All colors, spacing, radii, shadows, and typography must come from CSS variables.

2. **CSS variable reference priority:**
   - Semantic tokens first: `var(--color-text-1)`, `var(--color-primary-6)`, `var(--spacing-medium)`
   - Core tokens only if no semantic equivalent exists
   - Never reference palette directly in components (e.g., `var(--arcoblue-6)` in a button is a violation)

3. **Token → CSS var mapping:**
   | Token path | CSS var |
   |---|---|
   | `text.primary` | `--color-text-1` |
   | `text.secondary` | `--color-text-2` |
   | `text.tertiary` | `--color-text-3` |
   | `text.disabled` | `--color-text-4` |
   | `color.primary.default` | `--color-primary-6` / `--primary-6` |
   | `color.danger.default` | `--danger-6` |
   | `surface.bg-1` | `--color-bg-1` |
   | `surface.popup` | `--color-bg-popup` |
   | `spacing.4` | `--spacing-medium` (16px) |
   | `spacing.5` | `--spacing-large` (20px) |
   | `radius.medium` | `--border-radius-medium` |
   | `shadow.level2` | `--shadow2-center` |
   | `font.size.body` | `--font-size-body-1` (14px) |
   | `font.weight.semibold` | `--font-weight-600` |

4. **Component props** must map to token-driven CSS classes, not inline styles.

5. **Dark mode:** Do not hard-code dark mode values. The `[arco-theme='dark']` selector handles overrides automatically via theme tokens.

## Output

- `{{COMPONENT_NAME}}.tsx` — React component
- `{{COMPONENT_NAME}}.module.css` — CSS module using `var(--*)` only
- Reference: `source/component-contracts/{{component-name}}.contract.json`
