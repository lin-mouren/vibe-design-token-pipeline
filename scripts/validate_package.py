#!/usr/bin/env python3
"""Validate a design-system package for required files, JSON syntax, and structural integrity.

USAGE (from SKILL.md Step 10):
    python scripts/validate_package.py <package-root>

INPUT:
    package_root — Path to the assembled design-system root directory.

OUTPUT:
    Prints PASSED or FAILED with itemized errors and warnings.
    Returns structured summary: file count, token count, TOKEN_GAP count, orphan aliases.

EXIT CODES:
    0 — validation passed (may have warnings)
    1 — validation failed (blocking errors found)
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

REQUIRED_FILES = [
    "source/tokens/token-index.json",
    "source/tokens/token-alias-map.json",
    "guidelines/Guidelines.md",
    "ai/design-system-rules.md",
    "reports/extraction-report.md",
    "reports/validation-report.md",
    "build/style-dictionary.config.mjs",
    "build/figma.config.json",
    "registries/component-registry.json",
    "registries/recipe-registry.json",
    "release/delivery-manifest.schema.json",
]

EXPECTED_TOKEN_DIRS = [
    "source/tokens/core/",
    "source/tokens/semantic/",
]

OPTIONAL_TOKEN_DIRS = [
    "source/tokens/components/",
    "source/tokens/themes/",
]

# Flat (non-compliant) $extensions keys that violate DTCG 2025.10 §8
FLAT_EXTENSION_KEYS = {"vendor", "ai", "source", "figma", "meta", "design"}

REF_RE = re.compile(r"\{([^{}]+)\}")


# ---------------------------------------------------------------------------
# Structural checks
# ---------------------------------------------------------------------------

def check_required_files(root: Path, errors: List[str]) -> None:
    for rel in REQUIRED_FILES:
        path = root / rel
        if not path.exists():
            errors.append(f"Missing required file: {rel}")
        elif path.stat().st_size == 0:
            errors.append(f"Required file is empty: {rel}")


def check_token_dirs(root: Path, warnings: List[str]) -> None:
    for prefix in EXPECTED_TOKEN_DIRS:
        dir_path = root / prefix
        if not dir_path.exists():
            warnings.append(f"Expected token directory missing: {prefix}")
        else:
            matches = list(dir_path.glob("*.json"))
            if not matches:
                warnings.append(f"No JSON files in expected directory: {prefix}")

    for prefix in OPTIONAL_TOKEN_DIRS:
        dir_path = root / prefix
        if dir_path.exists():
            matches = list(dir_path.glob("*.json"))
            if not matches:
                warnings.append(f"Optional directory exists but has no JSON files: {prefix}")


# ---------------------------------------------------------------------------
# JSON validity
# ---------------------------------------------------------------------------

_SKIP_DIRS = {"node_modules", ".git", "dist", "verification/storybook-dist"}

def validate_json_files(root: Path, errors: List[str]) -> Dict[str, Any]:
    """Validate all JSON files and return parsed content keyed by relative path."""
    parsed: Dict[str, Any] = {}
    for path in root.rglob("*.json"):
        rel = str(path.relative_to(root))
        # Skip generated/third-party directories
        parts = set(path.relative_to(root).parts)
        if parts & _SKIP_DIRS:
            continue
        try:
            content = json.loads(path.read_text(encoding="utf-8"))
            parsed[rel] = content
        except json.JSONDecodeError as exc:
            errors.append(f"Invalid JSON in {rel}: {exc}")
        except OSError as exc:
            errors.append(f"Cannot read {rel}: {exc}")
    return parsed


# ---------------------------------------------------------------------------
# TOKEN_GAP counter
# ---------------------------------------------------------------------------

def count_token_gaps(parsed: Dict[str, Any]) -> int:
    """Count TOKEN_GAP values across all token files."""
    count = 0
    skip = {
        "source/tokens/token-index.json",
        "source/tokens/token-alias-map.json",
    }
    for rel, content in parsed.items():
        if not rel.startswith("source/tokens/") or rel in skip:
            continue
        count += _count_gaps_recursive(content)
    return count


def _count_gaps_recursive(obj: Any) -> int:
    if isinstance(obj, str) and obj == "TOKEN_GAP":
        return 1
    if isinstance(obj, dict):
        return sum(_count_gaps_recursive(v) for v in obj.values())
    if isinstance(obj, list):
        return sum(_count_gaps_recursive(v) for v in obj)
    return 0


# ---------------------------------------------------------------------------
# Orphan alias check
# ---------------------------------------------------------------------------

def check_orphan_aliases(parsed: Dict[str, Any], warnings: List[str]) -> int:
    """Check if aliases in token-alias-map reference tokens that exist in token-index."""
    alias_map = parsed.get("source/tokens/token-alias-map.json", {})
    index = parsed.get("source/tokens/token-index.json", {})

    if not alias_map or not index:
        return 0

    index_ids: Set[str] = set()
    for token in index.get("tokens", []):
        if isinstance(token, dict):
            tid = token.get("id", "")
            if tid:
                index_ids.add(tid)

    orphan_count = 0
    aliases = alias_map.get("aliases", {})
    for vendor_name, paths in aliases.items():
        if isinstance(paths, list):
            for path in paths:
                if path not in index_ids and path != vendor_name:
                    orphan_count += 1

    if orphan_count > 0:
        warnings.append(f"Found {orphan_count} alias entries referencing unknown token IDs")

    return orphan_count


# ---------------------------------------------------------------------------
# Guidelines check
# ---------------------------------------------------------------------------

def check_guidelines_reading_order(root: Path, warnings: List[str]) -> None:
    """Check that Guidelines.md contains a reading order section."""
    guidelines = root / "guidelines" / "Guidelines.md"
    if guidelines.exists():
        content = guidelines.read_text(encoding="utf-8").lower()
        if "reading order" not in content and "read first" not in content:
            warnings.append("guidelines/Guidelines.md lacks a 'reading order' section")


# ---------------------------------------------------------------------------
# DTCG 2025.10 §6 — token type / value conformance
# ---------------------------------------------------------------------------

# Valid CSS-compatible unit suffixes for dimension values (DTCG 2025.10 §6.1)
_DIMENSION_UNITS = re.compile(r"^-?(\d*\.?\d+)(px|rem|em|ex|ch|vw|vh|vmin|vmax|%)$")

# fontWeight: must be a number 1–1000 OR a recognised keyword (DTCG 2025.10 §6.5)
_FONT_WEIGHT_KEYWORDS = {
    "thin", "hairline", "extra-light", "ultra-light", "light", "normal",
    "regular", "book", "medium", "semi-bold", "demibold", "bold",
    "extra-bold", "ultra-bold", "black", "heavy", "extra-black", "ultra-black",
}


def check_type_value_conformance(parsed: Dict[str, Any], errors: List[str]) -> int:
    """Check that $value matches the declared $type per DTCG 2025.10 §6.

    Checks covered:
      - fontWeight: must be int/float 1-1000 or a recognised keyword string
      - dimension:  must be a string matching {number}{unit}
      - number:     must be int or float (not a string)
      - shadow:     $value must be a dict (object), never a CSS string
    """
    violation_count = 0
    token_files = [
        rel for rel in parsed
        if rel.endswith(".tokens.json")
    ]
    for rel in token_files:
        violations = _check_token_tree(parsed[rel], rel, [])
        for path_str, msg in violations:
            errors.append(f"Type conformance — {rel} at {path_str}: {msg}")
            violation_count += 1
    return violation_count


def _check_token_tree(obj: Any, rel: str, path: List[str]) -> List[tuple]:
    results = []
    if not isinstance(obj, dict):
        return results

    if "$value" in obj and "$type" in obj:
        typ = obj["$type"]
        val = obj["$value"]
        path_str = ".".join(path) or "<root>"

        if typ == "fontWeight":
            if isinstance(val, str):
                if REF_RE.search(val):
                    pass  # {reference} values are valid — resolved at build time
                elif val.lower() not in _FONT_WEIGHT_KEYWORDS:
                    results.append((path_str,
                        f'fontWeight $value "{val}" is a string but must be a number (1-1000) or keyword'))
            elif isinstance(val, (int, float)):
                if not (1 <= val <= 1000):
                    results.append((path_str,
                        f'fontWeight $value {val} is out of range 1-1000'))

        elif typ == "dimension":
            if isinstance(val, str) and REF_RE.search(val):
                pass  # {reference} values are valid — resolved at build time
            elif not isinstance(val, str):
                results.append((path_str,
                    f'dimension $value must be a string like "4px", got {type(val).__name__}'))
            elif val != "0" and not _DIMENSION_UNITS.match(val):
                results.append((path_str,
                    f'dimension $value "{val}" does not match expected format {{number}}{{unit}}'))

        elif typ == "number":
            if isinstance(val, str):
                results.append((path_str,
                    f'number $value "{val}" is a string — must be a numeric literal'))

        elif typ == "shadow":
            if isinstance(val, str):
                if REF_RE.search(val):
                    pass  # {reference} values are valid — resolved at build time
                else:
                    results.append((path_str,
                        f'shadow $value is a CSS string — must be a structured object '
                        f'{{color, offsetX, offsetY, blur, spread, inset}}'))
            elif isinstance(val, list):
                for i, item in enumerate(val):
                    if not isinstance(item, dict):
                        results.append((f"{path_str}[{i}]",
                            "shadow array element must be an object"))

        return results

    for k, v in obj.items():
        if k.startswith("$"):
            continue
        results.extend(_check_token_tree(v, rel, path + [k]))
    return results


# ---------------------------------------------------------------------------
# DTCG 2025.10 §8 — $extensions namespace compliance
# ---------------------------------------------------------------------------

def check_extensions_namespace(parsed: Dict[str, Any], errors: List[str]) -> int:
    """Flag any token whose $extensions uses flat (non-namespaced) keys.

    DTCG 2025.10 §8: Extension keys SHOULD be reverse-domain namespaced
    (e.g. 'com.arco.design'). Keys like 'vendor', 'ai', 'figma', 'source'
    are flat and non-compliant.
    """
    violation_count = 0
    token_files = [
        rel for rel in parsed
        if rel.startswith("source/tokens/") and rel.endswith(".tokens.json")
    ]
    for rel in token_files:
        violations = _find_flat_extension_keys(parsed[rel], rel, [])
        for path_str, key in violations:
            errors.append(
                f"DTCG §8 violation — flat $extensions key '{key}' in {rel} at {path_str}"
            )
            violation_count += 1
    return violation_count


def _find_flat_extension_keys(
    obj: Any, rel: str, path: List[str]
) -> List[Tuple[str, str]]:
    """Recursively find tokens with flat $extensions keys."""
    results: List[Tuple[str, str]] = []
    if not isinstance(obj, dict):
        return results

    if "$extensions" in obj and isinstance(obj["$extensions"], dict):
        for key in obj["$extensions"]:
            # A valid key contains at least one dot (e.g. "com.arco.design")
            if "." not in key or key in FLAT_EXTENSION_KEYS:
                results.append((".".join(path) or "<root>", key))

    for k, v in obj.items():
        if k.startswith("$"):
            continue
        results.extend(_find_flat_extension_keys(v, rel, path + [k]))

    return results


# ---------------------------------------------------------------------------
# DTCG semantic layer enforcement
# ---------------------------------------------------------------------------

def check_semantic_layer(parsed: Dict[str, Any], errors: List[str]) -> int:
    """Enforce the core → semantic → component reference chain.

    Component tokens must NOT reference core/* or palette.* directly;
    they must go through semantic/. This is a blocking violation because
    it breaks the token ontology and causes semantic drift.
    """
    violation_count = 0
    component_files = [
        rel for rel in parsed
        if rel.startswith("source/tokens/components/") and rel.endswith(".tokens.json")
    ]
    # Paths that indicate a raw palette or core token reference
    FORBIDDEN_PREFIXES = ("palette.", "color.palette.", "core.", "arcoblue.", "gray.",
                          "red.", "orange.", "green.", "purple.", "cyan.", "gold.")

    for rel in component_files:
        refs = _collect_references(parsed[rel], [])
        for path_str, ref_target in refs:
            if any(ref_target.startswith(p) for p in FORBIDDEN_PREFIXES):
                errors.append(
                    f"Semantic layer violation — {rel} at {path_str} references "
                    f"core/palette token '{{{ref_target}}}' directly (must go through semantic/)"
                )
                violation_count += 1
    return violation_count


def _collect_references(obj: Any, path: List[str]) -> List[Tuple[str, str]]:
    """Collect all {reference} values from a token tree."""
    results: List[Tuple[str, str]] = []
    if not isinstance(obj, dict):
        return results

    if "$value" in obj:
        val = obj["$value"]
        if isinstance(val, str):
            for m in REF_RE.finditer(val):
                results.append((".".join(path) or "<root>", m.group(1)))
        elif isinstance(val, dict):
            # Composite value (e.g. shadow) — check nested references
            for nested_val in val.values():
                if isinstance(nested_val, str):
                    for m in REF_RE.finditer(nested_val):
                        results.append((".".join(path) or "<root>", m.group(1)))

    for k, v in obj.items():
        if k.startswith("$"):
            continue
        results.extend(_collect_references(v, path + [k]))

    return results


# ---------------------------------------------------------------------------
# Circular reference detection
# ---------------------------------------------------------------------------

def check_circular_references(parsed: Dict[str, Any], errors: List[str]) -> int:
    """Detect circular reference chains in the token alias graph.

    Builds a directed graph of {path} → resolved path edges,
    then detects cycles via DFS.
    """
    # Build flat token map: dot-path → $value string (or None)
    token_values: Dict[str, str] = {}
    token_files = [
        rel for rel in parsed
        if rel.startswith("source/tokens/") and rel.endswith(".tokens.json")
    ]
    for rel in token_files:
        _flatten_token_values(parsed[rel], [], token_values)

    # Build adjacency list for alias edges only
    graph: Dict[str, List[str]] = {}
    for dot_path, val in token_values.items():
        if isinstance(val, str):
            targets = [m.group(1) for m in REF_RE.finditer(val)]
            if targets:
                graph[dot_path] = targets

    # Detect cycles via DFS
    visited: Set[str] = set()
    in_stack: Set[str] = set()
    cycles_found = 0

    def dfs(node: str, stack: List[str]) -> bool:
        nonlocal cycles_found
        if node in in_stack:
            cycle_str = " → ".join(stack[stack.index(node):] + [node])
            errors.append(f"Circular reference detected: {cycle_str}")
            cycles_found += 1
            return True
        if node in visited:
            return False
        visited.add(node)
        in_stack.add(node)
        stack.append(node)
        for neighbor in graph.get(node, []):
            dfs(neighbor, stack)
        stack.pop()
        in_stack.discard(node)
        return False

    for node in list(graph.keys()):
        if node not in visited:
            dfs(node, [])

    return cycles_found


def _flatten_token_values(obj: Any, path: List[str], out: Dict[str, str]) -> None:
    """Flatten a nested token tree into dot-path → $value."""
    if not isinstance(obj, dict):
        return
    if "$value" in obj:
        val = obj["$value"]
        if isinstance(val, str):
            out[".".join(path)] = val
        return
    for k, v in obj.items():
        if k.startswith("$"):
            continue
        _flatten_token_values(v, path + [k], out)


# ---------------------------------------------------------------------------
# Dangling reference check
# ---------------------------------------------------------------------------

def check_dangling_references(parsed: Dict[str, Any], errors: List[str]) -> int:
    """Check that every {path.to.token} alias resolves to an existing token path."""
    # Build set of all known token dot-paths
    known_paths: Set[str] = set()
    token_files = [
        rel for rel in parsed
        if rel.startswith("source/tokens/") and rel.endswith(".tokens.json")
    ]
    for rel in token_files:
        _collect_dot_paths(parsed[rel], [], known_paths)

    # Check all references
    dangling_count = 0
    for rel in token_files:
        refs = _collect_references(parsed[rel], [])
        for path_str, ref_target in refs:
            if ref_target not in known_paths:
                errors.append(
                    f"Dangling reference — {rel} at {path_str} references "
                    f"'{{{ref_target}}}' which does not exist"
                )
                dangling_count += 1
    return dangling_count


def _collect_dot_paths(obj: Any, path: List[str], out: Set[str]) -> None:
    """Collect all token dot-paths (nodes that have a $value)."""
    if not isinstance(obj, dict):
        return
    if "$value" in obj:
        out.add(".".join(path))
        return
    for k, v in obj.items():
        if k.startswith("$"):
            continue
        _collect_dot_paths(v, path + [k], out)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate a design-system package (SKILL.md Step 10)"
    )
    parser.add_argument("package_root", help="Path to the design-system package root")
    args = parser.parse_args()

    root = Path(args.package_root).resolve()
    if not root.is_dir():
        print(f"ERROR: {root} is not a directory.", file=sys.stderr)
        return 1

    errors: List[str] = []
    warnings: List[str] = []

    # ── Structural checks ───────────────────────────────────────────────────
    check_required_files(root, errors)
    check_token_dirs(root, warnings)

    # ── JSON validity ───────────────────────────────────────────────────────
    parsed = validate_json_files(root, errors)

    # ── DTCG compliance checks (blocking) ───────────────────────────────────
    type_violations = check_type_value_conformance(parsed, errors)
    ext_violations = check_extensions_namespace(parsed, errors)
    semantic_violations = check_semantic_layer(parsed, errors)
    circular_count = check_circular_references(parsed, errors)
    dangling_count = check_dangling_references(parsed, errors)

    # ── Semantic checks ─────────────────────────────────────────────────────
    gap_count = count_token_gaps(parsed)
    orphan_count = check_orphan_aliases(parsed, warnings)
    check_guidelines_reading_order(root, warnings)

    # ── Token count ─────────────────────────────────────────────────────────
    index = parsed.get("source/tokens/token-index.json", {})
    token_count = len(index.get("tokens", [])) if isinstance(index, dict) else 0

    # ── Summary ─────────────────────────────────────────────────────────────
    print("=" * 60)
    if errors:
        print("Validation FAILED")
    else:
        print("Validation PASSED")
    print(f"  Total tokens in index:         {token_count}")
    print(f"  TOKEN_GAP count:               {gap_count}")
    print(f"  Orphan alias count:            {orphan_count}")
    print(f"  DTCG §6 type violations:        {type_violations}")
    print(f"  DTCG §8 ext violations:        {ext_violations}")
    print(f"  Semantic layer violations:     {semantic_violations}")
    print(f"  Circular references:           {circular_count}")
    print(f"  Dangling references:           {dangling_count}")
    print(f"  Errors (blocking):             {len(errors)}")
    print(f"  Warnings:                      {len(warnings)}")
    print("=" * 60)

    for item in errors:
        print(f"  ERROR: {item}")
    for item in warnings:
        print(f"  WARN:  {item}")

    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
