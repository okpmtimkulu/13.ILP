import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

function triangleSum(n: number): number {
  return (n * (n + 1)) / 2
}

export function MathProof({ onComplete }: { onComplete: () => void }) {
  const [baseLeft, setBaseLeft] = useState('')
  const [baseRight, setBaseRight] = useState('')
  const [baseDone, setBaseDone] = useState(false)
  const [baseError, setBaseError] = useState('')
  const [k, setK] = useState(1)
  const [kSeen, setKSeen] = useState<Set<number>>(new Set())

  const checkBase = () => {
    if (baseLeft.trim() === '1' && baseRight.trim() === '1') {
      setBaseDone(true)
      setBaseError('')
    } else {
      setBaseError('Not quite — for n=1: left side = 1, right side = 1(1+1)/2 = 1')
    }
  }

  const handleKChange = (newK: number) => {
    setK(newK)
    setKSeen((prev) => new Set([...prev, newK]))
  }

  const leftSide = triangleSum(k)
  const rightSide = triangleSum(k)
  const nextLeftSide = triangleSum(k + 1)
  const nextRightSide = triangleSum(k + 1)

  const enoughKSeen = kSeen.size >= 3
  const isDone = baseDone && enoughKSeen

  return (
    <div className="lesson-panel">
      <p className="lede">
        <strong>Mathematical induction</strong> proves a statement holds for all natural numbers. The strategy: prove
        it for n=1 (base case), then prove that if it holds for n=k it must hold for n=k+1 (inductive step).
      </p>

      <div className="math-proof-claim">
        <span className="micro">Claim: for all n ≥ 1,</span>
        <div className="math-proof-formula">1 + 2 + ... + n = n(n+1) / 2</div>
      </div>

      <div className="math-proof-section">
        <h3 className="micro">Base case: n = 1</h3>
        <p className="micro">Fill in both sides:</p>
        <div className="math-proof-blanks">
          <label className="math-proof-blank-row">
            <span>Left side (1 + 2 + ... + 1):</span>
            <input
              type="text"
              className="math-proof-input"
              value={baseLeft}
              onChange={(e) => setBaseLeft(e.target.value)}
              disabled={baseDone}
              placeholder="?"
              maxLength={5}
            />
          </label>
          <label className="math-proof-blank-row">
            <span>Right side (1 × 2 / 2):</span>
            <input
              type="text"
              className="math-proof-input"
              value={baseRight}
              onChange={(e) => setBaseRight(e.target.value)}
              disabled={baseDone}
              placeholder="?"
              maxLength={5}
            />
          </label>
        </div>
        {baseError && <p className="math-proof-error micro">{baseError}</p>}
        {!baseDone && (
          <button type="button" className="btn primary" onClick={checkBase}>
            Verify base case
          </button>
        )}
        {baseDone && (
          <motion.div
            className="math-proof-verified"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            ✓ Base case verified: 1 = 1
          </motion.div>
        )}
      </div>

      <div className="math-proof-section">
        <h3 className="micro">Inductive step: assume true for n = k, show for n = k+1</h3>
        <label className="math-proof-slider-row">
          <span className="micro">k = {k}</span>
          <input
            type="range"
            min={1}
            max={10}
            value={k}
            onChange={(e) => handleKChange(Number(e.target.value))}
            className="math-proof-slider"
          />
        </label>

        <div className="math-proof-inductive">
          <div className="math-proof-ind-row">
            <span className="micro">For n = k = {k}:</span>
            <code className="math-proof-eq">
              1 + 2 + ... + {k} = {k}({k + 1})/2 = <strong>{leftSide}</strong>
            </code>
          </div>
          <div className="math-proof-ind-row">
            <span className="micro">For n = k+1 = {k + 1}:</span>
            <code className="math-proof-eq">
              1 + 2 + ... + {k + 1} = {k + 1}({k + 2})/2 = <strong>{nextRightSide}</strong>
            </code>
          </div>
          <div className="math-proof-ind-row">
            <span className="micro">Inductive step: {leftSide} + {k + 1} = {nextLeftSide} ✓ equals {nextRightSide}</span>
          </div>
        </div>

        <p className="micro" role="status">
          k values seen: {[...kSeen].sort((a, b) => a - b).join(', ')} ({kSeen.size}/3 needed)
        </p>
      </div>

      <ConnectionCard
        title="Induction is how algorithms are proved correct"
        body={
          <>
            Every Big-O proof, every invariant argument, and every correctness proof in algorithms uses induction.
            When a textbook says "by induction, the algorithm terminates in O(n log n) steps," this is the
            argument structure being invoked.
          </>
        }
        appearsIn={['Big-O proofs in the DSA chapter', 'correctness proofs for sorting algorithms', 'loop invariant analysis']}
        hook="You can now reason about infinite sets of numbers with a finite argument. Next: sets themselves."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!isDone}>
          Continue to sets
        </button>
        {!isDone && !baseDone && (
          <span className="hint">Complete the base case first.</span>
        )}
        {!isDone && baseDone && !enoughKSeen && (
          <span className="hint">
            Move the k slider to see {3 - kSeen.size} more value{3 - kSeen.size !== 1 ? 's' : ''}.
          </span>
        )}
      </div>
    </div>
  )
}
