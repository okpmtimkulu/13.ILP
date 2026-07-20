import { motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { curriculum } from '../content/curriculum'
import { ConnectionCard } from '../components/ConnectionCard'
import { LessonRestartControl } from '../components/LessonRestartControl'
import { LessonNav } from '../components/LessonNav'
import { isAiChapterLocked } from '../content/journeyStack'
import { setStackCelebrate } from '../lib/stackCelebrate'
import { completeLesson, loadProgress, mergeProgress } from '../lib/progress'

const chMeta = curriculum.chapters.find((c) => c.id === 'ai')!
const lessonMeta = curriculum.lessons.find((l) => l.id === 'llm-intuition')!

const TOKENS = ['The', 'cat', 'sat', 'mat']

export function LLM() {
  const [, setTick] = useState(0)
  const refresh = () => setTick((n) => n + 1)

  const progress = loadProgress()
  const done = progress.completedLessonIds.includes('llm-intuition')
  const [tab, setTab] = useState<'attention' | 'factory'>('attention')
  const [center, setCenter] = useState(1)

  const markAttention = () => {
    const p = loadProgress()
    mergeProgress({ llm: { ...p.llm, attentionSeen: true } })
    refresh()
  }

  const markTrainInfer = () => {
    const p = loadProgress()
    mergeProgress({ llm: { ...p.llm, trainInferSeen: true } })
    refresh()
  }

  const finish = () => {
    const p = loadProgress()
    if (p.llm.attentionSeen && p.llm.trainInferSeen && !done) {
      setStackCelebrate('ai', 'summit')
      completeLesson('llm-intuition')
      refresh()
    }
  }

  const p2 = loadProgress()
  const canComplete = p2.llm.attentionSeen && p2.llm.trainInferSeen && !done
  const gated = isAiChapterLocked(p2) && !done

  if (gated) {
    return (
      <div className="lesson-page">
        <header className="lesson-header">
          <div className="lesson-header-top">
            <span className="lesson-chapter-label">Chapter 4</span>
          </div>
          <h1 className="lesson-title">{chMeta.title}</h1>
          <p className="lesson-description">{chMeta.summary}</p>
        </header>
        <div className="lesson-locked-panel">
          <p>
            This chapter sits at the top of the stack. Finish the Networks lab first so you feel distance and cables
            before opening attention and training.
          </p>
          <Link to="/learn/dsa" className="btn primary">
            Open DSA
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="lesson-page">
      <header className="lesson-header">
        <div className="lesson-header-top">
          <span className="lesson-chapter-label">Chapter 4</span>
          <LessonRestartControl lessonId="llm-intuition" lessonTitle={lessonMeta.title} />
        </div>
        <h1 className="lesson-title">{chMeta.title}</h1>
        <p className="lesson-description">{chMeta.summary}</p>
      </header>

      <div className="lesson-objectives">
        <h2>What you will learn</h2>
        <ul>
          <li>How attention lets words look at each other</li>
          <li>The difference between training (slow, expensive) and inference (fast, cheap)</li>
          <li>Why this is gut feeling first — not a textbook substitute</li>
        </ul>
      </div>

      {progress.completedLessonIds.includes('foundations-golden-path') ? (
        <aside className="lesson-callback">
          <strong>You have seen this before.</strong> The full adder you built is the same kind of operation repeated at
          massive scale inside matrix multiply. Different packaging, same arithmetic heart.
        </aside>
      ) : null}

      {done && (
        <div className="lesson-banner lesson-banner--success">
          Unlocked <strong>Pocket phone</strong>. Finish the other main tracks too and the <strong>robot</strong> joins
          the party.
        </div>
      )}

      <div className="lesson-content">
        <div className="lesson-mode-toggle">
          <button
            type="button"
            className={tab === 'attention' ? 'active' : ''}
            onClick={() => setTab('attention')}
          >
            Attention
          </button>
          <button
            type="button"
            className={tab === 'factory' ? 'active' : ''}
            onClick={() => setTab('factory')}
          >
            Train and infer
          </button>
        </div>

        {tab === 'attention' && (
          <section className="llm-panel">
            <p className="lesson-instruction">
              Words are tokens. Tap one to be the center. Lines show who it glances at — a simplified view of attention.
            </p>
            <div className="token-row">
              {TOKENS.map((t, i) => (
                <button
                  key={t}
                  type="button"
                  className={`token-chip ${i === center ? 'on' : ''}`}
                  onClick={() => {
                    setCenter(i)
                    markAttention()
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="attention-canvas">
              <svg viewBox="0 0 400 120" className="attn-svg">
                {TOKENS.map((_, i) => {
                  const x = 50 + i * 100
                  const cx = 50 + center * 100
                  const opacity = i === center ? 0 : 0.5
                  return (
                    <motion.line
                      key={`${center}-${i}`}
                      x1={cx}
                      y1={60}
                      x2={x}
                      y2={60}
                      stroke="var(--signal)"
                      strokeWidth="2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity }}
                      transition={{ duration: 0.25 }}
                    />
                  )
                })}
                {TOKENS.map((_, i) => {
                  const x = 50 + i * 100
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={60}
                      r={i === center ? 14 : 10}
                      className={`attn-node ${i === center ? 'c' : ''}`}
                    />
                  )
                })}
              </svg>
            </div>
          </section>
        )}

        {tab === 'factory' && (
          <section
            className="llm-panel factory"
            onClick={() => markTrainInfer()}
            onKeyDown={(e) => e.key === 'Enter' && markTrainInfer()}
            role="presentation"
          >
            <p className="lesson-instruction">Tap anywhere in this panel to explore training vs inference.</p>
            <div className="factory-split">
              <div className="factory-col">
                <h3>Training</h3>
                <p className="micro">Many batches, loss curves, weight updates. Hours to weeks on clusters.</p>
                <div className="factory-loop" data-kind="train">
                  <motion.div
                    className="blob batch"
                    animate={{ y: [0, 40, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  >
                    batch
                  </motion.div>
                  <div className="arrow">→</div>
                  <div className="station loss">loss</div>
                  <div className="arrow">→</div>
                  <motion.div
                    className="station weights"
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    weights
                  </motion.div>
                </div>
              </div>
              <div className="factory-col">
                <h3>Inference</h3>
                <p className="micro">One forward pass, plus autoregressive steps for text. Often milliseconds.</p>
                <div className="factory-loop" data-kind="infer">
                  <div className="blob prompt">prompt</div>
                  <div className="arrow">→</div>
                  <motion.div
                    className="station out"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                  >
                    logits → tokens
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
        )}

        <aside className="lesson-precision">
          <strong>Keeping it honest:</strong> Real models use many heads, layers, and math tricks. This screen builds
          gut feeling, not a textbook replacement.
        </aside>

        {canComplete && !done ? (
          <ConnectionCard
            title="From packets to tokens"
            body={
              <>
                Attention scores relationships between pieces of text. Training changes weights over long runs;
                inference reuses those weights for quick answers. You have walked the whole stack from bits to here.
              </>
            }
            appearsIn={['transformer papers', 'every large language model', 'the phone you unlocked in Devices']}
            hook="Mark complete to draw the final thread on the home page."
          />
        ) : null}

        <div className="lesson-actions">
          <button type="button" className="btn primary" disabled={!canComplete} onClick={finish}>
            {done ? 'Lesson saved' : 'Mark lesson complete'}
          </button>
        </div>
      </div>

      {done && (
        <div className="lesson-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            <li>Attention lets each token consider context from every other token in a sequence</li>
            <li>Training is slow and expensive — it updates weights over many batches</li>
            <li>Inference is fast — it reuses trained weights to produce answers in milliseconds</li>
          </ul>
        </div>
      )}

      <LessonNav
        prev={{ label: 'Security and cryptography', to: '/learn/security' }}
        next={{ label: 'Ethics and responsibility', to: '/learn/ethics' }}
      />
    </div>
  )
}
