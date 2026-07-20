import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

interface Proc {
  name: string
  color: string
  burst: number
}

const PROCS: Proc[] = [
  { name: 'P1', color: '#60a5fa', burst: 3 },
  { name: 'P2', color: '#fb923c', burst: 5 },
  { name: 'P3', color: '#4ade80', burst: 2 },
  { name: 'P4', color: '#a78bfa', burst: 4 },
]

const QUANTUM = 2

interface TimeSlot {
  proc: string
  color: string
  start: number
  end: number
}

function buildRoundRobin(procs: Proc[]): TimeSlot[] {
  const slots: TimeSlot[] = []
  const remaining = procs.map((p) => ({ ...p }))
  let t = 0
  let pass = 0
  while (remaining.some((p) => p.burst > 0) && pass < 30) {
    for (const p of remaining) {
      if (p.burst <= 0) continue
      const run = Math.min(QUANTUM, p.burst)
      slots.push({ proc: p.name, color: p.color, start: t, end: t + run })
      p.burst -= run
      t += run
    }
    pass++
  }
  return slots
}

function buildSJF(procs: Proc[]): TimeSlot[] {
  const slots: TimeSlot[] = []
  const sorted = [...procs].sort((a, b) => a.burst - b.burst)
  let t = 0
  for (const p of sorted) {
    slots.push({ proc: p.name, color: p.color, start: t, end: t + p.burst })
    t += p.burst
  }
  return slots
}

function calcTurnaround(slots: TimeSlot[], procs: Proc[]): Record<string, number> {
  const result: Record<string, number> = {}
  for (const p of procs) {
    const last = [...slots].reverse().find((s) => s.proc === p.name)
    if (last) result[p.name] = last.end
  }
  return result
}

const TOTAL_TIME = PROCS.reduce((s, p) => s + p.burst, 0)

export function OSScheduler({ onComplete }: { onComplete: () => void }) {
  const [rrSlots, setRrSlots] = useState<TimeSlot[] | null>(null)
  const [sjfSlots, setSjfSlots] = useState<TimeSlot[] | null>(null)
  const [showCard, setShowCard] = useState(false)
  const [ranOnce, setRanOnce] = useState(false)

  const runRR = () => {
    setRrSlots(buildRoundRobin(PROCS))
    setRanOnce(true)
    setShowCard(true)
  }

  const runSJF = () => {
    setSjfSlots(buildSJF(PROCS))
    setRanOnce(true)
    setShowCard(true)
  }

  const renderTimeline = (slots: TimeSlot[], label: string) => {
    const turnaround = calcTurnaround(slots, PROCS)
    return (
      <div className="os-sched-timeline-group">
        <span className="os-sched-algo-label">{label}</span>
        <div className="os-sched-timeline">
          {slots.map((s, i) => (
            <motion.div
              key={i}
              className="os-sched-slot"
              style={{
                width: `${((s.end - s.start) / TOTAL_TIME) * 100}%`,
                backgroundColor: s.color,
              }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24, delay: i * 0.05 }}
              title={`${s.proc}: t=${s.start}–${s.end}`}
            >
              <span className="os-sched-slot-label">{s.proc}</span>
            </motion.div>
          ))}
        </div>
        <div className="os-sched-turnaround">
          {PROCS.map((p) => (
            <span key={p.name} className="os-sched-ta" style={{ color: p.color }}>
              {p.name}: done at t={turnaround[p.name]}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        A CPU scheduler decides which process runs next. <strong>Round-Robin</strong> gives each process a fixed
        quantum (fairness). <strong>Shortest Job First</strong> runs the quickest process first (minimizes average
        wait). Watch how the same four processes produce very different timelines.
      </p>
      <p className="micro">
        Processes: P1(3), P2(5), P3(2), P4(4) time units. Round-Robin quantum = {QUANTUM}.
      </p>

      <div className="os-sched-procs">
        {PROCS.map((p) => (
          <div key={p.name} className="os-sched-proc-chip" style={{ borderColor: p.color }}>
            <span style={{ color: p.color }}>{p.name}</span>
            <span className="micro">burst={p.burst}</span>
          </div>
        ))}
      </div>

      <div className="os-sched-buttons">
        <button type="button" className="btn primary" onClick={runRR}>
          Run Round-Robin (quantum={QUANTUM})
        </button>
        <button type="button" className="btn primary" onClick={runSJF}>
          Run Shortest Job First
        </button>
      </div>

      {rrSlots && renderTimeline(rrSlots, 'Round-Robin')}
      {sjfSlots && renderTimeline(sjfSlots, 'Shortest Job First')}

      {showCard && (
        <ConnectionCard
          title="Linux uses CFS — the Completely Fair Scheduler"
          body={
            <>
              CFS is a weighted round-robin that tracks a "virtual runtime" for each process and always runs
              whichever has the smallest. It adapts quantum sizes to load, giving interactive tasks (mouse,
              keyboard) lower virtual runtimes so they preempt batch jobs instantly. You just saw the ideas that
              CFS builds on.
            </>
          }
          appearsIn={['OS design courses', 'Linux kernel internals', 'cloud VM scheduling']}
          hook="Processes compete for CPU time. Next: where they keep their persistent data — the filesystem."
        />
      )}

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!ranOnce}>
          Continue to filesystems
        </button>
        {!ranOnce && <span className="hint">Run at least one scheduling algorithm to continue.</span>}
      </div>
    </div>
  )
}
