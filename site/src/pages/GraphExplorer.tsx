import React, { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BookOpen, Search } from 'lucide-react'
import wikiDataRaw from '../data/wiki-data.json'
import { renderInlineMath } from '../utils/markdown'

interface KgNode {
  id: string
  layer: 'MATH' | 'PHYS' | 'COMP' | 'ENG'
  layerLabel: string
  docPath: string
  en: string
  zh: string
  definition: string
  prerequisites: string[]
  related: string[]
}

const { kgNodes } = wikiDataRaw as unknown as { kgNodes: KgNode[] }

const LAYER_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  ALL: { label: '全部 67 节点', color: '#334155', bg: '#f1f5f9' },
  MATH: { label: '数学层 (21)', color: '#2563eb', bg: '#eff6ff' },
  PHYS: { label: '物理层 (16)', color: '#7c3aed', bg: '#f5f3ff' },
  COMP: { label: '计算层 (15)', color: '#1f7a7a', bg: '#f0fdfa' },
  ENG: { label: '工程层 (15)', color: '#2e7d32', bg: '#f0fdf4' },
}

export const GraphExplorer: React.FC = () => {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const [layer, setLayer] = useState<string>('ALL')
  const q = params.get('q') || ''

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase()
    return kgNodes.filter((n) => {
      if (layer !== 'ALL' && n.layer !== layer) return false
      if (!kw) return true
      return (
        n.id.toLowerCase().includes(kw) ||
        n.zh.toLowerCase().includes(kw) ||
        n.en.toLowerCase().includes(kw) ||
        n.definition.toLowerCase().includes(kw)
      )
    })
  }, [layer, q])

  return (
    <div className="graph-page">
      <div className="graph-header">
        <div>
          <h1>跨领域知识图谱节点浏览器（67 节点）</h1>
          <p>点击任意先修或关联节点 ID 可直接过滤追踪上下游关系，或跳转对应分层文档。</p>
        </div>
        <button className="btn-secondary-sm" onClick={() => navigate('/wiki/KNOWLEDGE_GRAPH.md')}>
          <BookOpen size={14} /> 查看图谱总览文档
        </button>
      </div>

      <div className="graph-controls">
        <div className="graph-tabs">
          {Object.entries(LAYER_STYLES).map(([k, v]) => (
            <button
              key={k}
              className={`filter-pill ${layer === k ? 'active' : ''}`}
              onClick={() => setLayer(k)}
            >
              {v.label}
            </button>
          ))}
        </div>
        <div className="wiki-search graph-search">
          <Search size={14} />
          <input
            type="text"
            value={q}
            onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {})}
            placeholder="搜索 ID（如 MATH-LA-02）、中文或英文名..."
          />
        </div>
      </div>

      <div className="kg-grid">
        {filtered.map((n) => {
          const st = LAYER_STYLES[n.layer] || LAYER_STYLES.ALL
          return (
            <div key={n.id} className="kg-node-card" style={{ borderTopColor: st.color }}>
              <div className="kg-node-top">
                <span className="kg-id-pill" style={{ color: st.color, backgroundColor: st.bg }}>
                  {n.id}
                </span>
                <button
                  className="btn-ghost-xs"
                  onClick={() => navigate(`/wiki/${encodeURI(n.docPath)}`)}
                >
                  文档
                </button>
              </div>
              <div className="kg-node-zh">{n.zh}</div>
              <div className="kg-node-en">{n.en}</div>
              {n.definition && (
                <p
                  className="kg-node-def"
                  dangerouslySetInnerHTML={{ __html: renderInlineMath(n.definition) }}
                />
              )}

              {n.prerequisites.length > 0 && (
                <div className="kg-rel-row">
                  <span className="kg-rel-label">先修：</span>
                  {n.prerequisites.map((id) => (
                    <button
                      key={id}
                      className="kg-mini-chip"
                      onClick={() => {
                        setLayer('ALL')
                        setParams({ q: id })
                      }}
                    >
                      {id}
                    </button>
                  ))}
                </div>
              )}

              {n.related.length > 0 && (
                <div className="kg-rel-row">
                  <span className="kg-rel-label">关联：</span>
                  {n.related.slice(0, 6).map((id) => (
                    <button
                      key={id}
                      className="kg-mini-chip"
                      onClick={() => {
                        setLayer('ALL')
                        setParams({ q: id })
                      }}
                    >
                      {id}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
