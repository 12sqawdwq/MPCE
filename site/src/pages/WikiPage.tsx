import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  ChevronRight,
  Code2,
  FileText,
  FolderOpen,
  Network,
  Search,
} from 'lucide-react'
import wikiDataRaw from '../data/wiki-data.json'
import { ALL_CARDS, MasteryStatus, STATUS_META } from '../data/boardConfig'
import { renderMarkdownWithMath } from '../utils/markdown'

interface WikiDoc {
  path: string
  section: string
  title: string
  headings: { level: number; text: string; id: string }[]
  content: string
  experimentCode: string | null
}

interface KgNode {
  id: string
  layer: string
  layerLabel: string
  docPath: string
  en: string
  zh: string
  definition: string
  prerequisites: string[]
  related: string[]
}

const wikiData = wikiDataRaw as unknown as {
  docs: Record<string, WikiDoc>
  kgNodes: KgNode[]
}

const SECTION_LABELS: Record<string, string> = {
  _root: '总览与治理',
  '00_getting_started': '00 入门指南',
  '01_mathematics': '01 数学核心',
  '02_physics': '02 物理核心',
  '03_computational_methods': '03 计算方法',
  '04_engineering_applications': '04 工程应用',
  '05_experiments': '05 计算实验',
  '06_knowledge_graph': '06 知识图谱',
  '07_references': '07 参考资料',
}

interface Props {
  getStatus: (id: string) => MasteryStatus
  setStatus: (id: string, next: MasteryStatus) => void
  setCurrentCardId: (id: string) => void
}

export const WikiPage: React.FC<Props> = ({ getStatus, setStatus, setCurrentCardId }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [showCode, setShowCode] = useState(false)
  const [zoomSrc, setZoomSrc] = useState<string | null>(null)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    _root: true,
    '00_getting_started': true,
    '01_mathematics': true,
    '05_experiments': true,
    '06_knowledge_graph': true,
  })

  const rawPath = decodeURI(location.pathname.replace(/^\/wiki\/?/, '')) || 'README.md'
  const docPath = wikiData.docs[rawPath] ? rawPath : 'README.md'
  const doc = wikiData.docs[docPath]

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase()
    const map: Record<string, WikiDoc[]> = {}
    for (const d of Object.values(wikiData.docs)) {
      if (q && !d.title.toLowerCase().includes(q) && !d.path.toLowerCase().includes(q)) {
        continue
      }
      if (!map[d.section]) map[d.section] = []
      map[d.section].push(d)
    }
    return map
  }, [query])

  const renderedHtml = useMemo(
    () => (doc ? renderMarkdownWithMath(doc.content, doc.path) : ''),
    [doc]
  )

  // Find board cards linked to this doc
  const linkedCards = useMemo(
    () =>
      ALL_CARDS.filter(
        (c) => c.primaryDoc === docPath || c.relatedDocs.some((r) => r.path === docPath)
      ),
    [docPath]
  )

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'IMG') {
      const src = (target as HTMLImageElement).src
      if (src) setZoomSrc(src)
      return
    }
    const anchor = target.closest('a')
    if (anchor) {
      const wikiTarget = anchor.getAttribute('data-wiki-link')
      if (wikiTarget) {
        e.preventDefault()
        const [cleanPath, hash] = wikiTarget.split('#')
        navigate(`/wiki/${encodeURI(cleanPath)}${hash ? `#${hash}` : ''}`)
      }
    }
  }

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }))
  }

  return (
    <div className="wiki-layout">
      {/* Left nested tree sidebar */}
      <aside className="wiki-sidebar">
        <div className="wiki-search">
          <Search size={14} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文档标题或路径..."
          />
        </div>

        <nav className="wiki-tree">
          {Object.keys(SECTION_LABELS).map((sec) => {
            const items = grouped[sec]
            if (!items || items.length === 0) return null
            const isOpen = query.trim().length > 0 || (openSections[sec] ?? false)
            return (
              <div key={sec} className="tree-group">
                <button className="tree-group-btn" onClick={() => toggleSection(sec)}>
                  {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <FolderOpen size={14} />
                  <span>{SECTION_LABELS[sec]}</span>
                  <span className="tree-count">{items.length}</span>
                </button>
                {isOpen && (
                  <ul className="tree-list">
                    {items.map((item) => {
                      const active = item.path === docPath
                      const shortName = item.title.split(/[|｜]/)[0].trim()
                      return (
                        <li key={item.path}>
                          <button
                            className={`tree-item ${active ? 'active' : ''}`}
                            onClick={() => {
                              setShowCode(false)
                              navigate(`/wiki/${encodeURI(item.path)}`)
                            }}
                            title={item.path}
                          >
                            <FileText size={13} />
                            <span>{shortName}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}
        </nav>
      </aside>

      {/* Center markdown + KaTeX + SVG article */}
      <main className="wiki-main">
        <div className="wiki-breadcrumb">
          <button onClick={() => navigate('/')}>全景看板</button>
          <span>/</span>
          <span>{docPath}</span>
        </div>

        {doc.experimentCode && (
          <div className="exp-code-banner">
            <div>
              <strong>附带可运行实验脚本</strong>（<code>experiment.py</code>）
            </div>
            <button className="btn-secondary-sm" onClick={() => setShowCode((v) => !v)}>
              <Code2 size={14} />
              {showCode ? '隐藏源码' : '展开查看 Python 源码'}
            </button>
          </div>
        )}

        {doc.experimentCode && showCode && (
          <pre className="exp-source-box">
            <code>{doc.experimentCode}</code>
          </pre>
        )}

        <article
          className="wiki-prose"
          onClick={handleContentClick}
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      </main>

      {/* Right TOC + linked board cards */}
      <aside className="wiki-toc">
        {linkedCards.length > 0 && (
          <div className="toc-card">
            <div className="toc-title">所属看板节点</div>
            {linkedCards.map((c) => {
              const st = getStatus(c.id)
              const m = STATUS_META[st]
              return (
                <div key={c.id} className="toc-linked-card">
                  <div className="toc-linked-name">{c.title}</div>
                  <div className="toc-linked-controls">
                    <select
                      value={st}
                      style={{ color: m.color, borderColor: m.border, backgroundColor: m.bg }}
                      onChange={(e) => {
                        const val = e.target.value as MasteryStatus
                        setStatus(c.id, val)
                        setCurrentCardId(c.id)
                      }}
                    >
                      <option value="not_started">未开始</option>
                      <option value="in_progress">学习中</option>
                      <option value="completed">已掌握</option>
                      <option value="needs_review">需复习</option>
                    </select>
                    <button
                      className="btn-ghost-xs"
                      onClick={() => navigate(`/graph?q=${encodeURIComponent(c.kgIds[0] || '')}`)}
                    >
                      <Network size={12} /> 图谱
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {doc.headings.length > 0 && (
          <div className="toc-card">
            <div className="toc-title">本页目录</div>
            <ul className="toc-list">
              {doc.headings.map((h, i) => (
                <li key={`${h.id}-${i}`} className={h.level === 3 ? 'toc-h3' : 'toc-h2'}>
                  <a
                    href={`#${h.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* SVG / Image zoom lightbox */}
      {zoomSrc && (
        <div className="lightbox-backdrop" onClick={() => setZoomSrc(null)}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setZoomSrc(null)}>
              ✕ 关闭缩放
            </button>
            <img src={zoomSrc} alt="放大视图" />
          </div>
        </div>
      )}
    </div>
  )
}
