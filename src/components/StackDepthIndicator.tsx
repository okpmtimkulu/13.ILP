import { useLocation } from 'react-router-dom'
import { DEPTH_SEGMENTS, getActiveDepthIndex, segmentDone } from '../content/journeyStack'
import { loadProgress } from '../lib/progress'

export function StackDepthIndicator() {
  const loc = useLocation()
  const p = loadProgress()
  const active = getActiveDepthIndex(loc.pathname, p)

  return (
    <div className="stack-depth" role="navigation" aria-label="Your place in the full stack">
      <div className="stack-depth-inner">
        {DEPTH_SEGMENTS.map((seg, i) => {
          const done = segmentDone(i, p)
          const isHere = i === active
          const placeholder = (seg.id === 'os' || seg.id === 'memory') && !done
          return (
            <div key={seg.id} className="stack-depth-seg-wrap">
              {i > 0 ? (
                <span className="stack-depth-join" aria-hidden>
                  ·
                </span>
              ) : null}
              <div
                className={`stack-depth-seg ${done ? 'is-done' : ''} ${isHere ? 'is-active' : ''} ${placeholder ? 'is-placeholder' : ''}`}
                title={seg.short}
              >
                <span className="stack-depth-label">{seg.label}</span>
              </div>
            </div>
          )
        })}
      </div>
      <p className="stack-depth-caption">
        One continuous stack from a wire to a model. You are working near <strong>{DEPTH_SEGMENTS[active].label}</strong>
        .
      </p>
    </div>
  )
}
