import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type CaseId = 0 | 1 | 2

const CASES = [
  {
    title: 'Recommendation system optimized for engagement',
    steps: [
      { label: 'Objective', detail: 'Maximize time-on-platform' },
      { label: 'What emerged', detail: 'Outrage content drove 6× more engagement than neutral content' },
      { label: 'Key number', detail: '6× engagement multiplier on emotionally charged content' },
      { label: 'Fix applied', detail: 'Added "responsible AI" metric to objective function alongside engagement' },
      { label: 'Root cause', detail: 'Objective function was incomplete — it optimized for what was measured, not what was wanted' },
    ],
    color: '#f59e0b',
  },
  {
    title: 'Facial recognition with higher error rates for darker-skinned faces',
    steps: [
      { label: 'Cause', detail: 'Training data was 77% light-skinned faces' },
      { label: 'Measured gap', detail: 'Error rate for darker-skinned women: 34.7% vs 0.8% for lighter-skinned men (MIT study)' },
      { label: 'Audit', detail: 'NIST confirmed across all major commercial systems (2019)' },
      { label: 'Fix applied', detail: 'Diverse training data + continuous bias auditing + deployment restrictions in high-stakes contexts' },
      { label: 'Root cause', detail: 'Training data distribution did not match the real-world population' },
    ],
    color: '#6366f1',
  },
  {
    title: 'LLM confidently generating wrong medical dosages',
    steps: [
      { label: 'What happened', detail: 'Medical chatbots gave confident, specific, incorrect dosage information' },
      { label: 'Cause', detail: 'LLMs optimize for fluency and plausibility — not factual accuracy' },
      { label: 'Risk', detail: 'Confident-sounding wrong answers are more dangerous than uncertain right answers' },
      { label: 'Fix applied', detail: 'Human-in-the-loop review + explicit uncertainty quantification + retrieval augmentation' },
      { label: 'Root cause', detail: 'Objective function optimized for next-token prediction, not real-world correctness' },
    ],
    color: '#10b981',
  },
]

export function EthAiSafety({ onComplete }: { onComplete: () => void }) {
  const [activeCase, setActiveCase] = useState<CaseId>(0)
  const [stepsShown, setStepsShown] = useState<Record<CaseId, number>>({ 0: 0, 1: 0, 2: 0 })
  const [seen, setSeen] = useState<Set<CaseId>>(new Set([0]))
  const [done, setDone] = useState(false)

  const switchCase = (id: CaseId) => {
    setActiveCase(id)
    setSeen((prev) => new Set([...prev, id]))
  }

  const advanceStep = (id: CaseId) => {
    setStepsShown((prev) => ({
      ...prev,
      [id]: Math.min(prev[id] + 1, CASES[id].steps.length),
    }))
  }

  const allSeen = seen.size === 3
  const allComplete = ([0, 1, 2] as CaseId[]).every((id) => stepsShown[id] === CASES[id].steps.length)
  const canComplete = allSeen && allComplete

  const c = CASES[activeCase]
  const shownSteps = stepsShown[activeCase]

  return (
    <div className="lesson-panel">
      <p className="lede">
        Three case studies in AI systems that did exactly what they were optimized to do — and caused harm. The
        objective function was incomplete.
      </p>

      <div className="eth-aisafety-tabs">
        {([0, 1, 2] as CaseId[]).map((id) => (
          <button
            key={id}
            type="button"
            className={`db-nosql-tab ${activeCase === id ? 'db-nosql-tab--active' : ''} ${seen.has(id) ? 'db-nosql-tab--seen' : ''}`}
            onClick={() => switchCase(id)}
          >
            Case {id + 1}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCase}
          className="eth-aisafety-panel"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          <h4 style={{ color: c.color }}>{c.title}</h4>
          <div className="eth-aisafety-timeline">
            {c.steps.slice(0, shownSteps).map((step, i) => (
              <motion.div
                key={i}
                className="eth-aisafety-step"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                <span className="eth-aisafety-step-label" style={{ color: c.color }}>{step.label}</span>
                <span className="eth-aisafety-step-detail">{step.detail}</span>
              </motion.div>
            ))}
          </div>
          {shownSteps < c.steps.length && (
            <button type="button" className="btn primary" onClick={() => advanceStep(activeCase)}>
              Next
            </button>
          )}
          {shownSteps === c.steps.length && (
            <motion.p
              className="db-acid-ok"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              Case complete.
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="lesson-actions">
        {canComplete && !done && (
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
        {!canComplete && (
          <span className="hint">
            {!allSeen ? `View all 3 cases (${seen.size}/3)` : 'Step through all stages of each case'}
          </span>
        )}
      </div>

      {canComplete && (
        <ConnectionCard
          title="All three cases have something in common: the system did exactly what it was optimized for"
          body={
            <>
              Goodhart's Law: when a measure becomes a target, it ceases to be a good measure. Engagement is a proxy
              for value — but it can be maximized without providing value. The fix is always the same: make the
              objective function more complete, closer to what you actually want.
            </>
          }
          appearsIn={['recommendation systems', 'fairness in ML', 'LLM safety research']}
          hook="Systems can cause harm through their objective function. Who is responsible when they do? Next: accountability."
        />
      )}
    </div>
  )
}
