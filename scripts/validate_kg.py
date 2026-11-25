"""Validate MPCE Knowledge Graph consistency (registered IDs, references, and DAG acyclicity).

Usage:
    python scripts/validate_kg.py
"""
from __future__ import annotations

import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
KG_DIR = ROOT / "06_knowledge_graph"
LAYER_FILES = [
    KG_DIR / "mathematics_graph.md",
    KG_DIR / "physics_graph.md",
    KG_DIR / "computational_graph.md",
    KG_DIR / "engineering_graph.md",
]
MASTER_FILE = ROOT / "KNOWLEDGE_GRAPH.md"

HEADING_RE = re.compile(r"^###\s+((?:MATH|PHYS|ENG)-[A-Z]+-\d{2}|COMP-\d{2})\b", re.MULTILINE)
ID_RE = re.compile(r"\b((?:MATH|PHYS|ENG)-[A-Z]+-\d{2}|COMP-\d{2})\b")
PREREQ_LINE_RE = re.compile(r"^\s*-\s+\*\*Prerequisites.*?\*\*[:：]?(.*)$", re.IGNORECASE)


def main() -> int:
    defined: dict[str, str] = {}
    prereqs: dict[str, list[str]] = defaultdict(list)
    errors: list[str] = []

    for path in LAYER_FILES:
        if not path.exists():
            errors.append(f"Missing layer file: {path}")
            continue
        text = path.read_text(encoding="utf-8")
        current_id: str | None = None
        for line in text.splitlines():
            m = HEADING_RE.match(line)
            if m:
                node_id = m.group(1)
                if node_id in defined:
                    errors.append(f"Duplicate node ID {node_id} in {path.name} and {defined[node_id]}")
                defined[node_id] = path.name
                current_id = node_id
                continue
            if current_id:
                pm = PREREQ_LINE_RE.match(line)
                if pm:
                    prereqs[current_id].extend(ID_RE.findall(pm.group(1)))

    # Check all referenced IDs exist
    all_files = LAYER_FILES + [MASTER_FILE]
    used: set[str] = set()
    for path in all_files:
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        for m in ID_RE.finditer(text):
            used.add(m.group(1))

    missing = sorted(used - set(defined.keys()))
    if missing:
        errors.append(f"Referenced but unregistered IDs: {missing}")

    # Cycle detection in Prerequisites DAG
    color: dict[str, int] = {}  # 0=unvisited, 1=visiting, 2=done

    def dfs(node: str, stack: list[str]) -> None:
        color[node] = 1
        for dep in prereqs.get(node, []):
            if dep not in defined:
                continue
            state = color.get(dep, 0)
            if state == 1:
                cycle = stack[stack.index(dep):] + [dep]
                errors.append(f"Prerequisite cycle detected: {' -> '.join(cycle)}")
            elif state == 0:
                dfs(dep, stack + [dep])
        color[node] = 2

    for nid in sorted(defined.keys()):
        if color.get(nid, 0) == 0:
            dfs(nid, [nid])

    print(f"Registered nodes: {len(defined)}")
    print(f"Unique referenced IDs: {len(used)}")
    if errors:
        print("VALIDATION FAILED:")
        for e in errors:
            print(f"  - {e}")
        return 1

    print("VALIDATION PASSED: all IDs registered and prerequisite graph is acyclic.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
