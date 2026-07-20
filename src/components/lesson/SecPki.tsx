import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Phase = 'idle' | 'verify-domain' | 'verify-le' | 'verify-inter' | 'verify-root' | 'trusted' | 'revoked'

const CHAIN = [
  { id: 'root', label: 'Root CA', sub: 'Pre-installed in your browser', color: '#f59e0b', depth: 0 },
  { id: 'inter', label: 'Intermediate CA', sub: 'Signed by Root CA', color: '#6366f1', depth: 1 },
  { id: 'le', label: "Let's Encrypt", sub: 'Signed by Intermediate', color: '#10b981', depth: 2 },
  { id: 'domain', label: 'example.com cert', sub: "Signed by Let's Encrypt", color: '#38bdf8', depth: 3 },
]

export function SecPki({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [revoked, setRevoked] = useState(false)
  const [done, setDone] = useState(false)

  const verifyOrder: Phase[] = ['verify-domain', 'verify-le', 'verify-inter', 'verify-root', 'trusted']

  const advance = () => {
    setPhase((p) => {
      const idx = verifyOrder.indexOf(p)
      if (idx === -1) return verifyOrder[0]
      if (idx < verifyOrder.length - 1) return verifyOrder[idx + 1]
      return p
    })
  }

  const phaseLabel: Record<Phase, string> = {
    idle: 'Browser receives example.com certificate',
    'verify-domain': "Checking example.com cert signature against Let's Encrypt public key...",
    'verify-le': "Checking Let's Encrypt cert signature against Intermediate CA public key...",
    'verify-inter': 'Checking Intermediate CA cert signature against Root CA public key...',
    'verify-root': 'Root CA found in browser trust store (pre-installed)',
    trusted: 'Chain verified. Connection is trusted.',
    revoked: 'Intermediate CA revoked. All certs below are untrusted.',
  }

  const verifiedDepths: Record<Phase, number> = {
    idle: -1,
    'verify-domain': 3,
    'verify-le': 2,
    'verify-inter': 1,
    'verify-root': 0,
    trusted: 0,
    revoked: -1,
  }

  const currentDepth = verifiedDepths[phase]
  const isRevoked = phase === 'revoked'

  return (
    <div className="lesson-panel">
      <p className="lede">
        A certificate chain links your domain cert back to a trusted Root CA through intermediates. The browser verifies
        each signature in the chain — bottom to top.
      </p>

      <div className="sec-pki-stage">
        <div className="sec-pki-chain">
          {CHAIN.map((cert, i) => {
            const isVerifying = currentDepth === cert.depth && !isRevoked && phase !== 'trusted'
            const isVerified = currentDepth <= cert.depth && phase === 'trusted'
            const isRevokedNode = isRevoked && cert.depth >= 1
            return (
              <motion.div
                key={cert.id}
                className={`sec-pki-cert ${isVerifying ? 'sec-pki-cert--verifying' : ''} ${isVerified ? 'sec-pki-cert--verified' : ''} ${isRevokedNode ? 'sec-pki-cert--revoked' : ''}`}
                style={{ borderColor: isRevokedNode ? '#ef4444' : cert.color }}
                animate={{
                  opacity: isRevokedNode ? 0.5 : 1,
                  scale: isVerifying ? 1.04 : 1,
                }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                <span className="sec-pki-cert-label" style={{ color: cert.color }}>{cert.label}</span>
                <span className="micro">{cert.sub}</span>
                {isVerified && <span className="db-acid-ok sec-pki-check"> ✓</span>}
                {isRevokedNode && <span className="sec-sig-result--invalid"> REVOKED</span>}
              </motion.div>
            )
          })}
        </div>

        <div className="sec-pki-arrow-col">
          {CHAIN.slice(0, -1).map((_, i) => (
            <div key={i} className="sec-pki-arrow">↑ signs</div>
          ))}
        </div>

        <div className="sec-pki-status">
          <p className="micro">{phaseLabel[phase]}</p>
          {phase === 'trusted' && (
            <motion.div
              className="sec-pki-trusted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              Browser shows lock icon. Connection is HTTPS.
            </motion.div>
          )}
          {isRevoked && (
            <motion.div
              className="sec-pki-not-secure"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              ⚠ NOT SECURE — example.com cert is now untrusted because its signing CA was revoked.
            </motion.div>
          )}
        </div>
      </div>

      <div className="lesson-actions">
        {phase !== 'trusted' && phase !== 'revoked' && (
          <button type="button" className="btn primary" onClick={advance}>
            {phase === 'idle' ? 'Begin verification' : 'Next step'}
          </button>
        )}
        {phase === 'trusted' && !revoked && (
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setRevoked(true)
              setPhase('revoked')
            }}
          >
            Revoke Intermediate CA
          </button>
        )}
        {phase === 'revoked' && !done && (
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
        {phase === 'idle' && <span className="hint">Click to start verifying the certificate chain</span>}
      </div>

      {(phase === 'trusted' || phase === 'revoked') && (
        <ConnectionCard
          title="Your browser ships with ~100 trusted root CAs pre-installed"
          body={
            <>
              If any root CA is compromised, every certificate it has ever signed becomes untrustworthy. This has
              happened: DigiNotar in 2011 was compromised, forged certificates for Google, and was immediately removed
              from all browser trust stores — destroying the company.
            </>
          }
          appearsIn={['HTTPS certificate validation', 'TLS handshake', 'browser trust store']}
          hook="Certificates establish identity. Next: how do websites verify who you are — and what you are allowed to do?"
        />
      )}
    </div>
  )
}
