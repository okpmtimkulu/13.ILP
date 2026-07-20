import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

interface TLSMessage {
  id: string
  dir: 'c2s' | 's2c' | 'both'
  label: string
  detail: string
  encrypted?: boolean
}

const MESSAGES: TLSMessage[] = [
  {
    id: 'client-hello',
    dir: 'c2s',
    label: 'ClientHello',
    detail: 'TLS 1.3 + cipher suites: AES-256-GCM, ChaCha20',
  },
  {
    id: 'server-hello',
    dir: 's2c',
    label: 'ServerHello + Certificate',
    detail: 'Chosen cipher: AES-256-GCM | Cert: example.com → DigiCert → ISRG Root X1',
  },
  {
    id: 'key-exchange',
    dir: 'both',
    label: 'Key Exchange',
    detail: 'client_random + server_random + premaster_secret → session key (HKDF)',
  },
  {
    id: 'finished',
    dir: 'both',
    label: 'Finished (encrypted)',
    detail: 'Handshake authenticated. Connection secured.',
    encrypted: true,
  },
]

type Phase = 'idle' | 'running' | 'done'

export function WebTLS({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [visibleCount, setVisibleCount] = useState(0)
  const [handshakeDone, setHandshakeDone] = useState(false)
  const timerRef = useRef<number | null>(null)

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => () => clearTimer(), [])

  const runHandshake = () => {
    setPhase('running')
    setVisibleCount(0)
    setHandshakeDone(false)

    const step = (i: number) => {
      setVisibleCount(i + 1)
      if (i < MESSAGES.length - 1) {
        timerRef.current = window.setTimeout(() => step(i + 1), 900)
      } else {
        timerRef.current = window.setTimeout(() => {
          setPhase('done')
          setHandshakeDone(true)
        }, 700)
      }
    }
    timerRef.current = window.setTimeout(() => step(0), 300)
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        Before your browser sends a single byte of real data, it runs a <strong>TLS handshake</strong> — a
        cryptographic negotiation that establishes a shared secret key. Watch the four messages flow.
      </p>

      <div className="web-tls-columns">
        <div className="web-tls-side web-tls-client">
          <div className="web-tls-side-label">Client (browser)</div>
          <div className="web-tls-side-icon">🖥</div>
        </div>

        <div className="web-tls-messages" aria-live="polite">
          {MESSAGES.slice(0, visibleCount).map((m, i) => (
            <motion.div
              key={m.id}
              className={`web-tls-msg web-tls-msg--${m.dir} ${m.encrypted ? 'is-encrypted' : ''}`}
              initial={{ opacity: 0, x: m.dir === 'c2s' ? -20 : m.dir === 's2c' ? 20 : 0, y: -8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <div className="web-tls-msg-label">
                {m.encrypted && <span className="web-tls-lock" aria-label="encrypted">🔒</span>}
                <strong>{m.label}</strong>
              </div>
              <div className="web-tls-msg-detail micro">{m.detail}</div>
            </motion.div>
          ))}

          {handshakeDone && (
            <motion.div
              className="web-tls-secure-banner"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              🔒 Connection secured — all future data is encrypted
            </motion.div>
          )}
        </div>

        <div className="web-tls-side web-tls-server">
          <div className="web-tls-side-label">Server</div>
          <div className="web-tls-side-icon">🗄</div>
        </div>
      </div>

      <div className="web-tls-comparison">
        <div className="web-tls-before">
          <span className="micro">Before TLS (plaintext):</span>
          <code className="web-tls-plaintext">POST /login HTTP/1.1{'\n'}password=hunter2</code>
        </div>
        <div className="web-tls-after">
          <span className="micro">After TLS (ciphertext):</span>
          <code className="web-tls-cipher">Ë3¿Ñ©‹₴Ø⟠╬∮§¶₿✗≠∞≡Ω∑π</code>
        </div>
      </div>

      <div className="web-tls-cert-chain">
        <span className="micro">Certificate chain:</span>
        <div className="web-tls-chain-row">
          <span className="web-tls-cert-node">example.com</span>
          <span className="web-tls-chain-arrow">→</span>
          <span className="web-tls-cert-node">DigiCert Intermediate CA</span>
          <span className="web-tls-chain-arrow">→</span>
          <span className="web-tls-cert-node web-tls-cert-root">ISRG Root X1 (trusted)</span>
        </div>
      </div>

      <ConnectionCard
        title="The padlock in your browser means all of this just happened"
        body={
          <>
            In about 50 milliseconds, the client and server negotiated a cipher suite, verified the server's
            identity via a certificate chain, and derived a shared session key. Neither side ever transmitted
            the key — they each computed it from public values using elliptic curve math.
          </>
        }
        appearsIn={['HTTPS everywhere', 'the certificate chain in security (Layer 11)', 'modular arithmetic in Math chapter']}
        hook="With the connection secured, data flows — and the browser needs to render it. Next: the render pipeline."
      />

      <div className="lesson-actions">
        {phase !== 'done' && (
          <button
            type="button"
            className="btn primary"
            onClick={runHandshake}
            disabled={phase === 'running'}
          >
            {phase === 'idle' ? 'Run handshake' : 'Running…'}
          </button>
        )}
        {phase === 'done' && (
          <>
            <button type="button" className="btn primary" onClick={onComplete}>
              Continue to browser rendering
            </button>
            <button type="button" className="btn" onClick={runHandshake}>
              Run handshake again
            </button>
          </>
        )}
        {phase === 'idle' && (
          <span className="hint">Watch each TLS message animate between client and server.</span>
        )}
      </div>
    </div>
  )
}
