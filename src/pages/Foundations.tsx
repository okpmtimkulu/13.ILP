import { useState } from 'react'
import { ConnectionMoment } from '../components/ConnectionMoment'
import { GatesLesson } from '../components/lesson/GatesLesson'
import { AdderLesson } from '../components/lesson/AdderLesson'
import { FetchDecodeLesson } from '../components/lesson/FetchDecodeLesson'
import { LessonNav } from '../components/LessonNav'
import { CONNECTION_MOMENTS } from '../content/connectionMoments'
import { curriculum } from '../content/curriculum'
import { setStackCelebrate } from '../lib/stackCelebrate'
import { LessonRestartControl } from '../components/LessonRestartControl'
import { completeLesson, loadProgress, mergeProgress } from '../lib/progress'

const chMeta = curriculum.chapters.find((c) => c.id === 'foundations')!
const lessonMeta = curriculum.lessons.find((l) => l.id === 'foundations-golden-path')!
const steps = lessonMeta.steps

export function Foundations() {
  const initial = loadProgress()
  const initialDone = initial.completedLessonIds.includes('foundations-golden-path')
  const startIdx = initialDone ? 3 : Math.min(initial.foundationsStepIndex, 2)

  const [idx, setIdx] = useState(startIdx)
  const [chapterDone, setChapterDone] = useState(initialDone)
  const [maxReach, setMaxReach] = useState(() => {
    if (initialDone) return 3
    return Math.min(initial.foundationsStepIndex, 2)
  })
  const [celebrate, setCelebrate] = useState(initialDone)
  const [momentId, setMomentId] = useState<string | null>(null)

  const go = (next: number) => {
    mergeProgress({ foundationsStepIndex: next })
    setMaxReach((m) => Math.max(m, next))
    setIdx(next)
  }

  const finishChapter = () => {
    setStackCelebrate('foundations', 'networks')
    completeLesson('foundations-golden-path')
    mergeProgress({ foundationsStepIndex: 3 })
    setChapterDone(true)
    setCelebrate(true)
    setMaxReach(3)
    setIdx(3)
  }

  const moment = momentId ? CONNECTION_MOMENTS[momentId] : null

  const onMomentContinue = () => {
    const id = momentId
    setMomentId(null)
    if (id === 'found-0') go(1)
    else if (id === 'found-1') go(2)
    else if (id === 'found-2') finishChapter()
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
          <span className="lesson-chapter-label">Chapter 2</span>
          <LessonRestartControl lessonId="foundations-golden-path" lessonTitle={lessonMeta.title} />
        </div>
        <h1 className="lesson-title">{chMeta.title}</h1>
        <p className="lesson-description">{chMeta.summary}</p>
      </header>

      <div className="lesson-objectives">
        <h2>What you will learn</h2>
        <ul>
          <li>How simple logic gates combine signals to make decisions</li>
          <li>How addition works at the circuit level with a full adder</li>
          <li>How a CPU fetches and decodes instructions one by one</li>
        </ul>
      </div>

      <div className="lesson-steps" role="tablist" aria-label="Lesson steps">
        {steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === idx}
            className={`lesson-step-tab ${i === idx ? 'is-active' : ''} ${i < idx || (chapterDone && i <= 2) ? 'is-done' : ''}`}
            onClick={() => {
              if (i <= maxReach) setIdx(Math.min(i, 2))
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
          Unlocked in <strong>Devices</strong>: Starter PC and a playful Vacuum-tube skin. Nice work.
        </div>
      )}

      <div className="lesson-content">
        {idx === 3 && (
          <div className="lesson-complete-msg">
            <p>
              Chapter complete. Open <strong>Devices</strong> to inspect your new machines, or pick a step above to
              replay.
            </p>
          </div>
        )}

        {idx === 0 && (
          <GatesLesson
            onComplete={() => {
              if (chapterDone) setIdx(1)
              else setMomentId('found-0')
            }}
          />
        )}
        {idx === 1 && (
          <AdderLesson
            onComplete={() => {
              if (chapterDone) setIdx(2)
              else setMomentId('found-1')
            }}
          />
        )}
        {idx === 2 && (
          <FetchDecodeLesson
            onComplete={() => {
              if (chapterDone) setIdx(3)
              else setMomentId('found-2')
            }}
          />
        )}
      </div>

      {chapterDone && (
        <div className="lesson-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            <li>Logic gates are the decision-makers — AND, OR, NOT combine simple signals into complex behavior</li>
            <li>A full adder chains gates to do arithmetic, the foundation of every calculation a CPU performs</li>
            <li>Fetch-decode-execute is the heartbeat of every processor — it never stops cycling</li>
          </ul>
        </div>
      )}

      <LessonNav
        prev={{ label: 'Start here: ideas and bits', to: '/learn/fundamentals' }}
        next={{ label: 'Memory and storage', to: '/learn/memory' }}
      />
    </div>
  )
}
