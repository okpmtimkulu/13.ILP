import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

const PRINCIPLES = [
  {
    id: 1,
    title: 'Contribute to society and human well-being',
    layer: 'Open Source (Layer 15)',
    connection: 'The open-source software you just saw is the largest voluntary act of contribution to human well-being in the history of engineering.',
    color: '#38bdf8',
  },
  {
    id: 2,
    title: 'Avoid harm',
    layer: 'AI Safety (Layer 15)',
    connection: 'Incomplete objective functions in recommendation systems and facial recognition caused measurable harm to real people. Avoiding harm requires anticipating failure modes.',
    color: '#10b981',
  },
  {
    id: 3,
    title: 'Be honest and trustworthy',
    layer: 'Security (Layer 11)',
    connection: 'The security chapter showed that HTTPS certificates, digital signatures, and certificate chains exist to make honesty verifiable. Trustworthiness is an engineering property, not just a personal one.',
    color: '#6366f1',
  },
  {
    id: 4,
    title: 'Be fair and take action not to discriminate',
    layer: 'Algorithmic Bias (Layer 15)',
    connection: 'The hiring classifier learned bias from historical data. Fairness requires actively measuring and correcting for disparate impact — not just intending to be neutral.',
    color: '#f59e0b',
  },
  {
    id: 5,
    title: 'Respect privacy',
    layer: 'Privacy (Layer 15)',
    connection: 'Pseudonymization, aggregation, differential privacy, and data minimization are the technical implementations of respecting privacy. GDPR and HIPAA encode it into law.',
    color: '#8b5cf6',
  },
  {
    id: 6,
    title: 'Honor confidentiality',
    layer: 'Databases + Security (Layers 10-11)',
    connection: 'Access control, encryption at rest (Layer 10), and transport encryption (Layer 11) are the technical implementations of confidentiality. Confidentiality is not optional in systems handling medical, financial, or personal data.',
    color: '#ec4899',
  },
  {
    id: 7,
    title: 'Honor contracts, agreements, and applicable laws',
    layer: 'Privacy Law (Layer 15)',
    connection: 'GDPR, HIPAA, and data protection laws encode society\'s agreement about how personal data may be used. Building systems that ignore these is not a technical choice — it is a legal and ethical one.',
    color: '#f43f5e',
  },
]

const FINAL_MESSAGE =
  'The ethics are not separate from the engineering. They are the same thing, seen from the person it affects.'

export function EthAcm({ onComplete }: { onComplete: () => void }) {
  const [activeId, setActiveId] = useState<number | null>(null)
  const [seen, setSeen] = useState<Set<number>>(new Set())
  const [done, setDone] = useState(false)

  const clickPrinciple = (id: number) => {
    setActiveId(activeId === id ? null : id)
    setSeen((prev) => new Set([...prev, id]))
  }

  const allSeen = seen.size === 7

  return (
    <div className="lesson-panel">
      <p className="lede">
        The ACM Code of Ethics has seven core principles. Each one maps directly to a layer you have already built.
        The ethics were there all along — you just did not have the technical context to understand them fully.
      </p>

      <div className="eth-acm-stage">
        {PRINCIPLES.map((p) => {
          const isActive = activeId === p.id
          const wasSeen = seen.has(p.id)
          return (
            <motion.div
              key={p.id}
              className={`eth-acm-card ${isActive ? 'eth-acm-card--active' : ''} ${wasSeen ? 'eth-acm-card--seen' : ''}`}
              style={{ borderColor: p.color }}
              animate={{ opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <button
                type="button"
                className="eth-acm-card-btn"
                onClick={() => clickPrinciple(p.id)}
              >
                <span className="eth-acm-num" style={{ color: p.color }}>{p.id}.</span>
                <span className="eth-acm-title">{p.title}</span>
                <span className="micro eth-acm-layer" style={{ color: p.color }}>{p.layer}</span>
              </button>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="eth-acm-detail"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  >
                    <p className="micro">{p.connection}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}

        {allSeen && (
          <motion.div
            className="eth-acm-final"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <p className="eth-acm-final-msg">{FINAL_MESSAGE}</p>
          </motion.div>
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
            Complete the full stack
          </button>
        )}
        {!allSeen && (
          <span className="hint">
            Open all 7 principles to complete the curriculum ({seen.size}/7 seen)
          </span>
        )}
      </div>

      {allSeen && (
        <ConnectionCard
          title="The ACM Code of Ethics is required knowledge for CS graduates at most universities"
          body={
            <>
              You now have the technical context to understand why each principle exists — not as an abstract rule, but
              as a consequence of how systems work at scale, how bias emerges from data, how security fails, and how
              code runs in someone's life. The ethics were not separate from the engineering. They never were.
            </>
          }
          appearsIn={['ACM Code of Ethics (2018)', 'IEEE Code of Ethics', 'professional engineering licensure']}
        />
      )}
    </div>
  )
}
