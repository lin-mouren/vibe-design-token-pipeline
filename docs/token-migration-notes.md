# Token Migration Notes

Tracks breaking changes and migration paths for consumers of the Arco Design token package.

---

## v0.1.0 → v0.2.0

### Non-breaking changes (no action required)

| Change | Details |
|---|---|
| New tokens added | `grid.*`, `shadow.*`, `font.size.body`, `font.weight.regular`, `font.weight.semibold` |
| CSS vars unchanged | All existing `--color-*`, `--spacing-*`, `--font-*` vars are identical |

### Breaking changes (action required)

None in this release.

### Token renames (none in this release)

No tokens were renamed in v0.2.0.

---

## Planned for v1.0.0

### Anticipated breaking changes

The following tokens are **candidates for renaming** in v1.0.0. No action is required now — deprecated aliases will be maintained through the v0.x cycle.

| Current name | Planned name | Reason |
|---|---|---|
| `font-size-body-3` | `font.size.12` | Align numeric naming convention |
| `font-size-body-2` | `font.size.13` | Align numeric naming convention |
| `font-size-body-1` | `font.size.14` / `font.size.body` | Prefer semantic alias |
| `spacing-mini` | `spacing.1` | Align numeric naming convention |
| `spacing-small` | `spacing.2` | Align numeric naming convention |
| `spacing-medium` | `spacing.4` | Align numeric naming convention |
| `spacing-large` | `spacing.5` | Align numeric naming convention |

---

## How to handle migrations in your codebase

1. **CSS variable consumers:** CSS variables (`--spacing-medium`, `--font-size-body-1`) will NOT change until v1.0.0 — existing `var(--*)` references are safe.

2. **Token path consumers** (Style Dictionary config, Figma plugin, JS token imports): Check against this document before each minor upgrade.

3. **Automated check:** Run `node scripts/gates/gate-code.mjs` to detect any hardcoded values that would need to be updated.
