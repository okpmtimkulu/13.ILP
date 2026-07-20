import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type LogicBlock = { id: string; code: string }

const TEST_CASES = [
  { input: 3, expected: 'Fizz', label: 'fizzBuzz(3) === "Fizz"' },
  { input: 5, expected: 'Buzz', label: 'fizzBuzz(5) === "Buzz"' },
  { input: 15, expected: 'FizzBuzz', label: 'fizzBuzz(15) === "FizzBuzz"' },
  { input: 7, expected: '7', label: 'fizzBuzz(7) === "7"' },
  { input: 30, expected: 'FizzBuzz', label: 'fizzBuzz(30) === "FizzBuzz"' },
]

const LOGIC_BLOCKS: LogicBlock[] = [
  { id: 'fizzbuzz', code: 'if n % 15 === 0 → return "FizzBuzz"' },
  { id: 'fizz', code: 'if n % 3 === 0 → return "Fizz"' },
  { id: 'buzz', code: 'if n % 5 === 0 → return "Buzz"' },
  { id: 'num', code: 'return String(n)' },
]

function runFizzBuzz(n: number, blocks: string[]): string {
  for (const b of blocks) {
    if (b === 'fizzbuzz' && n % 15 === 0) return 'FizzBuzz'
    if (b === 'fizz' && n % 3 === 0) return 'Fizz'
    if (b === 'buzz' && n % 5 === 0) return 'Buzz'
    if (b === 'num') return String(n)
  }
  return ''
}

export function SweTDD({ onComplete }: { onComplete: () => void }) {
  const [placedBlocks, setPlacedBlocks] = useState<LogicBlock[]>([])
  const [ran, setRan] = useState(false)
  const [done, setDone] = useState(false)

  const availableBlocks = LOGIC_BLOCKS.filter((b) => !placedBlocks.some((p) => p.id === b.id))

  const placeBlock = (block: LogicBlock) => {
    setPlacedBlocks((prev) => [...prev, block])
    setRan(false)
  }

  const removeBlock = (id: string) => {
    setPlacedBlocks((prev) => prev.filter((b) => b.id !== id))
    setRan(false)
  }

  const blockIds = placedBlocks.map((b) => b.id)
  const results = TEST_CASES.map((tc) => {
    const actual = runFizzBuzz(tc.input, blockIds)
    return { ...tc, actual, pass: ran && actual === tc.expected }
  })

  const allPass = ran && results.every((r) => r.pass)

  return (
    <div className="lesson-panel">
      <p className="lede">
        In Test-Driven Development, you write the tests <strong>first</strong>. All tests are red. Then you write
        just enough code to make them green. Write the FizzBuzz function by dragging logic blocks.
      </p>

      <div className="swe-tdd-stage">
        <div className="swe-tdd-tests">
          <p className="micro">Tests (written first — before implementation):</p>
          {results.map((r, i) => (
            <motion.div
              key={i}
              className={`swe-test-case ${ran && r.pass ? 'swe-test-case--pass' : ran && !r.pass ? 'swe-test-case--fail' : 'swe-test-case--pending'}`}
              animate={{
                backgroundColor:
                  ran && r.pass
                    ? 'rgba(16, 185, 129, 0.12)'
                    : ran && !r.pass
                    ? 'rgba(239, 68, 68, 0.12)'
                    : 'rgba(148, 163, 184, 0.08)',
              }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <code>{r.label}</code>
              {ran && (
                <span className={r.pass ? 'db-acid-ok swe-test-badge' : 'sec-sig-result--invalid swe-test-badge'}>
                  {r.pass ? '✓' : `✗ got "${r.actual}"`}
                </span>
              )}
              {!ran && <span className="swe-test-badge-pending">pending</span>}
            </motion.div>
          ))}
        </div>

        <div className="swe-tdd-impl">
          <p className="micro">function fizzBuzz(n) {'{'}</p>
          <div className="swe-tdd-body">
            {placedBlocks.map((block, i) => (
              <motion.div
                key={block.id}
                className="swe-tdd-block swe-tdd-block--placed"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                onClick={() => removeBlock(block.id)}
                title="Click to remove"
              >
                <code>{block.code}</code>
                <span className="micro" style={{ marginLeft: '0.5rem', color: 'var(--text-3)' }}>×</span>
              </motion.div>
            ))}
            {placedBlocks.length === 0 && (
              <span className="micro swe-tdd-empty">Drop logic blocks here</span>
            )}
          </div>
          <p className="micro">{'}'}</p>
        </div>

        <div className="swe-tdd-available">
          <p className="micro">Available logic blocks (click to add):</p>
          <div className="swe-tdd-blocks">
            {availableBlocks.map((block) => (
              <motion.button
                key={block.id}
                type="button"
                className="swe-tdd-block swe-tdd-block--available"
                onClick={() => placeBlock(block)}
                whileTap={{ scale: 0.97 }}
              >
                <code>{block.code}</code>
              </motion.button>
            ))}
            {availableBlocks.length === 0 && (
              <span className="micro">All blocks placed</span>
            )}
          </div>
        </div>
      </div>

      <div className="lesson-actions">
        {placedBlocks.length > 0 && !allPass && (
          <button type="button" className="btn primary" onClick={() => setRan(true)}>
            Run tests
          </button>
        )}
        {allPass && !done && (
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
        {placedBlocks.length === 0 && <span className="hint">Add logic blocks to build the function</span>}
        {!allPass && ran && <span className="hint">Rearrange blocks — order matters (check FizzBuzz before Fizz/Buzz)</span>}
      </div>

      {allPass && (
        <ConnectionCard
          title="Writing tests first forces you to think about the interface before the implementation"
          body={
            <>
              Most bugs come from unclear requirements, not bad code. Writing tests first forces you to ask "what should
              this do?" before you ask "how should it do it?" — catching ambiguity before it becomes a bug.
            </>
          }
          appearsIn={['test-driven development (TDD)', 'behavior-driven development (BDD)', 'acceptance tests']}
          hook="Tests document what code does. SOLID principles document how code should be structured at scale."
        />
      )}
    </div>
  )
}
