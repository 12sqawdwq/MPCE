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
  phase: string | null
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

/** Subject folder labels, listed in learning order; the sidebar sorts folders by this order. */
const FOLDER_LABELS: Record<string, string> = {
  single_variable_calculus: '一元微积分 Single-Variable Calculus',
  linear_algebra: '线性代数 Linear Algebra',
  calculus: '多元/向量微积分 Calculus',
  probability_statistics: '概率统计 Probability & Statistics',
  differential_equations: '微分方程 Differential Equations',
  optimization: '变分法与最优化 Optimization',
  functional_analysis: '泛函分析 Functional Analysis',
  numerical_analysis: '数值分析 Numerical Analysis',
  university_physics: '大学物理基础 University Physics',
  classical_mechanics: '分析力学 Classical Mechanics',
  electromagnetism: '电动力学 Electromagnetism',
  thermodynamics: '热力学与统计物理 Thermodynamics',
  continuum_mechanics: '连续介质力学 Continuum Mechanics',
  quantum_mechanics: '量子力学 Quantum Mechanics',
  solid_state_physics: '固体与半导体物理 Solid State Physics',
  dynamics: '动力学 Dynamics',
  heat_transfer: '传热 Heat Transfer',
}
const FOLDER_ORDER = Object.keys(FOLDER_LABELS)

const FILE_RANK: Record<string, number> = { 'README.md': 0, 'curriculum.md': 1 }

interface TreeFolder {
  key: string
  name: string
  docs: WikiDoc[]
  folders: TreeFolder[]
}

/** Builds folder → doc nesting from paths below the section; single-doc folders collapse to the doc unless it is a module introduction. */
function buildTree(docs: WikiDoc[], section: string): TreeFolder {
  const root: TreeFolder = { key: section, name: section, docs: [], folders: [] }
  for (const d of docs) {
    const parts = section === '_root' ? [d.path] : d.path.split('/').slice(1)
    let cur = root
    for (const seg of parts.slice(0, -1)) {
      let next = cur.folders.find((f) => f.name === seg)
      if (!next) {
        next = { key: `${cur.key}/${seg}`, name: seg, docs: [], folders: [] }
        cur.folders.push(next)
      }
      cur = next
    }
    cur.docs.push(d)
  }
  const collapse = (f: TreeFolder): TreeFolder => {
    f.folders = f.folders.map(collapse).filter((sub) => {
      if (sub.folders.length === 0 && sub.docs.length === 1 && !sub.docs[0].path.endsWith('/curriculum.md')) {
        f.docs.push(sub.docs[0])
        return false
      }
      return true
    })
    const rank = (name: string) => {
      const i = FOLDER_ORDER.indexOf(name)
      return i < 0 ? FOLDER_ORDER.length : i
    }
    f.folders.sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name))
    const fileName = (d: WikiDoc) => d.path.split('/').pop() ?? ''
    f.docs.sort((a, b) => {
      const ra = FILE_RANK[fileName(a)] ?? 2
      const rb = FILE_RANK[fileName(b)] ?? 2
      return ra - rb || a.path.localeCompare(b.path)
    })
    return f
  }
  return collapse(root)
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
    '02_physics': true,
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

  const renderDoc = (item: WikiDoc, inFolder: boolean) => {
    const active = item.path === docPath
    const fileName = item.path.split('/').pop() ?? ''
    const shortName =
      inFolder && fileName === 'curriculum.md' ? '导论' : item.title.split(/[|｜]/)[0].trim()
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
          {item.phase && <em className="tree-phase">{item.phase}</em>}
        </button>
      </li>
    )
  }

  const renderFolder = (folder: TreeFolder) => {
    const forced = query.trim().length > 0 || docPath.startsWith(`${folder.key}/`)
    const isOpen = forced || (openSections[folder.key] ?? true)
    return (
      <li key={folder.key}>
        <button className="tree-folder-btn" onClick={() => toggleSection(folder.key)}>
          {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          <FolderOpen size={13} />
          <span>{FOLDER_LABELS[folder.name] ?? folder.name}</span>
        </button>
        {isOpen && (
          <ul className="tree-list">
            {folder.docs.map((d) => renderDoc(d, true))}
            {folder.folders.map(renderFolder)}
          </ul>
        )}
      </li>
    )
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
                {isOpen && (() => {
                  const tree = buildTree(items, sec)
                  return (
                    <ul className="tree-list">
                      {tree.docs.map((d) => renderDoc(d, false))}
                      {tree.folders.map(renderFolder)}
                    </ul>
                  )
                })()}
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
                      onClick={() => navigate(`/graph?q=${encodeURIComponent(c.kgNodes[0] || '')}`)}
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
