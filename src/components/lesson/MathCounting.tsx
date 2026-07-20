import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

function factorial(n: number): number {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}

function choose(n: number, k: number): number {
  return factorial(n) / (factorial(k) * factorial(n - k))
}

export function MathCounting({ onComplete }: { onComplete: () => void }) {
  const [p1Done, setP1Done] = useState(false)
  const [p2Done, setP2Done] = useState(false)
  const [p1Shown, setP1Shown] = useState(false)
  const [p2Shown, setP2Shown] = useState(false)

  const isDone = p1Done && p2Done

  // Problem 1: 4! = 24
  const p1Answer = factorial(4)
  const p1Steps = [4, 3, 2, 1]

  // Problem 2: C(4,2) × C(48,3)
  const c42 = choose(4, 2)
  const c483 = choose(48, 3)
  const p2Answer = c42 * c483

  return (
    <div className="lesson-panel">
      <p className="lede">
        <strong>Combinatorics</strong> counts possibilities without listing them all. The right formula turns an
        astronomical search space into a single multiplication.
      </p>

      <div className="math-count-problems">
        {/* Problem 1: permutations */}
        <div className="math-count-problem">
          <h3 className="micro">Problem 1: How many ways to arrange 4 books?</h3>
          <div className="math-count-books">
            {['📗', '📘', '📕', '📙'].map((b, i) => (
              <motion.span
                key={i}
                className="math-count-book"
                animate={{ x: p1Shown ? 0 : 0 }}
                title={`Book ${i + 1}`}
              >
                {b}
              </motion.span>
            ))}
          </div>
          <p className="micro">
            For the first slot: 4 choices. Second: 3 remaining. Third: 2. Fourth: 1.
          </p>
          <div className="math-count-formula">
            <code>
              4! = {p1Steps.join(' × ')} = <strong>{p1Answer}</strong>
            </code>
          </div>

          {!p1Shown && (
            <button type="button" className="btn primary" onClick={() => setP1Shown(true)}>
              Show calculation
            </button>
          )}

          {p1Shown && (
            <AnimatePresence>
              <motion.div
                className="math-count-step-list"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                {p1Steps.map((n, i) => {
                  const running = p1Steps.slice(0, i + 1).reduce((a, b) => a * b, 1)
                  return (
                    <motion.div
                      key={i}
                      className="math-count-step"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.12, type: 'spring', stiffness: 320, damping: 22 }}
                    >
                      {i === 0 ? `${n}` : `× ${n}`} = {running}
                    </motion.div>
                  )
                })}
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => setP1Done(true)}
                  disabled={p1Done}
                >
                  {p1Done ? '✓ Got it' : 'Got it'}
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Problem 2: combinations */}
        <div className="math-count-problem">
          <h3 className="micro">Problem 2: 5-card hands with exactly 2 aces from 52 cards</h3>
          <p className="micro">
            Choose 2 aces from 4 (order doesn't matter), then 3 non-aces from 48:
          </p>
          <div className="math-count-formula">
            <code>C(4,2) × C(48,3)</code>
          </div>

          {!p2Shown && (
            <button type="button" className="btn primary" onClick={() => setP2Shown(true)}>
              Calculate
            </button>
          )}

          {p2Shown && (
            <AnimatePresence>
              <motion.div
                className="math-count-step-list"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                <motion.div className="math-count-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                  C(4,2) = 4! / (2! × 2!) = <strong>{c42}</strong> ways to pick 2 aces
                </motion.div>
                <motion.div className="math-count-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  C(48,3) = 48! / (3! × 45!) = <strong>{c483}</strong> ways to pick 3 non-aces
                </motion.div>
                <motion.div className="math-count-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  Total = {c42} × {c483} = <strong>{p2Answer.toLocaleString()}</strong> hands
                </motion.div>
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => setP2Done(true)}
                  disabled={p2Done}
                >
                  {p2Done ? '✓ Got it' : 'Got it'}
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      <div className="math-count-callout">
        <span className="micro">Why it matters:</span>
        <p className="micro">
          A password of 8 lowercase letters has 26^8 ≈ <strong>200 billion</strong> combinations (order matters —
          permutation). C(26,8) is only <strong>1.5 million</strong> if order doesn't matter. The difference
          between permutation and combination is the difference between a secure password and a crackable one.
        </p>
      </div>

      <ConnectionCard
        title="Password strength, hash collision probability, and birthday attacks all use this math"
        body={
          <>
            The birthday attack on hash functions asks: how many random inputs do you need before two hash to the
            same value? The answer is approximately √(2^n) — a combinatorics result. For SHA-256 that is still
            2^128, safely astronomical.
          </>
        }
        appearsIn={['security chapter hash analysis', 'probability step next in this chapter', 'DSA chapter hash tables']}
        hook="You can now count arrangements and selections exactly. Next: modular arithmetic — the clock math behind cryptography."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!isDone}>
          Continue to modular arithmetic
        </button>
        {!isDone && (
          <span className="hint">Solve both problems to continue.</span>
        )}
      </div>
    </div>
  )
}
