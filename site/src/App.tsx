import React from 'react'
import { HashRouter, NavLink, Route, Routes } from 'react-router-dom'
import { BookOpen, Compass, ExternalLink, FlaskConical, Network } from 'lucide-react'
import { useMastery } from './hooks/useMastery'
import { PanoramaBoard } from './pages/PanoramaBoard'
import { WikiPage } from './pages/WikiPage'
import { GraphExplorer } from './pages/GraphExplorer'

export const App: React.FC = () => {
  const mastery = useMastery()

  return (
    <HashRouter>
      <div className="app-shell">
        <header className="top-nav">
          <div className="nav-brand">
            <span className="brand-badge">MPCE</span>
            <span className="brand-text">数学物理与计算工程知识库</span>
          </div>

          <nav className="nav-links">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <Compass size={15} /> 全景看板
            </NavLink>
            <NavLink
              to="/wiki/README.md"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <BookOpen size={15} /> 嵌套 Wiki
            </NavLink>
            <NavLink
              to="/wiki/05_experiments/README.md"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <FlaskConical size={15} /> 计算实验
            </NavLink>
            <NavLink
              to="/graph"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <Network size={15} /> 知识图谱 (67)
            </NavLink>
            <a
              className="nav-link"
              href="https://github.com/12sqawdwq/MPCE"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <ExternalLink size={13} />
            </a>
          </nav>
        </header>

        <div className="app-body">
          <Routes>
            <Route
              path="/"
              element={
                <PanoramaBoard
                  getStatus={mastery.getStatus}
                  setStatus={mastery.setStatus}
                  cycleStatus={mastery.cycleStatus}
                  currentCardId={mastery.currentCardId}
                  setCurrentCardId={mastery.setCurrentCardId}
                  summary={mastery.summary}
                  total={mastery.total}
                  exportJson={mastery.exportJson}
                  importJson={mastery.importJson}
                />
              }
            />
            <Route
              path="/wiki/*"
              element={
                <WikiPage
                  getStatus={mastery.getStatus}
                  setStatus={mastery.setStatus}
                  setCurrentCardId={mastery.setCurrentCardId}
                />
              }
            />
            <Route path="/graph" element={<GraphExplorer />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  )
}
