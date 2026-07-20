import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

export function GatesLesson({ onComplete }: { onComplete: () => void }) {
  const [a, setA] = useState(false)
  const [b, setB] = useState(false)
  const out = a && b

  return (
    <div className="lesson-panel">
      <p className="lede">
        This circuit has a simple rule: the light turns on <strong>only when both switches are up</strong>. Think of it
        like a door with two locks — both keys are needed to open it.
      </p>
      <p className="micro">Try it: flip both switches to ON.</p>
      <div className="circuit-board">
        <div className="io-column">
          <label className="switch-pill">
            <span>Switch 1</span>
            <button type="button" className={a ? 'on' : ''} onClick={() => setA(!a)} aria-pressed={a}>
              {a ? 'ON' : 'OFF'}
            </button>
          </label>
          <label className="switch-pill">
            <span>Switch 2</span>
            <button type="button" className={b ? 'on' : ''} onClick={() => setB(!b)} aria-pressed={b}>
              {b ? 'ON' : 'OFF'}
            </button>
          </label>
        </div>
        <svg className="wires" viewBox="0 0 120 80" aria-hidden>
          <path d="M 0 25 H 45" className="wire" />
          <path d="M 0 55 H 45" className="wire" />
          <path d="M 75 40 H 120" className="wire" />
        </svg>
        <div className="gate-chip" data-kind="AND">
          <span className="gate-label">AND</span>
          <motion.div
            className="gate-glow"
            animate={{ opacity: out ? 1 : 0.25 }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <div className="led-column">
          <span className="led-label">Light</span>
          <motion.div
            className="led"
            animate={{
              scale: out ? 1.08 : 1,
              boxShadow: out
                ? '0 0 28px var(--signal), inset 0 0 12px rgba(255,255,255,0.35)'
                : '0 0 0 transparent',
              backgroundColor: out ? 'var(--signal)' : 'var(--surface-3)',
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            aria-label={out ? 'Light is on' : 'Light is off'}
          />
        </div>
      </div>
      {out ? (
        <ConnectionCard
          title="This is how computers make decisions"
          body={
            <>
              Every time your phone checks <em>"Is the password correct AND is the account active?"</em> it uses a rule
              like this. Computers chain thousands of these simple yes/no checks together at incredible speed.
            </>
          }
          appearsIn={['the addition circuit you are about to build', 'every password check', 'all computer decisions']}
          hook="An AND gate checks one condition. But what about doing math? Next you will chain gates together to add numbers."
        />
      ) : null}
      <div className="lesson-actions">
        <button type="button" className="btn primary" disabled={!out} onClick={onComplete}>
          Continue to addition
        </button>
        {!out && <span className="hint">Flip both switches to ON to light up the circuit.</span>}
      </div>
    </div>
  )
}
