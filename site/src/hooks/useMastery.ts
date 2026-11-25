import { useCallback, useEffect, useState } from 'react'
import { ALL_CARDS, CARD_BY_ID, DEFAULT_CARD_ID, MasteryStatus } from '../data/boardConfig'

const STORAGE_KEY = 'mpce_mastery_v1'
const CURRENT_KEY = 'mpce_current_card_v1'

const ORDER: MasteryStatus[] = ['not_started', 'in_progress', 'completed', 'needs_review']

// Card IDs from earlier board revisions, mapped onto the 34-card taxonomy.
// 1) the old 6x4 swimlane board (math / physics / compute columns);
// 2) the first 5-layer board (4 / 6 / 6 / 6 / 7 cards).
// Old engineering swimlane cells spanned several domains and are dropped.
const LEGACY_IDS: Record<string, string> = {
  // 6x4 swimlane board
  'la-math': 'l2-la', 'la-phys': 'l3-qm', 'la-comp': 'l4-eigen',
  'vc-math': 'l2-vc', 'vc-phys': 'l3-fl-tr', 'vc-comp': 'l4-mesh',
  'fa-math': 'l2-fa', 'fa-phys': 'l3-em', 'fa-comp': 'l4-spectral',
  'ode-math': 'l2-ode', 'ode-phys': 'l3-cm', 'ode-comp': 'l4-ode-int',
  'var-math': 'l2-var-opt', 'var-phys': 'l3-el', 'var-comp': 'l4-mesh',
  'pr-math': 'l2-prob', 'pr-phys': 'l3-td-sm', 'pr-comp': 'l4-mc-inv',
  // first 5-layer board
  'l1-dynamics': 'l1-opt', 'l1-prob': 'l1-prob-na',
  'l2-eigen': 'l2-la', 'l2-vec': 'l2-vc', 'l2-fourier': 'l2-fa', 'l2-var': 'l2-var-opt',
  'l3-quantum': 'l3-qm', 'l3-transport': 'l3-fl-tr', 'l3-wave': 'l3-em',
  'l3-mech': 'l3-cm', 'l3-energy': 'l3-el', 'l3-statphys': 'l3-td-sm',
  'l4-eigensolve': 'l4-eigen', 'l4-fvm': 'l4-mesh', 'l4-fft': 'l4-spectral',
  'l4-integrator': 'l4-ode-int', 'l4-fem': 'l4-mesh', 'l4-uq': 'l4-mc-inv',
}

const resolveId = (id: unknown): string | null => {
  if (typeof id !== 'string') return null
  const mapped = LEGACY_IDS[id] ?? id
  return CARD_BY_ID[mapped] ? mapped : null
}

/** Keep only known cards and valid statuses; migrate legacy IDs. */
function sanitizeStatuses(raw: unknown): Record<string, MasteryStatus> {
  const out: Record<string, MasteryStatus> = {}
  if (!raw || typeof raw !== 'object') return out
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const id = resolveId(k)
    if (!id || !ORDER.includes(v as MasteryStatus)) continue
    // A value stored under the new ID wins over a migrated legacy one.
    if (k !== id && id in out) continue
    out[id] = v as MasteryStatus
  }
  return out
}

const DEFAULT_STATUSES: Record<string, MasteryStatus> = { [DEFAULT_CARD_ID]: 'in_progress' }

export function useMastery() {
  const [statuses, setStatuses] = useState<Record<string, MasteryStatus>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? sanitizeStatuses(JSON.parse(raw)) : DEFAULT_STATUSES
    } catch {
      return DEFAULT_STATUSES
    }
  })

  const [currentCardId, setCurrentCardId] = useState<string>(() => {
    try {
      return resolveId(localStorage.getItem(CURRENT_KEY)) ?? DEFAULT_CARD_ID
    } catch {
      return DEFAULT_CARD_ID
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

  // Keep documents on the same origin in sync (e.g. the homepage embed and a
  // full MPCE tab). The `storage` event only fires in *other* documents.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setStatuses(sanitizeStatuses(JSON.parse(e.newValue)))
        } catch {
          // ignore malformed values
        }
      } else if (e.key === CURRENT_KEY) {
        const id = resolveId(e.newValue)
        if (id) setCurrentCardId(id)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

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
          setStatuses(sanitizeStatuses(parsed.statuses))
          const id = resolveId(parsed.currentCardId)
          if (id) setCurrentCardId(id)
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
