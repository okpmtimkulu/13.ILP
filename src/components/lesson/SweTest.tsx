import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type TestCase = { a: number; b: number; expected: string; actual: number }

// Buggy function: returns a + b - 1
function buggyAdd(a: number, b: number): number {
  return a + b - 1
}

function fixedAdd(a: number, b: number): number {
  return a + b
}

const TEST_CASES: Omit<TestCase, 'expected'>[] = [
  { a: 1, b: 1, actual: 0 },
  { a: -1, b: 5, actual: 0 },
  { a: 0, b: 0, actual: 0 },
  { a: 10, b: -3, actual: 0 },
]

export function SweTest({ onComplete }: { onComplete: () => void }) {
  const [expectedValues, setExpectedValues] = useState<Record<number, string>>({})
  const [ran, setRan] = useState(false)
  const [fixed, setFixed] = useState(false)
  const [done, setDone] = useState(false)

  const allFilled = TEST_CASES.every((_, i) => expectedValues[i]?.trim() !== '')

  const testResults = TEST_CASES.map((tc, i) => {
    const expected = Number(expectedValues[i])
    const fn = fixed ? fixedAdd : buggyAdd
    const actual = fn(tc.a, tc.b)
    const correctExpected = tc.a + tc.b
    return {
      ...tc,
      actual,
      expected,
      correctExpected,
      expectedCorrect: expected === correctExpected,
      pass: ran && expected === actual,
      fail: ran && expected !== actual,
    }
  })

  const anyFail = testResults.some((t) => t.fail)
  const allPass = ran && testResults.every((t) => t.pass)

  return (
    <div className="lesson-panel">
      <p className="lede">
        A subtle bug: <code>add(a, b)</code> returns <code>a + b - 1</code> instead of <code>a + b</code>. Fill in the
        expected values, run the tests, and watch one test catch the off-by-one.
      </p>

      <div className="swe-test-stage">
        <div className="swe-test-function">
          <p className="micro">Function under test:</p>
          <pre className="par-types-code">
            {fixed
              ? `function add(a, b) {\n  return a + b  // fixed\n}`
              : `function add(a, b) {\n  return a + b - 1  // bug: off by one\n}`}
          </pre>
        </div>

        <div className="swe-test-cases">
          {TEST_CASES.map((tc, i) => {
            const result = testResults[i]
            return (
              <motion.div
                key={i}
                className={`swe-test-case ${ran && result.pass ? 'swe-test-case--pass' : ran && result.fail ? 'swe-test-case--fail' : ''}`}
                animate={{
                  backgroundColor:
                    ran && result.pass
                      ? 'rgba(16, 185, 129, 0.12)'
                      : ran && result.fail
                      ? 'rgba(239, 68, 68, 0.12)'
                      : 'transparent',
                }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                <code className="swe-test-call">add({tc.a}, {tc.b})</code>
                <span className="swe-test-eq">===</span>
                <input
                  className="par-imp-blank"
                  value={expectedValues[i] ?? ''}
                  onChange={(e) => {
                    setExpectedValues((prev) => ({ ...prev, [i]: e.target.value }))
                    setRan(false)
                  }}
                  placeholder="?"
                  style={{ width: '4rem' }}
                  disabled={ran && allPass}
                />
                {ran && (
                  <span className={result.pass ? 'db-acid-ok swe-test-badge' : 'sec-sig-result--invalid swe-test-badge'}>
                    {result.pass ? '✓' : `✗ (got ${result.actual})`}
                  </span>
                )}
              </motion.div>
            )
          })}
        </div>

        {ran && anyFail && !fixed && (
          <motion.div
            className="swe-test-failure-msg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <p>Test failure found the bug: <code>add</code> returns <code>a + b - 1</code></p>
            <button type="button" className="btn primary" onClick={() => { setFixed(true); setRan(false) }}>
              Fix the bug
            </button>
          </motion.div>
        )}

        {allPass && (
          <motion.p
            className="db-acid-ok"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            All 4 tests pass. Bug confirmed fixed.
          </motion.p>
        )}
      </div>

      <div className="lesson-actions">
        {!ran && allFilled && (
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
        {!allFilled && <span className="hint">Fill in all expected values first</span>}
        {allFilled && !ran && <span className="hint">Press Run tests</span>}
        {ran && anyFail && !fixed && <span className="hint">A failing test found the bug — fix it</span>}
      </div>

      {allPass && (
        <ConnectionCard
          title="A failing test is a proof that something is wrong"
          body={
            <>
              A passing test is evidence that specific cases work — never a guarantee that all cases work. Tests define
              the contract of a function: given these inputs, expect these outputs. The test suite is executable
              documentation.
            </>
          }
          appearsIn={['every production codebase', 'continuous integration pipelines', 'test-driven development']}
          hook="Writing tests after code finds bugs in what you built. Writing tests first changes what you build. That is TDD."
        />
      )}
    </div>
  )
}
