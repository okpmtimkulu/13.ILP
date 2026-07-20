import { motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

function PhaseNav({ current, total }: { current: number; total: number }) {
  return (
    <div className="fund-phase-nav" aria-label={`Part ${current + 1} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`fund-phase-dot ${i === current ? 'active' : i < current ? 'done' : ''}`} />
      ))}
    </div>
  )
}

function charToBits(ch: string): boolean[] {
  const code = ch.charCodeAt(0)
  return Array.from({ length: 8 }, (_, i) => Boolean(code & (1 << (7 - i))))
}

const WIRE_Y = 50
const WIRE_X1 = 80
const WIRE_X2 = 320

function WireSvg({
  flyingBit,
  flyingProgress,
  receivedChar,
}: {
  flyingBit: { on: boolean } | null
  flyingProgress: number
  receivedChar: string | null
}) {
  const dotX = WIRE_X1 + (WIRE_X2 - WIRE_X1) * flyingProgress

  return (
    <svg viewBox="0 0 400 100" className="fund-wire-svg" aria-label="Two computers connected by a wire">
      <rect x="5" y="25" width="70" height="50" rx="8" className="fund-wire-device" />
      <text x="40" y="47" textAnchor="middle" className="fund-wire-device-label" fontSize="10">
        Sender
      </text>
      <text x="40" y="62" textAnchor="middle" className="fund-wire-device-sub" fontSize="7">
        (you)
      </text>

      <line x1={WIRE_X1} y1={WIRE_Y} x2={WIRE_X2} y2={WIRE_Y} className="fund-wire-cable" />

      <rect x="325" y="25" width="70" height="50" rx="8" className="fund-wire-device" />
      <text x="360" y="47" textAnchor="middle" className="fund-wire-device-label" fontSize="10">
        Receiver
      </text>
      {receivedChar ? (
        <motion.text
          x="360"
          y="65"
          textAnchor="middle"
          className="fund-wire-received-char"
          fontSize="14"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        >
          {receivedChar}
        </motion.text>
      ) : (
        <text x="360" y="62" textAnchor="middle" className="fund-wire-device-sub" fontSize="7">
          (friend)
        </text>
      )}

      {flyingBit && (
        <motion.circle
          key={`fly-${flyingProgress.toFixed(2)}`}
          cx={dotX}
          cy={WIRE_Y}
          r={flyingBit.on ? 6 : 4}
          className={flyingBit.on ? 'fund-signal-dot on' : 'fund-signal-dot off'}
        />
      )}
    </svg>
  )
}

function BitCell({ on, variant }: { on: boolean; variant: 'waiting' | 'received' | 'flying' }) {
  const cls =
    variant === 'flying'
      ? `fund-bit-cell flying ${on ? 'on' : ''}`
      : variant === 'received'
        ? `fund-bit-cell received ${on ? 'on' : ''}`
        : `fund-bit-cell waiting ${on ? 'on' : ''}`

  return (
    <motion.span
      className={cls}
      initial={variant === 'received' ? { scale: 0.6, opacity: 0 } : undefined}
      animate={variant === 'received' ? { scale: 1, opacity: 1 } : undefined}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
    >
      {on ? '1' : '0'}
    </motion.span>
  )
}

const LETTER_CHOICES = [
  { ch: 'H', label: 'H' },
  { ch: 'i', label: 'i' },
  { ch: '!', label: '!' },
  { ch: 'A', label: 'A' },
]

export function FundamentalsBitsOnWire({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0)

  // --- Phase 0: single pulse ---
  const [pulseSent, setPulseSent] = useState(false)
  const [pulseOn, setPulseOn] = useState(true)
  const [pulseProgress, setPulseProgress] = useState(0)
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const sendPulse = () => {
    setPulseSent(false)
    setPulseProgress(0)
    setTimeout(() => {
      setPulseSent(true)
      setPulseProgress(0)
      let step = 0
      const advance = () => {
        step++
        setPulseProgress(step)
        if (step < 10) {
          pulseTimerRef.current = setTimeout(advance, 80)
        }
      }
      pulseTimerRef.current = setTimeout(advance, 80)
    }, 50)
  }

  useEffect(() => {
    return () => {
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current)
    }
  }, [])

  // --- Phase 1: letter sending ---
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [letterBits, setLetterBits] = useState<boolean[] | null>(null)
  const [tick, setTick] = useState(0)
  const letterTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const received = Math.floor(tick / 2)
  const flyingIdx = tick % 2 === 1 ? Math.floor(tick / 2) : null

  const animRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null)
  const [flyProg, setFlyProg] = useState(0)

  useEffect(() => {
    if (flyingIdx === null) {
      setFlyProg(0)
      return
    }
    setFlyProg(0)
    const start = performance.now()
    const dur = 600
    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      setFlyProg(t)
      if (t < 1) {
        animRef.current = requestAnimationFrame(animate)
      }
    }
    animRef.current = requestAnimationFrame(animate)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [flyingIdx])

  const pickLetter = useCallback((ch: string) => {
    if (letterTimerRef.current) clearInterval(letterTimerRef.current)
    setSelectedLetter(ch)
    setLetterBits(charToBits(ch))
    setTick(0)
    setFlyProg(0)
    letterTimerRef.current = setInterval(() => {
      setTick((prev) => {
        if (prev >= 16) {
          if (letterTimerRef.current) clearInterval(letterTimerRef.current)
          return 16
        }
        return prev + 1
      })
    }, 700)
  }, [])

  useEffect(() => {
    return () => {
      if (letterTimerRef.current) clearInterval(letterTimerRef.current)
    }
  }, [])

  // --- Phase 2: free play ---
  const N = 8
  const [bits, setBits] = useState<boolean[]>(() => [false, true, false, false, true, false, false, false])
  const freeValue = useMemo(() => bits.reduce((acc, b, i) => acc + (b ? 1 << (N - 1 - i) : 0), 0), [bits])
  const freeChar =
    freeValue >= 32 && freeValue <= 126
      ? String.fromCharCode(freeValue)
      : freeValue === 10
        ? '⏎'
        : null

  const flip = (i: number) => {
    setBits((prev) => {
      const next = [...prev]
      next[i] = !next[i]
      return next
    })
  }

  const pulseX = WIRE_X1 + ((WIRE_X2 - WIRE_X1) * Math.min(pulseProgress, 10)) / 10

  return (
    <div className="lesson-panel fundamentals">
      <PhaseNav current={phase} total={3} />

      {phase === 0 && (
        <>
          <p className="lede">
            Your computer stores information as bits (on/off switches). But how does it <strong>send</strong>{' '}
            that information to another computer?
          </p>
          <p className="micro">
            A wire can carry electricity: <strong>ON</strong> or <strong>OFF</strong>. Click the button to
            send a signal through the wire.
          </p>

          <div className="fund-wire-area">
            <svg viewBox="0 0 400 100" className="fund-wire-svg" aria-label="One signal traveling a wire">
              <rect x="5" y="25" width="70" height="50" rx="8" className="fund-wire-device" />
              <text x="40" y="47" textAnchor="middle" className="fund-wire-device-label" fontSize="10">
                You
              </text>

              <line x1={WIRE_X1} y1={WIRE_Y} x2={WIRE_X2} y2={WIRE_Y} className="fund-wire-cable" />

              <rect x="325" y="25" width="70" height="50" rx="8" className="fund-wire-device" />
              <text x="360" y="47" textAnchor="middle" className="fund-wire-device-label" fontSize="10">
                Friend
              </text>

              {pulseSent && (
                <motion.circle
                  cx={WIRE_X1}
                  cy={WIRE_Y}
                  r={pulseOn ? 6 : 4}
                  className={pulseOn ? 'fund-signal-dot on' : 'fund-signal-dot off'}
                  animate={{ cx: pulseX }}
                  transition={{ duration: 0.08, ease: 'linear' }}
                />
              )}

              {pulseSent && pulseProgress >= 10 && (
                <motion.text
                  x="360"
                  y="65"
                  textAnchor="middle"
                  className="fund-wire-received-char"
                  fontSize="10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {pulseOn ? 'ON!' : 'OFF!'}
                </motion.text>
              )}
            </svg>
          </div>

          <div className="fund-pulse-controls">
            <div className="fund-pulse-toggle">
              <button
                type="button"
                className={`fund-pulse-opt ${pulseOn ? 'active' : ''}`}
                onClick={() => setPulseOn(true)}
              >
                ON
              </button>
              <button
                type="button"
                className={`fund-pulse-opt ${!pulseOn ? 'active' : ''}`}
                onClick={() => setPulseOn(false)}
              >
                OFF
              </button>
            </div>
            <button type="button" className="btn primary" onClick={sendPulse}>
              Send signal →
            </button>
          </div>

          <p className="micro">
            You just sent <strong>one bit</strong> of information. But one bit can only say "yes" or "no." To
            send a letter, a number, or anything more complex, you need to send <strong>several bits in a row</strong>.
          </p>

          <div className="lesson-actions">
            <button type="button" className="btn primary" onClick={() => setPhase(1)}>
              Send a letter →
            </button>
          </div>
        </>
      )}

      {phase === 1 && (
        <>
          <p className="lede">
            To send a letter, you send <strong>eight bits in a row</strong> (called a "byte"). People agreed on which
            pattern means which letter. Pick one below and watch each bit travel — one at a time.
          </p>

          <div className="fund-letter-picker">
            {LETTER_CHOICES.map((lc) => (
              <button
                key={lc.ch}
                type="button"
                className={`fund-letter-btn ${selectedLetter === lc.ch ? 'active' : ''}`}
                onClick={() => pickLetter(lc.ch)}
              >
                {lc.label}
              </button>
            ))}
          </div>

          {letterBits && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="fund-wire-area">
                <WireSvg
                  flyingBit={flyingIdx !== null && letterBits[flyingIdx] !== undefined ? { on: letterBits[flyingIdx] } : null}
                  flyingProgress={flyProg}
                  receivedChar={received >= 8 ? selectedLetter : null}
                />
              </div>

              <div className="fund-wire-bits-display">
                <div className="fund-wire-bits-col">
                  <span className="fund-wire-bits-label">Waiting to send</span>
                  <div className="fund-wire-bits-cells">
                    {letterBits.map((b, i) => {
                      if (i < received) return null
                      if (flyingIdx !== null && i === flyingIdx) {
                        return <BitCell key={i} on={b} variant="flying" />
                      }
                      return <BitCell key={i} on={b} variant="waiting" />
                    })}
                    {received >= 8 && <span className="fund-wire-bits-empty">All sent!</span>}
                  </div>
                </div>
                <div className="fund-wire-bits-col">
                  <span className="fund-wire-bits-label">Received</span>
                  <div className="fund-wire-bits-cells">
                    {letterBits.slice(0, received).map((b, i) => (
                      <BitCell key={i} on={b} variant="received" />
                    ))}
                    {received === 0 && <span className="fund-wire-bits-empty">Waiting…</span>}
                  </div>
                </div>
              </div>

              <p className="fund-wire-counter micro" role="status">
                {received < 8
                  ? `${received} of 8 bits received`
                  : ''}
              </p>

              {received >= 8 && (
                <motion.p className="fund-letter-result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  All eight signals arrived → your friend reads: <strong>"{selectedLetter}"</strong>
                </motion.p>
              )}
            </motion.div>
          )}

          <p className="micro" style={{ marginTop: '1rem' }}>
            Every text message, email, and webpage works this way: letters broken into on/off
            signals, sent through wires (or radio waves, or fiber-optic light).
          </p>

          <div className="lesson-actions">
            <button type="button" className="btn primary" onClick={() => setPhase(2)}>
              Let me try it myself →
            </button>
          </div>
        </>
      )}

      {phase === 2 && (
        <>
          <p className="lede">
            Now <strong>set the switches yourself</strong> and see what letter you are encoding. Each switch is one bit —
            eight bits make one letter.
          </p>

          <div className="fund-wire-area">
            <WireSvg flyingBit={null} flyingProgress={0} receivedChar={freeChar} />
          </div>

          <div className="fund-bits-row tight" role="group" aria-label="Eight bits">
            {bits.map((b, i) => (
              <button
                key={i}
                type="button"
                className={`fund-bit sm ${b ? 'on' : ''}`}
                onClick={() => flip(i)}
                aria-pressed={b}
              >
                {b ? 'ON' : 'OFF'}
              </button>
            ))}
          </div>

          <div className="fund-bits-readout single">
            <div className="fund-readout-card">
              <span className="micro">Number this pattern represents</span>
              <span className="fund-mono big">{freeValue}</span>
            </div>
            <div className="fund-readout-card">
              <span className="micro">Letter your friend receives</span>
              <span className="fund-mono accent">{freeChar ?? '(not a printable letter)'}</span>
            </div>
          </div>

          {freeValue === 72 && (
            <p className="fund-easter micro" role="status">
              That is the letter H! Fun fact: if you sent another byte right after (01101001), your friend
              would read "Hi" — the classic first message in programming.
            </p>
          )}

          <p className="micro" style={{ marginTop: '0.5rem' }}>
            This is the foundation of <em>everything</em> digital: on/off signals carrying meaning because
            both sides agree on the code. Next, you will see how simple circuits can make <em>decisions</em>{' '}
            with these signals.
          </p>

          <div className="lesson-actions">
            <button type="button" className="btn primary" onClick={onComplete}>
              Finish fundamentals
            </button>
          </div>
        </>
      )}
    </div>
  )
}
