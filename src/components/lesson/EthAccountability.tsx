import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Stakeholder = {
  id: string
  label: string
  role: string
  color: string
}

const STAKEHOLDERS: Stakeholder[] = [
  { id: 'engineer', label: 'Engineer', role: 'Wrote the path-planning algorithm without pedestrian zone weights', color: '#38bdf8' },
  { id: 'techlead', label: 'Tech Lead', role: 'Approved the PR without flagging the missing safety constraint', color: '#6366f1' },
  { id: 'company', label: 'Company', role: 'Deployed to public roads without adequate edge-case testing', color: '#f59e0b' },
  { id: 'regulator', label: 'Regulator', role: 'Certified the system without testing pedestrian-zone edge cases', color: '#10b981' },
]

export function EthAccountability({ onComplete }: { onComplete: () => void }) {
  const [bars, setBars] = useState<Record<string, number>>(
    Object.fromEntries(STAKEHOLDERS.map((s) => [s.id, 25]))
  )
  const [submitted, setSubmitted] = useState(false)
  const [done, setDone] = useState(false)

  const total = Object.values(bars).reduce((a, b) => a + b, 0)

  const setBar = (id: string, val: number) => {
    setBars((prev) => ({ ...prev, [id]: val }))
  }

  const allDistributed = Object.values(bars).every((v) => v >= 0)

  return (
    <div className="lesson-panel">
      <p className="lede">
        A self-driving car's path-planning algorithm causes a pedestrian injury. The bug: it weighted "time" but not
        "pedestrian zones." Who is responsible — and how much?
      </p>

      <div className="eth-acc-stage">
        <div className="eth-acc-scenario">
          <p className="micro">Scenario: Dijkstra-based path planner (from Layer 8) routes through a school zone at speed.</p>
          <pre className="par-types-code">{`// Missing: pedestrian zone weight
function planRoute(start, end) {
  return dijkstra(graph, start, end, {
    weight: (edge) => edge.time  // ← no safety penalty
  })
}`}</pre>
        </div>

        <div className="eth-acc-bars">
          <p className="micro">Distribute responsibility (sliders, any total — there is no single correct answer):</p>
          {STAKEHOLDERS.map((s) => (
            <div key={s.id} className="eth-acc-bar-row">
              <div className="eth-acc-bar-header">
                <span style={{ color: s.color }}>{s.label}</span>
                <span className="micro">{s.role}</span>
              </div>
              <div className="eth-acc-bar-control">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={bars[s.id]}
                  onChange={(e) => setBar(s.id, Number(e.target.value))}
                  style={{ width: '180px' }}
                />
                <span className="eth-acc-bar-pct">{bars[s.id]}%</span>
                <div className="eth-acc-bar-vis">
                  <motion.div
                    className="eth-acc-bar-fill"
                    style={{ backgroundColor: s.color }}
                    animate={{ width: `${bars[s.id]}%` }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  />
                </div>
              </div>
            </div>
          ))}
          <p className="micro" style={{ marginTop: '0.5rem' }}>
            Your distribution totals: <strong>{total}%</strong>{' '}
            <span className="hint">(totals over 100% are valid — responsibility can overlap)</span>
          </p>
        </div>

        {!submitted && (
          <button type="button" className="btn primary" onClick={() => setSubmitted(true)}>
            Submit distribution
          </button>
        )}

        {submitted && (
          <motion.div
            className="eth-acc-insight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <p>
              <strong>No single correct answer exists.</strong> Courts, ethicists, and engineers all argue about this.
              Multiple defensible distributions exist.
            </p>
            <p className="micro" style={{ marginTop: '0.5rem' }}>
              Key insight: <em>distributing responsibility does not reduce it</em> — it means more people needed
              to act and did not. The engineer who wrote the code, the reviewer who approved it, the company that
              deployed it, and the regulator who certified it all had a chance to prevent this outcome.
            </p>
            <p className="micro" style={{ marginTop: '0.5rem' }}>
              Software engineering decisions are engineering decisions with consequences in the world. The code you
              write runs in someone's life.
            </p>
          </motion.div>
        )}
      </div>

      <div className="lesson-actions">
        {submitted && !done && (
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
        {!submitted && (
          <span className="hint">Distribute responsibility across all stakeholders, then submit</span>
        )}
      </div>

      {submitted && (
        <ConnectionCard
          title="Software engineering decisions are engineering decisions with consequences in the world"
          body={
            <>
              The code you write runs in someone's life. Every professional engineer in fields like civil engineering,
              medicine, and aviation has a formal accountability structure. Software engineering is catching up — slowly.
              The ACM Code of Ethics is part of that structure.
            </>
          }
          appearsIn={['product liability law', 'AI governance frameworks', 'IEEE/ACM ethics standards']}
          hook="Accountability is a responsibility you take on. Open source is a gift someone else gave you. Next: the infrastructure you stand on."
        />
      )}
    </div>
  )
}
