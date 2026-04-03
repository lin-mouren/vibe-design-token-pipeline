# Button

> Token bindings for the Arco Design `<Button>` component. Source: `source/component-contracts/button.contract.json` and `source/tokens/components/button.tokens.json`.

---

## Token bindings by variant

### Default (type="default")

| Visual property | Token | CSS var |
|---|---|---|
| Background | `secondary.default` | `--color-secondary` |
| Background hover | `secondary.hover` | `--color-secondary-hover` |
| Background active | `secondary.active` | `--color-secondary-active` |
| Background disabled | `secondary.disabled` | `--color-secondary-disabled` |
| Text color | `text.primary` | `--color-text-1` |
| Border | `border.default` | `--color-border-2` |
| Border radius | `radius.medium` | `--border-radius-medium` |
| Font size | `font.size.body` | `--font-size-body-1` |
| Font weight | `font.weight.400` | `--font-weight-400` |

### Primary (type="primary")

| Visual property | Token | CSS var |
|---|---|---|
| Background | `color.primary.default` | `--primary-6` |
| Background hover | `color.primary.hover` | `--primary-5` |
| Background active | `color.primary.active` | `--primary-7` |
| Text color | `white` | `--color-white` |
| Border | none | — |

### Danger (type="primary" status="danger")

| Visual property | Token | CSS var |
|---|---|---|
| Background | `color.danger.default` | `--danger-6` |
| Background disabled | `color.danger.light-4` | `--color-danger-light-4` |

---

## Sizes

| Size | Padding (H/V) | Font size token | Height |
|---|---|---|---|
| mini | spacing.1 / spacing.mini | font.size.12 | 24px |
| small | spacing.2 / spacing.small | font.size.13 | 28px |
| default | spacing.4 / spacing.medium | font.size.body | 32px |
| large | spacing.5 / spacing.large | font.size.16 | 36px |

---

## Usage rules

1. **Always use `<Button>` component** — never raw `<button>` — to inherit token-driven styles automatically.
2. For destructive actions, use `status="danger"` — not a custom `className` with hardcoded red.
3. Icon-only buttons: use `shape="circle"` (maps to `radius.circle`) or `shape="round"` (maps to `radius.large`).
4. Do not override background-color or color via `style={{}}` — use the variant/status/size props.
