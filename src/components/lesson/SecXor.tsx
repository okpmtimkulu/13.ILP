import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

function xorStrings(a: string, b: string): number[] {
  const result: number[] = []
  for (let i = 0; i < a.length; i++) {
    result.push(a.charCodeAt(i) ^ b.charCodeAt(i % b.length))
  }
  return result
}

function toBinary(n: number): string {
  return n.toString(2).padStart(8, '0')
}

function toHex(n: number): string {
  return n.toString(16).padStart(2, '0')
}

export function SecXor({ onComplete }: { onComplete: () => void }) {
  const [message, setMessage] = useState('hello')
  const [key, setKey] = useState('world')
  const [encrypted, setEncrypted] = useState(false)
  const [decrypted, setDecrypted] = useState(false)
  const [done, setDone] = useState(false)

  const cipherBytes = xorStrings(message, key)
  const cipherHex = cipherBytes.map(toHex).join(' ')

  const firstMsgChar = message.charCodeAt(0)
  const firstKeyChar = key.charCodeAt(0)
  const firstXor = firstMsgChar ^ firstKeyChar

  const decryptedBytes = xorStrings(
    cipherBytes.map((b) => String.fromCharCode(b)).join(''),
    key
  )
  const decryptedText = decryptedBytes.map((b) => String.fromCharCode(b)).join('')

  return (
    <div className="lesson-panel">
      <p className="lede">
        XOR is the simplest cipher operation. Apply the same key twice and you get back the original — because{' '}
        <code>a XOR b XOR b = a</code>.
      </p>

      <div className="sec-xor-stage">
        <div className="sec-xor-inputs">
          <label className="sec-xor-label">
            Message
            <input
              className="db-query-input"
              value={message}
              maxLength={12}
              onChange={(e) => {
                setMessage(e.target.value)
                setEncrypted(false)
                setDecrypted(false)
              }}
            />
          </label>
          <label className="sec-xor-label">
            Key
            <input
              className="db-query-input"
              value={key}
              maxLength={12}
              onChange={(e) => {
                setKey(e.target.value)
                setEncrypted(false)
                setDecrypted(false)
              }}
            />
          </label>
        </div>

        {message.length > 0 && key.length > 0 && (
          <div className="sec-xor-bit-demo">
            <p className="micro">First character XOR operation:</p>
            <div className="sec-xor-row">
              <span className="sec-xor-char">{message[0]}</span>
              <span className="sec-xor-eq">=</span>
              <span className="sec-xor-ascii">{firstMsgChar}</span>
              <span className="sec-xor-eq">=</span>
              <span className="sec-xor-bits">{toBinary(firstMsgChar)}</span>
            </div>
            <div className="sec-xor-row">
              <span className="sec-xor-char">{key[0]}</span>
              <span className="sec-xor-eq">=</span>
              <span className="sec-xor-ascii">{firstKeyChar}</span>
              <span className="sec-xor-eq">=</span>
              <span className="sec-xor-bits">{toBinary(firstKeyChar)}</span>
            </div>
            <div className="sec-xor-divider" />
            <div className="sec-xor-row">
              <span className="sec-xor-char sec-xor-char--result">XOR</span>
              <span className="sec-xor-eq">=</span>
              <span className="sec-xor-ascii">{firstXor}</span>
              <span className="sec-xor-eq">=</span>
              <span className="sec-xor-bits sec-xor-bits--result">{toBinary(firstXor)}</span>
            </div>
          </div>
        )}

        {encrypted && (
          <motion.div
            className="sec-xor-cipher"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <p className="micro">Ciphertext (hex):</p>
            <code className="sec-xor-hex">{cipherHex}</code>
          </motion.div>
        )}

        {decrypted && (
          <motion.div
            className="sec-xor-result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <p className="micro">Decrypted (same key XOR again):</p>
            <span className="sec-xor-decrypted">{decryptedText}</span>
            {decryptedText === message ? (
              <span className="db-acid-ok"> = original message</span>
            ) : null}
          </motion.div>
        )}

        <div className="sec-xor-otp">
          <p className="micro">
            <strong>One-time pad:</strong> if the key is truly random and as long as the message, XOR is theoretically
            unbreakable — no pattern for an attacker to exploit.
          </p>
        </div>
      </div>

      <div className="lesson-actions">
        {!encrypted && message.length > 0 && key.length > 0 && (
          <button type="button" className="btn primary" onClick={() => setEncrypted(true)}>
            Encrypt
          </button>
        )}
        {encrypted && !decrypted && (
          <button type="button" className="btn primary" onClick={() => setDecrypted(true)}>
            Decrypt (same key)
          </button>
        )}
        {decrypted && !done && (
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
        {!encrypted && <span className="hint">Fill in message and key, then press Encrypt</span>}
      </div>

      {decrypted && (
        <ConnectionCard
          title="XOR is the logic gate from Layer 1 — and the root of all modern ciphers"
          body={
            <>
              AES (the cipher protecting every HTTPS connection) is XOR chained with substitution boxes and permutations,
              repeated 10-14 times. ChaCha20 (used in TLS 1.3) is XOR with additions and rotations. The gate is the same.
            </>
          }
          appearsIn={['AES encryption', 'TLS 1.3 ChaCha20', 'one-time pad cryptography']}
          hook="XOR is reversible with the key. What if you want a function that is irreversible? That is a hash."
        />
      )}
    </div>
  )
}
