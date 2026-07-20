import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

export function CompOptimize({ onComplete }: { onComplete: () => void }) {
  const [optA, setOptA] = useState(false)
  const [optB, setOptB] = useState(false)

  const isDone = optA && optB

  return (
    <div className="lesson-panel">
      <p className="lede">
        Compilers apply hundreds of <strong>optimization passes</strong> to generated code. Two of the most
        impactful: constant folding and loop-invariant code motion.
      </p>

      <div className="comp-opt-panels">
        {/* Program A: constant folding */}
        <div className="comp-opt-panel">
          <h3 className="micro">Program A — constant folding</h3>
          <pre className="comp-opt-source">{'x = a + 0'}</pre>

          <div className="comp-opt-comparison">
            <div className="comp-opt-col">
              <span className="micro">Unoptimized (3 instructions):</span>
              <code className="comp-opt-asm">{'mov rax, [a]\nmov rbx, 0\nadd rax, rbx\nmov [x], rax'}</code>
            </div>
            <div className="comp-opt-arrow" aria-hidden>→</div>
            <div className="comp-opt-col">
              <span className="micro">Optimized (1 instruction):</span>
              <AnimatePresence>
                {optA ? (
                  <motion.code
                    className="comp-opt-asm comp-opt-asm--optimized"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  >
                    {'mov [x], [a]  ; a + 0 ≡ a'}
                  </motion.code>
                ) : (
                  <span className="comp-opt-asm comp-opt-asm--placeholder micro">
                    Click "Optimize A" to apply
                  </span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {optA && (
            <motion.div
              className="comp-opt-gain"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              4 instructions → 1. <strong>75% reduction</strong>. Adding zero is mathematically identical to
              moving the value — the compiler knows that.
            </motion.div>
          )}

          <button
            type="button"
            className="btn primary"
            onClick={() => setOptA(true)}
            disabled={optA}
          >
            {optA ? 'Optimized ✓' : 'Optimize A (constant folding)'}
          </button>
        </div>

        {/* Program B: loop-invariant code motion */}
        <div className="comp-opt-panel">
          <h3 className="micro">Program B — loop-invariant code motion</h3>
          <pre className="comp-opt-source">{'for i in range(n):\n    y = 2 * 3 + 1'}</pre>

          <div className="comp-opt-comparison">
            <div className="comp-opt-col">
              <span className="micro">Unoptimized (n × 3 instructions):</span>
              <code className="comp-opt-asm">
                {'.loop:\n  mov rax, 2\n  mov rbx, 3\n  imul rax, rbx\n  add rax, 1\n  mov [y], rax\n  ; ...n times'}
              </code>
            </div>
            <div className="comp-opt-arrow" aria-hidden>→</div>
            <div className="comp-opt-col">
              <span className="micro">Optimized (constant hoisted once):</span>
              <AnimatePresence>
                {optB ? (
                  <motion.code
                    className="comp-opt-asm comp-opt-asm--optimized"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  >
                    {'mov [y], 7  ; 2*3+1=7, computed once\n.loop:\n  ; body uses [y] directly'}
                  </motion.code>
                ) : (
                  <span className="comp-opt-asm comp-opt-asm--placeholder micro">
                    Click "Optimize B" to apply
                  </span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {optB && (
            <motion.div
              className="comp-opt-gain"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              n × 3 instructions → 1 + n. The constant <code>2 * 3 + 1 = 7</code> is computed once before the
              loop. For n = 1,000,000: <strong>3M instructions → 1M</strong>.
            </motion.div>
          )}

          <button
            type="button"
            className="btn primary"
            onClick={() => setOptB(true)}
            disabled={optB}
          >
            {optB ? 'Optimized ✓' : 'Optimize B (loop-invariant hoisting)'}
          </button>
        </div>
      </div>

      <ConnectionCard
        title="The -O2 flag makes your compiler run hundreds of optimizations like these"
        body={
          <>
            Your program gets faster without any changes to your source code. GCC and Clang can apply dead-code
            elimination, inlining, vectorization, and dozens of algebraic simplifications in a single compilation
            pass. You write the intent; the compiler writes the performance.
          </>
        }
        appearsIn={['every build system with release mode', 'CompSource counter difference with -O2', 'JVM JIT compiler at runtime']}
        hook="You have now walked the entire compiler pipeline. Next: the mathematics that underpins algorithms."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!isDone}>
          Finish Compilers chapter
        </button>
        {!isDone && (
          <span className="hint">
            Apply both optimizations to continue.
          </span>
        )}
      </div>
    </div>
  )
}
