import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

export function ParTypes({ onComplete }: { onComplete: () => void }) {
  const [pythonRun, setPythonRun] = useState(false)
  const [tsRun, setTsRun] = useState(false)
  const [inferenceShown, setInferenceShown] = useState(false)
  const [genericsShown, setGenericsShown] = useState(false)
  const [done, setDone] = useState(false)

  const seenBoth = pythonRun && tsRun

  return (
    <div className="lesson-panel">
      <p className="lede">
        Type systems catch bugs before your code runs. The same bug — passing a string where a number is expected —
        behaves completely differently in Python versus TypeScript.
      </p>

      <div className="par-types-stage">
        <div className="par-types-columns">
          {/* Python */}
          <div className="par-types-col">
            <div className="par-types-lang-header par-types-lang-header--python">Python</div>
            <pre className="par-types-code">{`def add(a, b):
    return a + b

result = add(3, "2")
# Called with string "2"
print(result)  # ???`}</pre>
            <button
              type="button"
              className="btn primary"
              onClick={() => setPythonRun(true)}
              disabled={pythonRun}
            >
              Run
            </button>
            {pythonRun && (
              <motion.div
                className="par-types-output par-types-output--error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                <p>Output: <code>"32"</code></p>
                <p className="micro" style={{ color: 'var(--error)' }}>
                  No error. Python concatenated "3" + "2" = "32" (wrong answer).
                  Bug discovered at runtime, possibly in production.
                </p>
              </motion.div>
            )}
          </div>

          {/* TypeScript */}
          <div className="par-types-col">
            <div className="par-types-lang-header par-types-lang-header--ts">TypeScript</div>
            <pre className="par-types-code">{`function add(a: number, b: number): number {
    return a + b
}

const result = add(3, "2")
//                   ^^^
// Argument of type 'string' is not
// assignable to parameter of type 'number'`}</pre>
            <button
              type="button"
              className="btn primary"
              onClick={() => setTsRun(true)}
              disabled={tsRun}
            >
              Compile
            </button>
            {tsRun && (
              <motion.div
                className="par-types-output par-types-output--ok"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                <p className="db-acid-ok">Type error at compile time — before any code runs.</p>
                <p className="micro">
                  TypeScript compiler underlines <code>"2"</code> at line 5. Fix it there, not in production.
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {seenBoth && (
          <motion.div
            className="par-types-extras"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <div className="par-types-extra">
              <button
                type="button"
                className="btn primary"
                onClick={() => setInferenceShown(true)}
                disabled={inferenceShown}
              >
                Show type inference
              </button>
              {inferenceShown && (
                <motion.pre
                  className="par-types-code"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  {`// TypeScript figures out the type — you don't have to annotate
const x = 5       // inferred: number
const s = "hello" // inferred: string
const arr = [1, 2, 3] // inferred: number[]

function double(n: number) {
  return n * 2  // return type inferred: number
}`}
                </motion.pre>
              )}
            </div>

            <div className="par-types-extra">
              <button
                type="button"
                className="btn primary"
                onClick={() => setGenericsShown(true)}
                disabled={genericsShown}
              >
                Show generic types: Array&lt;T&gt;
              </button>
              {genericsShown && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  <pre className="par-types-code">
                    {`// T is a type parameter — filled in at usage time
const numbers: Array<number> = [1, 2, 3]
const names: Array<string> = ["Alice", "Bob"]

numbers.push("oops") // Error: string not assignable to number
names.push(42)       // Error: number not assignable to string

// Same Array implementation — different type safety per usage`}
                  </pre>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <div className="lesson-actions">
        {seenBoth && inferenceShown && genericsShown && !done && (
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
        {!seenBoth && (
          <span className="hint">Run both Python and TypeScript examples to continue</span>
        )}
        {seenBoth && (!inferenceShown || !genericsShown) && (
          <span className="hint">Show type inference and generics to continue</span>
        )}
      </div>

      {seenBoth && (
        <ConnectionCard
          title="TypeScript catches entire categories of bugs before your code runs"
          body={
            <>
              TypeScript is now used in over 90% of large-scale web projects. The productivity gain is not just catching
              bugs — it is IDE autocompletion, refactoring safety, and the ability to reason about code you have never
              read before.
            </>
          }
          appearsIn={['TypeScript', 'Rust type system', 'Java generics', 'Haskell type inference']}
          hook="Types are how you communicate with the compiler. Memory models are how you communicate with the hardware. Last paradigm: memory ownership."
        />
      )}
    </div>
  )
}
