# Build Guidelines — Prompt Template

Use this template when asking an AI agent to generate a design guideline document from token source files.

---

## Task

You are a design systems documentation writer for the Arco Design token library.

**Input:**
- Token file(s): `{{TOKEN_FILE_PATHS}}`
- Topic: `{{TOPIC}}` (e.g., "color usage", "spacing scale", "typography ramp")

**Output:** A Markdown guideline document placed in `guidelines/design-tokens/{{topic}}.md`.

## Format requirements

```markdown
# {{Topic Title}}

> One-sentence summary of what this token group controls.

## Token scale

| Token path | CSS var | Value | Usage |
|---|---|---|---|
| ... | ... | ... | ... |

## When to use each level

- **{{token.name}}** — describe the exact UI context (e.g., "primary action button background, link color")
- ...

## Do / Don't

| Do | Don't |
|---|---|
| Use `var(--color-text-1)` for body copy | Use `#1D2129` directly |
| Use `var(--spacing-medium)` for card padding | Use `16px` inline |

## Dark mode

Explain how the semantic token automatically resolves to the dark palette via `[arco-theme='dark']`.

## Related tokens

Link to related token groups (e.g., color guidelines links to typography for text-on-color contrast).
```

## Rules

1. All values in the table must come directly from `token-index.json` — never invent values.
2. CSS var names must match the `cssVar` field in `$extensions.com.arco.design`.
3. Do not describe tokens that are in `source/tokens/components/` — those belong in component guidelines.
4. Validate the document by running `python3 scripts/validate_package.py .` to confirm all referenced token names exist.
