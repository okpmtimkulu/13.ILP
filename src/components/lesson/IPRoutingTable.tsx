import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Props = { onComplete: () => void }

type Route = { dest: string; mask: number; nextHop: string; iface: string }

const ROUTERS: { id: string; label: string; x: number; y: number; routes: Route[] }[] = [
  {
    id: 'R1', label: 'R1', x: 360, y: 50,
    routes: [
      { dest: '10.0.1.0', mask: 24, nextHop: 'direct', iface: 'eth0' },
      { dest: '10.0.2.0', mask: 24, nextHop: '10.0.12.2', iface: 'eth1' },
      { dest: '10.0.3.0', mask: 24, nextHop: '10.0.13.3', iface: 'eth2' },
      { dest: '10.0.2.128', mask: 25, nextHop: '10.0.12.2', iface: 'eth1' },
      { dest: '0.0.0.0', mask: 0, nextHop: '10.0.13.3', iface: 'eth2' },
    ],
  },
  {
    id: 'R2', label: 'R2', x: 160, y: 260,
    routes: [
      { dest: '10.0.2.0', mask: 24, nextHop: 'direct', iface: 'eth0' },
      { dest: '10.0.1.0', mask: 24, nextHop: '10.0.12.1', iface: 'eth1' },
      { dest: '10.0.3.0', mask: 24, nextHop: '10.0.23.3', iface: 'eth2' },
      { dest: '0.0.0.0', mask: 0, nextHop: '10.0.12.1', iface: 'eth1' },
    ],
  },
  {
    id: 'R3', label: 'R3', x: 560, y: 260,
    routes: [
      { dest: '10.0.3.0', mask: 24, nextHop: 'direct', iface: 'eth0' },
      { dest: '10.0.1.0', mask: 24, nextHop: '10.0.13.1', iface: 'eth1' },
      { dest: '10.0.2.0', mask: 24, nextHop: '10.0.23.2', iface: 'eth2' },
      { dest: '0.0.0.0', mask: 0, nextHop: '10.0.13.1', iface: 'eth1' },
    ],
  },
]

const LINKS = [
  { from: 'R1', to: 'R2', label: '10.0.12.0/30' },
  { from: 'R1', to: 'R3', label: '10.0.13.0/30' },
  { from: 'R2', to: 'R3', label: '10.0.23.0/30' },
]

const TEST_DESTINATIONS = [
  { ip: '10.0.2.200', label: '10.0.2.200', router: 'R1', matchIdx: 3, desc: 'Matches /25 (longest prefix) → via R2' },
  { ip: '10.0.3.50', label: '10.0.3.50', router: 'R1', matchIdx: 2, desc: 'Matches 10.0.3.0/24 → via R3' },
  { ip: '172.16.5.1', label: '172.16.5.1', router: 'R1', matchIdx: 4, desc: 'No specific match → default route via R3' },
  { ip: '10.0.1.10', label: '10.0.1.10', router: 'R1', matchIdx: 0, desc: 'Directly connected on eth0' },
]

function ipMatchesCidr(ip: string, dest: string, mask: number): boolean {
  const toNum = (s: string) => s.split('.').reduce((a, b) => (a << 8) + Number(b), 0) >>> 0
  const m = mask === 0 ? 0 : (0xffffffff << (32 - mask)) >>> 0
  return (toNum(ip) & m) === (toNum(dest) & m)
}

export function IPRoutingTable({ onComplete }: Props) {
  const [selectedDest, setSelectedDest] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const [testedCount, setTestedCount] = useState(0)

  const handleSelect = (idx: number) => {
    setSelectedDest(idx)
    if (!TEST_DESTINATIONS.slice(0, testedCount + 1).some((_, i) => i === idx)) {
      setTestedCount((c) => Math.min(c + 1, TEST_DESTINATIONS.length))
    }
  }

  const active = selectedDest !== null ? TEST_DESTINATIONS[selectedDest] : null
  const activeRouter = active ? ROUTERS.find((r) => r.id === active.router) : null

  return (
    <div className="lesson-panel">
      <p className="lede">
        When a packet arrives, a router checks its <strong>routing table</strong> for the destination IP. If multiple
        routes match, it picks the one with the <strong>longest prefix</strong> (most specific mask). This is the
        fundamental forwarding decision in IP networking.
      </p>

      <div className="lesson-interactive">
        <div className="lesson-instruction">
          <p>Click a destination IP to see R1 perform a longest-prefix-match lookup.</p>
        </div>

        <svg
          viewBox="0 0 720 340"
          style={{ width: '100%', maxWidth: 720, display: 'block', margin: '0 auto' }}
          aria-label="Network with three routers in a triangle"
        >
          {LINKS.map((l) => {
            const r1 = ROUTERS.find((r) => r.id === l.from)!
            const r2 = ROUTERS.find((r) => r.id === l.to)!
            const mx = (r1.x + r2.x) / 2
            const my = (r1.y + r2.y) / 2
            return (
              <g key={`${l.from}-${l.to}`}>
                <line
                  x1={r1.x} y1={r1.y} x2={r2.x} y2={r2.y}
                  stroke="var(--border)" strokeWidth="2"
                />
                <text x={mx} y={my - 6} textAnchor="middle" fontSize="9" fill="var(--fg-muted, #888)">
                  {l.label}
                </text>
              </g>
            )
          })}

          {ROUTERS.map((r) => {
            const isActive = activeRouter?.id === r.id
            return (
              <g key={r.id}>
                <circle
                  cx={r.x} cy={r.y} r="28"
                  fill={isActive ? 'var(--signal, #61afef)' : 'var(--surface, #2c313a)'}
                  fillOpacity={isActive ? 0.25 : 0.8}
                  stroke={isActive ? 'var(--signal, #61afef)' : 'var(--border)'}
                  strokeWidth="2"
                />
                <text x={r.x} y={r.y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--fg)">
                  {r.label}
                </text>
              </g>
            )
          })}
        </svg>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', margin: '0.75rem 0' }}>
          {TEST_DESTINATIONS.map((d, i) => (
            <button
              key={i}
              type="button"
              className={`btn ${selectedDest === i ? 'primary' : 'ghost'}`}
              onClick={() => handleSelect(i)}
              style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
            >
              {d.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {active && activeRouter && (
            <motion.div
              key={selectedDest}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              style={{ margin: '0.5rem 0' }}
            >
              <p className="micro" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                <strong>{activeRouter.label} routing table</strong> — looking up <strong>{active.ip}</strong>
              </p>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ margin: '0 auto', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '0.25rem 0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>Destination</th>
                      <th style={{ padding: '0.25rem 0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>Next Hop</th>
                      <th style={{ padding: '0.25rem 0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>Interface</th>
                      <th style={{ padding: '0.25rem 0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>Match?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeRouter.routes.map((route, ri) => {
                      const matches = ipMatchesCidr(active.ip, route.dest, route.mask)
                      const isBest = ri === active.matchIdx
                      return (
                        <motion.tr
                          key={ri}
                          initial={{ backgroundColor: 'transparent' }}
                          animate={{
                            backgroundColor: isBest
                              ? 'rgba(97, 175, 239, 0.15)'
                              : matches
                              ? 'rgba(229, 192, 123, 0.08)'
                              : 'transparent',
                          }}
                          transition={{ delay: ri * 0.1 }}
                        >
                          <td style={{ padding: '0.25rem 0.75rem', fontFamily: 'monospace', borderBottom: '1px solid var(--border)' }}>
                            {route.dest}/{route.mask}
                          </td>
                          <td style={{ padding: '0.25rem 0.75rem', fontFamily: 'monospace', borderBottom: '1px solid var(--border)' }}>
                            {route.nextHop}
                          </td>
                          <td style={{ padding: '0.25rem 0.75rem', fontFamily: 'monospace', borderBottom: '1px solid var(--border)' }}>
                            {route.iface}
                          </td>
                          <td style={{ padding: '0.25rem 0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                            {isBest ? '★ Best' : matches ? '✓' : '✗'}
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.85rem' }}
              >
                {active.desc}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <ConnectionCard
          title="The forwarding decision"
          body={
            <>
              Every router on the internet makes this same decision for every packet: scan the table, find all matching
              prefixes, pick the longest (most specific) one, and forward out the associated interface. A /25 always
              beats a /24. A /0 default route is the catch-all of last resort.
            </>
          }
          appearsIn={['router configuration', 'network debugging', 'BGP operations']}
          hook="Every router makes the same decision for every packet: check the table, find the longest match, forward."
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
