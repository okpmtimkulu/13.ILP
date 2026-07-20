import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Props = { onComplete: () => void }

const HOST_A = { id: 'A', label: 'Host A', ip: '192.168.1.10', mac: 'AA:AA:AA:00:00:01', x: 70, y: 100 }
const HOST_B = { id: 'B', label: 'Host B', ip: '192.168.1.20', mac: 'BB:BB:BB:00:00:02', x: 330, y: 100 }
const HOST_C = { id: 'C', label: 'Host C', ip: '192.168.1.30', mac: 'CC:CC:CC:00:00:03', x: 200, y: 200 }
const HOSTS = [HOST_A, HOST_B, HOST_C]

type ArpEntry = { ip: string; mac: string }

type Phase =
  | 'idle'
  | 'broadcast-out'
  | 'broadcast-arrive'
  | 'reply-out'
  | 'reply-arrive'
  | 'done'

export function NetARP({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [arpTable, setArpTable] = useState<ArpEntry[]>([])
  const [arpResolved, setArpResolved] = useState(false)
  const [secondArp, setSecondArp] = useState(false)
  const [finished, setFinished] = useState(false)
  const timerRef = useRef<number | null>(null)

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => () => clearTimer(), [])

  const runArp = () => {
    if (phase !== 'idle' && phase !== 'done') return
    setPhase('broadcast-out')

    timerRef.current = window.setTimeout(() => {
      setPhase('broadcast-arrive')
      timerRef.current = window.setTimeout(() => {
        setPhase('reply-out')
        timerRef.current = window.setTimeout(() => {
          setPhase('reply-arrive')
          const entry = { ip: HOST_B.ip, mac: HOST_B.mac }
          setArpTable((prev) =>
            prev.some((e) => e.ip === entry.ip) ? prev : [...prev, entry]
          )
          timerRef.current = window.setTimeout(() => {
            setPhase('done')
            setArpResolved(true)
          }, 600)
        }, 600)
      }, 600)
    }, 600)
  }

  const runSecondArp = () => {
    if (phase !== 'done') return
    setPhase('broadcast-out')

    timerRef.current = window.setTimeout(() => {
      setPhase('broadcast-arrive')
      timerRef.current = window.setTimeout(() => {
        setPhase('reply-out')
        timerRef.current = window.setTimeout(() => {
          setPhase('reply-arrive')
          const entry = { ip: HOST_C.ip, mac: HOST_C.mac }
          setArpTable((prev) =>
            prev.some((e) => e.ip === entry.ip) ? prev : [...prev, entry]
          )
          timerRef.current = window.setTimeout(() => {
            setPhase('done')
            setSecondArp(true)
          }, 600)
        }, 600)
      }, 600)
    }, 600)
  }

  const canComplete = arpResolved && secondArp
  const isBroadcasting = phase === 'broadcast-out' || phase === 'broadcast-arrive'
  const isReplying = phase === 'reply-out' || phase === 'reply-arrive'
  const targetHost = secondArp || !arpResolved ? HOST_B : HOST_C

  const SVG_W = 400
  const SVG_H = 250

  return (
    <div className="lesson-panel">
      <p className="lede">
        When Host A knows Host B's <strong>IP address</strong> but not its <strong>MAC address</strong>,
        it sends an ARP (Address Resolution Protocol) request. The request is a <em>broadcast</em> —
        every host on the subnet hears it, but only the owner of that IP replies.
      </p>
      <p className="micro">Watch the ARP request broadcast and unicast reply. Resolve both hosts to continue.</p>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          width="100%"
          style={{ maxWidth: SVG_W }}
          role="img"
          aria-label="ARP request and reply animation"
        >
          <text x={SVG_W / 2} y={16} textAnchor="middle"
            fill="var(--text-muted, #888)" fontSize={10}>
            Subnet 192.168.1.0/24
          </text>

          <line x1={30} y1={70} x2={370} y2={70}
            stroke="var(--border, #475569)" strokeWidth={2} strokeDasharray="6 4" />
          <text x={SVG_W / 2} y={65} textAnchor="middle"
            fill="var(--text-muted, #888)" fontSize={9}>shared medium</text>

          {HOSTS.map((host) => {
            const isSrc = host.id === 'A'
            const isDstB = host.id === 'B' && !arpResolved
            const isDstC = host.id === 'C' && arpResolved && !secondArp
            const isTarget = isDstB || isDstC
            const isHighlighted =
              (isSrc && isBroadcasting) ||
              (isTarget && phase === 'reply-out') ||
              (isSrc && phase === 'reply-arrive')

            return (
              <g key={host.id}>
                <line x1={host.x} y1={70} x2={host.x} y2={host.y - 22}
                  stroke="var(--border, #475569)" strokeWidth={1} />
                <motion.rect
                  x={host.x - 36} y={host.y - 22}
                  width={72} height={56}
                  rx={8}
                  fill="var(--bg-elevated, #1e293b)"
                  stroke={isHighlighted
                    ? isBroadcasting ? '#f59e0b' : '#3ecf8e'
                    : 'var(--border, #475569)'}
                  strokeWidth={isHighlighted ? 2.5 : 1.2}
                  animate={{ scale: isHighlighted ? 1.05 : 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                />
                <text x={host.x} y={host.y - 4} textAnchor="middle"
                  fill="var(--text, #e2e8f0)" fontSize={11} fontWeight={700}
                  pointerEvents="none">{host.label}</text>
                <text x={host.x} y={host.y + 10} textAnchor="middle"
                  fill="var(--text-muted, #94a3b8)" fontSize={8} fontFamily="monospace"
                  pointerEvents="none">{host.ip}</text>
                <text x={host.x} y={host.y + 22} textAnchor="middle"
                  fill="var(--text-muted, #64748b)" fontSize={7} fontFamily="monospace"
                  pointerEvents="none">{host.mac.slice(-8)}</text>
              </g>
            )
          })}

          {isBroadcasting && (
            <>
              {[HOST_B, HOST_C].map((dst) => (
                <motion.circle
                  key={`bc-${dst.id}`}
                  r={5}
                  fill="#f59e0b"
                  initial={{ cx: HOST_A.x, cy: 70 }}
                  animate={{
                    cx: phase === 'broadcast-arrive' ? dst.x : (HOST_A.x + dst.x) / 2,
                    cy: 70,
                  }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              ))}
              <motion.text
                x={SVG_W / 2} y={SVG_H - 10}
                textAnchor="middle"
                fill="#f59e0b" fontSize={10} fontWeight={600}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ARP Request (broadcast): "Who has {targetHost.ip}? Tell {HOST_A.ip}"
              </motion.text>
            </>
          )}

          {isReplying && (() => {
            const replyFrom = !arpResolved ? HOST_B : HOST_C
            return (
              <>
                <motion.circle
                  r={5}
                  fill="#3ecf8e"
                  initial={{ cx: replyFrom.x, cy: 70 }}
                  animate={{
                    cx: phase === 'reply-arrive' ? HOST_A.x : (replyFrom.x + HOST_A.x) / 2,
                    cy: 70,
                  }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
                <motion.text
                  x={SVG_W / 2} y={SVG_H - 10}
                  textAnchor="middle"
                  fill="#3ecf8e" fontSize={10} fontWeight={600}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  ARP Reply (unicast): "{replyFrom.ip} is at {replyFrom.mac.slice(-8)}"
                </motion.text>
              </>
            )
          })()}

          {phase === 'done' && (
            <text x={SVG_W / 2} y={SVG_H - 10} textAnchor="middle"
              fill="var(--text-muted, #888)" fontSize={10}>
              ARP complete — MAC address cached in ARP table
            </text>
          )}
        </svg>
      </div>

      {arpTable.length > 0 && (
        <div className="lesson-instruction">
          <h3 style={{ margin: '0 0 0.25rem', fontSize: 13 }}>Host A's ARP Table</h3>
          <div style={{ fontFamily: 'monospace', fontSize: 12 }}>
            {arpTable.map((entry) => (
              <motion.div
                key={entry.ip}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                {entry.ip} → {entry.mac}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {arpResolved && !secondArp && phase === 'done' && (
          <motion.div
            className="lesson-instruction"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <p className="micro" style={{ margin: 0 }}>
              Host A now knows Host B's MAC. Next, resolve Host C to see the broadcast again —
              notice every host still receives the request, but only the target replies.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {canComplete && (
        <ConnectionCard
          title="IP meets MAC"
          body={
            <>
              ARP is the glue between Layer 3 (IP) and Layer 2 (MAC). Every time a host needs to send
              an IP packet on the local subnet, it first checks its ARP cache. If the mapping isn't there,
              it broadcasts an ARP request. The target responds with a unicast reply, and the cache is
              updated — until the entry expires and the process repeats.
            </>
          }
          appearsIn={['local network communication', 'ARP poisoning attacks', 'proxy ARP']}
          hook="ARP is the bridge between Layer 3 (IP) and Layer 2 (MAC) — without it, no local delivery."
        />
      )}

      <div className="lesson-actions">
        {!arpResolved && (
          <button
            type="button"
            className="btn primary"
            onClick={runArp}
            disabled={phase !== 'idle' && phase !== 'done'}
          >
            {phase === 'idle' ? `Resolve ${HOST_B.ip}` : 'Resolving…'}
          </button>
        )}
        {arpResolved && !secondArp && (
          <button
            type="button"
            className="btn primary"
            onClick={runSecondArp}
            disabled={phase !== 'done'}
          >
            {phase === 'done' ? `Resolve ${HOST_C.ip}` : 'Resolving…'}
          </button>
        )}
        {canComplete && (
          <button
            type="button"
            className="btn primary"
            disabled={finished}
            onClick={() => { setFinished(true); onComplete() }}
          >
            {finished ? 'Completed' : 'Mark complete'}
          </button>
        )}
        {!arpResolved && phase === 'idle' && (
          <span className="hint">Click Resolve to send an ARP broadcast for Host B's MAC address.</span>
        )}
      </div>
    </div>
  )
}
