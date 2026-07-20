import { useState } from 'react'
import { ConnectionMoment } from '../components/ConnectionMoment'
import { LessonNav } from '../components/LessonNav'
import { CONNECTION_MOMENTS } from '../content/connectionMoments'
import { curriculum } from '../content/curriculum'
import { setStackCelebrate } from '../lib/stackCelebrate'
import { LessonRestartControl } from '../components/LessonRestartControl'
import { completeLesson, loadProgress, mergeProgress } from '../lib/progress'
import { IPAddressing } from '../components/lesson/IPAddressing'
import { IPSubnetting } from '../components/lesson/IPSubnetting'
import { IPv6Basics } from '../components/lesson/IPv6Basics'
import { IPRoutingTable } from '../components/lesson/IPRoutingTable'
import { IPStatic } from '../components/lesson/IPStatic'
import { IOSPF } from '../components/lesson/IOSPF'

const chMeta = curriculum.chapters.find((c) => c.id === 'iprouting')!
const lessonMeta = curriculum.lessons.find((l) => l.id === 'ip-routing-core')!
const steps = lessonMeta.steps
const TOTAL = steps.length

export function IPRouting() {
  const initial = loadProgress()
  const initialDone = initial.completedLessonIds.includes('ip-routing-core')
  const startIdx = initialDone ? TOTAL : Math.min(initial.iproutingStepIndex, TOTAL - 1)

  const [idx, setIdx] = useState(startIdx)
  const [chapterDone, setChapterDone] = useState(initialDone)
  const [maxReach, setMaxReach] = useState(() => {
    if (initialDone) return TOTAL
    return Math.min(initial.iproutingStepIndex, TOTAL - 1)
  })
  const [celebrate, setCelebrate] = useState(initialDone)
  const [momentId, setMomentId] = useState<string | null>(null)

  const go = (next: number) => {
    mergeProgress({ iproutingStepIndex: next })
    setMaxReach((m) => Math.max(m, next))
    setIdx(next)
  }

  const finishChapter = () => {
    setStackCelebrate('iprouting', 'netservices')
    completeLesson('ip-routing-core')
    mergeProgress({ iproutingStepIndex: TOTAL })
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
          <span className="lesson-chapter-label">IP Addressing and Routing</span>
          <LessonRestartControl lessonId="ip-routing-core" lessonTitle={lessonMeta.title} />
        </div>
        <h1 className="lesson-title">{chMeta.title}</h1>
        <p className="lesson-description">{chMeta.summary}</p>
      </header>

      <div className="lesson-objectives">
        <h2>What you will learn</h2>
        <ul>
          <li>How IPv4 addresses encode network and host in 32 bits</li>
          <li>How to subnet a network and calculate usable addresses with CIDR</li>
          <li>Why IPv6 was created and how its addressing works</li>
          <li>How routers use routing tables and longest prefix match to forward packets</li>
          <li>How to configure static routes and a default gateway</li>
          <li>How OSPF dynamically discovers routes and reconverges around failures</li>
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
          IP addressing and routing mastered! You now understand how packets find their way across the internet.
        </div>
      )}

      <div className="lesson-content">
        {idx === TOTAL && (
          <div className="lesson-complete-msg">
            <p>Chapter complete. Pick a step above to replay, or continue to transport and services.</p>
          </div>
        )}
        {idx === 0 && <IPAddressing onComplete={() => advance(0)} />}
        {idx === 1 && <IPSubnetting onComplete={() => advance(1)} />}
        {idx === 2 && <IPv6Basics onComplete={() => advance(2)} />}
        {idx === 3 && <IPRoutingTable onComplete={() => advance(3)} />}
        {idx === 4 && <IPStatic onComplete={() => advance(4)} />}
        {idx === 5 && <IOSPF onComplete={() => advance(5)} />}
      </div>

      {chapterDone && (
        <div className="lesson-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            <li>An IPv4 address encodes two things: which network and which host on that network</li>
            <li>Subnetting divides one network into many — doubling subnets halves the hosts each time</li>
            <li>IPv6 provides enough addresses for every device on Earth, with a simpler header</li>
            <li>Routers forward packets using longest prefix match on their routing table</li>
            <li>Static routes are manual; default routes are the fallback when nothing else matches</li>
            <li>OSPF lets routers discover the network topology and route around failures automatically</li>
          </ul>
        </div>
      )}

      <LessonNav
        prev={{ label: 'Network fundamentals', to: '/learn/networks' }}
        next={{ label: 'Transport, services and security', to: '/learn/netservices' }}
      />
    </div>
  )
}
