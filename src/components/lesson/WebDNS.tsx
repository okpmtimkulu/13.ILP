import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

const STAGES = [
  { id: 'browser', label: 'Browser Cache', desc: 'Checked local cache — not found' },
  { id: 'os', label: 'OS Cache', desc: 'Checked OS resolver cache — not found' },
  { id: 'resolver', label: 'Recursive Resolver', desc: 'Asked ISP resolver — not cached' },
  { id: 'root', label: 'Root Nameserver', desc: 'Directed to .com TLD nameservers' },
  { id: 'tld', label: 'TLD Nameserver (.com)', desc: 'Directed to authoritative server' },
  { id: 'auth', label: 'Authoritative Nameserver', desc: 'Found: A record → 93.184.216.34' },
] as const

type ResolveMode = 'idle' | 'running' | 'done'

export function WebDNS({ onComplete }: { onComplete: () => void }) {
  const [domain, setDomain] = useState('example.com')
  const [mode, setMode] = useState<ResolveMode>('idle')
  const [activeStage, setActiveStage] = useState(-1)
  const [fullResolveDone, setFullResolveDone] = useState(false)
  const [cachedResolveDone, setCachedResolveDone] = useState(false)
  const timerRef = useRef<number | null>(null)

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => () => clearTimer(), [])

  const runFullResolve = () => {
    if (mode === 'running') return
    setMode('running')
    setActiveStage(-1)

    const stepThrough = (i: number) => {
      setActiveStage(i)
      if (i < STAGES.length - 1) {
        timerRef.current = window.setTimeout(() => stepThrough(i + 1), 600)
      } else {
        timerRef.current = window.setTimeout(() => {
          setMode('done')
          setFullResolveDone(true)
        }, 800)
      }
    }
    timerRef.current = window.setTimeout(() => stepThrough(0), 200)
  }

  const runCacheResolve = () => {
    setMode('running')
    setActiveStage(-1)
    timerRef.current = window.setTimeout(() => {
      setActiveStage(0)
      timerRef.current = window.setTimeout(() => {
        setMode('done')
        setCachedResolveDone(true)
      }, 600)
    }, 200)
  }

  const isDone = fullResolveDone && cachedResolveDone

  return (
    <div className="lesson-panel">
      <p className="lede">
        Before your browser can load any page it must convert a domain name into an IP address. That journey passes
        through up to six checkpoints — each one a <strong>cache or nameserver</strong>.
      </p>

      <div className="web-dns-input-row">
        <label htmlFor="dns-domain" className="micro">Domain to resolve</label>
        <input
          id="dns-domain"
          type="text"
          className="web-dns-input"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          disabled={mode === 'running'}
        />
      </div>

      <div className="web-dns-chain" role="list" aria-label="DNS resolution chain">
        {STAGES.map((s, i) => {
          const isActive = activeStage === i
          const isPast = activeStage > i
          const isFinalResult = i === STAGES.length - 1 && mode === 'done' && fullResolveDone

          return (
            <motion.div
              key={s.id}
              className={`web-dns-stage ${isActive ? 'is-active' : ''} ${isPast ? 'is-past' : ''}`}
              animate={{
                scale: isActive ? 1.04 : 1,
                borderColor: isActive
                  ? 'var(--signal)'
                  : isPast
                  ? 'var(--success, #3ecf8e)'
                  : 'var(--border)',
              }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              role="listitem"
            >
              <div className="web-dns-stage-header">
                <span className="web-dns-stage-num">{i + 1}</span>
                <span className="web-dns-stage-label">{s.label}</span>
                {isPast && <span className="web-dns-stage-check" aria-label="checked">✓</span>}
              </div>
              <AnimatePresence>
                {(isActive || isPast) && (
                  <motion.p
                    className="web-dns-stage-desc micro"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {s.desc}
                  </motion.p>
                )}
              </AnimatePresence>
              {isFinalResult && (
                <motion.div
                  className="web-dns-result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  A record: <strong>93.184.216.34</strong>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {cachedResolveDone && (
          <motion.div
            className="web-dns-cache-result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <strong>Cache hit!</strong> Resolved at Browser Cache in &lt;1 ms. No nameservers contacted.
          </motion.div>
        )}
      </AnimatePresence>

      <ConnectionCard
        title="DNS is resolved billions of times per second"
        body={
          <>
            The root nameservers handle all of them — only 13 exist, mirrored worldwide. Every time your browser
            resolves a new domain, this chain runs. After the first lookup the answer is cached at every level,
            making repeat visits nearly instant.
          </>
        }
        appearsIn={['Layer 5 TLS handshake', 'every HTTP request', 'the browser render pipeline']}
        hook="Now that the IP is known, the browser opens an HTTP connection — next."
      />

      <div className="lesson-actions">
        {!fullResolveDone && (
          <button
            type="button"
            className="btn primary"
            onClick={runFullResolve}
            disabled={mode === 'running'}
          >
            {mode === 'running' ? 'Resolving…' : `Resolve ${domain || 'example.com'}`}
          </button>
        )}
        {fullResolveDone && !cachedResolveDone && (
          <button
            type="button"
            className="btn primary"
            onClick={runCacheResolve}
            disabled={mode === 'running'}
          >
            Try cache (resolve again)
          </button>
        )}
        {isDone && (
          <button type="button" className="btn primary" onClick={onComplete}>
            Continue to HTTP
          </button>
        )}
        {!fullResolveDone && (
          <span className="hint">Click Resolve to watch the lookup travel through the chain.</span>
        )}
        {fullResolveDone && !cachedResolveDone && (
          <span className="hint">Great — now try the cached path. The second lookup is instant.</span>
        )}
      </div>
    </div>
  )
}
