import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Technique = 'none' | 'pseudonymize' | 'aggregate' | 'dp' | 'minimize'

type Row = { id: string; name: string; email: string; location: string; age: number; purchases: string }

const RAW_DATA: Row[] = [
  { id: '1', name: 'Alice Smith', email: 'alice@ex.com', location: 'London', age: 28, purchases: 'laptop, headphones' },
  { id: '2', name: 'Bob Jones', email: 'bob@ex.com', location: 'London', age: 35, purchases: 'phone, case' },
  { id: '3', name: 'Carol Lee', email: 'carol@ex.com', location: 'Paris', age: 22, purchases: 'keyboard' },
  { id: '4', name: 'Dan Brown', email: 'dan@ex.com', location: 'London', age: 41, purchases: 'monitor, cable' },
  { id: '5', name: 'Eve White', email: 'eve@ex.com', location: 'Berlin', age: 29, purchases: 'tablet' },
]

function hashName(name: string): string {
  return 'usr_' + name.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) & 0xffff, 0).toString(16).padStart(4, '0')
}
function hashEmail(email: string): string {
  return 'hash_' + email.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) & 0xffff, 0).toString(16).padStart(4, '0') + '@ex'
}

const RISK_LEVELS: Record<Technique, number> = {
  none: 95,
  pseudonymize: 65,
  aggregate: 30,
  dp: 15,
  minimize: 10,
}

const TECHNIQUE_LABELS: Record<Technique, string> = {
  none: 'None',
  pseudonymize: 'Pseudonymize',
  aggregate: 'Aggregate',
  dp: 'Differential Privacy',
  minimize: 'Data Minimization',
}

export function EthPrivacy({ onComplete }: { onComplete: () => void }) {
  const [techniques, setTechniques] = useState<Set<Technique>>(new Set(['none']))
  const [applied, setApplied] = useState<Technique>('none')
  const [done, setDone] = useState(false)

  const apply = (t: Technique) => {
    setApplied(t)
    setTechniques((prev) => new Set([...prev, t]))
  }

  const risk = RISK_LEVELS[applied]
  const allSeen = techniques.size >= 4

  const renderTable = () => {
    if (applied === 'aggregate') {
      return (
        <div className="eth-priv-aggregate">
          <div className="eth-priv-agg-row">
            <span>London users</span><span>3</span>
          </div>
          <div className="eth-priv-agg-row">
            <span>Median age (London)</span><span>35</span>
          </div>
          <div className="eth-priv-agg-row">
            <span>Paris users</span><span>1</span>
          </div>
          <div className="eth-priv-agg-row">
            <span>Berlin users</span><span>1</span>
          </div>
          <p className="micro" style={{ marginTop: '0.5rem' }}>Individual rows removed. Only group statistics remain.</p>
        </div>
      )
    }

    if (applied === 'minimize') {
      return (
        <div className="eth-priv-table-wrap">
          <table className="db-norm-table">
            <thead><tr><th>id</th><th>location</th><th>age</th></tr></thead>
            <tbody>
              {RAW_DATA.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.location}</td>
                  <td>{r.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="micro" style={{ marginTop: '0.35rem' }}>Name, email, purchases deleted — not needed for this analysis.</p>
        </div>
      )
    }

    const rows = RAW_DATA.map((r) => ({
      id: r.id,
      name: applied === 'pseudonymize' ? hashName(r.name) : r.name,
      email: applied === 'pseudonymize' ? hashEmail(r.email) : r.email,
      location: r.location,
      age: applied === 'dp' ? parseFloat((r.age + (Math.random() - 0.5) * 4).toFixed(1)) : r.age,
      purchases: r.purchases,
    }))

    return (
      <div className="eth-priv-table-wrap">
        <table className="db-norm-table">
          <thead><tr><th>name</th><th>email</th><th>location</th><th>age</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>{r.location}</td>
                <td>{r.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {applied === 'dp' && <p className="micro" style={{ marginTop: '0.35rem' }}>Ages have calibrated noise added — individual values obscured.</p>}
        {applied === 'pseudonymize' && <p className="micro" style={{ marginTop: '0.35rem' }}>Names and emails replaced with one-way hashes. Re-linking requires the mapping table.</p>}
      </div>
    )
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        Privacy is a design choice. Apply techniques that reduce re-identification risk — and watch the risk gauge drop
        with each layer.
      </p>

      <div className="eth-priv-stage">
        <div className="eth-priv-controls">
          {(['none', 'pseudonymize', 'aggregate', 'dp', 'minimize'] as Technique[]).map((t) => (
            <button
              key={t}
              type="button"
              className={`db-acid-tab ${applied === t ? 'db-acid-tab--active' : ''} ${techniques.has(t) ? 'db-acid-tab--seen' : ''}`}
              onClick={() => apply(t)}
            >
              {TECHNIQUE_LABELS[t]}
            </button>
          ))}
        </div>

        <div className="eth-priv-risk">
          <span className="micro">Re-identification risk:</span>
          <div className="eth-priv-risk-bar">
            <motion.div
              className={`eth-priv-risk-fill ${risk > 60 ? 'eth-priv-risk-fill--high' : risk > 30 ? 'eth-priv-risk-fill--medium' : 'eth-priv-risk-fill--low'}`}
              animate={{ width: `${risk}%` }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            />
          </div>
          <motion.span
            key={risk}
            className="eth-priv-risk-pct"
            animate={{ scale: [1.1, 1] }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            {risk}%
          </motion.span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={applied}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            {renderTable()}
          </motion.div>
        </AnimatePresence>

        {applied === 'aggregate' && (
          <p className="micro" style={{ color: '#f59e0b', marginTop: '0.5rem' }}>
            Note: combining location + age across datasets can still re-identify individuals (Netflix Prize attack,
            2006: "anonymized" movie ratings combined with public reviews to identify users).
          </p>
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
          <span className="hint">Apply all 4 privacy techniques to continue ({techniques.size - 1}/4)</span>
        )}
      </div>

      {allSeen && (
        <ConnectionCard
          title="GDPR requires data minimization; HIPAA requires de-identification"
          body={
            <>
              These techniques are how companies comply — or try to. "Anonymized" data is rarely truly anonymous.
              The Netflix Prize dataset, AOL search logs, and NYC taxi data have all been re-identified by researchers
              combining datasets. True privacy requires minimizing what you collect, not just how you store it.
            </>
          }
          appearsIn={['GDPR compliance', 'HIPAA de-identification', 'differential privacy (Apple, Google)']}
          hook="Privacy is about what you collect. AI safety is about what happens when systems optimize for the wrong thing."
        />
      )}
    </div>
  )
}
