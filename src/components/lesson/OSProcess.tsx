import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type ProcState = 'READY' | 'RUNNING' | 'BLOCKED'

interface Proc {
  id: number
  name: string
  pid: number
  color: string
  state: ProcState
  memSlice: number
}

const INITIAL: Proc[] = [
  { id: 1, name: 'P1', pid: 1001, color: '#60a5fa', state: 'READY', memSlice: 42 },
  { id: 2, name: 'P2', pid: 1002, color: '#fb923c', state: 'READY', memSlice: 78 },
  { id: 3, name: 'P3', pid: 1003, color: '#4ade80', state: 'READY', memSlice: 31 },
]

const STATE_COLOR: Record<ProcState, string> = {
  READY: '#facc15',
  RUNNING: '#4ade80',
  BLOCKED: '#94a3b8',
}

export function OSProcess({ onComplete }: { onComplete: () => void }) {
  const [procs, setProcs] = useState<Proc[]>(INITIAL)
  const [seenStates, setSeenStates] = useState<Set<ProcState>>(new Set())
  const [showCard, setShowCard] = useState(false)

  const allThreeSeen = seenStates.size >= 3

  const runProcess = (id: number) => {
    setProcs((prev) => {
      const next = prev.map((p) => {
        if (p.id === id) return { ...p, state: 'RUNNING' as ProcState }
        if (p.state === 'RUNNING') return { ...p, state: 'READY' as ProcState }
        return p
      })
      return next
    })
    setSeenStates((s) => new Set([...s, 'RUNNING']))
  }

  const blockP2 = () => {
    setProcs((prev) => {
      const next = prev.map((p) => {
        if (p.id === 2) return { ...p, state: 'BLOCKED' as ProcState }
        if (p.id === 1) return { ...p, state: 'RUNNING' as ProcState }
        if (p.state === 'RUNNING' && p.id !== 1) return { ...p, state: 'READY' as ProcState }
        return p
      })
      return next
    })
    const newSeen = new Set([...seenStates, 'RUNNING' as ProcState, 'BLOCKED' as ProcState])
    setSeenStates(newSeen)
    if (newSeen.size >= 3) setShowCard(true)
  }

  const unblockP2 = () => {
    setProcs((prev) =>
      prev.map((p) => (p.id === 2 ? { ...p, state: 'READY' as ProcState } : p)),
    )
  }

  const p2 = procs.find((p) => p.id === 2)!
  const p2Blocked = p2.state === 'BLOCKED'

  return (
    <div className="lesson-panel">
      <p className="lede">
        The OS tracks each program as a <strong>process</strong> with a state machine. Only one process runs at a
        time on a single core. Click a process to run it. Block P2 to simulate waiting for I/O.
      </p>

      <div className="os-process-board">
        {procs.map((p) => (
          <motion.div
            key={p.id}
            className="os-process-card"
            style={{ borderColor: p.color }}
            animate={{ opacity: p.state === 'BLOCKED' ? 0.65 : 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <div className="os-proc-header">
              <span className="os-proc-name" style={{ color: p.color }}>{p.name}</span>
              <span className="os-proc-pid">PID {p.pid}</span>
            </div>
            <motion.div
              className="os-proc-state-badge"
              style={{ backgroundColor: STATE_COLOR[p.state] }}
              animate={{ backgroundColor: STATE_COLOR[p.state] }}
              transition={{ duration: 0.25 }}
            >
              {p.state}
            </motion.div>
            <div className="os-proc-mem">
              <span className="os-proc-mem-label">Mem</span>
              <div className="os-proc-mem-bar">
                <motion.div
                  className="os-proc-mem-fill"
                  style={{ backgroundColor: p.color }}
                  animate={{ width: `${p.memSlice}%` }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                />
              </div>
              <span className="os-proc-mem-pct">{p.memSlice}%</span>
            </div>
            <button
              type="button"
              className="btn"
              onClick={() => runProcess(p.id)}
              disabled={p.state === 'RUNNING' || p.state === 'BLOCKED'}
            >
              Run
            </button>
          </motion.div>
        ))}
      </div>

      <div className="os-process-controls">
        <button type="button" className="btn" onClick={blockP2} disabled={p2Blocked}>
          Block P2 (I/O wait)
        </button>
        <button type="button" className="btn" onClick={unblockP2} disabled={!p2Blocked}>
          Unblock P2
        </button>
      </div>

      {showCard && (
        <ConnectionCard
          title="Every app on your phone is a process"
          body={
            <>
              The OS switches between them so fast it feels simultaneous — but on a single core, only one is ever
              RUNNING at a time. The others sit in READY, waiting for their turn on the CPU. When a process calls
              a slow operation like reading a file, it moves to BLOCKED so the CPU can do useful work on someone
              else's behalf.
            </>
          }
          appearsIn={['the scheduler lab next', 'threads and concurrency', 'OS design courses']}
          hook="You can switch processes by hand. Next: how the OS decides who runs next, and when, automatically."
        />
      )}

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!allThreeSeen}>
          Continue to scheduling
        </button>
        {!allThreeSeen && (
          <span className="hint">
            See all three states — READY, RUNNING, BLOCKED — to continue.
          </span>
        )}
      </div>
    </div>
  )
}
