import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Tab = 'sqli' | 'xss' | 'csrf'

export function SecOwasp({ onComplete }: { onComplete: () => void }) {
  const [tab, setTab] = useState<Tab>('sqli')
  const [seen, setSeen] = useState<Set<Tab>>(new Set(['sqli']))

  // SQLi state
  const [sqliInput, setSqliInput] = useState("' OR 1=1; --")
  const [sqliMode, setSqliMode] = useState<'raw' | 'parameterized'>('raw')
  const [sqliResult, setSqliResult] = useState<string | null>(null)

  // XSS state
  const [xssInput, setXssInput] = useState("<script>alert('XSS')</script>")
  const [xssMode, setXssMode] = useState<'raw' | 'escaped'>('raw')
  const [xssSubmitted, setXssSubmitted] = useState(false)

  // CSRF state
  const [csrfProtected, setCsrfProtected] = useState(false)
  const [csrfAttacked, setCsrfAttacked] = useState(false)
  const [csrfResult, setCsrfResult] = useState<'success' | 'blocked' | null>(null)

  const [done, setDone] = useState(false)
  const allSeen = seen.size === 3

  const switchTab = (t: Tab) => {
    setTab(t)
    setSeen((prev) => new Set([...prev, t]))
  }

  const sqliQuery = sqliMode === 'raw'
    ? `SELECT * FROM users WHERE name='${sqliInput}'`
    : `SELECT * FROM users WHERE name=$1\n-- $1 = '${sqliInput}' (literal string)`

  const sqliExploded = sqliMode === 'raw' && sqliInput.includes("'")

  const runSqli = () => {
    if (sqliMode === 'raw') {
      setSqliResult(sqliExploded ? 'Logged in as admin (all rows returned!)' : 'User found: ' + sqliInput)
    } else {
      setSqliResult('User not found. Injection treated as literal string — safe.')
    }
  }

  const xssEscaped = xssInput
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return (
    <div className="lesson-panel">
      <p className="lede">
        SQL injection, XSS, and CSRF account for the majority of web breaches. Each has a simple, effective fix that
        is available in every modern framework.
      </p>

      <div className="sec-owasp-tabs">
        {(['sqli', 'xss', 'csrf'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            className={`db-nosql-tab ${tab === t ? 'db-nosql-tab--active' : ''} ${seen.has(t) ? 'db-nosql-tab--seen' : ''}`}
            onClick={() => switchTab(t)}
          >
            {t === 'sqli' ? 'SQL Injection' : t === 'xss' ? 'XSS' : 'CSRF'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'sqli' && (
          <motion.div
            key="sqli"
            className="sec-owasp-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <div className="sec-owasp-mode-toggle">
              <button
                type="button"
                className={`db-acid-tab ${sqliMode === 'raw' ? 'db-acid-tab--active' : ''}`}
                onClick={() => { setSqliMode('raw'); setSqliResult(null) }}
              >
                Vulnerable (string concat)
              </button>
              <button
                type="button"
                className={`db-acid-tab ${sqliMode === 'parameterized' ? 'db-acid-tab--active' : ''}`}
                onClick={() => { setSqliMode('parameterized'); setSqliResult(null) }}
              >
                Safe (parameterized)
              </button>
            </div>

            <div className="sec-owasp-login">
              <input
                className="db-query-input"
                value={sqliInput}
                onChange={(e) => { setSqliInput(e.target.value); setSqliResult(null) }}
                placeholder="Username"
              />
              <button type="button" className="btn primary" onClick={runSqli}>Login</button>
            </div>

            <pre className="sec-owasp-query">{sqliQuery}</pre>

            {sqliResult && (
              <motion.div
                className={`sec-owasp-result ${sqliExploded && sqliMode === 'raw' ? 'sec-owasp-result--danger' : 'sec-owasp-result--safe'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                {sqliResult}
              </motion.div>
            )}

            <p className="micro" style={{ marginTop: '0.5rem' }}>
              Fix: parameterized queries. The placeholder <code>$1</code> is never interpreted as SQL — the injection
              becomes a literal string value.
            </p>
          </motion.div>
        )}

        {tab === 'xss' && (
          <motion.div
            key="xss"
            className="sec-owasp-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <div className="sec-owasp-mode-toggle">
              <button
                type="button"
                className={`db-acid-tab ${xssMode === 'raw' ? 'db-acid-tab--active' : ''}`}
                onClick={() => { setXssMode('raw'); setXssSubmitted(false) }}
              >
                Vulnerable (raw HTML)
              </button>
              <button
                type="button"
                className={`db-acid-tab ${xssMode === 'escaped' ? 'db-acid-tab--active' : ''}`}
                onClick={() => { setXssMode('escaped'); setXssSubmitted(false) }}
              >
                Safe (escaped)
              </button>
            </div>

            <div className="sec-owasp-comment-form">
              <input
                className="db-query-input"
                value={xssInput}
                onChange={(e) => { setXssInput(e.target.value); setXssSubmitted(false) }}
                placeholder="Leave a comment..."
              />
              <button type="button" className="btn primary" onClick={() => setXssSubmitted(true)}>
                Post comment
              </button>
            </div>

            {xssSubmitted && (
              <motion.div
                className="sec-owasp-comment-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                <p className="micro">Comment section renders:</p>
                <div className="sec-owasp-comment-box">
                  {xssMode === 'raw' ? (
                    xssInput.includes('<script>') ? (
                      <div>
                        <span className="sec-owasp-alert-sim">[alert('XSS') executed!]</span>
                        <p className="micro" style={{ color: 'var(--error)' }}>
                          Script ran in victim's browser. Could steal cookies, redirect, log keystrokes.
                        </p>
                      </div>
                    ) : (
                      <span>{xssInput}</span>
                    )
                  ) : (
                    <code>{xssEscaped}</code>
                  )}
                </div>
                {xssMode === 'escaped' && (
                  <p className="micro sec-owasp-safe">
                    &lt;script&gt; rendered as text, not executed. CSP header can additionally block all inline scripts.
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {tab === 'csrf' && (
          <motion.div
            key="csrf"
            className="sec-owasp-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <div className="sec-owasp-mode-toggle">
              <button
                type="button"
                className={`db-acid-tab ${!csrfProtected ? 'db-acid-tab--active' : ''}`}
                onClick={() => { setCsrfProtected(false); setCsrfAttacked(false); setCsrfResult(null) }}
              >
                Unprotected
              </button>
              <button
                type="button"
                className={`db-acid-tab ${csrfProtected ? 'db-acid-tab--active' : ''}`}
                onClick={() => { setCsrfProtected(true); setCsrfAttacked(false); setCsrfResult(null) }}
              >
                Protected (SameSite + CSRF token)
              </button>
            </div>

            <div className="sec-owasp-csrf-scene">
              <div className="sec-owasp-csrf-actor">
                <span className="sec-kp-actor-name">bank.com</span>
                <span className="micro">User is logged in</span>
              </div>
              <div className="sec-owasp-csrf-arrow">→</div>
              <div className="sec-owasp-csrf-actor sec-owasp-csrf-attacker">
                <span className="sec-kp-actor-name">attacker.com</span>
                <span className="micro">Hidden form: POST /transfer?amount=1000</span>
              </div>
            </div>

            <button
              type="button"
              className="btn primary"
              onClick={() => {
                setCsrfAttacked(true)
                setCsrfResult(csrfProtected ? 'blocked' : 'success')
              }}
              disabled={csrfAttacked}
              style={{ marginTop: '0.75rem' }}
            >
              Attacker sends hidden POST request
            </button>

            {csrfAttacked && csrfResult && (
              <motion.div
                className={`sec-owasp-result ${csrfResult === 'success' ? 'sec-owasp-result--danger' : 'sec-owasp-result--safe'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                {csrfResult === 'success'
                  ? 'Transfer executed! Session cookie auto-attached by browser. $1000 sent to attacker.'
                  : 'Request rejected. SameSite=Strict blocked the cookie. CSRF token missing from attacker\'s form.'}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lesson-actions">
        {allSeen && !done && (
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
        {!allSeen && (
          <span className="hint">Visit all 3 attack types to continue ({seen.size}/3 seen)</span>
        )}
      </div>

      {allSeen && (
        <ConnectionCard
          title="Three attacks, three defenses — all available in every modern framework"
          body={
            <>
              Parameterized queries prevent SQL injection. Output encoding prevents XSS. SameSite cookies and CSRF
              tokens prevent CSRF. All three are one-line fixes — the reason they persist is that developers don't
              know to apply them.
            </>
          }
          appearsIn={['every web framework', 'OWASP Top 10', 'penetration testing reports']}
          hook="Security attacks exploit code. Paradigms shape how we write code. Next: the programming models that determine how you think."
        />
      )}
    </div>
  )
}
