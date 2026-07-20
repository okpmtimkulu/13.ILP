import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect, useRef } from 'react'
import { ConnectionCard } from '../ConnectionCard'

// Deterministic fake hash: reproducible per-character sum-based, 64 hex chars
function fakeHash(input: string): string {
  const chars = '0123456789abcdef'
  const seed = input.split('').reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 7) * 31, 0)
  let hash = ''
  for (let i = 0; i < 64; i++) {
    hash += chars[(seed * (i + 1) * 1103515245 + 12345) & 0xf]
  }
  return hash
}

function hammingDiff(a: string, b: string): number {
  let count = 0
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) count++
  }
  return count
}

const COMMON_PASSWORDS = [
  { plain: 'password123', hash: fakeHash('password123') },
  { plain: 'qwerty', hash: fakeHash('qwerty') },
  { plain: 'letmein', hash: fakeHash('letmein') },
]

const SALT = 'x7k2m'
const TARGET_HASH = fakeHash('password123')

export function SecHash({ onComplete }: { onComplete: () => void }) {
  const [input, setInput] = useState('hello')
  const [prevInput, setPrevInput] = useState('hello')
  const [avalancheShown, setAvalancheShown] = useState(false)
  const [saltShown, setSaltShown] = useState(false)
  const [attackShown, setAttackShown] = useState(false)
  const [done, setDone] = useState(false)
  const [animating, setAnimating] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentHash = fakeHash(input)
  const prevHash = fakeHash(prevInput)
  const diff = hammingDiff(currentHash, prevHash)

  useEffect(() => {
    if (animating) {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setAnimating(false), 600)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [animating])

  const handleChange = (val: string) => {
    setPrevInput(input)
    setInput(val)
    setAnimating(true)
    if (val !== input && val.length > 0) {
      setAvalancheShown(true)
    }
  }

  const saltedHash = fakeHash(input + SALT)
  const saltedHash2 = fakeHash(input + 'p9q1n')

  return (
    <div className="lesson-panel">
      <p className="lede">
        A cryptographic hash function maps any input to a fixed-size digest. One bit of change flips roughly half the
        output — the avalanche effect. It is a one-way function: knowing the hash tells you nothing about the input.
      </p>

      <div className="sec-hash-stage">
        <div className="sec-hash-input-row">
          <label className="sec-xor-label">
            Input
            <input
              className="db-query-input"
              value={input}
              onChange={(e) => handleChange(e.target.value)}
            />
          </label>
        </div>

        <div className="sec-hash-output">
          <p className="micro">SHA-256 (simulated):</p>
          <div className="sec-hash-hex">
            {currentHash.split('').map((ch, i) => (
              <motion.span
                key={i}
                className={`sec-hash-char ${animating && prevHash[i] !== currentHash[i] ? 'sec-hash-char--changed' : ''}`}
                animate={{ color: animating && prevHash[i] !== currentHash[i] ? '#f59e0b' : '#94a3b8' }}
                transition={{ duration: 0.3 }}
              >
                {ch}
              </motion.span>
            ))}
          </div>
          {avalancheShown && (
            <p className="micro" style={{ marginTop: '0.35rem' }}>
              {diff} of 64 characters changed — avalanche effect
            </p>
          )}
        </div>

        <div className="sec-hash-section">
          <button
            type="button"
            className="btn primary"
            onClick={() => setAttackShown(true)}
            disabled={attackShown}
          >
            Try offline attack (common passwords)
          </button>

          <AnimatePresence>
            {attackShown && (
              <motion.div
                className="sec-hash-attack"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                <p className="micro">Stored hash: <code>{TARGET_HASH.slice(0, 16)}...</code></p>
                {COMMON_PASSWORDS.map((pw) => (
                  <div key={pw.plain} className={`sec-hash-attempt ${pw.hash === TARGET_HASH ? 'sec-hash-attempt--match' : ''}`}>
                    <span>{pw.plain}</span>
                    <span className="sec-hash-arrow">→</span>
                    <code>{pw.hash.slice(0, 12)}...</code>
                    {pw.hash === TARGET_HASH ? <span className="db-acid-ok"> MATCH</span> : <span className="sec-hash-no"> no match</span>}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="sec-hash-section">
          <button
            type="button"
            className="btn primary"
            onClick={() => setSaltShown(true)}
            disabled={saltShown}
          >
            Show salted hashing
          </button>

          <AnimatePresence>
            {saltShown && (
              <motion.div
                className="sec-hash-salt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                <p className="micro">Same password + different salts → completely different hashes:</p>
                <div className="sec-hash-salt-row">
                  <span>"{input}" + salt "{SALT}"</span>
                  <span className="sec-hash-arrow">→</span>
                  <code>{saltedHash.slice(0, 20)}...</code>
                </div>
                <div className="sec-hash-salt-row">
                  <span>"{input}" + salt "p9q1n"</span>
                  <span className="sec-hash-arrow">→</span>
                  <code>{saltedHash2.slice(0, 20)}...</code>
                </div>
                <p className="micro" style={{ marginTop: '0.35rem' }}>
                  Pre-computed rainbow tables become useless — each user has a unique hash even for the same password.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="lesson-actions">
        {avalancheShown && saltShown && !done && (
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
        {(!avalancheShown || !saltShown) && (
          <span className="hint">
            Change the input to see avalanche, then show salted hashing
          </span>
        )}
      </div>

      {saltShown && (
        <ConnectionCard
          title="SHA-256 powers Git commits, Bitcoin, and password storage"
          body={
            <>
              Every Git commit hash is SHA-256 of the previous commit + your changes. Bitcoin's proof-of-work is finding
              an input whose SHA-256 starts with enough zeros. Your passwords are stored as bcrypt (SHA-256 + salt +
              slow stretching) to resist cracking.
            </>
          }
          appearsIn={['Git commit graph', 'password databases (bcrypt)', 'Bitcoin proof-of-work']}
          hook="Hashes are one-way. What if two parties need to share a secret without ever meeting? That needs public-key cryptography."
        />
      )}
    </div>
  )
}
