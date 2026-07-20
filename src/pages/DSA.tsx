import type React from 'react'
import { useState } from 'react'
import { ConnectionMoment } from '../components/ConnectionMoment'
import { DsaArrayList } from '../components/lesson/DsaArrayList'
import { DsaTree } from '../components/lesson/DsaTree'
import { DsaHash } from '../components/lesson/DsaHash'
import { DsaSorting } from '../components/lesson/DsaSorting'
import { DsaGraph } from '../components/lesson/DsaGraph'
import { DsaHeap } from '../components/lesson/DsaHeap'
import { DsaAVL } from '../components/lesson/DsaAVL'
import { DsaTrie } from '../components/lesson/DsaTrie'
import { DsaUnionFind } from '../components/lesson/DsaUnionFind'
import { DsaGreedy } from '../components/lesson/DsaGreedy'
import { DsaDijkstra } from '../components/lesson/DsaDijkstra'
import { DsaDpIntro } from '../components/lesson/DsaDpIntro'
import { DsaDpClassic } from '../components/lesson/DsaDpClassic'
import { DsaBigO } from '../components/lesson/DsaBigO'
import { DsaComplexity } from '../components/lesson/DsaComplexity'
import { DsaHalting } from '../components/lesson/DsaHalting'
import { LessonNav } from '../components/LessonNav'
import { CONNECTION_MOMENTS } from '../content/connectionMoments'
import { curriculum } from '../content/curriculum'
import { setStackCelebrate } from '../lib/stackCelebrate'
import { LessonRestartControl } from '../components/LessonRestartControl'
import { completeLesson, loadProgress, mergeProgress } from '../lib/progress'

const chMeta = curriculum.chapters.find((c) => c.id === 'dsa')!
const lessonMeta = curriculum.lessons.find((l) => l.id === 'dsa-core')!
const steps = lessonMeta.steps

const TOTAL_STEPS = 16

type StepComponentType = React.ComponentType<{ onComplete: () => void }>

interface StepRendererProps {
  idx: number
  chapterDone: boolean
  stepComponents: readonly StepComponentType[]
  onCompleteStep: (nextIdx: number, momentKey: string) => void
}

function StepRenderer({ idx, chapterDone, stepComponents, onCompleteStep }: StepRendererProps) {
  const Comp = stepComponents[idx]
  const momentKey = `dsa-${idx}`
  const nextIdx = idx + 1 < TOTAL_STEPS ? idx + 1 : TOTAL_STEPS
  return <Comp onComplete={() => onCompleteStep(nextIdx, momentKey)} />
}

export function DSA() {
  const initial = loadProgress()
  const initialDone = initial.completedLessonIds.includes('dsa-core')
  const startIdx = initialDone ? TOTAL_STEPS : Math.min(initial.dsaStepIndex, TOTAL_STEPS - 1)

  const [idx, setIdx] = useState(startIdx)
  const [chapterDone, setChapterDone] = useState(initialDone)
  const [maxReach, setMaxReach] = useState(() => {
    if (initialDone) return TOTAL_STEPS
    return Math.min(initial.dsaStepIndex, TOTAL_STEPS - 1)
  })
  const [celebrate, setCelebrate] = useState(initialDone)
  const [momentId, setMomentId] = useState<string | null>(null)

  const go = (next: number) => {
    mergeProgress({ dsaStepIndex: next })
    setMaxReach((m) => Math.max(m, next))
    setIdx(next)
  }

  const finishChapter = () => {
    setStackCelebrate('dsa', 'databases')
    completeLesson('dsa-core')
    mergeProgress({ dsaStepIndex: TOTAL_STEPS })
    setChapterDone(true)
    setCelebrate(true)
    setMaxReach(TOTAL_STEPS)
    setIdx(TOTAL_STEPS)
  }

  const moment = momentId ? CONNECTION_MOMENTS[momentId] : null

  const onMomentContinue = () => {
    const id = momentId
    setMomentId(null)
    if (id === 'dsa-0') go(1)
    else if (id === 'dsa-1') go(2)
    else if (id === 'dsa-2') go(3)
    else if (id === 'dsa-3') go(4)
    else if (id === 'dsa-4') go(5)
    else if (id === 'dsa-5') go(6)
    else if (id === 'dsa-6') go(7)
    else if (id === 'dsa-7') go(8)
    else if (id === 'dsa-8') go(9)
    else if (id === 'dsa-9') go(10)
    else if (id === 'dsa-10') go(11)
    else if (id === 'dsa-11') go(12)
    else if (id === 'dsa-12') go(13)
    else if (id === 'dsa-13') go(14)
    else if (id === 'dsa-14') go(15)
    else if (id === 'dsa-15') finishChapter()
  }

  const stepComponents: readonly StepComponentType[] = [
    DsaArrayList, DsaTree, DsaHash, DsaSorting, DsaGraph, DsaHeap,
    DsaAVL, DsaTrie, DsaUnionFind, DsaGreedy, DsaDijkstra,
    DsaDpIntro, DsaDpClassic, DsaBigO, DsaComplexity, DsaHalting,
  ]

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
          <span className="lesson-chapter-label">Chapter 9</span>
          <LessonRestartControl lessonId="dsa-core" lessonTitle={lessonMeta.title} />
        </div>
        <h1 className="lesson-title">{chMeta.title}</h1>
        <p className="lesson-description">{chMeta.summary}</p>
      </header>

      <div className="lesson-objectives">
        <h2>What you will learn</h2>
        <ul>
          <li>When to choose arrays vs linked lists based on operation costs</li>
          <li>How binary search trees, heaps, tries, and AVL trees work</li>
          <li>How hash tables achieve O(1) average lookup and handle collisions</li>
          <li>How sorting algorithms compare: O(n²) vs O(n log n)</li>
          <li>How BFS and DFS traverse graphs for shortest paths and dependency resolution</li>
          <li>How greedy algorithms and dynamic programming solve optimization problems</li>
          <li>What Big-O means, and why P vs NP and the halting problem set limits on computation</li>
        </ul>
      </div>

      <div className="lesson-steps dsa-steps-grid" role="tablist" aria-label="Lesson steps">
        {steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === idx}
            className={`lesson-step-tab ${i === idx ? 'is-active' : ''} ${i < idx || (chapterDone && i < TOTAL_STEPS) ? 'is-done' : ''}`}
            onClick={() => {
              if (i <= maxReach) setIdx(Math.min(i, TOTAL_STEPS - 1))
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
          Unlocked: <strong>Algorithm Visualizer in Devices</strong>. Nice work.
        </div>
      )}

      <div className="lesson-content">
        {idx === TOTAL_STEPS && (
          <div className="lesson-complete-msg">
            <p>
              Chapter complete. Open <strong>Devices</strong> to inspect your Algorithm Visualizer, or pick a step above
              to replay.
            </p>
          </div>
        )}

        {idx < TOTAL_STEPS && (
          <StepRenderer
            idx={idx}
            chapterDone={chapterDone}
            stepComponents={stepComponents}
            onCompleteStep={(nextIdx, momentKey) => {
              if (chapterDone) setIdx(nextIdx)
              else setMomentId(momentKey)
            }}
          />
        )}
      </div>

      {chapterDone && (
        <div className="lesson-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            <li>Arrays give O(1) access but O(n) insert/delete; linked lists flip those costs</li>
            <li>Balanced trees (AVL, B-tree) guarantee O(log n) operations by keeping height bounded</li>
            <li>Hash tables are O(1) on average — the birthday problem explains when collisions cascade</li>
            <li>Merge sort and its variants beat O(n²) sorts by exploiting divide-and-conquer</li>
            <li>BFS finds shortest paths; DFS finds depth structure — graphs model almost every system</li>
            <li>Greedy works when local-optimal choices lead to global-optimal; DP works when they do not</li>
            <li>P problems are tractable; NP-complete problems are believed intractable; the halting problem is provably impossible</li>
          </ul>
        </div>
      )}

      <LessonNav
        prev={{ label: 'Mathematics for CS', to: '/learn/math' }}
        next={{ label: 'Databases', to: '/learn/databases' }}
      />
    </div>
  )
}
