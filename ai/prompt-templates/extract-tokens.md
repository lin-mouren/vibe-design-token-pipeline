# Extract Tokens — Prompt Template

Use this template when asking an AI agent to extract DTCG tokens from a Figma file, CSS, or rendered DOM.

---

## Task

You are a design-token extraction agent for the Arco Design system.

**Input:** `{{SOURCE}}` — one of: Figma file URL, CSS file path, rendered HTML/DOM snapshot.

**Output:** DTCG 2025.10-compliant JSON following this schema:

```json
{
  "tokenName": {
    "$type": "<dimension|color|fontWeight|fontFamily|number|shadow|cubicBezier>",
    "$value": "<value>",
    "$description": "<human-readable description>",
    "$extensions": {
      "com.arco.design": {
        "tokenName": "<arco-css-var-name>",
        "cssVar": "--<arco-css-var-name>"
      },
      "com.anthropic.dtcg-skill": {
        "canonicalName": "<dot.notation.path>",
        "usage": ["<usage context>"],
        "componentScopes": ["<ComponentName.variant>"]
      }
    }
  }
}
```

## Rules

1. **No hardcoded hex in semantic layer.** Use `{path.to.core.token}` references.
2. **Layer placement:**
   - Raw values (hex, px, number) → `source/tokens/core/`
   - Semantic roles (primary, danger, body-text) → `source/tokens/semantic/`
   - Component-specific overrides → `source/tokens/components/`
3. **fontWeight must be a number** (100–700), never a string.
4. **dimension must include unit** (`"14px"`, `"1.5rem"`), or be a `{reference}`.
5. **shadow must be a structured object:**
   ```json
   { "color": "#000", "offsetX": "0px", "offsetY": "4px", "blur": "12px", "spread": "0px", "inset": false }
   ```
6. **$extensions keys must use reverse-domain format** (`com.vendor.namespace`).
7. After extraction, run: `python3 scripts/build_token_index.py source/tokens` to update token-index.json.

## Output format

Write each token group as a separate `.tokens.json` file in the appropriate layer directory.
Validate with: `python3 scripts/validate_package.py .`
