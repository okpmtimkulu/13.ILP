import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

const CANDIDATES = [
  { name: 'Alex Chen', gender: 'neutral' },
  { name: 'Alexia Chen', gender: 'female' },
]

function biasedScore(name: string): number {
  // Historical tech hiring: 85% male
  if (name === 'Alexia Chen') return 61
  return 78
}

function retrainedScore(name: string): number {
  if (name === 'Alexia Chen') return 73
  return 74
}

const STRATEGIES = [
  'Balanced training data (equal representation)',
  'Fairness constraints (equal opportunity metric)',
  'Human review layer (override flagged decisions)',
]

export function EthBias({ onComplete }: { onComplete: () => void }) {
  const [scored, setScored] = useState(false)
  const [retrained, setRetrained] = useState(false)
  const [strategySeen, setStrategySeen] = useState<Set<number>>(new Set())
  const [done, setDone] = useState(false)

  const scores = CANDIDATES.map((c) => ({
    ...c,
    score: scored ? (retrained ? retrainedScore(c.name) : biasedScore(c.name)) : null,
  }))

  const gap = scored && !retrained
    ? biasedScore('Alex Chen') - biasedScore('Alexia Chen')
    : scored && retrained
    ? retrainedScore('Alex Chen') - retrainedScore('Alexia Chen')
    : null

  const canComplete = retrained && strategySeen.size >= 1

  return (
    <div className="lesson-panel">
      <p className="lede">
        A hiring classifier trained on historical data learns that certain names correlate with past hires. It does not
        intend bias — it learns from biased history.
      </p>

      <div className="eth-bias-stage">
        <div className="eth-bias-context">
          <p className="micro">Model trained on: historical tech hiring data (85% male hires)</p>
        </div>

        <div className="eth-bias-resumes">
          {CANDIDATES.map((c) => (
            <div key={c.name} className="eth-bias-resume">
              <div className="eth-bias-resume-name">{c.name}</div>
              <div className="micro">Qualifications: identical</div>
              <div className="micro">Experience: 4 years</div>
              <div className="micro">Education: CS degree</div>
              {scored && (
                <motion.div
                  className="eth-bias-score"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  <span className="micro">Score:</span>
                  <span
                    className="eth-bias-score-val"
                    style={{
                      color: scores.find((s) => s.name === c.name)?.score === Math.max(...scores.map((s) => s.score ?? 0))
                        ? '#10b981'
                        : '#94a3b8',
                    }}
                  >
                    {scores.find((s) => s.name === c.name)?.score ?? '—'}%
                  </span>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {scored && gap !== null && (
          <motion.div
            className="eth-bias-gap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <p className="micro">
              Score gap: <strong>{gap} percentage points</strong>.{' '}
              {!retrained
                ? 'Cause: name "Alexia" correlates with lower historical hire rates in training data.'
                : gap > 0
                ? `Gap narrowed but not eliminated — structural bias remains in feature correlations.`
                : 'Gap closed with balanced training.'}
            </p>
          </motion.div>
        )}

        <div className="eth-bias-actions">
          {!scored && (
            <button type="button" className="btn primary" onClick={() => setScored(true)}>
              Submit both resumes
            </button>
          )}
          {scored && !retrained && (
            <button type="button" className="btn primary" onClick={() => setRetrained(true)}>
              Retrain with balanced dataset
            </button>
          )}
        </div>

        {retrained && (
          <motion.div
            className="eth-bias-strategies"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <p className="micro">Remaining gap: what can reduce it further?</p>
            {STRATEGIES.map((s, i) => (
              <motion.div
                key={i}
                className={`eth-bias-strategy ${strategySeen.has(i) ? 'eth-bias-strategy--seen' : ''}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 320, damping: 22 }}
                onClick={() => setStrategySeen((prev) => new Set([...prev, i]))}
              >
                {s}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

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
            {!scored
              ? 'Submit the resumes to see the model scores'
              : !retrained
              ? 'Retrain with balanced data and see the gap narrow'
              : 'Review the remaining mitigation strategies'}
          </span>
        )}
      </div>

      {canComplete && (
        <ConnectionCard
          title="This is a real problem in hiring systems, credit scoring, and medical diagnosis"
          body={
            <>
              The algorithm did not intend bias — it learned from biased history. In 2018, Amazon scrapped a hiring
              AI that downgraded resumes with the word "women's" (as in "women's chess club") because its training
              data came from a decade of male-dominated tech hiring.
            </>
          }
          appearsIn={['hiring algorithms', 'credit scoring models', 'medical AI diagnosis']}
          hook="Bias affects whose data is used to train models. Privacy affects who is allowed to see the data at all. Next."
        />
      )}
    </div>
  )
}
