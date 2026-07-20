import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

function fakeSign(msg: string, key: string): string {
  // Deterministic fake signature
  const seed = (msg + key).split('').reduce((a, c, i) => a + c.charCodeAt(0) * (i + 3), 0)
  let sig = ''
  const chars = '0123456789abcdef'
  for (let i = 0; i < 32; i++) {
    sig += chars[(seed * (i + 2) * 6364136223846793) & 0xf]
  }
  return sig
}

function verify(msg: string, sig: string, originalMsg: string, originalSig: string): boolean {
  return msg === originalMsg && sig === originalSig
}

export function SecSignature({ onComplete }: { onComplete: () => void }) {
  const [message, setMessage] = useState('Payment: $100 to Bob')
  const [privateKey] = useState('alice-private-key-x7k2')
  const [signature, setSignature] = useState<string | null>(null)
  const [originalMsg, setOriginalMsg] = useState<string | null>(null)
  const [tamperedMsg, setTamperedMsg] = useState<string | null>(null)
  const [tamperedSig, setTamperedSig] = useState<string | null>(null)
  const [verifyResult, setVerifyResult] = useState<'valid' | 'invalid' | null>(null)
  const [tamperedSigResult, setTamperedSigResult] = useState<'valid' | 'invalid' | null>(null)
  const [done, setDone] = useState(false)

  const currentSig = signature ?? ''

  const handleSign = () => {
    const sig = fakeSign(message, privateKey)
    setSignature(sig)
    setOriginalMsg(message)
    setTamperedMsg(null)
    setTamperedSig(null)
    setVerifyResult(null)
    setTamperedSigResult(null)
  }

  const handleVerify = () => {
    if (!signature || !originalMsg) return
    const isValid = verify(message, signature, originalMsg, signature)
    setVerifyResult(isValid ? 'valid' : 'invalid')
  }

  const handleTamperMessage = () => {
    setTamperedMsg('Payment: $1000 to Bob')
    setVerifyResult(null)
  }

  const handleVerifyTampered = () => {
    if (!originalMsg || !signature) return
    const msgToCheck = tamperedMsg ?? message
    const isValid = verify(msgToCheck, signature, originalMsg, signature)
    setVerifyResult(isValid ? 'valid' : 'invalid')
  }

  const handleTamperSig = () => {
    if (!signature) return
    const bad = signature.slice(0, -4) + 'dead'
    setTamperedSig(bad)
  }

  const handleVerifyTamperedSig = () => {
    if (!originalMsg) return
    setTamperedSigResult('invalid')
  }

  const seenValidAndInvalid = verifyResult === 'invalid' || (verifyResult === 'valid' && tamperedSig !== null)
  const readyToContinue = verifyResult === 'invalid' && (tamperedSigResult === 'invalid' || tamperedSig !== null)

  return (
    <div className="lesson-panel">
      <p className="lede">
        A digital signature is the key roles from public-key cryptography reversed: Alice signs with her{' '}
        <strong>private</strong> key; anyone can verify with her <strong>public</strong> key.
      </p>

      <div className="sec-sig-stage">
        <div className="sec-sig-message">
          <label className="sec-xor-label">
            Message
            <input
              className="db-query-input"
              value={tamperedMsg ?? message}
              onChange={(e) => {
                if (tamperedMsg !== null) setTamperedMsg(e.target.value)
                else setMessage(e.target.value)
              }}
            />
          </label>
        </div>

        <div className="sec-sig-panels">
          <div className="sec-sig-panel">
            <h4>Sign (Alice)</h4>
            <p className="micro">Private key: <code>{privateKey}</code></p>
            <button type="button" className="btn primary" onClick={handleSign} disabled={!message}>
              Sign message
            </button>
            {signature && (
              <motion.div
                className="sec-sig-output"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                <p className="micro">Signature:</p>
                <code className="sec-hash-hex" style={{ fontSize: '0.75rem' }}>
                  {tamperedSig ?? currentSig}
                </code>
              </motion.div>
            )}
          </div>

          <div className="sec-sig-panel">
            <h4>Verify (Bob)</h4>
            <p className="micro">Using Alice's public key</p>
            {signature && (
              <>
                <button
                  type="button"
                  className="btn primary"
                  onClick={tamperedMsg !== null ? handleVerifyTampered : handleVerify}
                  disabled={verifyResult !== null && tamperedMsg === null}
                >
                  Verify
                </button>
                <AnimatePresence>
                  {verifyResult && (
                    <motion.div
                      key={verifyResult}
                      className={`sec-sig-result ${verifyResult === 'valid' ? 'sec-sig-result--valid' : 'sec-sig-result--invalid'}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                    >
                      {verifyResult === 'valid' ? '✓ VALID' : '✗ INVALID'}
                    </motion.div>
                  )}
                </AnimatePresence>
                {tamperedSig && (
                  <>
                    <button
                      type="button"
                      className="btn primary"
                      onClick={handleVerifyTamperedSig}
                      disabled={tamperedSigResult !== null}
                      style={{ marginTop: '0.5rem' }}
                    >
                      Verify (tampered sig)
                    </button>
                    {tamperedSigResult && (
                      <motion.div
                        className="sec-sig-result sec-sig-result--invalid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                      >
                        ✗ INVALID
                      </motion.div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {verifyResult === 'valid' && !tamperedMsg && (
          <div className="sec-sig-actions-row">
            <button type="button" className="btn primary" onClick={handleTamperMessage}>
              Tamper with message ($100 → $1000)
            </button>
          </div>
        )}

        {verifyResult === 'invalid' && !tamperedSig && (
          <div className="sec-sig-actions-row">
            <button type="button" className="btn primary" onClick={handleTamperSig}>
              Also tamper with signature
            </button>
          </div>
        )}
      </div>

      <div className="lesson-actions">
        {readyToContinue && !done && (
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
        {!signature && <span className="hint">Sign the message first</span>}
        {signature && !verifyResult && <span className="hint">Verify the signature</span>}
        {verifyResult === 'valid' && !seenValidAndInvalid && (
          <span className="hint">Try tampering with the message</span>
        )}
      </div>

      {verifyResult === 'invalid' && (
        <ConnectionCard
          title="Git commits, HTTPS certificates, and cryptocurrency wallets all use digital signatures"
          body={
            <>
              Every Git commit is signed with the author's key — the commit log is a chain of signatures. HTTPS
              certificates are signatures from a Certificate Authority. Bitcoin transactions are signed to prove you own
              the private key for the sending address.
            </>
          }
          appearsIn={['Git signed commits', 'TLS certificates', 'Bitcoin transactions']}
          hook="Individual certificates are verified by signing. But who signed the signer? That is the PKI chain."
        />
      )}
    </div>
  )
}
