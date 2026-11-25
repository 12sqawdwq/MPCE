"""Generate the README panoramic SVG of the MPCE 5-layer board.

Single source of truth is the interactive board config
``site/src/data/boardConfig.ts`` (layers, cards, KG nodes, cross-layer edges).
This script parses it, validates the taxonomy against ``06_knowledge_graph``,
and renders ``assets/diagrams/mpce_math_physics_engineering_map.svg``.

Usage:
    python scripts/gen_panorama_svg.py            # validate + write SVG
    python scripts/gen_panorama_svg.py --check    # validate only

Validation (non-zero exit on failure):
    * layer sizes are 4 / 8 / 7 / 8 / 7;
    * every KG node defined in 06_knowledge_graph/*.md is claimed by a card,
      and every card KG id is a defined node;
    * edges only join adjacent layers (L_k -> L_k+1), with no duplicates;
    * every L1 card has outgoing edges, every L2–L4 card has incoming and
      outgoing edges, and every L5 card has incoming edges.
"""
from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass, field
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BOARD_CONFIG = ROOT / "site" / "src" / "data" / "boardConfig.ts"
KG_DIR = ROOT / "06_knowledge_graph"
OUT_SVG = ROOT / "assets" / "diagrams" / "mpce_math_physics_engineering_map.svg"

EXPECTED_SIZES = {"L1": 4, "L2": 8, "L3": 7, "L4": 8, "L5": 7}
PILLAR_TEXT = "数学驱动物理与工程实践"

KG_HEADING_RE = re.compile(r"^###\s+((?:MATH|PHYS|ENG)-[A-Z]+-\d{2}|COMP-\d{2})\b", re.MULTILINE)


# ---------------------------------------------------------------------------
# Parsing
# ---------------------------------------------------------------------------
@dataclass
class Card:
    id: str
    layer: str
    title: str
    subtitle: str
    kg: list[str]


@dataclass
class Layer:
    id: str
    title: str
    subtitle: str
    color: str
    tint: str
    border: str
    cards: list[Card] = field(default_factory=list)


def _field(block: str, name: str) -> str:
    m = re.search(rf"^\s*{name}:\s*'([^']*)'", block, re.MULTILINE)
    if not m:
        raise ValueError(f"field {name!r} not found in block:\n{block[:200]}")
    return m.group(1)


def parse_board(path: Path) -> tuple[list[Layer], list[tuple[str, str]]]:
    src = path.read_text(encoding="utf-8")
    start = src.index("export const LAYERS")
    end = src.index("export const EDGES")
    layers_src = src[start:end]
    edges_src = src[end : src.index("\n]\n", end) + 2]  # up to the closing `]` of EDGES

    layers: list[Layer] = []
    # Split on layer headers: `id: 'L1'` at 4-space indent.
    parts = re.split(r"(?m)^    id: '(L\d)',$", layers_src)
    for lid, body in zip(parts[1::2], parts[2::2]):
        head = body.split("cards:", 1)[0]
        layer = Layer(
            id=lid,
            title=_field(head, "title"),
            subtitle=_field(head, "subtitle"),
            color=_field(head, "color"),
            tint=_field(head, "tint"),
            border=_field(head, "border"),
        )
        for cm in re.finditer(r"(?ms)^      \{\n(.*?)^      \},?$", body):
            block = cm.group(1)
            kg_m = re.search(r"kgNodes:\s*\[([^\]]*)\]", block)
            layer.cards.append(
                Card(
                    id=_field(block, "id"),
                    layer=_field(block, "layer"),
                    title=_field(block, "title"),
                    subtitle=_field(block, "subtitle"),
                    kg=re.findall(r"'([^']+)'", kg_m.group(1)) if kg_m else [],
                )
            )
        layers.append(layer)

    edges = re.findall(r"\[\s*'(l\d-[\w-]+)',\s*'(l\d-[\w-]+)'\s*\]", edges_src)
    return layers, edges


def kg_nodes() -> set[str]:
    ids: set[str] = set()
    for f in sorted(KG_DIR.glob("*_graph.md")):
        ids.update(KG_HEADING_RE.findall(f.read_text(encoding="utf-8")))
    return ids


# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------
def validate(layers: list[Layer], edges: list[tuple[str, str]]) -> list[str]:
    errors: list[str] = []
    sizes = {l.id: len(l.cards) for l in layers}
    if sizes != EXPECTED_SIZES:
        errors.append(f"layer sizes {sizes} != expected {EXPECTED_SIZES}")

    cards = {c.id: c for l in layers for c in l.cards}
    for l in layers:
        for c in l.cards:
            if c.layer != l.id:
                errors.append(f"{c.id}: layer field {c.layer} but listed under {l.id}")

    defined = kg_nodes()
    claimed = {k for c in cards.values() for k in c.kg}
    if missing := sorted(defined - claimed):
        errors.append(f"KG nodes not covered by any card: {missing}")
    if unknown := sorted(claimed - defined):
        errors.append(f"cards reference undefined KG nodes: {unknown}")

    order = {l.id: i for i, l in enumerate(layers)}
    seen: set[tuple[str, str]] = set()
    out_deg = {cid: 0 for cid in cards}
    in_deg = {cid: 0 for cid in cards}
    for a, b in edges:
        if (a, b) in seen:
            errors.append(f"duplicate edge {a} -> {b}")
        seen.add((a, b))
        if a not in cards or b not in cards:
            errors.append(f"edge references unknown card: {a} -> {b}")
            continue
        if order[cards[b].layer] != order[cards[a].layer] + 1:
            errors.append(f"edge {a} -> {b} does not join adjacent layers")
        out_deg[a] += 1
        in_deg[b] += 1

    last = layers[-1].id
    first = layers[0].id
    for cid, c in cards.items():
        if c.layer != last and out_deg[cid] == 0:
            errors.append(f"{cid} has no outgoing edge")
        if c.layer != first and in_deg[cid] == 0:
            errors.append(f"{cid} has no incoming edge")

    if not errors:
        print(
            f"OK: {len(cards)} cards ({' / '.join(str(sizes[l.id]) for l in layers)}), "
            f"{len(claimed & defined)}/{len(defined)} KG nodes covered, {len(edges)} edges"
        )
    return errors


# ---------------------------------------------------------------------------
# Rendering
# ---------------------------------------------------------------------------
W = 1380
MARGIN = 20
PILLAR_W = 54
PILLAR_GAP = 14
BAND_X = MARGIN
BAND_W = W - 2 * MARGIN - PILLAR_W - PILLAR_GAP  # 1272
LABEL_W = 150
COLS = 4
CARD_GAP_X = 12
CARD_GAP_Y = 12
BAND_PAD_X = 14
BAND_PAD_Y = 12
BAND_GAP = 40  # inter-band gap holding the flow chevrons
CARD_PAD_X = 10

TITLE_FS = 13.0
SUB_FS = 10.5
SUB_LH = 14.0


def text_width(s: str, fs: float) -> float:
    """Rough rendered width: CJK / full-width glyphs ~1em, Latin ~0.56em."""
    w = 0.0
    for ch in s:
        o = ord(ch)
        if o >= 0x2E80 or ch in "（）：、，。":
            w += fs
        elif ch == " ":
            w += fs * 0.3
        elif ch in "·–—":
            w += fs * 0.6
        elif ch.isupper() or ch.isdigit():
            w += fs * 0.64
        else:
            w += fs * 0.52
    return w


def wrap_sub(sub: str, max_w: float) -> list[str]:
    """Wrap a subtitle at its ` · ` separators (never mid-word)."""
    if text_width(sub, SUB_FS) <= max_w:
        return [sub]
    pieces = sub.split(" · ")
    lines: list[str] = []
    cur = ""
    for p in pieces:
        cand = f"{cur} · {p}" if cur else p
        if cur and text_width(cand, SUB_FS) > max_w:
            lines.append(cur)
            cur = p
        else:
            cur = cand
    lines.append(cur)
    return lines


def render(layers: list[Layer], edges: list[tuple[str, str]]) -> str:
    grid_x0 = BAND_X + LABEL_W + BAND_PAD_X
    grid_w = BAND_W - LABEL_W - 2 * BAND_PAD_X
    card_w = (grid_w - (COLS - 1) * CARD_GAP_X) / COLS
    inner_w = card_w - 2 * CARD_PAD_X

    # Pre-wrap subtitles and size each layer's cards uniformly.
    wrapped: dict[str, list[str]] = {}
    for l in layers:
        for c in l.cards:
            if text_width(c.title, TITLE_FS) > inner_w:
                raise SystemExit(f"title would clip: {c.id} {c.title!r}")
            lines = wrap_sub(c.subtitle, inner_w)
            for ln in lines:
                if text_width(ln, SUB_FS) > inner_w:
                    raise SystemExit(f"subtitle line would clip: {c.id} {ln!r}")
            wrapped[c.id] = lines
    max_sub_lines = max(len(v) for v in wrapped.values())
    card_h = 18 + TITLE_FS + 8 + max_sub_lines * SUB_LH + 6

    edge_counts: dict[str, int] = {}
    layer_of = {c.id: l.id for l in layers for c in l.cards}
    for a, b in edges:
        k = f"{layer_of[a]}>{layer_of[b]}"
        edge_counts[k] = edge_counts.get(k, 0) + 1

    out: list[str] = []
    y = MARGIN
    bands: list[tuple[Layer, float, float]] = []
    for l in layers:
        rows = -(-len(l.cards) // COLS)
        h = 2 * BAND_PAD_Y + rows * card_h + (rows - 1) * CARD_GAP_Y
        bands.append((l, y, h))
        y += h + BAND_GAP
    stack_bottom = y - BAND_GAP
    footer_y = stack_bottom + 26
    H = int(footer_y + 14)

    n_cards = sum(len(l.cards) for l in layers)
    n_kg = len({k for l in layers for c in l.cards for k in c.kg})
    aria = (
        f"MPCE 五层架构全景（{' / '.join(str(len(l.cards)) for l in layers)} = {n_cards} 张卡片，"
        f"覆盖 {n_kg} 个知识图谱节点）：" + " → ".join(l.title for l in layers)
    )

    out.append(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
        f'role="img" aria-label="{escape(aria)}">'
    )
    out.append(
        """  <defs>
    <style>
      text { font-family: 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .lid { font-size: 10px; font-weight: 800; fill: #ffffff; text-anchor: middle; letter-spacing: 0.08em; }
      .lt { font-size: 14px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
      .ls { font-size: 10.5px; fill: #ffffff; fill-opacity: 0.88; text-anchor: middle; }
      .lc { font-size: 10px; fill: #ffffff; fill-opacity: 0.75; text-anchor: middle; }
      .ct { font-size: 13px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
      .cs { font-size: 10.5px; fill: #475569; text-anchor: middle; }
      .chev { fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; stroke-opacity: 0.6; }
      .fl { font-size: 11px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
      .pt { font-size: 16px; font-weight: 700; fill: #b91c1c; text-anchor: middle; }
      .ft { font-size: 11px; fill: #64748b; text-anchor: middle; }
    </style>
  </defs>"""
    )
    out.append(f'  <rect width="{W}" height="{H}" fill="#ffffff"/>')

    for l, by, bh in bands:
        x0, x1 = BAND_X, BAND_X + LABEL_W
        r = 10
        out.append(f'  <g id="{l.id}">')
        out.append(f'    <rect x="{BAND_X}" y="{by:.1f}" width="{BAND_W}" height="{bh:.1f}" rx="{r}" fill="{l.tint}"/>')
        out.append(
            f'    <path d="M{x0 + r},{by:.1f} H{x1} V{by + bh:.1f} H{x0 + r} '
            f'A{r},{r} 0 0 1 {x0},{by + bh - r:.1f} V{by + r:.1f} A{r},{r} 0 0 1 {x0 + r},{by:.1f} z" fill="{l.color}"/>'
        )
        out.append(
            f'    <rect x="{BAND_X}" y="{by:.1f}" width="{BAND_W}" height="{bh:.1f}" rx="{r}" '
            f'fill="none" stroke="{l.border}" stroke-width="1.5"/>'
        )
        cx = x0 + LABEL_W / 2
        # Long layer titles split across two lines at a natural boundary.
        title_lines = [l.title]
        if text_width(l.title, 14) > LABEL_W - 16:
            mid = l.title.find("与") if "与" in l.title else len(l.title) // 2
            title_lines = [l.title[:mid], l.title[mid:]]
        sub_lines = [l.subtitle]
        if text_width(l.subtitle, 10.5) > LABEL_W - 16:
            words = l.subtitle.split(" & ")
            sub_lines = [words[0] + " &", words[1]] if len(words) == 2 else [l.subtitle]
        # Vertical stack: pill (16) · 8 · titles (17 each) · 2 · subs (13 each) · 3 · count (13)
        block = 16 + 8 + 17 * len(title_lines) + 2 + 13 * len(sub_lines) + 3 + 13
        top = by + (bh - block) / 2
        out.append(f'    <rect x="{cx - 14:.1f}" y="{top:.1f}" width="28" height="16" rx="8" fill="#ffffff" fill-opacity="0.22"/>')
        out.append(f'    <text class="lid" x="{cx:.1f}" y="{top + 11.5:.1f}">{l.id}</text>')
        yy = top + 16 + 8
        for tl in title_lines:
            yy += 17
            out.append(f'    <text class="lt" x="{cx:.1f}" y="{yy - 4:.1f}">{escape(tl)}</text>')
        yy += 2
        for sl in sub_lines:
            yy += 13
            out.append(f'    <text class="ls" x="{cx:.1f}" y="{yy - 3:.1f}">{escape(sl)}</text>')
        yy += 3 + 13
        out.append(f'    <text class="lc" x="{cx:.1f}" y="{yy - 3:.1f}">{len(l.cards)} 张卡片</text>')

        for i, c in enumerate(l.cards):
            row, col = divmod(i, COLS)
            x = grid_x0 + col * (card_w + CARD_GAP_X)
            yy = by + BAND_PAD_Y + row * (card_h + CARD_GAP_Y)
            mx = x + card_w / 2
            subs = wrapped[c.id]
            block_h = TITLE_FS + 8 + len(subs) * SUB_LH
            t_y = yy + (card_h - block_h) / 2 + TITLE_FS
            out.append(
                f'    <rect x="{x:.1f}" y="{yy:.1f}" width="{card_w:.1f}" height="{card_h:.1f}" rx="9" '
                f'fill="#ffffff" stroke="{l.color}" stroke-opacity="0.55" stroke-width="1.3"/>'
            )
            out.append(f'    <text class="ct" x="{mx:.1f}" y="{t_y:.1f}">{escape(c.title)}</text>')
            for j, s in enumerate(subs):
                out.append(f'    <text class="cs" x="{mx:.1f}" y="{t_y + 8 + (j + 1) * SUB_LH - 3:.1f}">{escape(s)}</text>')
        out.append("  </g>")

    # Downward flow chevrons + edge-count label in each inter-band gap.
    col_w = grid_w / COLS
    for (ua, uy, uh), (lb, ly, _) in zip(bands, bands[1:]):
        gy = (uy + uh + ly) / 2
        out.append(f'  <g id="flow-{ua.id}-{lb.id}">')
        for c in range(COLS):
            x = grid_x0 + col_w * (c + 0.5)
            out.append(
                f'    <path class="chev" stroke="{ua.color}" d="M{x - 9:.1f},{gy - 5:.1f} L{x:.1f},{gy + 5:.1f} L{x + 9:.1f},{gy - 5:.1f}"/>'
            )
        label = f"{ua.id} → {lb.id} · {edge_counts.get(f'{ua.id}>{lb.id}', 0)} 条依赖"
        out.append(f'    <text class="fl" fill="{ua.color}" x="{grid_x0 + grid_w / 2:.1f}" y="{gy:.1f}">{escape(label)}</text>')
        out.append("  </g>")

    # Right cross-cutting crimson pillar.
    px = W - MARGIN - PILLAR_W
    ph = stack_bottom - MARGIN
    out.append(f'  <rect x="{px}" y="{MARGIN}" width="{PILLAR_W}" height="{ph:.1f}" rx="10" fill="#fef2f2" stroke="#dc2626" stroke-width="1.5"/>')
    step = 32
    y0 = MARGIN + ph / 2 - step * (len(PILLAR_TEXT) - 1) / 2 + 6
    for i, ch in enumerate(PILLAR_TEXT):
        out.append(f'  <text class="pt" x="{px + PILLAR_W / 2:.1f}" y="{y0 + i * step:.1f}">{ch}</text>')

    out.append(
        f'  <text class="ft" x="{BAND_X + BAND_W / 2:.1f}" y="{footer_y:.1f}">'
        f"{n_cards} 张卡片 · 覆盖知识图谱全部 {n_kg} 个节点 · {len(edges)} 条相邻层依赖（交互版：悬停卡片显示完整上下游曲线）</text>"
    )
    out.append("</svg>")
    return "\n".join(out) + "\n"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--check", action="store_true", help="validate only, do not write the SVG")
    ap.add_argument("-o", "--output", type=Path, default=OUT_SVG)
    args = ap.parse_args()

    layers, edges = parse_board(BOARD_CONFIG)
    errors = validate(layers, edges)
    if errors:
        for e in errors:
            print(f"ERROR: {e}", file=sys.stderr)
        return 1
    if args.check:
        return 0
    svg = render(layers, edges)
    args.output.write_text(svg, encoding="utf-8", newline="\n")
    print(f"wrote {args.output.relative_to(ROOT) if args.output.is_relative_to(ROOT) else args.output}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
