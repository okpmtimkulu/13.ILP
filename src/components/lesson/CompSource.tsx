import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

const PYTHON_LINES = [
  { code: 'total = 0', asm: ['xor eax, eax', 'mov [total], eax'] },
  {
    code: 'for i in range(5):',
    asm: ['mov ecx, 0', 'cmp ecx, 5', 'jge .end_loop', 'mov [i], ecx'],
  },
  {
    code: '    total += i',
    asm: ['mov eax, [total]', 'add eax, [i]', 'mov [total], eax', 'inc ecx', 'jmp .loop_top', '.end_loop:'],
  },
]

export function CompSource({ onComplete }: { onComplete: () => void }) {
  const [animating, setAnimating] = useState(false)
  const [done, setDone] = useState(false)
  const [activeLine, setActiveLine] = useState(-1)
  const [visibleAsm, setVisibleAsm] = useState<string[]>([])
  const timerRef = useRef<number | null>(null)

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => () => clearTimer(), [])

  const runAnimation = () => {
    setAnimating(true)
    setActiveLine(-1)
    setVisibleAsm([])

    let delay = 300
    PYTHON_LINES.forEach((line, li) => {
      timerRef.current = window.setTimeout(() => {
        setActiveLine(li)
        line.asm.forEach((instr, ai) => {
          timerRef.current = window.setTimeout(() => {
            setVisibleAsm((prev) => [...prev, instr])
            if (li === PYTHON_LINES.length - 1 && ai === line.asm.length - 1) {
              timerRef.current = window.setTimeout(() => {
                setAnimating(false)
                setDone(true)
              }, 500)
            }
          }, ai * 250)
        })
      }, delay)
      delay += 300 + line.asm.length * 250
    })
  }

  const totalAsm = PYTHON_LINES.reduce((s, l) => s + l.asm.length, 0)

  return (
    <div className="lesson-panel">
      <p className="lede">
        Three lines of Python become{' '}
        <strong>{totalAsm} assembly instructions</strong>. Watch the compiler translate each line, one at a time.
      </p>

      <div className="comp-source-columns">
        <div className="comp-source-python">
          <span className="micro">Python source (3 lines)</span>
          {PYTHON_LINES.map((line, i) => (
            <motion.div
              key={i}
              className={`comp-source-line ${activeLine === i ? 'is-active' : activeLine > i ? 'is-done' : ''}`}
              animate={{
                backgroundColor:
                  activeLine === i
                    ? 'var(--signal-dim, rgba(99,102,241,0.15))'
                    : 'transparent',
              }}
              transition={{ duration: 0.2 }}
            >
              <code>{line.code}</code>
            </motion.div>
          ))}
        </div>

        <div className="comp-source-arrow" aria-hidden>→</div>

        <div className="comp-source-asm">
          <span className="micro">x86-64 assembly</span>
          <div className="comp-source-asm-list">
            <AnimatePresence>
              {visibleAsm.map((instr, i) => (
                <motion.code
                  key={i}
                  className="comp-source-asm-instr"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  {instr}
                </motion.code>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="comp-source-counter">
        <span className="micro">
          {visibleAsm.length > 0
            ? `${visibleAsm.length} instruction${visibleAsm.length !== 1 ? 's' : ''} emitted`
            : `0 of ${totalAsm} instructions`}
        </span>
        {done && (
          <span className="micro">
            {' '}· <strong>3 lines → {totalAsm} instructions</strong>
          </span>
        )}
      </div>

      <ConnectionCard
        title="Compilers don't just translate — they optimize"
        body={
          <>
            Those {totalAsm} instructions are the unoptimized output. Compile with <code>-O2</code> and the
            compiler recognises the loop computes a constant (0+1+2+3+4=10) and replaces the whole thing with a
            single <code>mov</code>. That is constant folding — you will see it in the Optimize step.
          </>
        }
        appearsIn={['CompOptimize step', 'every build pipeline you will ever run']}
        hook="Before any of this can happen, the compiler must break the source into tokens. Next: the lexer."
      />

      <div className="lesson-actions">
        {!animating && !done && (
          <button type="button" className="btn primary" onClick={runAnimation}>
            Animate compilation
          </button>
        )}
        {animating && (
          <button type="button" className="btn primary" disabled>
            Compiling…
          </button>
        )}
        {done && (
          <>
            <button type="button" className="btn primary" onClick={onComplete}>
              Continue to lexer
            </button>
            <button type="button" className="btn" onClick={runAnimation}>
              Replay
            </button>
          </>
        )}
      </div>
    </div>
  )
}
