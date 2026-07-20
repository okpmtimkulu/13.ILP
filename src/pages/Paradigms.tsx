import { useState } from 'react'
import { ConnectionMoment } from '../components/ConnectionMoment'
import { ParImperative } from '../components/lesson/ParImperative'
import { ParOop } from '../components/lesson/ParOop'
import { ParEncapsulation } from '../components/lesson/ParEncapsulation'
import { ParFunctional } from '../components/lesson/ParFunctional'
import { ParTypes } from '../components/lesson/ParTypes'
import { ParMemoryModel } from '../components/lesson/ParMemoryModel'
import { LessonNav } from '../components/LessonNav'
import { CONNECTION_MOMENTS } from '../content/connectionMoments'
import { curriculum } from '../content/curriculum'
import { setStackCelebrate } from '../lib/stackCelebrate'
import { LessonRestartControl } from '../components/LessonRestartControl'
import { completeLesson, loadProgress, mergeProgress } from '../lib/progress'

const chMeta = curriculum.chapters.find((c) => c.id === 'paradigms')!
const lessonMeta = curriculum.lessons.find((l) => l.id === 'paradigms-core')!
const steps = lessonMeta.steps

export function Paradigms() {
  const initial = loadProgress()
  const initialDone = initial.completedLessonIds.includes('paradigms-core')
  const startIdx = initialDone ? 6 : Math.min(initial.paradigmsStepIndex, 5)

  const [idx, setIdx] = useState(startIdx)
  const [chapterDone, setChapterDone] = useState(initialDone)
  const [maxReach, setMaxReach] = useState(() => {
    if (initialDone) return 6
    return Math.min(initial.paradigmsStepIndex, 5)
  })
  const [celebrate, setCelebrate] = useState(initialDone)
  const [momentId, setMomentId] = useState<string | null>(null)

  const go = (next: number) => {
    mergeProgress({ paradigmsStepIndex: next })
    setMaxReach((m) => Math.max(m, next))
    setIdx(next)
  }

  const finishChapter = () => {
    setStackCelebrate('paradigms', 'swe')
    completeLesson('paradigms-core')
    mergeProgress({ paradigmsStepIndex: 6 })
    setChapterDone(true)
    setCelebrate(true)
    setMaxReach(6)
    setIdx(6)
  }

  const moment = momentId ? CONNECTION_MOMENTS[momentId] : null

  const onMomentContinue = () => {
    const id = momentId
    setMomentId(null)
    if (id === 'par-0') go(1)
    else if (id === 'par-1') go(2)
    else if (id === 'par-2') go(3)
    else if (id === 'par-3') go(4)
    else if (id === 'par-4') go(5)
    else if (id === 'par-5') finishChapter()
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
          <span className="lesson-chapter-label">Chapter 12</span>
          <LessonRestartControl lessonId="paradigms-core" lessonTitle={lessonMeta.title} />
        </div>
        <h1 className="lesson-title">{chMeta.title}</h1>
        <p className="lesson-description">{chMeta.summary}</p>
      </header>

      <div className="lesson-objectives">
        <h2>What you will learn</h2>
        <ul>
          <li>How imperative programs tell the CPU exactly what to do, step by step</li>
          <li>How objects bundle data and behavior and inherit from each other</li>
          <li>Why encapsulation keeps object state always valid</li>
          <li>How functional programming transforms data without mutating it</li>
          <li>How type systems catch bugs before runtime</li>
          <li>How C, Java, and Rust manage memory with three fundamentally different strategies</li>
        </ul>
      </div>

      <div className="lesson-steps" role="tablist" aria-label="Lesson steps">
        {steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === idx}
            className={`lesson-step-tab ${i === idx ? 'is-active' : ''} ${i < idx || (chapterDone && i <= 5) ? 'is-done' : ''}`}
            onClick={() => {
              if (i <= maxReach) setIdx(Math.min(i, 5))
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
          Unlocked: <strong>Language Tower</strong> in Devices.
        </div>
      )}

      <div className="lesson-content">
        {idx === 6 && (
          <div className="lesson-complete-msg">
            <p>
              Chapter complete. Pick a step above to replay, or continue to Software Engineering.
            </p>
          </div>
        )}

        {idx === 0 && (
          <ParImperative
            onComplete={() => {
              if (chapterDone) setIdx(1)
              else setMomentId('par-0')
            }}
          />
        )}
        {idx === 1 && (
          <ParOop
            onComplete={() => {
              if (chapterDone) setIdx(2)
              else setMomentId('par-1')
            }}
          />
        )}
        {idx === 2 && (
          <ParEncapsulation
            onComplete={() => {
              if (chapterDone) setIdx(3)
              else setMomentId('par-2')
            }}
          />
        )}
        {idx === 3 && (
          <ParFunctional
            onComplete={() => {
              if (chapterDone) setIdx(4)
              else setMomentId('par-3')
            }}
          />
        )}
        {idx === 4 && (
          <ParTypes
            onComplete={() => {
              if (chapterDone) setIdx(5)
              else setMomentId('par-4')
            }}
          />
        )}
        {idx === 5 && (
          <ParMemoryModel
            onComplete={() => {
              if (chapterDone) setIdx(6)
              else setMomentId('par-5')
            }}
          />
        )}
      </div>

      {chapterDone && (
        <div className="lesson-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            <li>Imperative code describes how; functional code describes what — both compile to the same machine instructions</li>
            <li>Objects encapsulate state: the invariant is a contract the class maintains for all callers</li>
            <li>Map, filter, and reduce parallelize naturally because pure functions have no shared state</li>
            <li>Type systems shift entire categories of bugs from runtime to compile time</li>
            <li>C is manual, Java/Python are GC-managed, Rust is ownership-checked — each trades control for safety differently</li>
          </ul>
        </div>
      )}

      <LessonNav
        prev={{ label: 'Compilers and languages', to: '/learn/compilers' }}
        next={{ label: 'Network fundamentals', to: '/learn/networks' }}
      />
    </div>
  )
}
