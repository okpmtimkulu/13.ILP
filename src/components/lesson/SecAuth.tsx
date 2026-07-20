import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type OAuthStep = 0 | 1 | 2 | 3 | 4 | 5

const OAUTH_STEPS = [
  { label: 'App', desc: 'User clicks "Login with Google"', active: 'app' },
  { label: 'Redirect', desc: 'Browser redirects to accounts.google.com', active: 'google' },
  { label: 'Consent', desc: 'User approves: "Allow App to read your profile"', active: 'google' },
  { label: 'Auth Code', desc: 'Google sends auth code → back to App', active: 'channel' },
  { label: 'Token Exchange', desc: 'App exchanges auth code for access token (server-side)', active: 'app' },
  { label: 'API Call', desc: 'App calls Google API with access token — gets user data', active: 'api' },
]

function decodeJwtPayload(payload: string): string {
  try {
    return JSON.stringify(JSON.parse(atob(payload + '==')), null, 2)
  } catch {
    return payload
  }
}

const NORMAL_PAYLOAD = btoa(JSON.stringify({ user_id: 42, role: 'user', exp: 1893456000 })).replace(/=/g, '')
const TAMPERED_PAYLOAD = btoa(JSON.stringify({ user_id: 42, role: 'admin', exp: 1893456000 })).replace(/=/g, '')

export function SecAuth({ onComplete }: { onComplete: () => void }) {
  const [username, setUsername] = useState('alice@example.com')
  const [password, setPassword] = useState('hunter2')
  const [loggedIn, setLoggedIn] = useState(false)
  const [jwtDecoded, setJwtDecoded] = useState(false)
  const [jwtPayload, setJwtPayload] = useState(NORMAL_PAYLOAD)
  const [tampered, setTampered] = useState(false)
  const [tamperedResult, setTamperedResult] = useState<'accepted' | 'rejected' | null>(null)
  const [oauthStep, setOauthStep] = useState<OAuthStep>(0)
  const [oauthStarted, setOauthStarted] = useState(false)
  const [done, setDone] = useState(false)

  const jwtHeader = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
  const jwtSig = 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  const fullJwt = `${jwtHeader}.${jwtPayload}.${jwtSig}`

  const displayPayload = decodeJwtPayload(jwtPayload)

  const handleLogin = () => {
    if (username && password) setLoggedIn(true)
  }

  const handleTamper = () => {
    setJwtPayload(TAMPERED_PAYLOAD)
    setTampered(true)
    setTamperedResult(null)
  }

  const handleVerifyTampered = () => {
    // Signature doesn't match tampered payload → rejected
    setTamperedResult('rejected')
  }

  const advanceOAuth = () => {
    setOauthStep((s) => (s < 5 ? ((s + 1) as OAuthStep) : s))
  }

  const jwtAndOauthSeen = tamperedResult === 'rejected' && oauthStep === 5

  return (
    <div className="lesson-panel">
      <p className="lede">
        <strong>AuthN</strong> (authentication) asks "who are you?" — JWT tokens answer it.{' '}
        <strong>AuthZ</strong> (authorization) asks "what can you do?" — OAuth answers it.
        These are different problems solved by different protocols.
      </p>

      <div className="sec-auth-split">
        {/* Left: JWT */}
        <div className="sec-auth-half">
          <h4>Authentication — JWT</h4>

          {!loggedIn ? (
            <div className="sec-auth-login">
              <input
                className="db-query-input"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="db-query-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="btn primary" onClick={handleLogin}>
                Login
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <p className="micro">bcrypt verified. JWT issued:</p>
              <div className="sec-auth-jwt">
                <span className="sec-auth-jwt-part sec-auth-jwt--header">{jwtHeader.slice(0, 10)}…</span>
                <span>.</span>
                <span className="sec-auth-jwt-part sec-auth-jwt--payload">{jwtPayload.slice(0, 10)}…</span>
                <span>.</span>
                <span className="sec-auth-jwt-part sec-auth-jwt--sig">{jwtSig.slice(0, 10)}…</span>
              </div>
              <button
                type="button"
                className="btn primary"
                style={{ marginTop: '0.5rem' }}
                onClick={() => setJwtDecoded(true)}
                disabled={jwtDecoded}
              >
                Decode payload (Base64)
              </button>

              {jwtDecoded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  <pre className="sec-auth-decoded">{displayPayload}</pre>
                  {!tampered ? (
                    <button type="button" className="btn primary" onClick={handleTamper} style={{ marginTop: '0.5rem' }}>
                      Change role to "admin"
                    </button>
                  ) : (
                    <>
                      <pre className="sec-auth-decoded sec-auth-decoded--tampered">{decodeJwtPayload(TAMPERED_PAYLOAD)}</pre>
                      <button
                        type="button"
                        className="btn primary"
                        onClick={handleVerifyTampered}
                        disabled={tamperedResult !== null}
                        style={{ marginTop: '0.5rem' }}
                      >
                        Submit tampered JWT
                      </button>
                      {tamperedResult === 'rejected' && (
                        <motion.p
                          className="sec-sig-result--invalid"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                        >
                          ✗ Signature invalid — server rejects. Payload changed, signature didn't match.
                        </motion.p>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        {/* Right: OAuth */}
        <div className="sec-auth-half">
          <h4>Authorization — OAuth 2.0</h4>
          {!oauthStarted ? (
            <button type="button" className="btn primary" onClick={() => { setOauthStarted(true); advanceOAuth() }}>
              Login with Google
            </button>
          ) : (
            <div className="sec-auth-oauth">
              {OAUTH_STEPS.slice(0, oauthStep).map((step, i) => (
                <motion.div
                  key={i}
                  className="sec-auth-oauth-step"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22, delay: i * 0.05 }}
                >
                  <span className="sec-auth-step-n">{i + 1}</span>
                  <div>
                    <strong>{step.label}</strong>
                    <p className="micro">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
              {oauthStep < 5 && (
                <button type="button" className="btn primary" onClick={advanceOAuth} style={{ marginTop: '0.5rem' }}>
                  Next step
                </button>
              )}
              {oauthStep === 5 && (
                <motion.p
                  className="db-acid-ok"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  OAuth complete. App has access token. User never shared password with App.
                </motion.p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="lesson-actions">
        {jwtAndOauthSeen && !done && (
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
        {!jwtAndOauthSeen && (
          <span className="hint">
            Complete both the JWT tampering and the OAuth flow to continue
          </span>
        )}
      </div>

      {jwtAndOauthSeen && (
        <ConnectionCard
          title="Authentication and authorization are different — confusing them is a top-5 security bug"
          body={
            <>
              JWTs are stateless — the server doesn't store sessions. OAuth lets you grant a third-party app limited
              access without sharing your password. Mixing up the two leads to privilege escalation bugs that appear
              in production systems regularly.
            </>
          }
          appearsIn={['every web API', 'social login buttons', 'API key management']}
          hook="Authentication and authorization are correct patterns. What happens when developers get them wrong? That is OWASP."
        />
      )}
    </div>
  )
}
