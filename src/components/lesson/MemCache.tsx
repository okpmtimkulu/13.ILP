import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

interface CacheSlot {
  valid: boolean
  tag: number
  data: string
}

const REQUESTS = [12, 5, 9, 5, 12, 3, 9, 12]

const EMPTY_SLOT: CacheSlot = { valid: false, tag: -1, data: '' }

type SlotFlash = 'hit' | 'miss' | null

export function MemCache({ onComplete }: { onComplete: () => void }) {
  const [slots, setSlots] = useState<CacheSlot[]>([EMPTY_SLOT, EMPTY_SLOT, EMPTY_SLOT, EMPTY_SLOT])
  const [reqIdx, setReqIdx] = useState(0)
  const [flashes, setFlashes] = useState<SlotFlash[]>([null, null, null, null])
  const [log, setLog] = useState<{ addr: number; result: 'HIT' | 'MISS'; slot: number }[]>([])
  const [showCard, setShowCard] = useState(false)
  const [done, setDone] = useState(false)

  const hits = log.filter((l) => l.result === 'HIT').length

  const nextRequest = () => {
    if (reqIdx >= REQUESTS.length) return
    const addr = REQUESTS[reqIdx]
    const slot = addr % 4
    const tag = Math.floor(addr / 4)
    const existing = slots[slot]
    const isHit = existing.valid && existing.tag === tag

    const newFlashes: SlotFlash[] = [null, null, null, null]
    newFlashes[slot] = isHit ? 'hit' : 'miss'
    setFlashes(newFlashes)

    const newSlots = [...slots]
    newSlots[slot] = { valid: true, tag, data: `addr ${addr}` }
    setSlots(newSlots)

    const entry = { addr, result: isHit ? ('HIT' as const) : ('MISS' as const), slot }
    const newLog = [...log, entry]
    setLog(newLog)

    const newReqIdx = reqIdx + 1
    setReqIdx(newReqIdx)

    if (newLog.filter((l) => l.result === 'HIT').length >= 3) setShowCard(true)
    if (newReqIdx >= REQUESTS.length) setDone(true)

    setTimeout(() => setFlashes([null, null, null, null]), 600)
  }

  const totalProcessed = reqIdx
  const hitRate = totalProcessed > 0 ? Math.round((hits / totalProcessed) * 100) : 0

  return (
    <div className="lesson-panel">
      <p className="lede">
        A direct-mapped cache has 4 slots. Each memory address maps to exactly one slot:{' '}
        <strong>slot = address mod 4</strong>. If the slot holds the right tag, it's a{' '}
        <span style={{ color: 'var(--teal, #2dd4bf)' }}>HIT</span>. Otherwise it's a{' '}
        <span style={{ color: 'var(--red, #f87171)' }}>MISS</span> — load from RAM and overwrite.
      </p>
      <p className="micro">
        Next address: {reqIdx < REQUESTS.length ? <strong>{REQUESTS[reqIdx]}</strong> : <em>all done</em>} &nbsp;·&nbsp;
        Slot = {reqIdx < REQUESTS.length ? REQUESTS[reqIdx] % 4 : '—'} &nbsp;·&nbsp;
        Tag = {reqIdx < REQUESTS.length ? Math.floor(REQUESTS[reqIdx] / 4) : '—'}
      </p>

      <div className="mem-cache-board">
        <div className="mem-cache-slots">
          {slots.map((s, i) => (
            <motion.div
              key={i}
              className="mem-cache-slot"
              animate={{
                backgroundColor:
                  flashes[i] === 'hit'
                    ? 'rgba(45,212,191,0.25)'
                    : flashes[i] === 'miss'
                    ? 'rgba(248,113,113,0.25)'
                    : 'var(--surface-2, #1e293b)',
                outline:
                  flashes[i] === 'hit'
                    ? '2px solid var(--teal, #2dd4bf)'
                    : flashes[i] === 'miss'
                    ? '2px solid var(--red, #f87171)'
                    : '2px solid transparent',
              }}
              transition={{ duration: 0.25 }}
            >
              <span className="mem-cache-slot-label">Slot {i}</span>
              <span className="mem-cache-valid">{s.valid ? '✓' : '–'}</span>
              <span className="mem-cache-tag">tag: {s.valid ? s.tag : '—'}</span>
              <span className="mem-cache-data">{s.valid ? s.data : 'empty'}</span>
              {flashes[i] && (
                <motion.span
                  className={`mem-cache-flash mem-cache-flash--${flashes[i]}`}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {flashes[i] === 'hit' ? 'HIT' : 'MISS'}
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mem-cache-stats">
          <div className="mem-cache-stat">
            <span className="mem-cache-stat-label">Requests</span>
            <span className="mem-cache-stat-value">{totalProcessed} / {REQUESTS.length}</span>
          </div>
          <div className="mem-cache-stat">
            <span className="mem-cache-stat-label">Hits</span>
            <span className="mem-cache-stat-value" style={{ color: 'var(--teal, #2dd4bf)' }}>{hits}</span>
          </div>
          <div className="mem-cache-stat">
            <span className="mem-cache-stat-label">Hit rate</span>
            <span className="mem-cache-stat-value">{hitRate}%</span>
          </div>
        </div>
      </div>

      <div className="mem-cache-log">
        {log.map((entry, i) => (
          <span
            key={i}
            className={`mem-cache-log-entry mem-cache-log-entry--${entry.result.toLowerCase()}`}
          >
            addr {entry.addr} → slot {entry.slot}: {entry.result}
          </span>
        ))}
      </div>

      <div className="lesson-actions">
        {!done && (
          <button type="button" className="btn primary" onClick={nextRequest}>
            Next request
          </button>
        )}
      </div>

      {showCard && (
        <ConnectionCard
          title="Your brain is doing this right now"
          body={
            <>
              Your hippocampus caches frequently accessed memories. Street names near your home are in cache. The
              name of a city you visited once is not — and recalling it takes noticeably longer, just like a cache
              miss forces a RAM access.
            </>
          }
          appearsIn={['the LRU eviction lab', 'CPU profiling tools', 'browser HTTP caches']}
          hook="Caches fill fast. Next: what happens when every slot is taken and a new address arrives?"
        />
      )}

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!done}>
          Continue to the hierarchy
        </button>
        {!done && <span className="hint">Process all {REQUESTS.length} requests to continue.</span>}
      </div>
    </div>
  )
}
