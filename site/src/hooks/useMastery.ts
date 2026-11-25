import { useCallback, useEffect, useState } from 'react'
import { ALL_CARDS, MasteryStatus } from '../data/boardConfig'

const STORAGE_KEY = 'mpce_mastery_v1'
const CURRENT_KEY = 'mpce_current_card_v1'

const ORDER: MasteryStatus[] = ['not_started', 'in_progress', 'completed', 'needs_review']

export function useMastery() {
  const [statuses, setStatuses] = useState<Record<string, MasteryStatus>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : { 'la-math': 'in_progress' }
    } catch {
      return { 'la-math': 'in_progress' }
    }
  })

  const [currentCardId, setCurrentCardId] = useState<string>(() => {
    try {
      return localStorage.getItem(CURRENT_KEY) || 'la-math'
    } catch {
      return 'la-math'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses))
    } catch {
      // ignore storage quota errors
    }
  }, [statuses])

  useEffect(() => {
    try {
      localStorage.setItem(CURRENT_KEY, currentCardId)
    } catch {
      // ignore
    }
  }, [currentCardId])

  const getStatus = useCallback(
    (cardId: string): MasteryStatus => statuses[cardId] ?? 'not_started',
    [statuses]
  )

  const setStatus = useCallback((cardId: string, next: MasteryStatus) => {
    setStatuses((prev) => ({ ...prev, [cardId]: next }))
    if (next === 'in_progress') {
      setCurrentCardId(cardId)
    }
  }, [])

  const cycleStatus = useCallback((cardId: string) => {
    setStatuses((prev) => {
      const cur = prev[cardId] ?? 'not_started'
      const next = ORDER[(ORDER.indexOf(cur) + 1) % ORDER.length]
      if (next === 'in_progress') setCurrentCardId(cardId)
      return { ...prev, [cardId]: next }
    })
  }, [])

  const exportJson = useCallback(() => {
    const payload = {
      exportedAt: new Date().toISOString(),
      currentCardId,
      statuses,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mpce-progress.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [currentCardId, statuses])

  const importJson = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        if (parsed && typeof parsed.statuses === 'object') {
          setStatuses(parsed.statuses)
          if (typeof parsed.currentCardId === 'string') {
            setCurrentCardId(parsed.currentCardId)
          }
        }
      } catch {
        alert('进度文件格式无效')
      }
    }
    reader.readAsText(file)
  }, [])

  const summary = ALL_CARDS.reduce(
    (acc, c) => {
      const s = statuses[c.id] ?? 'not_started'
      acc[s]++
      return acc
    },
    { not_started: 0, in_progress: 0, completed: 0, needs_review: 0 }
  )

  return {
    statuses,
    currentCardId,
    setCurrentCardId,
    getStatus,
    setStatus,
    cycleStatus,
    exportJson,
    importJson,
    summary,
    total: ALL_CARDS.length,
  }
}
