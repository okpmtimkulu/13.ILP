import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

interface Curve {
  id: string
  label: string
  color: string
  fn: (n: number) => number
  examples: string[]
}

const CURVES: Curve[] = [
  { id: 'o1', label: 'O(1)', color: '#3ecf8e', fn: () => 1, examples: ['Array access', 'Hash table lookup'] },
  { id: 'ologn', label: 'O(log n)', color: '#6366f1', fn: (n) => Math.log2(n), examples: ['Binary search', 'BST search'] },
  { id: 'on', label: 'O(n)', color: '#f59e0b', fn: (n) => n, examples: ['Linear scan', 'Array traverse'] },
  { id: 'onlogn', label: 'O(n log n)', color: '#ec4899', fn: (n) => n * Math.log2(n), examples: ['Merge sort', 'Heap sort'] },
  { id: 'on2', label: 'O(n²)', color: '#ef4444', fn: (n) => n * n, examples: ['Bubble sort', 'Naive string match'] },
]

const LABELS = [
  { id: 'array-access', text: 'Array access', correct: 'o1' },
  { id: 'binary-search', text: 'Binary search', correct: 'ologn' },
  { id: 'linear-scan', text: 'Linear scan', correct: 'on' },
  { id: 'merge-sort', text: 'Merge sort', correct: 'onlogn' },
  { id: 'bubble-sort', text: 'Bubble sort', correct: 'on2' },
]

const N_VALS = [1, 5, 10, 20, 50, 100]

export function DsaBigO({ onComplete }: { onComplete: () => void }) {
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({})
  const [raceN] = useState(100)
  const [raceRun, setRaceRun] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)

  const assignLabel = (labelId: string, curveId: string) => {
    setAssignments((prev) => ({ ...prev, [labelId]: curveId }))
    const label = LABELS.find((l) => l.id === labelId)
    if (label && label.correct === curveId) {
      setConfirmed((prev) => ({ ...prev, [labelId]: true }))
    }
  }

  const allCorrect = LABELS.every((l) => confirmed[l.id])
  const isDone = allCorrect && raceRun

  // SVG chart
  const W = 320
  const H = 160
  const PAD = 30
  const maxN = 20
  const nMax = CURVES[CURVES.length - 1].fn(maxN)

  const toSvgX = (n: number) => PAD + ((n - 1) / (maxN - 1)) * (W - PAD * 2)
  const toSvgY = (val: number) => H - PAD - (Math.min(val, nMax) / nMax) * (H - PAD * 2)

  const makePoints = (curve: Curve) => {
    const pts: string[] = []
    for (let n = 1; n <= maxN; n++) {
      pts.push(`${toSvgX(n)},${toSvgY(curve.fn(n))}`)
    }
    return pts.join(' ')
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        <strong>Big-O notation</strong> describes how runtime grows with input size. Drag algorithm labels to
        the correct curves, then watch a race at n=100.
      </p>

      {/* Chart */}
      <div className="dsa-bigo-chart-wrap">
        <svg width={W} height={H} className="dsa-bigo-svg">
          {/* axes */}
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="var(--border)" />
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--border)" />
          <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="9" fill="var(--text-muted)">n (input size)</text>
          <text x={6} y={H / 2} textAnchor="middle" fontSize="9" fill="var(--text-muted)" transform={`rotate(-90, 6, ${H / 2})`}>ops</text>

          {CURVES.map((c) => (
            <polyline
              key={c.id}
              points={makePoints(c)}
              fill="none"
              stroke={c.color}
              strokeWidth="2"
            />
          ))}

          {CURVES.map((c) => {
            const lastX = toSvgX(maxN)
            const lastY = toSvgY(c.fn(maxN))
            return (
              <text key={c.id} x={lastX + 3} y={Math.max(lastY, PAD + 4)} fontSize="8" fill={c.color}>
                {c.label}
              </text>
            )
          })}
        </svg>
      </div>

      {/* Label matching */}
      <div className="dsa-bigo-match">
        <div className="dsa-bigo-labels-col">
          <span className="micro">Click an algorithm label, then click a curve below:</span>
          {LABELS.map((l) => (
            <motion.button
              key={l.id}
              type="button"
              className={`dsa-bigo-label-btn ${selectedLabel === l.id ? 'is-selected' : ''} ${confirmed[l.id] ? 'is-correct' : assignments[l.id] && !confirmed[l.id] ? 'is-wrong' : ''}`}
              onClick={() => setSelectedLabel(selectedLabel === l.id ? null : l.id)}
              animate={{ scale: selectedLabel === l.id ? 1.05 : 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              {l.text}
              {confirmed[l.id] && ' ✓'}
            </motion.button>
          ))}
        </div>

        <div className="dsa-bigo-curves-col">
          <span className="micro">Click a complexity class to assign:</span>
          {CURVES.map((c) => (
            <button
              key={c.id}
              type="button"
              className="dsa-bigo-curve-btn"
              style={{ borderColor: c.color, color: c.color }}
              onClick={() => {
                if (selectedLabel) {
                  assignLabel(selectedLabel, c.id)
                  setSelectedLabel(null)
                }
              }}
              disabled={!selectedLabel}
            >
              {c.label}
              <span className="micro"> — {c.examples.join(', ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Race animation */}
      {allCorrect && (
        <div className="dsa-bigo-race">
          <h3 className="micro">Race: all five algorithms at n = {raceN}</h3>
          {!raceRun && (
            <button type="button" className="btn primary" onClick={() => setRaceRun(true)}>
              Run race
            </button>
          )}
          {raceRun && (
            <div className="dsa-bigo-race-bars">
              {CURVES.map((c) => {
                const ops = Math.min(c.fn(raceN), 10000)
                const maxOps = Math.min(CURVES[CURVES.length - 1].fn(raceN), 10000)
                const pct = (ops / maxOps) * 100
                return (
                  <div key={c.id} className="dsa-bigo-race-row">
                    <span className="dsa-bigo-race-label micro">{c.label}</span>
                    <motion.div
                      className="dsa-bigo-race-bar"
                      style={{ backgroundColor: c.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.1 }}
                    />
                    <span className="micro">{c.fn(raceN) > 10000 ? '>10000' : Math.round(c.fn(raceN)).toLocaleString()}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      <ConnectionCard
        title="Every job interview question about algorithms is secretly a question about Big-O"
        body={
          <>
            When an interviewer asks "can you do better?" they mean "can you reduce the Big-O class?" Going from
            O(n²) to O(n log n) on a 10-million-element dataset is the difference between a 20-hour job and a
            40-second job. The curves you plotted are the reason engineers care.
          </>
        }
        appearsIn={['every algorithm analysis in this chapter', 'system design interviews', 'DsaComplexity — the limits of what is possible']}
        hook="Big-O tells you how hard a problem is to solve. Next: complexity theory — what if a problem is so hard no efficient algorithm can exist?"
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!isDone}>
          Continue to complexity theory
        </button>
        {!isDone && (
          <span className="hint">
            {!allCorrect ? 'Match all algorithm labels to their Big-O curve. ' : ''}
            {!raceRun ? 'Run the race to see the difference at n=100. ' : ''}
          </span>
        )}
      </div>
    </div>
  )
}
