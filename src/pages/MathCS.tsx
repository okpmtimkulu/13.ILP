import { useState } from 'react'
import { ConnectionMoment } from '../components/ConnectionMoment'
import { MathLogic } from '../components/lesson/MathLogic'
import { MathProof } from '../components/lesson/MathProof'
import { MathSets } from '../components/lesson/MathSets'
import { MathCounting } from '../components/lesson/MathCounting'
import { MathModular } from '../components/lesson/MathModular'
import { MathProb } from '../components/lesson/MathProb'
import { MathLinalg } from '../components/lesson/MathLinalg'
import { LessonNav } from '../components/LessonNav'
import { CONNECTION_MOMENTS } from '../content/connectionMoments'
import { curriculum } from '../content/curriculum'
import { setStackCelebrate } from '../lib/stackCelebrate'
import { LessonRestartControl } from '../components/LessonRestartControl'
import { completeLesson, loadProgress, mergeProgress } from '../lib/progress'

const chMeta = curriculum.chapters.find((c) => c.id === 'mathcs')!
const lessonMeta = curriculum.lessons.find((l) => l.id === 'math-foundations')!
const steps = lessonMeta.steps

export function MathCS() {
  const initial = loadProgress()
  const initialDone = initial.completedLessonIds.includes('math-foundations')
  const startIdx = initialDone ? 7 : Math.min(initial.mathStepIndex, 6)

  const [idx, setIdx] = useState(startIdx)
  const [chapterDone, setChapterDone] = useState(initialDone)
  const [maxReach, setMaxReach] = useState(() => {
    if (initialDone) return 7
    return Math.min(initial.mathStepIndex, 6)
  })
  const [celebrate, setCelebrate] = useState(initialDone)
  const [momentId, setMomentId] = useState<string | null>(null)

  const go = (next: number) => {
    mergeProgress({ mathStepIndex: next })
    setMaxReach((m) => Math.max(m, next))
    setIdx(next)
  }

  const finishChapter = () => {
    setStackCelebrate('math', 'dsa')
    completeLesson('math-foundations')
    mergeProgress({ mathStepIndex: 7 })
    setChapterDone(true)
    setCelebrate(true)
    setMaxReach(7)
    setIdx(7)
  }

  const moment = momentId ? CONNECTION_MOMENTS[momentId] : null

  const onMomentContinue = () => {
    const id = momentId
    setMomentId(null)
    if (id === 'math-0') go(1)
    else if (id === 'math-1') go(2)
    else if (id === 'math-2') go(3)
    else if (id === 'math-3') go(4)
    else if (id === 'math-4') go(5)
    else if (id === 'math-5') go(6)
    else if (id === 'math-6') finishChapter()
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
          <span className="lesson-chapter-label">Chapter 8</span>
          <LessonRestartControl lessonId="math-foundations" lessonTitle={lessonMeta.title} />
        </div>
        <h1 className="lesson-title">{chMeta.title}</h1>
        <p className="lesson-description">{chMeta.summary}</p>
      </header>

      <div className="lesson-objectives">
        <h2>What you will learn</h2>
        <ul>
          <li>How propositional logic and truth tables formalize decisions</li>
          <li>How mathematical induction proves algorithms correct</li>
          <li>How sets, relations, and functions underpin type systems and databases</li>
          <li>How counting and combinatorics quantify password strength and probability</li>
          <li>How modular arithmetic powers cryptographic systems</li>
          <li>How probability explains hash collision and Bayes theorem</li>
          <li>How linear algebra underpins transformers and graphics</li>
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
          Unlocked: <strong>Math Engine in Devices</strong>. Nice work.
        </div>
      )}

      <div className="lesson-content">
        {idx === 7 && (
          <div className="lesson-complete-msg">
            <p>
              Chapter complete. Open <strong>Devices</strong> to inspect your Math Engine, or pick a step above to
              replay.
            </p>
          </div>
        )}

        {idx === 0 && (
          <MathLogic
            onComplete={() => {
              if (chapterDone) setIdx(1)
              else setMomentId('math-0')
            }}
          />
        )}
        {idx === 1 && (
          <MathProof
            onComplete={() => {
              if (chapterDone) setIdx(2)
              else setMomentId('math-1')
            }}
          />
        )}
        {idx === 2 && (
          <MathSets
            onComplete={() => {
              if (chapterDone) setIdx(3)
              else setMomentId('math-2')
            }}
          />
        )}
        {idx === 3 && (
          <MathCounting
            onComplete={() => {
              if (chapterDone) setIdx(4)
              else setMomentId('math-3')
            }}
          />
        )}
        {idx === 4 && (
          <MathModular
            onComplete={() => {
              if (chapterDone) setIdx(5)
              else setMomentId('math-4')
            }}
          />
        )}
        {idx === 5 && (
          <MathProb
            onComplete={() => {
              if (chapterDone) setIdx(6)
              else setMomentId('math-5')
            }}
          />
        )}
        {idx === 6 && (
          <MathLinalg
            onComplete={() => {
              if (chapterDone) setIdx(7)
              else setMomentId('math-6')
            }}
          />
        )}
      </div>

      {chapterDone && (
        <div className="lesson-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            <li>Logic gates from Layer 1 are hardware implementing the same AND/OR/NOT you proved in truth tables</li>
            <li>Induction is how you prove an algorithm is correct for all n — not just the cases you tested</li>
            <li>Sets define types in type systems, tables in databases, and key spaces in cryptography</li>
            <li>Combinatorics lets you calculate exactly how many combinations a password or hash space contains</li>
            <li>Modular arithmetic is the math inside every cryptographic system — RSA, AES, and elliptic curves all run on it</li>
            <li>Probability explains why O(1) hash tables are really "O(1) on average" — and when they are not</li>
            <li>Linear algebra — vectors, matrices, dot products — is what every transformer and neural network computes at its core</li>
          </ul>
        </div>
      )}

      <LessonNav
        prev={{ label: 'Production patterns', to: '/learn/cloud-production' }}
        next={{ label: 'Data structures and algorithms', to: '/learn/dsa' }}
      />
    </div>
  )
}
