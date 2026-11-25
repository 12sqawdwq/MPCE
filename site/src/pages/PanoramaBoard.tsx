import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Download,
  FlaskConical,
  MapPin,
  Upload,
} from 'lucide-react'
import {
  ALL_CARDS,
  BoardCard,
  COLUMN_HEADERS,
  MasteryStatus,
  STATUS_META,
  SWIMLANES,
  SWIMLANE_COLORS,
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
}) => {
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [hoveredLane, setHoveredLane] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<MasteryStatus | 'all'>('all')
  const [selectedCard, setSelectedCard] = useState<BoardCard | null>(null)

  const currentCard = ALL_CARDS.find((c) => c.id === currentCardId) ?? ALL_CARDS[0]
  const pct = Math.round(((summary.completed + summary.in_progress * 0.35) / total) * 100)

  const openWiki = (docPath: string, cardId?: string) => {
    if (cardId) setCurrentCardId(cardId)
    navigate(`/wiki/${encodeURI(docPath)}`)
  }

  return (
    <div className="board-page">
      {/* Top status & current position bar */}
      <section className="hero-strip">
        <div className="hero-left">
          <div className="hero-eyebrow">
            <Compass size={15} />
            <span>MPCE 数学物理与计算工程 · 交互全景看板</span>
          </div>
          <h1>数学链路驱动的物理方法与工程实践</h1>
          <p className="hero-sub">
            点击任意卡片可展开嵌套 Wiki、数学推导与计算实验；点击卡片右上角徽标可随时更新个人掌握状态。
          </p>
        </div>

        <div className="hero-progress-card">
          <div className="progress-top">
            <span className="progress-label">
              <MapPin size={15} />
              当前位置：<strong>{currentCard.title}</strong>（{currentCard.phase}）
            </span>
            <button
              className="btn-primary-sm"
              onClick={() => openWiki(currentCard.primaryDoc, currentCard.id)}
            >
              继续学习 <ArrowRight size={14} />
            </button>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-completed"
              style={{ width: `${(summary.completed / total) * 100}%` }}
            />
            <div
              className="progress-bar-active"
              style={{ width: `${(summary.in_progress / total) * 100}%` }}
            />
          </div>
          <div className="progress-stats">
            <span>总进度 {pct}%</span>
            <span>已掌握 {summary.completed}/{total}</span>
            <span>学习中 {summary.in_progress}</span>
            <span>需复习 {summary.needs_review}</span>
            <div className="progress-actions">
              <button className="btn-ghost-xs" onClick={exportJson} title="导出进度 JSON">
                <Download size={13} /> 导出
              </button>
              <button
                className="btn-ghost-xs"
                onClick={() => fileRef.current?.click()}
                title="导入进度 JSON"
              >
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
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filter pills */}
      <div className="filter-bar">
        <span className="filter-title">按掌握状态筛选：</span>
        {(['all', 'in_progress', 'completed', 'needs_review', 'not_started'] as const).map((st) => {
          const active = statusFilter === st
          const label = st === 'all' ? `全部 (${total})` : `${STATUS_META[st].label} (${summary[st]})`
          return (
            <button
              key={st}
              className={`filter-pill ${active ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {label}
            </button>
          )
        })}
        <span className="filter-hint">提示：点击卡片打开详情抽屉 / 双击直达主文档</span>
      </div>

      {/* Swimlane panoramic board matching Image 2 */}
      <div className="panorama-scroll">
        <div className="panorama-frame">
          <div className="panorama-main">
            {/* Column headers */}
            <div className="col-header-row">
              <div className="col-header-left">核心数学主线</div>
              <div className="col-header-grid">
                {COLUMN_HEADERS.map((col) => (
                  <div
                    key={col.label}
                    className="col-header-pill"
                    style={{ color: col.color, backgroundColor: col.bg, borderColor: col.color }}
                  >
                    {col.label}
                  </div>
                ))}
              </div>
            </div>

            {/* 6 horizontal swimlanes */}
            <div className="swimlane-stack">
              {SWIMLANES.map((lane) => {
                const pal = SWIMLANE_COLORS[lane.color]
                const dimmed = hoveredLane !== null && hoveredLane !== lane.id
                return (
                  <div
                    key={lane.id}
                    className={`swimlane-band ${dimmed ? 'dimmed' : ''}`}
                    style={{ backgroundColor: pal.fill, borderColor: pal.bdr }}
                    onMouseEnter={() => setHoveredLane(lane.id)}
                    onMouseLeave={() => setHoveredLane(null)}
                  >
                    <div className="swimlane-hdr" style={{ backgroundColor: pal.hdr }}>
                      <div className="swimlane-hdr-title">{lane.title}</div>
                      <div className="swimlane-hdr-sub">{lane.subtitle}</div>
                    </div>

                    <div className="swimlane-cards">
                      {lane.cards.map((card, idx) => {
                        const st = getStatus(card.id)
                        const meta = STATUS_META[st]
                        const isCurrent = card.id === currentCardId
                        const matchesFilter = statusFilter === 'all' || st === statusFilter
                        return (
                          <React.Fragment key={card.id}>
                            <div
                              className={`board-card ${isCurrent ? 'is-current' : ''} ${
                                !matchesFilter ? 'filtered-out' : ''
                              }`}
                              style={{ borderColor: isCurrent ? '#dc2626' : pal.cardBdr }}
                              onClick={() => setSelectedCard(card)}
                              onDoubleClick={() => openWiki(card.primaryDoc, card.id)}
                            >
                              <div className="card-top-row">
                                <span className="card-phase">{card.phase}</span>
                                <button
                                  className="status-badge"
                                  style={{
                                    color: meta.color,
                                    backgroundColor: meta.bg,
                                    borderColor: meta.border,
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    cycleStatus(card.id)
                                  }}
                                  title="点击切换掌握状态"
                                >
                                  {meta.label}
                                </button>
                              </div>
                              <div className="card-title">{card.title}</div>
                              <div className="card-sub">{card.subtitle}</div>
                              <div className="card-footer-row">
                                <span className={`content-dot ${card.contentReady ? 'ready' : ''}`}>
                                  {card.contentReady ? '含推导 / 实验' : '大纲 / 图谱'}
                                </span>
                                {isCurrent && <span className="here-chip">当前位置</span>}
                              </div>
                            </div>
                            {idx < 3 && (
                              <div className="card-arrow" aria-hidden="true">
                                →
                              </div>
                            )}
                          </React.Fragment>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right cross-cutting vertical crimson pillar */}
          <aside className="vertical-pillar" aria-label="数学驱动物理与工程实践">
            {'数学驱动物理与工程实践'.split('').map((ch, i) => (
              <span key={i}>{ch}</span>
            ))}
          </aside>
        </div>
      </div>

      {/* Selected Card Detail Modal / Drawer */}
      {selectedCard && (
        <div className="modal-backdrop" onClick={() => setSelectedCard(null)}>
          <div className="card-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <span className="drawer-phase">{selectedCard.phase}</span>
                <h2>{selectedCard.title}</h2>
                <p className="drawer-sub">{selectedCard.subtitle}</p>
              </div>
              <button className="drawer-close" onClick={() => setSelectedCard(null)}>
                ✕
              </button>
            </div>

            <div className="drawer-section">
              <div className="drawer-label">更新我的掌握状态</div>
              <div className="status-picker">
                {(['not_started', 'in_progress', 'completed', 'needs_review'] as MasteryStatus[]).map(
                  (st) => {
                    const active = getStatus(selectedCard.id) === st
                    const m = STATUS_META[st]
                    return (
                      <button
                        key={st}
                        className={`picker-btn ${active ? 'active' : ''}`}
                        style={
                          active
                            ? { color: m.color, backgroundColor: m.bg, borderColor: m.color }
                            : undefined
                        }
                        onClick={() => setStatus(selectedCard.id, st)}
                      >
                        {active && <CheckCircle2 size={14} />}
                        {m.label}
                      </button>
                    )
                  }
                )}
              </div>
            </div>

            <div className="drawer-section">
              <div className="drawer-label">进入嵌套 Wiki 与图文解析</div>
              <button
                className="primary-entry-btn"
                onClick={() => openWiki(selectedCard.primaryDoc, selectedCard.id)}
              >
                <BookOpen size={16} />
                <span>打开主解析文档：{selectedCard.primaryDoc}</span>
                <ArrowRight size={15} />
              </button>

              {selectedCard.relatedDocs.length > 0 && (
                <div className="related-list">
                  {selectedCard.relatedDocs.map((doc) => (
                    <button
                      key={doc.path}
                      className="related-item"
                      onClick={() => openWiki(doc.path, selectedCard.id)}
                    >
                      {doc.kind === 'experiment' ? (
                        <FlaskConical size={15} className="ico-teal" />
                      ) : (
                        <BookOpen size={15} className="ico-blue" />
                      )}
                      <span>{doc.label}</span>
                      <span className="related-kind">{doc.kind}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="drawer-section">
              <div className="drawer-label">关联知识图谱节点</div>
              <div className="kg-chip-row">
                {selectedCard.kgIds.map((id) => (
                  <button
                    key={id}
                    className="kg-chip"
                    onClick={() => navigate(`/graph?q=${encodeURIComponent(id)}`)}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
