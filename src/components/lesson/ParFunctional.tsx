import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

const BASE_LIST = [1, 2, 3, 4, 5]

type Step = 'map' | 'filter' | 'reduce'

export function ParFunctional({ onComplete }: { onComplete: () => void }) {
  const [activeSteps, setActiveSteps] = useState<Step[]>([])
  const [mutateAttempt, setMutateAttempt] = useState(false)
  const [done, setDone] = useState(false)

  const addStep = (step: Step) => {
    if (!activeSteps.includes(step)) {
      setActiveSteps((prev) => [...prev, step])
    }
  }

  const mapped = BASE_LIST.map((x) => x * 2)
  const filtered = mapped.filter((x) => x > 4)
  const reduced = filtered.reduce((acc, x) => acc + x, 0)

  const mapActive = activeSteps.includes('map')
  const filterActive = activeSteps.includes('filter')
  const reduceActive = activeSteps.includes('reduce')
  const allChained = mapActive && filterActive && reduceActive

  return (
    <div className="lesson-panel">
      <p className="lede">
        Functional programming transforms data without mutating it. Pure functions always return the same output for the
        same input — no hidden state, no side effects.
      </p>

      <div className="par-fp-stage">
        <div className="par-fp-pipeline">
          {/* Source */}
          <div className="par-fp-box par-fp-box--source">
            <span className="micro">Source</span>
            <code>[{BASE_LIST.join(', ')}]</code>
          </div>

          <AnimatePresence>
            {mapActive && (
              <>
                <motion.div
                  className="par-fp-arrow"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  .map(x =&gt; x * 2)
                </motion.div>
                <motion.div
                  className="par-fp-box par-fp-box--map"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  <span className="micro">After map</span>
                  <code>[{mapped.join(', ')}]</code>
                </motion.div>
              </>
            )}

            {filterActive && (
              <>
                <motion.div
                  className="par-fp-arrow"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  .filter(x =&gt; x &gt; 4)
                </motion.div>
                <motion.div
                  className="par-fp-box par-fp-box--filter"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  <span className="micro">After filter</span>
                  <code>[{filtered.join(', ')}]</code>
                </motion.div>
              </>
            )}

            {reduceActive && (
              <>
                <motion.div
                  className="par-fp-arrow"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  .reduce((acc, x) =&gt; acc + x, 0)
                </motion.div>
                <motion.div
                  className="par-fp-box par-fp-box--reduce"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  <span className="micro">Result</span>
                  <code>{reduced}</code>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="par-fp-add-steps">
          {!mapActive && (
            <button type="button" className="btn primary" onClick={() => addStep('map')}>
              Add .map(x =&gt; x * 2)
            </button>
          )}
          {mapActive && !filterActive && (
            <button type="button" className="btn primary" onClick={() => addStep('filter')}>
              Add .filter(x =&gt; x &gt; 4)
            </button>
          )}
          {filterActive && !reduceActive && (
            <button type="button" className="btn primary" onClick={() => addStep('reduce')}>
              Add .reduce((acc, x) =&gt; acc + x, 0)
            </button>
          )}
        </div>

        <div className="par-fp-immutability">
          <p className="micro">
            <strong>No variables mutated:</strong>
          </p>
          <div className="par-fp-source-check">
            <span className="micro">Original list after all transformations: <code>[{BASE_LIST.join(', ')}]</code></span>
            <span className="db-acid-ok"> unchanged</span>
          </div>
          <button
            type="button"
            className="btn primary"
            style={{ marginTop: '0.5rem', background: mutateAttempt ? 'var(--error)' : undefined }}
            onClick={() => setMutateAttempt(true)}
            disabled={mutateAttempt}
          >
            Try: list[0] = 99
          </button>
          {mutateAttempt && (
            <motion.p
              className="par-enc-error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              TypeError: Cannot assign to read only property '0' — immutable data enforced
            </motion.p>
          )}
        </div>

        {allChained && (
          <motion.div
            className="par-fp-parallel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <strong>Why this matters at scale:</strong>
            <p className="micro">
              Run this pipeline on 1 million items across 16 CPU cores. Because there are no shared variables, each core
              processes its slice independently — no locks, no race conditions. Functional pipelines parallelize for free.
            </p>
          </motion.div>
        )}
      </div>

      <div className="lesson-actions">
        {allChained && !done && (
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
        {!allChained && (
          <span className="hint">Chain all three transformations to continue</span>
        )}
      </div>

      {allChained && (
        <ConnectionCard
          title="React, Spark, and Unix pipes are all built on this idea"
          body={
            <>
              React components are pure functions from props to UI. Apache Spark pipelines are map/filter/reduce on
              distributed datasets. Unix pipes (<code>cat | grep | sort | uniq</code>) are functional composition in
              the shell. The pattern is universal.
            </>
          }
          appearsIn={['React components', 'Spark data pipelines', 'Unix shell pipelines']}
          hook="Pure functions have no surprise behaviors. Type systems make that guarantee visible to the compiler. Next: type safety."
        />
      )}
    </div>
  )
}
