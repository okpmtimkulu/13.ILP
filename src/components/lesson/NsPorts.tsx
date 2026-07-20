import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Props = { onComplete: () => void }

const SERVICES = [
  { port: 22, name: 'SSH', color: '#10b981', desc: 'Secure Shell — encrypted remote terminal access. Replaces telnet (port 23) which sends plaintext.' },
  { port: 25, name: 'SMTP', color: '#f59e0b', desc: 'Simple Mail Transfer Protocol — used to send email between mail servers.' },
  { port: 53, name: 'DNS', color: '#8b5cf6', desc: 'Domain Name System — translates domain names to IP addresses. Uses both UDP and TCP.' },
  { port: 80, name: 'HTTP', color: '#3b82f6', desc: 'Hypertext Transfer Protocol — unencrypted web traffic. Being replaced by HTTPS everywhere.' },
  { port: 443, name: 'HTTPS', color: '#06b6d4', desc: 'HTTP over TLS — encrypted web traffic. The default for every modern website.' },
] as const

const SVG_W = 460
const SVG_H = 300
const SERVER_X = 300
const SERVER_W = 130
const CLIENT_X = 80
const DOOR_H = 40
const DOOR_GAP = 8
const DOOR_START_Y = 30

export function NsPorts({ onComplete }: Props) {
  const [selectedPort, setSelectedPort] = useState<number | null>(null)
  const [clientPort, setClientPort] = useState<number | null>(null)
  const [visitedPorts, setVisitedPorts] = useState<Set<number>>(() => new Set())
  const [done, setDone] = useState(false)

  const handleConnect = (port: number) => {
    const ephemeral = 49152 + Math.floor(Math.random() * 16383)
    setSelectedPort(port)
    setClientPort(ephemeral)
    setVisitedPorts((prev) => {
      const next = new Set(prev)
      next.add(port)
      return next
    })
  }

  const allVisited = visitedPorts.size === SERVICES.length
  const activeService = SERVICES.find((s) => s.port === selectedPort) ?? null

  return (
    <div className="lesson-interactive">
      <div className="lesson-instruction">
        <p>
          An IP address identifies a <strong>machine</strong>, but a machine runs many services.
          A <strong>port number</strong> (0–65535) identifies which service should receive the data.
          Together, an IP address and port form a <strong>socket</strong> — e.g. <code>93.184.216.34:443</code>.
        </p>
        <p>
          Well-known ports (0–1023) are reserved for standard services. The client uses an
          <strong> ephemeral port</strong> (49152–65535) chosen at random for the return traffic.
        </p>
      </div>

      <p className="micro" style={{ textAlign: 'center' }}>Click a service door on the server to connect.</p>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ maxWidth: SVG_W }} role="img" aria-label="Server ports as doors">
          {/* Client */}
          <rect x={CLIENT_X - 35} y={120} width={70} height={50} rx={8} fill="var(--surface-2, #1e293b)" stroke="var(--border, #334155)" strokeWidth={1.5} />
          <text x={CLIENT_X} y={140} textAnchor="middle" fill="var(--text, #e2e8f0)" fontSize={10} fontWeight={600}>Client</text>
          {clientPort && (
            <text x={CLIENT_X} y={158} textAnchor="middle" fill="var(--text-muted, #888)" fontSize={9}>
              :{clientPort}
            </text>
          )}

          {/* Server building */}
          <rect
            x={SERVER_X - SERVER_W / 2}
            y={DOOR_START_Y - 14}
            width={SERVER_W}
            height={SERVICES.length * (DOOR_H + DOOR_GAP) + 28}
            rx={8}
            fill="var(--surface-2, #1e293b)"
            stroke="var(--border, #334155)"
            strokeWidth={1.5}
          />
          <text x={SERVER_X} y={DOOR_START_Y} textAnchor="middle" fill="var(--text, #e2e8f0)" fontSize={10} fontWeight={700}>
            Server 93.184.216.34
          </text>

          {SERVICES.map((svc, i) => {
            const y = DOOR_START_Y + 14 + i * (DOOR_H + DOOR_GAP)
            const isActive = selectedPort === svc.port
            const isVisited = visitedPorts.has(svc.port)

            return (
              <g key={svc.port}>
                <motion.rect
                  x={SERVER_X - 50}
                  y={y}
                  width={100}
                  height={DOOR_H}
                  rx={6}
                  fill={isActive ? svc.color : isVisited ? `${svc.color}44` : 'var(--surface-3, #2d3748)'}
                  stroke={svc.color}
                  strokeWidth={isActive ? 2 : 1}
                  style={{ cursor: 'pointer' }}
                  animate={{ scale: isActive ? 1.04 : 1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleConnect(svc.port)}
                />
                <text
                  x={SERVER_X}
                  y={y + DOOR_H / 2 - 4}
                  textAnchor="middle"
                  fill={isActive ? '#fff' : 'var(--text, #e2e8f0)'}
                  fontSize={11}
                  fontWeight={700}
                  pointerEvents="none"
                >
                  {svc.name}
                </text>
                <text
                  x={SERVER_X}
                  y={y + DOOR_H / 2 + 10}
                  textAnchor="middle"
                  fill={isActive ? '#ffffffcc' : 'var(--text-muted, #888)'}
                  fontSize={9}
                  pointerEvents="none"
                >
                  port {svc.port}
                </text>
              </g>
            )
          })}

          {/* Connection line */}
          {selectedPort !== null && (
            <motion.line
              x1={CLIENT_X + 35}
              y1={145}
              x2={SERVER_X - 50}
              y2={DOOR_START_Y + 14 + SERVICES.findIndex((s) => s.port === selectedPort) * (DOOR_H + DOOR_GAP) + DOOR_H / 2}
              stroke={activeService?.color ?? '#6366f1'}
              strokeWidth={2}
              strokeDasharray="6 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              transition={{ duration: 0.4 }}
            />
          )}

          {/* Socket label */}
          {selectedPort !== null && clientPort !== null && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <rect x={CLIENT_X - 65} y={185} width={130} height={20} rx={4} fill="var(--surface-3, #2d3748)" />
              <text x={CLIENT_X} y={199} textAnchor="middle" fill="var(--text-muted, #888)" fontSize={9}>
                Socket: 10.0.0.5:{clientPort} → :{ selectedPort}
              </text>
            </motion.g>
          )}
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {activeService && (
          <motion.div
            key={activeService.port}
            className="lesson-instruction"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <p>
              <strong>Port {activeService.port} — {activeService.name}:</strong> {activeService.desc}
            </p>
            <p className="micro">
              Full socket: <code>10.0.0.5:{clientPort}</code> → <code>93.184.216.34:{activeService.port}</code>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="micro" style={{ textAlign: 'center' }}>
        Ports explored: {visitedPorts.size} / {SERVICES.length}
      </p>

      <ConnectionCard
        title="Doors on every machine"
        body={
          <>
            Every TCP or UDP segment carries a source and destination port. The OS uses the
            combination of protocol + source IP + source port + destination IP + destination port
            to route data to the correct application. Firewalls use port numbers to allow or block
            specific services.
          </>
        }
        appearsIn={['firewall rules', 'service configuration', 'network scanning']}
        hook="A port is how a single IP address can run dozens of services at once — each behind its own door."
      />

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
            Click every service port to continue ({SERVICES.length - visitedPorts.size} remaining).
          </span>
        )}
      </div>
    </div>
  )
}
