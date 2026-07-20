import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

const INITIAL_BUCKETS = 7

function simpleHash(key: string, buckets: number): number {
  return key.length % buckets
}

interface HashEntry {
  key: string
  value: string
}

type Bucket = HashEntry[]

export function DsaHash({ onComplete }: { onComplete: () => void }) {
  const [buckets, setBuckets] = useState<Bucket[]>(Array.from({ length: INITIAL_BUCKETS }, () => []))
  const [keyInput, setKeyInput] = useState('')
  const [valInput, setValInput] = useState('')
  const [lastHash, setLastHash] = useState<number | null>(null)
  const [insertCount, setInsertCount] = useState(0)
  const [collisionDone, setCollisionDone] = useState(false)
  const [resizeDone, setResizeDone] = useState(false)
  const [animatingBucket, setAnimatingBucket] = useState<number | null>(null)

  const bucketCount = buckets.length
  const totalItems = buckets.reduce((s, b) => s + b.length, 0)
  const loadFactor = totalItems / bucketCount

  const doInsert = () => {
    if (!keyInput.trim()) return
    const h = simpleHash(keyInput, bucketCount)
    setLastHash(h)
    setAnimatingBucket(h)
    setTimeout(() => setAnimatingBucket(null), 800)
    setBuckets((prev) => {
      const next = prev.map((b) => [...b])
      next[h] = [...next[h].filter((e) => e.key !== keyInput), { key: keyInput, value: valInput || 'v' }]
      return next
    })
    setInsertCount((c) => c + 1)
    setKeyInput('')
    setValInput('')
  }

  const insertCollision = () => {
    // Insert two keys that hash to the same bucket with 7 buckets
    // Keys with length 4 both hash to bucket 4
    const pairs: [string, string][] = [['name', 'Alice'], ['role', 'admin']]
    let h = -1
    setBuckets((prev) => {
      const next = prev.map((b) => [...b])
      for (const [k, v] of pairs) {
        h = simpleHash(k, bucketCount)
        next[h] = [...next[h].filter((e) => e.key !== k), { key: k, value: v }]
      }
      return next
    })
    setLastHash(h)
    setCollisionDone(true)
    setInsertCount((c) => c + 2)
  }

  const doResize = () => {
    const newCount = bucketCount * 2
    const allEntries: HashEntry[] = buckets.flat()
    const newBuckets: Bucket[] = Array.from({ length: newCount }, () => [])
    for (const entry of allEntries) {
      const h = simpleHash(entry.key, newCount)
      newBuckets[h].push(entry)
    }
    setBuckets(newBuckets)
    setLastHash(null)
    setResizeDone(true)
  }

  const isDone = insertCount >= 2 && collisionDone && resizeDone

  return (
    <div className="lesson-panel">
      <p className="lede">
        A <strong>hash table</strong> maps keys to buckets via a hash function. The goal: O(1) average lookup.
        Watch what happens on collision, and why resizing keeps performance healthy.
      </p>

      <div className="dsa-hash-controls">
        <div className="dsa-hash-input-row">
          <input
            type="text"
            className="dsa-hash-input"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doInsert()}
            placeholder="key"
          />
          <input
            type="text"
            className="dsa-hash-input"
            value={valInput}
            onChange={(e) => setValInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doInsert()}
            placeholder="value"
          />
          <button type="button" className="btn primary" onClick={doInsert} disabled={!keyInput.trim()}>
            Insert
          </button>
        </div>
        <div className="dsa-hash-btn-row">
          <button type="button" className="btn" onClick={insertCollision} disabled={collisionDone}>
            Trigger collision (insert "name" + "role")
          </button>
          <button type="button" className="btn" onClick={doResize} disabled={resizeDone}>
            Resize × 2 and rehash
          </button>
        </div>
      </div>

      {lastHash !== null && (
        <p className="micro" role="status">
          hash(key, {bucketCount}) = key.length % {bucketCount} = <strong>{lastHash}</strong>
        </p>
      )}

      <div className="dsa-hash-table" role="list" aria-label="Hash table buckets">
        {buckets.map((bucket, i) => (
          <motion.div
            key={i}
            className={`dsa-hash-bucket ${animatingBucket === i ? 'is-active' : ''}`}
            animate={{
              borderColor: animatingBucket === i ? 'var(--signal)' : 'var(--border)',
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            role="listitem"
          >
            <span className="dsa-hash-bucket-idx micro">[{i}]</span>
            <div className="dsa-hash-bucket-entries">
              <AnimatePresence>
                {bucket.map((entry, j) => (
                  <motion.div
                    key={`${entry.key}-${j}`}
                    className="dsa-hash-entry"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  >
                    <span className="dsa-hash-key">{entry.key}</span>
                    <span className="dsa-hash-sep">:</span>
                    <span className="dsa-hash-val">{entry.value}</span>
                    {j < bucket.length - 1 && <span className="dsa-hash-chain">→</span>}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="dsa-hash-gauge">
        <span className="micro">Load factor: {loadFactor.toFixed(2)} ({totalItems} items / {bucketCount} buckets)</span>
        <div className="dsa-hash-gauge-bar">
          <motion.div
            className="dsa-hash-gauge-fill"
            animate={{ width: `${Math.min(loadFactor * 100, 100)}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            style={{ backgroundColor: loadFactor > 0.7 ? 'var(--danger, #ef4444)' : 'var(--signal)' }}
          />
        </div>
      </div>

      <ConnectionCard
        title="Python dicts, JavaScript objects, and database indexes all do this"
        body={
          <>
            Python resizes at 67% load factor — when 2/3 full, it allocates a bigger array and rehashes
            everything. JavaScript V8 engine objects work similarly. This rehashing is the "hidden O(n)" that
            amortizes to O(1) over many operations.
          </>
        }
        appearsIn={['DsaComplexity amortized analysis', 'databases chapter hash indexes', 'MathProb birthday problem']}
        hook="Single values. Sorted trees. O(1) hash lookup. What about ordering data for fastest sort? Next: sorting."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!isDone}>
          Continue to sorting
        </button>
        {!isDone && (
          <span className="hint">
            {insertCount < 2 ? 'Insert more items. ' : ''}
            {!collisionDone ? 'Trigger a collision. ' : ''}
            {!resizeDone ? 'Resize the table. ' : ''}
          </span>
        )}
      </div>
    </div>
  )
}
