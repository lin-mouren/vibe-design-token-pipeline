# Arco Design System – Agent Guidelines

## Reading Order

When implementing UI using this design system, read files in this exact order:

1. **`tokens/token-index.json`** — flat fast-lookup index for all tokens
2. **`tokens/token-alias-map.json`** — canonical ↔ vendor alias resolution
3. **`guidelines/design-tokens/colors.md`** — color usage rules
4. **`guidelines/design-tokens/typography.md`** — text style rules
5. **`guidelines/design-tokens/radius.md`** — rounding rules
6. **`guidelines/components/button.md`** — if implementing buttons

## Critical Rules (Non-Negotiable)

1. **Semantic-first**: always prefer `text.primary`, `color.primary.default` over raw palette values like `palette.arcoblue.6`.
2. **No hardcoding**: never emit a literal `#165DFF` or `rgb(29,33,41)` in implementation. Look up the token.
3. **TOKEN_GAP**: if no token covers a requirement, emit `TOKEN_GAP(closest: <candidateTokenId>)` and explain why.
4. **Theme-aware**: use `themes/dark.tokens.json` overrides for dark mode — do not guess dark values.
5. **Evidence-anchored**: every token you use must trace to a real CSS variable from `arco.css`. Do not invent tokens.

## Anti-Hardcoding Checklist

Before returning any implementation, verify:
- [ ] No hardcoded color hex values that have a token equivalent
- [ ] No hardcoded pixel sizes for radius that have a token equivalent
- [ ] Semantic tokens used wherever available (`text.primary` not `palette.gray.10`)
- [ ] Dark mode overrides referenced from `themes/dark.tokens.json`

## Token_GAP Policy

When emitting TOKEN_GAP:
```
TOKEN_GAP: <semantic meaning>
Closest candidates: [tokenId1, tokenId2]
Reason: <why no exact match exists>
```
