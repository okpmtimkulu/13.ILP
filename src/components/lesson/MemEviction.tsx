import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

// Address sequence using labels A-G, some repeated
const SEQUENCE = ['A', 'B', 'C', 'D', 'A', 'E', 'B', 'A', 'F', 'C', 'G', 'A'] as const
type AddrLabel = (typeof SEQUENCE)[number]

const ADDR_VALUES: Record<AddrLabel, number> = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 }

interface CacheLine {
  label: AddrLabel | null
  age: number // 1 = most recently used, 4 = least recently used
}

const EMPTY_LINE: CacheLine = { label: null, age: 0 }

export function MemEviction({ onComplete }: { onComplete: () => void }) {
  const [cache, setCache] = useState<CacheLine[]>([EMPTY_LINE, EMPTY_LINE, EMPTY_LINE, EMPTY_LINE])
  const [reqIdx, setReqIdx] = useState(0)
  const [log, setLog] = useState<{ label: AddrLabel; result: 'HIT' | 'MISS'; evicted: AddrLabel | null }[]>([])
  const [pendingEviction, setPendingEviction] = useState<{ slot: number; lruSlot: number } | null>(null)
  const [lastFeedback, setLastFeedback] = useState<{ correct: boolean; msg: string } | null>(null)
  const [showCard, setShowCard] = useState(false)
  const [done, setDone] = useState(false)

  const hits = log.filter((l) => l.result === 'HIT').length
  const total = log.length
  const hitRate = total > 0 ? Math.round((hits / total) * 100) : 0

  const processNext = () => {
    if (reqIdx >= SEQUENCE.length || pendingEviction) return
    const label = SEQUENCE[reqIdx]
    const hitSlot = cache.findIndex((c) => c.label === label)

    if (hitSlot !== -1) {
      // HIT — update ages
      const newCache = cache.map((c, i) => {
        if (i === hitSlot) return { ...c, age: 1 }
        if (c.label !== null && c.age < cache[hitSlot].age) return { ...c, age: c.age + 1 }
        return c
      })
      // Recompute ages properly: set hitSlot to 1, increment all others that were < hitSlot age
      const reaged = newCache.map((c, i) => {
        if (i === hitSlot) return { label, age: 1 }
        if (c.label !== null) return { ...c, age: Math.min(c.age + 1, 4) }
        return c
      })
      setCache(reaged)
      const newLog = [...log, { label, result: 'HIT' as const, evicted: null }]
      setLog(newLog)
      setReqIdx(reqIdx + 1)
      if (reqIdx + 1 >= SEQUENCE.length) setDone(true)
    } else {
      // MISS — need slot
      const emptySlot = cache.findIndex((c) => c.label === null)
      if (emptySlot !== -1) {
        // Fill empty
        const newCache = cache.map((c, i) => {
          if (i === emptySlot) return { label, age: 1 }
          if (c.label !== null) return { ...c, age: Math.min(c.age + 1, 4) }
          return c
        })
        setCache(newCache)
        const newLog = [...log, { label, result: 'MISS' as const, evicted: null }]
        setLog(newLog)
        setReqIdx(reqIdx + 1)
        if (reqIdx + 1 >= SEQUENCE.length) setDone(true)
      } else {
        // Need to evict — ask user
        const lruSlot = cache.reduce((maxI, c, i) => (c.age > cache[maxI].age ? i : maxI), 0)
        setPendingEviction({ slot: -1, lruSlot })
      }
    }
  }

  const handleEvictClick = (slotIdx: number) => {
    if (!pendingEviction) return
    const label = SEQUENCE[reqIdx]
    const { lruSlot } = pendingEviction
    const correct = slotIdx === lruSlot
    const evictedLabel = cache[lruSlot].label

    if (correct) {
      setLastFeedback({ correct: true, msg: `Correct! Slot ${lruSlot} held "${evictedLabel}" — used ${cache[lruSlot].age} requests ago.` })
      setShowCard(true)
    } else {
      setLastFeedback({
        correct: false,
        msg: `Not quite. Slot ${lruSlot} holds "${cache[lruSlot].label}" — last used ${cache[lruSlot].age} requests ago. That is the LRU slot.`,
      })
    }

    const newCache = cache.map((c, i) => {
      if (i === lruSlot) return { label, age: 1 }
      return { ...c, age: Math.min(c.age + 1, 4) }
    })
    setCache(newCache)
    const newLog = [...log, { label, result: 'MISS' as const, evicted: evictedLabel }]
    setLog(newLog)
    setPendingEviction(null)
    const newReqIdx = reqIdx + 1
    setReqIdx(newReqIdx)
    if (newReqIdx >= SEQUENCE.length) setDone(true)
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        A 4-slot LRU cache evicts the <strong>least recently used</strong> line when it is full. Each slot shows an
        age badge (1 = freshest, 4 = stalest). When a miss happens and the cache is full, click the slot you think
        should be evicted.
      </p>
      <p className="micro">
        Sequence: {SEQUENCE.join(' → ')}
        <br />
        Next: {reqIdx < SEQUENCE.length ? <strong>{SEQUENCE[reqIdx]}</strong> : <em>complete</em>}
        {' · '}Hit rate: {hitRate}% ({hits}/{total})
      </p>

      <div className="mem-eviction-cache">
        {cache.map((line, i) => (
          <motion.button
            key={i}
            type="button"
            className={`mem-eviction-slot ${pendingEviction ? 'mem-eviction-slot--selectable' : ''} ${
              pendingEviction?.lruSlot === i ? 'mem-eviction-slot--lru' : ''
            }`}
            onClick={() => pendingEviction && handleEvictClick(i)}
            disabled={!pendingEviction}
            animate={{
              scale: pendingEviction && pendingEviction.lruSlot === i ? 1.03 : 1,
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <span className="mem-eviction-slot-label">Slot {i}</span>
            <span className="mem-eviction-slot-data">{line.label ?? '—'}</span>
            {line.label && (
              <span className="mem-eviction-age-badge" data-age={line.age}>
                age {line.age}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {pendingEviction && (
        <motion.p
          className="mem-eviction-prompt"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          Cache full! Loading <strong>{SEQUENCE[reqIdx]}</strong> — click the slot you would evict.
        </motion.p>
      )}

      {lastFeedback && (
        <motion.div
          className={`mem-eviction-feedback ${lastFeedback.correct ? 'mem-eviction-feedback--correct' : 'mem-eviction-feedback--wrong'}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          {lastFeedback.msg}
        </motion.div>
      )}

      <div className="mem-eviction-log">
        {log.slice(-6).map((entry, i) => (
          <span key={i} className={`mem-cache-log-entry mem-cache-log-entry--${entry.result.toLowerCase()}`}>
            {entry.label}: {entry.result}{entry.evicted ? ` (evicted ${entry.evicted})` : ''}
          </span>
        ))}
      </div>

      {showCard && (
        <ConnectionCard
          title="LRU is used in CPU caches, DNS caches, and content delivery networks"
          body={
            <>
              Nginx, Redis, the Linux page cache, and your browser's HTTP cache all implement LRU or an
              approximation of it. The insight is simple: if you have not used something recently, you are
              unlikely to need it soon. That heuristic is wrong sometimes — but right often enough to be worth it.
            </>
          }
          appearsIn={['virtual memory and paging', 'operating system page replacement', 'Redis eviction policies']}
          hook="You just managed a cache manually. Next: how programs see more memory than physically exists."
        />
      )}

      <div className="lesson-actions">
        {!pendingEviction && !done && (
          <button type="button" className="btn primary" onClick={processNext}>
            Next address
          </button>
        )}
        <button type="button" className="btn primary" onClick={onComplete} disabled={!done}>
          Continue to virtual memory
        </button>
        {!done && <span className="hint">Process all {SEQUENCE.length} addresses to continue.</span>}
      </div>
    </div>
  )
}
