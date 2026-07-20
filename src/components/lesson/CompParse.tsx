import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

const TOKENS = [
  { id: 't0', kind: 'IDENT', value: 'x', color: 'var(--comp-ident, #6366f1)' },
  { id: 't1', kind: 'ASSIGN', value: '=', color: 'var(--comp-assign, #f59e0b)' },
  { id: 't2', kind: 'INT', value: '3', color: 'var(--comp-int, #3ecf8e)' },
  { id: 't3', kind: 'PLUS', value: '+', color: 'var(--comp-plus, #f59e0b)' },
  { id: 't4', kind: 'IDENT', value: 'y', color: 'var(--comp-ident, #6366f1)' },
] as const

type TokenId = (typeof TOKENS)[number]['id']

// Expected consumption order: t0, t1, t2, t3, t4
const EXPECTED_ORDER: TokenId[] = ['t0', 't1', 't2', 't3', 't4']

interface ASTNode {
  label: string
  children?: ASTNode[]
}

function buildPartialAST(consumed: number): ASTNode | null {
  if (consumed === 0) return null
  // After t0 (IDENT x): Assignment node, left child being built
  // After t1 (ASSIGN =): Assignment node confirmed
  // After t2 (INT 3): Assignment → [IDENT(x), Add →[INT(3), ?]]
  // After t3 (PLUS +): Add node appears
  // After t4 (IDENT y): Complete AST
  if (consumed >= 5) {
    return {
      label: 'Assign',
      children: [
        { label: 'IDENT(x)' },
        {
          label: 'Add',
          children: [{ label: 'INT(3)' }, { label: 'IDENT(y)' }],
        },
      ],
    }
  }
  if (consumed >= 4) {
    return {
      label: 'Assign',
      children: [
        { label: 'IDENT(x)' },
        {
          label: 'Add',
          children: [{ label: 'INT(3)' }, { label: '…' }],
        },
      ],
    }
  }
  if (consumed >= 3) {
    return {
      label: 'Assign',
      children: [{ label: 'IDENT(x)' }, { label: 'Add → …' }],
    }
  }
  if (consumed >= 2) {
    return {
      label: 'Assign',
      children: [{ label: 'IDENT(x)' }, { label: '…' }],
    }
  }
  return { label: 'Assign (building…)' }
}

function ASTDisplay({ node, depth = 0 }: { node: ASTNode; depth?: number }) {
  return (
    <div className="comp-parse-ast-node" style={{ marginLeft: depth * 20 }}>
      <motion.div
        className="comp-parse-ast-label"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      >
        {node.label}
      </motion.div>
      {node.children?.map((child, i) => (
        <ASTDisplay key={i} node={child} depth={depth + 1} />
      ))}
    </div>
  )
}

export function CompParse({ onComplete }: { onComplete: () => void }) {
  const [consumed, setConsumed] = useState(0)
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const partialAST = buildPartialAST(consumed)
  const complete = consumed === TOKENS.length

  const consumeToken = (id: TokenId) => {
    const expectedIdx = consumed
    if (expectedIdx >= TOKENS.length) return
    if (id !== EXPECTED_ORDER[expectedIdx]) {
      setError(true)
      setErrorMsg(`Grammar violation: expected ${EXPECTED_ORDER[expectedIdx]} but got ${id}`)
      setTimeout(() => setError(false), 1500)
      return
    }
    setError(false)
    setConsumed(consumed + 1)
  }

  const reset = () => {
    setConsumed(0)
    setError(false)
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        The parser consumes tokens one by one, checking they follow the <strong>grammar rules</strong>. Click each
        token in order to build the Abstract Syntax Tree.
      </p>

      <div className="comp-parse-grammar">
        <span className="micro">Grammar rules:</span>
        <code className="comp-parse-rule">assign := IDENT ASSIGN expr</code>
        <code className="comp-parse-rule">expr   := INT PLUS IDENT</code>
      </div>

      <div className="comp-parse-layout">
        <div className="comp-parse-tokens-col">
          <span className="micro">Token stream — click each in order:</span>
          <div className="comp-parse-tokens">
            {TOKENS.map((t, i) => {
              const isConsumed = i < consumed
              const isNext = i === consumed
              return (
                <motion.button
                  key={t.id}
                  type="button"
                  className={`comp-parse-token ${isConsumed ? 'is-consumed' : ''} ${isNext ? 'is-next' : ''}`}
                  style={{ borderColor: t.color, color: isConsumed ? 'var(--text-muted)' : t.color }}
                  onClick={() => consumeToken(t.id)}
                  disabled={isConsumed}
                  animate={{ scale: isNext ? 1.05 : 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  {t.kind}({t.value})
                </motion.button>
              )
            })}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                className="comp-parse-error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="comp-parse-ast-col">
          <span className="micro">AST being built:</span>
          <div className="comp-parse-ast-area">
            {partialAST ? (
              <ASTDisplay node={partialAST} />
            ) : (
              <span className="micro">Click tokens above to start.</span>
            )}
            {complete && (
              <motion.div
                className="comp-parse-complete-glow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                ✓ Valid AST built
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <button type="button" className="btn" onClick={reset} style={{ marginTop: '0.5rem' }}>
        Reset
      </button>

      <ConnectionCard
        title="Parsers enforce grammar"
        body={
          <>
            Programming languages, JSON, and HTML all use parsers. They transform flat token streams into trees
            that encode the structure of meaning. A grammar violation here is a syntax error in your IDE — the
            parser rejected the token order.
          </>
        }
        appearsIn={['CompAST step', 'TypeScript type checker', 'browser HTML parser']}
        hook="You have an AST. Next you will inspect it, hover nodes, and transform it to see how tools like ESLint work."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!complete}>
          Continue to AST
        </button>
        {!complete && (
          <span className="hint">
            Click all {TOKENS.length} tokens in order to complete the AST.
          </span>
        )}
      </div>
    </div>
  )
}
