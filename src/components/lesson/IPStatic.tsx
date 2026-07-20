import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Props = { onComplete: () => void }

type StaticRoute = { dest: string; nextHop: string }

const SUBNETS = [
  { id: 'A', cidr: '10.0.1.0/24', label: 'Subnet A', x: 50, y: 100, color: '#61afef' },
  { id: 'B', cidr: '10.0.2.0/24', label: 'Subnet B', x: 360, y: 30, color: '#e5c07b' },
  { id: 'C', cidr: '10.0.3.0/24', label: 'Subnet C', x: 660, y: 100, color: '#e06c75' },
]

const ROUTER_NODES = [
  { id: 'R1', x: 220, y: 70, label: 'R1' },
  { id: 'R2', x: 510, y: 70, label: 'R2' },
]

const ROUTE_OPTIONS: { label: string; dest: string; nextHop: string; router: string }[] = [
  { label: '10.0.3.0/24 → R2 (10.0.12.2)', dest: '10.0.3.0/24', nextHop: '10.0.12.2', router: 'R1' },
  { label: '10.0.1.0/24 → R1 (10.0.12.1)', dest: '10.0.1.0/24', nextHop: '10.0.12.1', router: 'R2' },
  { label: '0.0.0.0/0 → R2 (default on R1)', dest: '0.0.0.0/0', nextHop: '10.0.12.2', router: 'R1' },
]

type PacketState = 'idle' | 'moving' | 'arrived' | 'dropped'

export function IPStatic({ onComplete }: Props) {
  const [addedRoutes, setAddedRoutes] = useState<Set<number>>(new Set())
  const [packetDest, setPacketDest] = useState<string | null>(null)
  const [packetState, setPacketState] = useState<PacketState>('idle')
  const [packetPos, setPacketPos] = useState({ x: 50, y: 100 })
  const [done, setDone] = useState(false)
  const animRef = useRef<number | null>(null)

  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current) }, [])

  const addRoute = (idx: number) => {
    setAddedRoutes((prev) => new Set(prev).add(idx))
  }

  const canReach = (dest: string): boolean => {
    if (dest === '10.0.2.0/24') return true
    if (dest === '10.0.3.0/24') return addedRoutes.has(0)
    if (dest === '10.0.1.0/24') return true
    return addedRoutes.has(2)
  }

  const sendPacket = (destCidr: string) => {
    setPacketDest(destCidr)
    const reachable = canReach(destCidr)
    setPacketState('moving')
    setPacketPos({ x: 50, y: 100 })

    const target = reachable
      ? SUBNETS.find((s) => s.cidr === destCidr) || SUBNETS[1]
      : ROUTER_NODES[0]

    const waypoints = reachable
      ? [
          { x: 50, y: 100 },
          { x: 220, y: 70 },
          ...(destCidr !== '10.0.1.0/24' ? [{ x: 510, y: 70 }] : []),
          { x: target.x, y: target.y },
        ]
      : [
          { x: 50, y: 100 },
          { x: 220, y: 70 },
        ]

    let step = 0
    const totalSteps = waypoints.length - 1
    let frame = 0
    const framesPerStep = 30

    const animate = () => {
      frame++
      const t = Math.min(frame / framesPerStep, 1)
      const eased = t * (2 - t)

      const from = waypoints[step]
      const to = waypoints[step + 1]
      setPacketPos({
        x: from.x + (to.x - from.x) * eased,
        y: from.y + (to.y - from.y) * eased,
      })

      if (t >= 1) {
        step++
        frame = 0
        if (step >= totalSteps) {
          setPacketState(reachable ? 'arrived' : 'dropped')
          return
        }
      }
      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)
  }

  return (
    <div className="lesson-panel">
      <p className="lede">
        Static routes are manually configured entries in a router's table. They're simple but don't adapt to changes.
        A <strong>default route</strong> (0.0.0.0/0) acts as the catch-all — "if no better match, send it here."
      </p>

      <div className="lesson-interactive">
        <div className="lesson-instruction">
          <p>Add static routes to R1 and R2, then send packets to see them travel — or get dropped.</p>
        </div>

        <svg
          viewBox="0 0 720 170"
          style={{ width: '100%', maxWidth: 720, display: 'block', margin: '0 auto' }}
          aria-label="Network with two routers and three subnets"
        >
          <line x1="110" y1="100" x2="200" y2="70" stroke="var(--border)" strokeWidth="2" />
          <line x1="240" y1="70" x2="490" y2="70" stroke="var(--border)" strokeWidth="2" strokeDasharray="6 3" />
          <line x1="530" y1="70" x2="620" y2="100" stroke="var(--border)" strokeWidth="2" />
          <line x1="300" y1="50" x2="360" y2="35" stroke="var(--border)" strokeWidth="1.5" />
          <line x1="430" y1="50" x2="360" y2="35" stroke="var(--border)" strokeWidth="1.5" />

          <text x="365" y="65" textAnchor="middle" fontSize="8" fill="var(--fg-muted, #888)">10.0.12.0/30</text>

          {SUBNETS.map((s) => (
            <g key={s.id}>
              <rect x={s.x - 40} y={s.y - 12} width="80" height="30" rx="5" fill={s.color} opacity={0.2} stroke={s.color} strokeOpacity={0.5} />
              <text x={s.x} y={s.y + 6} textAnchor="middle" fontSize="10" fontWeight="600" fill={s.color}>{s.label}</text>
              <text x={s.x} y={s.y + 22} textAnchor="middle" fontSize="8" fill="var(--fg-muted, #888)">{s.cidr}</text>
            </g>
          ))}

          {ROUTER_NODES.map((r) => (
            <g key={r.id}>
              <circle cx={r.x} cy={r.y} r="20" fill="var(--surface, #2c313a)" stroke="var(--border)" strokeWidth="2" />
              <text x={r.x} y={r.y + 5} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--fg)">{r.label}</text>
            </g>
          ))}

          {packetState !== 'idle' && (
            <motion.circle
              cx={packetPos.x}
              cy={packetPos.y}
              r="8"
              fill={packetState === 'dropped' ? '#e06c75' : '#3ecf8e'}
              opacity={0.9}
            />
          )}

          {packetState === 'dropped' && (
            <motion.text
              x={packetPos.x}
              y={packetPos.y - 14}
              textAnchor="middle"
              fontSize="10"
              fill="#e06c75"
              fontWeight="600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              DROPPED — no route!
            </motion.text>
          )}

          {packetState === 'arrived' && (
            <motion.text
              x={packetPos.x}
              y={packetPos.y - 14}
              textAnchor="middle"
              fontSize="10"
              fill="#3ecf8e"
              fontWeight="600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              DELIVERED ✓
            </motion.text>
          )}
        </svg>

        <div style={{ margin: '0.75rem 0' }}>
          <p className="micro" style={{ marginBottom: '0.5rem' }}><strong>Add static routes:</strong></p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {ROUTE_OPTIONS.map((r, i) => (
              <button
                key={i}
                type="button"
                className={`btn ${addedRoutes.has(i) ? 'ghost' : 'primary'}`}
                disabled={addedRoutes.has(i)}
                onClick={() => addRoute(i)}
                style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}
              >
                {addedRoutes.has(i) ? `✓ ${r.label}` : `+ ${r.label}`}
              </button>
            ))}
          </div>
        </div>

        <div style={{ margin: '0.75rem 0' }}>
          <p className="micro" style={{ marginBottom: '0.5rem' }}><strong>Send a packet from Subnet A to:</strong></p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {SUBNETS.filter((s) => s.id !== 'A').map((s) => (
              <button
                key={s.id}
                type="button"
                className="btn ghost"
                disabled={packetState === 'moving'}
                onClick={() => sendPacket(s.cidr)}
                style={{ fontSize: '0.75rem' }}
              >
                → {s.label} ({s.cidr})
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {packetState === 'dropped' && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ color: '#e06c75', fontSize: '0.85rem', textAlign: 'center' }}
            >
              R1 has no route to {packetDest}. Add a static route or a default route, then try again.
            </motion.p>
          )}
        </AnimatePresence>

        <ConnectionCard
          title="Telling routers where to send"
          body={
            <>
              Static routes give you full control: you specify exactly which next hop to use for each destination.
              They're ideal for small or stub networks where topology rarely changes. The default route (0.0.0.0/0) is
              every network's safety net — if no specific route matches, packets go to the default gateway.
            </>
          }
          appearsIn={['small networks', 'stub networks', 'default gateway']}
          hook="Static routes are manual directions. Default routes are 'if you don't know, send it here.'"
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
