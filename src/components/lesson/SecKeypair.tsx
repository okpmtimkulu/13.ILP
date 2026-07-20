import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Phase = 'idle' | 'keygen' | 'pubkey-sent' | 'encrypt' | 'transit' | 'decrypt' | 'done'

export function SecKeypair({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [replayed, setReplayed] = useState(false)
  const [completed, setCompleted] = useState(false)

  const advance = () => {
    setPhase((p) => {
      if (p === 'idle') return 'keygen'
      if (p === 'keygen') return 'pubkey-sent'
      if (p === 'pubkey-sent') return 'encrypt'
      if (p === 'encrypt') return 'transit'
      if (p === 'transit') return 'decrypt'
      if (p === 'decrypt') return 'done'
      return p
    })
  }

  const replay = () => {
    setPhase('keygen')
    setReplayed(true)
  }

  const phaseLabels: Record<Phase, string> = {
    idle: 'Start',
    keygen: 'Phase 1: Alice generates a key pair',
    'pubkey-sent': 'Public key travels to Bob',
    encrypt: 'Phase 2: Bob encrypts "Hello Alice"',
    transit: 'Ciphertext in transit — Eve intercepts',
    decrypt: 'Phase 3: Alice decrypts with private key',
    done: 'Complete',
  }

  const btnLabel: Partial<Record<Phase, string>> = {
    idle: 'Generate key pair',
    keygen: 'Send public key to Bob',
    'pubkey-sent': 'Bob writes a message',
    encrypt: 'Encrypt with Alice\'s public key',
    transit: 'Ciphertext reaches Alice',
    decrypt: 'Alice decrypts',
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        Public-key cryptography lets two people exchange secrets without ever meeting. Alice's public key encrypts;
        only her private key can decrypt. Watch the full exchange.
      </p>

      <div className="sec-kp-stage">
        <p className="micro sec-kp-phase-label">{phaseLabels[phase]}</p>

        <div className="sec-kp-actors">
          {/* Alice */}
          <div className="sec-kp-actor sec-kp-actor--alice">
            <div className="sec-kp-actor-name">Alice</div>
            <AnimatePresence>
              {(phase === 'keygen' || phase === 'pubkey-sent' || phase === 'decrypt' || phase === 'done' || (phase === 'transit') || phase === 'encrypt') && (
                <motion.div
                  className="sec-kp-keys"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  <div className="sec-kp-key sec-kp-key--public">
                    <span className="sec-kp-key-icon">🔑</span>
                    <span className="micro">Public key</span>
                  </div>
                  <div className="sec-kp-key sec-kp-key--private">
                    <span className="sec-kp-key-icon">🔒</span>
                    <span className="micro">Private key (secret)</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {phase === 'decrypt' || phase === 'done' ? (
              <motion.div
                className="sec-kp-message sec-kp-message--plain"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                "Hello Alice"
              </motion.div>
            ) : null}
          </div>

          {/* Middle channel */}
          <div className="sec-kp-channel">
            <AnimatePresence>
              {phase === 'pubkey-sent' && (
                <motion.div
                  className="sec-kp-flying sec-kp-flying--pubkey"
                  initial={{ x: -60, opacity: 0 }}
                  animate={{ x: 60, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  🔑 public key
                </motion.div>
              )}
              {(phase === 'transit') && (
                <>
                  <motion.div
                    className="sec-kp-flying sec-kp-flying--cipher"
                    initial={{ x: 60, opacity: 0 }}
                    animate={{ x: -60, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    ▒▒▒▒▒▒▒
                  </motion.div>
                  <motion.div
                    className="sec-kp-eve"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  >
                    <span className="sec-kp-eve-name">Eve</span>
                    <span className="micro">sees: ▒▒▒▒▒▒▒</span>
                    <span className="micro sec-hash-no">cannot decrypt</span>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Bob */}
          <div className="sec-kp-actor sec-kp-actor--bob">
            <div className="sec-kp-actor-name">Bob</div>
            <AnimatePresence>
              {(phase === 'pubkey-sent' || phase === 'encrypt' || phase === 'transit') && (
                <motion.div
                  className="sec-kp-key sec-kp-key--public"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  <span className="sec-kp-key-icon">🔑</span>
                  <span className="micro">Alice's public key</span>
                </motion.div>
              )}
            </AnimatePresence>
            {(phase === 'encrypt' || phase === 'transit') && (
              <motion.div
                className="sec-kp-message sec-kp-message--encrypted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                {phase === 'encrypt' ? '"Hello Alice"' : '▒▒▒▒▒▒▒ (locked)'}
              </motion.div>
            )}
          </div>
        </div>

        {phase === 'done' && (
          <motion.p
            className="sec-kp-insight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            Only Alice's private key unlocks what her public key locked. Eve saw the ciphertext and Alice's public key
            — and could do nothing with either.
          </motion.p>
        )}
      </div>

      <div className="lesson-actions">
        {phase !== 'done' && (
          <button type="button" className="btn primary" onClick={advance}>
            {btnLabel[phase] ?? 'Continue'}
          </button>
        )}
        {phase === 'done' && (
          <>
            {!replayed && (
              <button type="button" className="btn primary" style={{ background: 'var(--surface-3)' }} onClick={replay}>
                Replay
              </button>
            )}
            {!completed && (
              <button
                type="button"
                className="btn primary"
                onClick={() => {
                  setCompleted(true)
                  onComplete()
                }}
              >
                Continue
              </button>
            )}
          </>
        )}
      </div>

      {phase === 'done' && (
        <ConnectionCard
          title="Every HTTPS session, SSH connection, and encrypted email uses this math"
          body={
            <>
              RSA and elliptic-curve cryptography (ECC) implement public-key exchange using mathematical trapdoor
              functions — easy to compute forward, computationally infeasible to reverse without the private key.
              TLS 1.3 uses ECC for key exchange and drops RSA entirely.
            </>
          }
          appearsIn={['HTTPS/TLS', 'SSH authentication', 'Signal encrypted messages']}
          hook="Encryption lets Bob send a secret. Signatures let Alice prove she wrote something. Next: the key roles swap."
        />
      )}
    </div>
  )
}
