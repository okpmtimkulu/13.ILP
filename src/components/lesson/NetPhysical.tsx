import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Props = { onComplete: () => void }

type CableType = 'cat5e' | 'cat6' | 'fiber-sm' | 'fiber-mm' | 'wireless'

interface CableSpec {
  id: CableType
  label: string
  maxDistance: string
  speed: string
  useCase: string
  color: string
  desc: string
}

const CABLES: CableSpec[] = [
  {
    id: 'cat5e', label: 'Cat5e (Copper)', maxDistance: '100 m', speed: '1 Gbps',
    useCase: 'Office LANs, desktop connections, home networks',
    color: '#3b82f6', desc: 'Twisted-pair copper cable with four pairs. Susceptible to EMI but cheap and easy to terminate.',
  },
  {
    id: 'cat6', label: 'Cat6 / Cat6a (Copper)', maxDistance: '55–100 m', speed: '10 Gbps',
    useCase: 'High-speed LANs, data center top-of-rack links',
    color: '#06b6d4', desc: 'Tighter twists and a center spline reduce crosstalk, enabling 10 Gbps over shorter runs.',
  },
  {
    id: 'fiber-sm', label: 'Single-Mode Fiber', maxDistance: '80+ km', speed: '100+ Gbps',
    useCase: 'WAN links, campus backbones, undersea cables',
    color: '#f59e0b', desc: 'A single narrow light path (9 µm core) carries one wavelength over enormous distances with minimal dispersion.',
  },
  {
    id: 'fiber-mm', label: 'Multi-Mode Fiber', maxDistance: '550 m', speed: '10–100 Gbps',
    useCase: 'Data center interconnects, short building runs',
    color: '#f97316', desc: 'A wider core (50 µm) allows multiple light modes. Cheaper transceivers, but modal dispersion limits distance.',
  },
  {
    id: 'wireless', label: 'Wireless (Wi-Fi / Radio)', maxDistance: '~70 m indoors', speed: 'Up to 9.6 Gbps (Wi-Fi 6)',
    useCase: 'End-user connectivity, IoT, mobile devices',
    color: '#8b5cf6', desc: 'Radio waves through air. Convenient but affected by interference, walls, and shared medium contention.',
  },
]

export function NetPhysical({ onComplete }: Props) {
  const [selected, setSelected] = useState<CableType | null>(null)
  const [visited, setVisited] = useState<Set<CableType>>(() => new Set())
  const [done, setDone] = useState(false)

  const handleSelect = (id: CableType) => {
    setSelected(id === selected ? null : id)
    setVisited((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const allVisited = visited.size === CABLES.length
  const active = CABLES.find((c) => c.id === selected)

  const SVG_W = 400
  const SVG_H = 260
  const COL_W = SVG_W / CABLES.length
  const BAR_W = 40
  const BAR_MAX = 180

  return (
    <div className="lesson-panel">
      <p className="lede">
        Layer 1 is where bits become <strong>physical signals</strong> — voltage on copper,
        light in glass, or radio through air. The cable you choose determines speed, distance,
        and cost.
      </p>
      <p className="micro">Click each cable type to compare specs. Visit all five to continue.</p>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          width="100%"
          style={{ maxWidth: SVG_W }}
          role="img"
          aria-label="Cable types comparison"
        >
          {CABLES.map((cable, i) => {
            const cx = COL_W * i + COL_W / 2
            const isSelected = selected === cable.id
            const isVisited = visited.has(cable.id)

            const distVal =
              cable.id === 'fiber-sm' ? BAR_MAX :
              cable.id === 'fiber-mm' ? BAR_MAX * 0.35 :
              cable.id === 'cat5e' ? BAR_MAX * 0.06 :
              cable.id === 'cat6' ? BAR_MAX * 0.06 :
              BAR_MAX * 0.04
            const barH = Math.max(distVal, 12)

            return (
              <g key={cable.id} style={{ cursor: 'pointer' }} onClick={() => handleSelect(cable.id)}>
                {cable.id.startsWith('fiber') ? (
                  <>
                    <line
                      x1={cx} y1={SVG_H - 45} x2={cx} y2={SVG_H - 45 - barH}
                      stroke={cable.color} strokeWidth={4} strokeLinecap="round"
                      opacity={isSelected ? 1 : 0.5}
                    />
                    <circle cx={cx} cy={SVG_H - 45 - barH - 6} r={5}
                      fill={cable.color} opacity={isSelected ? 1 : 0.6} />
                  </>
                ) : cable.id === 'wireless' ? (
                  <>
                    {[0, 1, 2].map((ring) => (
                      <motion.circle
                        key={ring}
                        cx={cx} cy={SVG_H - 45 - barH / 2}
                        r={10 + ring * 10}
                        fill="none"
                        stroke={cable.color}
                        strokeWidth={1.5}
                        opacity={isSelected ? 0.6 - ring * 0.15 : 0.25}
                        animate={isSelected ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 1.5, delay: ring * 0.3 }}
                      />
                    ))}
                    <circle cx={cx} cy={SVG_H - 45 - barH / 2} r={4}
                      fill={cable.color} opacity={isSelected ? 1 : 0.6} />
                  </>
                ) : (
                  <>
                    <rect
                      x={cx - BAR_W / 2} y={SVG_H - 45 - barH}
                      width={BAR_W} height={barH}
                      rx={4}
                      fill={cable.color}
                      opacity={isSelected ? 1 : isVisited ? 0.7 : 0.4}
                    />
                    {[0, 1, 2, 3].map((pair) => (
                      <line
                        key={pair}
                        x1={cx - BAR_W / 4 + pair * (BAR_W / 5)}
                        y1={SVG_H - 45 - barH + 4}
                        x2={cx - BAR_W / 4 + pair * (BAR_W / 5)}
                        y2={SVG_H - 49}
                        stroke="rgba(255,255,255,0.4)" strokeWidth={1}
                      />
                    ))}
                  </>
                )}

                <motion.rect
                  x={cx - COL_W / 2 + 4} y={0}
                  width={COL_W - 8} height={SVG_H}
                  rx={6} fill="transparent"
                  stroke={isSelected ? cable.color : 'transparent'}
                  strokeWidth={2}
                  strokeDasharray="4 3"
                />

                <text
                  x={cx} y={SVG_H - 24}
                  textAnchor="middle"
                  fill="var(--text, #ccc)"
                  fontSize={10}
                  fontWeight={isSelected ? 700 : 500}
                >
                  {cable.label.split('(')[0].trim()}
                </text>
                <text
                  x={cx} y={SVG_H - 10}
                  textAnchor="middle"
                  fill="var(--text-muted, #888)"
                  fontSize={9}
                >
                  {cable.maxDistance}
                </text>
              </g>
            )
          })}

          <text x={4} y={12} fill="var(--text-muted, #888)" fontSize={9}>
            ↑ relative max distance
          </text>
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            className="lesson-instruction"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <h3 style={{ margin: '0 0 0.25rem' }}>{active.label}</h3>
            <p style={{ margin: '0 0 0.5rem' }}>{active.desc}</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <span className="micro"><strong>Speed:</strong> {active.speed}</span>
              <span className="micro"><strong>Max distance:</strong> {active.maxDistance}</span>
            </div>
            <p className="micro" style={{ margin: '0.25rem 0 0' }}>
              <strong>Use case:</strong> {active.useCase}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="micro" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
        Cable types explored: {visited.size} / {CABLES.length}
      </p>

      {allVisited && (
        <ConnectionCard
          title="Copper, glass, and air"
          body={
            <>
              Every network starts with a physical choice: copper is cheap and familiar, fiber
              reaches across oceans, and wireless frees end devices from cables. The tradeoff is
              always between cost, distance, and speed — and that decision shapes every layer above.
            </>
          }
          appearsIn={['data center design', 'campus networks', 'WAN links']}
          hook="Choosing the right cable is the first physical decision in any network build."
        />
      )}

      <div className="lesson-actions">
        <button
          type="button"
          className="btn primary"
          disabled={!allVisited || done}
          onClick={() => { setDone(true); onComplete() }}
        >
          {done ? 'Completed' : 'Mark complete'}
        </button>
        {!allVisited && (
          <span className="hint">
            Explore all {CABLES.length} media types ({CABLES.length - visited.size} remaining).
          </span>
        )}
      </div>
    </div>
  )
}
