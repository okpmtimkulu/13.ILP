import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type LockState = 'free' | 'held-t1' | 'held-t2'

interface ThreadState {
  holdsLockA: boolean
  holdsLockB: boolean
  waitingFor: 'A' | 'B' | null
}

type Phase = 'mutex' | 'deadlock'

export function OSMutex({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>('mutex')

  // Mutex phase
  const [lock, setLock] = useState<LockState>('free')
  const [counter, setCounter] = useState(0)
  const [lockEnabled, setLockEnabled] = useState(true)
  const [mutexLog, setMutexLog] = useState<string[]>([])
  const [mutexRaceCount, setMutexRaceCount] = useState(0)
  const [showCard, setShowCard] = useState(false)

  // Deadlock phase
  const [t1, setT1] = useState<ThreadState>({ holdsLockA: false, holdsLockB: false, waitingFor: null })
  const [t2, setT2] = useState<ThreadState>({ holdsLockA: false, holdsLockB: false, waitingFor: null })
  const [deadlock, setDeadlock] = useState(false)
  const [hadDeadlock, setHadDeadlock] = useState(false)
  const [fixedDeadlock, setFixedDeadlock] = useState(false)

  const mutexIncrement = (thread: 'T1' | 'T2') => {
    if (lockEnabled) {
      if (lock !== 'free') {
        setMutexLog((l) =>
          [`${thread}: tried to lock — BLOCKED (lock held)`, ...l].slice(0, 8),
        )
        return
      }
      const held = thread === 'T1' ? 'held-t1' : 'held-t2'
      setLock(held)
      setMutexLog((l) => [`${thread}: acquired lock`, ...l].slice(0, 8))
      setTimeout(() => {
        setCounter((c) => {
          setMutexLog((l) => [`${thread}: counter ${c} → ${c + 1}`, ...l].slice(0, 8))
          return c + 1
        })
        setTimeout(() => {
          setLock('free')
          setMutexLog((l) => [`${thread}: released lock`, ...l].slice(0, 8))
        }, 200)
      }, 300)
    } else {
      // No lock — potential race (simulated)
      const val = counter
      const newVal = val + 1
      setMutexLog((l) => [`${thread}: read(${val})`, `${thread}: write(${newVal})`, ...l].slice(0, 8))
      setCounter(newVal)
      if (Math.random() < 0.35) {
        // Simulate lost update
        setMutexLog((l) => [`⚠ Race! counter may be wrong`, ...l].slice(0, 8))
        setMutexRaceCount((r) => r + 1)
      }
    }
  }

  const toggleLock = () => setLockEnabled((v) => !v)

  const advanceToDeadlock = () => {
    setShowCard(true)
    setPhase('deadlock')
  }

  // Deadlock simulation
  const t1AcquireA = () => {
    if (t1.holdsLockA || t2.holdsLockA) return
    setT1((s) => ({ ...s, holdsLockA: true, waitingFor: null }))
  }
  const t1AcquireB = () => {
    if (t1.holdsLockB) return
    if (t2.holdsLockB) {
      setT1((s) => ({ ...s, waitingFor: 'B' }))
      if (t2.waitingFor === 'A' || (t2.holdsLockB && t1.holdsLockA)) {
        setDeadlock(true)
        setHadDeadlock(true)
      }
    } else {
      setT1((s) => ({ ...s, holdsLockB: true, waitingFor: null }))
    }
  }
  const t2AcquireB = () => {
    if (t2.holdsLockB || t1.holdsLockB) return
    setT2((s) => ({ ...s, holdsLockB: true, waitingFor: null }))
  }
  const t2AcquireA = () => {
    if (t2.holdsLockA) return
    if (t1.holdsLockA) {
      setT2((s) => ({ ...s, waitingFor: 'A' }))
      if (t1.waitingFor === 'B' || (t1.holdsLockA && t2.holdsLockB)) {
        setDeadlock(true)
        setHadDeadlock(true)
      }
    } else {
      setT2((s) => ({ ...s, holdsLockA: true, waitingFor: null }))
    }
  }

  const fixDeadlock = () => {
    setT1({ holdsLockA: false, holdsLockB: false, waitingFor: null })
    setT2({ holdsLockA: false, holdsLockB: false, waitingFor: null })
    setDeadlock(false)
    setFixedDeadlock(true)
  }

  const done = hadDeadlock && fixedDeadlock

  return (
    <div className="lesson-panel">
      {phase === 'mutex' && (
        <>
          <p className="lede">
            A <strong>mutex</strong> (mutual exclusion lock) forces threads to take turns in the critical section.
            Toggle the lock on and off to compare safe and unsafe execution.
          </p>

          <div className="os-mutex-board">
            <div className="os-mutex-lock-control">
              <motion.div
                className={`os-mutex-lock-icon ${lock !== 'free' ? 'os-mutex-lock-icon--locked' : ''}`}
                animate={{ rotate: lock !== 'free' ? 0 : 15 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                {lock !== 'free' ? '🔒' : '🔓'}
              </motion.div>
              <span className="micro">
                {lockEnabled
                  ? `Mutex ${lock === 'free' ? 'free' : `held by ${lock === 'held-t1' ? 'T1' : 'T2'}`}`
                  : 'No mutex — unprotected'}
              </span>
              <button type="button" className="btn" onClick={toggleLock}>
                {lockEnabled ? 'Remove lock' : 'Add lock'}
              </button>
            </div>

            <div className="os-mutex-counter-display">
              <span className="os-mutex-counter-label">counter</span>
              <span className="os-mutex-counter-value">{counter}</span>
            </div>

            <div className="os-mutex-threads">
              <div className="os-mutex-thread" style={{ borderColor: '#60a5fa' }}>
                <span style={{ color: '#60a5fa' }}>T1</span>
                <button type="button" className="btn" onClick={() => mutexIncrement('T1')}>
                  Increment
                </button>
              </div>
              <div className="os-mutex-thread" style={{ borderColor: '#fb923c' }}>
                <span style={{ color: '#fb923c' }}>T2</span>
                <button type="button" className="btn" onClick={() => mutexIncrement('T2')}>
                  Increment
                </button>
              </div>
            </div>
          </div>

          <div className="os-mutex-log">
            {mutexLog.slice(0, 6).map((entry, i) => (
              <span key={i} className="micro">{entry}</span>
            ))}
          </div>

          <div className="lesson-actions">
            <button type="button" className="btn primary" onClick={advanceToDeadlock}>
              Introduce second resource → see deadlock
            </button>
          </div>
        </>
      )}

      {phase === 'deadlock' && (
        <>
          <p className="lede">
            Now two threads, two locks (A and B). T1 acquires A then needs B. T2 acquires B then needs A.
            Follow the sequence to create a <strong>deadlock</strong>.
          </p>

          <div className="os-deadlock-board">
            <div className={`os-deadlock-thread ${deadlock ? 'os-deadlock-thread--frozen' : ''}`} style={{ borderColor: '#60a5fa' }}>
              <span className="os-deadlock-thread-name" style={{ color: '#60a5fa' }}>T1</span>
              <div className="os-deadlock-thread-holds">
                <span className={`os-deadlock-badge ${t1.holdsLockA ? 'os-deadlock-badge--held' : ''}`}>Lock A {t1.holdsLockA ? '✓' : ''}</span>
                <span className={`os-deadlock-badge ${t1.holdsLockB ? 'os-deadlock-badge--held' : ''} ${t1.waitingFor === 'B' ? 'os-deadlock-badge--waiting' : ''}`}>
                  Lock B {t1.holdsLockB ? '✓' : t1.waitingFor === 'B' ? '⏳' : ''}
                </span>
              </div>
              <button type="button" className="btn" onClick={t1AcquireA} disabled={t1.holdsLockA || t2.holdsLockA || deadlock}>
                1. Acquire Lock A
              </button>
              <button type="button" className="btn" onClick={t1AcquireB} disabled={!t1.holdsLockA || t1.holdsLockB || deadlock}>
                2. Acquire Lock B
              </button>
            </div>

            <div className="os-deadlock-locks">
              <motion.div
                className={`os-deadlock-lock ${t1.holdsLockA || t2.holdsLockA ? 'os-deadlock-lock--held' : ''}`}
                animate={{ backgroundColor: deadlock ? 'rgba(248,113,113,0.2)' : 'transparent' }}
              >
                Lock A
              </motion.div>
              <motion.div
                className={`os-deadlock-lock ${t1.holdsLockB || t2.holdsLockB ? 'os-deadlock-lock--held' : ''}`}
                animate={{ backgroundColor: deadlock ? 'rgba(248,113,113,0.2)' : 'transparent' }}
              >
                Lock B
              </motion.div>
            </div>

            <div className={`os-deadlock-thread ${deadlock ? 'os-deadlock-thread--frozen' : ''}`} style={{ borderColor: '#fb923c' }}>
              <span className="os-deadlock-thread-name" style={{ color: '#fb923c' }}>T2</span>
              <div className="os-deadlock-thread-holds">
                <span className={`os-deadlock-badge ${t2.holdsLockA ? 'os-deadlock-badge--held' : ''} ${t2.waitingFor === 'A' ? 'os-deadlock-badge--waiting' : ''}`}>
                  Lock A {t2.holdsLockA ? '✓' : t2.waitingFor === 'A' ? '⏳' : ''}
                </span>
                <span className={`os-deadlock-badge ${t2.holdsLockB ? 'os-deadlock-badge--held' : ''}`}>Lock B {t2.holdsLockB ? '✓' : ''}</span>
              </div>
              <button type="button" className="btn" onClick={t2AcquireB} disabled={t2.holdsLockB || t1.holdsLockB || deadlock}>
                1. Acquire Lock B
              </button>
              <button type="button" className="btn" onClick={t2AcquireA} disabled={!t2.holdsLockB || t2.holdsLockA || deadlock}>
                2. Acquire Lock A
              </button>
            </div>
          </div>

          {deadlock && (
            <motion.div
              className="os-deadlock-alert"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              🔴 DEADLOCK — T1 waits for B (held by T2). T2 waits for A (held by T1). Neither can proceed.
              <br />
              <strong>Fix:</strong> always acquire locks in the same order (always A before B).
              <button type="button" className="btn primary" onClick={fixDeadlock} style={{ marginTop: '0.5rem' }}>
                Fix deadlock (release all locks)
              </button>
            </motion.div>
          )}

          {fixedDeadlock && (
            <motion.div
              className="os-deadlock-fixed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ✓ Fixed. Consistent lock ordering prevents circular wait — eliminating one of the four deadlock
              conditions is sufficient.
            </motion.div>
          )}

          {showCard && (
            <ConnectionCard
              title="Deadlock killed more production systems than almost any other bug"
              body={
                <>
                  The fix is always the same: acquire locks in a consistent global order. If every thread always
                  acquires Lock A before Lock B, circular wait becomes impossible. Database engines enforce this
                  with lock ordering rules. Java's{' '}
                  <code>ReentrantLock</code> documentation says it explicitly. Now you know why.
                </>
              }
              appearsIn={['the deadlock conditions lab next', 'database concurrency control', 'concurrent programming courses']}
              hook="You caused and fixed a deadlock. Next: the four necessary conditions — and how breaking any one prevents it."
            />
          )}
        </>
      )}

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!done}>
          Continue to deadlock conditions
        </button>
        {!done && (
          <span className="hint">
            {!hadDeadlock ? 'Follow the deadlock sequence first.' : 'Then click "Fix deadlock".'}
          </span>
        )}
      </div>
    </div>
  )
}
