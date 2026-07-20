import { useState } from 'react'
import { ConnectionMoment } from '../components/ConnectionMoment'
import { DistReplication } from '../components/lesson/DistReplication'
import { DistConsensus } from '../components/lesson/DistConsensus'
import { DistCap } from '../components/lesson/DistCap'
import { DistLoadbalance } from '../components/lesson/DistLoadbalance'
import { DistMapreduce } from '../components/lesson/DistMapreduce'
import { DistSharding } from '../components/lesson/DistSharding'
import { DistQueue } from '../components/lesson/DistQueue'
import { DistObserve } from '../components/lesson/DistObserve'
import { LessonNav } from '../components/LessonNav'
import { CONNECTION_MOMENTS } from '../content/connectionMoments'
import { curriculum } from '../content/curriculum'
import { setStackCelebrate } from '../lib/stackCelebrate'
import { LessonRestartControl } from '../components/LessonRestartControl'
import { completeLesson, loadProgress, mergeProgress } from '../lib/progress'

const chMeta = curriculum.chapters.find((c) => c.id === 'distributed')!
const lessonMeta = curriculum.lessons.find((l) => l.id === 'distributed-core')!
const steps = lessonMeta.steps

export function Distributed() {
  const initial = loadProgress()
  const initialDone = initial.completedLessonIds.includes('distributed-core')
  const startIdx = initialDone ? 8 : Math.min(initial.distributedStepIndex, 7)

  const [idx, setIdx] = useState(startIdx)
  const [chapterDone, setChapterDone] = useState(initialDone)
  const [maxReach, setMaxReach] = useState(() => {
    if (initialDone) return 8
    return Math.min(initial.distributedStepIndex, 7)
  })
  const [celebrate, setCelebrate] = useState(initialDone)
  const [momentId, setMomentId] = useState<string | null>(null)

  const go = (next: number) => {
    mergeProgress({ distributedStepIndex: next })
    setMaxReach((m) => Math.max(m, next))
    setIdx(next)
  }

  const finishChapter = () => {
    setStackCelebrate('distributed', 'cloud-foundations')
    completeLesson('distributed-core')
    mergeProgress({ distributedStepIndex: 8 })
    setChapterDone(true)
    setCelebrate(true)
    setMaxReach(8)
    setIdx(8)
  }

  const moment = momentId ? CONNECTION_MOMENTS[momentId] : null

  const onMomentContinue = () => {
    const id = momentId
    setMomentId(null)
    if (id === 'dist-0') go(1)
    else if (id === 'dist-1') go(2)
    else if (id === 'dist-2') go(3)
    else if (id === 'dist-3') go(4)
    else if (id === 'dist-4') go(5)
    else if (id === 'dist-5') go(6)
    else if (id === 'dist-6') go(7)
    else if (id === 'dist-7') finishChapter()
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
          <span className="lesson-chapter-label">Chapter 14</span>
          <LessonRestartControl lessonId="distributed-core" lessonTitle={lessonMeta.title} />
        </div>
        <h1 className="lesson-title">{chMeta.title}</h1>
        <p className="lesson-description">{chMeta.summary}</p>
      </header>

      <div className="lesson-objectives">
        <h2>What you will learn</h2>
        <ul>
          <li>How data replication survives node failures and leader elections</li>
          <li>How Raft consensus keeps a cluster consistent even through network partitions</li>
          <li>Why the CAP theorem means every distributed database makes a tradeoff</li>
          <li>How load balancers distribute traffic and respond to failures</li>
          <li>How MapReduce parallelizes computation across many machines</li>
          <li>How sharding splits data across nodes and why shard key choice is irreversible</li>
          <li>How message queues decouple services and absorb traffic spikes</li>
          <li>How logs, metrics, and traces together make production debuggable</li>
        </ul>
      </div>

      <div className="lesson-steps" role="tablist" aria-label="Lesson steps">
        {steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === idx}
            className={`lesson-step-tab ${i === idx ? 'is-active' : ''} ${i < idx || (chapterDone && i <= 7) ? 'is-done' : ''}`}
            onClick={() => {
              if (i <= maxReach) setIdx(Math.min(i, 7))
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
          Unlocked: <strong>Server Rack Cluster</strong> in Devices.
        </div>
      )}

      <div className="lesson-content">
        {idx === 8 && (
          <div className="lesson-complete-msg">
            <p>
              Chapter complete. Open <strong>Devices</strong> to inspect your server rack cluster, or pick a step above to
              replay.
            </p>
          </div>
        )}

        {idx === 0 && (
          <DistReplication
            onComplete={() => {
              if (chapterDone) setIdx(1)
              else setMomentId('dist-0')
            }}
          />
        )}
        {idx === 1 && (
          <DistConsensus
            onComplete={() => {
              if (chapterDone) setIdx(2)
              else setMomentId('dist-1')
            }}
          />
        )}
        {idx === 2 && (
          <DistCap
            onComplete={() => {
              if (chapterDone) setIdx(3)
              else setMomentId('dist-2')
            }}
          />
        )}
        {idx === 3 && (
          <DistLoadbalance
            onComplete={() => {
              if (chapterDone) setIdx(4)
              else setMomentId('dist-3')
            }}
          />
        )}
        {idx === 4 && (
          <DistMapreduce
            onComplete={() => {
              if (chapterDone) setIdx(5)
              else setMomentId('dist-4')
            }}
          />
        )}
        {idx === 5 && (
          <DistSharding
            onComplete={() => {
              if (chapterDone) setIdx(6)
              else setMomentId('dist-5')
            }}
          />
        )}
        {idx === 6 && (
          <DistQueue
            onComplete={() => {
              if (chapterDone) setIdx(7)
              else setMomentId('dist-6')
            }}
          />
        )}
        {idx === 7 && (
          <DistObserve
            onComplete={() => {
              if (chapterDone) setIdx(8)
              else setMomentId('dist-7')
            }}
          />
        )}
      </div>

      {chapterDone && (
        <div className="lesson-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            <li>Replication means the same data lives in multiple places — failure of one node is survivable</li>
            <li>Consensus algorithms require a majority to make progress — partitions below majority size stall by design</li>
            <li>CAP: you can have at most two of consistency, availability, and partition tolerance — partitions are inevitable</li>
            <li>Load balancers are the traffic cop: round-robin is fair, least-connections is smart</li>
            <li>MapReduce: map in parallel, shuffle by key, reduce locally — the big data playbook</li>
            <li>Shard key determines data distribution forever — choose carefully before you have real traffic</li>
            <li>Queues absorb spikes and decouple failure domains; a crashed consumer never takes down the producer</li>
            <li>Logs tell you what, metrics tell you how much, traces tell you where time went</li>
          </ul>
        </div>
      )}

      <LessonNav
        prev={{ label: 'The web stack', to: '/learn/web' }}
        next={{ label: 'Cloud foundations', to: '/learn/cloud-foundations' }}
      />
    </div>
  )
}
