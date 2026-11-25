import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BookOpen,
  CheckCircle2,
  Compass,
  Download,
  FlaskConical,
  GitBranch,
  MapPin,
  Upload,
  X,
} from 'lucide-react'
import {
  ALL_CARDS,
  BoardCard,
  CARD_BY_ID,
  DOWNSTREAM,
  EDGES,
  LAYER_BY_ID,
  LAYERS,
  MasteryStatus,
  PILLAR_TEXT,
  STATUS_META,
  UPSTREAM,
  computeLineage,
  edgeKey,
} from '../data/boardConfig'

interface Props {
  getStatus: (id: string) => MasteryStatus
  setStatus: (id: string, next: MasteryStatus) => void
  cycleStatus: (id: string) => void
  currentCardId: string
  setCurrentCardId: (id: string) => void
  summary: Record<MasteryStatus, number>
  total: number
  exportJson: () => void
  importJson: (file: File) => void
  /** Chrome-less mode for `#/embed`: wiki/graph links open in the top window. */
  embedded?: boolean
}

const BASE = import.meta.env.BASE_URL // '/MPCE/'
const wikiRoute = (docPath: string) => `/wiki/${encodeURI(docPath)}`
const graphRoute = (kgId: string) => `/graph?q=${encodeURIComponent(kgId)}`

const UP_COLOR = '#4f46e5'
const DOWN_COLOR = '#ea580c'
const IDLE_COLOR = '#64748b'

interface Anchor {
  x: number
  top: number
  bottom: number
}
interface Geometry {
  w: number
  h: number
  anchors: Record<string, Anchor>
}

const curve = (a: Anchor, b: Anchor) => {
  const y1 = a.bottom
  const y2 = b.top - 2 // leave room for the arrow tip
  const dy = (y2 - y1) * 0.55
  return `M${a.x},${y1} C${a.x},${y1 + dy} ${b.x},${y2 - dy} ${b.x},${y2}`
}

export const PanoramaBoard: React.FC<Props> = ({
  getStatus,
  setStatus,
  cycleStatus,
  currentCardId,
  setCurrentCardId,
  summary,
  total,
  exportJson,
  importJson,
  embedded = false,
}) => {
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const [statusFilter, setStatusFilter] = useState<MasteryStatus | 'all'>('all')
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [pinnedId, setPinnedId] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<BoardCard | null>(null)
  const [drawerTop, setDrawerTop] = useState(0)
  const [geom, setGeom] = useState<Geometry | null>(null)

  const currentCard = CARD_BY_ID[currentCardId] ?? ALL_CARDS[0]
  const pct = Math.round(((summary.completed + summary.in_progress * 0.35) / total) * 100)

  // ---------------------------------------------------------------------------
  // Navigation helpers (embedded mode opens the full app in the top window)
  // ---------------------------------------------------------------------------
  const routeHref = (route: string) => (embedded ? `${BASE}#${route}` : `#${route}`)
  const linkTarget = embedded ? '_top' : undefined

  const go = (route: string) => {
    if (!embedded) {
      navigate(route)
      return
    }
    const url = routeHref(route)
    try {
      ;(window.top ?? window).location.href = url
    } catch {
      window.open(url, '_top')
    }
  }

  const openWiki = (docPath: string, cardId?: string) => {
    if (cardId) setCurrentCardId(cardId)
    go(wikiRoute(docPath))
  }

  // ---------------------------------------------------------------------------
  // Geometry: measure card anchors relative to the layer stack
  // ---------------------------------------------------------------------------
  const measure = useCallback(() => {
    const stack = stackRef.current
    if (!stack) return
    const base = stack.getBoundingClientRect()
    const anchors: Record<string, Anchor> = {}
    for (const c of ALL_CARDS) {
      const el = cardRefs.current[c.id]
      if (!el) continue
      // offset* ignores CSS transforms, so hover lift does not skew anchors.
      let x = 0
      let y = 0
      let node: HTMLElement | null = el
      while (node && node !== stack) {
        x += node.offsetLeft
        y += node.offsetTop
        node = node.offsetParent as HTMLElement | null
      }
      if (node !== stack) {
        // Fallback if the stack is not an offsetParent ancestor.
        const r = el.getBoundingClientRect()
        x = r.left - base.left
        y = r.top - base.top
      }
      anchors[c.id] = { x: x + el.offsetWidth / 2, top: y, bottom: y + el.offsetHeight }
    }
    setGeom((prev) => {
      const next = { w: stack.offsetWidth, h: stack.offsetHeight, anchors }
      return prev && JSON.stringify(prev) === JSON.stringify(next) ? prev : next
    })
  }, [])

  useLayoutEffect(() => {
    measure()
    const stack = stackRef.current
    if (!stack) return
    const ro = new ResizeObserver(() => measure())
    ro.observe(stack)
    Object.values(cardRefs.current).forEach((el) => el && ro.observe(el))
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure).catch(() => {})
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  // ---------------------------------------------------------------------------
  // Lineage tracing
  // ---------------------------------------------------------------------------
  const focusId = hoverId ?? pinnedId
  const filterSeeds = useMemo(
    () => (statusFilter === 'all' ? [] : ALL_CARDS.filter((c) => getStatus(c.id) === statusFilter).map((c) => c.id)),
    [statusFilter, getStatus]
  )
  const tracing = focusId !== null || statusFilter !== 'all'
  const seedKey = (focusId ? [focusId] : filterSeeds).join('|')
  const seedSet = useMemo(() => new Set(seedKey ? seedKey.split('|') : []), [seedKey])
  const lineage = useMemo(() => (tracing ? computeLineage(seedSet) : null), [tracing, seedSet])

  const clearTrace = () => {
    setPinnedId(null)
    setHoverId(null)
    setStatusFilter('all')
  }

  const selectCard = (card: BoardCard, anchor?: HTMLElement | null) => {
    if (embedded) {
      // The iframe is as tall as the board, so a viewport-fixed drawer would
      // sit at the top of the board, possibly off-screen in the parent page.
      // Place it next to the clicked card instead.
      const maxH = Math.min(620, window.innerHeight - 16)
      const top = (anchor ?? cardRefs.current[card.id])?.getBoundingClientRect().top ?? 0
      setDrawerTop(Math.max(8, Math.min(top - 16, window.innerHeight - maxH - 8)))
    }
    setPinnedId(card.id)
    setSelectedCard(card)
  }

  useEffect(() => {
    if (!selectedCard && !pinnedId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (selectedCard) setSelectedCard(null)
      else setPinnedId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedCard, pinnedId])

  // ---------------------------------------------------------------------------
  // Connector paths
  // ---------------------------------------------------------------------------
  const paths = useMemo(() => {
    if (!geom) return []
    return EDGES.flatMap(([a, b]) => {
      const pa = geom.anchors[a]
      const pb = geom.anchors[b]
      if (!pa || !pb) return []
      const k = edgeKey(a, b)
      const kind: 'up' | 'down' | 'idle' | 'off' = !lineage
        ? 'idle'
        : lineage.upEdges.has(k)
          ? 'up'
          : lineage.downEdges.has(k)
            ? 'down'
            : 'off'
      return [{ k, d: curve(pa, pb), kind }]
    })
  }, [geom, lineage])

  const focusCard = focusId ? CARD_BY_ID[focusId] : null
  const l5Cards = LAYER_BY_ID.L5.cards

  const renderCard = (card: BoardCard, accent: string) => {
    const st = getStatus(card.id)
    const meta = STATUS_META[st]
    const isCurrent = card.id === currentCardId
    const inChain = lineage?.nodes.has(card.id) ?? false
    const isSeed = seedSet.has(card.id)
    const cls = [
      'board-card',
      isCurrent && 'is-current',
      lineage && isSeed && 'is-focus',
      lineage && inChain && !isSeed && (lineage.upstream.has(card.id) ? 'is-up' : 'is-down'),
      lineage && !inChain && 'is-dim',
    ]
      .filter(Boolean)
      .join(' ')
    return (
      <div
        key={card.id}
        ref={(el) => {
          cardRefs.current[card.id] = el
        }}
        className={cls}
        style={{ '--accent': accent } as React.CSSProperties}
        role="button"
        tabIndex={0}
        aria-label={card.title}
        onMouseEnter={() => setHoverId(card.id)}
        onMouseLeave={() => setHoverId(null)}
        onFocus={() => setHoverId(card.id)}
        onBlur={() => setHoverId(null)}
        onClick={(e) => selectCard(card, e.currentTarget)}
        onDoubleClick={() => openWiki(card.primaryDoc, card.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            selectCard(card, e.currentTarget)
          }
        }}
      >
        <div className="card-top-row">
          <span className="card-phase">{card.phase}</span>
          <button
            className="status-badge"
            style={{ color: meta.color, backgroundColor: meta.bg, borderColor: meta.border }}
            onClick={(e) => {
              e.stopPropagation()
              cycleStatus(card.id)
            }}
            onDoubleClick={(e) => e.stopPropagation()}
            title="点击切换掌握状态"
          >
            {meta.label}
          </button>
        </div>
        <div className="card-title">{card.title}</div>
        <div className="card-sub">{card.subtitle}</div>
        <div className="card-footer-row">
          <span className="content-tags">
            {card.hasDerivation && <span className="content-tag deriv">推导</span>}
            {card.hasExperiment && <span className="content-tag exp">实验</span>}
            {!card.hasDerivation && !card.hasExperiment && <span className="content-tag">大纲 / 图谱</span>}
          </span>
          {isCurrent && <span className="here-chip">当前位置</span>}
        </div>
      </div>
    )
  }

  const linkChips = (ids: string[], dir: 'up' | 'down') =>
    ids.length === 0 ? (
      <div className="drawer-empty">{dir === 'up' ? '顶层：宏观数学分类，无上游前置' : '底层：工程应用场景，无下游'}</div>
    ) : (
      <div className="lineage-chip-row">
        {ids.map((id) => {
          const c = CARD_BY_ID[id]
          const layer = LAYER_BY_ID[c.layer]
          return (
            <button
              key={id}
              className={`lineage-chip ${dir}`}
              style={{ '--accent': layer.color } as React.CSSProperties}
              onClick={() => selectCard(c)}
            >
              <span className="lineage-chip-layer">{layer.id}</span>
              {c.title}
            </button>
          )
        })}
      </div>
    )

  return (
    <div className={`board-page${embedded ? ' is-embedded' : ''}`}>
      {/* Top status & current position bar */}
      <section className="hero-strip">
        {!embedded && (
          <div className="hero-left">
            <div className="hero-eyebrow">
              <Compass size={15} />
              <span>MPCE 数学物理与计算工程 · 五层架构全景看板</span>
            </div>
            <h1>宏观数学 → 数学方法 → 物理模型 → 计算方法 → 工程应用</h1>
            <p className="hero-sub">
              悬停或点击任意卡片，即可追溯它向上直到宏观数学、向下直到工程场景的完整依赖链；点击卡片右上角徽标可随时更新掌握状态。
            </p>
          </div>
        )}

        <div className="hero-progress-card">
          <div className="progress-top">
            <span className="progress-label">
              <MapPin size={15} />
              当前位置：<strong>{currentCard.title}</strong>（{currentCard.layer} · {currentCard.phase}）
            </span>
            <button className="btn-primary-sm" onClick={() => openWiki(currentCard.primaryDoc, currentCard.id)}>
              继续学习 <ArrowRight size={14} />
            </button>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-completed" style={{ width: `${(summary.completed / total) * 100}%` }} />
            <div className="progress-bar-active" style={{ width: `${(summary.in_progress / total) * 100}%` }} />
          </div>
          <div className="progress-stats">
            <span>总进度 {pct}%</span>
            <span>
              已掌握 {summary.completed}/{total}
            </span>
            <span>学习中 {summary.in_progress}</span>
            <span>需复习 {summary.needs_review}</span>
            <div className="progress-actions">
              <button className="btn-ghost-xs" onClick={exportJson} title="导出进度 JSON">
                <Download size={13} /> 导出
              </button>
              <button className="btn-ghost-xs" onClick={() => fileRef.current?.click()} title="导入进度 JSON">
                <Upload size={13} /> 导入
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) importJson(f)
                  e.target.value = ''
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters & quick tracing */}
      <div className="filter-bar">
        <span className="filter-title">按掌握状态追溯：</span>
        {(['all', 'in_progress', 'completed', 'needs_review', 'not_started'] as const).map((st) => {
          const active = statusFilter === st
          const label = st === 'all' ? `全部 (${total})` : `${STATUS_META[st].label} (${summary[st]})`
          return (
            <button
              key={st}
              className={`filter-pill ${active ? 'active' : ''}`}
              onClick={() => {
                setPinnedId(null)
                setStatusFilter(st)
              }}
            >
              {label}
            </button>
          )
        })}
        <span className="filter-hint">
          {embedded ? '点击卡片查看详情 / 双击在完整 Wiki 中打开' : '提示：点击卡片锁定链路并打开详情 / 双击直达主文档'}
        </span>
      </div>

      <div className="filter-bar trace-bar">
        <span className="filter-title">
          <GitBranch size={13} /> 按应用场景反向追溯：
        </span>
        {l5Cards.map((c) => (
          <button
            key={c.id}
            className={`filter-pill domain ${pinnedId === c.id ? 'active' : ''}`}
            onClick={() => {
              setStatusFilter('all')
              setPinnedId(pinnedId === c.id ? null : c.id)
            }}
          >
            {c.title}
          </button>
        ))}
        <span className="trace-legend">
          <span className="legend-swatch" style={{ background: UP_COLOR }} /> 上游依赖
          <span className="legend-swatch" style={{ background: DOWN_COLOR }} /> 下游影响
          {(pinnedId || statusFilter !== 'all') && (
            <button className="btn-ghost-xs" onClick={clearTrace}>
              <X size={12} /> 清除追溯
            </button>
          )}
        </span>
      </div>

      {/* Always rendered so hovering never shifts the board layout. */}
      <div
        className={`trace-status ${focusCard || lineage ? '' : 'idle'}`}
        style={{ '--accent': focusCard ? LAYER_BY_ID[focusCard.layer].color : '#94a3b8' } as React.CSSProperties}
        aria-live="polite"
      >
        {focusCard && lineage ? (
          <>
            <strong>
              {focusCard.layer} · {focusCard.title}
            </strong>
            <span>
              <ArrowUp size={12} /> 上游 {lineage.upstream.size} 个节点
            </span>
            <span>
              <ArrowDown size={12} /> 下游 {lineage.downstream.size} 个节点
            </span>
            {pinnedId && !hoverId && <span className="trace-pinned">已锁定 · Esc 解除</span>}
          </>
        ) : lineage ? (
          <>
            <strong>按状态「{statusFilter !== 'all' && STATUS_META[statusFilter].label}」追溯</strong>
            <span>
              {seedSet.size} 张匹配卡片 · 链路覆盖 {lineage.nodes.size} 个节点
            </span>
          </>
        ) : (
          <span>五层自上而下：宏观数学 → 具体数学方法 → 物理模型 → 计算与工程方法 → 应用场景。悬停任一卡片查看其完整依赖链。</span>
        )}
      </div>

      {/* 5-layer architecture board */}
      <div className="panorama-scroll">
        <div className="panorama-frame">
          <div
            className="layer-stack"
            ref={stackRef}
            onClick={(e) => {
              if (e.target === e.currentTarget) setPinnedId(null)
            }}
          >
            {geom && (
              <svg
                className="connector-overlay"
                width={geom.w}
                height={geom.h}
                viewBox={`0 0 ${geom.w} ${geom.h}`}
                aria-hidden="true"
              >
                <defs>
                  {(
                    [
                      ['up', UP_COLOR],
                      ['down', DOWN_COLOR],
                      ['idle', IDLE_COLOR],
                    ] as const
                  ).map(([id, color]) => (
                    <marker
                      key={id}
                      id={`mpce-arrow-${id}`}
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth={id === 'idle' ? 6 : 8}
                      markerHeight={id === 'idle' ? 6 : 8}
                      markerUnits="userSpaceOnUse"
                      orient="auto"
                    >
                      <path d="M0,0 L10,5 L0,10 z" fill={color} />
                    </marker>
                  ))}
                </defs>
                {/* inactive first so active edges paint on top */}
                {paths
                  .filter((p) => p.kind === 'idle' || p.kind === 'off')
                  .map((p) => (
                    <path
                      key={p.k}
                      d={p.d}
                      className={`edge edge-${p.kind}`}
                      markerEnd={p.kind === 'idle' ? 'url(#mpce-arrow-idle)' : undefined}
                    />
                  ))}
                {paths
                  .filter((p) => p.kind === 'up' || p.kind === 'down')
                  .map((p) => (
                    <path
                      key={p.k}
                      d={p.d}
                      className={`edge edge-${p.kind}`}
                      markerEnd={`url(#mpce-arrow-${p.kind})`}
                    />
                  ))}
              </svg>
            )}

            {LAYERS.map((layer) => (
              <section
                key={layer.id}
                className="layer-band"
                style={{ backgroundColor: layer.tint, borderColor: layer.border }}
                aria-label={`${layer.id} ${layer.title}`}
              >
                <div className="layer-label" style={{ backgroundColor: layer.color }}>
                  <span className="layer-index">{layer.id}</span>
                  <span className="layer-title">{layer.title}</span>
                  <span className="layer-sub">{layer.subtitle}</span>
                </div>
                <div className="layer-cards" style={{ gridTemplateColumns: `repeat(${layer.cards.length}, minmax(0, 1fr))` }}>
                  {layer.cards.map((card) => renderCard(card, layer.color))}
                </div>
              </section>
            ))}
          </div>

          {/* Right cross-cutting vertical crimson pillar */}
          <aside className="vertical-pillar" aria-label={PILLAR_TEXT}>
            {PILLAR_TEXT.split('').map((ch, i) => (
              <span key={i}>{ch}</span>
            ))}
          </aside>
        </div>
      </div>

      {/* Selected Card Detail Drawer */}
      {selectedCard && (
        <div className="modal-backdrop" onClick={() => setSelectedCard(null)}>
          <div
            className="card-drawer"
            role="dialog"
            aria-label={selectedCard.title}
            style={embedded ? { marginTop: drawerTop } : undefined}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-header">
              <div>
                <span className="drawer-phase" style={{ color: LAYER_BY_ID[selectedCard.layer].color }}>
                  {selectedCard.layer} · {LAYER_BY_ID[selectedCard.layer].title} · {selectedCard.phase}
                </span>
                <h2>{selectedCard.title}</h2>
                <p className="drawer-sub">{selectedCard.subtitle}</p>
              </div>
              <button className="drawer-close" onClick={() => setSelectedCard(null)} aria-label="关闭">
                ✕
              </button>
            </div>

            <div className="drawer-section">
              <div className="drawer-label">更新我的掌握状态</div>
              <div className="status-picker">
                {(['not_started', 'in_progress', 'completed', 'needs_review'] as MasteryStatus[]).map((st) => {
                  const active = getStatus(selectedCard.id) === st
                  const m = STATUS_META[st]
                  return (
                    <button
                      key={st}
                      className={`picker-btn ${active ? 'active' : ''}`}
                      style={active ? { color: m.color, backgroundColor: m.bg, borderColor: m.color } : undefined}
                      onClick={() => setStatus(selectedCard.id, st)}
                    >
                      {active && <CheckCircle2 size={14} />}
                      {m.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="drawer-section">
              <div className="drawer-label">
                <ArrowUp size={13} /> 上游前置（上一层）
              </div>
              {linkChips(UPSTREAM[selectedCard.id], 'up')}
            </div>

            <div className="drawer-section">
              <div className="drawer-label">
                <ArrowDown size={13} /> 下游影响（下一层）
              </div>
              {linkChips(DOWNSTREAM[selectedCard.id], 'down')}
            </div>

            <div className="drawer-section">
              <div className="drawer-label">进入嵌套 Wiki 与图文解析</div>
              <a
                className="primary-entry-btn"
                href={routeHref(wikiRoute(selectedCard.primaryDoc))}
                target={linkTarget}
                onClick={() => setCurrentCardId(selectedCard.id)}
              >
                <BookOpen size={16} />
                <span>打开主解析文档：{selectedCard.primaryDoc}</span>
                <ArrowRight size={15} />
              </a>

              {selectedCard.relatedDocs.length > 0 && (
                <div className="related-list">
                  {selectedCard.relatedDocs.map((doc) => (
                    <a
                      key={doc.path}
                      className="related-item"
                      href={routeHref(wikiRoute(doc.path))}
                      target={linkTarget}
                      onClick={() => setCurrentCardId(selectedCard.id)}
                    >
                      {doc.kind === 'experiment' ? (
                        <FlaskConical size={15} className="ico-teal" />
                      ) : (
                        <BookOpen size={15} className="ico-blue" />
                      )}
                      <span>{doc.label}</span>
                      <span className="related-kind">{doc.kind}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="drawer-section">
              <div className="drawer-label">关联知识图谱节点</div>
              <div className="kg-chip-row">
                {selectedCard.kgNodes.map((id) => (
                  <a key={id} className="kg-chip" href={routeHref(graphRoute(id))} target={linkTarget}>
                    {id}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
