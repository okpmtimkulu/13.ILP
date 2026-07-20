import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { curriculum } from '../content/curriculum'
import { getContinuePath, isAiChapterLocked } from '../content/journeyStack'
import { TRACKS } from '../content/tracks'
import { pathForChapter } from '../lib/chapterPaths'
import type { ProgressState } from '../lib/progress'
import type { StackCelebrate } from '../lib/stackCelebrate'
import { consumeStackCelebrate } from '../lib/stackCelebrate'

type Props = {
  progress: ProgressState
}

export function HomeStack({ progress }: Props) {
  const done = new Set(progress.completedLessonIds)
  const continuePath = getContinuePath(progress)
  const aiLocked = isAiChapterLocked(progress)
  const [spark] = useState<StackCelebrate | null>(() => consumeStackCelebrate())

  let globalIdx = 0

  return (
    <section className="home-stack-section" aria-labelledby="stack-heading">
      <div className="home-stack-header">
        <h2 id="stack-heading">The stack you are climbing</h2>
        <p className="home-stack-lede">
          Five tracks, sixteen chapters, one complete journey through computer science. Start at the top and work down.
        </p>
      </div>

      {spark ? (
        <motion.div
          className="home-stack-spark-banner"
          role="status"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <span className="home-stack-spark-glow" aria-hidden />
          <span>
            Connection drawn: <strong>{spark.from}</strong> → <strong>{spark.to}</strong>. That thread is real in
            hardware too.
          </span>
        </motion.div>
      ) : null}

      <div className="home-stack-tracks">
        {TRACKS.map((track, trackIdx) => {
          const trackLessonIds = track.chapterIds.map((chId) => {
            const ch = curriculum.chapters.find((c) => c.id === chId)
            return ch ? ch.lessonIds[0] : ''
          })
          const trackDone = trackLessonIds.every((lid) => done.has(lid))
          const trackStepsTotal = track.chapterIds.length
          const trackStepsDone = trackLessonIds.filter((lid) => done.has(lid)).length

          return (
            <div key={track.id} className={`home-track ${trackDone ? 'is-complete' : ''}`}>
              <div className="home-track-header">
                <h3 className="home-track-title">{track.title}</h3>
                <span className="home-track-progress">
                  {trackStepsDone}/{trackStepsTotal}
                </span>
              </div>

              <div className="home-track-chapters" role="list">
                {track.chapterIds.map((chapterId, chIdx) => {
                  globalIdx++
                  const ch = curriculum.chapters.find((c) => c.id === chapterId)
                  const lesson = ch ? curriculum.lessons.find((l) => l.id === ch.lessonIds[0]) : null
                  if (!ch || !lesson) return null
                  const complete = done.has(lesson.id)
                  const locked = chapterId === 'ai' && aiLocked
                  const href = pathForChapter(chapterId)
                  const sparkHere = spark && (spark.to === chapterId || spark.from === chapterId)
                  const num = String(globalIdx).padStart(2, '0')

                  return (
                    <motion.div
                      key={chapterId}
                      className={`home-stack-row ${complete ? 'is-complete' : ''} ${locked ? 'is-locked' : ''} ${sparkHere ? 'is-spark' : ''}`}
                      role="listitem"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (trackIdx * 4 + chIdx) * 0.04, duration: 0.35 }}
                    >
                      <div className="home-stack-thread" aria-hidden>
                        <span className="home-stack-node">{complete ? '◉' : '○'}</span>
                      </div>
                      <div className="home-stack-body">
                        <div className="home-stack-titles">
                          <span className="home-stack-num">{num}</span>
                          <h4 className="home-stack-chapter-title">{ch.title}</h4>
                          <p className="home-stack-blurb">{lesson.title}</p>
                        </div>
                        <div className="home-stack-actions">
                          {locked ? (
                            <span className="home-stack-badge home-stack-badge--locked">Locked</span>
                          ) : complete ? (
                            <span className="home-stack-badge home-stack-badge--done">Done</span>
                          ) : (
                            <Link to={href} className="btn ghost home-stack-link">
                              {continuePath === href ? 'Continue' : 'Open'}
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="home-stack-cta">
        <Link to={continuePath} className="btn primary">
          {allDone(done) ? 'Replay a track' : 'Continue the journey'}
        </Link>
      </div>
    </section>
  )
}

function allDone(done: Set<string>) {
  return [
    'fundamentals-start',
    'foundations-golden-path',
    'network-fundamentals',
    'ip-routing-core',
    'net-services-core',
    'llm-intuition',
    'memory-hierarchy',
    'os-core',
    'web-stack',
    'compilers-core',
    'math-foundations',
    'dsa-core',
    'db-core',
    'security-core',
    'paradigms-core',
    'swe-core',
    'distributed-core',
    'cloud-foundations-core',
    'cloud-identity-core',
    'cloud-networking-core',
    'cloud-production-core',
    'ethics-core',
  ].every((id) => done.has(id))
}
