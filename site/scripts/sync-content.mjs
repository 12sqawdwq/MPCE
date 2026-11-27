import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SITE_DIR = path.resolve(__dirname, '..')
const REPO_ROOT = path.resolve(SITE_DIR, '..')
const PUBLIC_ASSETS = path.join(SITE_DIR, 'public', 'assets', 'diagrams')
const OUT_JSON = path.join(SITE_DIR, 'src', 'data', 'wiki-data.json')

const IGNORE_DIRS = new Set(['.git', '.github', 'site', 'node_modules', 'output', '__pycache__', '.venv'])

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function copyDiagrams() {
  const srcDir = path.join(REPO_ROOT, 'assets', 'diagrams')
  ensureDir(PUBLIC_ASSETS)
  if (!fs.existsSync(srcDir)) return 0
  let count = 0
  for (const name of fs.readdirSync(srcDir)) {
    if (name.endsWith('.svg')) {
      fs.copyFileSync(path.join(srcDir, name), path.join(PUBLIC_ASSETS, name))
      count++
    }
  }
  return count
}

function walkMarkdown(dir, relBase = '') {
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    const rel = relBase ? `${relBase}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      results.push(...walkMarkdown(full, rel))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push({ full, rel })
    }
  }
  return results
}

function extractTitle(content, rel) {
  const m = content.match(/^#\s+(.+)$/m)
  if (m) return m[1].trim()
  return rel.replace(/\.md$/, '')
}

function extractPhase(content) {
  const m = content.match(/^\|\s*Phase\s*\|\s*(.+?)\s*\|\s*$/m)
  if (!m) return null
  if (m[1].includes('前置')) return '前置'
  const p = m[1].match(/Phase\s+([IVX]+)/)
  return p ? `Phase ${p[1]}` : null
}

function extractHeadings(content) {
  const headings = []
  let inCode = false
  for (const line of content.split(/\r?\n/)) {
    if (line.trim().startsWith('```')) {
      inCode = !inCode
      continue
    }
    if (inCode) continue
    const m = line.match(/^(#{2,3})\s+(.+)$/)
    if (m) {
      const text = m[2].replace(/`/g, '').trim()
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
      headings.push({ level: m[1].length, text, id })
    }
  }
  return headings
}

function parseKnowledgeGraphNodes() {
  const kgDir = path.join(REPO_ROOT, '06_knowledge_graph')
  const layers = [
    { file: 'mathematics_graph.md', layer: 'MATH', label: '数学层' },
    { file: 'physics_graph.md', layer: 'PHYS', label: '物理层' },
    { file: 'computational_graph.md', layer: 'COMP', label: '计算层' },
    { file: 'engineering_graph.md', layer: 'ENG', label: '工程层' },
  ]
  const nodes = []
  const headingRe = /^###\s+((?:MATH|PHYS|ENG)-[A-Z]+-\d{2}|COMP-\d{2})\s*[·—–\-|:]?\s*(.*)$/
  const idRe = /\b((?:MATH|PHYS|ENG)-[A-Z]+-\d{2}|COMP-\d{2})\b/g

  for (const { file, layer, label } of layers) {
    const fp = path.join(kgDir, file)
    if (!fs.existsSync(fp)) continue
    const lines = fs.readFileSync(fp, 'utf-8').split(/\r?\n/)
    let cur = null
    for (const line of lines) {
      const hm = line.match(headingRe)
      if (hm) {
        if (cur) nodes.push(cur)
        const parts = hm[2].split(/[｜|]/)
        cur = {
          id: hm[1],
          layer,
          layerLabel: label,
          docPath: `06_knowledge_graph/${file}`,
          en: (parts[0] || '').trim(),
          zh: (parts[1] || parts[0] || '').trim(),
          definition: '',
          prerequisites: [],
          related: [],
        }
        continue
      }
      if (!cur) continue
      const defM = line.match(/^\s*-\s+\*\*Definition.*?\*\*[:：]?\s*(.+)$/i)
      if (defM) cur.definition = defM[1].trim()
      const preM = line.match(/^\s*-\s+\*\*Prerequisites.*?\*\*[:：]?\s*(.+)$/i)
      if (preM) {
        cur.prerequisites = [...new Set([...preM[1].matchAll(idRe)].map((x) => x[1]))]
      }
      const relM = line.match(/^\s*-\s+\*\*(Related|Computational|Engineering).*?\*\*[:：]?\s*(.+)$/i)
      if (relM) {
        const ids = [...relM[2].matchAll(idRe)].map((x) => x[1])
        cur.related = [...new Set([...cur.related, ...ids])]
      }
    }
    if (cur) nodes.push(cur)
  }
  return nodes
}

function main() {
  const svgCount = copyDiagrams()
  const mdFiles = walkMarkdown(REPO_ROOT).sort((a, b) => a.rel.localeCompare(b.rel))
  const docs = {}

  for (const { full, rel } of mdFiles) {
    const content = fs.readFileSync(full, 'utf-8')
    const dir = path.dirname(full)
    const expPy = path.join(dir, 'experiment.py')
    const code = rel.startsWith('05_experiments/') && fs.existsSync(expPy)
      ? fs.readFileSync(expPy, 'utf-8')
      : null

    const topSection = rel.includes('/') ? rel.split('/')[0] : '_root'
    docs[rel] = {
      path: rel,
      section: topSection,
      title: extractTitle(content, rel),
      phase: extractPhase(content),
      headings: extractHeadings(content),
      content,
      experimentCode: code,
    }
  }

  const kgNodes = parseKnowledgeGraphNodes()

  ensureDir(path.dirname(OUT_JSON))
  fs.writeFileSync(
    OUT_JSON,
    JSON.stringify({ generatedAt: new Date().toISOString(), docs, kgNodes }, null, 2),
    'utf-8'
  )
  console.log(`Synced ${Object.keys(docs).length} markdown docs, ${svgCount} SVGs, ${kgNodes.length} KG nodes.`)
}

main()
