import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

const spots = [
  {
    id: 'in',
    label: 'Input — how information gets in',
    detail:
      'You press a key, tap a screen, speak into a mic, or click a mouse. All of those are ways of giving the computer information. Even a temperature sensor or a camera counts — anything that feeds data in.',
    x: 8,
    y: 40,
    placement: 'below' as const,
  },
  {
    id: 'work',
    label: 'Processing — where the thinking happens',
    detail:
      'A chip inside follows a list of very simple rules, incredibly fast. It takes whatever came in and figures out what to do with it. You do not need to know how yet — just that this box is the "brain" part.',
    x: 50,
    y: 38,
    placement: 'above' as const,
  },
  {
    id: 'out',
    label: 'Output — the result you see or hear',
    detail:
      'The screen lights up, the speaker plays a sound, a message gets sent. This is the computer showing you its answer. Sometimes the output becomes new input — like when you read something on screen and decide what to type next.',
    x: 88,
    y: 40,
    placement: 'below' as const,
  },
] as const

const EXAMPLES = [
  { emoji: '💬', action: 'Sending a text', input: 'You type words', process: 'Phone packages the message', output: 'Your friend reads it' },
  { emoji: '📷', action: 'Taking a photo', input: 'Light hits the camera', process: 'Phone turns light into pixels', output: 'A picture appears in your gallery' },
  { emoji: '🔍', action: 'Searching the web', input: 'You type a question', process: 'A server finds matching pages', output: 'You see a list of results' },
]

export function FundamentalsWhatIsComputer({ onComplete }: { onComplete: () => void }) {
  const [seen, setSeen] = useState<Record<string, boolean>>({})
  const [exDone, setExDone] = useState(false)
  const allSeen = spots.every((s) => seen[s.id])

  const tap = (id: string) => {
    setSeen((prev) => ({ ...prev, [id]: true }))
  }

  return (
    <div className="lesson-panel fundamentals">
      <p className="lede fund-lede">
        You already use computers every day — phones, laptops, game consoles. They all do the{' '}
        <strong>same three things</strong>. Tap each <span className="fund-q-hint">?</span> on the diagram to
        find out what they are.
      </p>

      <div className="fund-diagram" role="img" aria-label="Input, processing chip, and output">
        <svg viewBox="0 0 100 56" className="fund-svg">
          <defs>
            <marker id="arrowhead-fund" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" className="fund-arrow-fill" />
            </marker>
          </defs>
          <motion.path
            d="M 22 28 H 38"
            className="fund-flow-line"
            strokeWidth="0.85"
            fill="none"
            markerEnd="url(#arrowhead-fund)"
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M 62 28 H 78"
            className="fund-flow-line"
            strokeWidth="0.85"
            fill="none"
            markerEnd="url(#arrowhead-fund)"
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          />
          <rect className="fund-cpu-box" x="38" y="18" width="24" height="20" rx="3" />
          <text x="50" y="31" textAnchor="middle" className="fund-cpu-label" fontSize="5.5" fontFamily="var(--mono)">
            Chip
          </text>
        </svg>

        {spots.map((s) => {
          const done = seen[s.id]
          return (
            <div key={s.id} className="fund-hotspot-wrap" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
              <button
                type="button"
                className={`fund-hotspot ${done ? 'seen' : ''}`}
                onClick={() => tap(s.id)}
                aria-expanded={done}
                aria-describedby={done ? `tip-${s.id}` : undefined}
              >
                <span className="fund-hotspot-mark">{done ? '✓' : '?'}</span>
              </button>

              <AnimatePresence>
                {done && (
                  <motion.div
                    id={`tip-${s.id}`}
                    role="tooltip"
                    className={`fund-tooltip is-${s.placement}`}
                    initial={{ opacity: 0, y: s.placement === 'below' ? -6 : 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="fund-tooltip-title">{s.label}</p>
                    <p className="fund-tooltip-body">{s.detail}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <p className="micro fund-hint-line">
        {allSeen ? 'Nice — you found all three.' : 'Tap every ? to reveal what each part does.'}
      </p>

      {allSeen && !exDone && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fund-examples-block">
          <p className="lede" style={{ marginTop: '1.25rem' }}>
            Here is the pattern in real life:
          </p>
          <div className="fund-examples">
            {EXAMPLES.map((ex) => (
              <div key={ex.action} className="fund-example-card">
                <span className="fund-example-emoji">{ex.emoji}</span>
                <strong>{ex.action}</strong>
                <span className="fund-example-flow">
                  {ex.input} → {ex.process} → {ex.output}
                </span>
              </div>
            ))}
          </div>
          <p className="micro" style={{ marginTop: '0.75rem' }}>
            Every computer — from a calculator to a supercomputer — follows this same loop: <strong>in → process → out</strong>.
          </p>
          <div className="lesson-actions">
            <button type="button" className="btn primary" onClick={() => setExDone(true)}>
              That makes sense
            </button>
          </div>
        </motion.div>
      )}

      {exDone && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="lede" style={{ marginTop: '1.25rem' }}>
            But <em>how</em> does the chip inside actually work? It starts with the simplest idea in all of computing: <strong>on</strong> and <strong>off</strong>.
          </p>
          <div className="lesson-actions">
            <button type="button" className="btn primary" onClick={onComplete}>
              Show me →
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
