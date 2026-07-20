import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

interface LogEntry {
  thread: 'T1' | 'T2'
  op: string
  value: number
}

export function OSThreads({ onComplete }: { onComplete: () => void }) {
  const [counter, setCounter] = useState(0)
  const [expected, setExpected] = useState(0)
  const [log, setLog] = useState<LogEntry[]>([])
  const [raceCount, setRaceCount] = useState(0)
  const [racing, setRacing] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [hadRace, setHadRace] = useState(false)

  const stepT1 = () => {
    setCounter((c) => {
      const newVal = c + 1
      setLog((l) => [
        { thread: 'T1', op: `read(${c})`, value: c },
        { thread: 'T1', op: `write(${newVal})`, value: newVal },
        ...l,
      ].slice(0, 12))
      setExpected((e) => e + 1)
      return newVal
    })
  }

  const stepT2 = () => {
    setCounter((c) => {
      const newVal = c + 1
      setLog((l) => [
        { thread: 'T2', op: `read(${c})`, value: c },
        { thread: 'T2', op: `write(${newVal})`, value: newVal },
        ...l,
      ].slice(0, 12))
      setExpected((e) => e + 1)
      return newVal
    })
  }

  const triggerRace = () => {
    if (racing) return
    setRacing(true)
    const startVal = counter
    const expectedNew = startVal + 2

    // Interleave: T1 reads, T2 reads, T1 writes, T2 writes — both see stale value
    const t1Read = startVal
    const t2Read = startVal
    const t1Write = t1Read + 1
    const t2Write = t2Read + 1 // same as t1Write — lost update

    const entries: LogEntry[] = [
      { thread: 'T1', op: `read(${t1Read})`, value: t1Read },
      { thread: 'T2', op: `read(${t2Read})`, value: t2Read },
      { thread: 'T1', op: `write(${t1Write})`, value: t1Write },
      { thread: 'T2', op: `write(${t2Write})`, value: t2Write },
    ]

    let i = 0
    const interval = setInterval(() => {
      if (i >= entries.length) {
        clearInterval(interval)
        setCounter(t2Write) // result is 1, not 2
        setExpected(expectedNew)
        setRaceCount((r) => r + 1)
        setHadRace(true)
        setShowCard(true)
        setRacing(false)
        return
      }
      setLog((l) => [entries[i], ...l].slice(0, 14))
      i++
    }, 280)
  }

  const isWrong = counter !== expected && expected > 0

  return (
    <div className="lesson-panel">
      <p className="lede">
        Two threads share one counter. Each increment is three operations: <em>read value</em>,{' '}
        <em>add 1</em>, <em>write result</em>. When threads interleave those three steps, the counter can end up
        wrong — a <strong>race condition</strong>.
      </p>

      <div className="os-threads-board">
        <div className="os-thread-box" style={{ borderColor: '#60a5fa' }}>
          <span className="os-thread-label" style={{ color: '#60a5fa' }}>Thread T1</span>
          <button type="button" className="btn" onClick={stepT1} disabled={racing}>
            Step T1 (+1)
          </button>
        </div>

        <div className="os-threads-counter">
          <span className="os-threads-counter-label">shared counter</span>
          <motion.span
            className="os-threads-counter-value"
            style={{ color: isWrong ? '#f87171' : 'inherit' }}
            animate={{ scale: isWrong ? [1, 1.08, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {counter}
          </motion.span>
          {expected > 0 && (
            <span className="micro" style={{ color: isWrong ? '#f87171' : '#94a3b8' }}>
              {isWrong ? `expected ${expected} — lost update!` : `expected ${expected} ✓`}
            </span>
          )}
        </div>

        <div className="os-thread-box" style={{ borderColor: '#fb923c' }}>
          <span className="os-thread-label" style={{ color: '#fb923c' }}>Thread T2</span>
          <button type="button" className="btn" onClick={stepT2} disabled={racing}>
            Step T2 (+1)
          </button>
        </div>
      </div>

      <div className="os-threads-log">
        {log.slice(0, 8).map((entry, i) => (
          <motion.span
            key={i}
            className="os-threads-log-entry"
            style={{ color: entry.thread === 'T1' ? '#60a5fa' : '#fb923c' }}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
          >
            {entry.thread}: {entry.op}
          </motion.span>
        ))}
      </div>

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={triggerRace} disabled={racing}>
          Race! (interleave both threads)
        </button>
        {raceCount > 0 && (
          <span className="micro" style={{ color: '#94a3b8' }}>
            Raced {raceCount} time{raceCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {showCard && (
        <ConnectionCard
          title="Race conditions are one of the most common and hardest-to-debug bugs in production"
          body={
            <>
              This exact pattern — two threads reading a shared value before either writes — caused the Therac-25
              radiation therapy machine to overdose patients. It caused the Northeast Blackout of 2003. It still
              causes data corruption in web servers today when session counters are not properly synchronized.
            </>
          }
          appearsIn={['the mutex lab next', 'concurrent programming courses', 'systems programming in Go, Rust, C++']}
          hook="You triggered a race. Next: the fix — a mutex that serializes access to the critical section."
        />
      )}

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!hadRace}>
          Continue to mutexes
        </button>
        {!hadRace && <span className="hint">Click "Race!" to trigger a lost update.</span>}
      </div>
    </div>
  )
}
