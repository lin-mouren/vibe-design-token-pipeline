# Radius

> Border radius tokens define the rounding of UI elements. Use the semantic size names — never hardcode `px` values.

---

## Radius scale

| Token | CSS var | Value | Usage |
|---|---|---|---|
| `radius.none` | `--border-radius-none` | 0 | Sharp corners — data tables, code blocks |
| `radius.small` | `--border-radius-small` | 2px | Tags, badges, chips |
| `radius.medium` | `--border-radius-medium` | 4px | **Default** — buttons, inputs, cards, dropdowns |
| `radius.large` | `--border-radius-large` | 8px | Modals, drawers, large panels |
| `radius.circle` | `--border-radius-circle` | 50% | Avatars, icon buttons, circular indicators |

---

## When to use each level

- **none (0):** structured data contexts where sharp edges signal precision; code editors
- **small (2px):** small labels and indicators that need subtle rounding
- **medium (4px):** the go-to default for interactive controls (buttons, inputs, selects) and containers (cards, popovers)
- **large (8px):** larger containers like modals or sidebar panels where softer appearance is appropriate
- **circle (50%):** round/pill shapes — user avatars, floating action buttons, toggle switches

---

## Do / Don't

| Do | Don't |
|---|---|
| `border-radius: var(--border-radius-medium)` | `border-radius: 4px` |
| `border-radius: var(--border-radius-circle)` | `border-radius: 50%` or `border-radius: 9999px` |
| Use `radius.large` for modals | Mix large and small radius on nested elements arbitrarily |
