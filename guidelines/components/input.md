# Input

> Token bindings for the Arco Design `<Input>` component.
> **Confidence: medium.** Bindings derived from Arco Design CSS variable patterns. Pending Figma `boundVariables` audit for promotion to stable.

Source files:
- Tokens: `source/tokens/components/input.tokens.json` (15 tokens, real `$value` entries)
- Contract: `source/component-contracts/input.contract.json` (12 bindings, `low-confidence`)
- Stories: `verification/storybook/Input.stories.tsx` (10 stories, real `@arco-design/web-react` import)

---

## Token bindings

Derived from Arco Design CSS variables and confirmed against button contract patterns.

| Visual property | Token path | CSS var | Confidence |
|---|---|---|---|
| Background (default) | `input.background` → `{surface.bg-3}` | `--color-bg-3` | medium |
| Background (hover) | `input.background-hover` → `{surface.bg-2}` | `--color-bg-2` | medium |
| Background (disabled) | `input.background-disabled` → `{surface.bg-4}` | `--color-bg-4` | medium |
| Border (default) | `input.border-color` → `{border.2}` | `--color-border-2` | medium |
| Border (focus) | `input.border-color-focus` → `{color.primary.default}` | `--primary-6` | medium |
| Border (error) | `input.border-color-error` → `{color.danger.default}` | `--danger-6` | medium |
| Border (warning) | `input.border-color-warning` → `{color.warning.default}` | `--warning-6` | medium |
| Text (value) | `input.text-color` → `{text.primary}` | `--color-text-1` | high |
| Text (placeholder) | `input.placeholder-color` → `{text.tertiary}` | `--color-text-3` | high |
| Text (disabled) | `input.text-color-disabled` → `{text.disabled}` | `--color-text-4` | high |
| Border radius | `input.border-radius` → `{radius.medium}` | `--border-radius-medium` | high |
| Font size (medium) | `input.font-size` → `{font.size.body}` | `--font-size-body-1` | high |
| Font size (small) | `input.font-size-small` → `{font.size.13}` | `--font-size-body-2` | medium |
| Padding H | `input.padding-horizontal` → `{spacing.2}` | `--spacing-small` | medium |
| Padding V (medium) | `input.padding-vertical` → `{spacing.3}` | `--spacing-3` | medium |

---

## Pending Figma audit (required for stable promotion)

Run the following to verify all bindings against Figma:

```bash
export FIGMA_PAT=<personal-access-token>
export FIGMA_FILE_KEY=<file-key>
node figma/variables-sync/figma-to-dtcg.mjs
node scripts/gates/gate-figma.mjs
```

What to confirm in Figma:
1. Inspect `Input / Default`, `Input / Hover`, `Input / Focus`, `Input / Error`, `Input / Disabled` frames
2. Verify `boundVariables` on background fill, border stroke, text fill match the token paths above
3. Update `input.contract.json` evidence.confidence to `"high"` and status to `"stable"`
4. Update `component-registry.json` status to `"stable"`

Gaps not yet captured: mini/large size padding, prefix/suffix icon color token.

---

## Usage rules

1. Use `status="error"` for validation errors — do not set `className` with hardcoded red border.
2. Use `prefix`/`suffix` slots for icons — do not put icons in `value`.
3. Password inputs: use `<Input.Password>` — never build custom visibility toggle.
4. For read-only display of text, prefer `readOnly` over `disabled` (different semantic).
