#!/usr/bin/env python3
"""Flatten DTCG-style token files into model-friendly lookup indexes.

USAGE (from SKILL.md Step 7):
    python scripts/build_token_index.py <tokens-directory>

INPUT:
    tokens_root — Path to the tokens/ directory containing authored .tokens.json files.

OUTPUT:
    <tokens_root>/token-index.json  — flat array of all tokens with vendor/AI metadata.
    <tokens_root>/token-alias-map.json — mapping from vendor names to canonical/alias paths.

    Both files are overwritten on each run.

EXIT CODES:
    0 — success (prints paths of written files)
    1 — no token files found, or read/write error

NOTES:
    - Skips token-index.json, token-alias-map.json, and tokens.resolved.*.json.
    - Recursively walks all *.json files under the tokens root.
    - Resolves single-hop {reference} values for the resolvedValue field.
    - Circular or missing references are left unresolved (original value preserved).
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, Tuple

REF_RE = re.compile(r"^\{([^{}]+)\}$")

SKIP_FILES = {
    "token-index.json",
    "token-alias-map.json",
    "tokens.resolved.light.json",
    "tokens.resolved.dark.json",
}


def load_json_files(root: Path) -> Dict[str, Any]:
    """Load all .json token files under root, skipping generated/derived files."""
    data: Dict[str, Any] = {}
    for path in sorted(root.rglob("*.json")):
        if path.name in SKIP_FILES:
            continue
        try:
            content = json.loads(path.read_text(encoding="utf-8"))
            data[str(path)] = content
        except json.JSONDecodeError as exc:
            print(f"WARN: skipping invalid JSON {path}: {exc}", file=sys.stderr)
        except OSError as exc:
            print(f"WARN: cannot read {path}: {exc}", file=sys.stderr)
    return data


def walk_tokens(obj: Any, prefix: Tuple[str, ...] = ()) -> Iterable[Tuple[Tuple[str, ...], Dict[str, Any]]]:
    """Recursively walk a DTCG token tree, yielding (path_tuple, token_dict) for leaf tokens."""
    if isinstance(obj, dict):
        if "$value" in obj or "value" in obj:
            yield prefix, obj
            return
        for key, value in obj.items():
            if key.startswith("$"):
                continue
            yield from walk_tokens(value, prefix + (key,))


def build_lookup(files: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
    """Build a flat lookup dictionary keyed by dot-separated token path."""
    lookup: Dict[str, Dict[str, Any]] = {}
    for path, content in files.items():
        for token_path, token in walk_tokens(content):
            key = ".".join(token_path)
            extensions = token.get("$extensions", token.get("extensions", {}))
            if not isinstance(extensions, dict):
                extensions = {}
            lookup[key] = {
                "file": path,
                "path": key,
                "type": token.get("$type") or token.get("type"),
                "value": token.get("$value", token.get("value")),
                "description": token.get("$description", token.get("description", "")),
                "extensions": extensions,
            }
    return lookup


def resolve_value(raw: Any, lookup: Dict[str, Dict[str, Any]], seen: set[str] | None = None) -> Any:
    """Resolve a single-hop {reference} to its literal value. Returns original on cycle or miss."""
    if not isinstance(raw, str):
        return raw
    match = REF_RE.match(raw)
    if not match:
        return raw
    key = match.group(1)
    if seen is None:
        seen = set()
    if key in seen or key not in lookup:
        return raw
    seen.add(key)
    return resolve_value(lookup[key]["value"], lookup, seen)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Build token-index.json and token-alias-map.json (SKILL.md Step 7)"
    )
    parser.add_argument("tokens_root", help="Path to the tokens/ directory")
    args = parser.parse_args()

    root = Path(args.tokens_root).resolve()
    if not root.is_dir():
        print(f"ERROR: {root} is not a directory.", file=sys.stderr)
        return 1

    files = load_json_files(root)
    if not files:
        print(f"ERROR: no valid JSON token files found under {root}.", file=sys.stderr)
        return 1

    lookup = build_lookup(files)
    if not lookup:
        print(f"ERROR: no tokens found in any JSON files under {root}.", file=sys.stderr)
        return 1

    index: dict[str, Any] = {"version": "0.1.0", "tokens": []}
    alias_map: dict[str, Any] = {"aliases": {}}

    for key in sorted(lookup):
        entry = lookup[key]
        ext = entry["extensions"] if isinstance(entry["extensions"], dict) else {}

        # DTCG 2025.10 §8: keys must be reverse-domain namespaced.
        # Support both the canonical namespaced keys and the legacy flat keys
        # so the script works with any compliant package.
        vendor = (
            ext.get("com.arco.design")
            or ext.get("com.shopify.polaris")
            or ext.get("com.atlassian.design")
            or ext.get("vendor")   # legacy fallback — non-compliant
            or {}
        )
        if not isinstance(vendor, dict):
            vendor = {}

        ai = (
            ext.get("com.anthropic.dtcg-skill")
            or ext.get("ai")       # legacy fallback — non-compliant
            or {}
        )
        if not isinstance(ai, dict):
            ai = {}

        vendor_name = vendor.get("tokenName", key)
        canonical_name = ai.get("canonicalName")

        # Build alias set
        aliases: list[str] = []
        if canonical_name:
            aliases.append(canonical_name)
        aliases.extend(ai.get("aliases", []))
        alias_map["aliases"][vendor_name] = sorted(set([key, *aliases]))

        index["tokens"].append({
            "id": key,
            "vendorName": vendor_name,
            "canonicalName": canonical_name,
            "type": entry["type"],
            "value": entry["value"],
            "resolvedValue": resolve_value(entry["value"], lookup),
            "description": entry["description"],
            "cssVar": vendor.get("cssVar"),
            "usage": ai.get("usage", []),
            "doNotUseFor": ai.get("avoid", []),
            "componentScopes": ai.get("componentScopes", []),
            "confidence": ai.get("confidence", "high"),
            "sourceFile": Path(entry["file"]).name,
        })

    try:
        index_path = root / "token-index.json"
        index_path.write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

        alias_path = root / "token-alias-map.json"
        alias_path.write_text(json.dumps(alias_map, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    except OSError as exc:
        print(f"ERROR: cannot write output files: {exc}", file=sys.stderr)
        return 1

    print(f"Wrote {index_path}  ({len(index['tokens'])} tokens)")
    print(f"Wrote {alias_path}  ({len(alias_map['aliases'])} entries)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
