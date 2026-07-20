import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

interface MemLevel {
  name: string
  latency: string
  size: string
  color: string
}

const LEVELS: MemLevel[] = [
  { name: 'Registers', latency: '1 ns', size: '~1 KB', color: '#a78bfa' },
  { name: 'L1 Cache', latency: '4 ns', size: '32 KB', color: '#2dd4bf' },
  { name: 'L2 Cache', latency: '12 ns', size: '256 KB', color: '#34d399' },
  { name: 'L3 Cache', latency: '40 ns', size: '8 MB', color: '#facc15' },
  { name: 'RAM', latency: '100 ns', size: '16 GB', color: '#fb923c' },
  { name: 'SSD', latency: '100 µs', size: '1 TB', color: '#f87171' },
]

type DotColor = 'purple' | 'teal' | 'yellow' | 'red'

function getDotColor(hitLevel: number): DotColor {
  if (hitLevel === 0) return 'purple'
  if (hitLevel <= 3) return 'teal'
  if (hitLevel === 4) return 'yellow'
  return 'red'
}

export function MemHierarchy({ onComplete }: { onComplete: () => void }) {
  const [requestCount, setRequestCount] = useState(0)
  const [activeDot, setActiveDot] = useState<{ level: number; color: DotColor } | null>(null)
  const [latencyMs, setLatencyMs] = useState<string | null>(null)
  const [showCard, setShowCard] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [firstDone, setFirstDone] = useState(false)

  const triggerRequest = () => {
    if (animating) return
    setAnimating(true)
    setLatencyMs(null)

    // Randomly pick a hit level weighted toward cache hits in practice
    const roll = Math.random()
    const hitLevel = roll < 0.4 ? 1 : roll < 0.65 ? 2 : roll < 0.8 ? 3 : roll < 0.92 ? 4 : 5
    const color = getDotColor(hitLevel)
    const newCount = requestCount + 1
    setRequestCount(newCount)

    let level = 0
    const step = () => {
      setActiveDot({ level, color })
      if (level < hitLevel) {
        setTimeout(() => {
          level++
          step()
        }, 320)
      } else {
        setLatencyMs(LEVELS[hitLevel].latency)
        if (newCount >= 3) setShowCard(true)
        setFirstDone(true)
        setTimeout(() => {
          setActiveDot(null)
          setAnimating(false)
        }, 800)
      }
    }
    step()
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        When the CPU needs data, it checks each layer of the hierarchy in order — fastest first. It stops at the
        first hit. The animated dot shows where the data was found and how long it took.
      </p>
      <p className="micro">Click "Request data" to send a memory read. Watch the dot fall through the layers.</p>

      <div className="mem-hierarchy-board">
        {LEVELS.map((level, i) => (
          <motion.div
            key={level.name}
            className="mem-hierarchy-level"
            animate={{
              backgroundColor:
                activeDot?.level === i
                  ? `${level.color}22`
                  : 'transparent',
              outline:
                activeDot?.level === i
                  ? `2px solid ${level.color}`
                  : '2px solid var(--surface-3, #334155)',
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="mem-hierarchy-level-info">
              <span className="mem-hierarchy-name">{level.name}</span>
              <span className="mem-hierarchy-latency" style={{ color: level.color }}>
                {level.latency}
              </span>
              <span className="mem-hierarchy-size">{level.size}</span>
            </div>
            <AnimatePresence>
              {activeDot?.level === i && (
                <motion.div
                  className="mem-hierarchy-dot"
                  style={{ backgroundColor: level.color }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {latencyMs && (
        <motion.div
          className="mem-latency-display"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          Data found at <strong>{LEVELS[LEVELS.findIndex((_, i) => i === (activeDot?.level ?? LEVELS.length - 1))]?.name ?? 'SSD'}</strong> — latency: <strong>{latencyMs}</strong>
        </motion.div>
      )}

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={triggerRequest} disabled={animating}>
          Request data ({requestCount} so far)
        </button>
      </div>

      {showCard && (
        <ConnectionCard
          title="Every website you open triggers thousands of these lookups"
          body={
            <>
              When Chrome loads a page, the JavaScript engine traverses the DOM, looks up styles, and accesses
              object properties — each of those is a memory read that cascades through this same hierarchy. A cache
              miss to RAM adds 100 ns. A page fault to SSD adds 100,000 ns. The difference is the gap between a
              fast website and a slow one.
            </>
          }
          appearsIn={['the eviction lab next', 'virtual memory', 'operating system page caches']}
          hook="The hierarchy is full of data now. What happens when a new address needs a slot that is occupied?"
        />
      )}

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!firstDone}>
          Continue to eviction
        </button>
        {!firstDone && <span className="hint">Click "Request data" to start the animation.</span>}
      </div>
    </div>
  )
}
