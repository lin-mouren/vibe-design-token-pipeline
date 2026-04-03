# Token Catalog

Human-readable reference for all Arco Design tokens. Source of truth: `source/tokens/token-index.json` (168 tokens).

> Auto-generated summary — for the full machine-readable index run `python3 scripts/build_token_index.py source/tokens`.

---

## Color — Palette (Core)

| Token path | CSS var | Value |
|---|---|---|
| `palette.arcoblue.1` | `--arcoblue-1` | `#E8F3FF` |
| `palette.arcoblue.6` | `--arcoblue-6` | `#165DFF` |
| `palette.arcoblue.7` | `--arcoblue-7` | `#0E42D2` |
| `palette.red.6` | `--red-6` | `#F53F3F` |
| `palette.green.6` | `--green-6` | `#00B42A` |
| `palette.orange.6` | `--orange-6` | `#FF7D00` |
| `palette.gray.1–10` | `--gray-1` … `--gray-10` | Neutral ramp |
| `palette.dark.bg-1–5` | `--color-bg-1-dark` … | Dark mode surfaces |

## Color — Semantic (Semantic)

| Token path | CSS var | Resolves to |
|---|---|---|
| `color.primary.default` | `--primary-6` | `{palette.arcoblue.6}` |
| `color.primary.hover` | `--primary-5` | `{palette.arcoblue.5}` |
| `color.primary.active` | `--primary-7` | `{palette.arcoblue.7}` |
| `color.danger.default` | `--danger-6` | `{palette.red.6}` |
| `color.success.default` | `--success-6` | `{palette.green.6}` |
| `color.warning.default` | `--warning-6` | `{palette.orange.6}` |
| `color.link.default` | `--link-6` | `{palette.arcoblue.6}` |

## Surface & Text

| Token path | CSS var | Description |
|---|---|---|
| `surface.bg-1` | `--color-bg-1` | Page background |
| `surface.bg-2` | `--color-bg-2` | Card / panel background |
| `surface.popup` | `--color-bg-popup` | Dropdown / tooltip container |
| `text.primary` | `--color-text-1` | Headings, labels |
| `text.secondary` | `--color-text-2` | Body copy |
| `text.tertiary` | `--color-text-3` | Placeholder, hint |
| `text.disabled` | `--color-text-4` | Disabled state |
| `border.default` | `--color-border-2` | Standard border |
| `fill.1–4` | `--color-fill-1` … | Hover/active fill backgrounds |

## Spacing

| Token path | CSS var | Value |
|---|---|---|
| `spacing.1` | `--spacing-mini` | 4px |
| `spacing.2` | `--spacing-small` | 8px |
| `spacing.3` | `--spacing-3` | 12px |
| `spacing.4` | `--spacing-medium` | 16px |
| `spacing.5` | `--spacing-large` | 20px |
| `spacing.6–10` | `--spacing-6` … `--spacing-10` | 24–40px |
| `spacing.base` | `--spacing-base` | 4px (grid unit) |

## Radius

| Token path | CSS var | Value |
|---|---|---|
| `radius.none` | `--border-radius-none` | 0 |
| `radius.small` | `--border-radius-small` | 2px |
| `radius.medium` | `--border-radius-medium` | 4px |
| `radius.large` | `--border-radius-large` | 8px |
| `radius.circle` | `--border-radius-circle` | 50% |

## Shadow

| Token path | CSS var | Description |
|---|---|---|
| `shadow.level1` | `--shadow1-center` | Subtle card shadow |
| `shadow.level2` | `--shadow2-center` | Dropdown / popover |
| `shadow.level3` | `--shadow3-center` | Modal / dialog |
| `shadow.special` | `--shadow-special` | Highlight/focus ring |

## Typography

| Token path | CSS var | Value |
|---|---|---|
| `font.family.sans` | `--font-family` | System sans-serif stack |
| `font.family.mono` | `--font-family-mono` | Monospace stack |
| `font.size.12` | `--font-size-body-3` | 12px |
| `font.size.13` | `--font-size-body-2` | 13px |
| `font.size.body` | `--font-size-body-1` | 14px |
| `font.size.16` | `--font-size-header` | 16px |
| `font.size.20` | _(no arco var)_ | 20px |
| `font.weight.400` | `--font-weight-400` | Regular (400) |
| `font.weight.600` | `--font-weight-600` | SemiBold (600) |
| `font.lineHeight.base` | `--line-height-base` | 1.5715 |

## Grid

| Token path | Value | Description |
|---|---|---|
| `grid.columns.standard` | 24 | Standard grid columns |
| `grid.columns.simple` | 12 | Simple page grid |
| `grid.gutter.default` | 24px | Default column gutter |
| `grid.breakpoints.xs` | 0px | < 576px |
| `grid.breakpoints.sm` | 576px | ≥ 576px |
| `grid.breakpoints.md` | 768px | ≥ 768px |
| `grid.breakpoints.lg` | 992px | ≥ 992px |
| `grid.breakpoints.xl` | 1200px | ≥ 1200px |
| `grid.breakpoints.xxl` | 1600px | ≥ 1600px |
