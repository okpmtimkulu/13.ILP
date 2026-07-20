import { useState } from 'react'
import { ConnectionMoment } from '../components/ConnectionMoment'
import { LessonNav } from '../components/LessonNav'
import { CONNECTION_MOMENTS } from '../content/connectionMoments'
import { curriculum } from '../content/curriculum'
import { setStackCelebrate } from '../lib/stackCelebrate'
import { LessonRestartControl } from '../components/LessonRestartControl'
import { completeLesson, loadProgress, mergeProgress } from '../lib/progress'
import { NsTCP } from '../components/lesson/NsTCP'
import { NsUDP } from '../components/lesson/NsUDP'
import { NsPorts } from '../components/lesson/NsPorts'
import { NsDHCP } from '../components/lesson/NsDHCP'
import { NsNAT } from '../components/lesson/NsNAT'
import { NsWireless } from '../components/lesson/NsWireless'
import { NsACL } from '../components/lesson/NsACL'
import { NsTroubleshoot } from '../components/lesson/NsTroubleshoot'

const chMeta = curriculum.chapters.find((c) => c.id === 'netservices')!
const lessonMeta = curriculum.lessons.find((l) => l.id === 'net-services-core')!
const steps = lessonMeta.steps
const TOTAL = steps.length

export function NetServices() {
  const initial = loadProgress()
  const initialDone = initial.completedLessonIds.includes('net-services-core')
  const startIdx = initialDone ? TOTAL : Math.min(initial.netservicesStepIndex, TOTAL - 1)

  const [idx, setIdx] = useState(startIdx)
  const [chapterDone, setChapterDone] = useState(initialDone)
  const [maxReach, setMaxReach] = useState(() => {
    if (initialDone) return TOTAL
    return Math.min(initial.netservicesStepIndex, TOTAL - 1)
  })
  const [celebrate, setCelebrate] = useState(initialDone)
  const [momentId, setMomentId] = useState<string | null>(null)

  const go = (next: number) => {
    mergeProgress({ netservicesStepIndex: next })
    setMaxReach((m) => Math.max(m, next))
    setIdx(next)
  }

  const finishChapter = () => {
    setStackCelebrate('netservices', 'web')
    completeLesson('net-services-core')
    mergeProgress({ netservicesStepIndex: TOTAL })
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
          <span className="lesson-chapter-label">Transport, Services and Security</span>
          <LessonRestartControl lessonId="net-services-core" lessonTitle={lessonMeta.title} />
        </div>
        <h1 className="lesson-title">{chMeta.title}</h1>
        <p className="lesson-description">{chMeta.summary}</p>
      </header>

      <div className="lesson-objectives">
        <h2>What you will learn</h2>
        <ul>
          <li>How TCP builds a reliable connection with the three-way handshake</li>
          <li>When UDP is the better choice over TCP</li>
          <li>How ports let one IP address serve many applications</li>
          <li>How DHCP automatically assigns addresses to new devices</li>
          <li>How NAT lets many private devices share one public IP</li>
          <li>How wireless networks work and why security matters</li>
          <li>How ACLs filter traffic and firewalls enforce policy</li>
          <li>How to systematically troubleshoot network problems</li>
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
          Transport and services mastered! You now understand the protocols and tools that keep networks running.
        </div>
      )}

      <div className="lesson-content">
        {idx === TOTAL && (
          <div className="lesson-complete-msg">
            <p>Chapter complete. Pick a step above to replay, or continue to the web stack.</p>
          </div>
        )}
        {idx === 0 && <NsTCP onComplete={() => advance(0)} />}
        {idx === 1 && <NsUDP onComplete={() => advance(1)} />}
        {idx === 2 && <NsPorts onComplete={() => advance(2)} />}
        {idx === 3 && <NsDHCP onComplete={() => advance(3)} />}
        {idx === 4 && <NsNAT onComplete={() => advance(4)} />}
        {idx === 5 && <NsWireless onComplete={() => advance(5)} />}
        {idx === 6 && <NsACL onComplete={() => advance(6)} />}
        {idx === 7 && <NsTroubleshoot onComplete={() => advance(7)} />}
      </div>

      {chapterDone && (
        <div className="lesson-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            <li>TCP guarantees delivery with handshakes and acknowledgments — UDP trades reliability for speed</li>
            <li>Ports are numbered doors that let one IP serve many services simultaneously</li>
            <li>DHCP automates address assignment so no human configures every device</li>
            <li>NAT/PAT lets millions of private networks share limited public IPv4 addresses</li>
            <li>Wireless adds flexibility but requires careful channel planning and strong security</li>
            <li>ACLs are evaluated top-to-bottom, first match wins, implicit deny at the end</li>
            <li>Troubleshooting is systematic: start at the physical layer and work up</li>
          </ul>
        </div>
      )}

      <LessonNav
        prev={{ label: 'IP addressing and routing', to: '/learn/iprouting' }}
        next={{ label: 'The web stack', to: '/learn/web' }}
      />
    </div>
  )
}
