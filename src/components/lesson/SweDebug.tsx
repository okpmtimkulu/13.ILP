import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

// The "program" has 100 units. The bug is in region B (positions 33-66).
// Checkpoints reveal wrong values in the region containing the bug.
type CheckpointResult = 'correct' | 'wrong'

const BUG_POSITION = 50 // bug is at the midpoint of region B

function checkpointValue(position: number): CheckpointResult {
  // Wrong if checkpoint is after the bug, correct if before
  return position > BUG_POSITION ? 'wrong' : 'correct'
}

type Checkpoint = { position: number; result: CheckpointResult }

export function SweDebug({ onComplete }: { onComplete: () => void }) {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [bugFound, setBugFound] = useState(false)
  const [bugFixed, setBugFixed] = useState(false)
  const [done, setDone] = useState(false)

  const addCheckpoint = () => {
    if (checkpoints.length === 0) {
      // First checkpoint: midpoint of 0-100
      const pos = 50
      const result = checkpointValue(pos)
      setCheckpoints([{ position: pos, result }])
      return
    }

    const last = checkpoints[checkpoints.length - 1]
    let low = 0
    let high = 100

    // Narrow the range based on existing checkpoints
    for (const cp of checkpoints) {
      if (cp.result === 'wrong') {
        // Bug is before this checkpoint
        if (cp.position < high) high = cp.position
      } else {
        // Bug is after this checkpoint
        if (cp.position > low) low = cp.position
      }
    }

    const pos = Math.round((low + high) / 2)
    if (pos === last.position) {
      setBugFound(true)
      return
    }
    const result = checkpointValue(pos)
    setCheckpoints((prev) => [...prev, { position: pos, result }])

    // Check if bug is found
    const newLow = result === 'correct' ? pos : low
    const newHigh = result === 'wrong' ? pos : high
    if (newHigh - newLow <= 5) {
      setTimeout(() => setBugFound(true), 500)
    }
  }

  // Calculate current search range
  let low = 0
  let high = 100
  for (const cp of checkpoints) {
    if (cp.result === 'wrong') {
      if (cp.position < high) high = cp.position
    } else {
      if (cp.position > low) low = cp.position
    }
  }
  const range = high - low
  const narrowed = checkpoints.length >= 2

  const sections = [
    { label: 'A: Input parsing', range: [0, 33] },
    { label: 'B: Core calculation', range: [33, 66] },
    { label: 'C: Output formatting', range: [66, 100] },
  ]

  return (
    <div className="lesson-panel">
      <p className="lede">
        Expected output: <strong>42</strong>. Actual output: <strong>0</strong>. The bug is in one of three regions.
        Use binary search: add a checkpoint at the midpoint, see if the value is correct there, then narrow the range.
      </p>

      <div className="swe-debug-stage">
        <div className="swe-debug-bar-wrap">
          <div className="swe-debug-bar">
            {sections.map((s) => (
              <div
                key={s.label}
                className={`swe-debug-section ${bugFound && s.range[0] >= low && s.range[1] <= high + 5 ? 'swe-debug-section--bug' : ''}`}
                style={{ width: `${s.range[1] - s.range[0]}%` }}
              >
                <span className="micro">{s.label}</span>
              </div>
            ))}
            {/* Checkpoints */}
            {checkpoints.map((cp, i) => (
              <motion.div
                key={i}
                className={`swe-debug-checkpoint ${cp.result === 'correct' ? 'swe-debug-cp--ok' : 'swe-debug-cp--wrong'}`}
                style={{ left: `${cp.position}%` }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                title={`Position ${cp.position}%: value is ${cp.result}`}
              />
            ))}
            {/* Search range highlight */}
            <motion.div
              className="swe-debug-range"
              style={{ left: `${low}%`, width: `${range}%` }}
              animate={{ left: `${low}%`, width: `${range}%` }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            />
          </div>
        </div>

        <div className="swe-debug-stats">
          <div className="swe-debug-stat">
            <span className="micro">Search space</span>
            <motion.span
              key={range}
              className="swe-debug-stat-val"
              animate={{ scale: [1.2, 1] }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              {range}%
            </motion.span>
          </div>
          <div className="swe-debug-stat">
            <span className="micro">Checkpoints added</span>
            <span className="swe-debug-stat-val">{checkpoints.length}</span>
          </div>
        </div>

        <div className="swe-debug-log">
          {checkpoints.map((cp, i) => (
            <motion.div
              key={i}
              className={`swe-debug-log-entry ${cp.result === 'correct' ? 'db-acid-ok' : 'sec-sig-result--invalid'}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              Checkpoint at {cp.position}%: value is <strong>{cp.result}</strong>
              {cp.result === 'wrong' ? ' → bug is before this point' : ' → bug is after this point'}
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {bugFound && (
            <motion.div
              className="swe-debug-found"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <strong>Bug found in region B (Core calculation)</strong>
              <p className="micro">
                Binary search narrowed the search space from 100% → {range}% in {checkpoints.length} steps.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="lesson-actions">
        {!bugFixed && !bugFound && (
          <button type="button" className="btn primary" onClick={addCheckpoint} disabled={bugFound}>
            Add checkpoint (bisect)
          </button>
        )}
        {bugFound && !bugFixed && (
          <button
            type="button"
            className="btn primary"
            onClick={() => setBugFixed(true)}
          >
            Fix bug in region B
          </button>
        )}
        {bugFixed && !done && (
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setDone(true)
              onComplete()
            }}
          >
            Continue
          </button>
        )}
        {!bugFound && <span className="hint">Add at least 2 checkpoints to complete the binary search</span>}
      </div>

      {bugFixed && (
        <ConnectionCard
          title="Debugging is a search problem"
          body={
            <>
              Every debugger — Chrome DevTools, GDB, Python's pdb — is a tool for binary searching through program
              state. <code>git bisect</code> does the same thing across commit history: find the commit that introduced
              a bug by checking out the midpoint and testing.
            </>
          }
          appearsIn={['Chrome DevTools', 'GDB', 'git bisect', 'logging in production']}
          hook="Debugging finds bugs in code you wrote. Distributed systems introduce bugs caused by timing, network, and concurrency. That is next."
        />
      )}
    </div>
  )
}
