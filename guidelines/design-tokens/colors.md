# Colors

> Arco Design color tokens follow a two-layer system: a **palette** of raw hex values in core, and **semantic roles** in the semantic layer that map intent to palette values.

---

## Palette scale

Each color family has 10 steps (1 = lightest tint, 10 = darkest shade). Example — arcoblue:

| Token | CSS var | Value | Use |
|---|---|---|---|
| `palette.arcoblue.1` | `--arcoblue-1` | `#E8F3FF` | Background tint, badge bg |
| `palette.arcoblue.5` | `--arcoblue-5` | `#4080FF` | Hover state |
| `palette.arcoblue.6` | `--arcoblue-6` | `#165DFF` | **Primary action** |
| `palette.arcoblue.7` | `--arcoblue-7` | `#0E42D2` | Active / pressed |
| `palette.arcoblue.10` | `--arcoblue-10` | `#030A1A` | _(rarely used directly)_ |

Available palettes: `arcoblue`, `red`, `green`, `orange`, `purple`, `gold`, `cyan`, `gray`

---

## Semantic color roles

Always use semantic tokens in components — never reference palette tokens directly.

| Token | CSS var | Resolves to | Usage |
|---|---|---|---|
| `color.primary.default` | `--primary-6` | arcoblue.6 | Primary button bg, link |
| `color.primary.hover` | `--primary-5` | arcoblue.5 | Button hover |
| `color.primary.active` | `--primary-7` | arcoblue.7 | Button pressed |
| `color.primary.1` | `--color-primary-light-1` | arcoblue.1 | Tag bg, alert bg (primary) |
| `color.danger.default` | `--danger-6` | red.6 | Error / destructive action |
| `color.danger.light-1` | `--color-danger-light-1` | red.1 | Error message background |
| `color.success.default` | `--success-6` | green.6 | Success state |
| `color.warning.default` | `--warning-6` | orange.6 | Warning state |
| `color.link.default` | `--link-6` | arcoblue.6 | Hyperlink text |

---

## Surface tokens

| Token | CSS var | Usage |
|---|---|---|
| `surface.bg-1` | `--color-bg-1` | Page / app background |
| `surface.bg-2` | `--color-bg-2` | Card, panel, sidebar |
| `surface.bg-3` | `--color-bg-3` | Input, table row hover |
| `surface.bg-4` | `--color-bg-4` | Disabled input background |
| `surface.bg-5` | `--color-bg-5` | Active menu item |
| `surface.popup` | `--color-bg-popup` | Dropdown, tooltip, popover |

---

## Text tokens

| Token | CSS var | Usage |
|---|---|---|
| `text.primary` | `--color-text-1` | Headings, labels, primary body |
| `text.secondary` | `--color-text-2` | Supporting text, descriptions |
| `text.tertiary` | `--color-text-3` | Placeholder, secondary metadata |
| `text.disabled` | `--color-text-4` | Disabled text |

---

## Dark mode

Semantic tokens automatically resolve to dark variants when `[arco-theme='dark']` is applied to a root element. **Do not write separate dark-mode color values** — the theme token layer (`source/tokens/themes/dark.tokens.json`) handles all overrides.

---

## Do / Don't

| Do | Don't |
|---|---|
| `var(--primary-6)` for action button | `#165DFF` hardcoded |
| `var(--color-text-1)` for heading | `var(--arcoblue-6)` in a text rule |
| `var(--color-bg-1)` for page bg | `var(--gray-1)` in a semantic context |
| Use danger/success/warning role tokens for status | Use raw `red-6`/`green-6` in components |
