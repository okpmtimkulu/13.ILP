import { motion } from 'motion/react'
import { useMemo, useState } from 'react'

function PhaseNav({ current, total }: { current: number; total: number }) {
  return (
    <div className="fund-phase-nav" aria-label={`Part ${current + 1} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`fund-phase-dot ${i === current ? 'active' : i < current ? 'done' : ''}`} />
      ))}
    </div>
  )
}

const COMBO_LABELS = ['Both off', 'Right on', 'Left on', 'Both on']

export function FundamentalsOnOffBits({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0)

  const [sw1, setSw1] = useState(false)

  const [sw2a, setSw2a] = useState(false)
  const [sw2b, setSw2b] = useState(false)
  const combo2 = (sw2a ? 2 : 0) + (sw2b ? 1 : 0)
  const [found, setFound] = useState<Set<number>>(() => new Set([0]))

  const discover = (a: boolean, b: boolean) => {
    const c = (a ? 2 : 0) + (b ? 1 : 0)
    setFound((prev) => {
      if (prev.has(c)) return prev
      const next = new Set(prev)
      next.add(c)
      return next
    })
  }

  const flip2a = () => {
    const next = !sw2a
    setSw2a(next)
    discover(next, sw2b)
  }
  const flip2b = () => {
    const next = !sw2b
    setSw2b(next)
    discover(sw2a, next)
  }

  const [bits, setBits] = useState<boolean[]>(() => [false, false, false, false])
  const value = useMemo(() => bits.reduce((acc, b, i) => acc + (b ? 1 << (3 - i) : 0), 0), [bits])
  const weights = [8, 4, 2, 1]
  const addedParts = bits.map((b, i) => (b ? weights[i] : 0))

  return (
    <div className="lesson-panel fundamentals">
      <PhaseNav current={phase} total={3} />

      {phase === 0 && (
        <>
          <p className="lede">
            Inside every computer, information is stored in the simplest way possible: things that can only be{' '}
            <strong>ON</strong> or <strong>OFF</strong>. Like a light switch.
          </p>
          <p className="micro">Try flipping the switch below.</p>

          <div className="fund-big-switch-row">
            <button
              type="button"
              className={`fund-big-switch ${sw1 ? 'on' : ''}`}
              onClick={() => setSw1(!sw1)}
              aria-pressed={sw1}
            >
              <span className="fund-big-switch-track">
                <motion.span
                  className="fund-big-switch-thumb"
                  animate={{ y: sw1 ? -18 : 18 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                />
              </span>
              <span className="fund-big-switch-label">{sw1 ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          <p className="micro">
            One switch can say exactly <strong>two things</strong>: yes or no, true or false, 1 or 0. But what
            if you need more options — like sending a number or picking from a list?
          </p>

          <div className="lesson-actions">
            <button type="button" className="btn primary" onClick={() => setPhase(1)}>
              I need more options →
            </button>
          </div>
        </>
      )}

      {phase === 1 && (
        <>
          <p className="lede">
            Add a <strong>second switch</strong>. Now try every combination — how many different states can you make?
          </p>

          <div className="fund-two-switch-row">
            <button
              type="button"
              className={`fund-big-switch ${sw2a ? 'on' : ''}`}
              onClick={flip2a}
              aria-pressed={sw2a}
              aria-label="Left switch"
            >
              <span className="fund-big-switch-track">
                <motion.span
                  className="fund-big-switch-thumb"
                  animate={{ y: sw2a ? -18 : 18 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                />
              </span>
              <span className="fund-big-switch-label">{sw2a ? 'ON' : 'OFF'}</span>
            </button>
            <button
              type="button"
              className={`fund-big-switch ${sw2b ? 'on' : ''}`}
              onClick={flip2b}
              aria-pressed={sw2b}
              aria-label="Right switch"
            >
              <span className="fund-big-switch-track">
                <motion.span
                  className="fund-big-switch-thumb"
                  animate={{ y: sw2b ? -18 : 18 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                />
              </span>
              <span className="fund-big-switch-label">{sw2b ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          <div className="fund-combo-grid">
            {[0, 1, 2, 3].map((c) => (
              <div key={c} className={`fund-combo-cell ${c === combo2 ? 'current' : ''} ${found.has(c) ? 'found' : ''}`}>
                <span className="fund-combo-switches">
                  {c >= 2 ? 'ON' : 'OFF'} {c % 2 === 1 ? 'ON' : 'OFF'}
                </span>
                <span className="fund-combo-label">{COMBO_LABELS[c]}</span>
                {found.has(c) ? <span className="fund-combo-check">✓</span> : null}
              </div>
            ))}
          </div>

          <p className="micro" role="status">
            {found.size < 4
              ? `You have found ${found.size} of 4 combinations. Keep flipping!`
              : 'You found all four! Two switches = four possible states. Each new switch doubles your options.'}
          </p>

          {found.size >= 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="fund-doubling-row">
                {[
                  { n: 1, combos: 2 },
                  { n: 2, combos: 4 },
                  { n: 3, combos: 8 },
                  { n: 4, combos: 16 },
                ].map((d) => (
                  <div key={d.n} className="fund-doubling-cell">
                    <span className="fund-doubling-n">{d.n} switch{d.n > 1 ? 'es' : ''}</span>
                    <span className="fund-doubling-v">{d.combos} options</span>
                  </div>
                ))}
              </div>
              <div className="lesson-actions">
                <button type="button" className="btn primary" onClick={() => setPhase(2)}>
                  Now let me count with them →
                </button>
              </div>
            </motion.div>
          )}
        </>
      )}

      {phase === 2 && (
        <>
          <p className="lede">
            Computers use this exact trick. Each switch is called a <strong>"bit."</strong> Flip the four bits below. The{' '}
            <strong>number above each one</strong> tells you what it is worth when it is ON.
          </p>

          <div className="fund-weighted-bits">
            <div className="fund-weight-row">
              {weights.map((w, i) => (
                <span key={i} className="fund-weight-label">
                  {w}
                </span>
              ))}
            </div>
            <div className="fund-bits-row">
              {bits.map((b, i) => (
                <button
                  key={i}
                  type="button"
                  className={`fund-bit ${b ? 'on' : ''}`}
                  onClick={() =>
                    setBits((prev) => {
                      const next = [...prev]
                      next[i] = !next[i]
                      return next
                    })
                  }
                  aria-pressed={b}
                  aria-label={`${weights[i]}s place, ${b ? 'on' : 'off'}`}
                >
                  {b ? 'ON' : 'OFF'}
                </button>
              ))}
            </div>
          </div>

          <motion.div className="fund-readout-card" key={value} initial={{ scale: 0.98 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 24 }}>
            <span className="micro">Add up every ON position:</span>
            <span className="fund-mono big">
              {addedParts.filter(Boolean).length > 0
                ? `${addedParts.filter(Boolean).join(' + ')} = ${value}`
                : '0'}
            </span>
          </motion.div>

          <p className="micro">
            With 4 bits you can count from 0 to 15. Your phone uses 64 bits at once — enough for over 18{' '}
            <em>quintillion</em> different values. Same idea, more switches.
          </p>

          <div className="lesson-actions">
            <button type="button" className="btn primary" onClick={onComplete}>
              Continue
            </button>
          </div>
        </>
      )}
    </div>
  )
}
