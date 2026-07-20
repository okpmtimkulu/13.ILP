import { useState } from 'react'
import { ConnectionMoment } from '../components/ConnectionMoment'
import { LessonNav } from '../components/LessonNav'
import { CONNECTION_MOMENTS } from '../content/connectionMoments'
import { curriculum } from '../content/curriculum'
import { setStackCelebrate } from '../lib/stackCelebrate'
import { LessonRestartControl } from '../components/LessonRestartControl'
import { completeLesson, loadProgress, mergeProgress } from '../lib/progress'
import { NetOSI } from '../components/lesson/NetOSI'
import { NetPhysical } from '../components/lesson/NetPhysical'
import { NetEthernet } from '../components/lesson/NetEthernet'
import { NetSwitching } from '../components/lesson/NetSwitching'
import { NetARP } from '../components/lesson/NetARP'
import { NetWorldMap } from '../components/lesson/NetWorldMap'

const chMeta = curriculum.chapters.find((c) => c.id === 'networks')!
const lessonMeta = curriculum.lessons.find((l) => l.id === 'network-fundamentals')!
const steps = lessonMeta.steps
const TOTAL = steps.length

export function Networks() {
  const initial = loadProgress()
  const initialDone = initial.completedLessonIds.includes('network-fundamentals')
  const startIdx = initialDone ? TOTAL : Math.min(initial.networksStepIndex, TOTAL - 1)

  const [idx, setIdx] = useState(startIdx)
  const [chapterDone, setChapterDone] = useState(initialDone)
  const [maxReach, setMaxReach] = useState(() => {
    if (initialDone) return TOTAL
    return Math.min(initial.networksStepIndex, TOTAL - 1)
  })
  const [celebrate, setCelebrate] = useState(initialDone)
  const [momentId, setMomentId] = useState<string | null>(null)

  const go = (next: number) => {
    mergeProgress({ networksStepIndex: next })
    setMaxReach((m) => Math.max(m, next))
    setIdx(next)
  }

  const finishChapter = () => {
    setStackCelebrate('networks', 'iprouting')
    completeLesson('network-fundamentals')
    mergeProgress({ networksStepIndex: TOTAL })
    setChapterDone(true)
    setCelebrate(true)
    setMaxReach(TOTAL)
    setIdx(TOTAL)
  }

  const moment = momentId ? CONNECTION_MOMENTS[momentId] : null

  const advance = (fromIdx: number) => {
    if (chapterDone) {
      setIdx(fromIdx + 1)
    } else if (fromIdx < TOTAL - 1) {
      go(fromIdx + 1)
    } else {
      finishChapter()
    }
  }

  return (
    <div className="lesson-page">
      <ConnectionMoment
        open={!!moment}
        title={moment?.title ?? ''}
        body={moment?.body ?? ''}
        hook={moment?.hook}
        ctaLabel={moment?.cta ?? 'Continue'}
        onContinue={() => setMomentId(null)}
      />

      <header className="lesson-header">
        <div className="lesson-header-top">
          <span className="lesson-chapter-label">Network Fundamentals</span>
          <LessonRestartControl lessonId="network-fundamentals" lessonTitle={lessonMeta.title} />
        </div>
        <h1 className="lesson-title">{chMeta.title}</h1>
        <p className="lesson-description">{chMeta.summary}</p>
      </header>

      <div className="lesson-objectives">
        <h2>What you will learn</h2>
        <ul>
          <li>The 7 layers of the OSI model and what each one does</li>
          <li>How physical cables and signals carry data</li>
          <li>How Ethernet frames and MAC addresses work at Layer 2</li>
          <li>How switches forward frames and VLANs isolate traffic</li>
          <li>How ARP resolves IP addresses to MAC addresses</li>
          <li>Why physical distance and cable placement matter for the internet</li>
        </ul>
      </div>

      <div className="lesson-steps" role="tablist" aria-label="Lesson steps">
        {steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === idx}
            className={`lesson-step-tab ${i === idx ? 'is-active' : ''} ${i < idx || (chapterDone && i < TOTAL) ? 'is-done' : ''}`}
            onClick={() => {
              if (i <= maxReach) setIdx(Math.min(i, TOTAL - 1))
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
          Network fundamentals mastered! Grab your <strong>Home server</strong> and <strong>Commercial rack</strong> in Devices.
        </div>
      )}

      <div className="lesson-content">
        {idx === TOTAL && (
          <div className="lesson-complete-msg">
            <p>Chapter complete. Pick a step above to replay, or continue to IP addressing.</p>
          </div>
        )}
        {idx === 0 && <NetOSI onComplete={() => advance(0)} />}
        {idx === 1 && <NetPhysical onComplete={() => advance(1)} />}
        {idx === 2 && <NetEthernet onComplete={() => advance(2)} />}
        {idx === 3 && <NetSwitching onComplete={() => advance(3)} />}
        {idx === 4 && <NetARP onComplete={() => advance(4)} />}
        {idx === 5 && <NetWorldMap onComplete={() => advance(5)} />}
      </div>

      {chapterDone && (
        <div className="lesson-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            <li>The OSI model gives you a shared vocabulary for where problems live in a network</li>
            <li>Physical media — copper, fiber, wireless — each have tradeoffs in speed, distance, and cost</li>
            <li>Ethernet frames carry MAC addresses so switches know where to forward at Layer 2</li>
            <li>VLANs segment a single physical switch into multiple isolated broadcast domains</li>
            <li>ARP is the bridge between IP addresses (Layer 3) and MAC addresses (Layer 2)</li>
            <li>Data travels physically — distance means latency, and cable placement shapes the internet</li>
          </ul>
        </div>
      )}

      <LessonNav
        prev={{ label: 'Programming paradigms', to: '/learn/paradigms' }}
        next={{ label: 'IP addressing and routing', to: '/learn/iprouting' }}
      />
    </div>
  )
}
