import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Phase = 0 | 1 | 2

function matMul(m: number[][], v: [number, number]): [number, number] {
  return [
    m[0][0] * v[0] + m[0][1] * v[1],
    m[1][0] * v[0] + m[1][1] * v[1],
  ]
}

const GRID_SIZE = 160
const SCALE = 20 // pixels per unit

function toSvg(x: number, y: number): { svgX: number; svgY: number } {
  return { svgX: GRID_SIZE / 2 + x * SCALE, svgY: GRID_SIZE / 2 - y * SCALE }
}

interface ArrowProps {
  from: [number, number]
  to: [number, number]
  color: string
  label?: string
}

function Arrow({ from, to, color, label }: ArrowProps) {
  const f = toSvg(...from)
  const t = toSvg(...to)
  return (
    <g>
      <motion.line
        x1={f.svgX}
        y1={f.svgY}
        x2={t.svgX}
        y2={t.svgY}
        stroke={color}
        strokeWidth="2"
        animate={{ x2: t.svgX, y2: t.svgY }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />
      {label && (
        <text
          x={(f.svgX + t.svgX) / 2 + 4}
          y={(f.svgY + t.svgY) / 2 - 4}
          fill={color}
          fontSize="9"
        >
          {label}
        </text>
      )}
    </g>
  )
}

export function MathLinalg({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>(0)
  const [scale, setScale] = useState(1)
  const [matrixIdx, setMatrixIdx] = useState(0)
  const [phaseDone, setPhaseDone] = useState<Set<Phase>>(new Set())

  const v: [number, number] = [3, 2]
  const u: [number, number] = [1, 3]

  const scaledV: [number, number] = [v[0] * scale, v[1] * scale]
  const sumVU: [number, number] = [v[0] + u[0], v[1] + u[1]]

  const matrices: Array<{ label: string; m: number[][] }> = [
    { label: '[[2,0],[0,1]] — stretch x', m: [[2, 0], [0, 1]] },
    { label: '[[0,-1],[1,0]] — rotate 90°', m: [[0, -1], [1, 0]] },
  ]

  const currentMatrix = matrices[matrixIdx]
  const transformedV = matMul(currentMatrix.m, v)

  const markDone = (p: Phase) => setPhaseDone((prev) => new Set([...prev, p]))

  const isDone = phaseDone.size >= 3

  return (
    <div className="lesson-panel">
      <p className="lede">
        <strong>Linear algebra</strong> describes operations on vectors and matrices. It is the mathematics of scaling,
        rotation, and — crucially — the attention mechanism in transformers.
      </p>

      <div className="math-la-phase-nav">
        {([0, 1, 2] as Phase[]).map((p) => (
          <button
            key={p}
            type="button"
            className={`btn ${phase === p ? 'primary' : ''}`}
            onClick={() => setPhase(p)}
          >
            Phase {p + 1}
          </button>
        ))}
      </div>

      {phase === 0 && (
        <motion.div
          className="math-la-phase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="micro">Phase 1: Vectors and addition</h3>
          <div className="math-la-grid-wrap">
            <svg width={GRID_SIZE} height={GRID_SIZE} className="math-la-grid">
              {/* grid lines */}
              {[-3, -2, -1, 0, 1, 2, 3].map((i) => {
                const p = toSvg(i, 0).svgX
                const q = toSvg(0, i).svgY
                return (
                  <g key={i}>
                    <line x1={p} y1={0} x2={p} y2={GRID_SIZE} stroke="var(--border)" strokeWidth="0.5" />
                    <line x1={0} y1={q} x2={GRID_SIZE} y2={q} stroke="var(--border)" strokeWidth="0.5" />
                  </g>
                )
              })}
              {/* axes */}
              <line x1={0} y1={GRID_SIZE / 2} x2={GRID_SIZE} y2={GRID_SIZE / 2} stroke="var(--text-muted)" strokeWidth="1" />
              <line x1={GRID_SIZE / 2} y1={0} x2={GRID_SIZE / 2} y2={GRID_SIZE} stroke="var(--text-muted)" strokeWidth="1" />

              <Arrow from={[0, 0]} to={scaledV} color="var(--signal)" label={`v×${scale}`} />
              <Arrow from={[0, 0]} to={u} color="var(--success, #3ecf8e)" label="u" />
              <Arrow from={[0, 0]} to={sumVU} color="var(--warn, #f59e0b)" label="v+u" />
            </svg>
          </div>
          <label className="math-la-slider-row">
            <span className="micro">Scale v by: {scale}</span>
            <input type="range" min={-2} max={3} step={0.5} value={scale}
              onChange={(e) => setScale(Number(e.target.value))} className="math-mod-slider" />
          </label>
          <p className="micro">
            v = [3, 2] (signal). u = [1, 3] (green). v + u = [{sumVU[0]}, {sumVU[1]}] (orange — parallelogram rule).
          </p>
          <button type="button" className="btn primary" onClick={() => { markDone(0); setPhase(1) }}>
            Continue to matrix transforms
          </button>
        </motion.div>
      )}

      {phase === 1 && (
        <motion.div
          className="math-la-phase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="micro">Phase 2: Matrix transformations</h3>
          <div className="math-la-matrix-select">
            {matrices.map((mat, i) => (
              <button
                key={i}
                type="button"
                className={`btn ${matrixIdx === i ? 'primary' : ''}`}
                onClick={() => setMatrixIdx(i)}
              >
                {mat.label}
              </button>
            ))}
          </div>
          <div className="math-la-grid-wrap">
            <svg width={GRID_SIZE} height={GRID_SIZE} className="math-la-grid">
              {[-3, -2, -1, 0, 1, 2, 3].map((i) => {
                const px = toSvg(i, 0).svgX
                const py = toSvg(0, i).svgY
                return (
                  <g key={i}>
                    <line x1={px} y1={0} x2={px} y2={GRID_SIZE} stroke="var(--border)" strokeWidth="0.5" />
                    <line x1={0} y1={py} x2={GRID_SIZE} y2={py} stroke="var(--border)" strokeWidth="0.5" />
                  </g>
                )
              })}
              <line x1={0} y1={GRID_SIZE / 2} x2={GRID_SIZE} y2={GRID_SIZE / 2} stroke="var(--text-muted)" strokeWidth="1" />
              <line x1={GRID_SIZE / 2} y1={0} x2={GRID_SIZE / 2} y2={GRID_SIZE} stroke="var(--text-muted)" strokeWidth="1" />
              <Arrow from={[0, 0]} to={v} color="var(--text-muted)" label="v" />
              <Arrow from={[0, 0]} to={transformedV as [number, number]} color="var(--signal)" label="Mv" />
            </svg>
          </div>
          <p className="micro">
            v = [3, 2]. After {currentMatrix.label}: Mv = [{transformedV[0].toFixed(1)}, {transformedV[1].toFixed(1)}]
          </p>
          <button type="button" className="btn primary" onClick={() => { markDone(1); setPhase(2) }}>
            Continue to attention intuition
          </button>
        </motion.div>
      )}

      {phase === 2 && (
        <motion.div
          className="math-la-phase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="micro">Phase 3: Attention intuition</h3>
          <p className="micro">
            A 3-token sentence "The cat sat". Each token is represented as a 2D word vector (simplified from
            12,288 dimensions in GPT-4).
          </p>
          <div className="math-la-grid-wrap">
            <svg width={GRID_SIZE} height={GRID_SIZE} className="math-la-grid">
              {[-3, -2, -1, 0, 1, 2, 3].map((i) => {
                const px = toSvg(i, 0).svgX
                const py = toSvg(0, i).svgY
                return (
                  <g key={i}>
                    <line x1={px} y1={0} x2={px} y2={GRID_SIZE} stroke="var(--border)" strokeWidth="0.5" />
                    <line x1={0} y1={py} x2={GRID_SIZE} y2={py} stroke="var(--border)" strokeWidth="0.5" />
                  </g>
                )
              })}
              <line x1={0} y1={GRID_SIZE / 2} x2={GRID_SIZE} y2={GRID_SIZE / 2} stroke="var(--text-muted)" strokeWidth="1" />
              <line x1={GRID_SIZE / 2} y1={0} x2={GRID_SIZE / 2} y2={GRID_SIZE} stroke="var(--text-muted)" strokeWidth="1" />
              {/* "The" */}
              <Arrow from={[0, 0]} to={[2, 1]} color="#6366f1" label="The" />
              {/* "cat" */}
              <Arrow from={[0, 0]} to={[1, 3]} color="#3ecf8e" label="cat" />
              {/* "sat" */}
              <Arrow from={[0, 0]} to={[3, 2]} color="#f59e0b" label="sat" />
              {/* attention output: weighted average */}
              <Arrow from={[0, 0]} to={[2, 2]} color="var(--signal)" label="attention output" />
            </svg>
          </div>
          <p className="micro">
            The attention mechanism computes a weighted average of the word vectors. The output vector (signal)
            is positioned between the inputs — it has "attended to" all three tokens.
          </p>
          <div className="math-la-callout">
            <span className="micro">
              In a real transformer, those vectors are <strong>12,288 dimensions</strong> long. The math is
              identical — just bigger. Matrix multiplication, dot products, softmax. All linear algebra.
            </span>
          </div>
          <button type="button" className="btn primary" onClick={() => { markDone(2) }}>
            {phaseDone.has(2) ? 'Phase 3 noted ✓' : 'I see the connection to transformers'}
          </button>
        </motion.div>
      )}

      <ConnectionCard
        title="In a real transformer, those vectors are 12,288 dimensions long — the math is identical"
        body={
          <>
            Every forward pass in a large language model is a sequence of matrix multiplications. When you
            scale from 2D to 12,288D, the operations are the same — dot products measure alignment,
            softmax normalizes weights, and the output is a weighted blend. You just saw the skeleton of
            GPT-4's attention head.
          </>
        }
        appearsIn={['Layer 12 LLM chapter', 'GPU acceleration', 'neural network backpropagation']}
        hook="You have finished the mathematics chapter. The next chapter applies all of it to data structures and algorithms."
      />

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!isDone}>
          Finish Math chapter
        </button>
        {!isDone && (
          <span className="hint">
            Complete all 3 phases ({phaseDone.size}/3 done).
          </span>
        )}
      </div>
    </div>
  )
}
