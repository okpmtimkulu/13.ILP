import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Props = { onComplete: () => void }

type NatEntry = {
  privateIp: string
  privatePort: number
  publicPort: number
  dest: string
}

const HOSTS = [
  { ip: '192.168.1.10', label: 'Laptop', color: '#6366f1' },
  { ip: '192.168.1.20', label: 'Phone', color: '#10b981' },
  { ip: '192.168.1.30', label: 'Tablet', color: '#f59e0b' },
]

const DEST_SERVERS = [
  { ip: '93.184.216.34', label: 'example.com' },
  { ip: '142.250.80.46', label: 'google.com' },
]

const PUBLIC_IP = '203.0.113.1'

const SVG_W = 480
const SVG_H = 260
const PRIV_X = 60
const ROUTER_X = 240
const PUB_X = 420

export function NsNAT({ onComplete }: Props) {
  const [natTable, setNatTable] = useState<NatEntry[]>([])
  const [activeFlow, setActiveFlow] = useState<number | null>(null)
  const [done, setDone] = useState(false)

  const sendRequest = (hostIdx: number) => {
    const host = HOSTS[hostIdx]
    const dest = DEST_SERVERS[hostIdx % DEST_SERVERS.length]
    const srcPort = 50000 + hostIdx * 1000 + natTable.length
    const pubPort = 40000 + hostIdx * 100 + natTable.length

    const entry: NatEntry = {
      privateIp: host.ip,
      privatePort: srcPort,
      publicPort: pubPort,
      dest: dest.ip,
    }

    setNatTable((prev) => [...prev, entry])
    setActiveFlow(hostIdx)
  }

  const allSent = new Set(natTable.map((e) => e.privateIp)).size >= HOSTS.length

  return (
    <div className="lesson-interactive">
      <div className="lesson-instruction">
        <p>
          <strong>NAT</strong> (Network Address Translation) lets an entire private network share
          a single public IP address. The router rewrites the source address of outgoing packets
          (private → public) and reverses it for incoming responses.
        </p>
        <p>
          <strong>PAT</strong> (Port Address Translation), the most common form, distinguishes
          flows by assigning a unique public-side source port to each connection. This is how
          your home router lets every device browse the web simultaneously.
        </p>
      </div>

      <p className="micro" style={{ textAlign: 'center' }}>Click each device to send a request through NAT.</p>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ maxWidth: SVG_W }} role="img" aria-label="NAT / PAT translation">
          {/* Private zone */}
          <rect x={5} y={10} width={155} height={SVG_H - 20} rx={10} fill="var(--surface-2, #1e293b)" opacity={0.4} />
          <text x={82} y={28} textAnchor="middle" fill="var(--text-muted, #888)" fontSize={9} fontWeight={600}>Private Network</text>

          {HOSTS.map((h, i) => {
            const y = 50 + i * 65
            const hasSent = natTable.some((e) => e.privateIp === h.ip)
            return (
              <g key={h.ip}>
                <motion.rect
                  x={PRIV_X - 30} y={y} width={60} height={42} rx={7}
                  fill={hasSent ? `${h.color}33` : 'var(--surface-3, #2d3748)'}
                  stroke={h.color}
                  strokeWidth={hasSent ? 2 : 1}
                  style={{ cursor: hasSent ? 'default' : 'pointer' }}
                  whileHover={hasSent ? {} : { scale: 1.05 }}
                  onClick={() => !hasSent && sendRequest(i)}
                />
                <text x={PRIV_X} y={y + 16} textAnchor="middle" fill="var(--text, #e2e8f0)" fontSize={9} fontWeight={600} pointerEvents="none">{h.label}</text>
                <text x={PRIV_X} y={y + 30} textAnchor="middle" fill="var(--text-muted, #888)" fontSize={8} pointerEvents="none">{h.ip}</text>
              </g>
            )
          })}

          {/* Router */}
          <rect x={ROUTER_X - 40} y={80} width={80} height={80} rx={10} fill="var(--surface-2, #1e293b)" stroke="var(--signal, #6366f1)" strokeWidth={2} />
          <text x={ROUTER_X} y={108} textAnchor="middle" fill="var(--text, #e2e8f0)" fontSize={10} fontWeight={700}>Router</text>
          <text x={ROUTER_X} y={122} textAnchor="middle" fill="var(--text-muted, #888)" fontSize={8}>NAT / PAT</text>
          <text x={ROUTER_X} y={146} textAnchor="middle" fill="#6366f1" fontSize={8} fontWeight={600}>{PUBLIC_IP}</text>

          {/* Public zone */}
          <rect x={320} y={10} width={155} height={SVG_H - 20} rx={10} fill="var(--surface-2, #1e293b)" opacity={0.4} />
          <text x={397} y={28} textAnchor="middle" fill="var(--text-muted, #888)" fontSize={9} fontWeight={600}>Public Internet</text>

          {DEST_SERVERS.map((srv, i) => {
            const y = 70 + i * 80
            return (
              <g key={srv.ip}>
                <rect x={PUB_X - 35} y={y} width={70} height={42} rx={7} fill="var(--surface-3, #2d3748)" stroke="var(--border, #334155)" />
                <text x={PUB_X} y={y + 16} textAnchor="middle" fill="var(--text, #e2e8f0)" fontSize={9} fontWeight={600}>{srv.label}</text>
                <text x={PUB_X} y={y + 30} textAnchor="middle" fill="var(--text-muted, #888)" fontSize={8}>{srv.ip}</text>
              </g>
            )
          })}

          {/* Flow lines */}
          {natTable.map((entry, i) => {
            const hostIdx = HOSTS.findIndex((h) => h.ip === entry.privateIp)
            const destIdx = i % DEST_SERVERS.length
            const hostY = 50 + hostIdx * 65 + 21
            const destY = 70 + destIdx * 80 + 21
            const color = HOSTS[hostIdx].color

            return (
              <motion.g key={`flow-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ duration: 0.5 }}>
                <line x1={PRIV_X + 30} y1={hostY} x2={ROUTER_X - 40} y2={120} stroke={color} strokeWidth={1.5} strokeDasharray="4 3" />
                <line x1={ROUTER_X + 40} y1={120} x2={PUB_X - 35} y2={destY} stroke={color} strokeWidth={1.5} strokeDasharray="4 3" />
              </motion.g>
            )
          })}

          {/* Labels */}
          <text x={170} y={SVG_H - 8} textAnchor="middle" fill="var(--text-muted, #888)" fontSize={8}>
            src rewritten: private → public
          </text>
          <text x={350} y={SVG_H - 8} textAnchor="middle" fill="var(--text-muted, #888)" fontSize={8}>
            dst rewritten: public → private
          </text>
        </svg>
      </div>

      {natTable.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ margin: '1rem 0' }}>
          <p className="micro" style={{ fontWeight: 600, marginBottom: '0.5rem' }}>NAT Translation Table (PAT)</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border, #334155)' }}>
                  <th style={{ textAlign: 'left', padding: '4px 8px', color: 'var(--text-muted, #888)', fontWeight: 600 }}>Inside Local</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', color: 'var(--text-muted, #888)', fontWeight: 600 }}>Inside Global</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', color: 'var(--text-muted, #888)', fontWeight: 600 }}>Destination</th>
                </tr>
              </thead>
              <tbody>
                {natTable.map((entry, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ borderBottom: '1px solid var(--border, #33415544)' }}
                  >
                    <td style={{ padding: '4px 8px' }}><code>{entry.privateIp}:{entry.privatePort}</code></td>
                    <td style={{ padding: '4px 8px' }}><code>{PUBLIC_IP}:{entry.publicPort}</code></td>
                    <td style={{ padding: '4px 8px' }}><code>{entry.dest}:443</code></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="micro" style={{ marginTop: '0.5rem' }}>
            Each flow gets a unique public port — that's how the router knows which internal
            device should receive each response. This is PAT in action.
          </p>
        </motion.div>
      )}

      <ConnectionCard
        title="Many behind one"
        body={
          <>
            NAT was originally a stopgap for IPv4 address exhaustion, but it became permanent.
            Every home router performs PAT. The downside: devices behind NAT can't easily accept
            inbound connections (port forwarding or UPnP is needed). IPv6 aims to eliminate NAT
            by giving every device a globally routable address.
          </>
        }
        appearsIn={['home routers', 'corporate firewalls', 'IPv4 address conservation']}
        hook="NAT is why millions of home networks can all use 192.168.1.x — they all hide behind one public address."
      />

      <div className="lesson-actions">
        <button
          type="button"
          className="btn primary"
          disabled={!allSent || done}
          onClick={() => { setDone(true); onComplete() }}
        >
          {done ? 'Completed' : 'Mark complete'}
        </button>
        {!allSent && (
          <span className="hint">
            Click each private device to send a request ({HOSTS.length - new Set(natTable.map((e) => e.privateIp)).size} remaining).
          </span>
        )}
      </div>
    </div>
  )
}
