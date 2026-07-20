import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { curriculum } from '../content/curriculum'
import { TRACKS } from '../content/tracks'
import { isAiChapterLocked } from '../content/journeyStack'
import { getNextStep, getStepCompletion, loadProgress } from '../lib/progress'
import { isChapterPathActive, pathForChapter } from '../lib/chapterPaths'

function lessonForChapter(chapterId: string) {
  const ch = curriculum.chapters.find((c) => c.id === chapterId)
  if (!ch) return null
  const lid = ch.lessonIds[0]
  return curriculum.lessons.find((l) => l.id === lid) ?? null
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="currentColor" />
      <path
        d="M5 8l2 2 4-4"
        stroke="var(--bg)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="4" y="7" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 7V5a2 2 0 0 1 4 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={`sidebar-chevron ${open ? 'is-open' : ''}`}
    >
      <path d="M4 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function LearnSidebar() {
  const loc = useLocation()
  const progress = loadProgress()
  const doneSet = new Set(progress.completedLessonIds)
  const aiLocked = isAiChapterLocked(progress)
  const stepDone = getStepCompletion(progress)
  const nextStep = getNextStep(progress)

  const totalSteps = Object.keys(stepDone).length
  const completedSteps = Object.values(stepDone).filter(Boolean).length

  let chapterNum = 0

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    for (const track of TRACKS) {
      for (const chId of track.chapterIds) {
        init[chId] = isChapterPathActive(loc.pathname, chId)
      }
    }
    return init
  })

  const toggle = (chId: string) => {
    setExpanded((prev) => ({ ...prev, [chId]: !prev[chId] }))
  }

  return (
    <aside className="learn-sidebar" aria-label="Course outline">
      <div className="sidebar-header">
        <p className="sidebar-course-label">ILP Lab Course</p>
        <div className="sidebar-progress-bar">
          <div
            className="sidebar-progress-fill"
            style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
          />
        </div>
        <p className="sidebar-progress-text">
          {completedSteps} of {totalSteps} steps completed
        </p>
      </div>

      {nextStep && (
        <Link to={pathForChapter(nextStep.chapterId)} className="sidebar-continue">
          <span className="sidebar-continue-label">Continue</span>
          <span className="sidebar-continue-title">{nextStep.stepTitle}</span>
        </Link>
      )}

      {!nextStep && completedSteps === totalSteps && (
        <div className="sidebar-all-done">
          <span className="sidebar-all-done-icon">✓</span>
          <span className="sidebar-all-done-text">All steps completed</span>
        </div>
      )}

      <nav className="sidebar-nav" aria-label="Lessons">
        {TRACKS.map((track) => {
          const trackChaptersDone = track.chapterIds.every((chId) => {
            const lesson = lessonForChapter(chId)
            return lesson && doneSet.has(lesson.id)
          })

          return (
            <div key={track.id} className={`sidebar-track ${trackChaptersDone ? 'is-done' : ''}`}>
              <p className="sidebar-track-title">{track.title}</p>

              <div className="sidebar-track-chapters">
                {track.chapterIds.map((chapterId) => {
                  chapterNum++
                  const ch = curriculum.chapters.find((c) => c.id === chapterId)
                  const lesson = lessonForChapter(chapterId)
                  if (!ch || !lesson) return null
                  const href = pathForChapter(chapterId)
                  const active = isChapterPathActive(loc.pathname, chapterId)
                  const done = doneSet.has(lesson.id)
                  const locked = chapterId === 'ai' && aiLocked
                  const isOpen = expanded[chapterId] || active
                  const idx = String(chapterNum).padStart(2, '0')

                  return (
                    <div
                      key={chapterId}
                      className={`sidebar-chapter ${active ? 'is-active' : ''} ${done ? 'is-done' : ''} ${locked ? 'is-locked' : ''}`}
                    >
                      <button
                        type="button"
                        className="sidebar-chapter-toggle"
                        onClick={() => toggle(chapterId)}
                        aria-expanded={isOpen}
                      >
                        <span className="sidebar-step-indicator" aria-hidden>
                          {done ? (
                            <span className="sidebar-step-check">
                              <CheckIcon />
                            </span>
                          ) : locked ? (
                            <span className="sidebar-lock">
                              <LockIcon />
                            </span>
                          ) : (
                            <span
                              className={`sidebar-step-dot ${active && !done ? 'is-chapter-current' : ''}`}
                            />
                          )}
                        </span>
                        <span className="sidebar-chapter-line">
                          <span className="sidebar-chapter-idx">{idx}</span>
                          <span className="sidebar-chapter-title">{ch.title}</span>
                        </span>
                        {!locked && <ChevronIcon open={isOpen} />}
                      </button>

                      {isOpen && !locked && (
                        <div className="sidebar-steps">
                          {lesson.steps.map((step) => {
                            const isDone = stepDone[step.id] ?? false
                            const isContinue = nextStep?.stepId === step.id

                            return (
                              <Link
                                key={step.id}
                                to={href}
                                className={`sidebar-step ${isDone ? 'is-done' : ''} ${isContinue ? 'is-continue' : ''}`}
                              >
                                <span className="sidebar-step-indicator">
                                  {isDone ? (
                                    <span className="sidebar-step-check">
                                      <CheckIcon />
                                    </span>
                                  ) : (
                                    <span className="sidebar-step-dot" />
                                  )}
                                </span>
                                <span className="sidebar-step-title">{step.title}</span>
                                {isContinue && <span className="sidebar-step-badge">Up next</span>}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
