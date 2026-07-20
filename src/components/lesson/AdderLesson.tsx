import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

function fullAdder(a: boolean, b: boolean, cin: boolean) {
  const axb = a !== b
  const sum = axb !== cin
  const cout = (a && b) || (cin && axb)
  return { sum, cout }
}

export function AdderLesson({ onComplete }: { onComplete: () => void }) {
  const [a, setA] = useState(false)
  const [b, setB] = useState(false)
  const [cin, setCin] = useState(false)
  const { sum, cout } = useMemo(() => fullAdder(a, b, cin), [a, b, cin])

  return (
    <div className="lesson-panel">
      <p className="lede">
        When you add <strong>9 + 3</strong> by hand, you get 12: the <strong>2</strong> stays and the{' '}
        <strong>1</strong> carries to the next column. Computers do the exact same thing, but with binary — just ON and
        OFF. This circuit adds one column at a time.
      </p>
      <div className="adder-grid">
        <div className="adder-toggles">
          {(
            [
              ['First number', a, () => setA(!a)],
              ['Second number', b, () => setB(!b)],
              ['Carry from previous column', cin, () => setCin(!cin)],
            ] as const
          ).map(([label, v, flip]) => (
            <label key={label} className="switch-pill wide">
              <span>{label}</span>
              <button type="button" className={v ? 'on' : ''} onClick={flip} aria-pressed={v}>
                {v ? 'ON' : 'OFF'}
              </button>
            </label>
          ))}
        </div>
        <div className="adder-outputs">
          <motion.div className="bit-out" animate={{ borderColor: sum ? 'var(--signal)' : 'var(--stroke)' }}>
            <span>Result (this column)</span>
            <strong>{sum ? 'ON' : 'OFF'}</strong>
          </motion.div>
          <motion.div className="bit-out" animate={{ borderColor: cout ? 'var(--accent-warm)' : 'var(--stroke)' }}>
            <span>Carry to next column</span>
            <strong>{cout ? 'ON' : 'OFF'}</strong>
          </motion.div>
        </div>
      </div>
      <p className="micro">
        Try this: turn on both numbers (like adding 1+1). You get Result = OFF and Carry = ON. Just like 5+5 in decimal:
        the ones column gets 0, and you carry 1. That is all binary addition is.
      </p>
      <ConnectionCard
        title="This tiny circuit is how every computer does math"
        body={
          <>
            Adding two large numbers? Chain several of these together, each one passing its carry to the next — exactly
            like you do by hand, column by column. Your calculator, your phone, every CPU does math this way.
          </>
        }
        appearsIn={['every calculator', 'graphics rendering', 'AI training (matrix multiply)']}
        hook="Next you will watch a CPU breathe: it reads an instruction, figures out what it means, and runs it. Over and over."
      />
      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete}>
          Continue to the CPU
        </button>
      </div>
    </div>
  )
}
