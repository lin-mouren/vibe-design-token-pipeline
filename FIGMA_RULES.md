# FIGMA_RULES.md — Figma Design Governance

## Figma Account Context

- Account: lybory (Student/Starter plan)
- Figma PAT: set via `FIGMA_API_KEY` environment variable (never commit)
- Figma MCP: connected via official Figma MCP server
- Code Connect publish: NOT available (requires Professional+, returns 403)
- Variables API write: NOT available (requires Enterprise)
- REST API read: Available (all plans)

## Design Token Sync Architecture

```
Figma Variables
    ↓ (Tokens Studio Git Sync — PULL direction)
figma/tokens-studio/tokens.json
    ↓ (npm run figma:sync)
source/tokens/**/*.tokens.json (DTCG format, canonical)
    ↓ (npm run build)
dist/ (CSS / SCSS / JS / Tailwind / iOS / Android)
    ↑ (npm run figma:push → Tokens Studio → PUSH direction, Stage 5 only)
Figma Variables (write-back)
```

## Figma Operations — Approved Actions

| Operation | Tool/Method | Constraint |
|-----------|-------------|-----------|
| Read design context | `mcp__figma__get_design_context` | Use node ID from URL |
| Get screenshots | `mcp__figma__get_screenshot` | Visual reference only |
| Search design system | `mcp__figma__search_design_system` | Read-only |
| Get variable definitions | `mcp__figma__get_variable_defs` | Read-only (Student plan) |
| Pull tokens via Git Sync | Tokens Studio plugin + `npm run figma:sync` | PULL before PUSH always |
| Push tokens via Git Sync | `npm run figma:push` | Only after `npm run validate && npm run build` pass |
| Create design system rules | `mcp__figma__create_design_system_rules` | Phase 2 only |
| Get metadata | `mcp__figma__get_metadata` | Read-only |

## Prohibited Figma Operations

- `mcp__figma__send_code_connect_mappings` — will return 403 (Student plan)
- Variables write via API — requires Enterprise plan
- Publishing Code Connect snippets — requires Professional+ plan with Dev Mode
- Deleting or renaming existing Figma variables without Git Sync pull first

## Token Naming in Figma

Figma variable names must align with DTCG token paths:
- DTCG: `color.brand.primary` → Figma: `color/brand/primary` (slash separator)
- DTCG: `spacing.4` → Figma: `spacing/4`
- Light/dark tokens: separate Figma variable collections (`Light` and `Dark` modes)

## Composite Tokens

- `$type: "shadow"` composites: 4 exist (special, level1, level2, level3)
- `$type: "typography"` composites: NOT present — do not create
- `$type: "composition"`: BANNED — never create in Figma or DTCG files

## MVP Component Mapping Strategy (Path B)

Code Connect is unavailable (Student plan). Design-code mapping uses:
- Source: `GET /v1/files/{key}/components` REST API
- Output: `figma/figma-to-react-map.json`
- Format per component:
  ```json
  {
    "figmaNodeId": "<node-id>",
    "variants": ["Primary", "Secondary", "Danger", "Ghost"],
    "props": ["size", "disabled", "loading"],
    "confidenceScore": 0.85,
    "mappingMethod": "rest-api-read",
    "mappedAt": "<ISO8601>"
  }
  ```
- Confidence targets: Button/Card/Badge 85%, Input/Toggle 80%

## File Key Management

The Figma file key is required for REST API calls:
- Environment variable: `FIGMA_FILE_KEY`
- Do NOT hardcode in scripts or skill files
- Source from Figma URL: `figma.com/design/{FILE_KEY}/...`
- Verify connectivity: `npm run gate:figma`

## Conflict Resolution (Git Sync)

When Git Sync produces merge conflicts:
- Git canonical values win
- Never accept Figma values over committed DTCG canonical work
- Follow PULL-before-PUSH protocol: always pull first, then push
