import React, { useEffect, useRef } from 'react'
import { useMastery } from '../hooks/useMastery'
import { PanoramaBoard } from './PanoramaBoard'

interface Props {
  mastery: ReturnType<typeof useMastery>
}

/**
 * Chrome-less board for `#/embed`, intended for an iframe on the same origin
 * (https://ziyu.mnilab.cn/). Reports its content height to the parent so the
 * iframe can be sized without an inner vertical scrollbar.
 */
export const EmbedBoard: React.FC<Props> = ({ mastery }) => {
  const shellRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('mpce-embed')
    return () => root.classList.remove('mpce-embed')
  }, [])

  useEffect(() => {
    const el = shellRef.current
    if (!el || window.parent === window) return

    let last = 0
    const post = () => {
      // Measure the shell, not <html>: documentElement.scrollHeight never
      // shrinks below the iframe viewport, which would block shrinking.
      const height = Math.ceil(el.getBoundingClientRect().height)
      if (height === last) return
      last = height
      window.parent.postMessage({ type: 'mpce-embed-height', height }, window.location.origin)
    }

    const ro = new ResizeObserver(post)
    ro.observe(el)
    post()
    return () => ro.disconnect()
  }, [])

  return (
    <div className="embed-shell" ref={shellRef}>
      <PanoramaBoard
        embedded
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
    </div>
  )
}
