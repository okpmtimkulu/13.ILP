import { useState } from 'react'
import { ConnectionMoment } from '../components/ConnectionMoment'
import { WebDNS } from '../components/lesson/WebDNS'
import { WebHTTP } from '../components/lesson/WebHTTP'
import { WebTLS } from '../components/lesson/WebTLS'
import { WebRender } from '../components/lesson/WebRender'
import { LessonNav } from '../components/LessonNav'
import { CONNECTION_MOMENTS } from '../content/connectionMoments'
import { curriculum } from '../content/curriculum'
import { setStackCelebrate } from '../lib/stackCelebrate'
import { LessonRestartControl } from '../components/LessonRestartControl'
import { completeLesson, loadProgress, mergeProgress } from '../lib/progress'

const chMeta = curriculum.chapters.find((c) => c.id === 'web')!
const lessonMeta = curriculum.lessons.find((l) => l.id === 'web-stack')!
const steps = lessonMeta.steps

export function Web() {
  const initial = loadProgress()
  const initialDone = initial.completedLessonIds.includes('web-stack')
  const startIdx = initialDone ? 4 : Math.min(initial.webStepIndex, 3)

  const [idx, setIdx] = useState(startIdx)
  const [chapterDone, setChapterDone] = useState(initialDone)
  const [maxReach, setMaxReach] = useState(() => {
    if (initialDone) return 4
    return Math.min(initial.webStepIndex, 3)
  })
  const [celebrate, setCelebrate] = useState(initialDone)
  const [momentId, setMomentId] = useState<string | null>(null)

  const go = (next: number) => {
    mergeProgress({ webStepIndex: next })
    setMaxReach((m) => Math.max(m, next))
    setIdx(next)
  }

  const finishChapter = () => {
    setStackCelebrate('web', 'compilers')
    completeLesson('web-stack')
    mergeProgress({ webStepIndex: 4 })
    setChapterDone(true)
    setCelebrate(true)
    setMaxReach(4)
    setIdx(4)
  }

  const moment = momentId ? CONNECTION_MOMENTS[momentId] : null

  const onMomentContinue = () => {
    const id = momentId
    setMomentId(null)
    if (id === 'web-0') go(1)
    else if (id === 'web-1') go(2)
    else if (id === 'web-2') go(3)
    else if (id === 'web-3') finishChapter()
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
          <LessonRestartControl lessonId="web-stack" lessonTitle={lessonMeta.title} />
        </div>
        <h1 className="lesson-title">{chMeta.title}</h1>
        <p className="lesson-description">{chMeta.summary}</p>
      </header>

      <div className="lesson-objectives">
        <h2>What you will learn</h2>
        <ul>
          <li>How DNS converts names to addresses</li>
          <li>How HTTP is a conversation with verbs and status codes</li>
          <li>How TLS encrypts before data flows</li>
          <li>How browsers parse HTML into a tree before painting</li>
        </ul>
      </div>

      <div className="lesson-steps" role="tablist" aria-label="Lesson steps">
        {steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === idx}
            className={`lesson-step-tab ${i === idx ? 'is-active' : ''} ${i < idx || (chapterDone && i <= 3) ? 'is-done' : ''}`}
            onClick={() => {
              if (i <= maxReach) setIdx(Math.min(i, 3))
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
          Unlocked: <strong>Browser Engine in Devices</strong>. Nice work.
        </div>
      )}

      <div className="lesson-content">
        {idx === 4 && (
          <div className="lesson-complete-msg">
            <p>
              Chapter complete. Open <strong>Devices</strong> to inspect your Browser Engine, or pick a step above to
              replay.
            </p>
          </div>
        )}

        {idx === 0 && (
          <WebDNS
            onComplete={() => {
              if (chapterDone) setIdx(1)
              else setMomentId('web-0')
            }}
          />
        )}
        {idx === 1 && (
          <WebHTTP
            onComplete={() => {
              if (chapterDone) setIdx(2)
              else setMomentId('web-1')
            }}
          />
        )}
        {idx === 2 && (
          <WebTLS
            onComplete={() => {
              if (chapterDone) setIdx(3)
              else setMomentId('web-2')
            }}
          />
        )}
        {idx === 3 && (
          <WebRender
            onComplete={() => {
              if (chapterDone) setIdx(4)
              else setMomentId('web-3')
            }}
          />
        )}
      </div>

      {chapterDone && (
        <div className="lesson-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            <li>DNS converts human-readable names to IP addresses — billions of times per second</li>
            <li>HTTP is a request-response conversation: verbs describe intent, status codes describe outcome</li>
            <li>TLS negotiates encryption before any application data flows — the padlock means it worked</li>
            <li>Browsers parse HTML into a DOM tree, combine with CSS, then layout and paint — in that order</li>
          </ul>
        </div>
      )}

      <LessonNav
        prev={{ label: 'Transport, services and security', to: '/learn/netservices' }}
        next={{ label: 'Distributed systems', to: '/learn/distributed' }}
      />
    </div>
  )
}
