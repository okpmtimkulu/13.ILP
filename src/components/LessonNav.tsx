import { Link } from 'react-router-dom'

export type LessonNavItem = {
  label: string
  to: string
}

type Props = {
  prev?: LessonNavItem
  next?: LessonNavItem
}

export function LessonNav({ prev, next }: Props) {
  return (
    <nav className="lesson-nav" aria-label="Lesson navigation">
      <div className="lesson-nav-inner">
        {prev ? (
          <Link to={prev.to} className="lesson-nav-link lesson-nav-link--prev">
            <span className="lesson-nav-dir">Previous</span>
            <span className="lesson-nav-label">{prev.label}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={next.to} className="lesson-nav-link lesson-nav-link--next">
            <span className="lesson-nav-dir">Next</span>
            <span className="lesson-nav-label">{next.label}</span>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </nav>
  )
}
