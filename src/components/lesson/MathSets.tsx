import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type SetOp = 'union' | 'intersection' | 'difference' | 'complement'

const BASE_A = new Set([1, 2, 3, 4])
const BASE_B = new Set([3, 4, 5, 6])

function computeResult(op: SetOp, a: Set<number>, b: Set<number>): Set<number> {
  if (op === 'union') return new Set([...a, ...b])
  if (op === 'intersection') return new Set([...a].filter((x) => b.has(x)))
  if (op === 'difference') return new Set([...a].filter((x) => !b.has(x)))
  // complement: elements in neither a nor b (from universe 1-9)
  const all = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  const union = new Set([...a, ...b])
  return new Set(all.filter((x) => !union.has(x)))
}

const OP_LABELS: Record<SetOp, string> = {
  union: 'A ∪ B (Union)',
  intersection: 'A ∩ B (Intersection)',
  difference: 'A − B (Difference)',
  complement: '¬(A ∪ B) (Complement)',
}

export function MathSets({ onComplete }: { onComplete: () => void }) {
  const [setA, setSetA] = useState(BASE_A)
  const [setB, setSetB] = useState(BASE_B)
  const [activeOp, setActiveOp] = useState<SetOp | null>(null)
  const [usedOps, setUsedOps] = useState<Set<SetOp>>(new Set())
  const [functionDefined, setFunctionDefined] = useState(false)
  const [mapping, setMapping] = useState<Record<number, number>>({})

  const result = activeOp ? computeResult(activeOp, setA, setB) : null

  const doOp = (op: SetOp) => {
    setActiveOp(op)
    setUsedOps((prev) => new Set([...prev, op]))
  }

  const toggleElement = (num: number, which: 'A' | 'B') => {
    if (which === 'A') {
      setSetA((prev) => {
        const next = new Set(prev)
        if (next.has(num)) next.delete(num)
        else next.add(num)
        return next
      })
    } else {
      setSetB((prev) => {
        const next = new Set(prev)
        if (next.has(num)) next.delete(num)
        else next.add(num)
        return next
      })
    }
    setActiveOp(null)
  }

  const setMappingFor = (from: number, to: number) => {
    setMapping((prev) => ({ ...prev, [from]: to }))
  }

  const aElements = [...setA].sort((a, b) => a - b)
  const bElements = [...setB].sort((a, b) => a - b)

  const isInjective =
    Object.keys(mapping).length === aElements.length &&
    new Set(Object.values(mapping)).size === aElements.length

  const isSurjective =
    bElements.every((b) => Object.values(mapping).includes(b))

  const handleFunctionDone = () => setFunctionDefined(true)

  const isDone = usedOps.size >= 4 && functionDefined

  return (
    <div className="lesson-panel">
      <p className="lede">
        A <strong>set</strong> is an unordered collection of distinct elements. Set operations combine them.
        Functions map elements from one set to another.
      </p>

      <div className="math-sets-venn">
        <div className="math-sets-controls">
          <div className="math-sets-set-editor">
            <span className="micro">A = &#123;{aElements.join(', ')}&#125;</span>
            <div className="math-sets-pills">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`math-sets-pill ${setA.has(n) ? 'is-in-a' : ''}`}
                  onClick={() => toggleElement(n, 'A')}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="math-sets-set-editor">
            <span className="micro">B = &#123;{bElements.join(', ')}&#125;</span>
            <div className="math-sets-pills">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`math-sets-pill ${setB.has(n) ? 'is-in-b' : ''}`}
                  onClick={() => toggleElement(n, 'B')}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="math-sets-ops">
          {(['union', 'intersection', 'difference', 'complement'] as SetOp[]).map((op) => (
            <button
              key={op}
              type="button"
              className={`btn ${activeOp === op ? 'primary' : ''} ${usedOps.has(op) ? 'is-used' : ''}`}
              onClick={() => doOp(op)}
            >
              {OP_LABELS[op]}
            </button>
          ))}
        </div>

        {result && (
          <motion.div
            key={activeOp}
            className="math-sets-result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <span className="micro">{activeOp && OP_LABELS[activeOp]} =</span>
            <code>&#123;{[...result].sort((a, b) => a - b).join(', ')}&#125;</code>
          </motion.div>
        )}

        <p className="micro" role="status">
          Operations used: {usedOps.size}/4
        </p>
      </div>

      <div className="math-sets-function">
        <h3 className="micro">Define a function f: A → B</h3>
        <p className="micro">Map each element of A to an element of B:</p>
        <div className="math-sets-mapping">
          {aElements.map((a) => (
            <div key={a} className="math-sets-map-row">
              <span>{a} →</span>
              <select
                className="math-sets-map-select"
                value={mapping[a] ?? ''}
                onChange={(e) => setMappingFor(a, Number(e.target.value))}
              >
                <option value="">pick</option>
                {bElements.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {Object.keys(mapping).length === aElements.length && (
          <motion.div
            className="math-sets-fn-analysis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="micro">
              <strong>Injective (one-to-one)?</strong>{' '}
              {isInjective ? '✓ Yes — no two elements share a target' : '✗ No — two elements share a target'}
            </p>
            <p className="micro">
              <strong>Surjective (onto)?</strong>{' '}
              {isSurjective ? '✓ Yes — every element of B is hit' : '✗ No — some elements of B are unreached'}
            </p>
            <button type="button" className="btn primary" onClick={handleFunctionDone} disabled={functionDefined}>
              {functionDefined ? 'Function noted ✓' : 'Record this function'}
            </button>
          </motion.div>
        )}
      </div>

      <ConnectionCard
        title="Sets are how databases define tables, type systems define types, and cryptographers define key spaces"
        body={
          <>
            A database table is a set of tuples. A type in TypeScript is the set of all values that satisfy
            its constraints. A cryptographic key space is the set of all possible keys — its size is the security
            level. Set theory is the vocabulary for all of these ideas.
          </>
        }
        appearsIn={['databases chapter', 'TypeScript type system', 'key space analysis in security chapter']}
        hook="Sets let you count possibilities. Next: combinatorics — the mathematics of counting exactly."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!isDone}>
          Continue to counting
        </button>
        {!isDone && (
          <span className="hint">
            Use all 4 operations and define a function.
          </span>
        )}
      </div>
    </div>
  )
}
