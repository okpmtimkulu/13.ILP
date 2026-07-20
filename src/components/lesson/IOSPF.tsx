import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Props = { onComplete: () => void }

type Phase = 'idle' | 'hello' | 'lsa' | 'spf' | 'converged' | 'failure' | 'reconverge'

const NODES = [
  { id: 'R1', x: 180, y: 60 },
  { id: 'R2', x: 540, y: 60 },
  { id: 'R3', x: 540, y: 220 },
  { id: 'R4', x: 180, y: 220 },
]

type Link = { from: string; to: string; cost: number; id: string }

const LINKS: Link[] = [
  { id: 'R1-R2', from: 'R1', to: 'R2', cost: 10 },
  { id: 'R2-R3', from: 'R2', to: 'R3', cost: 5 },
  { id: 'R3-R4', from: 'R3', to: 'R4', cost: 10 },
  { id: 'R1-R4', from: 'R1', to: 'R4', cost: 5 },
  { id: 'R1-R3', from: 'R1', to: 'R3', cost: 20 },
]

const PHASE_INFO: Record<Phase, { label: string; desc: string }> = {
  idle: { label: 'Ready', desc: 'Click "Start OSPF" to begin the neighbor discovery process.' },
  hello: { label: 'Hello Packets', desc: 'Each router sends Hello packets on all interfaces to discover neighbors. Routers that share a link and agree on parameters become OSPF neighbors.' },
  lsa: { label: 'LSA Exchange', desc: 'Neighbors exchange Link-State Advertisements (LSAs). Each router learns the full topology — every link and its cost. All routers build identical link-state databases.' },
  spf: { label: 'SPF Calculation', desc: 'Each router runs Dijkstra\'s Shortest Path First algorithm on the link-state database to compute the shortest path tree rooted at itself.' },
  converged: { label: 'Converged', desc: 'All routers have computed optimal paths. Routing tables are populated. The network is stable.' },
  failure: { label: 'Link Failure!', desc: 'The R1–R2 link has failed. R1 and R2 detect the loss (missed Hellos) and flood updated LSAs to all neighbors.' },
  reconverge: { label: 'Reconverged', desc: 'OSPF recalculated routes around the failure. Traffic from R1 to R2 now goes R1 → R4 → R3 → R2 (cost 20) instead of direct (cost 10).' },
}

function getNode(id: string) {
  return NODES.find((n) => n.id === id)!
}

export function IOSPF({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [helloProgress, setHelloProgress] = useState(0)
  const [lsaProgress, setLsaProgress] = useState(0)
  const [spfProgress, setSpfProgress] = useState(0)
  const [failedLink, setFailedLink] = useState<string | null>(null)
  const [spfPaths, setSpfPaths] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const timerRef = useRef<number | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => () => clearTimer(), [clearTimer])

  const runOSPF = () => {
    setPhase('hello')
    setHelloProgress(0)
    setLsaProgress(0)
    setSpfProgress(0)
    setFailedLink(null)
    setSpfPaths([])

    let step = 0
    const helloSteps = LINKS.length

    const advanceHello = () => {
      step++
      setHelloProgress(step)
      if (step < helloSteps) {
        timerRef.current = window.setTimeout(advanceHello, 500)
      } else {
        timerRef.current = window.setTimeout(startLSA, 600)
      }
    }

    const startLSA = () => {
      setPhase('lsa')
      let lStep = 0
      const advanceLSA = () => {
        lStep++
        setLsaProgress(lStep)
        if (lStep < NODES.length) {
          timerRef.current = window.setTimeout(advanceLSA, 500)
        } else {
          timerRef.current = window.setTimeout(startSPF, 600)
        }
      }
      timerRef.current = window.setTimeout(advanceLSA, 300)
    }

    const startSPF = () => {
      setPhase('spf')
      let sStep = 0
      const paths = ['R1-R4', 'R2-R3', 'R1-R2', 'R3-R4', 'R1-R3']
      const advanceSPF = () => {
        sStep++
        setSpfProgress(sStep)
        setSpfPaths(paths.slice(0, sStep))
        if (sStep < paths.length) {
          timerRef.current = window.setTimeout(advanceSPF, 400)
        } else {
          timerRef.current = window.setTimeout(() => setPhase('converged'), 800)
        }
      }
      timerRef.current = window.setTimeout(advanceSPF, 300)
    }

    timerRef.current = window.setTimeout(advanceHello, 400)
  }

  const simulateFailure = () => {
    clearTimer()
    setFailedLink('R1-R2')
    setPhase('failure')
    setSpfPaths([])

    timerRef.current = window.setTimeout(() => {
      setSpfPaths(['R1-R4', 'R3-R4', 'R2-R3', 'R1-R3'])
      setPhase('reconverge')
    }, 2000)
  }

  const info = PHASE_INFO[phase]

  return (
    <div className="lesson-panel">
      <p className="lede">
        OSPF (Open Shortest Path First) is a <strong>link-state</strong> routing protocol. Instead of just knowing
        neighbors (like distance-vector), every router builds a <strong>complete map</strong> of the network and
        computes the best paths using Dijkstra's algorithm. When a link fails, OSPF reconverges automatically.
      </p>

      <div className="lesson-interactive">
        <div className="lesson-instruction">
          <p>Watch OSPF discover neighbors, exchange topology data, compute shortest paths, and recover from failure.</p>
        </div>

        <svg
          viewBox="0 0 720 300"
          style={{ width: '100%', maxWidth: 720, display: 'block', margin: '0 auto' }}
          aria-label="OSPF network with four routers"
        >
          {LINKS.map((link, li) => {
            const n1 = getNode(link.from)
            const n2 = getNode(link.to)
            const isFailed = failedLink === link.id
            const isInSPF = spfPaths.includes(link.id)
            const helloActive = phase === 'hello' && li < helloProgress
            const mx = (n1.x + n2.x) / 2
            const my = (n1.y + n2.y) / 2

            return (
              <g key={link.id}>
                <motion.line
                  x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
                  stroke={
                    isFailed ? '#e06c75'
                    : isInSPF ? 'var(--signal, #61afef)'
                    : helloActive ? '#3ecf8e'
                    : 'var(--border)'
                  }
                  strokeWidth={isInSPF ? 3 : 2}
                  strokeDasharray={isFailed ? '6 4' : 'none'}
                  animate={{ opacity: isFailed ? 0.3 : 1 }}
                />
                {isFailed && (
                  <motion.text
                    x={mx} y={my - 10}
                    textAnchor="middle" fontSize="11" fill="#e06c75" fontWeight="700"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    ✕ LINK DOWN
                  </motion.text>
                )}
                {!isFailed && (
                  <text x={mx} y={my - 8} textAnchor="middle" fontSize="9" fill="var(--fg-muted, #888)">
                    cost {link.cost}
                  </text>
                )}

                {helloActive && !isFailed && phase === 'hello' && (
                  <motion.circle
                    cx={mx} cy={my}
                    r="4" fill="#3ecf8e"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 0] }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </g>
            )
          })}

          {NODES.map((node, ni) => {
            const lsaActive = phase === 'lsa' && ni < lsaProgress
            const isNeighborDiscovered = phase === 'hello' || phase === 'lsa' || phase === 'spf' || phase === 'converged' || phase === 'reconverge'

            return (
              <g key={node.id}>
                {lsaActive && (
                  <motion.circle
                    cx={node.x} cy={node.y} r="40"
                    fill="none" stroke="#e5c07b" strokeWidth="1.5"
                    initial={{ r: 20, opacity: 0.8 }}
                    animate={{ r: 50, opacity: 0 }}
                    transition={{ duration: 1, repeat: 1 }}
                  />
                )}

                <motion.circle
                  cx={node.x} cy={node.y} r="26"
                  fill={
                    phase === 'spf' || phase === 'converged' || phase === 'reconverge'
                      ? 'var(--signal, #61afef)'
                      : isNeighborDiscovered
                      ? '#3ecf8e'
                      : 'var(--surface, #2c313a)'
                  }
                  fillOpacity={0.2}
                  stroke={
                    phase === 'converged' || phase === 'reconverge'
                      ? 'var(--signal, #61afef)'
                      : isNeighborDiscovered
                      ? '#3ecf8e'
                      : 'var(--border)'
                  }
                  strokeWidth="2"
                  animate={{ scale: lsaActive ? [1, 1.08, 1] : 1 }}
                  transition={{ duration: 0.4 }}
                />
                <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--fg)">
                  {node.id}
                </text>
              </g>
            )
          })}
        </svg>

        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          style={{
            margin: '0.75rem 0',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--surface, #2c313a)',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong style={{ color: phase === 'failure' ? '#e06c75' : 'var(--signal, #61afef)' }}>
              {info.label}
            </strong>{' '}
            — {info.desc}
          </p>
        </motion.div>

        <AnimatePresence>
          {(phase === 'converged' || phase === 'reconverge') && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ margin: '0.5rem 0' }}
            >
              <p className="micro" style={{ textAlign: 'center' }}>
                <strong>R1's shortest paths:</strong>{' '}
                {phase === 'converged' && 'R1→R2 (cost 10) | R1→R4 (cost 5) | R1→R4→R3 (cost 15) '}
                {phase === 'reconverge' && 'R1→R4 (cost 5) | R1→R4→R3 (cost 15) | R1→R4→R3→R2 (cost 20) '}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', margin: '0.5rem 0' }}>
          {phase === 'idle' && (
            <button type="button" className="btn primary" onClick={runOSPF}>
              Start OSPF
            </button>
          )}
          {phase === 'converged' && (
            <button type="button" className="btn ghost" onClick={simulateFailure} style={{ color: '#e06c75' }}>
              Simulate R1–R2 link failure
            </button>
          )}
        </div>

        <ConnectionCard
          title="Routers that talk to each other"
          body={
            <>
              OSPF's three phases — <strong>Hello</strong> (discover neighbors), <strong>LSA flood</strong> (share
              topology), <strong>SPF calculation</strong> (compute best paths) — give every router a complete network
              map. When a link fails, only the changed LSAs flood, and SPF recalculates just the affected paths.
              Convergence typically takes under a second.
            </>
          }
          appearsIn={['enterprise networks', 'CCNA routing', 'network resilience']}
          hook="OSPF lets routers build a map of the network together and route around failures automatically."
        />

        <div className="lesson-actions">
          <button
            type="button"
            className="btn primary"
            disabled={done}
            onClick={() => { setDone(true); onComplete() }}
          >
            {done ? 'Completed' : 'Mark complete'}
          </button>
        </div>
      </div>
    </div>
  )
}
