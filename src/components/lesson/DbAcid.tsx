import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Property = 'A' | 'C' | 'I' | 'D'

const PROPERTIES: { id: Property; name: string; full: string; withOn: string; withOff: string }[] = [
  {
    id: 'A',
    name: 'Atomicity',
    full: 'All or nothing',
    withOn: 'Order with 3 items: item 2 fails → all 3 items rolled back. No partial insert.',
    withOff: 'Item 1 and 3 inserted, item 2 skipped. Orphaned line items with no valid order.',
  },
  {
    id: 'C',
    name: 'Consistency',
    full: 'Constraints always satisfied',
    withOn: 'INSERT order for user_id=999 rejected — foreign key constraint: user 999 does not exist.',
    withOff: 'Orphaned order row inserted. Order references a user that does not exist. Data is incoherent.',
  },
  {
    id: 'I',
    name: 'Isolation',
    full: 'Concurrent transactions do not interfere',
    withOn: 'T1 and T2 run serially (Serializable). T1 sees committed values only.',
    withOff: 'Dirty read: T1 reads T2\'s uncommitted balance before T2 commits or rolls back. Value is wrong.',
  },
  {
    id: 'D',
    name: 'Durability',
    full: 'Committed data survives crashes',
    withOn: 'COMMIT written. Power cut. WAL log replayed on restart. Data intact.',
    withOff: 'Commit acknowledged but not flushed to disk. Power cut → data lost. Silent data loss.',
  },
]

export function DbAcid({ onComplete }: { onComplete: () => void }) {
  const [active, setActive] = useState<Property>('A')
  const [toggled, setToggled] = useState<Record<Property, boolean>>({ A: true, C: true, I: true, D: true })
  const [seen, setSeen] = useState<Set<Property>>(new Set())
  const [done, setDone] = useState(false)

  const toggle = (id: Property) => {
    setToggled((prev) => ({ ...prev, [id]: !prev[id] }))
    setSeen((prev) => new Set([...prev, id]))
  }

  const allSeen = seen.size === 4

  const prop = PROPERTIES.find((p) => p.id === active)!
  const isOn = toggled[active]

  return (
    <div className="lesson-panel">
      <p className="lede">
        ACID is the contract a database makes with your application. Toggle each property off to see what breaks.
      </p>

      <div className="db-acid-tabs">
        {PROPERTIES.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`db-acid-tab ${active === p.id ? 'db-acid-tab--active' : ''} ${seen.has(p.id) ? 'db-acid-tab--seen' : ''}`}
            onClick={() => {
              setActive(p.id)
              setSeen((prev) => new Set([...prev, p.id]))
            }}
          >
            <span className="db-acid-tab-letter">{p.id}</span>
            <span className="db-acid-tab-name">{p.name}</span>
          </button>
        ))}
      </div>

      <div className="db-acid-panel">
        <div className="db-acid-panel-header">
          <div>
            <h3 className="db-acid-prop-name">{prop.name}</h3>
            <p className="micro">{prop.full}</p>
          </div>
          <label className="db-acid-toggle">
            <span className="micro">{isOn ? 'ON' : 'OFF'}</span>
            <button
              type="button"
              className={`db-acid-toggle-btn ${isOn ? 'db-acid-toggle-btn--on' : 'db-acid-toggle-btn--off'}`}
              onClick={() => toggle(active)}
              aria-pressed={isOn}
            >
              {isOn ? 'Enabled' : 'Disabled'}
            </button>
          </label>
        </div>

        <motion.div
          key={`${active}-${isOn}`}
          className={`db-acid-scenario ${isOn ? 'db-acid-scenario--ok' : 'db-acid-scenario--fail'}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          <span className="db-acid-scenario-badge">{isOn ? 'SAFE' : 'BROKEN'}</span>
          <p>{isOn ? prop.withOn : prop.withOff}</p>
        </motion.div>

        {active === 'A' && (
          <div className="db-acid-visual">
            <div className="db-acid-items">
              {['Item 1 — Widget', 'Item 2 — Gadget (FAILS)', 'Item 3 — Gizmo'].map((item, i) => (
                <motion.div
                  key={i}
                  className={`db-acid-item ${i === 1 ? 'db-acid-item--fail' : ''} ${isOn ? 'db-acid-item--rollback' : 'db-acid-item--partial'}`}
                  animate={{ opacity: isOn && i === 1 ? 0.4 : 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  {item}
                </motion.div>
              ))}
            </div>
            {isOn && <p className="micro" style={{ textAlign: 'center', marginTop: '0.5rem' }}>All 3 rolled back on failure</p>}
            {!isOn && <p className="micro" style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--error)' }}>Items 1 and 3 committed, item 2 skipped</p>}
          </div>
        )}

        {active === 'I' && (
          <div className="db-acid-isolation">
            <div className="db-acid-isolation-txn">
              <strong>T1</strong>
              <span className="micro">reads balance</span>
              <span className={isOn ? 'db-acid-ok' : 'db-acid-fail'}>{isOn ? '$1000 (committed)' : '$800 (T2 uncommitted!)'}</span>
            </div>
            <div className="db-acid-isolation-txn">
              <strong>T2</strong>
              <span className="micro">writing balance = $800 (not yet committed)</span>
              <span className="micro">{isOn ? 'invisible to T1 until COMMIT' : 'visible to T1 immediately — dirty read'}</span>
            </div>
          </div>
        )}

        {active === 'D' && (
          <div className="db-acid-durability">
            <div className="db-acid-dur-steps">
              {['COMMIT', 'Write to WAL', 'Flush to disk', 'Power cut ⚡', 'Restart', 'WAL replay'].map((step, i) => (
                <motion.div
                  key={step}
                  className={`db-acid-dur-step ${!isOn && i >= 2 ? 'db-acid-dur-step--lost' : 'db-acid-dur-step--ok'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {step}
                </motion.div>
              ))}
            </div>
            {!isOn && <p className="micro" style={{ color: 'var(--error)', marginTop: '0.5rem' }}>Flush skipped → data lost on power cut</p>}
          </div>
        )}
      </div>

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
          <span className="hint">Toggle all four properties to continue ({seen.size}/4 seen)</span>
        )}
      </div>

      {allSeen && (
        <ConnectionCard
          title="ACID is why your bank balance is always correct"
          body={
            <>
              NoSQL databases sometimes trade parts of ACID for speed or horizontal scale. MongoDB added transactions in
              v4.0; Cassandra offers only eventual consistency by default. Every choice has a cost.
            </>
          }
          appearsIn={['financial systems', 'PostgreSQL', 'MongoDB transactions', 'distributed databases']}
          hook="ACID protects writes. But reading 1000 rows is still slow without the right structure. Next: indexes."
        />
      )}
    </div>
  )
}
