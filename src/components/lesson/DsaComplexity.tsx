import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

const TSP_TIMES: Record<number, string> = {
  5: '< 1 ms', 8: '< 1 ms', 10: '1 ms', 12: '10 ms',
  15: '200 ms', 18: '4 s', 20: '∞ (keep running…)',
}

const NP_EXAMPLES = [
  {
    id: 'sat',
    label: 'SAT (Boolean Satisfiability)',
    description: 'Given a boolean circuit, is there an assignment making it output TRUE?',
    class: 'NP-complete',
  },
  {
    id: 'vertex-cover',
    label: 'Vertex Cover',
    description: 'Can k nodes cover every edge in this graph?',
    class: 'NP-complete',
  },
  {
    id: 'subset-sum',
    label: 'Subset Sum',
    description: 'Does a subset of {1, 4, 7, 11} sum to exactly 12?',
    class: 'NP-complete',
  },
]

export function DsaComplexity({ onComplete }: { onComplete: () => void }) {
  const [tspN, setTspN] = useState(10)
  const [tspRunning, setTspRunning] = useState(false)
  const [tspStopped, setTspStopped] = useState(false)
  const [tspBlewUp, setTspBlewUp] = useState(false)
  const [classDiagramSeen, setClassDiagramSeen] = useState(false)
  const timerRef = useRef<number | null>(null)

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => () => clearTimer(), [])

  const runTSP = () => {
    if (tspN >= 18) {
      setTspRunning(true)
      setTspBlewUp(false)
      setTspStopped(false)
      timerRef.current = window.setTimeout(() => {
        setTspBlewUp(true)
        setTspRunning(false)
      }, 3000)
    } else {
      setTspRunning(true)
      timerRef.current = window.setTimeout(() => {
        setTspRunning(false)
      }, 400)
    }
  }

  const stopTSP = () => {
    clearTimer()
    setTspRunning(false)
    setTspStopped(true)
  }

  const isDone = tspBlewUp && classDiagramSeen

  return (
    <div className="lesson-panel">
      <p className="lede">
        Big-O tells you how a known algorithm scales. <strong>Complexity theory</strong> asks: is there any
        efficient algorithm for this problem at all?
      </p>

      <div className="dsa-comp-columns">
        <div className="dsa-comp-col">
          <h3 className="micro">Sorting (P — tractable)</h3>
          <div className="dsa-comp-sort-demo">
            <div className="dsa-comp-sort-bars">
              {[40, 10, 70, 30, 90, 20, 60, 50, 80].map((h, i) => (
                <div key={i} className="dsa-comp-sort-bar" style={{ height: `${h}%` }} />
              ))}
            </div>
            <p className="micro">Merge sort: n = 1,000 → &lt;1 ms ✓</p>
          </div>
        </div>

        <div className="dsa-comp-col">
          <h3 className="micro">TSP — Traveling Salesman (NP-hard)</h3>
          <div className="dsa-comp-tsp">
            <label className="micro">
              Cities: {tspN}
              <input
                type="range"
                min={5}
                max={20}
                value={tspN}
                onChange={(e) => {
                  setTspN(Number(e.target.value))
                  setTspRunning(false)
                  setTspBlewUp(false)
                  setTspStopped(false)
                  clearTimer()
                }}
                className="dsa-comp-slider"
              />
            </label>
            <div className="dsa-comp-tsp-time micro">
              Brute force: {TSP_TIMES[tspN] ?? `n! = ${tspN}! ops`}
            </div>
            <div className="dsa-comp-tsp-btns">
              <button type="button" className="btn primary" onClick={runTSP} disabled={tspRunning}>
                {tspRunning ? 'Running brute force…' : 'Run brute force'}
              </button>
              {tspRunning && (
                <button type="button" className="btn" onClick={stopTSP}>
                  Stop
                </button>
              )}
            </div>

            {tspBlewUp && (
              <motion.div
                className="dsa-comp-blowup"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                ⚠ Still running. n! routes to check. Age of universe won't suffice.
              </motion.div>
            )}
            {tspStopped && (
              <p className="micro">Stopped. This is why TSP is not solved exactly in practice.</p>
            )}
          </div>
        </div>
      </div>

      <div className="dsa-comp-class-diagram">
        <h3 className="micro">Complexity class hierarchy (click to reveal)</h3>
        <div className="dsa-comp-classes">
          <div className="dsa-comp-class dsa-comp-class--p">
            <strong>P</strong>
            <span className="micro">Problems solvable in polynomial time</span>
            <span className="micro">Sorting, shortest path, spanning tree</span>
          </div>
          <div className="dsa-comp-class dsa-comp-class--np">
            <strong>NP</strong>
            <span className="micro">Solutions verifiable in polynomial time</span>
            <div className="dsa-comp-np-examples">
              {NP_EXAMPLES.map((ex) => (
                <div key={ex.id} className="dsa-comp-np-example">
                  <strong className="micro">{ex.label}</strong>
                  <span className="micro">{ex.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dsa-comp-pnp-note">
          <p className="micro">
            <strong>We believe P ≠ NP.</strong> We cannot prove it. A $1,000,000 Millennium Prize remains
            unclaimed. If P = NP, every NP problem (including cracking encryption) would be solvable in
            polynomial time.
          </p>
        </div>

        <button
          type="button"
          className="btn primary"
          onClick={() => setClassDiagramSeen(true)}
          disabled={classDiagramSeen}
        >
          {classDiagramSeen ? 'Class diagram noted ✓' : 'I understand the P/NP distinction'}
        </button>
      </div>

      <ConnectionCard
        title="P vs NP is the most important open problem in computer science"
        body={
          <>
            If someone proved P = NP, every public-key cryptography system (RSA, ECDSA, TLS) would be broken.
            Every digital signature, every HTTPS connection, every password-hashed database would be vulnerable.
            The fact that we use these systems safely rests on a conjecture, not a proof.
          </>
        }
        appearsIn={['security chapter public-key cryptography', 'the next lesson: halting problem', 'every algorithm design decision']}
        hook="Some problems are merely hard. The next problem is provably impossible — regardless of how much compute you have."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!isDone}>
          Continue to the halting problem
        </button>
        {!isDone && (
          <span className="hint">
            {!tspBlewUp ? 'Run TSP with n ≥ 18 to watch it blow up. ' : ''}
            {!classDiagramSeen ? 'Acknowledge the complexity class diagram. ' : ''}
          </span>
        )}
      </div>
    </div>
  )
}
