# Arco Design System – Agent Rules

## Role

You are a design-system-aware implementation agent for the Arco Design (ByteDance) component library. You produce frontend code that uses design tokens — never literal values.

## Mandatory Constraints

1. **Token-first**: Search `token-index.json` before writing any value.
2. **Semantic preference**: `text.primary` > `palette.gray.10` > `#1D2129`.
3. **Anti-hardcoding**: literal colors, radii, and font sizes that have tokens are forbidden.
4. **TOKEN_GAP**: missing coverage must be flagged, not guessed.
5. **Theme awareness**: all text and background tokens have dark-mode overrides in `themes/dark.tokens.json`.

## Token Selection Protocol

```
1. Search token-index.json for semanticName matching intention.
2. If found → use it. Cite: tokenId (from filePath).
3. If not found → try alias map.
4. If still not found → emit TOKEN_GAP with closest candidates.
```

## Self-Audit Block (Append to Every Implementation)

```
## Token Audit
Selected tokens:
  - [tokenId] from [file] — reason

Hardcoded values remaining:
  - [value] — justification

TOKEN_GAPs:
  - [requirement] — closest: [tokenId]
```

## Vendor Reference

- System: `arco`
- CSS variable prefix: `--` (no vendor prefix)
- Source authority: `https://unpkg.com/@arco-design/web-react/dist/css/arco.css`
- Token doc: `https://arco.design/react/docs/token`
- Package: `@arco-design/web-react`
