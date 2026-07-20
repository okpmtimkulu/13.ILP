import { useState } from 'react'
import { ConnectionMoment } from '../components/ConnectionMoment'
import { LessonNav } from '../components/LessonNav'
import { CONNECTION_MOMENTS } from '../content/connectionMoments'
import { curriculum } from '../content/curriculum'
import { setStackCelebrate } from '../lib/stackCelebrate'
import { LessonRestartControl } from '../components/LessonRestartControl'
import { completeLesson, loadProgress, mergeProgress } from '../lib/progress'
import {
  CprodCompute,
  CprodObserve,
  CprodResilience,
  CprodScale,
  CprodStorage,
} from '../components/lesson/cloud/CloudProductionSteps'

const chMeta = curriculum.chapters.find((c) => c.id === 'cloud-production')!
const lessonMeta = curriculum.lessons.find((l) => l.id === 'cloud-production-core')!
const steps = lessonMeta.steps
const TOTAL = steps.length

export function CloudProduction() {
  const initial = loadProgress()
  const initialDone = initial.completedLessonIds.includes('cloud-production-core')
  const startIdx = initialDone ? TOTAL : Math.min(initial.cloudProductionStepIndex, TOTAL - 1)

  const [idx, setIdx] = useState(startIdx)
  const [chapterDone, setChapterDone] = useState(initialDone)
  const [maxReach, setMaxReach] = useState(() => {
    if (initialDone) return TOTAL
    return Math.min(initial.cloudProductionStepIndex, TOTAL - 1)
  })
  const [celebrate, setCelebrate] = useState(initialDone)
  const [momentId, setMomentId] = useState<string | null>(null)

  const go = (next: number) => {
    mergeProgress({ cloudProductionStepIndex: next })
    setMaxReach((m) => Math.max(m, next))
    setIdx(next)
  }

  const finishChapter = () => {
    setStackCelebrate('cloud-production', 'mathcs')
    completeLesson('cloud-production-core')
    mergeProgress({ cloudProductionStepIndex: TOTAL })
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
          <LessonRestartControl lessonId="cloud-production-core" lessonTitle={lessonMeta.title} />
        </div>
        <h1 className="lesson-title">{chMeta.title}</h1>
        <p className="lesson-description">{chMeta.summary}</p>
      </header>

      <div className="lesson-objectives">
        <h2>What you will learn</h2>
        <ul>
          <li>How VMs, containers, and serverless differ in what you operate</li>
          <li>How object, block, and managed data services map to workloads</li>
          <li>How logs, metrics, and traces work together in production</li>
          <li>How autoscaling interacts with quotas and budgets</li>
          <li>How failure domains and backups define real resilience</li>
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
        <div className="lesson-banner lesson-banner--success">
          Production patterns complete. Continue to the Data track — math for computer science.
        </div>
      )}

      <div className="lesson-content">
        {idx === TOTAL && (
          <div className="lesson-complete-msg">
            <p>Chapter complete. Pick a step above to replay, or continue to mathematics for CS.</p>
          </div>
        )}
        {idx === 0 && <CprodCompute onComplete={() => advance(0)} />}
        {idx === 1 && <CprodStorage onComplete={() => advance(1)} />}
        {idx === 2 && <CprodObserve onComplete={() => advance(2)} />}
        {idx === 3 && <CprodScale onComplete={() => advance(3)} />}
        {idx === 4 && <CprodResilience onComplete={() => advance(4)} />}
      </div>

      {chapterDone && (
        <div className="lesson-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            <li>Compute choice is an operational tradeoff — not a popularity contest</li>
            <li>Storage classes match durability and cost to access patterns</li>
            <li>Observability is three pillars plus correlation across services</li>
            <li>Scaling without quotas and budgets invites cost and outage surprises</li>
            <li>Resilience is tested restores and explicit failure domains — not hope</li>
          </ul>
        </div>
      )}

      <LessonNav
        prev={{ label: 'Networking in the cloud', to: '/learn/cloud-networking' }}
        next={{ label: 'Math for computer science', to: '/learn/math' }}
      />
    </div>
  )
}
