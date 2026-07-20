import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

const HTML_SNIPPET = `<html>
  <body>
    <h1>Hello</h1>
    <p style="color:blue">
      World
    </p>
  </body>
</html>`

const PIPELINE_STAGES = [
  { id: 'parse-html', label: 'Parse HTML → DOM Tree', desc: 'Tokenise markup, build node tree' },
  { id: 'parse-css', label: 'Parse CSS → CSSOM', desc: 'Apply color:blue rule to <p>' },
  { id: 'render-tree', label: 'Combine → Render Tree', desc: 'Merge DOM + CSSOM, skip hidden nodes' },
  { id: 'layout', label: 'Layout', desc: 'Compute bounding boxes and positions' },
  { id: 'paint', label: 'Paint', desc: 'Fill pixels: black text, blue text' },
  { id: 'composite', label: 'Composite', desc: 'Layer all painted surfaces onto screen' },
] as const

type PipelineStageId = (typeof PIPELINE_STAGES)[number]['id']

type Mode = 'idle' | 'running' | 'done' | 'rerender'

export function WebRender({ onComplete }: { onComplete: () => void }) {
  const [mode, setMode] = useState<Mode>('idle')
  const [litStages, setLitStages] = useState<Set<PipelineStageId>>(new Set())
  const [pColor, setPColor] = useState<'blue' | 'red'>('blue')
  const [fullDone, setFullDone] = useState(false)
  const [rerenderDone, setRerenderDone] = useState(false)
  const timerRef = useRef<number | null>(null)

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => () => clearTimer(), [])

  const runFullPipeline = () => {
    setMode('running')
    setLitStages(new Set())
    setPColor('blue')

    PIPELINE_STAGES.forEach((s, i) => {
      timerRef.current = window.setTimeout(() => {
        setLitStages((prev) => new Set([...prev, s.id]))
        if (i === PIPELINE_STAGES.length - 1) {
          timerRef.current = window.setTimeout(() => {
            setMode('done')
            setFullDone(true)
          }, 500)
        }
      }, i * 700 + 300)
    })
  }

  const runRerender = () => {
    setMode('rerender')
    setLitStages((prev) => {
      const next = new Set(prev)
      next.delete('layout')
      next.delete('paint')
      next.delete('composite')
      return next
    })
    setPColor('blue')

    const rerenderStages: PipelineStageId[] = ['layout', 'paint', 'composite']
    rerenderStages.forEach((id, i) => {
      timerRef.current = window.setTimeout(() => {
        setLitStages((prev) => new Set([...prev, id]))
        if (i === rerenderStages.length - 1) {
          timerRef.current = window.setTimeout(() => {
            setPColor('red')
            setMode('done')
            setRerenderDone(true)
          }, 400)
        }
      }, i * 600 + 300)
    })
  }

  const isLit = (id: PipelineStageId) => litStages.has(id)
  const isRerenderedStage = (id: PipelineStageId) => mode === 'rerender' && (id === 'layout' || id === 'paint' || id === 'composite')

  const isDone = fullDone && rerenderDone

  return (
    <div className="lesson-panel">
      <p className="lede">
        Every time your browser receives HTML it runs a <strong>five-stage pipeline</strong> before anything appears on
        screen. Watch each stage light up as the tiny page is rendered.
      </p>

      <div className="web-render-layout">
        <div className="web-render-source">
          <span className="micro">HTML source</span>
          <pre className="web-render-html">{HTML_SNIPPET}</pre>
        </div>

        <div className="web-render-pipeline" role="list" aria-label="Render pipeline">
          {PIPELINE_STAGES.map((s) => {
            const lit = isLit(s.id)
            const relit = isRerenderedStage(s.id) && lit
            return (
              <motion.div
                key={s.id}
                className={`web-render-stage ${lit ? 'is-lit' : ''} ${relit ? 'is-relit' : ''}`}
                animate={{
                  scale: lit ? 1.03 : 1,
                  borderColor: relit
                    ? 'var(--signal)'
                    : lit
                    ? 'var(--success, #3ecf8e)'
                    : 'var(--border)',
                  opacity: lit ? 1 : 0.45,
                }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                role="listitem"
              >
                <span className="web-render-stage-label">{s.label}</span>
                <AnimatePresence>
                  {lit && (
                    <motion.span
                      className="web-render-stage-desc micro"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {s.desc}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        <div className="web-render-preview">
          <span className="micro">Result</span>
          <div className="web-render-canvas">
            {isLit('paint') && (
              <motion.div
                className="web-render-output"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="web-render-h1">Hello</h1>
                <p className="web-render-p" style={{ color: pColor }}>World</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <ConnectionCard
        title="React and every UI framework ultimately trigger this pipeline"
        body={
          <>
            When React re-renders a component it produces a new virtual DOM, diffs it, and then patches the real
            DOM. That patch triggers the browser's own pipeline — usually just Layout + Paint + Composite for a
            simple colour change, which is why changing colours is cheaper than changing layout.
          </>
        }
        appearsIn={['every web app built on React, Vue, or Angular', 'the repaint in Layer 12 LLM streaming', 'DevTools Performance tab']}
        hook="You have now seen all four layers of the web stack — DNS, HTTP, TLS, and rendering. Compilers are next."
      />

      <div className="lesson-actions">
        {mode === 'idle' && (
          <button type="button" className="btn primary" onClick={runFullPipeline}>
            Run render pipeline
          </button>
        )}
        {mode === 'running' && (
          <button type="button" className="btn primary" disabled>
            Rendering…
          </button>
        )}
        {mode === 'done' && !rerenderDone && (
          <>
            <button type="button" className="btn primary" onClick={runRerender}>
              Re-render &lt;p&gt; (blue → red)
            </button>
            <span className="hint">Watch: only Layout, Paint, and Composite re-run — not parse steps.</span>
          </>
        )}
        {mode === 'rerender' && (
          <button type="button" className="btn primary" disabled>
            Re-rendering…
          </button>
        )}
        {isDone && (
          <button type="button" className="btn primary" onClick={onComplete}>
            Finish Web chapter
          </button>
        )}
      </div>
    </div>
  )
}
