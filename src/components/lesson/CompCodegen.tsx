import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

interface CodegenStep {
  nodeId: string
  nodeLabel: string
  instruction: string
  register: string
}

const STEPS: CodegenStep[] = [
  { nodeId: 'ident-y', nodeLabel: 'IDENT(y)', instruction: 'mov rax, [y]', register: 'rax ← y' },
  { nodeId: 'int-3', nodeLabel: 'INT(3)', instruction: 'mov rbx, 3', register: 'rbx ← 3' },
  { nodeId: 'add', nodeLabel: 'Add', instruction: 'add rax, rbx', register: 'rax ← rax + rbx' },
  { nodeId: 'ident-x', nodeLabel: 'IDENT(x)', instruction: 'mov [x], rax', register: '[x] ← rax' },
]

export function CompCodegen({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(-1)
  const [autoRunning, setAutoRunning] = useState(false)
  const [done, setDone] = useState(false)

  const visibleSteps = STEPS.slice(0, currentStep + 1)

  const stepForward = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      setDone(true)
    }
  }

  const runAll = () => {
    if (autoRunning) return
    setAutoRunning(true)
    setCurrentStep(-1)
    setDone(false)

    let i = 0
    const tick = () => {
      if (i < STEPS.length) {
        setCurrentStep(i - 1)
        i++
        window.setTimeout(tick, 600)
      } else {
        setCurrentStep(STEPS.length - 1)
        window.setTimeout(() => {
          setDone(true)
          setAutoRunning(false)
        }, 500)
      }
    }
    window.setTimeout(tick, 300)
  }

  const reset = () => {
    setCurrentStep(-1)
    setDone(false)
    setAutoRunning(false)
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        The compiler walks the AST <strong>depth-first</strong> — leaves before parents. Each node emits one or more
        assembly instructions and is assigned a CPU register. Step through or run automatically.
      </p>

      <div className="comp-codegen-layout">
        <div className="comp-codegen-ast-col">
          <span className="micro">AST traversal order (depth-first):</span>
          <div className="comp-codegen-ast">
            {['assign', 'ident-x', 'add', 'int-3', 'ident-y'].map((id) => {
              const stepIdx = STEPS.findIndex((s) => s.nodeId === id)
              const isActive = stepIdx !== -1 && currentStep === stepIdx
              const isPast = stepIdx !== -1 && currentStep > stepIdx
              return (
                <motion.div
                  key={id}
                  className={`comp-codegen-ast-node ${isActive ? 'is-active' : ''} ${isPast ? 'is-past' : ''}`}
                  animate={{
                    scale: isActive ? 1.05 : 1,
                    borderColor: isActive
                      ? 'var(--signal)'
                      : isPast
                      ? 'var(--success, #3ecf8e)'
                      : 'var(--border)',
                  }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  {STEPS[stepIdx]?.nodeLabel ?? id}
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className="comp-codegen-output-col">
          <span className="micro">Assembly output:</span>
          <div className="comp-codegen-asm">
            <AnimatePresence>
              {visibleSteps.map((step, i) => (
                <motion.div
                  key={step.nodeId}
                  className="comp-codegen-asm-row"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  <code className="comp-codegen-instr">{step.instruction}</code>
                  <span className="comp-codegen-reg micro">{step.register}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {done && (
            <motion.div
              className="comp-codegen-summary micro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <strong>4 AST nodes → 4 instructions</strong>
            </motion.div>
          )}
        </div>
      </div>

      <div className="comp-codegen-controls">
        <button
          type="button"
          className="btn"
          onClick={stepForward}
          disabled={autoRunning || done}
        >
          Step →
        </button>
        <button
          type="button"
          className="btn"
          onClick={runAll}
          disabled={autoRunning}
        >
          Run all
        </button>
        <button type="button" className="btn" onClick={reset} disabled={autoRunning}>
          Reset
        </button>
      </div>

      <ConnectionCard
        title="The CPU from Layer 1 can only run these instructions"
        body={
          <>
            Everything else — Python, JavaScript, types, objects, closures — is an abstraction the compiler
            creates. By the time your code runs, all of those high-level ideas have been translated into a
            sequence of load, store, add, jump. That is what the fetch-decode-execute loop processes.
          </>
        }
        appearsIn={['Layer 1 CPU fetch-decode-execute', 'CompOptimize step', 'assembly debuggers like gdb']}
        hook="The compiler generated correct code. But it can often generate faster code too. Next: optimization passes."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!done}>
          Continue to optimization
        </button>
        {!done && (
          <span className="hint">Step through or run all to complete code generation.</span>
        )}
      </div>
    </div>
  )
}
