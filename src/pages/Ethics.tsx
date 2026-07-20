import { useState } from 'react'
import { ConnectionMoment } from '../components/ConnectionMoment'
import { EthScale } from '../components/lesson/EthScale'
import { EthBias } from '../components/lesson/EthBias'
import { EthPrivacy } from '../components/lesson/EthPrivacy'
import { EthAiSafety } from '../components/lesson/EthAiSafety'
import { EthAccountability } from '../components/lesson/EthAccountability'
import { EthOpenSource } from '../components/lesson/EthOpenSource'
import { EthAcm } from '../components/lesson/EthAcm'
import { LessonNav } from '../components/LessonNav'
import { CONNECTION_MOMENTS } from '../content/connectionMoments'
import { curriculum } from '../content/curriculum'
import { setStackCelebrate } from '../lib/stackCelebrate'
import { LessonRestartControl } from '../components/LessonRestartControl'
import { completeLesson, loadProgress, mergeProgress } from '../lib/progress'

const chMeta = curriculum.chapters.find((c) => c.id === 'ethics')!
const lessonMeta = curriculum.lessons.find((l) => l.id === 'ethics-core')!
const steps = lessonMeta.steps

export function Ethics() {
  const initial = loadProgress()
  const initialDone = initial.completedLessonIds.includes('ethics-core')
  const startIdx = initialDone ? 7 : Math.min(initial.ethicsStepIndex, 6)

  const [idx, setIdx] = useState(startIdx)
  const [chapterDone, setChapterDone] = useState(initialDone)
  const [maxReach, setMaxReach] = useState(() => {
    if (initialDone) return 7
    return Math.min(initial.ethicsStepIndex, 6)
  })
  const [celebrate, setCelebrate] = useState(initialDone)
  const [momentId, setMomentId] = useState<string | null>(null)

  const go = (next: number) => {
    mergeProgress({ ethicsStepIndex: next })
    setMaxReach((m) => Math.max(m, next))
    setIdx(next)
  }

  const finishChapter = () => {
    setStackCelebrate('ethics', '')
    completeLesson('ethics-core')
    mergeProgress({ ethicsStepIndex: 7 })
    setChapterDone(true)
    setCelebrate(true)
    setMaxReach(7)
    setIdx(7)
  }

  const moment = momentId ? CONNECTION_MOMENTS[momentId] : null

  const onMomentContinue = () => {
    const id = momentId
    setMomentId(null)
    if (id === 'eth-0') go(1)
    else if (id === 'eth-1') go(2)
    else if (id === 'eth-2') go(3)
    else if (id === 'eth-3') go(4)
    else if (id === 'eth-4') go(5)
    else if (id === 'eth-5') go(6)
    else if (id === 'eth-6') finishChapter()
  }

  return (
    <div className="lesson-page">
      <ConnectionMoment
        open={!!moment}
        title={moment?.title ?? ''}
        body={moment?.body ?? ''}
        hook={moment?.hook}
        ctaLabel={moment?.cta ?? 'Continue'}
        onContinue={onMomentContinue}
      />

      <header className="lesson-header">
        <div className="lesson-header-top">
          <span className="lesson-chapter-label">Chapter 15</span>
          <LessonRestartControl lessonId="ethics-core" lessonTitle={lessonMeta.title} />
        </div>
        <h1 className="lesson-title">{chMeta.title}</h1>
        <p className="lesson-description">{chMeta.summary}</p>
      </header>

      <div className="lesson-objectives">
        <h2>What you will learn</h2>
        <ul>
          <li>How scale amplifies every property of a system — including its flaws</li>
          <li>How machine learning models inherit and amplify biases in their training data</li>
          <li>How pseudonymization, aggregation, differential privacy, and data minimization protect people</li>
          <li>Three case studies where AI systems did exactly what they were optimized to do — and caused harm</li>
          <li>How responsibility distributes across engineers, teams, companies, and regulators</li>
          <li>How the entire internet runs on hundreds of millions of lines of freely given code</li>
          <li>How the ACM Code of Ethics connects every principle to the technical layers you built</li>
        </ul>
      </div>

      <div className="lesson-steps" role="tablist" aria-label="Lesson steps">
        {steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === idx}
            className={`lesson-step-tab ${i === idx ? 'is-active' : ''} ${i < idx || (chapterDone && i <= 6) ? 'is-done' : ''}`}
            onClick={() => {
              if (i <= maxReach) setIdx(Math.min(i, 6))
            }}
            disabled={i > maxReach}
          >
            <span className="lesson-step-number">{i + 1}</span>
            <span className="lesson-step-label">{s.title}</span>
          </button>
        ))}
      </div>

      {celebrate && (
        <div className="lesson-banner lesson-banner--success">
          You have completed the full stack. The <strong>robot arm</strong> is yours.
        </div>
      )}

      <div className="lesson-content">
        {idx === 7 && (
          <div className="lesson-complete-msg">
            <p className="lede">
              <strong>You have climbed the full stack.</strong>
            </p>
            <p>
              From logic gates to ethics — every layer connects to the one below it. The robot arm in{' '}
              <strong>Devices</strong> is your reward. Pick any step above to replay.
            </p>
          </div>
        )}

        {idx === 0 && (
          <EthScale
            onComplete={() => {
              if (chapterDone) setIdx(1)
              else setMomentId('eth-0')
            }}
          />
        )}
        {idx === 1 && (
          <EthBias
            onComplete={() => {
              if (chapterDone) setIdx(2)
              else setMomentId('eth-1')
            }}
          />
        )}
        {idx === 2 && (
          <EthPrivacy
            onComplete={() => {
              if (chapterDone) setIdx(3)
              else setMomentId('eth-2')
            }}
          />
        )}
        {idx === 3 && (
          <EthAiSafety
            onComplete={() => {
              if (chapterDone) setIdx(4)
              else setMomentId('eth-3')
            }}
          />
        )}
        {idx === 4 && (
          <EthAccountability
            onComplete={() => {
              if (chapterDone) setIdx(5)
              else setMomentId('eth-4')
            }}
          />
        )}
        {idx === 5 && (
          <EthOpenSource
            onComplete={() => {
              if (chapterDone) setIdx(6)
              else setMomentId('eth-5')
            }}
          />
        )}
        {idx === 6 && (
          <EthAcm
            onComplete={() => {
              if (chapterDone) setIdx(7)
              else setMomentId('eth-6')
            }}
          />
        )}
      </div>

      {chapterDone && (
        <div className="lesson-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            <li>Scale does not change the nature of a system — it amplifies it</li>
            <li>Algorithmic bias is not intentional; it is historical bias encoded in data</li>
            <li>Privacy is a design choice, not an afterthought — minimize, pseudonymize, and add noise before you store</li>
            <li>AI systems do exactly what they are optimized for — the harm comes from incomplete objective functions</li>
            <li>Responsibility is distributed across engineers, teams, companies, and regulators — distributing it does not reduce it</li>
            <li>The internet runs on open source; you owe it forward</li>
            <li>The ethics are not separate from the engineering — they are the same thing, seen from the person it affects</li>
          </ul>
        </div>
      )}

      <LessonNav
        prev={{ label: 'Machine intelligence', to: '/learn/llm' }}
      />
    </div>
  )
}
