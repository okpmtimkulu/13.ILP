import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Op = 'AND' | 'OR' | 'NOT' | 'IMPL'
type Symbol = 'P' | 'Q' | Op

interface Proposition {
  display: string
  evaluate: (p: boolean, q: boolean) => boolean
}

function buildProposition(symbols: Symbol[]): Proposition | null {
  const s = symbols.join(' ')

  const presets: Record<string, Proposition> = {
    'P AND Q': { display: 'P ∧ Q', evaluate: (p, q) => p && q },
    'P OR Q': { display: 'P ∨ Q', evaluate: (p, q) => p || q },
    'NOT P': { display: '¬P', evaluate: (p) => !p },
    'P AND NOT Q': { display: 'P ∧ ¬Q', evaluate: (p, q) => p && !q },
    'P IMPL Q': { display: 'P → Q', evaluate: (p, q) => !p || q },
    'P OR NOT P': { display: 'P ∨ ¬P', evaluate: () => true },
    'P AND NOT P': { display: 'P ∧ ¬P', evaluate: () => false },
  }

  return presets[s] ?? null
}

function TruthTable({ prop }: { prop: Proposition }) {
  const rows = [
    [false, false],
    [false, true],
    [true, false],
    [true, true],
  ]

  const results = rows.map(([p, q]) => prop.evaluate(p, q))
  const allTrue = results.every(Boolean)
  const allFalse = results.every((r) => !r)

  return (
    <div className="math-logic-table-wrap">
      {allTrue && <div className="math-logic-badge math-logic-badge--tautology">Tautology (always true)</div>}
      {allFalse && <div className="math-logic-badge math-logic-badge--contradiction">Contradiction (always false)</div>}
      <table className="math-logic-table">
        <thead>
          <tr>
            <th>P</th>
            <th>Q</th>
            <th>{prop.display}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([p, q], i) => (
            <tr key={i} className={results[i] ? 'is-true' : 'is-false'}>
              <td>{p ? 'T' : 'F'}</td>
              <td>{q ? 'T' : 'F'}</td>
              <td className={results[i] ? 'math-logic-true' : 'math-logic-false'}>{results[i] ? 'T' : 'F'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function MathLogic({ onComplete }: { onComplete: () => void }) {
  const [p, setP] = useState(true)
  const [q, setQ] = useState(false)
  const [symbols, setSymbols] = useState<Symbol[]>([])
  const [propCount, setPropCount] = useState(0)

  const add = (s: Symbol) => setSymbols((prev) => [...prev, s])
  const clear = () => setSymbols([])
  const loadPreset = () => {
    setSymbols(['P', 'IMPL', 'Q'])
  }

  const prop = buildProposition(symbols)

  const evaluateNow = prop ? prop.evaluate(p, q) : null

  const handleEvaluate = () => {
    if (prop) setPropCount((c) => c + 1)
  }

  const isDone = propCount >= 2

  const displaySymbol = (s: Symbol): string => {
    if (s === 'AND') return '∧'
    if (s === 'OR') return '∨'
    if (s === 'NOT') return '¬'
    if (s === 'IMPL') return '→'
    return s
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        Propositional logic is the mathematics of <strong>true/false statements</strong>. Build compound propositions
        from atomic variables P and Q, then see the truth table update live.
      </p>

      <div className="math-logic-toggles">
        <button
          type="button"
          className={`math-logic-var ${p ? 'is-true' : 'is-false'}`}
          onClick={() => setP(!p)}
          aria-pressed={p}
        >
          P = {p ? 'T' : 'F'}
        </button>
        <button
          type="button"
          className={`math-logic-var ${q ? 'is-true' : 'is-false'}`}
          onClick={() => setQ(!q)}
          aria-pressed={q}
        >
          Q = {q ? 'T' : 'F'}
        </button>
      </div>

      <div className="math-logic-builder">
        <span className="micro">Build proposition — click to append:</span>
        <div className="math-logic-symbol-row">
          {(['P', 'Q', 'AND', 'OR', 'NOT', 'IMPL'] as Symbol[]).map((s) => (
            <button key={s} type="button" className="math-logic-sym-btn" onClick={() => add(s)}>
              {displaySymbol(s)}
            </button>
          ))}
          <button type="button" className="btn" onClick={clear}>
            Clear
          </button>
          <button type="button" className="btn" onClick={loadPreset}>
            Load: P → Q
          </button>
        </div>

        <div className="math-logic-expr">
          {symbols.length > 0 ? (
            <code className="math-logic-expr-text">
              {symbols.map(displaySymbol).join(' ')}
            </code>
          ) : (
            <span className="micro">No symbols yet.</span>
          )}
        </div>
      </div>

      {prop && (
        <motion.div
          key={symbols.join('-')}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          <TruthTable prop={prop} />
          <div className="math-logic-current">
            <span className="micro">
              Current values (P={p ? 'T' : 'F'}, Q={q ? 'T' : 'F'}): <strong>{prop.display} = {evaluateNow ? 'TRUE' : 'FALSE'}</strong>
            </span>
          </div>
          <button type="button" className="btn primary" onClick={handleEvaluate}>
            Count this evaluation ({propCount}/2 needed)
          </button>
        </motion.div>
      )}

      {!prop && symbols.length > 0 && (
        <p className="micro">That combination is not a recognized proposition. Try: P AND Q, P OR NOT Q, etc.</p>
      )}

      <ConnectionCard
        title="You built AND and OR gates in Layer 1 — those gates ARE this logic"
        body={
          <>
            The AND gate you wired evaluates exactly the truth table above for P ∧ Q. Hardware is mathematics
            made physical. Every conditional in every program reduces to one of these truth operations at the
            silicon level.
          </>
        }
        appearsIn={['Layer 1 gates', 'compiler optimizations that fold boolean expressions', 'database WHERE clause evaluation']}
        hook="Logic tells you what is true. Proof tells you how to convince anyone it is always true. Next: mathematical induction."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!isDone}>
          Continue to proof techniques
        </button>
        {!isDone && (
          <span className="hint">
            Build and evaluate {2 - propCount} more proposition{2 - propCount !== 1 ? 's' : ''}.
          </span>
        )}
      </div>
    </div>
  )
}
