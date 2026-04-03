# Token Authoring Rules

These rules govern how to add, modify, deprecate, and sync Arco Design tokens. Violating them causes `validate_package.py` failures.

---

## Adding a token

1. **Determine the layer:**
   - `source/tokens/core/` — raw values only (hex, px, number literals)
   - `source/tokens/semantic/` — role aliases referencing core tokens via `{path.to.token}`
   - `source/tokens/components/` — component-scoped overrides referencing semantic tokens

2. **DTCG required fields:** `$type`, `$value`. Optional but expected: `$description`.

3. **$extensions format** — must use reverse-domain keys:
   ```json
   "$extensions": {
     "com.arco.design": { "tokenName": "...", "cssVar": "--..." },
     "com.anthropic.dtcg-skill": { "canonicalName": "...", "usage": [], "componentScopes": [] }
   }
   ```

4. **$type constraints:**
   - `dimension` — `$value` must be `"{number}{unit}"` or `{reference}`
   - `fontWeight` — `$value` must be a **number** 1–1000, not a string
   - `color` — `$value` must be a hex string or `{reference}`
   - `shadow` — `$value` must be a structured object with keys: `color, offsetX, offsetY, blur, spread, inset`
   - `number` — `$value` must be a numeric literal

5. **Cross-layer references:** semantic can reference core; component can reference semantic. Direct component→core references are a violation.

6. **After adding:** run `python3 scripts/build_token_index.py source/tokens` to regenerate `token-index.json` and `token-alias-map.json`. Never hand-edit these generated files.

7. **Validate:** `python3 scripts/validate_package.py .` — must exit 0 before committing.

---

## Modifying a token

- **Value change (non-breaking):** Update `$value` in the source file. Regenerate index. Bump patch version.
- **Rename (breaking):** Keep the old name as a deprecated alias pointing to the new name via `{reference}`. Add a migration note in `docs/token-migration-notes.md`.
- **$type change (breaking):** Treat as a rename + deprecation cycle.

---

## Deprecating a token

1. Add `"$description"` note: `"DEPRECATED — use {new.token.path} instead"`
2. Add to `docs/token-migration-notes.md` with removal target version
3. Keep the token in source until the next major version to avoid breaking consuming codebases
4. In `token-alias-map.json`, ensure the deprecated name still maps to the new canonical path

---

## Sync rules

| Action | Who runs it | When |
|---|---|---|
| Regenerate `token-index.json` | CI (build job) | Every commit touching `source/tokens/` |
| Figma Variable sync (push) | `node figma/variables-sync/dtcg-to-figma.mjs` | On release only |
| Figma Variable sync (pull) | `node figma/variables-sync/figma-to-dtcg.mjs` | On Figma audit milestone |
| Style Dictionary build | `npm run build` | Every commit (CI) |

**Single source of truth:** `source/tokens/` is canonical. Never edit `dist/`, `token-index.json`, or Figma Variables directly — always edit source files and let the pipeline propagate.
