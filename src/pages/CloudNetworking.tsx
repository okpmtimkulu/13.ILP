import { useState } from 'react'
import { ConnectionMoment } from '../components/ConnectionMoment'
import { LessonNav } from '../components/LessonNav'
import { CONNECTION_MOMENTS } from '../content/connectionMoments'
import { curriculum } from '../content/curriculum'
import { setStackCelebrate } from '../lib/stackCelebrate'
import { LessonRestartControl } from '../components/LessonRestartControl'
import { completeLesson, loadProgress, mergeProgress } from '../lib/progress'
import {
  CnetEdge,
  CnetLb,
  CnetSegment,
  CnetSubnets,
  CnetVpc,
} from '../components/lesson/cloud/CloudNetworkingSteps'

const chMeta = curriculum.chapters.find((c) => c.id === 'cloud-networking')!
const lessonMeta = curriculum.lessons.find((l) => l.id === 'cloud-networking-core')!
const steps = lessonMeta.steps
const TOTAL = steps.length

export function CloudNetworking() {
  const initial = loadProgress()
  const initialDone = initial.completedLessonIds.includes('cloud-networking-core')
  const startIdx = initialDone ? TOTAL : Math.min(initial.cloudNetworkingStepIndex, TOTAL - 1)

  const [idx, setIdx] = useState(startIdx)
  const [chapterDone, setChapterDone] = useState(initialDone)
  const [maxReach, setMaxReach] = useState(() => {
    if (initialDone) return TOTAL
    return Math.min(initial.cloudNetworkingStepIndex, TOTAL - 1)
  })
  const [celebrate, setCelebrate] = useState(initialDone)
  const [momentId, setMomentId] = useState<string | null>(null)

  const go = (next: number) => {
    mergeProgress({ cloudNetworkingStepIndex: next })
    setMaxReach((m) => Math.max(m, next))
    setIdx(next)
  }

  const finishChapter = () => {
    setStackCelebrate('cloud-networking', 'cloud-production')
    completeLesson('cloud-networking-core')
    mergeProgress({ cloudNetworkingStepIndex: TOTAL })
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
          <LessonRestartControl lessonId="cloud-networking-core" lessonTitle={lessonMeta.title} />
        </div>
        <h1 className="lesson-title">{chMeta.title}</h1>
        <p className="lesson-description">{chMeta.summary}</p>
      </header>

      <div className="lesson-objectives">
        <h2>What you will learn</h2>
        <ul>
          <li>How a virtual private network isolates your address space</li>
          <li>How subnets and routes express intent and blast radius</li>
          <li>How load balancers and health checks connect to distributed patterns</li>
          <li>How TLS and ingress fit at the edge</li>
          <li>How segmentation layers identity, network, and application controls</li>
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
        <div className="lesson-banner lesson-banner--success">Cloud networking complete. Next: production patterns.</div>
      )}

      <div className="lesson-content">
        {idx === TOTAL && (
          <div className="lesson-complete-msg">
            <p>Chapter complete. Pick a step above to replay, or continue to production patterns.</p>
          </div>
        )}
        {idx === 0 && <CnetVpc onComplete={() => advance(0)} />}
        {idx === 1 && <CnetSubnets onComplete={() => advance(1)} />}
        {idx === 2 && <CnetLb onComplete={() => advance(2)} />}
        {idx === 3 && <CnetEdge onComplete={() => advance(3)} />}
        {idx === 4 && <CnetSegment onComplete={() => advance(4)} />}
      </div>

      {chapterDone && (
        <div className="lesson-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            <li>The VPC is the same IP and routing ideas as on-prem — expressed as APIs</li>
            <li>Subnets and routing tables encode which traffic is allowed to flow</li>
            <li>Load balancers and health checks operationalize redundancy</li>
            <li>TLS termination at the edge is still the HTTPS story — managed as infrastructure</li>
            <li>Segmentation stacks identity, network, and app-level controls</li>
          </ul>
        </div>
      )}

      <LessonNav
        prev={{ label: 'Identity and access in the cloud', to: '/learn/cloud-identity' }}
        next={{ label: 'Production patterns', to: '/learn/cloud-production' }}
      />
    </div>
  )
}
