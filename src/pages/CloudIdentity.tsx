import { useState } from 'react'
import { ConnectionMoment } from '../components/ConnectionMoment'
import { LessonNav } from '../components/LessonNav'
import { CONNECTION_MOMENTS } from '../content/connectionMoments'
import { curriculum } from '../content/curriculum'
import { setStackCelebrate } from '../lib/stackCelebrate'
import { LessonRestartControl } from '../components/LessonRestartControl'
import { completeLesson, loadProgress, mergeProgress } from '../lib/progress'
import {
  CidentFederation,
  CidentPolicies,
  CidentRoles,
  CidentSecrets,
  CidentSubjects,
} from '../components/lesson/cloud/CloudIdentitySteps'

const chMeta = curriculum.chapters.find((c) => c.id === 'cloud-identity')!
const lessonMeta = curriculum.lessons.find((l) => l.id === 'cloud-identity-core')!
const steps = lessonMeta.steps
const TOTAL = steps.length

export function CloudIdentity() {
  const initial = loadProgress()
  const initialDone = initial.completedLessonIds.includes('cloud-identity-core')
  const startIdx = initialDone ? TOTAL : Math.min(initial.cloudIdentityStepIndex, TOTAL - 1)

  const [idx, setIdx] = useState(startIdx)
  const [chapterDone, setChapterDone] = useState(initialDone)
  const [maxReach, setMaxReach] = useState(() => {
    if (initialDone) return TOTAL
    return Math.min(initial.cloudIdentityStepIndex, TOTAL - 1)
  })
  const [celebrate, setCelebrate] = useState(initialDone)
  const [momentId, setMomentId] = useState<string | null>(null)

  const go = (next: number) => {
    mergeProgress({ cloudIdentityStepIndex: next })
    setMaxReach((m) => Math.max(m, next))
    setIdx(next)
  }

  const finishChapter = () => {
    setStackCelebrate('cloud-identity', 'cloud-networking')
    completeLesson('cloud-identity-core')
    mergeProgress({ cloudIdentityStepIndex: TOTAL })
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
          <LessonRestartControl lessonId="cloud-identity-core" lessonTitle={lessonMeta.title} />
        </div>
        <h1 className="lesson-title">{chMeta.title}</h1>
        <p className="lesson-description">{chMeta.summary}</p>
      </header>

      <div className="lesson-objectives">
        <h2>What you will learn</h2>
        <ul>
          <li>How principals and resources frame every permission decision</li>
          <li>Why roles and temporary credentials beat long-lived keys</li>
          <li>How policies express allow and deny in a reviewable way</li>
          <li>How federation connects corporate identity to the cloud</li>
          <li>Why secrets need their own lifecycle and rotation</li>
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
        <div className="lesson-banner lesson-banner--success">Identity chapter complete. Next: networking in the cloud.</div>
      )}

      <div className="lesson-content">
        {idx === TOTAL && (
          <div className="lesson-complete-msg">
            <p>Chapter complete. Pick a step above to replay, or continue to cloud networking.</p>
          </div>
        )}
        {idx === 0 && <CidentSubjects onComplete={() => advance(0)} />}
        {idx === 1 && <CidentRoles onComplete={() => advance(1)} />}
        {idx === 2 && <CidentPolicies onComplete={() => advance(2)} />}
        {idx === 3 && <CidentFederation onComplete={() => advance(3)} />}
        {idx === 4 && <CidentSecrets onComplete={() => advance(4)} />}
      </div>

      {chapterDone && (
        <div className="lesson-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            <li>Every API call is a principal acting on a resource — design permissions from that model</li>
            <li>Roles and workload identity reduce the need for static keys in code</li>
            <li>Policies as code enable review and least privilege at scale</li>
            <li>Federation connects SSO lifecycle to cloud access</li>
            <li>Secrets require rotation, audit, and separation from normal configuration</li>
          </ul>
        </div>
      )}

      <LessonNav
        prev={{ label: 'Cloud foundations', to: '/learn/cloud-foundations' }}
        next={{ label: 'Networking in the cloud', to: '/learn/cloud-networking' }}
      />
    </div>
  )
}
