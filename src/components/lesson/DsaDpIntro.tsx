import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

function fibNaiveCount(n: number): number {
  // Count calls without actually computing (memoized call count)
  const memo: Record<number, number> = {}
  function count(k: number): number {
    if (memo[k] !== undefined) return memo[k]
    if (k <= 1) return 1
    const result = 1 + count(k - 1) + count(k - 2)
    memo[k] = result
    return result
  }
  return count(n)
}

function fibDP(n: number): { values: number[]; calls: number } {
  if (n < 0) return { values: [], calls: 0 }
  const values: number[] = [0, 1]
  for (let i = 2; i <= n; i++) values.push(values[i - 1] + values[i - 2])
  return { values: values.slice(0, n + 1), calls: Math.max(n, 1) }
}

// Exact naive call counts for small n
const NAIVE_CALLS: Record<number, number> = {
  5: 15, 6: 25, 7: 41, 8: 67, 9: 109, 10: 177,
  11: 287, 12: 465, 13: 753, 14: 1219, 15: 1973,
  16: 3193, 17: 5167, 18: 8361, 19: 13529, 20: 21891,
}

export function DsaDpIntro({ onComplete }: { onComplete: () => void }) {
  const [n, setN] = useState(10)
  const [sliderMoved, setSliderMoved] = useState(false)
  const [crossoverSeen, setCrossoverSeen] = useState(false)

  const naiveCalls = NAIVE_CALLS[n] ?? Math.round(1.618 ** n)
  const { values: dpValues, calls: dpCalls } = fibDP(n)
  const dpResult = dpValues[n]

  const maxBarHeight = 80
  const naiveBarH = Math.min(maxBarHeight, (naiveCalls / 21891) * maxBarHeight)
  const dpBarH = Math.min(maxBarHeight, (dpCalls / 21891) * maxBarHeight)

  const handleSlider = (newN: number) => {
    setN(newN)
    setSliderMoved(true)
    if (newN >= 15) setCrossoverSeen(true)
  }

  const isDone = sliderMoved && crossoverSeen

  return (
    <div className="lesson-panel">
      <p className="lede">
        <strong>Dynamic programming</strong> avoids re-computing the same subproblems by storing results.
        Fibonacci is the simplest demonstration of the difference it makes.
      </p>

      <div className="dsa-dp-layout">
        <div className="dsa-dp-col">
          <h3 className="micro">Naive recursion</h3>
          <div className="dsa-dp-call-tree">
            <code className="dsa-dp-tree-sketch">
              fib({n}){'\n'}
              ├─ fib({n - 1}){'\n'}
              │  ├─ fib({n - 2}){'\n'}
              │  │  └─ … (recomputed){'\n'}
              │  └─ fib({n - 3}){'\n'}
              └─ fib({n - 2})  ← same as above!
            </code>
          </div>
          <motion.div
            className="dsa-dp-counter"
            animate={{ color: naiveCalls > 1000 ? 'var(--danger, #ef4444)' : 'var(--text)' }}
            transition={{ duration: 0.3 }}
          >
            <strong>{naiveCalls.toLocaleString()}</strong>
            <span className="micro"> function calls</span>
          </motion.div>
        </div>

        <div className="dsa-dp-col">
          <h3 className="micro">DP with memoization</h3>
          <div className="dsa-dp-cache">
            <span className="micro">Cache table:</span>
            <div className="dsa-dp-cache-cells">
              {dpValues.slice(0, Math.min(n + 1, 12)).map((v, i) => (
                <motion.div
                  key={i}
                  className="dsa-dp-cache-cell"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03, type: 'spring', stiffness: 320, damping: 22 }}
                >
                  <span className="micro">[{i}]</span>
                  <span>{v}</span>
                </motion.div>
              ))}
              {n > 11 && <span className="micro">… fib({n}) = {dpResult?.toLocaleString()}</span>}
            </div>
          </div>
          <div className="dsa-dp-counter">
            <strong>{dpCalls.toLocaleString()}</strong>
            <span className="micro"> unique computations</span>
          </div>
        </div>
      </div>

      {/* Bar chart comparison */}
      <div className="dsa-dp-chart">
        <div className="dsa-dp-bar-wrap">
          <motion.div
            className="dsa-dp-bar dsa-dp-bar--naive"
            animate={{ height: `${naiveBarH}px` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
          <span className="micro">Naive ({naiveCalls.toLocaleString()})</span>
        </div>
        <div className="dsa-dp-bar-wrap">
          <motion.div
            className="dsa-dp-bar dsa-dp-bar--dp"
            animate={{ height: `${Math.max(dpBarH, 4)}px` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
          <span className="micro">DP ({dpCalls})</span>
        </div>
      </div>

      <label className="dsa-dp-slider-label">
        <span className="micro">n = {n}</span>
        <input
          type="range"
          min={5}
          max={20}
          value={n}
          onChange={(e) => handleSlider(Number(e.target.value))}
          className="dsa-dp-slider"
        />
        <span className="micro">Drag to see the crossover →</span>
      </label>

      {crossoverSeen && (
        <motion.div
          className="dsa-dp-crossover micro"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          At n={n}: naive makes {naiveCalls.toLocaleString()} calls. DP makes {dpCalls}.{' '}
          <strong>Ratio: {Math.round(naiveCalls / dpCalls)}×</strong> fewer with memoization.
        </motion.div>
      )}

      <ConnectionCard
        title="Every algorithm that solves sub-problems repeatedly is a candidate for DP"
        body={
          <>
            The key insight: if the same sub-problem appears multiple times in the recursion tree, memoize it.
            Fibonacci is the textbook case, but the same logic applies to sequence alignment, shortest paths
            (Bellman-Ford), string editing (Levenshtein), and compiler optimization (register allocation).
          </>
        }
        appearsIn={['DsaDpClassic step (knapsack, LCS)', 'DsaDijkstra (DP on graphs)', 'compiler register allocation']}
        hook="Fibonacci introduces the idea. Next: two classic DP problems — knapsack and longest common subsequence."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!isDone}>
          Continue to classic DP
        </button>
        {!isDone && (
          <span className="hint">
            Move the slider to n ≥ 15 to see the crossover.
          </span>
        )}
      </div>
    </div>
  )
}
