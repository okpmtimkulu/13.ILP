import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

const SCENES = [
  {
    id: 0,
    title: 'Scene 1: The hypothesis',
    content: [
      'Suppose HaltChecker(P, I) exists.',
      'It takes a program P and an input I.',
      'It returns YES if P halts on input I.',
      'It returns NO if P loops forever on input I.',
      'This would solve one of the deepest questions in computing:',
      '"Will this program ever finish?"',
    ],
    diagram: 'HaltChecker(P, I) → YES / NO',
  },
  {
    id: 1,
    title: 'Scene 2: Build a diagonalizer',
    content: [
      'Using HaltChecker, construct a new program: Diagonal(P)',
      '',
      'Diagonal(P):',
      '  if HaltChecker(P, P) returns YES:',
      '    loop forever  ← Diagonal loops when HaltChecker says YES',
      '  if HaltChecker(P, P) returns NO:',
      '    halt immediately  ← Diagonal halts when HaltChecker says NO',
      '',
      'Diagonal is a perfectly valid program. It uses HaltChecker as a subroutine.',
    ],
    diagram: 'Diagonal(P) = opposite of HaltChecker(P, P)',
  },
  {
    id: 2,
    title: 'Scene 3: The self-referential trap',
    content: [
      'Now ask: what happens when we run Diagonal(Diagonal)?',
      '',
      'Case A: Diagonal(Diagonal) halts.',
      '  → HaltChecker(Diagonal, Diagonal) must have returned YES',
      '  → But Diagonal loops when HaltChecker says YES',
      '  → Contradiction.',
      '',
      'Case B: Diagonal(Diagonal) loops forever.',
      '  → HaltChecker(Diagonal, Diagonal) must have returned NO',
      '  → But Diagonal halts when HaltChecker says NO',
      '  → Contradiction.',
      '',
      'Both cases lead to contradiction.',
    ],
    diagram: 'Diagonal(Diagonal) → contradiction either way',
  },
  {
    id: 3,
    title: 'Scene 4: The conclusion',
    content: [
      'Therefore: HaltChecker cannot exist.',
      '',
      'This is not a limitation of our computers.',
      'It is not solved by more memory or faster CPUs.',
      'It is not an engineering problem.',
      '',
      'It is mathematically impossible.',
      'Some problems are not hard — they are impossible.',
      '',
      'Alan Turing proved this in 1936.',
      'Before the first programmable computer existed.',
    ],
    diagram: 'The Halting Problem is undecidable',
    quote: '"The halting problem is undecidable." — Alan Turing, 1936',
  },
]

export function DsaHalting({ onComplete }: { onComplete: () => void }) {
  const [sceneIdx, setSceneIdx] = useState(0)
  const [seenScenes, setSeenScenes] = useState<Set<number>>(new Set([0]))

  const goTo = (i: number) => {
    setSceneIdx(i)
    setSeenScenes((prev) => new Set([...prev, i]))
  }

  const next = () => {
    if (sceneIdx < SCENES.length - 1) goTo(sceneIdx + 1)
  }

  const scene = SCENES[sceneIdx]
  const isDone = seenScenes.size >= SCENES.length

  return (
    <div className="lesson-panel">
      <p className="lede">
        Some problems cannot be solved by any algorithm — not because we haven't found the right one, but because
        it is mathematically proven that no such algorithm can exist. This is the <strong>halting problem</strong>.
      </p>

      <div className="dsa-halt-scenes">
        <div className="dsa-halt-scene-nav" role="tablist">
          {SCENES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={sceneIdx === i}
              className={`dsa-halt-scene-tab ${sceneIdx === i ? 'is-active' : ''} ${seenScenes.has(i) ? 'is-seen' : ''}`}
              onClick={() => goTo(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={sceneIdx}
            className="dsa-halt-scene"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <h3 className="dsa-halt-scene-title">{scene.title}</h3>

            <div className="dsa-halt-diagram">
              <code>{scene.diagram}</code>
            </div>

            <div className="dsa-halt-content">
              {scene.content.map((line, i) => (
                <motion.p
                  key={i}
                  className={`dsa-halt-line ${line === '' ? 'dsa-halt-spacer' : ''}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, type: 'spring', stiffness: 320, damping: 22 }}
                >
                  {line || '\u00A0'}
                </motion.p>
              ))}
            </div>

            {scene.quote && (
              <motion.blockquote
                className="dsa-halt-quote"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: scene.content.length * 0.06 + 0.3 }}
              >
                {scene.quote}
              </motion.blockquote>
            )}

            {sceneIdx === SCENES.length - 1 && (
              <motion.div
                className="dsa-halt-turing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 320, damping: 22 }}
              >
                Alan Turing (1912–1954) invented the theoretical model of computation we still use today.
                The Turing machine. The Church-Turing thesis. The imitation game. Modern computing rests on his foundations.
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="dsa-halt-nav-btns">
          <button
            type="button"
            className="btn"
            onClick={() => goTo(sceneIdx - 1)}
            disabled={sceneIdx === 0}
          >
            ← Previous
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={next}
            disabled={sceneIdx === SCENES.length - 1}
          >
            Next scene →
          </button>
        </div>
      </div>

      <ConnectionCard
        title="Turing proved this before the first computer existed"
        body={
          <>
            The halting problem — and by extension Rice's theorem — tells us that no general algorithm can
            determine arbitrary properties of programs. This is why malware detection uses heuristics, why
            static analysis tools have false positives, and why formal verification is hard. The limits of
            computation are mathematical, not technological.
          </>
        }
        appearsIn={['formal verification tools', 'static analysis and linting limitations', 'compiler undecidability results']}
        hook="You have completed the DSA chapter — 16 steps from arrays to the theoretical limits of computing."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!isDone}>
          Finish DSA chapter
        </button>
        {!isDone && (
          <span className="hint">
            View all {SCENES.length} scenes ({seenScenes.size}/{SCENES.length} seen).
          </span>
        )}
      </div>
    </div>
  )
}
