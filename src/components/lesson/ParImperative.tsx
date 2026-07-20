import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

const LIST = [1, 2, 3, 4, 5]

type BlankState = { total: string; accumulator: string }

export function ParImperative({ onComplete }: { onComplete: () => void }) {
  const [blanks, setBlanks] = useState<BlankState>({ total: '', accumulator: '' })
  const [stepIdx, setStepIdx] = useState<number | null>(null)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)

  const totalCorrect = blanks.total.trim() === '0'
  const accCorrect = blanks.accumulator.trim() === 'i' || blanks.accumulator.trim() === 'x' || blanks.accumulator.trim() === 'n'
  const bothCorrect = totalCorrect && accCorrect

  const runSteps = () => {
    setRunning(true)
    setStepIdx(0)
    let i = 0
    const tick = setInterval(() => {
      i++
      if (i >= LIST.length) {
        clearInterval(tick)
        setStepIdx(LIST.length)
        setRunning(false)
      } else {
        setStepIdx(i)
      }
    }, 600)
  }

  const runningTotal = stepIdx !== null ? LIST.slice(0, stepIdx + 1).reduce((a, b) => a + b, 0) : 0

  return (
    <div className="lesson-panel">
      <p className="lede">
        Imperative programming describes <strong>how</strong> to solve a problem step by step. The CPU executes each
        instruction in sequence — fetch, decode, execute — exactly like Layer 1 taught.
      </p>
      <p className="micro">Fill in the blanks, then step through the execution.</p>

      <div className="par-imp-stage">
        <div className="par-imp-code">
          <div className="par-imp-line">
            <code>total = </code>
            <input
              className="par-imp-blank"
              value={blanks.total}
              onChange={(e) => setBlanks((b) => ({ ...b, total: e.target.value }))}
              placeholder="?"
              style={{ width: '3rem' }}
            />
            {totalCorrect && <span className="db-acid-ok"> ✓</span>}
          </div>
          <div className="par-imp-line">
            <code>for i in [1, 2, 3, 4, 5]:</code>
          </div>
          <div className="par-imp-line par-imp-line--indent">
            <code>{'    '}total = total + </code>
            <input
              className="par-imp-blank"
              value={blanks.accumulator}
              onChange={(e) => setBlanks((b) => ({ ...b, accumulator: e.target.value }))}
              placeholder="?"
              style={{ width: '3rem' }}
            />
            {accCorrect && <span className="db-acid-ok"> ✓</span>}
          </div>
          <div className="par-imp-line">
            <code>return total</code>
          </div>
        </div>

        {stepIdx !== null && (
          <div className="par-imp-trace">
            <p className="micro">Execution trace:</p>
            <div className="par-imp-trace-rows">
              {LIST.map((val, i) => (
                <AnimatePresence key={i}>
                  {i < (stepIdx ?? -1) + 1 && (
                    <motion.div
                      className={`par-imp-trace-row ${i === stepIdx ? 'par-imp-trace-row--active' : ''}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                    >
                      <span>i={val}</span>
                      <span>total = {LIST.slice(0, i + 1).reduce((a, b) => a + b, 0)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
              {stepIdx === LIST.length && (
                <motion.div
                  className="par-imp-trace-row par-imp-trace-row--done"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  return {runningTotal}
                </motion.div>
              )}
            </div>
          </div>
        )}

        <div className="par-imp-cpu">
          <p className="micro">CPU heartbeat (from Layer 1):</p>
          <div className="par-imp-cpu-cycle">
            {['FETCH', 'DECODE', 'EXECUTE'].map((phase, i) => (
              <motion.div
                key={phase}
                className="par-imp-cpu-phase"
                animate={{
                  backgroundColor: running && stepIdx !== null && stepIdx % 3 === i
                    ? 'var(--signal)'
                    : 'var(--surface-3)',
                }}
                transition={{ duration: 0.2 }}
              >
                {phase}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="lesson-actions">
        {!bothCorrect && (
          <span className="hint">
            Hint: <code>total</code> starts at 0, accumulate <code>i</code> on each loop
          </span>
        )}
        {bothCorrect && stepIdx === null && (
          <button type="button" className="btn primary" onClick={runSteps} disabled={running}>
            Step through execution
          </button>
        )}
        {stepIdx === LIST.length && !done && (
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
      </div>

      {stepIdx === LIST.length && (
        <ConnectionCard
          title="Imperative programs describe HOW — step by step"
          body={
            <>
              Every CPU instruction is imperative: move this value, add these two, jump if zero. Even code written in
              functional or object-oriented style compiles down to imperative machine instructions in the end.
            </>
          }
          appearsIn={['CPU fetch-decode-execute cycle (Layer 1)', 'assembly language', 'C programs']}
          hook="Imperative code organizes around steps. Object-oriented code organizes around things — objects with behavior."
        />
      )}
    </div>
  )
}
