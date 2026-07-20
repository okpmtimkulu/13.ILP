import { useState } from 'react'
import { ConnectionMoment } from '../components/ConnectionMoment'
import { CompSource } from '../components/lesson/CompSource'
import { CompLex } from '../components/lesson/CompLex'
import { CompParse } from '../components/lesson/CompParse'
import { CompAST } from '../components/lesson/CompAST'
import { CompCodegen } from '../components/lesson/CompCodegen'
import { CompOptimize } from '../components/lesson/CompOptimize'
import { LessonNav } from '../components/LessonNav'
import { CONNECTION_MOMENTS } from '../content/connectionMoments'
import { curriculum } from '../content/curriculum'
import { setStackCelebrate } from '../lib/stackCelebrate'
import { LessonRestartControl } from '../components/LessonRestartControl'
import { completeLesson, loadProgress, mergeProgress } from '../lib/progress'

const chMeta = curriculum.chapters.find((c) => c.id === 'compilers')!
const lessonMeta = curriculum.lessons.find((l) => l.id === 'compilers-core')!
const steps = lessonMeta.steps

export function Compilers() {
  const initial = loadProgress()
  const initialDone = initial.completedLessonIds.includes('compilers-core')
  const startIdx = initialDone ? 6 : Math.min(initial.compilersStepIndex, 5)

  const [idx, setIdx] = useState(startIdx)
  const [chapterDone, setChapterDone] = useState(initialDone)
  const [maxReach, setMaxReach] = useState(() => {
    if (initialDone) return 6
    return Math.min(initial.compilersStepIndex, 5)
  })
  const [celebrate, setCelebrate] = useState(initialDone)
  const [momentId, setMomentId] = useState<string | null>(null)

  const go = (next: number) => {
    mergeProgress({ compilersStepIndex: next })
    setMaxReach((m) => Math.max(m, next))
    setIdx(next)
  }

  const finishChapter = () => {
    setStackCelebrate('compilers', 'math')
    completeLesson('compilers-core')
    mergeProgress({ compilersStepIndex: 6 })
    setChapterDone(true)
    setCelebrate(true)
    setMaxReach(6)
    setIdx(6)
  }

  const moment = momentId ? CONNECTION_MOMENTS[momentId] : null

  const onMomentContinue = () => {
    const id = momentId
    setMomentId(null)
    if (id === 'comp-0') go(1)
    else if (id === 'comp-1') go(2)
    else if (id === 'comp-2') go(3)
    else if (id === 'comp-3') go(4)
    else if (id === 'comp-4') go(5)
    else if (id === 'comp-5') finishChapter()
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
          <span className="lesson-chapter-label">Chapter 7</span>
          <LessonRestartControl lessonId="compilers-core" lessonTitle={lessonMeta.title} />
        </div>
        <h1 className="lesson-title">{chMeta.title}</h1>
        <p className="lesson-description">{chMeta.summary}</p>
      </header>

      <div className="lesson-objectives">
        <h2>What you will learn</h2>
        <ul>
          <li>How source code becomes machine instructions through a pipeline</li>
          <li>How a lexer breaks characters into typed tokens</li>
          <li>How a parser enforces grammar and builds a tree</li>
          <li>How the AST is the true representation every tool works on</li>
          <li>How code generation walks the tree to emit instructions</li>
          <li>How optimizations like constant folding give free performance</li>
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
          Unlocked: <strong>Compiler Chip in Devices</strong>. Nice work.
        </div>
      )}

      <div className="lesson-content">
        {idx === 6 && (
          <div className="lesson-complete-msg">
            <p>
              Chapter complete. Open <strong>Devices</strong> to inspect your Compiler Chip, or pick a step above to
              replay.
            </p>
          </div>
        )}

        {idx === 0 && (
          <CompSource
            onComplete={() => {
              if (chapterDone) setIdx(1)
              else setMomentId('comp-0')
            }}
          />
        )}
        {idx === 1 && (
          <CompLex
            onComplete={() => {
              if (chapterDone) setIdx(2)
              else setMomentId('comp-1')
            }}
          />
        )}
        {idx === 2 && (
          <CompParse
            onComplete={() => {
              if (chapterDone) setIdx(3)
              else setMomentId('comp-2')
            }}
          />
        )}
        {idx === 3 && (
          <CompAST
            onComplete={() => {
              if (chapterDone) setIdx(4)
              else setMomentId('comp-3')
            }}
          />
        )}
        {idx === 4 && (
          <CompCodegen
            onComplete={() => {
              if (chapterDone) setIdx(5)
              else setMomentId('comp-4')
            }}
          />
        )}
        {idx === 5 && (
          <CompOptimize
            onComplete={() => {
              if (chapterDone) setIdx(6)
              else setMomentId('comp-5')
            }}
          />
        )}
      </div>

      {chapterDone && (
        <div className="lesson-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            <li>Compilers translate source code to machine instructions through a defined pipeline: lex → parse → AST → codegen → optimize</li>
            <li>The lexer converts raw characters into a stream of typed tokens, catching unknown symbols early</li>
            <li>The parser enforces grammar rules and builds a tree structure that represents the program's meaning</li>
            <li>Every IDE tool — linters, formatters, type checkers — operates on the AST, never on raw text</li>
            <li>Code generation walks the AST depth-first, emitting CPU instructions for each node</li>
            <li>Optimizations like constant folding and loop-invariant code motion give free speed without changing behavior</li>
          </ul>
        </div>
      )}

      <LessonNav
        prev={{ label: 'The web and protocols', to: '/learn/web' }}
        next={{ label: 'Programming paradigms', to: '/learn/paradigms' }}
      />
    </div>
  )
}
