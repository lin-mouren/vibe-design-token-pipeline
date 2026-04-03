# Spacing

> Arco Design uses a **4px base grid** with a numeric scale from 1–10 plus named semantic aliases.

---

## Spacing scale

| Token | CSS var | Value | Typical usage |
|---|---|---|---|
| `spacing.1` | `--spacing-mini` | 4px | Icon gap, badge padding, tightest element spacing |
| `spacing.2` | `--spacing-small` | 8px | Button icon gap, tag padding, compact row gap |
| `spacing.3` | `--spacing-3` | 12px | Form field gap, list item padding |
| `spacing.4` | `--spacing-medium` | 16px | Card padding, modal body padding, section gap |
| `spacing.5` | `--spacing-large` | 20px | Section vertical padding, form group gap |
| `spacing.6` | `--spacing-6` | 24px | Card outer margin, page section padding |
| `spacing.7` | `--spacing-7` | 28px | _(less common)_ |
| `spacing.8` | `--spacing-8` | 32px | Page-level vertical rhythm |
| `spacing.9` | `--spacing-9` | 36px | _(less common)_ |
| `spacing.10` | `--spacing-10` | 40px | Large section spacing, hero padding |
| `spacing.base` | `--spacing-base` | 4px | Grid unit — multiply for layout math |

---

## When to use each level

- **4px (mini):** between icon and label, between tightly coupled elements
- **8px (small):** between items in a list, between icon and text in a button
- **12px:** vertical padding in compact components, gap between form fields
- **16px (medium):** standard card padding, horizontal button padding
- **20px (large):** section separators, modal header/footer padding
- **24px+:** page-level layout spacing, between major sections

---

## Do / Don't

| Do | Don't |
|---|---|
| `padding: var(--spacing-medium)` | `padding: 16px` |
| `gap: var(--spacing-small)` | `gap: 8px` |
| `margin-top: var(--spacing-6)` | `margin-top: 24px` |
| Use adjacent scale steps for rhythm | Skip multiple steps (e.g., 4px next to 40px) |

---

## Grid gutter vs spacing

For **layout column gutters**, use grid gutter tokens, not spacing:

| Token | CSS var | Value |
|---|---|---|
| `grid.gutter.default` | — | 24px |
| `grid.gutter.options.16` | — | 16px |
| `grid.gutter.options.32` | — | 32px |

Grid gutter tokens are not exposed as CSS vars — they are consumed by the layout system (Arco `<Grid>` component).
