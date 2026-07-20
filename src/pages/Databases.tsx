import { useState } from 'react'
import { ConnectionMoment } from '../components/ConnectionMoment'
import { DbBtree } from '../components/lesson/DbBtree'
import { DbQuery } from '../components/lesson/DbQuery'
import { DbTransaction } from '../components/lesson/DbTransaction'
import { DbAcid } from '../components/lesson/DbAcid'
import { DbIndex } from '../components/lesson/DbIndex'
import { DbNormalize } from '../components/lesson/DbNormalize'
import { DbNosql } from '../components/lesson/DbNosql'
import { LessonNav } from '../components/LessonNav'
import { CONNECTION_MOMENTS } from '../content/connectionMoments'
import { curriculum } from '../content/curriculum'
import { setStackCelebrate } from '../lib/stackCelebrate'
import { LessonRestartControl } from '../components/LessonRestartControl'
import { completeLesson, loadProgress, mergeProgress } from '../lib/progress'

const chMeta = curriculum.chapters.find((c) => c.id === 'databases')!
const lessonMeta = curriculum.lessons.find((l) => l.id === 'db-core')!
const steps = lessonMeta.steps

export function Databases() {
  const initial = loadProgress()
  const initialDone = initial.completedLessonIds.includes('db-core')
  const startIdx = initialDone ? 7 : Math.min(initial.databasesStepIndex, 6)

  const [idx, setIdx] = useState(startIdx)
  const [chapterDone, setChapterDone] = useState(initialDone)
  const [maxReach, setMaxReach] = useState(() => {
    if (initialDone) return 7
    return Math.min(initial.databasesStepIndex, 6)
  })
  const [celebrate, setCelebrate] = useState(initialDone)
  const [momentId, setMomentId] = useState<string | null>(null)

  const go = (next: number) => {
    mergeProgress({ databasesStepIndex: next })
    setMaxReach((m) => Math.max(m, next))
    setIdx(next)
  }

  const finishChapter = () => {
    setStackCelebrate('databases', 'distributed')
    completeLesson('db-core')
    mergeProgress({ databasesStepIndex: 7 })
    setChapterDone(true)
    setCelebrate(true)
    setMaxReach(7)
    setIdx(7)
  }

  const moment = momentId ? CONNECTION_MOMENTS[momentId] : null

  const onMomentContinue = () => {
    const id = momentId
    setMomentId(null)
    if (id === 'db-0') go(1)
    else if (id === 'db-1') go(2)
    else if (id === 'db-2') go(3)
    else if (id === 'db-3') go(4)
    else if (id === 'db-4') go(5)
    else if (id === 'db-5') go(6)
    else if (id === 'db-6') finishChapter()
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
          <span className="lesson-chapter-label">Chapter 10</span>
          <LessonRestartControl lessonId="db-core" lessonTitle={lessonMeta.title} />
        </div>
        <h1 className="lesson-title">{chMeta.title}</h1>
        <p className="lesson-description">{chMeta.summary}</p>
      </header>

      <div className="lesson-objectives">
        <h2>What you will learn</h2>
        <ul>
          <li>How B-trees store and retrieve data efficiently on disk</li>
          <li>How SQL queries are planned and executed</li>
          <li>Why transactions and ACID properties protect your data</li>
          <li>How indexes speed reads at the cost of writes</li>
          <li>How normalization eliminates update anomalies</li>
          <li>Where NoSQL databases outperform relational ones</li>
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
          Unlocked: <strong>Database Server</strong> in Devices.
        </div>
      )}

      <div className="lesson-content">
        {idx === 7 && (
          <div className="lesson-complete-msg">
            <p>
              Chapter complete. Open <strong>Devices</strong> to inspect your new machines, or pick a step above to
              replay.
            </p>
          </div>
        )}

        {idx === 0 && (
          <DbBtree
            onComplete={() => {
              if (chapterDone) setIdx(1)
              else setMomentId('db-0')
            }}
          />
        )}
        {idx === 1 && (
          <DbQuery
            onComplete={() => {
              if (chapterDone) setIdx(2)
              else setMomentId('db-1')
            }}
          />
        )}
        {idx === 2 && (
          <DbTransaction
            onComplete={() => {
              if (chapterDone) setIdx(3)
              else setMomentId('db-2')
            }}
          />
        )}
        {idx === 3 && (
          <DbAcid
            onComplete={() => {
              if (chapterDone) setIdx(4)
              else setMomentId('db-3')
            }}
          />
        )}
        {idx === 4 && (
          <DbIndex
            onComplete={() => {
              if (chapterDone) setIdx(5)
              else setMomentId('db-4')
            }}
          />
        )}
        {idx === 5 && (
          <DbNormalize
            onComplete={() => {
              if (chapterDone) setIdx(6)
              else setMomentId('db-5')
            }}
          />
        )}
        {idx === 6 && (
          <DbNosql
            onComplete={() => {
              if (chapterDone) setIdx(7)
              else setMomentId('db-6')
            }}
          />
        )}
      </div>

      {chapterDone && (
        <div className="lesson-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            <li>B-trees keep data balanced on disk, giving O(log n) reads regardless of table size</li>
            <li>Query optimizers choose between full scans and index lookups automatically</li>
            <li>ACID guarantees mean you can trust a database even across crashes and concurrent access</li>
            <li>Indexes trade write speed for read speed — the DBA's daily balancing act</li>
            <li>Normalization prevents update anomalies; denormalization speeds reads</li>
            <li>NoSQL wins when data shape varies, relationships are graph-like, or throughput must scale horizontally</li>
          </ul>
        </div>
      )}

      <LessonNav
        prev={{ label: 'Data structures and algorithms', to: '/learn/dsa' }}
        next={{ label: 'Software engineering', to: '/learn/swe' }}
      />
    </div>
  )
}
