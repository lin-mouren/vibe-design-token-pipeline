# AGENTS.md — Vibe Design ↔ Code Token Pipeline · Multi-Agent Orchestration Contract

## Role Registry

| Role | Responsibility | Gate Output |
|------|---------------|-------------|
| `vibe-design-system-foundry` | 5-stage pipeline DAG | All gates |
| `dtcg-evidence-freeze` | Lock source evidence | `EVIDENCE_FROZEN` |
| `dtcg-figma-sync` | Pull/push Figma tokens | `TOKENS_STUDIO_SYNCED` |
| `dtcg-tokens-studio-primary` | Tier 1 Git Sync primary path | `TOKENS_STUDIO_SYNCED` |
| `dtcg-ir-rehydration` | IR hydration from evidence | `IR_VALID` |
| `dtcg-sd-v5-migrator` | SD v4→v5 migration | `SD_V5_MIGRATED` |
| `dtcg-curation-editor` | **Human gate** — aesthetic + semantic review | `CANONICAL_VALID` |
| `dtcg-canonical-author` | Token authoring (4a-4e) | `CANONICAL_VALID` |
| `dtcg-component-contracts` | Component API contracts | Part of `CANONICAL_VALID` |
| `dtcg-resolver-author` | Multi-mode resolver | Part of `CANONICAL_VALID` |
| `dtcg-docs-projection` | SD config generation | `BUILD_VALID` |
| `dtcg-build-runner` | Style Dictionary build | `BUILD_VALID` |
| `dtcg-rule-files-author` | Rule file generation | `RULE_FILES_AUTHORED` |
| `dtcg-code-connect` | Code Connect bridge (Path B) | `CC_MAPPED` |
| `dtcg-ci-scaffolder` | CI gate YAML (JIT, after Button passes) | `CI_READY` |
| `dtcg-release-auditor` | Release gate audit | `RELEASE_COMPLETE` |

## Gate Dependency Graph

```
Phase 0:
  SD_V5_RISK_REGISTER → SD_V5_MIGRATED (Phase 1)
  CC_STRATEGY → CC_MAPPED (Phase 2)
  RULE_FILES_AUTHORED → Phase 2 start

Phase 1:
  TOKENS_STUDIO_SYNCED → IR_VALID → [human: CANONICAL_VALID] → BUILD_VALID

Phase 2:
  BUILD_VALID + RULE_FILES_AUTHORED + CC_STRATEGY → CC_MAPPED

Phase 3:
  CC_MAPPED → component implementation → Playwright tests pass

Phase 4:
  BUILD_VALID + Playwright pass → CI_READY → RELEASE_COMPLETE
```

## Current Stage Status (2026-03-30)

| Stage | Status |
|-------|--------|
| Phase 0 (all tasks) | COMPLETE |
| SD_V5_MIGRATED | COMPLETE |
| token-exploder + lint | COMPLETE |
| BUILD_VALID | COMPLETE (all 7 platforms) |
| RULE_FILES_AUTHORED | COMPLETE |
| CANONICAL_VALID | Pending human Stage 3 review |
| CC_MAPPED | Pending Phase 2 |

## Handoff Contracts

### vibe-design-system-foundry → sub-skills

The orchestrator sets stage context in `ir/stage-locks.json` before invoking each sub-skill.
Sub-skills read their gate prerequisites from `ir/stage-locks.json`.
Sub-skills write their gate outputs back to `ir/stage-locks.json`.

### Human gate (Stage 3 — dtcg-curation-editor)

Stage 3 is the **only** human-in-the-loop gate.
The agent's role at Stage 3: present a structured review surface (token diff, visual preview).
The human's role: approve aesthetic decisions and business-semantic choices.
**Agents must not bypass Stage 3** by auto-setting `CANONICAL_VALID = true`.

### Parallel execution policy

Stage 4a–4e (canonical authoring sub-stages) can run in parallel:
- 4a (primitive color) and 4b (primitive spacing) are independent
- 4c (semantic color) depends on 4a
- 4d (component contracts) depends on 4c
- 4e (alias index) depends on 4c and 4d

Stage 4f (resolver) depends on all of 4a–4e.
Stage 4g (docs + build) depends on 4f.

## Command Contract (F7 Ruling)

**All shell commands invoked by agents must use `npm run <script>` form.**

| Prohibited | Required equivalent |
|-----------|-------------------|
| `node scripts/token-exploder.js` | `npm run tokens:explode` |
| `node scripts/validate-dtcg.mjs` | `npm run validate:tokens` |
| `node figma/variables-sync/figma-to-dtcg.mjs` | `npm run figma:sync` |
| `node figma/variables-sync/dtcg-to-figma.mjs` | `npm run figma:push` |
| Standalone `npx style-dictionary build ...` | `npm run build` |

Exception: `npx` for one-off tool invocations not in package.json (e.g., version checks) are permitted.

## Error Escalation Protocol

| Error class | Handling |
|------------|---------|
| Gate prerequisite not met | ABORT with gate name and remediation instruction |
| Build failure | ABORT, report error class, do not retry silently |
| L1/L5 lint BLOCKING | ABORT, report violation path and token name |
| Class A SD probe failure | No-Go: escalate to human, do not auto-migrate |
| Figma API 403 | Expected for Student plan publish calls — log, proceed with Path B |
| Figma API 429 | Rate limit: wait 60s, retry once, then ABORT |

## stage-locks.json Schema (v2)

```json
{
  "schemaVersion": "2",
  "stages": {
    "<stage-name>": {
      "status": "complete | failed | pending",
      "completedAt": "<ISO8601>",
      "resettable": true,
      "notes": "<optional context>"
    }
  },
  "resetLog": [
    {
      "stage": "<stage-name>",
      "reason": "<human-readable reason>",
      "author": "<agent-name or human>",
      "at": "<ISO8601>"
    }
  ]
}
```

The `resetLog` provides audit trail for all manual gate resets.
Manual reset: edit `ir/stage-locks.json` directly and add a resetLog entry.
CLI reset: deferred to Phase 2 (not yet implemented).
