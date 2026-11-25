import katex from 'katex'
import { marked } from 'marked'

function resolveRelPath(currentDocPath: string, href: string): string {
  if (/^https?:\/\//.test(href) || href.startsWith('#') || href.startsWith('mailto:')) {
    return href
  }
  const [cleanHref, hash] = href.split('#')
  const baseParts = currentDocPath.split('/').slice(0, -1)
  const relParts = cleanHref.split('/')
  const stack = [...baseParts]
  for (const part of relParts) {
    if (!part || part === '.') continue
    if (part === '..') stack.pop()
    else stack.push(part)
  }
  const resolved = stack.join('/')
  return hash ? `${resolved}#${hash}` : resolved
}

function slugify(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function renderMarkdownWithMath(rawMd: string, currentDocPath: string): string {
  // Strip HTML comments (e.g., CONTRIBUTING 7-question notes)
  let md = rawMd.replace(/<!--[\s\S]*?-->/g, '')

  // Protect code blocks and inline code before math extraction
  const codeBlocks: string[] = []
  md = md.replace(/```[\s\S]*?```/g, (m) => {
    const idx = codeBlocks.push(m) - 1
    return `@@CODEBLOCK_${idx}@@`
  })
  const inlineCodes: string[] = []
  md = md.replace(/`[^`\n]+`/g, (m) => {
    const idx = inlineCodes.push(m) - 1
    return `@@INLINECODE_${idx}@@`
  })

  // Extract display math $$...$$
  const mathBlocks: string[] = []
  md = md.replace(/\$\$([\s\S]+?)\$\$/g, (_m, expr) => {
    let html: string
    try {
      html = katex.renderToString(expr.trim(), { displayMode: true, throwOnError: false })
    } catch {
      html = `<pre>${expr}</pre>`
    }
    const idx = mathBlocks.push(`<div class="katex-block">${html}</div>`) - 1
    return `\n\n@@MATHBLOCK_${idx}@@\n\n`
  })

  // Extract inline math $...$
  md = md.replace(/(?<!\\)\$([^\n$]+?)(?<!\\)\$/g, (_m, expr) => {
    let html: string
    try {
      html = katex.renderToString(expr.trim(), { displayMode: false, throwOnError: false })
    } catch {
      html = `<code>${expr}</code>`
    }
    const idx = mathBlocks.push(html) - 1
    return `@@MATHBLOCK_${idx}@@`
  })

  // Restore inline code and code blocks
  md = md.replace(/@@INLINECODE_(\d+)@@/g, (_m, i) => inlineCodes[Number(i)])
  md = md.replace(/@@CODEBLOCK_(\d+)@@/g, (_m, i) => codeBlocks[Number(i)])

  const baseUrl = import.meta.env.BASE_URL || '/MPCE/'

  const renderer = new marked.Renderer()
  renderer.heading = ({ tokens, depth }) => {
    const text = renderer.parser.parseInline(tokens)
    const id = slugify(text)
    return `<h${depth} id="${id}">${text}</h${depth}>\n`
  }
  renderer.image = ({ href, title, text }) => {
    const resolved = resolveRelPath(currentDocPath, href)
    const src = /^https?:\/\//.test(resolved) ? resolved : `${baseUrl}${resolved}`
    const titleAttr = title ? ` title="${title}"` : ''
    return `<figure class="wiki-figure"><img src="${src}" alt="${text || ''}"${titleAttr} loading="lazy" class="wiki-svg-img" /><figcaption>${text || ''}</figcaption></figure>`
  }
  renderer.link = ({ href, title, tokens }) => {
    const text = renderer.parser.parseInline(tokens)
    const titleAttr = title ? ` title="${title}"` : ''
    if (/^https?:\/\//.test(href)) {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer"${titleAttr}>${text}</a>`
    }
    if (href.startsWith('#')) {
      return `<a href="${href}"${titleAttr}>${text}</a>`
    }
    const resolved = resolveRelPath(currentDocPath, href)
    if (resolved.includes('.md')) {
      return `<a href="#/wiki/${encodeURI(resolved)}" data-wiki-link="${resolved}"${titleAttr}>${text}</a>`
    }
    return `<a href="${baseUrl}${resolved}"${titleAttr}>${text}</a>`
  }

  let html = marked.parse(md, { renderer, gfm: true, breaks: false }) as string

  // Restore math blocks
  html = html.replace(/@@MATHBLOCK_(\d+)@@/g, (_m, i) => mathBlocks[Number(i)])
  return html
}
