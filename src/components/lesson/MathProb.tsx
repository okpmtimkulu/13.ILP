import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

// Urn definitions: [red, blue]
const URNS = [
  { label: 'A', balls: { red: 3, blue: 2 } },
  { label: 'B', balls: { red: 1, blue: 4 } },
  { label: 'C', balls: { red: 2, blue: 2 } },
]

// P(red | urn A) = 3/5
// P(urn A | red) = P(red|A)*P(A) / (P(red|A)*P(A) + P(red|B)*P(B) + P(red|C)*P(C))
// = (3/5 * 1/3) / ((3/5 * 1/3) + (1/5 * 1/3) + (2/4 * 1/3))
// = (3/15) / (3/15 + 1/15 + 2.5/15)  ← using 1/2 for C
// Let's compute exactly:
const pRed = [3 / 5, 1 / 5, 2 / 4]
const pUrn = [1 / 3, 1 / 3, 1 / 3]
const totalRed = pRed.reduce((s, p, i) => s + p * pUrn[i], 0)
const pAGivenRed = (pRed[0] * pUrn[0]) / totalRed // ≈ 0.4615

type Q = 1 | 2 | 3

function fraction(num: number, den: number): string {
  return `${num}/${den}`
}

export function MathProb({ onComplete }: { onComplete: () => void }) {
  const [q1Answer, setQ1Answer] = useState('')
  const [q1Done, setQ1Done] = useState(false)
  const [q1Error, setQ1Error] = useState('')

  const [q2Num, setQ2Num] = useState('')
  const [q2Den, setQ2Den] = useState('')
  const [q2Done, setQ2Done] = useState(false)
  const [q2Error, setQ2Error] = useState('')

  const [q3Done, setQ3Done] = useState(false)

  const isDone = q1Done && q2Done && q3Done

  const checkQ1 = () => {
    if (q1Answer.trim() === '3/5' || q1Answer.trim() === '0.6') {
      setQ1Done(true)
      setQ1Error('')
    } else {
      setQ1Error('Hint: Urn A has 3 red and 2 blue balls. P(red) = red / total = 3/5.')
    }
  }

  const checkQ2 = () => {
    const numN = parseFloat(q2Num)
    const denN = parseFloat(q2Den)
    if (isNaN(numN) || isNaN(denN)) { setQ2Error('Enter numbers.'); return }
    const ratio = numN / denN
    if (Math.abs(ratio - pAGivenRed) < 0.02) {
      setQ2Done(true)
      setQ2Error('')
    } else {
      setQ2Error(`Not quite. Numerator = P(red|A)×P(A) = (3/5)×(1/3) ≈ 0.2. Denominator ≈ ${totalRed.toFixed(3)}.`)
    }
  }

  // Birthday problem: 4 buckets, 3 keys
  // P(no collision) = 4/4 × 3/4 × 2/4 = 24/64 = 3/8
  // P(at least one collision) = 1 - 3/8 = 5/8 ≈ 0.625
  const pNoCollision = (4 / 4) * (3 / 4) * (2 / 4)
  const pCollision = 1 - pNoCollision

  return (
    <div className="lesson-panel">
      <p className="lede">
        Probability quantifies uncertainty. Three problems — basic probability, Bayes' theorem, and the birthday
        problem — show up constantly in computer science.
      </p>

      <div className="math-prob-urns" aria-label="Three urns">
        {URNS.map((urn) => (
          <div key={urn.label} className="math-prob-urn">
            <span className="micro">Urn {urn.label}</span>
            <div className="math-prob-balls">
              {Array.from({ length: urn.balls.red }, (_, i) => (
                <motion.div key={`r${i}`} className="math-prob-ball math-prob-ball--red" title="red" />
              ))}
              {Array.from({ length: urn.balls.blue }, (_, i) => (
                <motion.div key={`b${i}`} className="math-prob-ball math-prob-ball--blue" title="blue" />
              ))}
            </div>
            <span className="micro">{urn.balls.red}R + {urn.balls.blue}B</span>
          </div>
        ))}
      </div>

      <div className="math-prob-questions">
        {/* Q1 */}
        <div className="math-prob-q">
          <h3 className="micro">Q1: Pick from Urn A. P(red) = ?</h3>
          <div className="math-prob-input-row">
            <input
              type="text"
              className="math-prob-input"
              value={q1Answer}
              onChange={(e) => setQ1Answer(e.target.value)}
              disabled={q1Done}
              placeholder="e.g. 3/5"
            />
            <button type="button" className="btn primary" onClick={checkQ1} disabled={q1Done}>
              Check
            </button>
          </div>
          {q1Error && <p className="micro math-prob-error">{q1Error}</p>}
          {q1Done && <p className="micro math-prob-success">✓ Correct: 3/5 = 0.6</p>}
        </div>

        {/* Q2 */}
        <div className="math-prob-q">
          <h3 className="micro">Q2: You drew a red ball. P(it came from Urn A)?</h3>
          <p className="micro">Bayes' theorem: P(A|red) = P(red|A)×P(A) / P(red)</p>
          <div className="math-prob-bayes-formula">
            <code>
              P(A|red) = <span className="math-prob-num">[numerator]</span> / <span className="math-prob-den">[denominator]</span>
            </code>
          </div>
          <div className="math-prob-input-row">
            <input
              type="text"
              className="math-prob-input"
              value={q2Num}
              onChange={(e) => setQ2Num(e.target.value)}
              disabled={q2Done}
              placeholder="numerator"
            />
            <span>/</span>
            <input
              type="text"
              className="math-prob-input"
              value={q2Den}
              onChange={(e) => setQ2Den(e.target.value)}
              disabled={q2Done}
              placeholder="denominator"
            />
            <button type="button" className="btn primary" onClick={checkQ2} disabled={q2Done}>
              Check
            </button>
          </div>
          {q2Error && <p className="micro math-prob-error">{q2Error}</p>}
          {q2Done && (
            <p className="micro math-prob-success">
              ✓ P(A|red) ≈ {pAGivenRed.toFixed(3)} — Urn A is most likely source of a red ball
            </p>
          )}
        </div>

        {/* Q3 */}
        <div className="math-prob-q">
          <h3 className="micro">Q3: Hash table with 4 buckets, 3 keys. P(collision)?</h3>
          <div className="math-prob-birthday">
            <p className="micro">Birthday problem approach:</p>
            <code className="math-prob-eq">
              P(no collision) = (4/4) × (3/4) × (2/4) = {pNoCollision.toFixed(4)}
            </code>
            <code className="math-prob-eq">
              P(collision) = 1 − {pNoCollision.toFixed(4)} ≈ <strong>{(pCollision * 100).toFixed(1)}%</strong>
            </code>
            <p className="micro">
              With only 4 buckets and 3 keys there is a {(pCollision * 100).toFixed(0)}% chance of at least one collision!
              This is why hash tables resize to keep load factor low.
            </p>
          </div>
          <button type="button" className="btn primary" onClick={() => setQ3Done(true)} disabled={q3Done}>
            {q3Done ? 'Understood ✓' : 'I understand this probability'}
          </button>
        </div>
      </div>

      <ConnectionCard
        title="Every O(1) hash table claim is actually a probability claim"
        body={
          <>
            On <em>average</em> O(1) — but only if the load factor is controlled. When load factor approaches 1,
            collision probability approaches 1, chains lengthen, and lookup degrades to O(n). Python dicts
            resize at 67% load for exactly this reason.
          </>
        }
        appearsIn={['DSA hash table step', 'database index analysis', 'security birthday attack on hashes']}
        hook="You can now reason about certainty and uncertainty with precision. Last step in this chapter: linear algebra — the language of transformers."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!isDone}>
          Continue to linear algebra
        </button>
        {!isDone && (
          <span className="hint">Answer all three questions to continue.</span>
        )}
      </div>
    </div>
  )
}
