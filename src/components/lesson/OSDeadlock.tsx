import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

interface Condition {
  id: string
  name: string
  description: string
  breakDescription: string
  breakExample: string
  on: boolean
}

const INITIAL_CONDITIONS: Condition[] = [
  {
    id: 'mutual-exclusion',
    name: 'Mutual Exclusion',
    description: 'Resources cannot be shared — only one thread holds a resource at a time.',
    breakDescription: 'Make resource shareable',
    breakExample: 'Reader-writer locks let multiple readers hold a resource simultaneously.',
    on: true,
  },
  {
    id: 'hold-and-wait',
    name: 'Hold and Wait',
    description: 'A thread holds one resource while waiting to acquire another.',
    breakDescription: 'Acquire all at once or release and retry',
    breakExample: 'Request all required locks upfront; if any fails, release all and retry later.',
    on: true,
  },
  {
    id: 'no-preemption',
    name: 'No Preemption',
    description: 'Resources can only be released voluntarily — the OS cannot forcibly reclaim them.',
    breakDescription: 'OS forcibly reclaims resources',
    breakExample: 'Database systems abort the lowest-priority transaction to break a deadlock.',
    on: true,
  },
  {
    id: 'circular-wait',
    name: 'Circular Wait',
    description: 'A cycle exists in the wait-for graph: T1 waits for T2, T2 waits for T1.',
    breakDescription: 'Number resources, always acquire in order',
    breakExample: 'Assign each lock a global number; threads must always acquire lower-numbered locks first.',
    on: true,
  },
]

export function OSDeadlock({ onComplete }: { onComplete: () => void }) {
  const [conditions, setConditions] = useState<Condition[]>(INITIAL_CONDITIONS)
  const [everToggledAll, setEverToggledAll] = useState<Set<string>>(new Set())
  const [showCard, setShowCard] = useState(false)

  const allOn = conditions.every((c) => c.on)
  const deadlockPossible = conditions.every((c) => c.on)
  const toggledAll = INITIAL_CONDITIONS.every((c) => everToggledAll.has(c.id))

  const toggle = (id: string) => {
    setConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, on: !c.on } : c)),
    )
    setEverToggledAll((s) => {
      const next = new Set(s)
      next.add(id)
      return next
    })
    if (!showCard && everToggledAll.size >= 1) setShowCard(true)
    else if (everToggledAll.size === 0) setShowCard(true)
  }

  const resetAll = () => {
    setConditions(INITIAL_CONDITIONS.map((c) => ({ ...c, on: true })))
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        Deadlock requires all four conditions simultaneously. Toggle any condition OFF to see what breaking it
        means in practice — and why removing even one is sufficient to prevent deadlock entirely.
      </p>

      <motion.div
        className="os-dl-system"
        animate={{
          boxShadow: deadlockPossible
            ? '0 0 32px rgba(248,113,113,0.4)'
            : '0 0 0 transparent',
          borderColor: deadlockPossible ? '#f87171' : 'var(--surface-3, #334155)',
        }}
        transition={{ duration: 0.4 }}
      >
        <span className="os-dl-system-label">
          {deadlockPossible ? '🔴 DEADLOCK POSSIBLE' : '✅ DEADLOCK PREVENTED'}
        </span>

        <div className="os-dl-conditions">
          {conditions.map((cond) => (
            <motion.div
              key={cond.id}
              className={`os-dl-condition ${cond.on ? 'os-dl-condition--on' : 'os-dl-condition--off'}`}
              animate={{
                opacity: cond.on ? 1 : 0.7,
              }}
              transition={{ duration: 0.25 }}
            >
              <div className="os-dl-condition-header">
                <span className="os-dl-condition-name">{cond.name}</span>
                <button
                  type="button"
                  className={`switch-pill ${cond.on ? 'on' : ''}`}
                  onClick={() => toggle(cond.id)}
                  aria-pressed={cond.on}
                >
                  {cond.on ? 'ON' : 'OFF'}
                </button>
              </div>
              <p className="os-dl-condition-desc">{cond.description}</p>
              {!cond.on && (
                <motion.div
                  className="os-dl-break-info"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.25 }}
                >
                  <strong>Breaking it: {cond.breakDescription}</strong>
                  <span className="micro">{cond.breakExample}</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {deadlockPossible && (
          <div className="os-dl-circular-diagram">
            <span className="os-dl-circle-node" style={{ color: '#60a5fa' }}>T1</span>
            <span className="os-dl-circle-arrow">→ waits for →</span>
            <span className="os-dl-circle-node" style={{ color: '#fb923c' }}>T2</span>
            <span className="os-dl-circle-arrow">→ waits for →</span>
            <span className="os-dl-circle-node" style={{ color: '#60a5fa' }}>T1</span>
          </div>
        )}
      </motion.div>

      <div className="lesson-actions">
        <button type="button" className="btn" onClick={resetAll} disabled={allOn}>
          Reset all ON
        </button>
      </div>

      {showCard && (
        <ConnectionCard
          title="Every OS textbook teaches these four conditions"
          body={
            <>
              Coffman et al. published these four necessary conditions in 1971. They are still the framework every
              operating systems engineer uses to reason about deadlock. You now know what every systems programmer
              has memorized. The practical lesson: consistent lock ordering (breaking circular wait) is almost
              always the cheapest fix.
            </>
          }
          appearsIn={['OS design courses', 'database concurrency control', 'distributed systems where deadlock spans machines']}
          hook="Toggle all four switches to complete this step."
        />
      )}

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!toggledAll}>
          Finish OS chapter
        </button>
        {!toggledAll && (
          <span className="hint">Toggle each of the four switches at least once.</span>
        )}
      </div>
    </div>
  )
}
