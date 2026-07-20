import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

function parentIdx(i: number) { return Math.floor((i - 1) / 2) }
function leftIdx(i: number) { return 2 * i + 1 }
function rightIdx(i: number) { return 2 * i + 2 }

function siftUp(arr: number[], i: number): number[] {
  const a = [...arr]
  while (i > 0 && a[parentIdx(i)] < a[i]) {
    ;[a[parentIdx(i)], a[i]] = [a[i], a[parentIdx(i)]]
    i = parentIdx(i)
  }
  return a
}

function siftDown(arr: number[], i: number): number[] {
  const a = [...arr]
  const n = a.length
  while (true) {
    let largest = i
    const l = leftIdx(i)
    const r = rightIdx(i)
    if (l < n && a[l] > a[largest]) largest = l
    if (r < n && a[r] > a[largest]) largest = r
    if (largest === i) break
    ;[a[i], a[largest]] = [a[largest], a[i]]
    i = largest
  }
  return a
}

export function DsaHeap({ onComplete }: { onComplete: () => void }) {
  const [heap, setHeap] = useState<number[]>([])
  const [insertInput, setInsertInput] = useState('')
  const [insertCount, setInsertCount] = useState(0)
  const [extractCount, setExtractCount] = useState(0)
  const [extracted, setExtracted] = useState<number[]>([])
  const [lastInserted, setLastInserted] = useState<number | null>(null)
  const [_lastExtracted, setLastExtracted] = useState<number | null>(null)

  // Priority queue demo
  const [pqDone, setPqDone] = useState(false)

  const doInsert = () => {
    const n = parseInt(insertInput, 10)
    if (isNaN(n) || n < 1 || n > 99) return
    setHeap((prev) => {
      const next = [...prev, n]
      return siftUp(next, next.length - 1)
    })
    setLastInserted(n)
    setInsertCount((c) => c + 1)
    setInsertInput('')
  }

  const doExtract = () => {
    if (heap.length === 0) return
    const max = heap[0]
    setLastExtracted(max)
    setExtracted((prev) => [...prev, max])
    setHeap((prev) => {
      if (prev.length === 1) return []
      const next = [prev[prev.length - 1], ...prev.slice(1, prev.length - 1)]
      return siftDown(next, 0)
    })
    setExtractCount((c) => c + 1)
  }

  const runPQ = () => {
    const jobs = [{ name: 'Critical bug', p: 10 }, { name: 'Feature', p: 3 }, { name: 'Docs', p: 1 }, { name: 'Security patch', p: 9 }, { name: 'Refactor', p: 5 }]
    let h: number[] = []
    for (const j of jobs) {
      h = [...h, j.p]
      h = siftUp(h, h.length - 1)
    }
    setHeap(h)
    setPqDone(true)
  }

  const isDone = insertCount >= 5 && extractCount >= 2

  // Tree visualization
  const renderTree = (i: number, x: number, y: number, spread: number): ReactNode => {
    if (i >= heap.length) return null
    const l = leftIdx(i)
    const r = rightIdx(i)
    const lx = x - spread
    const rx = x + spread
    const cy = y + 48

    return (
      <g key={i}>
        {l < heap.length && <line x1={x} y1={y} x2={lx} y2={cy} stroke="var(--border)" strokeWidth="1.5" />}
        {r < heap.length && <line x1={x} y1={y} x2={rx} y2={cy} stroke="var(--border)" strokeWidth="1.5" />}
        <motion.circle
          cx={x} cy={y} r={16}
          animate={{ fill: heap[i] === lastInserted ? 'var(--signal)' : 'var(--surface-2)' }}
          transition={{ duration: 0.3 }}
        />
        <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fill="var(--text)">
          {heap[i]}
        </text>
        {renderTree(l, lx, cy, spread * 0.55)}
        {renderTree(r, rx, cy, spread * 0.55)}
      </g>
    )
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        A <strong>max-heap</strong> always keeps the largest element at the root. Insert anywhere, sift up.
        Extract max: replace root with last element, sift down. O(log n) for both.
      </p>

      <div className="dsa-heap-layout">
        <div className="dsa-heap-tree-col">
          <span className="micro">Heap as tree:</span>
          <svg width={280} height={180} className="dsa-heap-svg">
            {heap.length > 0 ? renderTree(0, 140, 24, 70) : (
              <text x={140} y={90} textAnchor="middle" fill="var(--text-muted)" fontSize="11">Empty heap</text>
            )}
          </svg>
        </div>

        <div className="dsa-heap-array-col">
          <span className="micro">Heap as array (in sync):</span>
          <div className="dsa-heap-array">
            <AnimatePresence>
              {heap.map((v, i) => (
                <motion.div
                  key={`${i}-${v}`}
                  className="dsa-heap-cell"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  <span className="dsa-heap-cell-idx micro">[{i}]</span>
                  <span>{v}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="dsa-heap-controls">
            <div className="dsa-heap-input-row">
              <input
                type="number"
                className="dsa-heap-input"
                value={insertInput}
                onChange={(e) => setInsertInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && doInsert()}
                placeholder="1-99"
                min={1}
                max={99}
              />
              <button type="button" className="btn primary" onClick={doInsert} disabled={!insertInput}>
                Insert
              </button>
            </div>
            <button type="button" className="btn" onClick={doExtract} disabled={heap.length === 0}>
              Extract Max
            </button>
          </div>

          {extracted.length > 0 && (
            <div className="dsa-heap-extracted micro">
              Extracted order: <strong>{extracted.join(', ')}</strong>
            </div>
          )}
        </div>
      </div>

      <div className="dsa-heap-pq">
        <h3 className="micro">Priority queue demo: 5 jobs with priorities</h3>
        <button type="button" className="btn" onClick={runPQ} disabled={pqDone}>
          Load jobs by priority
        </button>
        {pqDone && (
          <p className="micro">
            Heap root = {heap[0] ?? '?'} (highest priority). Extract Max gives jobs in priority order.
          </p>
        )}
      </div>

      <p className="micro" role="status">
        Inserts: {insertCount}/5 needed. Extractions: {extractCount}/2 needed.
      </p>

      <ConnectionCard
        title="Dijkstra's algorithm uses a min-heap to always process the nearest unvisited node first"
        body={
          <>
            Every time Dijkstra extracts the minimum-distance node it uses a priority queue backed by a heap.
            Without the heap, each extraction is O(n); with it, O(log n). That is the difference between a
            road network navigator and a timeout. You will use this in two steps.
          </>
        }
        appearsIn={['DsaDijkstra step', 'operating system CPU scheduler (priority queue)', 'network packet scheduling']}
        hook="Heaps give you the min/max fast. Next: AVL trees — how to keep BSTs balanced automatically."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!isDone}>
          Continue to AVL trees
        </button>
        {!isDone && (
          <span className="hint">
            {insertCount < 5 ? `Insert ${5 - insertCount} more values. ` : ''}
            {extractCount < 2 ? `Extract max ${2 - extractCount} more time${2 - extractCount !== 1 ? 's' : ''}. ` : ''}
          </span>
        )}
      </div>
    </div>
  )
}
