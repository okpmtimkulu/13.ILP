import { useState } from 'react'
import { ConnectionMoment } from '../components/ConnectionMoment'
import { LessonNav } from '../components/LessonNav'
import { CONNECTION_MOMENTS } from '../content/connectionMoments'
import { curriculum } from '../content/curriculum'
import { setStackCelebrate } from '../lib/stackCelebrate'
import { LessonRestartControl } from '../components/LessonRestartControl'
import { completeLesson, loadProgress, mergeProgress } from '../lib/progress'
import {
  CfoundElastic,
  CfoundModels,
  CfoundRegions,
  CfoundShared,
  CfoundTenant,
} from '../components/lesson/cloud/CloudFoundationsSteps'

const chMeta = curriculum.chapters.find((c) => c.id === 'cloud-foundations')!
const lessonMeta = curriculum.lessons.find((l) => l.id === 'cloud-foundations-core')!
const steps = lessonMeta.steps
const TOTAL = steps.length

export function CloudFoundations() {
  const initial = loadProgress()
  const initialDone = initial.completedLessonIds.includes('cloud-foundations-core')
  const startIdx = initialDone ? TOTAL : Math.min(initial.cloudFoundationsStepIndex, TOTAL - 1)

  const [idx, setIdx] = useState(startIdx)
  const [chapterDone, setChapterDone] = useState(initialDone)
  const [maxReach, setMaxReach] = useState(() => {
    if (initialDone) return TOTAL
    return Math.min(initial.cloudFoundationsStepIndex, TOTAL - 1)
  })
  const [celebrate, setCelebrate] = useState(initialDone)
  const [momentId, setMomentId] = useState<string | null>(null)

  const go = (next: number) => {
    mergeProgress({ cloudFoundationsStepIndex: next })
    setMaxReach((m) => Math.max(m, next))
    setIdx(next)
  }

  const finishChapter = () => {
    setStackCelebrate('cloud-foundations', 'cloud-identity')
    completeLesson('cloud-foundations-core')
    mergeProgress({ cloudFoundationsStepIndex: TOTAL })
    setChapterDone(true)
    setCelebrate(true)
    setMaxReach(TOTAL)
    setIdx(TOTAL)
  }

  const moment = momentId ? CONNECTION_MOMENTS[momentId] : null

  const advance = (fromIdx: number) => {
    if (chapterDone) {
      setIdx(fromIdx + 1)
    } else if (fromIdx < TOTAL - 1) {
      go(fromIdx + 1)
    } else {
      finishChapter()
    }
  }

  return (
    <div className="lesson-page">
      <ConnectionMoment
        open={!!moment}
        title={moment?.title ?? ''}
        body={moment?.body ?? ''}
        hook={moment?.hook}
        ctaLabel={moment?.cta ?? 'Continue'}
        onContinue={() => setMomentId(null)}
      />

      <header className="lesson-header">
        <div className="lesson-header-top">
          <span className="lesson-chapter-label">The Cloud</span>
          <LessonRestartControl lessonId="cloud-foundations-core" lessonTitle={lessonMeta.title} />
        </div>
        <h1 className="lesson-title">{chMeta.title}</h1>
        <p className="lesson-description">{chMeta.summary}</p>
      </header>

      <div className="lesson-objectives">
        <h2>What you will learn</h2>
        <ul>
          <li>How shared responsibility splits security and operations with the provider</li>
          <li>Why regions and availability zones exist and what they cost</li>
          <li>How IaaS, PaaS, and SaaS change what you operate</li>
          <li>How multi-tenant isolation works at a high level</li>
          <li>Why elasticity shifts the job from capacity planning to guardrails</li>
        </ul>
      </div>

      <div className="lesson-steps" role="tablist" aria-label="Lesson steps">
        {steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === idx}
            className={`lesson-step-tab ${i === idx ? 'is-active' : ''} ${i < idx || (chapterDone && i < TOTAL) ? 'is-done' : ''}`}
            onClick={() => {
              if (i <= maxReach) setIdx(Math.min(i, TOTAL - 1))
            }}
            disabled={i > maxReach}
          >
            <span className="lesson-step-number">{i + 1}</span>
            <span className="lesson-step-label">{s.title}</span>
          </button>
        ))}
      </div>

      {celebrate && (
        <div className="lesson-banner lesson-banner--success">Cloud foundations complete. Next: identity and access.</div>
      )}

      <div className="lesson-content">
        {idx === TOTAL && (
          <div className="lesson-complete-msg">
            <p>Chapter complete. Pick a step above to replay, or continue to identity and access.</p>
          </div>
        )}
        {idx === 0 && <CfoundShared onComplete={() => advance(0)} />}
        {idx === 1 && <CfoundRegions onComplete={() => advance(1)} />}
        {idx === 2 && <CfoundModels onComplete={() => advance(2)} />}
        {idx === 3 && <CfoundTenant onComplete={() => advance(3)} />}
        {idx === 4 && <CfoundElastic onComplete={() => advance(4)} />}
      </div>

      {chapterDone && (
        <div className="lesson-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            <li>The shared responsibility model defines who patches what — read it before production</li>
            <li>Regions and zones trade latency, cost, and failure isolation</li>
            <li>Service models trade control for speed; pick what your team can operate</li>
            <li>Tenant isolation is strong when configured correctly — and weak when it is not</li>
            <li>Elasticity needs budgets, quotas, and alerts — not just autoscaling rules</li>
          </ul>
        </div>
      )}

      <LessonNav
        prev={{ label: 'Distributed systems', to: '/learn/distributed' }}
        next={{ label: 'Identity and access in the cloud', to: '/learn/cloud-identity' }}
      />
    </div>
  )
}
