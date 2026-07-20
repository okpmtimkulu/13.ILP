import { useState } from 'react'
import { ConnectionMoment } from '../components/ConnectionMoment'
import { SecXor } from '../components/lesson/SecXor'
import { SecHash } from '../components/lesson/SecHash'
import { SecKeypair } from '../components/lesson/SecKeypair'
import { SecSignature } from '../components/lesson/SecSignature'
import { SecPki } from '../components/lesson/SecPki'
import { SecAuth } from '../components/lesson/SecAuth'
import { SecOwasp } from '../components/lesson/SecOwasp'
import { LessonNav } from '../components/LessonNav'
import { CONNECTION_MOMENTS } from '../content/connectionMoments'
import { curriculum } from '../content/curriculum'
import { setStackCelebrate } from '../lib/stackCelebrate'
import { LessonRestartControl } from '../components/LessonRestartControl'
import { completeLesson, loadProgress, mergeProgress } from '../lib/progress'

const chMeta = curriculum.chapters.find((c) => c.id === 'security')!
const lessonMeta = curriculum.lessons.find((l) => l.id === 'security-core')!
const steps = lessonMeta.steps

export function Security() {
  const initial = loadProgress()
  const initialDone = initial.completedLessonIds.includes('security-core')
  const startIdx = initialDone ? 7 : Math.min(initial.securityStepIndex, 6)

  const [idx, setIdx] = useState(startIdx)
  const [chapterDone, setChapterDone] = useState(initialDone)
  const [maxReach, setMaxReach] = useState(() => {
    if (initialDone) return 7
    return Math.min(initial.securityStepIndex, 6)
  })
  const [celebrate, setCelebrate] = useState(initialDone)
  const [momentId, setMomentId] = useState<string | null>(null)

  const go = (next: number) => {
    mergeProgress({ securityStepIndex: next })
    setMaxReach((m) => Math.max(m, next))
    setIdx(next)
  }

  const finishChapter = () => {
    setStackCelebrate('security', 'distributed')
    completeLesson('security-core')
    mergeProgress({ securityStepIndex: 7 })
    setChapterDone(true)
    setCelebrate(true)
    setMaxReach(7)
    setIdx(7)
  }

  const moment = momentId ? CONNECTION_MOMENTS[momentId] : null

  const onMomentContinue = () => {
    const id = momentId
    setMomentId(null)
    if (id === 'sec-0') go(1)
    else if (id === 'sec-1') go(2)
    else if (id === 'sec-2') go(3)
    else if (id === 'sec-3') go(4)
    else if (id === 'sec-4') go(5)
    else if (id === 'sec-5') go(6)
    else if (id === 'sec-6') finishChapter()
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
          <span className="lesson-chapter-label">Chapter 11</span>
          <LessonRestartControl lessonId="security-core" lessonTitle={lessonMeta.title} />
        </div>
        <h1 className="lesson-title">{chMeta.title}</h1>
        <p className="lesson-description">{chMeta.summary}</p>
      </header>

      <div className="lesson-objectives">
        <h2>What you will learn</h2>
        <ul>
          <li>How XOR becomes the building block of all modern ciphers</li>
          <li>Why hash functions are one-way and what avalanche means</li>
          <li>How public-key cryptography lets strangers communicate securely</li>
          <li>How digital signatures prove authorship without sharing secrets</li>
          <li>How certificate chains establish trust on the web</li>
          <li>The difference between authentication and authorization</li>
          <li>How SQL injection, XSS, and CSRF work — and how to stop them</li>
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
          Unlocked: <strong>Hardware Security Key</strong> in Devices.
        </div>
      )}

      <div className="lesson-content">
        {idx === 7 && (
          <div className="lesson-complete-msg">
            <p>
              Chapter complete. Open <strong>Devices</strong> to inspect your new hardware, or pick a step above to
              replay.
            </p>
          </div>
        )}

        {idx === 0 && (
          <SecXor
            onComplete={() => {
              if (chapterDone) setIdx(1)
              else setMomentId('sec-0')
            }}
          />
        )}
        {idx === 1 && (
          <SecHash
            onComplete={() => {
              if (chapterDone) setIdx(2)
              else setMomentId('sec-1')
            }}
          />
        )}
        {idx === 2 && (
          <SecKeypair
            onComplete={() => {
              if (chapterDone) setIdx(3)
              else setMomentId('sec-2')
            }}
          />
        )}
        {idx === 3 && (
          <SecSignature
            onComplete={() => {
              if (chapterDone) setIdx(4)
              else setMomentId('sec-3')
            }}
          />
        )}
        {idx === 4 && (
          <SecPki
            onComplete={() => {
              if (chapterDone) setIdx(5)
              else setMomentId('sec-4')
            }}
          />
        )}
        {idx === 5 && (
          <SecAuth
            onComplete={() => {
              if (chapterDone) setIdx(6)
              else setMomentId('sec-5')
            }}
          />
        )}
        {idx === 6 && (
          <SecOwasp
            onComplete={() => {
              if (chapterDone) setIdx(7)
              else setMomentId('sec-6')
            }}
          />
        )}
      </div>

      {chapterDone && (
        <div className="lesson-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            <li>XOR is symmetric and reversible — the foundation of encryption</li>
            <li>Hash functions are one-way traps: easy to compute, impossible to reverse</li>
            <li>Public keys encrypt; private keys decrypt — strangers can start a secure conversation</li>
            <li>Digital signatures prove authorship by reversing the key roles</li>
            <li>PKI chains trust from root CAs through intermediates to your domain cert</li>
            <li>Authentication answers "who?", authorization answers "what can they do?" — never mix them up</li>
            <li>Parameterized queries, output encoding, and SameSite cookies stop the three most common web attacks</li>
          </ul>
        </div>
      )}

      <LessonNav
        prev={{ label: 'Software engineering', to: '/learn/swe' }}
        next={{ label: 'Machine intelligence', to: '/learn/llm' }}
      />
    </div>
  )
}
