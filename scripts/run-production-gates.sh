#!/usr/bin/env bash
# run-production-gates.sh — 按顺序执行三个生产质量门
#
# 用法：
#   bash scripts/run-production-gates.sh
#   bash scripts/run-production-gates.sh --skip-figma   # 无 Figma 访问时跳过 Gate 1
#
# 退出码：0 = 全部通过，1 = 有门失败

set -euo pipefail

SKIP_FIGMA=false
for arg in "$@"; do
  [[ "$arg" == "--skip-figma" ]] && SKIP_FIGMA=true
done

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PASS=0
FAIL=0
SKIP=0
RESULTS=()

run_gate() {
  local name="$1"
  local cmd="$2"
  echo ""
  echo "────────────────────────────────────────"
  if eval "$cmd"; then
    RESULTS+=("PASS  $name")
    PASS=$((PASS + 1))
  else
    local exit_code=$?
    if [[ $exit_code -eq 2 ]]; then
      RESULTS+=("SKIP  $name")
      SKIP=$((SKIP + 1))
    else
      RESULTS+=("FAIL  $name")
      FAIL=$((FAIL + 1))
    fi
  fi
}

echo "========================================"
echo "  Arco Design — Production Gate Runner  "
echo "========================================"

# Gate 0: Package Validation (prerequisite)
echo ""
echo "────────────────────────────────────────"
echo "PRE-CHECK: validate_package.py"
python3 "$ROOT/scripts/validate_package.py" "$ROOT" || {
  echo "ABORT — package validation failed. Fix errors before running gates."
  exit 1
}

# Gate 1: Figma Gate
if [[ "$SKIP_FIGMA" == "true" ]]; then
  echo ""
  echo "────────────────────────────────────────"
  echo "SKIP  Gate 1: Figma Gate (--skip-figma)"
  RESULTS+=("SKIP  Gate 1: Figma Variable Binding Audit")
  SKIP=$((SKIP + 1))
else
  run_gate "Gate 1: Figma Variable Binding Audit" \
    "node '$ROOT/scripts/gates/gate-figma.mjs'"
fi

# Gate 2: Code Gate
run_gate "Gate 2: No Hardcoded Values / Semantic Layer" \
  "node '$ROOT/scripts/gates/gate-code.mjs'"

# Gate 3: Delivery Gate
run_gate "Gate 3: dist/ Artifacts + Manifest + Stories" \
  "node '$ROOT/scripts/gates/gate-delivery.mjs'"

# ── 결과 요약 ───────────────────────────────────────────────────────────────
echo ""
echo "========================================"
echo "  Gate Results"
echo "========================================"
for r in "${RESULTS[@]}"; do
  echo "  $r"
done
echo ""
echo "  PASS: $PASS  FAIL: $FAIL  SKIP: $SKIP"
echo "========================================"

if [[ $FAIL -gt 0 ]]; then
  echo "RELEASE BLOCKED — fix failing gates before publishing"
  exit 1
else
  echo "ALL GATES PASSED (skipped: $SKIP)"
  # Update delivery-manifest.json gateResults
  node - <<'EOF'
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
const p = resolve(process.cwd(), 'release/delivery-manifest.json');
const m = JSON.parse(readFileSync(p, 'utf8'));
m.gateResults.codeGate = 'PASS';
m.gateResults.deliveryGate = 'PASS';
m.timestamp = new Date().toISOString();
writeFileSync(p, JSON.stringify(m, null, 2));
console.log('  Updated release/delivery-manifest.json');
EOF
  exit 0
fi
