# Typography

> Typography tokens define the font families, sizes, weights, and line heights used across Arco Design components.

---

## Font families

| Token | CSS var | Value | Usage |
|---|---|---|---|
| `font.family.sans` | `--font-family` | System sans-serif stack | All UI text, headings, labels |
| `font.family.mono` | `--font-family-mono` | Monospace stack | Code blocks, terminal output |

The sans-serif stack: `-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif`

---

## Font sizes

| Token | CSS var | Value | Usage |
|---|---|---|---|
| `font.size.12` | `--font-size-body-3` | 12px | Captions, badges, helper text |
| `font.size.13` | `--font-size-body-2` | 13px | Compact list items, tooltips |
| `font.size.body` | `--font-size-body-1` | 14px | **Default body text**, form labels, menu items |
| `font.size.16` | `--font-size-header` | 16px | Subheadings, modal secondary title |
| `font.size.20` | _(no arco var)_ | 20px | Section headings, page title (medium) |

**Default body size is 14px** (`--font-size-body-1`). Most components inherit this from the root.

---

## Font weights

| Token | CSS var | Value | Usage |
|---|---|---|---|
| `font.weight.400` / `font.weight.regular` | `--font-weight-400` | 400 | Body text, captions, descriptions |
| `font.weight.500` | `--font-weight-500` | 500 | Subheadings, active menu items |
| `font.weight.600` / `font.weight.semibold` | `--font-weight-600` | 600 | Page titles, modal titles, card headings |
| `font.weight.700` | `--font-weight-700` | 700 | Emphasis, data labels |

Use the **semantic aliases** (`font.weight.regular`, `font.weight.semibold`) in component token bindings — they resolve to the numeric values at build time.

---

## Line height

| Token | CSS var | Value | Usage |
|---|---|---|---|
| `font.lineHeight.base` | `--line-height-base` | 1.5715 | Base line-height for body text and labels |

This ratio (≈ 22px at 14px base) satisfies WCAG 1.4.12 (Text Spacing) minimum.

---

## Do / Don't

| Do | Don't |
|---|---|
| `font-size: var(--font-size-body-1)` | `font-size: 14px` |
| `font-weight: var(--font-weight-600)` | `font-weight: 600` or `font-weight: bold` |
| `font-family: var(--font-family)` | Hardcode font stack strings |
| Use `font.weight.semibold` for titles | Use `font.weight.700` for titles (too heavy) |
