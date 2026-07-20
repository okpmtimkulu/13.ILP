import { useState } from 'react'
import { ConnectionMoment } from '../components/ConnectionMoment'
import { FundamentalsWhatIsComputer } from '../components/lesson/FundamentalsWhatIsComputer'
import { FundamentalsOnOffBits } from '../components/lesson/FundamentalsOnOffBits'
import { FundamentalsBitsOnWire } from '../components/lesson/FundamentalsBitsOnWire'
import { LessonNav } from '../components/LessonNav'
import { CONNECTION_MOMENTS } from '../content/connectionMoments'
import { curriculum } from '../content/curriculum'
import { setStackCelebrate } from '../lib/stackCelebrate'
import { LessonRestartControl } from '../components/LessonRestartControl'
import { completeLesson, loadProgress, mergeProgress } from '../lib/progress'

const chMeta = curriculum.chapters.find((c) => c.id === 'fundamentals')!
const lessonMeta = curriculum.lessons.find((l) => l.id === 'fundamentals-start')!
const steps = lessonMeta.steps

export function FundamentalsPage() {
  const initial = loadProgress()
  const initialDone = initial.completedLessonIds.includes('fundamentals-start')
  const startIdx = initialDone ? 3 : Math.min(initial.fundamentalsStepIndex, 2)

  const [idx, setIdx] = useState(startIdx)
  const [chapterDone, setChapterDone] = useState(initialDone)
  const [maxReach, setMaxReach] = useState(() => {
    if (initialDone) return 3
    return Math.min(initial.fundamentalsStepIndex, 2)
  })
  const [celebrate, setCelebrate] = useState(initialDone)
  const [momentId, setMomentId] = useState<string | null>(null)

  const go = (next: number) => {
    mergeProgress({ fundamentalsStepIndex: next })
    setMaxReach((m) => Math.max(m, next))
    setIdx(next)
  }

  const finishChapter = () => {
    setStackCelebrate('fundamentals', 'foundations')
    completeLesson('fundamentals-start')
    mergeProgress({ fundamentalsStepIndex: 3 })
    setChapterDone(true)
    setCelebrate(true)
    setMaxReach(3)
    setIdx(3)
  }

  const moment = momentId ? CONNECTION_MOMENTS[momentId] : null

  const onMomentContinue = () => {
    const id = momentId
    setMomentId(null)
    if (id === 'fund-0') go(1)
    else if (id === 'fund-1') go(2)
    else if (id === 'fund-2') finishChapter()
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
          <span className="lesson-chapter-label">Chapter 1</span>
          <LessonRestartControl lessonId="fundamentals-start" lessonTitle={lessonMeta.title} />
        </div>
        <h1 className="lesson-title">{chMeta.title}</h1>
        <p className="lesson-description">{chMeta.summary}</p>
      </header>

      <div className="lesson-objectives">
        <h2>What you will learn</h2>
        <ul>
          <li>What a computer actually does, in plain language</li>
          <li>How ON and OFF become numbers</li>
          <li>How signals travel from one place to another</li>
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
          You completed this chapter. When you are ready, open <strong>Foundations</strong> to build logic gates and a tiny CPU.
        </div>
      )}

      <div className="lesson-content">
        {idx === 3 && (
          <div className="lesson-complete-msg">
            <p>You can replay any step above. Your progress is saved in this browser.</p>
          </div>
        )}

        {idx === 0 && (
          <FundamentalsWhatIsComputer
            onComplete={() => {
              if (chapterDone) setIdx(1)
              else setMomentId('fund-0')
            }}
          />
        )}
        {idx === 1 && (
          <FundamentalsOnOffBits
            onComplete={() => {
              if (chapterDone) setIdx(2)
              else setMomentId('fund-1')
            }}
          />
        )}
        {idx === 2 && (
          <FundamentalsBitsOnWire
            onComplete={() => {
              if (chapterDone) setIdx(3)
              else setMomentId('fund-2')
            }}
          />
        )}
      </div>

      {chapterDone && (
        <div className="lesson-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            <li>A computer takes input, processes it, and produces output — every time</li>
            <li>Binary (ON/OFF) is how machines store and count everything</li>
            <li>Eight bits make a byte, and bytes travel as electrical signals on wires</li>
          </ul>
        </div>
      )}

      <LessonNav
        next={{ label: 'From gates to fetch', to: '/learn/foundations' }}
      />
    </div>
  )
}
