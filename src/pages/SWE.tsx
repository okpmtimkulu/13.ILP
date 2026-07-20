import { useState } from 'react'
import { ConnectionMoment } from '../components/ConnectionMoment'
import { SweGit } from '../components/lesson/SweGit'
import { SweTest } from '../components/lesson/SweTest'
import { SweTDD } from '../components/lesson/SweTDD'
import { SweSolid } from '../components/lesson/SweSolid'
import { SwePatterns } from '../components/lesson/SwePatterns'
import { SweCICD } from '../components/lesson/SweCICD'
import { SweDebug } from '../components/lesson/SweDebug'
import { LessonNav } from '../components/LessonNav'
import { CONNECTION_MOMENTS } from '../content/connectionMoments'
import { curriculum } from '../content/curriculum'
import { setStackCelebrate } from '../lib/stackCelebrate'
import { LessonRestartControl } from '../components/LessonRestartControl'
import { completeLesson, loadProgress, mergeProgress } from '../lib/progress'

const chMeta = curriculum.chapters.find((c) => c.id === 'swe')!
const lessonMeta = curriculum.lessons.find((l) => l.id === 'swe-core')!
const steps = lessonMeta.steps

export function SWE() {
  const initial = loadProgress()
  const initialDone = initial.completedLessonIds.includes('swe-core')
  const startIdx = initialDone ? 7 : Math.min(initial.sweStepIndex, 6)

  const [idx, setIdx] = useState(startIdx)
  const [chapterDone, setChapterDone] = useState(initialDone)
  const [maxReach, setMaxReach] = useState(() => {
    if (initialDone) return 7
    return Math.min(initial.sweStepIndex, 6)
  })
  const [celebrate, setCelebrate] = useState(initialDone)
  const [momentId, setMomentId] = useState<string | null>(null)

  const go = (next: number) => {
    mergeProgress({ sweStepIndex: next })
    setMaxReach((m) => Math.max(m, next))
    setIdx(next)
  }

  const finishChapter = () => {
    setStackCelebrate('swe', 'distributed')
    completeLesson('swe-core')
    mergeProgress({ sweStepIndex: 7 })
    setChapterDone(true)
    setCelebrate(true)
    setMaxReach(7)
    setIdx(7)
  }

  const moment = momentId ? CONNECTION_MOMENTS[momentId] : null

  const onMomentContinue = () => {
    const id = momentId
    setMomentId(null)
    if (id === 'swe-0') go(1)
    else if (id === 'swe-1') go(2)
    else if (id === 'swe-2') go(3)
    else if (id === 'swe-3') go(4)
    else if (id === 'swe-4') go(5)
    else if (id === 'swe-5') go(6)
    else if (id === 'swe-6') finishChapter()
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
          <span className="lesson-chapter-label">Chapter 13</span>
          <LessonRestartControl lessonId="swe-core" lessonTitle={lessonMeta.title} />
        </div>
        <h1 className="lesson-title">{chMeta.title}</h1>
        <p className="lesson-description">{chMeta.summary}</p>
      </header>

      <div className="lesson-objectives">
        <h2>What you will learn</h2>
        <ul>
          <li>How Git's commit graph tracks every change as a DAG</li>
          <li>How tests prove specific behaviors and catch regressions</li>
          <li>How writing tests first sharpens your design before you write code</li>
          <li>What the SOLID principles do to keep large codebases maintainable</li>
          <li>Three design patterns that appear in virtually every serious codebase</li>
          <li>How CI/CD pipelines automate quality gates from commit to production</li>
          <li>How binary search debugging narrows a bug's location exponentially</li>
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
          Unlocked: <strong>Developer Workstation</strong> in Devices.
        </div>
      )}

      <div className="lesson-content">
        {idx === 7 && (
          <div className="lesson-complete-msg">
            <p>
              Chapter complete. Open <strong>Devices</strong> to inspect your workstation, or pick a step above to
              replay.
            </p>
          </div>
        )}

        {idx === 0 && (
          <SweGit
            onComplete={() => {
              if (chapterDone) setIdx(1)
              else setMomentId('swe-0')
            }}
          />
        )}
        {idx === 1 && (
          <SweTest
            onComplete={() => {
              if (chapterDone) setIdx(2)
              else setMomentId('swe-1')
            }}
          />
        )}
        {idx === 2 && (
          <SweTDD
            onComplete={() => {
              if (chapterDone) setIdx(3)
              else setMomentId('swe-2')
            }}
          />
        )}
        {idx === 3 && (
          <SweSolid
            onComplete={() => {
              if (chapterDone) setIdx(4)
              else setMomentId('swe-3')
            }}
          />
        )}
        {idx === 4 && (
          <SwePatterns
            onComplete={() => {
              if (chapterDone) setIdx(5)
              else setMomentId('swe-4')
            }}
          />
        )}
        {idx === 5 && (
          <SweCICD
            onComplete={() => {
              if (chapterDone) setIdx(6)
              else setMomentId('swe-5')
            }}
          />
        )}
        {idx === 6 && (
          <SweDebug
            onComplete={() => {
              if (chapterDone) setIdx(7)
              else setMomentId('swe-6')
            }}
          />
        )}
      </div>

      {chapterDone && (
        <div className="lesson-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            <li>Git's commit graph is a DAG — the same structure from the DSA chapter</li>
            <li>A failing test is a proof; a passing test suite is evidence, not a guarantee</li>
            <li>Test-first thinking forces you to define the interface before the implementation</li>
            <li>SOLID principles are what let a codebase grow to 100K+ lines without collapsing under its own weight</li>
            <li>Design patterns are named solutions to recurring design problems — a shared vocabulary</li>
            <li>CI/CD replaces "works on my machine" with an automated, reproducible deployment pipeline</li>
            <li>Debugging is a binary search through program state — bisect, don't guess</li>
          </ul>
        </div>
      )}

      <LessonNav
        prev={{ label: 'Databases', to: '/learn/databases' }}
        next={{ label: 'Security and cryptography', to: '/learn/security' }}
      />
    </div>
  )
}
