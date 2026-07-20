import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type ContentType = 'news' | 'jobs' | 'loans'

const SCALES = [
  { label: '100 users', users: 100 },
  { label: '10,000 users', users: 10_000 },
  { label: '1 billion users', users: 1_000_000_000 },
]

const BIAS_RATE = 0.01 // 1%

const CONTENT_CONTEXT: Record<ContentType, { label: string; impact: string }> = {
  news: {
    label: 'News articles',
    impact: 'sees systematically skewed political content',
  },
  jobs: {
    label: 'Job listings',
    impact: 'shown lower-paying jobs based on inferred demographics',
  },
  loans: {
    label: 'Loan advertisements',
    impact: 'shown higher-interest products regardless of creditworthiness',
  },
}

export function EthScale({ onComplete }: { onComplete: () => void }) {
  const [scaleIdx, setScaleIdx] = useState(0)
  const [contentType, setContentType] = useState<ContentType>('news')
  const [seenScales, setSeenScales] = useState<Set<number>>(new Set([0]))
  const [seenContent, setSeenContent] = useState<Set<ContentType>>(new Set(['news']))
  const [done, setDone] = useState(false)

  const scale = SCALES[scaleIdx]
  const affected = Math.round(scale.users * BIAS_RATE)
  const ctx = CONTENT_CONTEXT[contentType]

  const switchScale = (idx: number) => {
    setScaleIdx(idx)
    setSeenScales((prev) => new Set([...prev, idx]))
  }

  const switchContent = (ct: ContentType) => {
    setContentType(ct)
    setSeenContent((prev) => new Set([...prev, ct]))
  }

  const seenAll = seenScales.size === 3 && seenContent.size >= 2

  return (
    <div className="lesson-panel">
      <p className="lede">
        The same 1% error rate has completely different consequences depending on who is using the system. Scale does
        not change the nature of a problem — it amplifies it.
      </p>

      <div className="eth-scale-stage">
        <div className="eth-scale-sliders">
          <div className="eth-scale-tabs">
            {SCALES.map((s, i) => (
              <button
                key={i}
                type="button"
                className={`db-acid-tab ${scaleIdx === i ? 'db-acid-tab--active' : ''}`}
                onClick={() => switchScale(i)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="eth-scale-content-tabs">
            {(Object.keys(CONTENT_CONTEXT) as ContentType[]).map((ct) => (
              <button
                key={ct}
                type="button"
                className={`db-acid-tab ${contentType === ct ? 'db-acid-tab--active' : ''}`}
                onClick={() => switchContent(ct)}
              >
                {CONTENT_CONTEXT[ct].label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={`${scaleIdx}-${contentType}`}
          className="eth-scale-result"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          <div className="eth-scale-numbers">
            <div className="eth-scale-number-row">
              <span className="micro">Total users</span>
              <motion.span
                key={scale.users}
                className="eth-scale-big"
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                {scale.users.toLocaleString()}
              </motion.span>
            </div>
            <div className="eth-scale-number-row">
              <span className="micro">Bias rate</span>
              <span className="eth-scale-big">1%</span>
            </div>
            <div className="eth-scale-number-row">
              <span className="micro">People affected</span>
              <motion.span
                key={affected}
                className={`eth-scale-big ${affected > 1000 ? 'eth-scale-big--high' : affected > 0 ? 'eth-scale-big--medium' : ''}`}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                {affected.toLocaleString()}
              </motion.span>
            </div>
          </div>

          <p className="eth-scale-impact">
            {affected.toLocaleString()} {affected === 1 ? 'person' : 'people'} {ctx.impact}.
          </p>

          {affected >= 1_000_000 && (
            <motion.p
              className="micro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              At this scale, 1% is not a rounding error — it is a social phenomenon.
            </motion.p>
          )}
        </motion.div>
      </div>

      <div className="lesson-actions">
        {seenAll && !done && (
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
        {!seenAll && (
          <span className="hint">
            View all 3 scales and at least 2 content types to continue
          </span>
        )}
      </div>

      {seenAll && (
        <ConnectionCard
          title="Software engineering at scale is a different discipline from software engineering at small scale"
          body={
            <>
              The same 0.1% error rate in a school project affects nobody. In a search engine, it affects millions of
              people every day. The tools and techniques are the same — the ethical stakes are not.
            </>
          }
          appearsIn={['content recommendation systems', 'search ranking algorithms', 'social media feeds']}
          hook="Scale amplifies bias. The next question is: where does bias come from? And what can you do about it?"
        />
      )}
    </div>
  )
}
