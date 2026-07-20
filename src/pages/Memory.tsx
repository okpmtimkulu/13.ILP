import { useState } from 'react'
import { ConnectionMoment } from '../components/ConnectionMoment'
import { LessonNav } from '../components/LessonNav'
import { CONNECTION_MOMENTS } from '../content/connectionMoments'
import { curriculum } from '../content/curriculum'
import { setStackCelebrate } from '../lib/stackCelebrate'
import { LessonRestartControl } from '../components/LessonRestartControl'
import { completeLesson, loadProgress, mergeProgress } from '../lib/progress'
import { MemRegisters } from '../components/lesson/MemRegisters'
import { MemCache } from '../components/lesson/MemCache'
import { MemHierarchy } from '../components/lesson/MemHierarchy'
import { MemEviction } from '../components/lesson/MemEviction'
import { MemVirtual } from '../components/lesson/MemVirtual'
import { MemPaging } from '../components/lesson/MemPaging'

const chMeta = curriculum.chapters.find((c) => c.id === 'memory')!
const lessonMeta = curriculum.lessons.find((l) => l.id === 'memory-hierarchy')!
const steps = lessonMeta.steps

export function Memory() {
  const initial = loadProgress()
  const initialDone = initial.completedLessonIds.includes('memory-hierarchy')
  const startIdx = initialDone ? 6 : Math.min(initial.memoryStepIndex, 5)

  const [idx, setIdx] = useState(startIdx)
  const [chapterDone, setChapterDone] = useState(initialDone)
  const [maxReach, setMaxReach] = useState(() => {
    if (initialDone) return 6
    return Math.min(initial.memoryStepIndex, 5)
  })
  const [celebrate, setCelebrate] = useState(initialDone)
  const [momentId, setMomentId] = useState<string | null>(null)

  const go = (next: number) => {
    mergeProgress({ memoryStepIndex: next })
    setMaxReach((m) => Math.max(m, next))
    setIdx(next)
  }

  const finishChapter = () => {
    setStackCelebrate('memory', 'os')
    completeLesson('memory-hierarchy')
    mergeProgress({ memoryStepIndex: 6 })
    setChapterDone(true)
    setCelebrate(true)
    setMaxReach(6)
    setIdx(6)
  }

  const moment = momentId ? CONNECTION_MOMENTS[momentId] : null

  const onMomentContinue = () => {
    const id = momentId
    setMomentId(null)
    if (id === 'mem-0') go(1)
    else if (id === 'mem-1') go(2)
    else if (id === 'mem-2') go(3)
    else if (id === 'mem-3') go(4)
    else if (id === 'mem-4') go(5)
    else if (id === 'mem-5') finishChapter()
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
          <span className="lesson-chapter-label">Chapter 5</span>
          <LessonRestartControl lessonId="memory-hierarchy" lessonTitle={lessonMeta.title} />
        </div>
        <h1 className="lesson-title">{chMeta.title}</h1>
        <p className="lesson-description">{chMeta.summary}</p>
      </header>

      <div className="lesson-objectives">
        <h2>What you will learn</h2>
        <ul>
          <li>How registers and the ALU perform arithmetic at zero latency</li>
          <li>How a direct-mapped cache stores and retrieves data by address</li>
          <li>Why the memory hierarchy trades speed for size at every level</li>
          <li>How LRU eviction decides which cache line to replace</li>
          <li>How the MMU translates virtual addresses to physical ones</li>
          <li>How paging places process pages into physical frames and why the TLB speeds it up</li>
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
          Unlocked in <strong>Devices</strong>: SSD Board. Your memory hierarchy is complete.
        </div>
      )}

      <div className="lesson-content">
        {idx === 6 && (
          <div className="lesson-complete-msg">
            <p>
              Chapter complete. Open <strong>Devices</strong> to inspect your new SSD Board, or pick a step above to
              replay.
            </p>
          </div>
        )}

        {idx === 0 && (
          <MemRegisters
            onComplete={() => {
              if (chapterDone) setIdx(1)
              else setMomentId('mem-0')
            }}
          />
        )}
        {idx === 1 && (
          <MemCache
            onComplete={() => {
              if (chapterDone) setIdx(2)
              else setMomentId('mem-1')
            }}
          />
        )}
        {idx === 2 && (
          <MemHierarchy
            onComplete={() => {
              if (chapterDone) setIdx(3)
              else setMomentId('mem-2')
            }}
          />
        )}
        {idx === 3 && (
          <MemEviction
            onComplete={() => {
              if (chapterDone) setIdx(4)
              else setMomentId('mem-3')
            }}
          />
        )}
        {idx === 4 && (
          <MemVirtual
            onComplete={() => {
              if (chapterDone) setIdx(5)
              else setMomentId('mem-4')
            }}
          />
        )}
        {idx === 5 && (
          <MemPaging
            onComplete={() => {
              if (chapterDone) setIdx(6)
              else setMomentId('mem-5')
            }}
          />
        )}
      </div>

      {chapterDone && (
        <div className="lesson-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            <li>Registers are inside the chip — nanosecond access with no bus overhead</li>
            <li>Caches exploit spatial and temporal locality to hide the latency of slower RAM</li>
            <li>The memory hierarchy is a cost-speed tradeoff that every program navigates invisibly</li>
            <li>LRU eviction bets on the future using the past — the simplest policy that works well in practice</li>
            <li>Virtual memory lets every process believe it owns all of address space; the MMU translates silently</li>
            <li>The TLB caches page-table lookups so address translation costs nanoseconds, not microseconds</li>
          </ul>
        </div>
      )}

      <LessonNav
        prev={{ label: 'Building with logic', to: '/learn/foundations' }}
        next={{ label: 'Operating systems', to: '/learn/os' }}
      />
    </div>
  )
}
