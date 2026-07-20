import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

function mod(a: number, m: number): number {
  return ((a % m) + m) % m
}

export function MathModular({ onComplete }: { onComplete: () => void }) {
  const [aVal, setAVal] = useState(9)
  const [bVal, setBVal] = useState(6)
  const [modM, setModM] = useState(12)
  const [addDone, setAddDone] = useState(false)

  // Inverse puzzle: find x such that 3 * x ≡ 1 (mod 7)
  const [invGuess, setInvGuess] = useState(1)
  const [invFound, setInvFound] = useState(false)
  const correctInverse = 5 // 3 * 5 = 15 ≡ 1 (mod 7)

  const addResult = mod(aVal + bVal, modM)
  const clockAngle = (addResult / modM) * 360

  const checkInverse = () => {
    if (mod(3 * invGuess, 7) === 1) {
      setInvFound(true)
    }
  }

  const isDone = addDone && invFound

  // Clock face tick positions
  const ticks = Array.from({ length: modM }, (_, i) => i)

  return (
    <div className="lesson-panel">
      <p className="lede">
        <strong>Modular arithmetic</strong> is arithmetic on a circle — when you reach the modulus, you wrap back to
        zero. It is how clocks work, and it is the math inside every cryptographic system.
      </p>

      <div className="math-mod-clock-section">
        <div className="math-mod-controls">
          <label className="math-mod-label">
            <span className="micro">a = {aVal}</span>
            <input type="range" min={0} max={modM - 1} value={aVal}
              onChange={(e) => setAVal(Number(e.target.value))} className="math-mod-slider" />
          </label>
          <label className="math-mod-label">
            <span className="micro">b = {bVal}</span>
            <input type="range" min={0} max={modM - 1} value={bVal}
              onChange={(e) => setBVal(Number(e.target.value))} className="math-mod-slider" />
          </label>
          <label className="math-mod-label">
            <span className="micro">mod = {modM}</span>
            <input type="range" min={5} max={13} value={modM}
              onChange={(e) => { setModM(Number(e.target.value)); setAVal(0); setBVal(0) }}
              className="math-mod-slider" />
          </label>
        </div>

        <div className="math-mod-clock" aria-label={`Clock face mod ${modM}`}>
          <svg viewBox="-55 -55 110 110" className="math-mod-svg">
            <circle cx="0" cy="0" r="50" className="math-mod-circle" />
            {ticks.map((i) => {
              const angle = (i / modM) * 2 * Math.PI - Math.PI / 2
              const x = 42 * Math.cos(angle)
              const y = 42 * Math.sin(angle)
              const lx = 48 * Math.cos(angle)
              const ly = 48 * Math.sin(angle)
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r="2.5"
                    className={i === addResult ? 'math-mod-tick-active' : 'math-mod-tick'}
                  />
                  {modM <= 13 && (
                    <text
                      x={lx * 1.08}
                      y={ly * 1.08}
                      className="math-mod-tick-label"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {i}
                    </text>
                  )}
                </g>
              )
            })}
            <motion.line
              x1="0"
              y1="0"
              x2={0}
              y2={0}
              className="math-mod-hand"
              animate={{
                x2: 36 * Math.cos((clockAngle * Math.PI) / 180 - Math.PI / 2),
                y2: 36 * Math.sin((clockAngle * Math.PI) / 180 - Math.PI / 2),
              }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </svg>
        </div>

        <div className="math-mod-result">
          <code className="math-mod-eq">
            ({aVal} + {bVal}) mod {modM} = <strong>{addResult}</strong>
          </code>
        </div>

        <button
          type="button"
          className="btn primary"
          onClick={() => setAddDone(true)}
          disabled={addDone}
        >
          {addDone ? 'Clock math noted ✓' : 'I see how the clock wraps'}
        </button>
      </div>

      <div className="math-mod-mult-section">
        <h3 className="micro">Multiplication mod 7: find the inverse of 3</h3>
        <p className="micro">
          3 × 5 mod 7 = 15 mod 7 = 1. We say 5 is the <strong>multiplicative inverse</strong> of 3 mod 7
          (written 3⁻¹ ≡ 5 mod 7).
        </p>
        <p className="micro">
          Try different values: find x such that 3 × x ≡ 1 (mod 7).
        </p>
        <div className="math-mod-inverse-row">
          <label className="math-mod-label">
            <span className="micro">x = {invGuess}</span>
            <input type="range" min={1} max={6} value={invGuess}
              onChange={(e) => setInvGuess(Number(e.target.value))}
              className="math-mod-slider" disabled={invFound} />
          </label>
          <code className="math-mod-eq">
            3 × {invGuess} mod 7 = {mod(3 * invGuess, 7)}
            {mod(3 * invGuess, 7) === 1 && ' ✓ found!'}
          </code>
        </div>
        <button
          type="button"
          className="btn primary"
          onClick={checkInverse}
          disabled={invFound || mod(3 * invGuess, 7) !== 1}
        >
          {invFound ? `Inverse found: ${correctInverse} ✓` : 'Check this value'}
        </button>

        <div className="math-mod-rsa-callout">
          <span className="micro">RSA encryption in one line:</span>
          <code className="math-mod-eq">(m^e)^d ≡ m (mod n)</code>
          <span className="micro">
            You just did the mod part. The exponent is repeated multiplication — same wrapping arithmetic.
          </span>
        </div>
      </div>

      <ConnectionCard
        title="Every cryptographic system in the security chapter runs on this arithmetic"
        body={
          <>
            RSA, AES, Diffie-Hellman key exchange, and elliptic curve cryptography all perform arithmetic modulo
            a large prime number. The wrap-around property makes operations easy to compute forward but hard to
            reverse — that asymmetry is the foundation of public-key cryptography.
          </>
        }
        appearsIn={['security chapter RSA key pairs', 'Layer 11 TLS key exchange', 'elliptic curve digital signatures']}
        hook="You have the tools for deterministic reasoning. Next: probabilistic reasoning — when outcomes are uncertain."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!isDone}>
          Continue to probability
        </button>
        {!isDone && (
          <span className="hint">
            {!addDone ? 'Confirm clock addition first.' : 'Find the multiplicative inverse of 3 mod 7.'}
          </span>
        )}
      </div>
    </div>
  )
}
