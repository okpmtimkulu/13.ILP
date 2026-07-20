import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

type Props = { onComplete: () => void }

interface Host {
  id: string
  label: string
  mac: string
  vlan: number
  x: number
  y: number
  color: string
}

const HOSTS: Host[] = [
  { id: 'A', label: 'Host A', mac: 'AA:11', vlan: 10, x: 60, y: 40, color: '#6366f1' },
  { id: 'B', label: 'Host B', mac: 'BB:22', vlan: 10, x: 340, y: 40, color: '#6366f1' },
  { id: 'C', label: 'Host C', mac: 'CC:33', vlan: 20, x: 60, y: 220, color: '#10b981' },
  { id: 'D', label: 'Host D', mac: 'DD:44', vlan: 20, x: 340, y: 220, color: '#10b981' },
]

const SWITCH_POS = { x: 200, y: 130 }

type MacEntry = { mac: string; port: string }

type FrameAnim = {
  from: string
  to: string
  flooded: boolean
  step: 'sending' | 'received'
}

export function NetSwitching({ onComplete }: Props) {
  const [macTable, setMacTable] = useState<MacEntry[]>([])
  const [log, setLog] = useState<string[]>([])
  const [sending, setSending] = useState<string | null>(null)
  const [frameAnim, setFrameAnim] = useState<FrameAnim | null>(null)
  const [framesSent, setFramesSent] = useState(0)
  const [showVlan, setShowVlan] = useState(false)
  const [done, setDone] = useState(false)

  const sendFrame = (fromId: string, toId: string) => {
    if (sending) return
    const src = HOSTS.find((h) => h.id === fromId)!
    const dst = HOSTS.find((h) => h.id === toId)!
    setSending(fromId)

    const alreadyKnown = macTable.some((e) => e.mac === src.mac)
    const nextTable = alreadyKnown
      ? macTable
      : [...macTable, { mac: src.mac, port: `Fa0/${HOSTS.indexOf(src)}` }]

    const dstKnown = nextTable.some((e) => e.mac === dst.mac)
    const vlanBlocked = showVlan && src.vlan !== dst.vlan
    const flooded = !dstKnown && !vlanBlocked

    setMacTable(nextTable)

    const newLog: string[] = []
    if (!alreadyKnown) {
      newLog.push(`Switch learned ${src.mac} on port Fa0/${HOSTS.indexOf(src)}`)
    }

    if (vlanBlocked) {
      newLog.push(`Frame from ${src.label} blocked — ${dst.label} is on VLAN ${dst.vlan} (isolated)`)
    } else if (flooded) {
      newLog.push(`Destination ${dst.mac} unknown → flooding to all ports${showVlan ? ` in VLAN ${src.vlan}` : ''}`)
    } else {
      newLog.push(`Forwarding to ${dst.mac} on known port`)
    }

    setFrameAnim({ from: fromId, to: toId, flooded, step: 'sending' })

    setTimeout(() => {
      setFrameAnim({ from: fromId, to: toId, flooded, step: 'received' })
      setLog((prev) => [...newLog, ...prev].slice(0, 8))
      setFramesSent((n) => n + 1)
      setTimeout(() => {
        setSending(null)
        setFrameAnim(null)
      }, 600)
    }, 700)
  }

  const canComplete = framesSent >= 3 && showVlan

  return (
    <div className="lesson-panel">
      <p className="lede">
        A switch forwards frames by learning <strong>MAC addresses</strong>. It builds a table
        mapping each source MAC to a port. When the destination is unknown, it <em>floods</em> to
        every port. VLANs add isolation — traffic in one VLAN cannot reach another.
      </p>
      <p className="micro">Click a host to send a frame to another host. Send at least 3, then enable VLANs.</p>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <svg
          viewBox="0 0 400 260"
          width="100%"
          style={{ maxWidth: 400 }}
          role="img"
          aria-label="Switch with four connected hosts"
        >
          <rect x={SWITCH_POS.x - 30} y={SWITCH_POS.y - 16} width={60} height={32} rx={6}
            fill="var(--bg-elevated, #1e293b)" stroke="var(--border, #334155)" strokeWidth={1.5} />
          <text x={SWITCH_POS.x} y={SWITCH_POS.y + 4} textAnchor="middle"
            fill="var(--text, #e2e8f0)" fontSize={11} fontWeight={700}>Switch</text>

          {HOSTS.map((host) => {
            const isSource = frameAnim?.from === host.id && frameAnim.step === 'sending'
            const isDest = (frameAnim?.to === host.id || (frameAnim?.flooded && frameAnim?.from !== host.id)) && frameAnim?.step === 'received'

            return (
              <g key={host.id}>
                <line
                  x1={host.x} y1={host.y}
                  x2={SWITCH_POS.x} y2={SWITCH_POS.y}
                  stroke={showVlan ? host.color : 'var(--border, #475569)'}
                  strokeWidth={1.2}
                  opacity={0.5}
                />
                <motion.circle
                  cx={host.x} cy={host.y} r={22}
                  fill={showVlan ? host.color : 'var(--bg-elevated, #1e293b)'}
                  stroke={isSource ? '#f59e0b' : isDest ? '#3ecf8e' : showVlan ? host.color : 'var(--border, #475569)'}
                  strokeWidth={isSource || isDest ? 3 : 1.5}
                  opacity={showVlan ? 0.85 : 1}
                  animate={{ scale: isSource ? 1.1 : isDest ? 1.08 : 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                />
                <text x={host.x} y={host.y - 4} textAnchor="middle"
                  fill="#fff" fontSize={10} fontWeight={600} pointerEvents="none">
                  {host.label}
                </text>
                <text x={host.x} y={host.y + 8} textAnchor="middle"
                  fill="rgba(255,255,255,0.7)" fontSize={8} pointerEvents="none">
                  {host.mac}
                </text>
                {showVlan && (
                  <text x={host.x} y={host.y + 38} textAnchor="middle"
                    fill={host.color} fontSize={9} fontWeight={600}>
                    VLAN {host.vlan}
                  </text>
                )}
              </g>
            )
          })}

          {frameAnim?.step === 'sending' && (() => {
            const src = HOSTS.find((h) => h.id === frameAnim.from)!
            return (
              <motion.circle
                cx={src.x} cy={src.y} r={5}
                fill="#f59e0b"
                initial={{ cx: src.x, cy: src.y }}
                animate={{ cx: SWITCH_POS.x, cy: SWITCH_POS.y }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            )
          })()}
        </svg>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', margin: '0.5rem 0' }}>
        {HOSTS.flatMap((src) =>
          HOSTS.filter((dst) => dst.id !== src.id).map((dst) => (
            <button
              key={`${src.id}-${dst.id}`}
              type="button"
              className="btn ghost"
              style={{ fontSize: 12, padding: '0.2rem 0.5rem' }}
              disabled={sending !== null}
              onClick={() => sendFrame(src.id, dst.id)}
            >
              {src.id} → {dst.id}
            </button>
          ))
        )}
      </div>

      {macTable.length > 0 && (
        <div className="lesson-instruction" style={{ marginTop: '0.5rem' }}>
          <h3 style={{ margin: '0 0 0.25rem', fontSize: 13 }}>MAC Address Table</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {macTable.map((e) => (
              <span key={e.mac} className="micro" style={{ fontFamily: 'monospace' }}>
                {e.mac} → {e.port}
              </span>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {log.length > 0 && (
          <motion.div
            className="lesson-instruction"
            style={{ marginTop: '0.5rem', maxHeight: 120, overflow: 'auto' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 style={{ margin: '0 0 0.25rem', fontSize: 13 }}>Switch Log</h3>
            {log.map((entry, i) => (
              <motion.p
                key={`${entry}-${i}`}
                className="micro"
                style={{ margin: '0.1rem 0', opacity: i === 0 ? 1 : 0.6 }}
                initial={i === 0 ? { opacity: 0, x: -8 } : undefined}
                animate={{ opacity: i === 0 ? 1 : 0.6, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {entry}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '0.75rem 0' }}>
        <button
          type="button"
          className={`btn ${showVlan ? 'primary' : 'ghost'}`}
          onClick={() => setShowVlan(!showVlan)}
          disabled={framesSent < 2}
        >
          {showVlan ? 'VLANs enabled' : 'Enable VLANs'}
        </button>
        {framesSent < 2 && (
          <span className="hint" style={{ marginLeft: '0.5rem' }}>
            Send at least 2 frames first.
          </span>
        )}
      </div>

      {canComplete && (
        <ConnectionCard
          title="Switches learn, VLANs isolate"
          body={
            <>
              A switch starts knowing nothing. It learns by reading source MACs on incoming frames
              and recording which port they arrived on. Flooding handles the unknown; the MAC table
              handles the rest. VLANs partition a single physical switch into multiple logical
              broadcast domains — hosts on different VLANs cannot communicate without a router.
            </>
          }
          appearsIn={['enterprise networks', 'network segmentation', 'broadcast domain control']}
          hook="A switch without VLANs is one big broadcast domain. VLANs turn one switch into many."
        />
      )}

      <div className="lesson-actions">
        <button
          type="button"
          className="btn primary"
          disabled={!canComplete || done}
          onClick={() => { setDone(true); onComplete() }}
        >
          {done ? 'Completed' : 'Mark complete'}
        </button>
        {!canComplete && (
          <span className="hint">
            {framesSent < 3
              ? `Send ${3 - framesSent} more frame${3 - framesSent > 1 ? 's' : ''} and enable VLANs.`
              : 'Now enable VLANs to see traffic isolation.'}
          </span>
        )}
      </div>
    </div>
  )
}
