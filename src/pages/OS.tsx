import { useState } from 'react'
import { ConnectionMoment } from '../components/ConnectionMoment'
import { LessonNav } from '../components/LessonNav'
import { CONNECTION_MOMENTS } from '../content/connectionMoments'
import { curriculum } from '../content/curriculum'
import { setStackCelebrate } from '../lib/stackCelebrate'
import { LessonRestartControl } from '../components/LessonRestartControl'
import { completeLesson, loadProgress, mergeProgress } from '../lib/progress'
import { OSProcess } from '../components/lesson/OSProcess'
import { OSScheduler } from '../components/lesson/OSScheduler'
import { OSFilesystem } from '../components/lesson/OSFilesystem'
import { OSSyscall } from '../components/lesson/OSSyscall'
import { OSThreads } from '../components/lesson/OSThreads'
import { OSMutex } from '../components/lesson/OSMutex'
import { OSDeadlock } from '../components/lesson/OSDeadlock'

const chMeta = curriculum.chapters.find((c) => c.id === 'os')!
const lessonMeta = curriculum.lessons.find((l) => l.id === 'os-core')!
const steps = lessonMeta.steps

export function OS() {
  const initial = loadProgress()
  const initialDone = initial.completedLessonIds.includes('os-core')
  const startIdx = initialDone ? 7 : Math.min(initial.osStepIndex, 6)

  const [idx, setIdx] = useState(startIdx)
  const [chapterDone, setChapterDone] = useState(initialDone)
  const [maxReach, setMaxReach] = useState(() => {
    if (initialDone) return 7
    return Math.min(initial.osStepIndex, 6)
  })
  const [celebrate, setCelebrate] = useState(initialDone)
  const [momentId, setMomentId] = useState<string | null>(null)

  const go = (next: number) => {
    mergeProgress({ osStepIndex: next })
    setMaxReach((m) => Math.max(m, next))
    setIdx(next)
  }

  const finishChapter = () => {
    setStackCelebrate('os', 'networks')
    completeLesson('os-core')
    mergeProgress({ osStepIndex: 7 })
    setChapterDone(true)
    setCelebrate(true)
    setMaxReach(7)
    setIdx(7)
  }

  const moment = momentId ? CONNECTION_MOMENTS[momentId] : null

  const onMomentContinue = () => {
    const id = momentId
    setMomentId(null)
    if (id === 'os-0') go(1)
    else if (id === 'os-1') go(2)
    else if (id === 'os-2') go(3)
    else if (id === 'os-3') go(4)
    else if (id === 'os-4') go(5)
    else if (id === 'os-5') go(6)
    else if (id === 'os-6') finishChapter()
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
          <span className="lesson-chapter-label">Chapter 6</span>
          <LessonRestartControl lessonId="os-core" lessonTitle={lessonMeta.title} />
        </div>
        <h1 className="lesson-title">{chMeta.title}</h1>
        <p className="lesson-description">{chMeta.summary}</p>
      </header>

      <div className="lesson-objectives">
        <h2>What you will learn</h2>
        <ul>
          <li>How the OS represents programs as processes with state machines</li>
          <li>How CPU scheduling algorithms decide who runs next</li>
          <li>How filesystems use inodes to track files independently of their names</li>
          <li>How system calls cross the user–kernel boundary safely</li>
          <li>How threads share memory and why that creates race conditions</li>
          <li>How mutexes prevent races — and how acquiring them out of order creates deadlock</li>
          <li>The four necessary conditions for deadlock and how to break each one</li>
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
          Unlocked in <strong>Devices</strong>: Retro Terminal. The kernel is yours.
        </div>
      )}

      <div className="lesson-content">
        {idx === 7 && (
          <div className="lesson-complete-msg">
            <p>
              Chapter complete. Open <strong>Devices</strong> to inspect your Retro Terminal, or pick a step above to
              replay.
            </p>
          </div>
        )}

        {idx === 0 && (
          <OSProcess
            onComplete={() => {
              if (chapterDone) setIdx(1)
              else setMomentId('os-0')
            }}
          />
        )}
        {idx === 1 && (
          <OSScheduler
            onComplete={() => {
              if (chapterDone) setIdx(2)
              else setMomentId('os-1')
            }}
          />
        )}
        {idx === 2 && (
          <OSFilesystem
            onComplete={() => {
              if (chapterDone) setIdx(3)
              else setMomentId('os-2')
            }}
          />
        )}
        {idx === 3 && (
          <OSSyscall
            onComplete={() => {
              if (chapterDone) setIdx(4)
              else setMomentId('os-3')
            }}
          />
        )}
        {idx === 4 && (
          <OSThreads
            onComplete={() => {
              if (chapterDone) setIdx(5)
              else setMomentId('os-4')
            }}
          />
        )}
        {idx === 5 && (
          <OSMutex
            onComplete={() => {
              if (chapterDone) setIdx(6)
              else setMomentId('os-5')
            }}
          />
        )}
        {idx === 6 && (
          <OSDeadlock
            onComplete={() => {
              if (chapterDone) setIdx(7)
              else setMomentId('os-6')
            }}
          />
        )}
      </div>

      {chapterDone && (
        <div className="lesson-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            <li>A process is a program in execution — the OS tracks its state, memory, and open files</li>
            <li>Scheduling algorithms decide fairness vs throughput; Linux CFS is a weighted fair-share hybrid</li>
            <li>Inodes store file metadata separately from filenames — deletion only removes the directory entry</li>
            <li>System calls are the only way for user code to request kernel services; the mode switch is the cost</li>
            <li>Threads share heap memory, which enables communication but requires synchronization</li>
            <li>A mutex protects a critical section; holding multiple locks without ordering discipline risks deadlock</li>
            <li>Deadlock requires all four conditions simultaneously — breaking any one prevents it</li>
          </ul>
        </div>
      )}

      <LessonNav
        prev={{ label: 'Memory and storage', to: '/learn/memory' }}
        next={{ label: 'Compilers and languages', to: '/learn/compilers' }}
      />
    </div>
  )
}
