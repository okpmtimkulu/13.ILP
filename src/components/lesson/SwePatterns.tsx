import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Tab = 'observer' | 'strategy' | 'factory'

const SUBSCRIBERS = [
  { id: 'email', label: 'EmailService', color: '#38bdf8' },
  { id: 'sms', label: 'SMSService', color: '#f59e0b' },
  { id: 'push', label: 'PushService', color: '#10b981' },
]

const SORT_STRATEGIES = ['ascending', 'descending', 'by length'] as const
type SortStrategy = (typeof SORT_STRATEGIES)[number]

const SAMPLE_LIST = ['banana', 'apple', 'cherry', 'date', 'elderberry']

function sortWith(list: string[], strategy: SortStrategy): string[] {
  const copy = [...list]
  if (strategy === 'ascending') return copy.sort()
  if (strategy === 'descending') return copy.sort().reverse()
  if (strategy === 'by length') return copy.sort((a, b) => a.length - b.length)
  return copy
}

const BUTTON_TYPES = ['primary', 'secondary', 'danger'] as const
type ButtonType = (typeof BUTTON_TYPES)[number]

export function SwePatterns({ onComplete }: { onComplete: () => void }) {
  const [tab, setTab] = useState<Tab>('observer')
  const [seen, setSeen] = useState<Set<Tab>>(new Set(['observer']))

  // Observer
  const [connectedSubs, setConnectedSubs] = useState<Set<string>>(new Set())
  const [firedSubs, setFiredSubs] = useState<Set<string>>(new Set())
  const [eventFired, setEventFired] = useState(false)

  // Strategy
  const [strategy, setStrategy] = useState<SortStrategy>('ascending')
  const [sortResult, setSortResult] = useState<string[] | null>(null)

  // Factory
  const [selectedType, setSelectedType] = useState<ButtonType>('primary')
  const [createdButtons, setCreatedButtons] = useState<{ type: ButtonType; label: string }[]>([])
  const [factoryLabel, setFactoryLabel] = useState('Submit')

  const switchTab = (t: Tab) => {
    setTab(t)
    setSeen((prev) => new Set([...prev, t]))
  }

  const toggleSub = (id: string) => {
    setConnectedSubs((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setFiredSubs(new Set())
    setEventFired(false)
  }

  const fireEvent = () => {
    setEventFired(true)
    setFiredSubs(new Set(connectedSubs))
  }

  const runSort = () => {
    setSortResult(sortWith(SAMPLE_LIST, strategy))
  }

  const createButton = () => {
    setCreatedButtons((prev) => [...prev, { type: selectedType, label: factoryLabel }])
  }

  const allSeen = seen.size === 3

  return (
    <div className="lesson-panel">
      <p className="lede">
        Design patterns are named solutions to recurring design problems. Three of the 23 GoF patterns you will meet
        everywhere in production code.
      </p>

      <div className="db-nosql-tabs">
        {(['observer', 'strategy', 'factory'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            className={`db-nosql-tab ${tab === t ? 'db-nosql-tab--active' : ''} ${seen.has(t) ? 'db-nosql-tab--seen' : ''}`}
            onClick={() => switchTab(t)}
          >
            {t === 'observer' ? 'Observer' : t === 'strategy' ? 'Strategy' : 'Factory'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'observer' && (
          <motion.div
            key="observer"
            className="db-nosql-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <p className="micro">Event emitter with subscribers. Wire connections, then fire the event.</p>
            <div className="swe-pat-observer">
              <div className="swe-pat-emitter">
                <span className="swe-pat-node">EventEmitter</span>
                <span className="micro">UserSignedUp</span>
              </div>
              <div className="swe-pat-subs">
                {SUBSCRIBERS.map((sub) => {
                  const connected = connectedSubs.has(sub.id)
                  const fired = firedSubs.has(sub.id)
                  return (
                    <div key={sub.id} className="swe-pat-sub-row">
                      <motion.div
                        className={`swe-pat-wire ${connected ? 'swe-pat-wire--on' : ''} ${fired ? 'swe-pat-wire--fired' : ''}`}
                        animate={{ scaleX: connected ? 1 : 0.3, opacity: connected ? 1 : 0.3 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                      />
                      <motion.div
                        className={`swe-pat-sub ${fired ? 'swe-pat-sub--fired' : ''}`}
                        style={{ borderColor: sub.color }}
                        animate={{ scale: fired ? [1.1, 1] : 1 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                      >
                        {sub.label}
                        {fired && <span className="db-acid-ok"> executed</span>}
                      </motion.div>
                      <button type="button" className="btn primary" onClick={() => toggleSub(sub.id)}>
                        {connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
              <button type="button" className="btn primary" onClick={fireEvent} disabled={connectedSubs.size === 0}>
                Fire "UserSignedUp" event
              </button>
            </div>
            {eventFired && (
              <p className="micro" style={{ marginTop: '0.5rem' }}>
                {firedSubs.size} subscriber{firedSubs.size !== 1 ? 's' : ''} notified. The emitter does not know
                who is listening — zero coupling.
              </p>
            )}
          </motion.div>
        )}

        {tab === 'strategy' && (
          <motion.div
            key="strategy"
            className="db-nosql-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <p className="micro">A sort function with a pluggable comparison strategy. Same sort() body — different comparator.</p>
            <div className="swe-pat-strategy">
              <div className="swe-pat-strategy-select">
                {SORT_STRATEGIES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`db-acid-tab ${strategy === s ? 'db-acid-tab--active' : ''}`}
                    onClick={() => { setStrategy(s); setSortResult(null) }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <pre className="par-types-code">{`function sort(list, comparator) {
  // sort body never changes
  return list.sort(comparator)
}

// Injected strategy: "${strategy}"
// sort() does not care which strategy`}</pre>
              <p className="micro">Input: [{SAMPLE_LIST.join(', ')}]</p>
              <button type="button" className="btn primary" onClick={runSort}>
                Sort with "{strategy}"
              </button>
              {sortResult && (
                <motion.p
                  className="micro"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  Result: [{sortResult.join(', ')}]
                </motion.p>
              )}
            </div>
          </motion.div>
        )}

        {tab === 'factory' && (
          <motion.div
            key="factory"
            className="db-nosql-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <p className="micro">Factory: caller provides a type string, factory decides which class to instantiate.</p>
            <div className="swe-pat-factory">
              <pre className="par-types-code">{`function createButton(type: string, label: string) {
  if (type === 'primary')   return new PrimaryButton(label)
  if (type === 'secondary') return new SecondaryButton(label)
  if (type === 'danger')    return new DangerButton(label)
  throw new Error('Unknown button type')
}`}</pre>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <select
                  className="db-query-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as ButtonType)}
                >
                  {BUTTON_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <input
                  className="db-query-input"
                  value={factoryLabel}
                  onChange={(e) => setFactoryLabel(e.target.value)}
                />
                <button type="button" className="btn primary" onClick={createButton}>
                  createButton()
                </button>
              </div>
              <div className="swe-pat-factory-output">
                {createdButtons.map((btn, i) => (
                  <motion.button
                    key={i}
                    type="button"
                    className={`swe-pat-button swe-pat-button--${btn.type}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  >
                    {btn.label}
                  </motion.button>
                ))}
              </div>
            </div>
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
          <span className="hint">Explore all 3 patterns to continue ({seen.size}/3 seen)</span>
        )}
      </div>

      {allSeen && (
        <ConnectionCard
          title="Observer = React useState+useEffect, Strategy = database drivers, Factory = plugin systems"
          body={
            <>
              React's component system is the Observer pattern: state changes notify subscribers (components).
              Database drivers (pg, mysql2) are Strategy: same interface, different implementation.
              CLI plugin systems use Factory: a string name → the right handler.
            </>
          }
          appearsIn={['React hooks', 'database drivers', 'plugin architectures']}
          hook="Patterns describe how code is structured. CI/CD pipelines describe how code is delivered. Next: shipping safely."
        />
      )}
    </div>
  )
}
